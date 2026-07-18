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
          <span key={r.id} style={{ position: 'absolute', left: r.x, top: r.y }}>
            {/* Flash central — el "impacto" de la gota */}
            <motion.span
              className="absolute rounded-full"
              style={{
                translateX: '-50%',
                translateY: '-50%',
                background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
              }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: 90, height: 90, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />

            {/* Anillo 1 — onda inmediata */}
            <motion.span
              className="absolute rounded-full border-2"
              style={{ translateX: '-50%', translateY: '-50%', borderColor: 'var(--accent)' }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: 160, height: 160, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Anillo 2 — onda media */}
            <motion.span
              className="absolute rounded-full border-2"
              style={{ translateX: '-50%', translateY: '-50%', borderColor: 'var(--accent)' }}
              initial={{ width: 0, height: 0, opacity: 0.7 }}
              animate={{ width: 280, height: 280, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />

            {/* Anillo 3 — onda exterior, la que más se aleja */}
            <motion.span
              className="absolute rounded-full border"
              style={{ translateX: '-50%', translateY: '-50%', borderColor: 'var(--accent)' }}
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{ width: 420, height: 420, opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              onAnimationComplete={() => remove(r.id)}
            />
          </span>
        ))}
      </AnimatePresence>
    </div>
  )
}
