import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { fadeScale } from '../../lib/motion'
import { sortByOptions } from '../../data/healthOptions'

interface Props {
  isOpen: boolean
  current: string
  onSelect: (val: string) => void
  onClose: () => void
}

export default function SortByModal({ isOpen, current, onSelect, onClose }: Props) {
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
        className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy">Sort by</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-1 mb-5">
          {sortByOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
            >
              <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selected === opt ? 'border-brand' : 'border-gray-300'
              }`}>
                {selected === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
              </span>
              <span className={selected === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
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
