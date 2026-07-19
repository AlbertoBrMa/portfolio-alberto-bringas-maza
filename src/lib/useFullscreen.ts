import { useCallback, useEffect, useState, type RefObject } from 'react'

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      ref.current?.requestFullscreen().catch(() => {})
    }
  }, [ref])

  useEffect(() => {
    const node = ref.current
    return () => {
      if (document.fullscreenElement === node) document.exitFullscreen().catch(() => {})
    }
  }, [ref])

  return { isFullscreen, toggle }
}
