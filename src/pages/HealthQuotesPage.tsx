import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Check,
  Star, ChevronDown, ChevronRight, ChevronLeft, X, MessageCircle,
  Gift, SlidersHorizontal, Award,
} from 'lucide-react'
import { useHealthProfile } from '../context/HealthProfileContext'
import { useHealthFilters } from '../context/HealthFiltersContext'
import { countActiveFilters } from '../context/HealthFiltersContext'
import { mockHealthPlans, groupByInsurer, filterHealthPlans } from '../data/mockHealthPlans'
import BrandMark from '../components/common/BrandMark'
import HealthPlanCard from '../components/health/HealthPlanCard'
import EditSearchDrawer from '../components/health/EditSearchDrawer'
import SortByModal from '../components/health/SortByModal'
import CoverModal from '../components/health/CoverModal'
import AllFiltersModal from '../components/health/AllFiltersModal'
import ImportantFeaturesFilter from '../components/health/ImportantFeaturesFilter'
import NewLaunchesFilter from '../components/health/NewLaunchesFilter'
import CashlessHospitalsFilter from '../components/health/CashlessHospitalsFilter'
import DiscountFilter from '../components/health/DiscountFilter'
import FilterChips from '../components/health/FilterChips'
import EmptyState from '../components/health/EmptyState'
import { HealthQuoteSidebar } from '../components/health/HealthQuoteSubpageLayout'
import HealthTrustFooter from '../components/common/HealthTrustFooter'
import logo from '../assets/images/av-logon.png'

export default function HealthQuotesPage() {
  const { state: profile } = useHealthProfile()
  const { state: filters, dispatch } = useHealthFilters()
  const [searchParams, setSearchParams] = useSearchParams()

  // Drawers/modals
  const [editSearchOpen, setEditSearchOpen] = useState(false)
  const [sortByOpen, setSortByOpen] = useState(false)
  const [coverOpen, setCoverOpen] = useState(false)
  const [allFiltersOpen, setAllFiltersOpen] = useState(false)

  // Compare
  const [compareIds, setCompareIds] = useState<string[]>([])

  // Expanded insurer groups
  const [expandedInsurers, setExpandedInsurers] = useState<Set<string>>(new Set())

  // Dismissed top banner
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Loading skeleton state
  const [isFiltering, setIsFiltering] = useState(false)

  // Sync filter state from URL on mount
  useEffect(() => {
    const cover = searchParams.get('cover')
    const sort = searchParams.get('sort')
    const features = searchParams.get('features')
    const isNew = searchParams.get('newLaunches')
    const cashlessMin = searchParams.get('cashlessMin')
    const discounts = searchParams.get('discounts')

    const payload: Record<string, unknown> = {}
    if (cover) payload.cover = cover
    if (sort) payload.sortBy = sort
    if (features) payload.importantFeatures = features.split(',')
    if (isNew === 'true') payload.isNewLaunches = true
    if (cashlessMin) payload.cashlessHospitalsMin = parseInt(cashlessMin)
    if (discounts) payload.selectedDiscounts = discounts.split(',')

    if (Object.keys(payload).length > 0) {
      dispatch({ type: 'SET_FILTERS', payload })
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync filter state to URL (debounced)
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.cover !== 'Recommended') params.set('cover', filters.cover)
    if (filters.sortBy !== 'By relevance') params.set('sort', filters.sortBy)
    if (filters.importantFeatures.length > 0) params.set('features', filters.importantFeatures.join(','))
    if (filters.isNewLaunches) params.set('newLaunches', 'true')
    if (filters.cashlessHospitalsMin !== null) params.set('cashlessMin', String(filters.cashlessHospitalsMin))
    if (filters.selectedDiscounts.length > 0) params.set('discounts', filters.selectedDiscounts.join(','))

    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  // Simulate loading when filters change
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 300)
    return () => clearTimeout(timer)
  }, [filters])

  // Filter + sort plans
  const filteredPlans = filterHealthPlans(mockHealthPlans, {
    cover: filters.cover,
    sortBy: filters.sortBy,
    premiumRange: filters.premiumRange,
    importantFeatures: filters.importantFeatures,
    isNewLaunches: filters.isNewLaunches,
    cashlessHospitalsMin: filters.cashlessHospitalsMin,
    selectedDiscounts: filters.selectedDiscounts,
    selectedInsurers: filters.selectedInsurers,
    waitingPeriod: filters.waitingPeriod,
    coPay: filters.coPay,
  })

  const groups = groupByInsurer(filteredPlans)

  // AI recommendation city
  const city = profile.city || 'your city'

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    )
  }

  const toggleExpandInsurer = (name: string) => {
    setExpandedInsurers((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const handleFilterChipRemove = (field: string, key: string) => {
    // Parse the field and value to determine how to remove it
    if (field === 'importantFeatures') {
      const featureLabel = key.replace('feat-', '')
      dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'importantFeatures', value: featureLabel })
    } else if (field === 'selectedDiscounts') {
      const discountLabel = key.replace('disc-', '')
      dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'selectedDiscounts', value: discountLabel })
    } else if (field === 'selectedInsurers') {
      const insurerLabel = key.replace('ins-', '')
      dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'selectedInsurers', value: insurerLabel })
    } else if (field === 'isNewLaunches') {
      dispatch({ type: 'SET_FIELD', key: 'isNewLaunches', value: false })
    } else if (field === 'cashlessHospitalsMin') {
      dispatch({ type: 'SET_FIELD', key: 'cashlessHospitalsMin', value: null })
    } else if (field === 'cover') {
      dispatch({ type: 'SET_FIELD', key: 'cover', value: 'Recommended' })
    } else if (field === 'sortBy') {
      dispatch({ type: 'SET_FIELD', key: 'sortBy', value: 'By relevance' })
    } else if (field === 'waitingPeriod') {
      dispatch({ type: 'SET_FIELD', key: 'waitingPeriod', value: 'No preference' })
    } else if (field === 'coPay') {
      dispatch({ type: 'SET_FIELD', key: 'coPay', value: 'No preference' })
    } else if (field === 'premiumRange') {
      dispatch({ type: 'SET_FIELD', key: 'premiumRange', value: 'No preference' })
    } else if (field === 'roomRentType') {
      dispatch({ type: 'SET_FIELD', key: 'roomRentType', value: '' })
    } else if (field === 'policyBenefits') {
      const benefitLabel = key.replace('ben-', '')
      dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'policyBenefits', value: benefitLabel })
    } else if (field === 'portability') {
      dispatch({ type: 'SET_FIELD', key: 'portability', value: '' })
    } else if (field === 'maternityWaitingPeriod') {
      dispatch({ type: 'SET_FIELD', key: 'maternityWaitingPeriod', value: '' })
    } else if (field === 'existingDiseaseWaitingPeriod') {
      dispatch({ type: 'SET_FIELD', key: 'existingDiseaseWaitingPeriod', value: '' })
    } else if (field === 'policyPeriod') {
      dispatch({ type: 'SET_FIELD', key: 'policyPeriod', value: '' })
    }
  }

  const handleClearAllFilters = () => {
    dispatch({ type: 'RESET' })
  }

  const activeFilterCount = countActiveFilters(filters)

  // AI chips
  const aiChips = [
    'Existing diseases covered from day 1',
    'Cover amount: Minimum Rs25 L',
    'No room rent limit',
    'Free health check-ups',
    'Consumables Coverage',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top banner ── */}
      {!bannerDismissed && (
        <div className="flex items-center justify-center gap-2 bg-green-cta/10 px-4 py-2.5 text-xs text-white">
          <Gift className="h-3.5 w-3.5" />
          <span className="font-medium">All premiums shown come with 0% GST</span>
          <button onClick={() => setBannerDismissed(true)} className="ml-2 text-white/60 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Black Header ── */}
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center">
              <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
            </a>
          </div>
          <button className="flex items-center gap-2 rounded-full border border-green-cta/40 bg-green-cta/15 px-4 py-2 text-xs font-semibold text-green-cta transition-colors hover:bg-green-cta/25">
            <MessageCircle className="h-3.5 w-3.5" />
            Talk to us
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-cta opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-cta" />
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* ── Left sidebar ── */}
        <HealthQuoteSidebar onEdit={() => setEditSearchOpen(true)} />
        {/* ── Main content ── */}
        <div className="min-w-0 flex-1">
          {/* Sticky filter bar */}
          <div className="sticky top-[60px] z-20 -mx-4 mb-2 flex items-center gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 scrollbar-hide">
            {/* Cover filter */}
            <CoverModal
              isOpen={coverOpen}
              current={filters.cover}
              onSelect={(val) => dispatch({ type: 'SET_FIELD', key: 'cover', value: val })}
              onClose={() => setCoverOpen(false)}
            />
            <button
              onClick={() => setCoverOpen(true)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                filters.cover !== 'Recommended'
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-navy hover:bg-gray-50'
              }`}
            >
              Cover
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {/* Sort by filter */}
            <button
              onClick={() => setSortByOpen(true)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                filters.sortBy !== 'By relevance'
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-navy hover:bg-gray-50'
              }`}
            >
              Sort by
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {/* Important features filter */}
            <ImportantFeaturesFilter
              selected={filters.importantFeatures}
              onToggle={(val) => dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'importantFeatures', value: val })}
              onClear={() => dispatch({ type: 'SET_FIELD', key: 'importantFeatures', value: [] })}
            />

            {/* New launches filter */}
            <NewLaunchesFilter
              active={filters.isNewLaunches}
              onToggle={() => dispatch({ type: 'SET_FIELD', key: 'isNewLaunches', value: !filters.isNewLaunches })}
            />

            {/* Cashless hospitals filter */}
            <CashlessHospitalsFilter
              selected={filters.cashlessHospitalsMin}
              onSelect={(val) => dispatch({ type: 'SET_FIELD', key: 'cashlessHospitalsMin', value: val })}
            />

            {/* Discount filter */}
            <DiscountFilter
              selected={filters.selectedDiscounts}
              onToggle={(val) => dispatch({ type: 'TOGGLE_ARRAY_ITEM', key: 'selectedDiscounts', value: val })}
              onClear={() => dispatch({ type: 'SET_FIELD', key: 'selectedDiscounts', value: [] })}
            />

            {/* All filters button */}
            <button
              onClick={() => setAllFiltersOpen(true)}
              className={`ml-auto flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-navy hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              All filters
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          <FilterChips
            filters={filters}
            onRemove={handleFilterChipRemove}
            onClearAll={handleClearAllFilters}
          />

          {/* Loading skeleton */}
          {isFiltering && (
            <div className="space-y-4 px-4 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
              ))}
            </div>
          )}

          {!isFiltering && (
            <>
              {/* AI recommendation banner */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-2xl border border-brand/20 bg-blueBG/50 p-5"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
                    <Sparkles className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Our AI Expert just found perfect match for you</p>
                    <p className="text-xs text-gray-500">
                      78% of families like yours in {city} buy plans with these features.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiChips.map((chip) => (
                    <span
                      key={chip}
                      className="flex items-center gap-1.5 rounded-full border border-green-cta/30 bg-green-cta/5 px-3 py-1.5 text-[11px] font-medium text-green-cta"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Plan list */}
              {filteredPlans.length === 0 ? (
                <EmptyState onReset={handleClearAllFilters} />
              ) : (
                <div className="space-y-4">
                  {groups.map((group, gi) => {
                    const first = group.plans[0]
                    const rest = group.plans.slice(1)
                    const expanded = expandedInsurers.has(group.insurerName)

                    return (
                      <div key={group.insurerName}>
                        {/* First plan */}
                        <HealthPlanCard
                          plan={first}
                          index={gi * 2}
                          featured={gi === 0}
                          isCompareSelected={compareIds.includes(first.id)}
                          onToggleCompare={toggleCompare}
                        />

                        {/* View more plans */}
                        {rest.length > 0 && (
                          <>
                            <button
                              onClick={() => toggleExpandInsurer(group.insurerName)}
                              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blueBG py-2.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
                            >
                              {expanded ? 'Hide' : `View ${rest.length} more plan${rest.length > 1 ? 's' : ''}`} from {group.insurerName}
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-4 pt-4">
                                    {rest.map((plan, i) => (
                                      <HealthPlanCard
                                        key={plan.id}
                                        plan={plan}
                                        index={i + 1}
                                        isCompareSelected={compareIds.includes(plan.id)}
                                        onToggleCompare={toggleCompare}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}

                        {/* Promo banner after first group */}
                        {gi === 0 && (
                          <div className="my-4 flex items-center justify-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-700">
                              AV Management Promise. Lowest Price Guarantee
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Newly launched plans carousel */}
              {!filters.isNewLaunches && mockHealthPlans.filter((p) => p.isNew).length > 0 && (
                <div className="mt-8 rounded-2xl bg-blueBG/50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-orange-tag" />
                      <h3 className="text-sm font-bold text-navy">Newly launched plans</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50">
                        <ChevronLeft className="h-4 w-4 text-navy" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50">
                        <ChevronRight className="h-4 w-4 text-navy" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {mockHealthPlans.filter((p) => p.isNew).map((plan) => (
                      <div
                        key={plan.id}
                        className="w-72 flex-shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <BrandMark name={plan.insurerName} size="sm" />
                          <div>
                            <p className="text-[10px] text-gray-400">{plan.insurerName}</p>
                            <p className="text-xs font-bold text-navy">{plan.planName}</p>
                          </div>
                        </div>
                        <div className="mb-3 space-y-1.5">
                          {plan.features.slice(0, 3).map((f, j) => (
                            <div key={j} className="flex items-start gap-1.5">
                              <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-cta" strokeWidth={3} />
                              <span className="text-[10px] leading-tight text-navy">{f.text}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mb-2 text-sm font-bold text-navy">Rs{plan.monthlyPremium.toLocaleString()}/month</p>
                        <button className="w-full rounded-lg bg-orange-tag py-2 text-[11px] font-bold text-white hover:bg-orange-tag/90">
                          Customize plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Floating compare bar ── */}
      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-3 shadow-lg"
          >
            <span className="text-sm font-bold text-navy">Compare ({compareIds.length})</span>
            <button className="rounded-xl bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark">
              Compare now
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating AI chat bubble ── */}
      <button className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg transition-transform hover:scale-105">
        <div className="absolute inset-0 rounded-full bg-brand animate-ping opacity-20" />
        <MessageCircle className="h-6 w-6 text-white" />
      </button>

      {/* ── Drawers & Modals ── */}
      <EditSearchDrawer isOpen={editSearchOpen} onClose={() => setEditSearchOpen(false)} />
      <SortByModal
        isOpen={sortByOpen}
        current={filters.sortBy}
        onSelect={(val) => dispatch({ type: 'SET_FIELD', key: 'sortBy', value: val })}
        onClose={() => setSortByOpen(false)}
      />
      <AllFiltersModal isOpen={allFiltersOpen} onClose={() => setAllFiltersOpen(false)} />

      <HealthTrustFooter />
    </div>
  )
}
