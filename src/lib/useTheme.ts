import { useSyncExternalStore } from 'react'

// Estado compartido respaldado por la clase .dark en <html>, no por useState:
// así cualquier componente que use este hook (Navbar, Cursor...) se mantiene
// sincronizado cuando otro cambia el tema, sin necesitar un Context.
const listeners = new Set<() => void>()

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function setDark(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  listeners.forEach((listener) => listener())
}

export function useTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot)
  return { isDark, toggle: () => setDark(!isDark) }
}
