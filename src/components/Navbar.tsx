import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'Sobre mí',  hash: 'about' },
  { label: 'Proyectos', hash: 'projects' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function goToSection(hash: string) {
    setMobileOpen(false)
    if (location.pathname === '/') {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 10)
    } else {
      navigate(`/#${hash}`)
    }
  }

  function goHome() {
    setMobileOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-white/95 dark:bg-[#080810]/95 backdrop-blur-md border-b border-black/5 dark:border-white/5'
          : ''
      }`}
    >
      {/* Barra principal */}
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-4' : 'py-7'}`}>
        <button
          onClick={goHome}
          aria-label="Inicio"
          className="hover:opacity-80 transition-opacity"
        >
          <Logo className="h-7 w-auto" />
        </button>

        <nav className="flex items-center gap-3">
          {links.map(({ label, hash }) => (
            <button
              key={hash}
              onClick={() => goToSection(hash)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium hidden md:block px-2"
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => goToSection('contact')}
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors hidden md:block"
          >
            Contacto
          </button>

          <ThemeToggle className="hidden md:flex" />

          {/* Hamburguesa — solo mobile */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.25"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              className="block w-5 h-px bg-gray-900 dark:bg-white origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.22 }}
              className="block w-5 h-px bg-gray-900 dark:bg-white origin-center"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              className="block w-5 h-px bg-gray-900 dark:bg-white origin-center"
            />
          </button>
        </nav>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <div className="max-w-6xl mx-auto px-6 pb-6 pt-2 flex flex-col gap-1">
              {links.map(({ label, hash }) => (
                <button
                  key={hash}
                  onClick={() => goToSection(hash)}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 text-base font-medium border-b border-black/5 dark:border-white/5 transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => goToSection('contact')}
                  className="text-sm font-medium px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors w-fit"
                >
                  Contacto
                </button>
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
