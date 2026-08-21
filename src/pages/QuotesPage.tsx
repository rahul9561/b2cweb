import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { SlidersHorizontal, ChevronDown, ArrowUpDown, Check } from 'lucide-react'
import { useUserProfile } from '../context/UserProfileContext'
import { useFilters } from '../context/FiltersContext'
import { mockPlans } from '../data/mockPlans'
import { lifeCoverPopoverOptions, coverTillPopoverOptions } from '../data/options'
import QuoteHeaderBar from '../components/quotes/QuoteHeaderBar'
import PlanCard from '../components/quotes/PlanCard'
import Sidebar from '../components/quotes/Sidebar'
import EditProfileDrawer from '../components/drawers/EditProfileDrawer'
import SortFilterModal from '../components/modals/SortFilterModal'
import FilterPickerPopover from '../components/common/FilterPickerPopover'
import LifeCoverPopoverContent from '../components/filters/LifeCoverPopoverContent'
import CoverTillPopoverContent from '../components/filters/CoverTillPopoverContent'

/* ────────────────────────────────────────────
   Reusable dropdown hook — handles open/close
   ──────────────────────────────────────────── */
function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggle = useCallback(() => setOpen((v) => !v), [])
  return { open, toggle, close: () => setOpen(false), ref }
}

export default function QuotesPage() {
  const { profile } = useUserProfile()
  const { filters, dispatch } = useFilters()
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [showSortFilter, setShowSortFilter] = useState(false)
  const [lifeCoverOpen, setLifeCoverOpen] = useState(false)
  const [coverTillOpen, setCoverTillOpen] = useState(false)

  const lifeCover = useDropdown()
  const coverTill = useDropdown()

  const birthdayDate = '15 Sep 2026'

  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let plans = [...mockPlans]

    if (filters.insurer.length > 0) {
      plans = plans.filter((p) => filters.insurer.includes(p.insurerName))
    }
    if (filters.planType.length > 0) {
      plans = plans.filter((p) => p.planType.some((t) => filters.planType.includes(t)))
    }
    if (filters.payoutOption.length > 0) {
      plans = plans.filter((p) => p.payoutOption.some((o) => filters.payoutOption.includes(o)))
    }
    if (filters.premiumPayType.length > 0) {
      plans = plans.filter((p) => p.premiumPayType.some((t) => filters.premiumPayType.includes(t)))
    }

    switch (filters.sortBy) {
      case 'Premium in 1st year : Low to High':
        plans.sort((a, b) => a.monthlyPremium - b.monthlyPremium)
        break
      case 'Premium in 1st year : High to Low':
        plans.sort((a, b) => b.monthlyPremium - a.monthlyPremium)
        break
      case 'Premium from 2nd year onwards : Low to High':
        plans.sort((a, b) => a.monthlyPremium * 0.95 - b.monthlyPremium * 0.95)
        break
      case 'Premium from 2nd year onwards : High to Low':
        plans.sort((a, b) => b.monthlyPremium * 0.95 - a.monthlyPremium * 0.95)
        break
      case 'Claim Settlement Ratio : High to Low':
        plans.sort((a, b) => b.claimSettled - a.claimSettled)
        break
      default:
        break
    }

    return plans
  }, [filters])

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.planType.length > 0) count++
    if (filters.payoutOption.length > 0) count++
    if (filters.insurer.length > 0) count++
    if (filters.premiumPayType.length > 0) count++
    return count
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <QuoteHeaderBar onEditProfile={() => setShowEditDrawer(true)} />

      {/* ─── Filter / Summary Bar ─── */}
      <div className="sticky top-[60px] z-30 bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-3 overflow-x-auto scrollbar-hide">
          {/* Sort/Filter button */}
          <button
            onClick={() => setShowSortFilter(true)}
            className="relative flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-navy hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Sort/Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 shrink-0" />

          {/* Life Cover popover trigger */}
          <div className="relative" ref={lifeCover.ref}>
            <button
              onClick={lifeCover.toggle}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-all whitespace-nowrap ${
                lifeCoverOpen
                  ? 'border-brand bg-brand/5 text-brand shadow-sm'
                  : 'border-gray-200 text-navy hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-400 text-[12px]">Life cover:</span>
              <span className="font-bold">{filters.lifeCover}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${lifeCoverOpen ? 'rotate-180' : ''}`} />
            </button>
            <FilterPickerPopover
              isOpen={lifeCoverOpen}
              onClose={() => setLifeCoverOpen(false)}
              title="Select Life Cover"
              leftList={lifeCoverPopoverOptions}
              currentValue={filters.lifeCover}
              onSelectLeft={(val) => dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: val })}
              rightPanel={
                <LifeCoverPopoverContent
                  selected={filters.lifeCover}
                  onSelect={(val) => dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: val })}
                />
              }
              footerLink={{ label: 'Enter custom amount', onClick: () => {} }}
            />
          </div>

          {/* Cover Till popover trigger */}
          <div className="relative" ref={coverTill.ref}>
            <button
              onClick={coverTill.toggle}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-all whitespace-nowrap ${
                coverTillOpen
                  ? 'border-brand bg-brand/5 text-brand shadow-sm'
                  : 'border-gray-200 text-navy hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-400 text-[12px]">Cover till:</span>
              <span className="font-bold">{filters.coverTillAge}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${coverTillOpen ? 'rotate-180' : ''}`} />
            </button>
            <FilterPickerPopover
              isOpen={coverTillOpen}
              onClose={() => setCoverTillOpen(false)}
              title="Select Cover Till Age"
              leftList={coverTillPopoverOptions}
              currentValue={filters.coverTillAge}
              onSelectLeft={(val) => dispatch({ type: 'SET_FIELD', field: 'coverTillAge', value: val })}
              rightPanel={
                <CoverTillPopoverContent
                  selected={filters.coverTillAge}
                  onSelect={(val) => dispatch({ type: 'SET_FIELD', field: 'coverTillAge', value: val })}
                />
              }
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 shrink-0" />

          {/* Monthly / Yearly toggle */}
          <div className="flex items-center gap-2.5">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'premiumFrequency', value: 'monthly' })}
                className={`px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  filters.premiumFrequency === 'monthly'
                    ? 'bg-brand text-white shadow-inner'
                    : 'bg-white text-navy hover:bg-gray-50'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'premiumFrequency', value: 'yearly' })}
                className={`px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  filters.premiumFrequency === 'yearly'
                    ? 'bg-brand text-white shadow-inner'
                    : 'bg-white text-navy hover:bg-gray-50'
                }`}
              >
                Yearly
              </button>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-cta whitespace-nowrap">
              <ArrowUpDown className="h-3 w-3" />
              Save 5%** on Yearly
            </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 shrink-0" />

          {/* Save upto 36% WITH LIMITED PAY */}
          <button
            onClick={() => {
              const hasLimited = filters.premiumPayType.includes('Limited Pay')
              const next = hasLimited
                ? filters.premiumPayType.filter((t) => t !== 'Limited Pay')
                : [...filters.premiumPayType, 'Limited Pay']
              dispatch({ type: 'SET_FIELD', field: 'premiumPayType', value: next })
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12px] font-semibold transition-all whitespace-nowrap ${
              filters.premiumPayType.includes('Limited Pay')
                ? 'border-orange-tag bg-orange-tagBg text-orange-tag'
                : 'border-gray-200 text-navy hover:bg-gray-50'
            }`}
          >
            Save upto 36% WITH LIMITED PAY
          </button>

          {/* Lifetime Discount checkbox */}
          <button
            onClick={() => dispatch({ type: 'SET_FIELD', field: 'lifetimeDiscount', value: !filters.lifetimeDiscount })}
            className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 transition-all whitespace-nowrap ${
              filters.lifetimeDiscount
                ? 'border-green-cta bg-green-tag/10'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-colors ${
              filters.lifetimeDiscount ? 'border-green-cta bg-green-cta' : 'border-gray-300'
            }`}>
              {filters.lifetimeDiscount && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-[12px] font-medium text-navy">Save upto ₹4K with Lifetime Discount</span>
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Birthday Banner */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-orange-tagBg border border-orange-tag/20 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎂</span>
            <div>
              <p className="text-sm font-semibold text-navy">Your Birthday Soon — Price increasing on {birthdayDate}</p>
              <p className="text-xs text-gray-500">Save upto ₹{Math.round(profile.annualIncome === '10 Lac to 14.9 Lac' ? 4200 : 3800).toLocaleString()}</p>
            </div>
          </div>
          <button className="text-sm font-bold text-brand hover:underline">→</button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400">Active filters:</span>
            {filters.planType.map((v) => (
              <FilterChip key={v} label={v} onRemove={() => dispatch({ type: 'SET_FIELD', field: 'planType', value: filters.planType.filter((x) => x !== v) })} />
            ))}
            {filters.payoutOption.map((v) => (
              <FilterChip key={v} label={v} onRemove={() => dispatch({ type: 'SET_FIELD', field: 'payoutOption', value: filters.payoutOption.filter((x) => x !== v) })} />
            ))}
            {filters.insurer.map((v) => (
              <FilterChip key={v} label={v} onRemove={() => dispatch({ type: 'SET_FIELD', field: 'insurer', value: filters.insurer.filter((x) => x !== v) })} />
            ))}
            {filters.premiumPayType.map((v) => (
              <FilterChip key={v} label={v} onRemove={() => dispatch({ type: 'SET_FIELD', field: 'premiumPayType', value: filters.premiumPayType.filter((x) => x !== v) })} />
            ))}
            <button
              onClick={() => dispatch({ type: 'CLEAR_ALL' })}
              className="text-[11px] font-semibold text-brand hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Plans List */}
          <div className="space-y-4">
            {filteredPlans.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-navy">No plans match your filters</p>
                <p className="mt-1 text-xs text-gray-400">Try adjusting your filter criteria</p>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_ALL' })}
                  className="mt-3 text-xs font-bold text-brand hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  premiumFrequency={filters.premiumFrequency}
                />
              ))
            )}

            {/* Disclaimers */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <button className="flex w-full items-center justify-between text-sm font-semibold text-navy">
                <span>Disclaimers⁺</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
                *Premiums shown are indicative and may vary based on your profile. All claims are subject to the terms and conditions of the respective insurer. AV Management is a facilitator and not an insurer.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[140px]">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <EditProfileDrawer isOpen={showEditDrawer} onClose={() => setShowEditDrawer(false)} />

      {/* Sort/Filter Modal */}
      <SortFilterModal isOpen={showSortFilter} onClose={() => setShowSortFilter(false)} />
    </div>
  )
}

/* ────────────────────────────────────────────
   Small removable filter chip
   ──────────────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[11px] font-medium text-brand">
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full p-0.5 hover:bg-brand/10 transition-colors">
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </span>
  )
}
