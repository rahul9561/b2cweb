import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { importantFeatureCategories } from '../../data/healthOptions'
import { dropdownMotion } from '../../lib/motion'

interface Props {
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

export default function ImportantFeaturesFilter({ selected, onToggle, onClear }: Props) {
  const [open, setOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
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

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat)
  }

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
        Important features
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
            className="absolute top-full left-0 z-40 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h4 className="text-sm font-bold text-navy">Important features</h4>
              {selected.length > 0 && (
                <button onClick={onClear} className="text-xs font-semibold text-brand hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="max-h-[400px] overflow-y-auto av-modal-scroll">
              {importantFeatureCategories.map((cat) => {
                const isExpanded = expandedCategory === cat.category
                const selectedInCat = cat.options.filter((o) => selected.includes(o.value))

                return (
                  <div key={cat.category} className="border-b border-gray-50 last:border-b-0">
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(cat.category)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-navy">{cat.category}</span>
                          {selectedInCat.length > 0 && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                              {selectedInCat.length}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[10px] text-gray-400">{cat.description}</p>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Options */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gray-50 px-4 py-2">
                            {cat.options.map((opt) => {
                              const active = selected.includes(opt.value)
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => onToggle(opt.value)}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white"
                                >
                                  <span
                                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                                      active
                                        ? 'border-brand bg-brand text-white'
                                        : 'border-gray-300 bg-white'
                                    }`}
                                  >
                                    {active && <span className="text-[8px] font-bold">✓</span>}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      active ? 'font-semibold text-navy' : 'text-gray-600'
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            {selected.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400">
                  Plans matching all {selected.length} selected features will be shown
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
