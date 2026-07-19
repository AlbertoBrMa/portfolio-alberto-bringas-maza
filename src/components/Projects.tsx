import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { projects, type Project } from '../data/projects'
import { useLanguage, loc, type Lang } from '../lib/useLanguage'
import { useT, type TKey } from '../lib/translations'
import { GithubIcon, ExternalIcon, WipBadge } from './icons'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const MAX_CARD_TAGS = 3

function useTagList() {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const project of projects) {
      for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
  }, [])
}

export default function Projects() {
  const { lang } = useLanguage()
  const t = useT()
  const navigate = useNavigate()
  const tags = useTagList()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const visibleProjects = activeTag ? projects.filter(p => p.tags.includes(activeTag)) : projects

  const openProject = (slug: string) => {
    sessionStorage.setItem('homeScroll', String(window.scrollY))
    navigate(`/project/${slug}`)
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

        {tags.length > 1 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.05}
            className="flex flex-wrap gap-2 mb-10"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={
                activeTag === null
                  ? 'text-xs px-3 py-1.5 rounded-full border border-transparent font-semibold text-black transition-colors'
                  : 'text-xs px-3 py-1.5 rounded-full border border-black/12 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors'
              }
              style={activeTag === null ? { background: 'var(--accent)' } : undefined}
            >
              {t('projectsFilterAll')}
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(cur => (cur === tag ? null : tag))}
                className={
                  activeTag === tag
                    ? 'text-xs px-3 py-1.5 rounded-full border border-transparent font-semibold text-black transition-colors'
                    : 'text-xs px-3 py-1.5 rounded-full border border-black/12 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors'
                }
                style={activeTag === tag ? { background: 'var(--accent)' } : undefined}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                lang={lang}
                t={t}
                onOpen={() => openProject(project.slug)}
              />
            ))}
          </AnimatePresence>
        </div>

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
      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {type === 'github' ? <GithubIcon /> : <ExternalIcon />}
    </a>
  )
}

function ProjectCard({ project, index, lang, t, onOpen }: {
  project: Project
  index: number
  lang: Lang
  t: (key: TKey) => string
  onOpen: () => void
}) {
  const [canTilt] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 300, damping: 22 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 300, damping: 22 })
  const glareX = useTransform(px, v => `${v * 100}%`)
  const glareY = useTransform(py, v => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(16,185,129,0.16), transparent 60%)`

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!canTilt) return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function onMouseLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.article
      layout
      initial="hidden"
      whileInView="visible"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      custom={0.1 + Math.min(index, 6) * 0.06}
      whileHover={canTilt ? { scale: 1.02 } : undefined}
      whileTap={{ scale: 0.98 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onOpen() }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative rounded-2xl border border-black/12 dark:border-white/8 hover:border-(--accent-ink) transition-colors overflow-hidden cursor-pointer bg-white dark:bg-[#0d0d18] flex flex-col"
    >
      {canTilt && (
        <motion.div aria-hidden className="absolute inset-0 pointer-events-none z-10" style={{ background: glare }} />
      )}

      <div className="relative aspect-video bg-linear-to-br from-[#10b981]/8 via-black/3 dark:via-white/3 to-transparent flex items-center justify-center">
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

      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
          {loc(project.description, project.description_en, lang)}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, MAX_CARD_TAGS).map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400">
              {tag}
            </span>
          ))}
          {project.tags.length > MAX_CARD_TAGS && (
            <span className="text-xs px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 text-gray-500">
              +{project.tags.length - MAX_CARD_TAGS}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            <ProjectLink href={project.github} type="github" />
            <ProjectLink href={project.live} type="live" />
          </div>
          <span className="text-xs font-semibold text-(--accent-ink) group-hover:translate-x-0.5 transition-transform">
            {t('projectsCta')}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
