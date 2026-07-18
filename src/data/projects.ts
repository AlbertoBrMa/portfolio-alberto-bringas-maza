import generatedProjects from './projects.generated.json'
import { withBase } from '../lib/url'

export interface ProjectHighlight {
  title: string
  title_en?: string
  description: string
  description_en?: string
}

export interface StackGroup {
  group: string
  group_en?: string
  description: string
  description_en?: string
  items: string[]
}

export interface Project {
  slug: string
  title: string
  title_en?: string
  description: string
  description_en?: string
  overview: string
  overview_en?: string
  tags: string[]
  stackGroups?: StackGroup[]
  github: string
  live: string
  highlights: ProjectHighlight[]
  vision?: string
  vision_en?: string
  wip?: boolean
  screenshots?: { src: string; caption: string; caption_en?: string }[]
  preview?: string
}

export const projects: Project[] = (generatedProjects as Project[]).map((project) => ({
  ...project,
  preview: project.preview ? withBase(project.preview) : project.preview,
  screenshots: project.screenshots?.map((shot) => ({ ...shot, src: withBase(shot.src) })),
}))
