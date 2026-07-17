import { motion } from 'framer-motion'
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

export default function Projects() {
  const [featured, ...rest] = projects
  const navigate = useNavigate()

  return (
    <section id="projects" className="relative min-h-screen py-32 px-6 border-t border-white/5" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-20"
          style={{ color: 'var(--accent)' }}
        >
          02 — Proyectos
        </motion.p>

        {/* Proyecto destacado – ancho completo */}
        <motion.article
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={0.1}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          onClick={() => { sessionStorage.setItem('homeScroll', String(window.scrollY)); navigate(`/project/${featured.slug}`) }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sessionStorage.setItem('homeScroll', String(window.scrollY)); navigate(`/project/${featured.slug}`) } }}
          tabIndex={0}
          role="button"
          className="group relative border border-white/8 rounded-2xl p-8 md:p-12 mb-6 overflow-hidden hover:border-[#c8ff00]/20 focus-visible:border-[#c8ff00]/40 focus-visible:outline-none transition-colors cursor-pointer"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">{featured.title}</h3>
                {featured.wip && <WipBadge />}
              </div>
              <p className="text-gray-400 leading-relaxed mb-7 text-base">{featured.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {featured.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap">
                <ProjectLink href={featured.github} type="github" />
                <ProjectLink href={featured.live} type="live" />
              </div>
            </div>

            <div className="relative z-10 aspect-video rounded-xl border border-white/8 overflow-hidden bg-linear-to-br from-[#c8ff00]/8 via-white/3 to-transparent flex items-center justify-center">
              {featured.preview
                ? <img src={featured.preview} alt={featured.title} className="w-full h-full object-cover" />
                : <span className="text-white/10 text-sm font-mono">preview</span>
              }
            </div>
          </div>
        </motion.article>

        {/* Grid 2 columnas para el resto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((project, i) => (
            <motion.article
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i * 0.1 + 0.15}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => { sessionStorage.setItem('homeScroll', String(window.scrollY)); navigate(`/project/${project.slug}`) }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sessionStorage.setItem('homeScroll', String(window.scrollY)); navigate(`/project/${project.slug}`) } }}
              tabIndex={0}
              role="button"
              className="group relative border border-white/8 rounded-2xl p-8 flex flex-col overflow-hidden hover:border-[#c8ff00]/20 focus-visible:border-[#c8ff00]/40 focus-visible:outline-none transition-colors cursor-pointer"
            >

              <span className="absolute top-5 right-7 text-7xl font-bold leading-none select-none text-white/3 group-hover:text-white/6 transition-colors">
                {String(i + 2).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-2.5 mb-3 relative z-10">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                {project.wip && <WipBadge />}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 relative z-10">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap relative z-10">
                <ProjectLink href={project.github} type="github" />
                <ProjectLink href={project.live} type="live" />
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}

function WipBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-amber-400/30 text-amber-400/80 bg-amber-400/5">
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
