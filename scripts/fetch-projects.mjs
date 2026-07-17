#!/usr/bin/env node
// Pulls project data + images from the private CMS repo at build time.
// Requires CMS_REPO_TOKEN (fine-grained PAT, "Contents: Read-only" on that repo).

import { writeFile, mkdir, rm, readFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'

const {
  CMS_REPO_TOKEN,
  CMS_REPO_OWNER = 'AlbertoBrMa',
  CMS_REPO_NAME = 'portfolio-cms',
  CMS_REPO_BRANCH = 'main',
} = process.env

const PROJECTS_PATH = 'projects'
const API_ROOT = `https://api.github.com/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}/contents`

const OUTPUT_DATA_FILE = path.resolve('src/data/projects.generated.json')
const OUTPUT_IMAGES_DIR = path.resolve('public/projects')
// SHA de cada imagen ya descargada, para no volver a bajar lo que no ha cambiado.
// Vive junto a las imágenes (mismo .gitignore) y se restaura vía actions/cache en CI.
const MANIFEST_FILE = path.join(OUTPUT_IMAGES_DIR, '.fetch-manifest.json')

// projects.generated.json y public/projects/ están en .gitignore: el repo CMS
// privado es la única fuente de verdad y nunca se commitean al repo público.
if (!CMS_REPO_TOKEN) {
  const fileExists = await access(OUTPUT_DATA_FILE).then(() => true).catch(() => false)

  if (fileExists) {
    console.warn(
      '[fetch-projects] CMS_REPO_TOKEN no está definido: se omite la descarga y se conserva ' +
        'el projects.generated.json ya presente en disco (de una ejecución anterior).',
    )
  } else {
    console.warn(
      '[fetch-projects] CMS_REPO_TOKEN no está definido y no hay datos previos: se genera ' +
        'una lista de proyectos vacía para que el build no falle.',
    )
    await mkdir(path.dirname(OUTPUT_DATA_FILE), { recursive: true })
    await writeFile(OUTPUT_DATA_FILE, '[]\n')
  }

  console.warn(
    '  - En local: exporta CMS_REPO_TOKEN con un PAT de lectura sobre el repo CMS para obtener los datos reales.\n' +
      '  - En CI: comprueba que el secret CMS_REPO_TOKEN esté configurado en el repo público.',
  )
  process.exit(0)
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

async function fetchProject(slug, manifest, keepFiles) {
  console.log(`[fetch-projects] -> ${slug}`)

  const dataBuffer = await githubRequest(`${PROJECTS_PATH}/${slug}/data.json`, { raw: true })
  const projectData = JSON.parse(Buffer.from(dataBuffer).toString('utf-8'))

  let imageEntries = []
  try {
    imageEntries = await githubRequest(`${PROJECTS_PATH}/${slug}/images`)
  } catch {
    imageEntries = []
  }

  const imageFiles = imageEntries.filter((entry) => entry.type === 'file')
  const localImageDir = path.join(OUTPUT_IMAGES_DIR, slug)
  if (imageFiles.length > 0) {
    await mkdir(localImageDir, { recursive: true })
  }

  const localPathByFilename = {}
  for (const file of imageFiles) {
    const manifestKey = `${slug}/${file.name}`
    const localFile = path.join(localImageDir, file.name)
    const alreadyLocal = await access(localFile).then(() => true).catch(() => false)
    keepFiles.add(manifestKey)

    if (alreadyLocal && manifest[manifestKey] === file.sha) {
      console.log(`   imagen sin cambios, se reutiliza: ${file.name}`)
    } else {
      const buffer = await githubRequest(`${PROJECTS_PATH}/${slug}/images/${file.name}`, { raw: true })
      await writeFile(localFile, Buffer.from(buffer))
      manifest[manifestKey] = file.sha
      console.log(`   imagen descargada: ${file.name}`)
    }

    localPathByFilename[file.name] = `/projects/${slug}/${file.name}`
  }

  if (projectData.preview) {
    projectData.preview = localPathByFilename[projectData.preview] ?? projectData.preview
  }
  if (Array.isArray(projectData.screenshots)) {
    projectData.screenshots = projectData.screenshots.map((shot) => ({
      ...shot,
      src: localPathByFilename[shot.src] ?? shot.src,
    }))
  }

  return { slug, ...projectData }
}

// Borra del disco local cualquier carpeta/archivo de un build anterior que ya
// no exista en el repo CMS (proyecto eliminado, imagen renombrada o quitada).
async function pruneStale(slugs, keepFiles) {
  const currentDirs = await readdir(OUTPUT_IMAGES_DIR, { withFileTypes: true }).catch(() => [])

  for (const dirent of currentDirs) {
    if (!dirent.isDirectory()) continue
    if (!slugs.includes(dirent.name)) {
      await rm(path.join(OUTPUT_IMAGES_DIR, dirent.name), { recursive: true, force: true })
      console.log(`   proyecto eliminado del CMS, se borra local: ${dirent.name}`)
      continue
    }

    const projectDir = path.join(OUTPUT_IMAGES_DIR, dirent.name)
    const localFiles = await readdir(projectDir).catch(() => [])
    for (const fileName of localFiles) {
      if (!keepFiles.has(`${dirent.name}/${fileName}`)) {
        await rm(path.join(projectDir, fileName), { force: true })
        console.log(`   imagen ya no está en el CMS, se borra local: ${dirent.name}/${fileName}`)
      }
    }
  }
}

async function main() {
  console.log(`[fetch-projects] Conectando a ${CMS_REPO_OWNER}/${CMS_REPO_NAME}#${CMS_REPO_BRANCH}...`)

  const projectDirs = await githubRequest(PROJECTS_PATH)
  if (!Array.isArray(projectDirs)) {
    throw new Error(`Se esperaba el directorio "${PROJECTS_PATH}" en el repo CMS, revisa la estructura.`)
  }

  await mkdir(OUTPUT_IMAGES_DIR, { recursive: true })
  const manifest = await loadManifest()
  const keepFiles = new Set()

  const slugs = projectDirs.filter((entry) => entry.type === 'dir').map((entry) => entry.name)
  const projects = []
  for (const slug of slugs) {
    projects.push(await fetchProject(slug, manifest, keepFiles))
  }

  await pruneStale(slugs, keepFiles)

  // El manifiesto solo debe recordar archivos que siguen existiendo.
  for (const key of Object.keys(manifest)) {
    if (!keepFiles.has(key)) delete manifest[key]
  }
  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2))

  await mkdir(path.dirname(OUTPUT_DATA_FILE), { recursive: true })
  await writeFile(OUTPUT_DATA_FILE, JSON.stringify(projects, null, 2))
  console.log(`[fetch-projects] ${projects.length} proyecto(s) escritos en ${path.relative(process.cwd(), OUTPUT_DATA_FILE)}`)
}

main().catch((err) => {
  console.error('[fetch-projects] Error:', err.message)
  process.exit(1)
})
