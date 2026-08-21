import { AnimatePresence, motion } from 'framer-motion'

interface LogoutConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function LogoutConfirmModal({ open, onCancel, onConfirm }: LogoutConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-sm rounded-cardlg bg-white p-6 shadow-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <h2 id="logout-confirm-title" className="text-lg font-semibold text-navy">
              Are you sure?
            </h2>
            <p className="mt-2 text-[13px] text-slate2-secondary">
              You want to logout from your account.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy transition-colors hover:border-brand"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-brand py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-dark"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}