import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
}

export default function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const addRipple = useCallback((x: number, y: number) => {
    const id = nextId.current++
    setRipples(prev => [...prev, { id, x, y }])
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => addRipple(e.clientX, e.clientY)
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [addRipple])

  const remove = (id: number) => setRipples(prev => prev.filter(r => r.id !== id))

  return (
    <div className="fixed inset-0 pointer-events-none z-9990 overflow-hidden">
      <AnimatePresence>
        {ripples.map(r => (
          <span key={r.id}>
            <motion.span
              className="absolute rounded-full border"
              style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%', borderColor: 'var(--accent)' }}
              initial={{ width: 0, height: 0, opacity: 0.45, borderWidth: 1.5 }}
              animate={{ width: 260, height: 260, opacity: 0, borderWidth: 0.5 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => remove(r.id)}
            />
            <motion.span
              className="absolute rounded-full border"
              style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%', borderColor: 'var(--accent)' }}
              initial={{ width: 0, height: 0, opacity: 0.3, borderWidth: 1.5 }}
              animate={{ width: 140, height: 140, opacity: 0, borderWidth: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            />
          </span>
        ))}
      </AnimatePresence>
    </div>
  )
}
