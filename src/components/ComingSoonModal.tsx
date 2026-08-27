import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'

type ComingSoonModalProps = {
  isOpen: boolean
  onClose: () => void
  featureName?: string
}

export default function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-blue-100 bg-white p-7 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy">
              <X size={18} />
            </button>
            <motion.div
              initial={{ rotate: -12, scale: 0.75 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-amber-300 shadow-lg shadow-blue-500/30 ring-4 ring-blue-50"
            >
              <Sparkles size={28} className="animate-pulse" />
            </motion.div>
            <h3 id="coming-soon-title" className="text-xl font-extrabold text-navy">Coming Soon</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {featureName ? <><strong className="text-brand font-bold">{featureName}</strong> is being prepared for you.</> : 'This experience is being prepared for you.'} Please check back soon!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02]"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
