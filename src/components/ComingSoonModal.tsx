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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            className="relative w-full max-w-sm rounded-xl bg-white p-7 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-slate2-secondary transition-colors hover:text-navy">
              <X size={20} />
            </button>
            <motion.div initial={{ rotate: -12, scale: 0.75 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blueBG text-brand">
              <Sparkles size={24} />
            </motion.div>
            <h3 id="coming-soon-title" className="text-lg font-semibold text-navy">Coming Soon...</h3>
            <p className="mt-2 text-[13px] leading-6 text-slate2-secondary">
              {featureName ? `${featureName} is` : 'This experience is'} being prepared for you. Please check back soon.
            </p>
            <button type="button" onClick={onClose} className="mt-5 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">Got it</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
