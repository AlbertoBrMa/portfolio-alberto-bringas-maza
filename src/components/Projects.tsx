import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const VISIBLE_RADIUS = 2 // cuántas tarjetas se muestran a cada lado de la activa

// Distancia circular más corta entre dos índices (con wraparound): permite que
// el carrusel "dé la vuelta" en vez de recorrer todo el camino largo.
function circularOffset(index: number, active: number, total: number) {
  let diff = index - active
  const half = total / 2
  if (diff > half) diff -= total
  if (diff < -half) diff += total
  return diff
}

// Las tarjetas escalan con el ancho real del contenedor (no con el viewport
// completo, que aquí está acotado por max-w-6xl) para que se vean grandes en
// desktop sin desbordar en móvil.
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
    <section id="projects" className="relative min-h-screen py-32 px-6 border-t border-white/5" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-16"
          style={{ color: 'var(--accent)' }}
        >
          02 — Proyectos
        </motion.p>

        {/* Carrusel con profundidad */}
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
            aria-label="Proyecto anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Siguiente proyecto"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-colors flex items-center justify-center"
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
                  style={{ width: cardWidth, borderColor: isActive ? 'rgba(200,255,0,0.4)' : 'rgba(255,255,255,0.08)' }}
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
                  aria-label={isActive ? `Abrir ${project.title}` : `Mostrar ${project.title}`}
                >
                  <div className="relative aspect-video bg-linear-to-br from-[#c8ff00]/8 via-white/3 to-transparent flex items-center justify-center pointer-events-none">
                    {project.preview
                      ? <img src={project.preview} alt={project.title} className="w-full h-full object-cover" draggable={false} />
                      : <span className="text-white/10 text-sm font-mono">preview</span>
                    }
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent pt-12 pb-4 px-5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-base truncate">{project.title}</h3>
                        {project.wip && <WipBadge compact />}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mb-16">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              onClick={() => goTo(i)}
              aria-label={`Ir a ${project.title}`}
              className="p-1.5 -m-1.5"
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  background: i === active ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Panel de detalle del proyecto activo */}
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
              <h3 className="text-2xl md:text-3xl font-bold text-white">{activeProject.title}</h3>
              {activeProject.wip && <WipBadge />}
            </div>
            <p className="text-gray-400 leading-relaxed mb-7 text-base">{activeProject.description}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {activeProject.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300">
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
                Ver proyecto →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}

function WipBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono tracking-widest uppercase rounded-full border border-amber-400/30 text-amber-400/80 bg-amber-400/5 shrink-0 ${compact ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}>
      <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
      WIP
    </span>
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
        type === 'live' ? 'text-[#c8ff00] hover:text-white' : 'text-gray-400 hover:text-white'
      }`}
    >
      {type === 'github' ? <GithubIcon /> : <ExternalIcon />}
      {type === 'github' ? 'GitHub' : 'Live'}
    </a>
  )
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
