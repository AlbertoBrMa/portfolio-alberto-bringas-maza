import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { profile } from '../data/profile'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const photoScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Mouse parallax — cada capa en un rango diferente para el falso 3D
  const spring = { stiffness: 70, damping: 22 }

  const blobX  = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), spring)
  const blobY  = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), spring)

  const ring1X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-22, 22]), spring)
  const ring1Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-16, 16]), spring)

  const ring2X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), spring)
  const ring2Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-22, 22]), spring)

  const imgX   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-40, 40]), spring)
  const imgY   = useSpring(useTransform(mouseY, [-0.5, 0.5], [-28, 28]), spring)

  const dotX   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-54, 54]), spring)
  const dotY   = useSpring(useTransform(mouseY, [-0.5, 0.5], [-38, 38]), spring)

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current!.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width)
    mouseY.set((e.clientY - rect.top   - rect.height / 2) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen flex items-center"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Texto ── */}
        <motion.div style={{ y: contentY, opacity }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs font-mono tracking-[0.35em] uppercase mb-5"
            style={{ color: 'var(--accent-ink)' }}
          >
            Hola, soy
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-5 leading-none tracking-tight">
            {[profile.firstName, profile.lastName].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.85,
                    delay: 0.35 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-10 font-light tracking-wide"
          >
            {profile.tagline}
          </motion.p>

          <motion.a
            href="#about"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm tracking-wider text-black cursor-pointer hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent)', transition: 'background 0.2s, transform 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9dcc00')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Ver trabajo →
          </motion.a>
        </motion.div>

        {/* ── Foto con falso 3D ── */}
        <motion.div
          style={{ y: photoScrollY, opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative justify-center items-end h-120 lg:h-140 hidden lg:flex"
        >
          {/* Capa 1 — blob lima (más alejado) */}
          <motion.div
            style={{ x: blobX, y: blobY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-72 h-72 rounded-full bg-[#c8ff00]/18 blur-[80px]" />
          </motion.div>

          {/* Capa 2 — rectángulo borde inclinado */}
          <motion.div
            style={{ x: ring1X, y: ring1Y }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 h-72 rounded-3xl border border-[#c8ff00]/15 rotate-3 pointer-events-none"
          />

          {/* Capa 3 — rectángulo borde más pequeño, inclinado otro lado */}
          <motion.div
            style={{ x: ring2X, y: ring2Y }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-44 h-64 rounded-2xl border border-black/10 dark:border-white/6 -rotate-2 pointer-events-none"
          />

          {/* Capa 4 — foto (figura principal) */}
          {profile.heroPhoto && (
            <motion.img
              style={{ x: imgX, y: imgY }}
              src={profile.heroPhoto}
              alt={profile.name}
              className="relative h-full w-auto max-w-xs object-contain object-bottom drop-shadow-2xl select-none pointer-events-none"
              draggable={false}
            />
          )}

          {/* Capa 5 — punto lima (más cerca del espectador) */}
          <motion.div
            style={{ x: dotX, y: dotY, background: 'var(--accent)' }}
            className="absolute bottom-16 right-10 w-3 h-3 rounded-full pointer-events-none"
          />
        </motion.div>

      </div>

      {/* Indicador scroll */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 dark:text-gray-600 text-[10px] tracking-[0.3em] uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-px h-10 bg-linear-to-b from-gray-500 to-transparent"
        />
      </motion.div>
    </section>
  )
}
