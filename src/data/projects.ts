import generatedProjects from './projects.generated.json'
import { withBase } from '../lib/url'

export interface ProjectHighlight {
  title: string
  description: string
}

export interface StackGroup {
  group: string
  description: string
  items: string[]
}

export interface Project {
  slug: string
  title: string
  description: string
  overview: string
  tags: string[]
  stackGroups?: StackGroup[]
  github: string
  live: string
  highlights: ProjectHighlight[]
  vision?: string
  wip?: boolean
  screenshots?: { src: string; caption: string }[]
  preview?: string
}

// Datos generados en build time por scripts/fetch-content.mjs a partir del repo CMS privado.
// No editar a mano: los cambios se sobreescriben en el siguiente `npm run fetch:content`.
export const projects: Project[] = (generatedProjects as Project[]).map((project) => ({
  ...project,
  preview: project.preview ? withBase(project.preview) : project.preview,
  screenshots: project.screenshots?.map((shot) => ({ ...shot, src: withBase(shot.src) })),
}))
