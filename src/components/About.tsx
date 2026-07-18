import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useLanguage, loc } from '../lib/useLanguage'
import { useT } from '../lib/translations'

export default function About() {
  const { experience, education, skillGroups, languages, bio, bio_en } = profile
  const { lang } = useLanguage()
  const t = useT()

  return (
    <section id="about" className="relative min-h-screen py-32 px-6 border-t border-black/9 dark:border-white/5 flex items-center" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-20"
          style={{ color: 'var(--accent-ink)' }}
        >
          {t('aboutEyebrow')}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight">
              {t('aboutHeading')}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-12">
              {loc(bio, bio_en, lang)}
            </p>

            <div className="space-y-6 mb-12">
              {experience.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">{loc(job.role, job.role_en, lang)}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{job.company} · {loc(job.period, job.period_en, lang)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-6 text-gray-500">
              {t('aboutEducation')}
            </p>
            <div className="space-y-6">
              {education.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 border border-black/20 dark:border-white/20" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm">{loc(item.title, item.title_en, lang)}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.center} · {loc(item.period, item.period_en, lang)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-8 text-gray-500">
              {t('aboutStack')}
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              {skillGroups.map((group, i) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                >
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-600 mb-2">
                    {loc(group.category, group.category_en, lang)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 rounded-md border border-black/12 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-black/9 dark:border-white/5">
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-6 text-gray-500">
                {t('aboutLanguages')}
              </p>
              <div className="flex gap-8">
                {languages.map((entry) => (
                  <div key={entry.name}>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm">{loc(entry.name, entry.name_en, lang)}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{loc(entry.level, entry.level_en, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
