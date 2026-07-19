import { useLanguage, type Lang } from './useLanguage'

const dict = {
  navAbout: { es: 'Sobre mí', en: 'About' },
  navProjects: { es: 'Proyectos', en: 'Projects' },
  navContact: { es: 'Contacto', en: 'Contact' },
  navHome: { es: 'Inicio', en: 'Home' },
  navMenuOpen: { es: 'Abrir menú', en: 'Open menu' },
  navMenuClose: { es: 'Cerrar menú', en: 'Close menu' },

  heroGreeting: { es: 'Hola, soy', en: "Hi, I'm" },
  heroCta: { es: 'Ver trabajo →', en: 'View work →' },

  aboutEyebrow: { es: '01 — Sobre mí', en: '01 — About me' },
  aboutHeading: { es: 'Me encanta construir y seguir aprendiendo', en: 'I love building and learning' },
  aboutEducation: { es: 'Formación', en: 'Education' },
  aboutStack: { es: 'Stack técnico', en: 'Tech stack' },
  aboutLanguages: { es: 'Idiomas', en: 'Languages' },

  projectsEyebrow: { es: '02 — Proyectos', en: '02 — Projects' },
  projectsFilterAll: { es: 'Todos', en: 'All' },
  projectsCta: { es: 'Ver proyecto →', en: 'View project →' },
  projectsWip: { es: 'En desarrollo', en: 'Work in progress' },

  contactEyebrow: { es: '03 — Contacto', en: '03 — Contact' },
  contactHeading: { es: '¿Hablamos?', en: "Let's talk?" },
  contactDownloadCv: { es: 'Descargar CV', en: 'Download CV' },
  contactViewCv: { es: 'Ver CV', en: 'View CV' },
  contactCvTitle: { es: 'Currículum Vitae', en: 'Curriculum Vitae' },
  contactDownload: { es: 'Descargar', en: 'Download' },
  contactFullscreen: { es: 'Pantalla completa', en: 'Fullscreen' },
  contactExitFullscreen: { es: 'Salir de pantalla completa', en: 'Exit fullscreen' },

  detailBack: { es: 'Volver al portfolio', en: 'Back to portfolio' },
  detailEyebrow: { es: 'Proyecto', en: 'Project' },
  detailLive: { es: 'Ver live', en: 'View live' },
  detailDescription: { es: 'Descripción', en: 'Description' },
  detailStack: { es: 'Stack', en: 'Stack' },
  detailHighlights: { es: 'Aspectos técnicos', en: 'Technical highlights' },
  detailVision: { es: 'Visión', en: 'Vision' },

  galleryPrev: { es: 'Anterior', en: 'Previous' },
  galleryNext: { es: 'Siguiente', en: 'Next' },
  galleryFullscreen: { es: 'Pantalla completa', en: 'Fullscreen' },
  galleryExitFullscreen: { es: 'Salir de pantalla completa', en: 'Exit fullscreen' },

  themeToLight: { es: 'Activar modo claro', en: 'Switch to light mode' },
  themeToDark: { es: 'Activar modo oscuro', en: 'Switch to dark mode' },
  langToggle: { es: 'Cambiar a inglés', en: 'Switch to Spanish' },
} satisfies Record<string, Record<Lang, string>>

export type TKey = keyof typeof dict

export function useT() {
  const { lang } = useLanguage()
  return (key: TKey) => dict[key][lang]
}
