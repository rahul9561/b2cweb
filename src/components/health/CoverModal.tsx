import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { fadeScale } from '../../lib/motion'
import { coverOptions } from '../../data/healthOptions'

interface Props {
  isOpen: boolean
  current: string
  onSelect: (val: string) => void
  onClose: () => void
}

export default function CoverModal({ isOpen, current, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState(current)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        variants={fadeScale}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-navy">Cover</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[320px] overflow-y-auto av-modal-scroll p-3">
          {coverOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                selected === opt ? 'bg-brand font-semibold text-white' : 'text-navy hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {opt}
                {opt === 'Rs10-24 Lakh' && (
                  <span className="rounded-full bg-purple2/10 px-2 py-0.5 text-[9px] font-bold text-purple2">
                    Most popular
                  </span>
                )}
              </span>
              {selected === opt && <span className="text-[11px]">✓</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-medium text-navy border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => { onSelect(selected); onClose() }}
            className="flex-1 rounded-xl bg-orange-tag py-2.5 text-sm font-bold text-white hover:bg-orange-tag/90 active:scale-[0.98]"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  )
}
