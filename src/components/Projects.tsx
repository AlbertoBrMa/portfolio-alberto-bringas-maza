import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import { useTheme } from '../lib/useTheme'
import { useLanguage, loc } from '../lib/useLanguage'
import { useT } from '../lib/translations'
import { GithubIcon, ExternalIcon, WipBadge } from './icons'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const VISIBLE_RADIUS = 2

function circularOffset(index: number, active: number, total: number) {
  let diff = index - active
  const half = total / 2
  if (diff > half) diff -= total
  if (diff < -half) diff += total
  return diff
}

function useCarouselMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    setContainerWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const cardWidth = Math.min(480, Math.max(230, containerWidth * 0.38))
  const spacing = cardWidth * 0.72
  const height = Math.round((cardWidth * 9) / 16) + 90

  return { ref, cardWidth, spacing, height }
}

export default function Projects() {
  const { isDark } = useTheme()
  const { lang } = useLanguage()
  const t = useT()
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const total = projects.length
  const activeProject = projects[active]
  const { ref: carouselRef, cardWidth, spacing, height } = useCarouselMetrics()

  const goTo = useCallback((i: number) => setActive(((i % total) + total) % total), [total])
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const openProject = (slug: string) => {
    sessionStorage.setItem('homeScroll', String(window.scrollY))
    navigate(`/project/${slug}`)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next()
    else if (info.offset.x > 60) prev()
  }

  return (
    <section id="projects" className="relative min-h-screen py-32 px-6 border-t border-black/9 dark:border-white/5" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-16"
          style={{ color: 'var(--accent-ink)' }}
        >
          {t('projectsEyebrow')}
        </motion.p>

        <motion.div
          ref={carouselRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={0.1}
          className="relative mb-10 select-none"
          style={{ perspective: 1400, height }}
        >
          <button
            onClick={prev}
            aria-label={t('projectsPrev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label={t('projectsNext')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors flex items-center justify-center"
          >
            ›
          </button>

          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {projects.map((project, i) => {
              const offset = circularOffset(i, active, total)
              if (Math.abs(offset) > VISIBLE_RADIUS) return null
              const isActive = offset === 0

              return (
                <motion.article
                  key={project.slug}
                  className="absolute left-1/2 top-1/2 rounded-2xl border overflow-hidden"
                  style={{
                    width: cardWidth,
                    borderColor: isActive
                      ? 'rgba(16,185,129,0.4)'
                      : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  }}
                  animate={{
                    x: `calc(-50% + ${offset * spacing}px)`,
                    y: '-50%',
                    scale: 1 - Math.abs(offset) * 0.16,
                    rotateY: offset * -22,
                    opacity: 1 - Math.abs(offset) * 0.32,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  onClick={() => (isActive ? openProject(project.slug) : goTo(i))}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${isActive ? t('projectsOpenAria') : t('projectsShowAria')} ${loc(project.title, project.title_en, lang)}`}
                >
                  <div className="relative aspect-video bg-linear-to-br from-[#10b981]/8 via-black/3 dark:via-white/3 to-transparent flex items-center justify-center pointer-events-none">
                    {project.preview
                      ? <img src={project.preview} alt={loc(project.title, project.title_en, lang)} className="w-full h-full object-cover" draggable={false} />
                      : <span className="text-black/10 dark:text-white/10 text-sm font-mono">preview</span>
                    }
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent pt-12 pb-4 px-5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-base truncate">{loc(project.title, project.title_en, lang)}</h3>
                        {project.wip && <WipBadge size="xs" />}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{loc(activeProject.title, activeProject.title_en, lang)}</h3>
              {activeProject.wip && <WipBadge label={t('projectsWip')} />}
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-7 text-base">{loc(activeProject.description, activeProject.description_en, lang)}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {activeProject.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-6 flex-wrap justify-center items-center">
              <ProjectLink href={activeProject.github} type="github" />
              <ProjectLink href={activeProject.live} type="live" />
              <button
                onClick={() => openProject(activeProject.slug)}
                className="text-sm font-semibold px-6 py-2.5 rounded-full text-black hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'var(--accent)' }}
              >
                {t('projectsCta')}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}

function ProjectLink({ href, type }: { href: string; type: 'github' | 'live' }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className={`flex items-center gap-2 text-sm transition-colors ${
        type === 'live'
          ? 'text-(--accent-ink) hover:text-gray-900 dark:hover:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {type === 'github' ? <GithubIcon /> : <ExternalIcon />}
      {type === 'github' ? 'GitHub' : 'Live'}
    </a>
  )
}
