import { useCallback, useEffect, useState, type RefObject } from 'react'

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])

  const toggle = useCallback(() => {
    // exitFullscreen()/requestFullscreen() devuelven promesas que pueden
    // rechazar (p.ej. si el documento pierde el foco a mitad de la
    // transición); no hay nada útil que hacer con ese error, solo evitar
    // que quede como rejection sin capturar.
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      ref.current?.requestFullscreen().catch(() => {})
    }
  }, [ref])

  // Si el elemento se desmonta (se cierra el modal) sin haber salido de
  // pantalla completa explícitamente, hay que salir para no dejar al
  // navegador "atascado" en fullscreen sobre un nodo que ya no existe.
  useEffect(() => {
    return () => {
      if (document.fullscreenElement === ref.current) document.exitFullscreen().catch(() => {})
    }
  }, [ref])

  return { isFullscreen, toggle }
}
