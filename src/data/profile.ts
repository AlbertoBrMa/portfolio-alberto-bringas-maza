import generatedProfile from './profile.generated.json'
import { withBase } from '../lib/url'

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

const merged: Profile ={ ...emptyProfile, ...(generatedProfile as Partial<Profile>) }

export const profile: Profile = {
  ...merged,
  heroPhoto: merged.heroPhoto ? withBase(merged.heroPhoto) : merged.heroPhoto,
  cv: merged.cv ? withBase(merged.cv) : merged.cv,
}
