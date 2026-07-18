import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'
import Background from '../components/Background'
import Navbar from '../components/Navbar'
import Cursor from '../components/Cursor'
import ScrollProgress from '../components/ScrollProgress'
import { useFullscreen } from '../lib/useFullscreen'
import { useTheme } from '../lib/useTheme'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate  = useNavigate()
  const project   = projects.find(p => p.slug === slug)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!project) return <Navigate to="/" replace />

  const index = projects.indexOf(project)
  const prev  = projects[index - 1]
  const next  = projects[index + 1]

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Background />
      <Navbar />

      <main className="relative pt-32 pb-24 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto">

          {/* Volver */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Volver al portfolio
            </button>
          </motion.div>

          {/* Cabecera */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-ink)' }}>
              {String(index + 1).padStart(2, '0')} — Proyecto
            </p>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                {project.title}
              </h1>
              {project.wip && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-amber-400/30 text-amber-400/80 bg-amber-400/5 self-end mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Work in progress
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mb-16 flex-wrap">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors"
              >
                <GithubIcon /> GitHub
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-black font-semibold hover:scale-105 active:scale-95"
                  style={{ background: 'var(--accent)', transition: 'background 0.2s, transform 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#9dcc00')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                >
                  <ExternalIcon /> Ver live
                </a>
              )}
            </div>
          </motion.div>

          {/* Carrusel */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-20"
          >
            {project.screenshots && project.screenshots.length > 0
              ? <Carousel slides={project.screenshots} title={project.title} />
              : (
                <div className="aspect-video w-full rounded-2xl border border-black/8 dark:border-white/8 bg-linear-to-br from-[#c8ff00]/8 via-black/2 dark:via-white/2 to-transparent flex items-center justify-center">
                  <span className="text-black/10 dark:text-white/10 text-sm font-mono">screenshot</span>
                </div>
              )
            }
          </motion.div>

          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-6">Descripción</p>
            <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">{project.overview}</p>
          </motion.section>

          {/* Stack agrupado */}
          {project.stackGroups && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-10">Stack</p>
              <div className="space-y-6">
                {project.stackGroups.map((sg, i) => (
                  <motion.div
                    key={sg.group}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 p-6 rounded-xl border border-black/8 dark:border-white/8"
                  >
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">{sg.group}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sg.items.map(item => (
                          <span key={item} className="text-xs px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{sg.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Highlights */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-10">Aspectos técnicos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="p-6 rounded-xl border border-black/8 dark:border-white/8 hover:border-(--accent-ink) transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">{h.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-4.5">{h.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Visión */}
          {project.vision && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 mb-0 p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-linear-to-br from-[#c8ff00]/4 via-transparent to-transparent"
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-ink)' }}>Visión</p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{project.vision}</p>
            </motion.section>
          )}

          {/* Navegación prev / next */}
          <div className="mt-24 pt-10 border-t border-black/5 dark:border-white/5 flex justify-between gap-4">
            {prev ? (
              <Link to={`/project/${prev.slug}`} className="group flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>{prev.title}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link to={`/project/${next.slug}`} className="group flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span>{next.title}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ) : <div />}
          </div>

        </div>
      </main>
    </>
  )
}

function Carousel({ slides, title }: { slides: { src: string; caption: string }[]; title: string }) {
  const { isDark } = useTheme()
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)
  const [lightbox, setLightbox]   = useState(false)
  const total = slides.length
  const lightboxRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(lightboxRef)

  const go = useCallback((dir: number) => {
    setDirection(dir)
    setCurrent(i => (i + dir + total) % total)
  }, [total])

  useEffect(() => {
    if (lightbox || document.fullscreenElement !== lightboxRef.current) return
    document.exitFullscreen().catch(() => {})
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     setLightbox(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft')  go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, go])

  useEffect(() => {
    if (!lightbox) return
    // El scroll real ocurre en <html>, no en <body> (no hay overflow/height
    // propios en ninguno), así que hay que bloquear documentElement.
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = previousOverflow }
  }, [lightbox])

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <>
      <div className="rounded-2xl border border-black/8 dark:border-white/8 overflow-hidden bg-white dark:bg-[#0d0d18] select-none">
        {/* Imagen */}
        <div className="relative overflow-hidden cursor-zoom-in aspect-video" onClick={() => setLightbox(true)}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={current}
              src={slides[current].src}
              alt={`${title} — ${current + 1}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </AnimatePresence>
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
          </div>
        </div>

        {/* Caption */}
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

        {/* Controles */}
        {total > 1 && (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
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
              <button onClick={() => go(-1)} className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => go(1)} className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox — portal al body para escapar del stacking context del transform */}
      {createPortal(
        <AnimatePresence>
          {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              ref={lightboxRef}
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
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full object-contain ${isFullscreen ? 'max-h-[94dvh]' : 'max-h-[72dvh]'}`}
                    draggable={false}
                  />
                </AnimatePresence>
              </div>

              {/* En pantalla completa se oculta todo el texto/controles: solo la
                  imagen y unos botones mínimos flotantes para navegar/salir. */}
              {!isFullscreen && (
                <>
                  {/* Caption lightbox */}
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
                          onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
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
                      <button onClick={() => go(-1)} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                      </button>
                      <button onClick={() => go(1)} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        aria-label="Pantalla completa"
                        className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <ExpandIcon />
                      </button>
                      <button onClick={() => setLightbox(false)} className="w-8 h-8 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {isFullscreen && (
                <>
                  <button
                    onClick={() => go(-1)}
                    aria-label="Anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <button
                    onClick={() => go(1)}
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
        document.body
      )}
    </>
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

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
    </svg>
  )
}

function CompressIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M4 16h3a2 2 0 0 1 2 2v3M20 16h-3a2 2 0 0 0-2 2v3" />
    </svg>
  )
}
