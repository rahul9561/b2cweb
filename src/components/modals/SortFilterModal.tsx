import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useFilters } from '../../context/FiltersContext'
import {
  sortOptions,
  planTypeOptions,
  payoutOptions,
  insurerOptions,
  premiumPayTypeOptions,
} from '../../data/options'
import Button from '../common/Button'

interface SortFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

const tabs = [
  { key: 'sort', label: 'Sort', subtitle: 'Popularity' },
  { key: 'planType', label: 'Plan type', subtitle: '' },
  { key: 'payout', label: 'Payout options', subtitle: '' },
  { key: 'insurer', label: 'Insurer', subtitle: '' },
  { key: 'premiumPay', label: 'Premium pay type', subtitle: '' },
]

export default function SortFilterModal({ isOpen, onClose }: SortFilterModalProps) {
  const { filters, dispatch } = useFilters()
  const [activeTab, setActiveTab] = useState('sort')
  const [localSort, setLocalSort] = useState(filters.sortBy)
  const [localPlanType, setLocalPlanType] = useState<string[]>([...filters.planType])
  const [localPayout, setLocalPayout] = useState<string[]>([...filters.payoutOption])
  const [localInsurer, setLocalInsurer] = useState<string[]>([...filters.insurer])
  const [localPremiumPay, setLocalPremiumPay] = useState<string[]>([...filters.premiumPayType])

  useEffect(() => {
    if (isOpen) {
      setLocalSort(filters.sortBy)
      setLocalPlanType([...filters.planType])
      setLocalPayout([...filters.payoutOption])
      setLocalInsurer([...filters.insurer])
      setLocalPremiumPay([...filters.premiumPayType])
      setActiveTab('sort')
    }
  }, [isOpen, filters])

  const handleApply = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        sortBy: localSort,
        planType: localPlanType,
        payoutOption: localPayout,
        insurer: localInsurer,
        premiumPayType: localPremiumPay,
      },
    })
    onClose()
  }

  const handleClearAll = () => {
    setLocalSort('Popularity')
    setLocalPlanType([])
    setLocalPayout([])
    setLocalInsurer([])
    setLocalPremiumPay([])
  }

  const toggleMulti = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value))
    } else {
      setArr([...arr, value])
    }
  }

  const getTabSubtitle = (key: string): string => {
    switch (key) {
      case 'sort':
        return localSort
      case 'planType':
        return localPlanType.length > 0 ? `${localPlanType.length} selected` : ''
      case 'payout':
        return localPayout.length > 0 ? `${localPayout.length} selected` : ''
      case 'insurer':
        return localInsurer.length > 0 ? `${localInsurer.length} selected` : ''
      case 'premiumPay':
        return localPremiumPay.length > 0 ? `${localPremiumPay.length} selected` : ''
      default:
        return ''
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex w-full max-w-[850px] rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[80vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Left tabs */}
            <div className="w-56 border-r border-gray-200 bg-gray-50 p-4">
              <h3 className="text-lg font-bold text-navy mb-4">Sort/Filter</h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key
                  const subtitle = getTabSubtitle(tab.key)
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex flex-col items-start rounded-lg px-4 py-3 text-left transition-all ${
                        isActive
                          ? 'border-l-4 border-brand bg-white text-brand shadow-sm'
                          : 'border-l-4 border-transparent text-gray-500 hover:bg-white/50'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isActive ? 'text-brand' : 'text-navy'}`}>
                        {tab.label}
                      </span>
                      {subtitle && (
                        <span className="text-[10px] text-gray-400 mt-0.5">{subtitle}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Sort tab */}
              {activeTab === 'sort' && (
                <div className="space-y-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLocalSort(opt)}
                      className={`flex items-center gap-3 w-full rounded-xl border px-5 py-3.5 text-left transition-all ${
                        localSort === opt
                          ? 'border-brand bg-brand/5 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          localSort === opt ? 'border-brand' : 'border-gray-300'
                        }`}
                      >
                        {localSort === opt && (
                          <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-navy">{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Plan type tab */}
              {activeTab === 'planType' && (
                <div className="space-y-2">
                  {planTypeOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                          localPlanType.includes(opt) ? 'border-brand bg-brand' : 'border-gray-300'
                        }`}
                      >
                        {localPlanType.includes(opt) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={localPlanType.includes(opt)}
                        onChange={() => toggleMulti(localPlanType, setLocalPlanType, opt)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-navy">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Payout options tab */}
              {activeTab === 'payout' && (
                <div className="space-y-2">
                  {payoutOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                          localPayout.includes(opt) ? 'border-brand bg-brand' : 'border-gray-300'
                        }`}
                      >
                        {localPayout.includes(opt) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={localPayout.includes(opt)}
                        onChange={() => toggleMulti(localPayout, setLocalPayout, opt)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-navy">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Insurer tab */}
              {activeTab === 'insurer' && (
                <div className="space-y-2">
                  {insurerOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                          localInsurer.includes(opt) ? 'border-brand bg-brand' : 'border-gray-300'
                        }`}
                      >
                        {localInsurer.includes(opt) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={localInsurer.includes(opt)}
                        onChange={() => toggleMulti(localInsurer, setLocalInsurer, opt)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-navy">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Premium pay type tab */}
              {activeTab === 'premiumPay' && (
                <div className="space-y-2">
                  {premiumPayTypeOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                          localPremiumPay.includes(opt) ? 'border-brand bg-brand' : 'border-gray-300'
                        }`}
                      >
                        {localPremiumPay.includes(opt) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={localPremiumPay.includes(opt)}
                        onChange={() => toggleMulti(localPremiumPay, setLocalPremiumPay, opt)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-navy">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-gray-500 hover:text-brand transition-colors"
              >
                Clear all
              </button>
              <Button onClick={handleApply} size="md">
                Apply
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
