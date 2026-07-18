import { useScroll, useTransform, motion } from 'framer-motion'

export default function Background() {
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-42%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-65%'])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-[#fafafa] dark:bg-[#080810]" />
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%]  w-[700px] h-[700px] rounded-full bg-[#10b981]/3 dark:bg-[#10b981]/6  blur-[160px]" />
        <div className="absolute top-[60%] right-[8%]  w-[550px] h-[550px] rounded-full bg-black/5 dark:bg-white/4      blur-[130px]" />
        <div className="absolute top-[40%] left-[50%]  w-[400px] h-[400px] rounded-full bg-[#10b981]/3 dark:bg-[#10b981]/4  blur-[100px]" />
      </motion.div>

      <motion.div style={{ y: y2 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[12%]  right-[14%] w-36 h-36 rounded-full border border-black/10 dark:border-white/8" />
        <div className="absolute top-[52%]  left-[7%]   w-24 h-24 rotate-45   border border-black/10 dark:border-white/8" />
        <div className="absolute top-[78%]  right-[20%] w-20 h-20 rounded-full border border-[#10b981]/25 dark:border-[#10b981]/15" />
        <div className="absolute top-[30%]  right-[5%]  w-56 h-px  bg-gradient-to-r from-transparent via-black/15 dark:via-white/12 to-transparent  rotate-12" />
        <div className="absolute top-[68%]  left-[18%]  w-48 h-px  bg-gradient-to-r from-transparent via-[#10b981]/15 dark:via-[#10b981]/12 to-transparent -rotate-6" />
      </motion.div>

      <motion.div style={{ y: y3 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[22%]  right-[32%] w-3  h-3  rounded-full bg-[#10b981]/35 dark:bg-[#10b981]/30" />
        <div className="absolute top-[45%]  left-[22%]  w-2  h-2  rounded-full bg-black/25 dark:bg-white/20" />
        <div className="absolute top-[65%]  right-[12%] w-4  h-4  rounded-full border border-[#10b981]/25 dark:border-[#10b981]/20" />
        <div className="absolute top-[80%]  left-[40%]  w-3  h-3  rotate-45 border border-black/20 dark:border-white/15" />
        <div className="absolute top-[10%]  left-[38%]  w-2  h-2  rounded-full bg-black/20 dark:bg-white/15" />
      </motion.div>
    </div>
  )
}
