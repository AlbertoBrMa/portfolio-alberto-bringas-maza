import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useFullscreen } from '../lib/useFullscreen'
import { useTheme } from '../lib/useTheme'
import { slideVariants } from '../lib/motionVariants'
import { ExpandIcon, CompressIcon } from './icons'

interface Slide { src: string; caption: string }

interface Props {
  open: boolean
  slides: Slide[]
  title: string
  current: number
  direction: number
  onGoTo: (i: number) => void
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export default function ProjectLightbox({ open, slides, title, current, direction, onGoTo, onPrev, onNext, onClose }: Props) {
  const { isDark } = useTheme()
  const total = slides.length
  const ref = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(ref)

  useEffect(() => {
    if (open || document.fullscreenElement !== ref.current) return
    document.exitFullscreen().catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onNext, onPrev])

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = previousOverflow }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <motion.div
            ref={ref}
            initial={{ scale: 0.93, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-white dark:bg-[#080810] ${isFullscreen ? 'w-screen h-screen flex flex-col justify-center px-6' : 'max-w-6xl w-full'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-xl">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={current}
                  src={slides[current].src}
                  alt={`${title} — ${current + 1}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full object-contain ${isFullscreen ? 'max-h-[94dvh]' : 'max-h-[72dvh]'}`}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {!isFullscreen && (
              <>
                <div className="mt-3 mb-1 min-h-10">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.p
                      key={current}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center"
                    >
                      {slides[current].caption}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => onGoTo(i)}
                        className="rounded-full transition-all duration-200"
                        style={{
                          width: i === current ? '20px' : '6px',
                          height: '6px',
                          background: i === current ? 'var(--accent)' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{current + 1} / {total}</span>
                    <button onClick={onPrev} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button onClick={onNext} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      aria-label="Pantalla completa"
                      className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <ExpandIcon />
                    </button>
                    <button onClick={onClose} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {isFullscreen && (
              <>
                <button
                  onClick={onPrev}
                  aria-label="Anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={onNext}
                  aria-label="Siguiente"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </button>
                <button
                  onClick={toggleFullscreen}
                  aria-label="Salir de pantalla completa"
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <CompressIcon />
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
