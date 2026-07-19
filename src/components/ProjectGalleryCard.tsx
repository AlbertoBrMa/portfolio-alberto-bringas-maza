import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../lib/useTheme'
import { slideVariants } from '../lib/motionVariants'

interface Slide { src: string; caption: string }

interface Props {
  slides: Slide[]
  title: string
  current: number
  direction: number
  onGoTo: (i: number) => void
  onPrev: () => void
  onNext: () => void
  onOpen: () => void
}

export default function ProjectGalleryCard({ slides, title, current, direction, onGoTo, onPrev, onNext, onOpen }: Props) {
  const { isDark } = useTheme()
  const total = slides.length

  return (
    <div className="rounded-2xl border border-black/12 dark:border-white/8 overflow-hidden bg-white dark:bg-[#0d0d18] select-none">
      <div className="relative overflow-hidden cursor-zoom-in aspect-video" onClick={onOpen}>
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
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
        </AnimatePresence>
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
        </div>
      </div>

      <div className="px-5 pt-4 pb-1 min-h-14">
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
          >
            {slides[current].caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onGoTo(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? 'var(--accent)' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-600">{current + 1} / {total}</span>
            <button onClick={onPrev} className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button onClick={onNext} className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
