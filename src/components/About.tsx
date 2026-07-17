import { motion } from 'framer-motion'

const skillGroups = [
  { category: 'Lenguajes',        items: ['Java', 'Python', 'JavaScript', 'Kotlin'] },
  { category: 'Frameworks',       items: ['React', 'Springboot', 'Falcon'] },
  { category: 'ORM',              items: ['Hibernate', 'SQLAlchemy'] },
  { category: 'Bases de datos',   items: ['PostgreSQL', 'MySQL', 'MongoDB', 'ORACLE'] },
  { category: 'Geolocalización',  items: ['Cesium', 'Leaflet', 'GeoJSON', '3D Tiles'] },
  { category: 'IA & Datos',       items: ['Pandas', 'Scikit-Learn'] },
  { category: 'Herramientas',     items: ['Git', 'Docker', 'VSC', 'Netbeans'] },
]

const experience = [
  {
    role: 'Desarrollador de Software Junior',
    company: 'GeoAI Analytics',
    period: 'Marzo 2025 – Actualidad',
  },
  {
    role: 'Desarrollador de Software Junior',
    company: 'Digiburn (Erasmus+)',
    period: 'Marzo 2024 – Junio 2024',
  },
]

const education = [
  {
    title: 'Especialización en Inteligencia Artificial y Big Data',
    center: 'IES Ataulfo Argenta',
    period: '2025 – Actualidad',
  },
  {
    title: 'CFGS Desarrollo de Aplicaciones Multiplataforma',
    center: 'IES Ataulfo Argenta',
    period: '2024 – 2025',
  },
  {
    title: 'CFGS Desarrollo de Aplicaciones Web',
    center: 'IES Ataulfo Argenta',
    period: '2022 – 2024',
  },
]

export default function About() {
  return (
    <section id="about" className="relative min-h-screen py-32 px-6 border-t border-white/5 flex items-center" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.3em] uppercase mb-20"
          style={{ color: 'var(--accent)' }}
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
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8 tracking-tight">
              Me encanta construir y seguir aprendiendo
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-12">
              Joven desarrollador de Colindres, Cantabria. Me especializo en aplicaciones web y
              geoespaciales, combinando frontend con React, backend con Python y Java, y una
              creciente especialización en IA y Big Data. Actualmente trabajando en GeoAI Analytics
              y cursando la especialización en IA.
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
                    <p className="text-white font-semibold">{job.role}</p>
                    <p className="text-gray-400 text-sm">{job.company} · {job.period}</p>
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
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 border border-white/20" />
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.center} · {item.period}</p>
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
                        className="text-xs px-2.5 py-1 rounded-md border border-white/8 text-gray-400 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-colors cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Idiomas */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-6 text-gray-500">
                Idiomas
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-white font-semibold text-sm">Castellano</p>
                  <p className="text-gray-500 text-xs mt-0.5">Nativo</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Inglés</p>
                  <p className="text-gray-500 text-xs mt-0.5">Intermedio-alto</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
