import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Percent, ChevronDown } from 'lucide-react'
import { discountTypeOptions } from '../../data/healthOptions'
import { dropdownMotion } from '../../lib/motion'

interface Props {
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

export default function DiscountFilter({ selected, onToggle, onClear }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', escHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', escHandler)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
          selected.length > 0
            ? 'border-brand bg-brand/5 text-brand'
            : 'border-gray-200 text-navy hover:bg-gray-50'
        }`}
      >
        <Percent className="h-3.5 w-3.5" />
        Discount
        {selected.length > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 z-40 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h4 className="text-sm font-bold text-navy">Discounts</h4>
              {selected.length > 0 && (
                <button onClick={onClear} className="text-xs font-semibold text-brand hover:underline">
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-[280px] overflow-y-auto av-modal-scroll p-2">
              {discountTypeOptions.map((opt) => {
                const active = selected.includes(opt)
                return (
                  <button
                    key={opt}
                    onClick={() => onToggle(opt)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      active ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {active && <span className="text-[8px] font-bold">✓</span>}
                    </span>
                    <span className={active ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
