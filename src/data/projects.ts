import generatedProjects from './projects.generated.json'

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

// Datos generados en build time por scripts/fetch-projects.mjs a partir del repo CMS privado.
// No editar a mano: los cambios se sobreescriben en el siguiente `npm run fetch:projects`.
export const projects: Project[] = generatedProjects as Project[]
