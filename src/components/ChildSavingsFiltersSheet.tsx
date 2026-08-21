import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ChildSavingsFilters {
  investmentAmount: number
  investmentPeriod: number
  childAge: number
  returnType: 'all' | 'guaranteed' | 'market-linked'
  sortBy: 'returns' | 'maturity' | 'premium'
}

interface FiltersSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: ChildSavingsFilters
  onApply: (filters: ChildSavingsFilters) => void
}

export default function ChildSavingsFiltersSheet({ isOpen, onClose, filters, onApply }: FiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState<ChildSavingsFilters>(filters)

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-lg font-bold text-navy">Filters</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6 pb-32">
              {/* Investment Amount */}
              <div>
                <label className="block text-sm font-bold text-navy mb-3">Investment Amount (Monthly)</label>
                <div className="space-y-2">
                  {[5000, 10000, 15000, 20000, 25000].map((amount) => (
                    <label key={amount} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="investment-amount"
                        checked={localFilters.investmentAmount === amount}
                        onChange={() => setLocalFilters({ ...localFilters, investmentAmount: amount })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">₹{amount.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Period */}
              <div>
                <label className="block text-sm font-bold text-navy mb-3">Investment Period (Years)</label>
                <div className="space-y-2">
                  {[5, 10, 15, 20].map((period) => (
                    <label key={period} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="investment-period"
                        checked={localFilters.investmentPeriod === period}
                        onChange={() => setLocalFilters({ ...localFilters, investmentPeriod: period })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">{period} Years</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Child Age */}
              <div>
                <label className="block text-sm font-bold text-navy mb-3">Child's Current Age</label>
                <div className="space-y-2">
                  {[0, 5, 10, 15, 18].map((age) => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="child-age"
                        checked={localFilters.childAge === age}
                        onChange={() => setLocalFilters({ ...localFilters, childAge: age })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">{age} Years {age === 0 ? '(Newborn)' : ''}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Return Type */}
              <div>
                <label className="block text-sm font-bold text-navy mb-3">Return Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'all' as const, label: 'All Plans' },
                    { value: 'guaranteed' as const, label: 'Guaranteed Returns' },
                    { value: 'market-linked' as const, label: 'Market Linked' },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="return-type"
                        checked={localFilters.returnType === value}
                        onChange={() => setLocalFilters({ ...localFilters, returnType: value })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-navy mb-3">Sort By</label>
                <div className="space-y-2">
                  {[
                    { value: 'returns' as const, label: 'Highest Returns' },
                    { value: 'maturity' as const, label: 'Highest Maturity Value' },
                    { value: 'premium' as const, label: 'Lowest Premium' },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sort-by"
                        checked={localFilters.sortBy === value}
                        onChange={() => setLocalFilters({ ...localFilters, sortBy: value })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setLocalFilters({
                    investmentAmount: 5000,
                    investmentPeriod: 10,
                    childAge: 0,
                    returnType: 'all',
                    sortBy: 'returns',
                  })
                }}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-navy font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
