import generatedProfile from './profile.generated.json'
import { withBase } from '../lib/url'

export interface ExperienceEntry {
  role: string
  role_en?: string
  company: string
  period: string
  period_en?: string
}

export interface EducationEntry {
  title: string
  title_en?: string
  center: string
  period: string
  period_en?: string
}

export interface SkillGroup {
  category: string
  category_en?: string
  items: string[]
}

export interface LanguageEntry {
  name: string
  name_en?: string
  level: string
  level_en?: string
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
  tagline_en?: string
  location: string
  bio: string
  bio_en?: string
  heroPhoto?: string
  cv?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skillGroups: SkillGroup[]
  languages: LanguageEntry[]
  contact: {
    availability: string
    availability_en?: string
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

const merged: Profile = { ...emptyProfile, ...(generatedProfile as Partial<Profile>) }

export const profile: Profile = {
  ...merged,
  heroPhoto: merged.heroPhoto ? withBase(merged.heroPhoto) : merged.heroPhoto,
  cv: merged.cv ? withBase(merged.cv) : merged.cv,
}
