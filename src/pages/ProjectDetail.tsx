import { useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import Background from '../components/Background'
import Navbar from '../components/Navbar'
import Cursor from '../components/Cursor'
import ScrollProgress from '../components/ScrollProgress'
import ProjectCarousel from '../components/ProjectCarousel'
import { GithubIcon, ExternalIcon, WipBadge } from '../components/icons'
import { useLanguage, loc } from '../lib/useLanguage'
import { useT } from '../lib/translations'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const project = projects.find(p => p.slug === slug)
  const { lang } = useLanguage()
  const t = useT()

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!project) return <Navigate to="/" replace />

  const index = projects.indexOf(project)
  const prev = projects[index - 1]
  const next = projects[index + 1]

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Background />
      <Navbar />

      <main className="relative pt-32 pb-24 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto">

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="m15 18-6-6 6-6" />
              </svg>
              {t('detailBack')}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-ink)' }}>
              {String(index + 1).padStart(2, '0')} — {t('detailEyebrow')}
            </p>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                {loc(project.title, project.title_en, lang)}
              </h1>
              {project.wip && <WipBadge size="md" label={t('projectsWip')} className="self-end mb-2" />}
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
                  onMouseEnter={e => (e.currentTarget.style.background = '#059669')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                >
                  <ExternalIcon /> {t('detailLive')}
                </a>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-20">
            {project.screenshots && project.screenshots.length > 0
              ? <ProjectCarousel
                  slides={project.screenshots.map(shot => ({ src: shot.src, caption: loc(shot.caption, shot.caption_en, lang) }))}
                  title={loc(project.title, project.title_en, lang)}
                />
              : (
                <div className="aspect-video w-full rounded-2xl border border-black/12 dark:border-white/8 bg-linear-to-br from-[#10b981]/8 via-black/2 dark:via-white/2 to-transparent flex items-center justify-center">
                  <span className="text-black/10 dark:text-white/10 text-sm font-mono">screenshot</span>
                </div>
              )
            }
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-6">{t('detailDescription')}</p>
            <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">{loc(project.overview, project.overview_en, lang)}</p>
          </motion.section>

          {project.stackGroups && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-10">{t('detailStack')}</p>
              <div className="space-y-6">
                {project.stackGroups.map((sg, i) => (
                  <motion.div
                    key={sg.group}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 p-6 rounded-xl border border-black/12 dark:border-white/8"
                  >
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">{loc(sg.group, sg.group_en, lang)}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sg.items.map(item => (
                          <span key={item} className="text-xs px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{loc(sg.description, sg.description_en, lang)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600 mb-10">{t('detailHighlights')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="p-6 rounded-xl border border-black/12 dark:border-white/8 hover:border-(--accent-ink) transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">{loc(h.title, h.title_en, lang)}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-4.5">{loc(h.description, h.description_en, lang)}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {project.vision && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 mb-0 p-8 rounded-2xl border border-black/12 dark:border-white/8 bg-linear-to-br from-[#10b981]/4 via-transparent to-transparent"
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-ink)' }}>{t('detailVision')}</p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{loc(project.vision, project.vision_en, lang)}</p>
            </motion.section>
          )}

          <div className="mt-24 pt-10 border-t border-black/9 dark:border-white/5 flex justify-between gap-4">
            {prev ? (
              <Link to={`/project/${prev.slug}`} className="group flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>{loc(prev.title, prev.title_en, lang)}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link to={`/project/${next.slug}`} className="group flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span>{loc(next.title, next.title_en, lang)}</span>
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
