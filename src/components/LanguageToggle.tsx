import { useLanguage } from '../lib/useLanguage'
import { useT } from '../lib/translations'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, toggle } = useLanguage()
  const t = useT()

  return (
    <button
      onClick={toggle}
      aria-label={t('langToggle')}
      className={`w-8 h-8 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[10px] font-mono font-semibold tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors ${className}`}
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
