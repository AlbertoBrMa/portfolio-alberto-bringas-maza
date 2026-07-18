import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/profile'
import type { ContactLink } from '../data/profile'
import { useFullscreen } from '../lib/useFullscreen'

const icons: Record<ContactLink['type'], React.ReactNode> = {
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.1 },
  }),
}

export default function Contact() {
  const [cvOpen, setCvOpen] = useState(false)
  const cvModalRef = useRef<HTMLDivElement>(null)
  const { isFullscreen: cvFullscreen, toggle: toggleCvFullscreen } = useFullscreen(cvModalRef)

  useEffect(() => {
    if (cvOpen || document.fullscreenElement !== cvModalRef.current) return
    document.exitFullscreen().catch(() => {})
  }, [cvOpen])

  useEffect(() => {
    if (!cvOpen) return
    // El scroll real ocurre en <html>, no en <body> (no hay overflow/height
    // propios en ninguno), así que hay que bloquear documentElement.
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = previousOverflow }
  }, [cvOpen])

  return (
    <footer id="contact" className="relative py-32 px-6 border-t border-black/5 dark:border-white/5" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto w-full">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-10"
          style={{ color: 'var(--accent-ink)' }}
        >
          03 — Contacto
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-4"
        >
          ¿Hablamos?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 text-lg mb-14 max-w-md"
        >
          {profile.contact.availability}
        </motion.p>

        {/* Links de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {profile.contact.links.map(({ type, label, value, href }, i) => {
            const external = type !== 'email'
            return (
              <motion.a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={item}
                whileHover={{ y: -4 }}
                className="group flex items-start gap-4 p-5 rounded-xl border border-black/8 dark:border-white/8 hover:border-(--accent-ink) hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
              >
                <span className="text-gray-500 group-hover:text-(--accent-ink) transition-colors mt-0.5 shrink-0">
                  {icons[type]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-1">{label}</p>
                  <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{value}</p>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Botones CV */}
        {profile.cv && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex gap-3 flex-wrap"
          >
            <a
              href={profile.cv}
              download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-black hover:scale-105 active:scale-95"
              style={{ background: 'var(--accent)', transition: 'background 0.2s, transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#9dcc00')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar CV
            </a>

            <button
              onClick={() => setCvOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-black/30 dark:hover:border-white/30 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Ver CV
            </button>
          </motion.div>
        )}

        <div className="mt-16 border-t border-black/5 dark:border-white/5 pt-8">
          <p className="text-gray-700 text-xs font-mono">
            © {new Date().getFullYear()} {profile.name} · React & Framer Motion
          </p>
        </div>

      </div>

      {/* Modal previsualización CV — portal al body para escapar del stacking context */}
      {createPortal(
        <AnimatePresence>
          {cvOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8"
            onClick={() => setCvOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
              ref={cvModalRef}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0d0d18] ${cvFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-3xl rounded-2xl'}`}
              style={cvFullscreen ? undefined : { height: 'min(85dvh, 900px)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header — oculto en pantalla completa, solo el PDF sin nada más */}
              {!cvFullscreen && (
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/8 dark:border-white/8 shrink-0">
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500">Currículum Vitae</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={profile.cv}
                      download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium text-black"
                      style={{ background: 'var(--accent)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Descargar
                    </a>
                    <button
                      onClick={toggleCvFullscreen}
                      aria-label="Pantalla completa"
                      className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
                    >
                      <ExpandIcon />
                    </button>
                    <button
                      onClick={() => setCvOpen(false)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* En pantalla completa solo queda un botón mínimo flotante para salir */}
              {cvFullscreen && (
                <button
                  onClick={toggleCvFullscreen}
                  aria-label="Salir de pantalla completa"
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <CompressIcon />
                </button>
              )}

              {/* iframe */}
              <iframe
                src={profile.cv}
                className="flex-1 w-full border-0"
                title={`CV ${profile.name}`}
              />
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </footer>
  )
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
    </svg>
  )
}

function CompressIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M4 16h3a2 2 0 0 1 2 2v3M20 16h-3a2 2 0 0 0-2 2v3" />
    </svg>
  )
}
