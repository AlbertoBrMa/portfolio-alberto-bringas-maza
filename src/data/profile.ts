import generatedProfile from './profile.generated.json'

export interface ExperienceEntry {
  role: string
  company: string
  period: string
}

export interface EducationEntry {
  title: string
  center: string
  period: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface LanguageEntry {
  name: string
  level: string
}

export interface ContactLink {
  type: 'email' | 'github' | 'linkedin'
  label: string
  value: string
  href: string
}

export interface Profile {
  name: string
  firstName: string
  lastName: string
  tagline: string
  location: string
  bio: string
  heroPhoto?: string
  cv?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skillGroups: SkillGroup[]
  languages: LanguageEntry[]
  contact: {
    availability: string
    links: ContactLink[]
  }
}

const emptyProfile: Profile = {
  name: '',
  firstName: '',
  lastName: '',
  tagline: '',
  location: '',
  bio: '',
  experience: [],
  education: [],
  skillGroups: [],
  languages: [],
  contact: { availability: '', links: [] },
}

// Datos generados en build time por scripts/fetch-content.mjs a partir del repo
// CMS privado. No editar a mano: se sobreescriben en el siguiente fetch.
export const profile: Profile = { ...emptyProfile, ...(generatedProfile as Partial<Profile>) }
