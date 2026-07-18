import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '../lib/useTheme'

export default function Cursor() {
  const { isDark } = useTheme()
  const hoverColor = isDark ? '#ffffff' : '#0a0a0f'
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible]   = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const ringX = useSpring(rawX, { stiffness: 180, damping: 22 })
  const ringY = useSpring(rawY, { stiffness: 180, damping: 22 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.tagName === 'IFRAME') {
        setVisible(false)
        return
      }

      const el = target.closest('a, button, [data-cursor]')
      setHovering(!!el)
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [rawX, rawY, visible])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-100000"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderWidth: 1.5,
          borderStyle: 'solid',
        }}
        animate={{
          width:       hovering ? 52 : 34,
          height:      hovering ? 52 : 34,
          opacity:     visible  ? 1  : 0,
          borderColor: hovering ? hoverColor : '#10b981',
        }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-100001"
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity:         visible  ? 1 : 0,
          backgroundColor: hovering ? hoverColor : '#10b981',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
