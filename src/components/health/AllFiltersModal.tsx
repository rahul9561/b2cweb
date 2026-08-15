import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { fadeScale } from '../../lib/motion'
import { useHealthFilters } from '../../context/HealthFiltersContext'
import {
  filterTabs,
  premiumRangeOptions,
  coverOptions,
  sortByOptions,
  importantFeatureOptions,
  cashlessHospitalOptions,
  insurerOptions,
  waitingPeriodOptions,
  coPayOptions,
  type FilterTab,
} from '../../data/healthOptions'
import { filterHealthPlans, mockHealthPlans } from '../../data/mockHealthPlans'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AllFiltersModal({ isOpen, onClose }: Props) {
  const { state: filters, dispatch } = useHealthFilters()
  const [activeTab, setActiveTab] = useState<FilterTab>('Sort by')

  // Local draft state (applied on "Show plans")
  const [draft, setDraft] = useState({ ...filters })

  const updateDraft = (key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayDraft = (key: 'importantFeatures' | 'selectedDiscounts' | 'selectedInsurers' | 'policyBenefits', value: string) => {
    setDraft((prev) => {
      const arr = prev[key] as string[]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  // Live plan count
  const matchingPlans = filterHealthPlans(mockHealthPlans, {
    cover: draft.cover,
    sortBy: draft.sortBy,
    premiumRange: draft.premiumRange,
    importantFeatures: draft.importantFeatures,
    isNewLaunches: draft.isNewLaunches,
    cashlessHospitalsMin: draft.cashlessHospitalsMin,
    selectedDiscounts: draft.selectedDiscounts,
    selectedInsurers: draft.selectedInsurers,
    waitingPeriod: draft.waitingPeriod,
    coPay: draft.coPay,
  })

  const applyFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: draft })
    onClose()
  }

  const clearFilters = () => {
    setDraft({
      cover: 'Recommended',
      sortBy: 'By relevance',
      roomRentType: '',
      policyBenefits: [],
      premiumRange: 'No preference',
      portability: '',
      maternityWaitingPeriod: '',
      existingDiseaseWaitingPeriod: '',
      policyPeriod: '',
      importantFeatures: [],
      isNewLaunches: false,
      cashlessHospitalsMin: null,
      selectedDiscounts: [],
      selectedInsurers: [],
      waitingPeriod: 'No preference',
      coPay: 'No preference',
    })
  }

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
        className="relative z-10 mx-4 flex h-[80vh] max-h-[600px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-navy">All filters</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left tabs */}
          <div className="w-48 flex-shrink-0 overflow-y-auto border-r border-gray-100 bg-gray-50">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full border-r-2 px-4 py-3 text-left text-[13px] transition-colors ${
                  activeTab === tab
                    ? 'border-brand bg-white font-bold text-brand'
                    : 'text-gray-500 hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'Sort by' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Choose how to sort the plans</p>
                    {sortByOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('sortBy', opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.sortBy === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.sortBy === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.sortBy === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Cover' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select your cover amount</p>
                    {coverOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('cover', opt)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            draft.cover === opt ? 'border-brand' : 'border-gray-300'
                          }`}>
                            {draft.cover === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                          </span>
                          <span className={draft.cover === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                        </span>
                        {opt === 'Rs10-24 Lakh' && (
                          <span className="rounded-full bg-purple2/10 px-2 py-0.5 text-[9px] font-bold text-purple2">
                            Most popular
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Premium (per month)' && (
                  <div>
                    <p className="mb-1 text-xs text-gray-400">This is the amount that you pay for buying the health insurance for 1 year policy period</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {premiumRangeOptions.map((opt) => {
                        const active = draft.premiumRange === opt
                        return (
                          <button
                            key={opt}
                            onClick={() => updateDraft('premiumRange', opt)}
                            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left text-xs font-medium transition-all ${
                              active
                                ? 'border-brand bg-brand/5 text-brand'
                                : 'border-gray-200 text-navy hover:border-gray-300'
                            }`}
                          >
                            <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              active ? 'border-brand' : 'border-gray-300'
                            }`}>
                              {active && <span className="h-2 w-2 rounded-full bg-brand" />}
                            </span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'Important Features' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select features that matter to you (plans with ALL selected features will be shown)</p>
                    {importantFeatureOptions.map((opt) => {
                      const active = draft.importantFeatures.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleArrayDraft('importantFeatures', opt)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
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
                )}

                {activeTab === 'Cashless Hospitals' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Minimum number of cashless hospitals in the network</p>
                    {cashlessHospitalOptions.map((opt) => {
                      const active = draft.cashlessHospitalsMin === opt.value
                      return (
                        <button
                          key={opt.label}
                          onClick={() => updateDraft('cashlessHospitalsMin', opt.value)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                        >
                          <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            active ? 'border-brand' : 'border-gray-300'
                          }`}>
                            {active && <span className="h-2 w-2 rounded-full bg-brand" />}
                          </span>
                          <span className={active ? 'font-semibold text-navy' : 'text-gray-500'}>{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'Insurer' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select preferred insurance companies</p>
                    {insurerOptions.map((opt) => {
                      const active = draft.selectedInsurers.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleArrayDraft('selectedInsurers', opt)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
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
                )}

                {activeTab === 'Waiting period' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Maximum waiting period for pre-existing diseases</p>
                    {waitingPeriodOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('waitingPeriod', opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.waitingPeriod === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.waitingPeriod === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.waitingPeriod === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Co-pay' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Co-pay means you pay a percentage of the claim amount</p>
                    {coPayOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('coPay', opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.coPay === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.coPay === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.coPay === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Room rent type' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select room rent preference</p>
                    {['No preference', 'Single Private AC Room', 'Twin Sharing Room', 'Any room'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('roomRentType', draft.roomRentType === opt ? '' : opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.roomRentType === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.roomRentType === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.roomRentType === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Policy Benefits' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select desired policy benefits</p>
                    {['No Room Rent Limit', 'Pre & Post Hospitalization', 'AYUSH Treatment', 'Day Care Procedures', 'Domiciliary Hospitalization', 'Consumables Coverage'].map((opt) => {
                      const active = draft.policyBenefits.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleArrayDraft('policyBenefits', opt)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
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
                )}

                {activeTab === 'Portability' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Portability options</p>
                    {['No preference', 'Yes', 'No'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('portability', draft.portability === opt ? '' : opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.portability === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.portability === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.portability === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Maternity cover waiting period' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Maternity waiting period</p>
                    {['No preference', 'No maternity cover', '2 Years', '3 Years', '4 Years'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('maternityWaitingPeriod', draft.maternityWaitingPeriod === opt ? '' : opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.maternityWaitingPeriod === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.maternityWaitingPeriod === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.maternityWaitingPeriod === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Existing disease waiting period' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Existing disease waiting period</p>
                    {['No preference', 'No waiting period', '1 Year', '2 Years', '3 Years', '4 Years'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('existingDiseaseWaitingPeriod', draft.existingDiseaseWaitingPeriod === opt ? '' : opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.existingDiseaseWaitingPeriod === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.existingDiseaseWaitingPeriod === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.existingDiseaseWaitingPeriod === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'Policy Period' && (
                  <div className="space-y-1">
                    <p className="mb-3 text-xs text-gray-400">Select policy period</p>
                    {['No preference', '1 Year', '2 Years', '3 Years'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateDraft('policyPeriod', draft.policyPeriod === opt ? '' : opt)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          draft.policyPeriod === opt ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {draft.policyPeriod === opt && <span className="h-2 w-2 rounded-full bg-brand" />}
                        </span>
                        <span className={draft.policyPeriod === opt ? 'font-semibold text-navy' : 'text-gray-500'}>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <button onClick={clearFilters} className="text-sm font-semibold text-brand hover:underline">
            Clear filters
          </button>
          <button
            onClick={applyFilters}
            className="active:scale-[0.98] rounded-xl bg-orange-tag px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-tag/90"
          >
            Show {matchingPlans.length} plans
          </button>
        </div>
      </motion.div>
    </div>
  )
}
