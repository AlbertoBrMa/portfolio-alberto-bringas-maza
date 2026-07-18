import { useSyncExternalStore } from 'react'

export type Lang = 'es' | 'en'

const listeners = new Set<() => void>()

function getSnapshot(): Lang {
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function setLang(lang: Lang) {
  document.documentElement.lang = lang
  localStorage.setItem('lang', lang)
  listeners.forEach((listener) => listener())
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot)
  return { lang, toggle: () => setLang(lang === 'es' ? 'en' : 'es') }
}

export function loc(es: string, en: string | undefined, lang: Lang): string {
  return lang === 'en' && en ? en : es
}
