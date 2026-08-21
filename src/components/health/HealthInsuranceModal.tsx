import { useEffect, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface HealthInsuranceModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  /** Max width class – default max-w-lg */
  size?: string
  /** Show close button – default true */
  showClose?: boolean
}

export default function HealthInsuranceModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'max-w-lg',
  showClose = true,
}: HealthInsuranceModalProps) {
  /* ── Escape key ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Modal card ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative z-10 w-full ${size} max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8`}
          >
            {/* ── Header ── */}
            {(title || showClose) && (
              <div className="mb-5 flex items-start justify-between gap-4">
                {title && (
                  <h3 className="text-lg font-bold leading-snug text-navy">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* ── Content ── */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
