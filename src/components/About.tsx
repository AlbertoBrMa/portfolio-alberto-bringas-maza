import { motion } from 'framer-motion'
import { profile } from '../data/profile'

export default function About() {
  const { experience, education, skillGroups, languages, bio } = profile

  return (
    <section id="about" className="relative min-h-screen py-32 px-6 border-t border-black/5 dark:border-white/5 flex items-center" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-20"
          style={{ color: 'var(--accent-ink)' }}
        >
          01 — Sobre mí
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Bio + Experiencia */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight">
              Me encanta construir y seguir aprendiendo
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-12">
              {bio}
            </p>

            {/* Experiencia */}
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
                    <p className="text-gray-900 dark:text-white font-semibold">{job.role}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{job.company} · {job.period}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Formación */}
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-6 text-gray-500">
              Formación
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
                    <p className="text-gray-900 dark:text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.center} · {item.period}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-8 text-gray-500">
              Stack técnico
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
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 rounded-md border border-black/8 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-(--accent-ink) hover:text-(--accent-ink) transition-colors cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Idiomas */}
            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-6 text-gray-500">
                Idiomas
              </p>
              <div className="flex gap-8">
                {languages.map((lang) => (
                  <div key={lang.name}>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm">{lang.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{lang.level}</p>
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
