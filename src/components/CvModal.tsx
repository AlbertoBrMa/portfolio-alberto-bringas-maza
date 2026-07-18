import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFullscreen } from '../lib/useFullscreen'
import { useT } from '../lib/translations'
import { ExpandIcon, CompressIcon } from './icons'

interface Props {
  open: boolean
  onClose: () => void
  cvUrl: string
  downloadName: string
  title: string
}

export default function CvModal({ open, onClose, cvUrl, downloadName, title }: Props) {
  const t = useT()
  const ref = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(ref)

  useEffect(() => {
    if (open || document.fullscreenElement !== ref.current) return
    document.exitFullscreen().catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = previousOverflow }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex flex-col border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0d0d18] ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-3xl rounded-2xl'}`}
            style={isFullscreen ? undefined : { height: 'min(85dvh, 900px)' }}
            onClick={e => e.stopPropagation()}
          >
            {!isFullscreen && (
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/12 dark:border-white/8 shrink-0">
                <span className="text-xs font-mono tracking-widest uppercase text-gray-500">{t('contactCvTitle')}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={cvUrl}
                    download={downloadName}
                    className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium text-black"
                    style={{ background: 'var(--accent)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {t('contactDownload')}
                  </a>
                  <button
                    onClick={toggleFullscreen}
                    aria-label={t('contactFullscreen')}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
                  >
                    <ExpandIcon />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                aria-label={t('contactExitFullscreen')}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              >
                <CompressIcon />
              </button>
            )}

            <iframe src={cvUrl} className="flex-1 w-full border-0" title={`CV ${title}`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
