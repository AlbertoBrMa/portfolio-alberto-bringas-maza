#!/usr/bin/env node
// Pulls portfolio content (profile + projects) and their images/files from the
// private CMS repo at build time. Requires CMS_REPO_TOKEN (fine-grained PAT,
// "Contents: Read-only" on that repo).

import { writeFile, mkdir, rm, readFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'

const {
  CMS_REPO_TOKEN,
  CMS_REPO_OWNER = 'AlbertoBrMa',
  CMS_REPO_NAME = 'portfolio-cms',
  CMS_REPO_BRANCH = 'main',
} = process.env

const API_ROOT = `https://api.github.com/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}/contents`

const PROJECTS_DATA_FILE = path.resolve('src/data/projects.generated.json')
const PROJECTS_IMAGES_DIR = path.resolve('public/projects')

const PROFILE_DATA_FILE = path.resolve('src/data/profile.generated.json')
const PROFILE_ASSETS_DIR = path.resolve('public/profile')

const MANIFEST_FILE = path.resolve('public/.fetch-manifest.json')

// Todo lo generado (public/projects, public/profile, src/data/*.generated.json)
// vive en .gitignore: el repo CMS privado es la única fuente de verdad y nunca
// se commitea en el repo público.
if (!CMS_REPO_TOKEN) {
  await ensureFallback(PROJECTS_DATA_FILE, '[]\n')
  await ensureFallback(PROFILE_DATA_FILE, '{}\n')
  console.warn(
    '[fetch-content] CMS_REPO_TOKEN no está definido: se omite la descarga.\n' +
      '  - En local: exporta CMS_REPO_TOKEN con un PAT de lectura sobre el repo CMS.\n' +
      '  - En CI: comprueba que el secret CMS_REPO_TOKEN esté configurado en el repo público.',
  )
  process.exit(0)
}

async function ensureFallback(file, fallbackContent) {
  const exists = await access(file).then(() => true).catch(() => false)
  if (exists) {
    console.warn(`[fetch-content] Se conserva ${path.relative(process.cwd(), file)} (de una ejecución anterior).`)
    return
  }
  console.warn(`[fetch-content] No hay datos previos, se genera ${path.relative(process.cwd(), file)} vacío.`)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, fallbackContent)
}

async function githubRequest(relativePath, { raw = false } = {}) {
  const url = `${API_ROOT}/${relativePath}?ref=${CMS_REPO_BRANCH}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CMS_REPO_TOKEN}`,
      Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status} en "${relativePath}": ${body}`)
  }

  return raw ? res.arrayBuffer() : res.json()
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

// Descarga de forma incremental (comparando SHA) los archivos de una carpeta
// del CMS a un directorio local. Devuelve un mapa nombre de archivo -> ruta pública.
async function syncAssets(cmsDir, localDir, publicPrefix, manifest, keepKeys) {
  let entries = []
  try {
    entries = await githubRequest(cmsDir)
  } catch {
    entries = []
  }

  const files = entries.filter((e) => e.type === 'file')
  if (files.length > 0) await mkdir(localDir, { recursive: true })

  const publicPathByName = {}
  for (const file of files) {
    const manifestKey = `${cmsDir}/${file.name}`
    const localFile = path.join(localDir, file.name)
    const alreadyLocal = await access(localFile).then(() => true).catch(() => false)
    keepKeys.add(manifestKey)

    if (alreadyLocal && manifest[manifestKey] === file.sha) {
      console.log(`   sin cambios, se reutiliza: ${file.name}`)
    } else {
      const buffer = await githubRequest(`${cmsDir}/${file.name}`, { raw: true })
      await writeFile(localFile, Buffer.from(buffer))
      manifest[manifestKey] = file.sha
      console.log(`   descargado: ${file.name}`)
    }
    publicPathByName[file.name] = `${publicPrefix}/${file.name}`
  }

  return publicPathByName
}

async function pruneStaleFiles(localDir, keepNames) {
  const existing = await readdir(localDir).catch(() => [])
  for (const name of existing) {
    if (!keepNames.has(name)) {
      await rm(path.join(localDir, name), { force: true })
      console.log(`   ya no está en el CMS, se borra local: ${name}`)
    }
  }
}

async function syncProjects(manifest, keepKeys) {
  console.log('[fetch-content] Sincronizando proyectos...')

  const projectDirs = await githubRequest('projects')
  if (!Array.isArray(projectDirs)) {
    throw new Error('Se esperaba el directorio "projects" en el repo CMS, revisa la estructura.')
  }

  const slugs = projectDirs.filter((e) => e.type === 'dir').map((e) => e.name)
  const projects = []

  for (const slug of slugs) {
    console.log(` -> ${slug}`)
    const dataBuffer = await githubRequest(`projects/${slug}/data.json`, { raw: true })
    const projectData = JSON.parse(Buffer.from(dataBuffer).toString('utf-8'))

    const localImageDir = path.join(PROJECTS_IMAGES_DIR, slug)
    const publicPathByName = await syncAssets(
      `projects/${slug}/images`,
      localImageDir,
      `/projects/${slug}`,
      manifest,
      keepKeys,
    )
    await pruneStaleFiles(localImageDir, new Set(Object.keys(publicPathByName)))

    if (projectData.preview) {
      projectData.preview = publicPathByName[projectData.preview] ?? projectData.preview
    }
    if (Array.isArray(projectData.screenshots)) {
      projectData.screenshots = projectData.screenshots.map((shot) => ({
        ...shot,
        src: publicPathByName[shot.src] ?? shot.src,
      }))
    }

    projects.push({ slug, ...projectData })
  }

  // Proyectos eliminados del CMS: borrar su carpeta local de imágenes.
  const currentDirs = await readdir(PROJECTS_IMAGES_DIR, { withFileTypes: true }).catch(() => [])
  for (const dirent of currentDirs) {
    if (dirent.isDirectory() && !slugs.includes(dirent.name)) {
      await rm(path.join(PROJECTS_IMAGES_DIR, dirent.name), { recursive: true, force: true })
      console.log(`   proyecto eliminado del CMS, se borra local: ${dirent.name}`)
    }
  }

  await mkdir(path.dirname(PROJECTS_DATA_FILE), { recursive: true })
  await writeFile(PROJECTS_DATA_FILE, JSON.stringify(projects, null, 2))
  console.log(`[fetch-content] ${projects.length} proyecto(s) escritos en ${path.relative(process.cwd(), PROJECTS_DATA_FILE)}`)
}

async function syncProfile(manifest, keepKeys) {
  console.log('[fetch-content] Sincronizando perfil...')

  const dataBuffer = await githubRequest('profile/data.json', { raw: true })
  const profileData = JSON.parse(Buffer.from(dataBuffer).toString('utf-8'))

  const publicPathByName = await syncAssets('profile/assets', PROFILE_ASSETS_DIR, '/profile', manifest, keepKeys)
  await pruneStaleFiles(PROFILE_ASSETS_DIR, new Set(Object.keys(publicPathByName)))

  if (profileData.heroPhoto) {
    profileData.heroPhoto = publicPathByName[profileData.heroPhoto] ?? profileData.heroPhoto
  }
  if (profileData.cv) {
    profileData.cv = publicPathByName[profileData.cv] ?? profileData.cv
  }

  await mkdir(path.dirname(PROFILE_DATA_FILE), { recursive: true })
  await writeFile(PROFILE_DATA_FILE, JSON.stringify(profileData, null, 2))
  console.log(`[fetch-content] Perfil escrito en ${path.relative(process.cwd(), PROFILE_DATA_FILE)}`)
}

async function main() {
  console.log(`[fetch-content] Conectando a ${CMS_REPO_OWNER}/${CMS_REPO_NAME}#${CMS_REPO_BRANCH}...`)

  const manifest = await loadManifest()
  const keepKeys = new Set()

  await syncProjects(manifest, keepKeys)
  await syncProfile(manifest, keepKeys)

  for (const key of Object.keys(manifest)) {
    if (!keepKeys.has(key)) delete manifest[key]
  }
  await mkdir(path.dirname(MANIFEST_FILE), { recursive: true })
  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2))
}

main().catch((err) => {
  console.error('[fetch-content] Error:', err.message)
  process.exit(1)
})
