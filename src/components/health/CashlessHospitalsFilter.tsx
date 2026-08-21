import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hospital, ChevronDown, Search, MapPin } from 'lucide-react'
import { cashlessHospitalOptions } from '../../data/healthOptions'
import { searchHospitals, type CashlessHospital } from '../../data/mockHealthPlans'
import { dropdownMotion } from '../../lib/motion'

interface Props {
  selected: number | null
  onSelect: (value: number | null) => void
}

export default function CashlessHospitalsFilter({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CashlessHospital[]>([])
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

  // Search hospitals when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchHospitals(searchQuery)
      setSearchResults(results.slice(0, 10)) // Limit to 10 results
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const label = selected !== null ? `${selected.toLocaleString()}+ Hospitals` : 'Cashless Hospitals'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
          selected !== null
            ? 'border-brand bg-brand/5 text-brand'
            : 'border-gray-200 text-navy hover:bg-gray-50'
        }`}
      >
        <Hospital className="h-3.5 w-3.5" />
        {label}
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
            {/* Minimum hospitals filter */}
            <div className="border-b border-gray-100 p-3">
              <p className="mb-2 text-xs font-semibold text-navy">Minimum cashless hospitals</p>
              <div className="flex flex-wrap gap-1.5">
                {cashlessHospitalOptions.map((opt) => {
                  const active = selected === opt.value
                  return (
                    <button
                      key={opt.label}
                      onClick={() => onSelect(opt.value)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                        active
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Hospital search */}
            <div className="p-3">
              <p className="mb-2 text-xs font-semibold text-navy">Search by hospitals</p>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital name or city"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs text-navy placeholder-gray-400 outline-none transition-colors focus:border-brand focus:bg-white"
                />
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="max-h-[200px] overflow-y-auto av-modal-scroll space-y-2">
                  {searchResults.map((hospital, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-100 p-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-brand/10">
                          <span className="text-[8px] font-bold text-brand">
                            {hospital.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-navy leading-tight">
                            {hospital.name}
                          </p>
                          <p className="mt-0.5 text-[9px] text-gray-400 leading-tight">
                            {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="py-4 text-center">
                  <MapPin className="mx-auto h-5 w-5 text-gray-300" />
                  <p className="mt-1 text-[10px] text-gray-400">
                    No hospitals found for "{searchQuery}"
                  </p>
                </div>
              )}

              {/* Initial state */}
              {searchQuery.trim().length < 2 && (
                <p className="py-2 text-center text-[10px] text-gray-400">
                  Type at least 2 characters to search hospitals
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
