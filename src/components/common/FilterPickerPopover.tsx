import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface FilterPickerPopoverProps {
  isOpen: boolean
  onClose: () => void
  title: string
  leftList: string[]
  currentValue: string
  onSelectLeft: (val: string) => void
  rightPanel?: ReactNode
  footerLink?: { label: string; onClick: () => void }
  variant?: 'two-column' | 'dropdown'
}

export default function FilterPickerPopover({
  isOpen,
  onClose,
  title,
  leftList,
  currentValue,
  onSelectLeft,
  rightPanel,
  footerLink,
  variant = 'two-column',
}: FilterPickerPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`absolute left-0 top-full z-50 mt-2 ${variant === 'dropdown' ? 'w-[280px] max-w-[calc(100vw-2rem)]' : 'w-[680px] max-w-[calc(100vw-2rem)]'} overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-sm:fixed max-sm:inset-x-4 max-sm:top-20 max-sm:w-auto max-sm:max-w-none`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h3 className="text-sm font-bold text-navy">{title}</h3>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {variant === 'dropdown' ? (
            <div className="max-h-[320px] overflow-y-auto p-2">
              {leftList.map((opt) => {
                const active = currentValue === opt
                return (
                  <button
                    key={opt}
                    onClick={() => onSelectLeft(opt)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-left transition-all ${
                      active
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-navy hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <span className="text-[11px] font-semibold">✓</span>}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex max-h-[calc(100vh-9rem)] min-h-0 flex-col overflow-y-auto sm:min-h-[380px] sm:flex-row sm:overflow-visible">
              {/* Left column — scrollable list */}
              <div className="flex max-h-44 w-full flex-col border-b border-gray-100 bg-gray-50 sm:max-h-none sm:w-[220px] sm:border-b-0 sm:border-r">
                <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                  {leftList.map((opt) => {
                    const active = currentValue === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => onSelectLeft(opt)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] transition-colors ${
                          active
                            ? 'bg-white font-bold text-brand shadow-sm rounded-r-lg'
                            : 'text-navy hover:bg-white/60'
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>
                {footerLink && (
                  <div className="border-t border-gray-100 px-4 py-2.5">
                    <button onClick={footerLink.onClick} className="text-[12px] font-semibold text-brand hover:underline">
                      {footerLink.label}
                    </button>
                  </div>
                )}
              </div>

              {/* Right column — custom content */}
              <div className="flex-1 bg-blue-50/40 p-5">
                {rightPanel}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
