import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Headphones } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import { childSavingsPlans, type ChildSavingsPlan } from '../data/childSavingsPlans'
import ChildSavingsPlanCard from '../components/ChildSavingsPlanCard'
import ChildSavingsPlanDrawer from '../components/ChildSavingsPlanDrawer'
import ChildSavingsFiltersSheet, { type ChildSavingsFilters } from '../components/ChildSavingsFiltersSheet'

interface ChildDetailsState {
  childAge: number
  investmentAmount: number
  investmentPeriod: number
  returnPreference: string
}

export default function ChildSavingsPlanListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const childDetails = location.state?.childDetails as ChildDetailsState | undefined

  const [selectedPlan, setSelectedPlan] = useState<ChildSavingsPlan | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  const [filters, setFilters] = useState<ChildSavingsFilters>({
    investmentAmount: childDetails?.investmentAmount || 5000,
    investmentPeriod: childDetails?.investmentPeriod || 10,
    childAge: childDetails?.childAge || 0,
    returnType: childDetails?.returnPreference || 'all',
    sortBy: 'returns',
  })

  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let result = childSavingsPlans.filter((plan) => {
      // Filter by child age
      if (
        filters.childAge < plan.investmentCriteria.minAge ||
        filters.childAge > plan.investmentCriteria.maxAge
      ) {
        return false
      }

      // Filter by return type
      if (filters.returnType !== 'all') {
        const isGuaranteed = plan.planName.includes('Guarantee')
        if (filters.returnType === 'guaranteed' && !isGuaranteed) return false
        if (filters.returnType === 'market-linked' && isGuaranteed) return false
      }

      return true
    })

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'returns') return b.returns6yr - a.returns6yr
      if (filters.sortBy === 'maturity') return b.maturityPayoutYou - a.maturityPayoutYou
      if (filters.sortBy === 'premium') return (
        a.investmentCriteria.minAmount - b.investmentCriteria.minAmount
      )
      return 0
    })

    return result
  }, [filters])

  const handleViewDetails = (plan: ChildSavingsPlan) => {
    setSelectedPlan(plan)
    setDrawerOpen(true)
  }

  const handleApplyFilters = (newFilters: ChildSavingsFilters) => {
    setFilters(newFilters)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
              <Headphones size={16} />
              Talk to an Expert
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border-2 border-blue-400 text-blue-400 font-bold text-sm rounded-lg hover:bg-blue-400/10 transition-colors"
            >
              ✎ Edit Details
            </button>
          </div>
        </div>
      </header>

      {/* Details Summary */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-600 font-medium">Child Age</p>
              <p className="text-lg font-bold text-navy">{childDetails?.childAge || 0} Years</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Investment Amount</p>
              <p className="text-lg font-bold text-navy">₹{(childDetails?.investmentAmount || 5000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Investment Period</p>
              <p className="text-lg font-bold text-navy">{childDetails?.investmentPeriod || 10} Years</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Plans Found</p>
              <p className="text-lg font-bold text-blue-600">{filteredPlans.length} Plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-600">FILTERS:</span>

            <button
              onClick={() => setFiltersOpen(true)}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              Investment Amount: ₹{filters.investmentAmount.toLocaleString()}
              <ChevronDown size={16} />
            </button>

            <button
              onClick={() => setFiltersOpen(true)}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              Invest For: {filters.investmentPeriod} Years
              <ChevronDown size={16} />
            </button>

            <button
              onClick={() => setFiltersOpen(true)}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              Return Type:{' '}
              {filters.returnType === 'all' ? 'All' : filters.returnType === 'guaranteed' ? 'Guaranteed' : 'Market Linked'}
              <ChevronDown size={16} />
            </button>

            <button
              onClick={() => setFiltersOpen(true)}
              className="px-4 py-2 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              Sort: {filters.sortBy === 'returns' ? 'Highest Returns' : filters.sortBy === 'maturity' ? 'Maturity' : 'Premium'}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="space-y-6">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan, idx) => (
              <div key={plan.id}>
                <ChildSavingsPlanCard
                  plan={plan}
                  onViewDetails={handleViewDetails}
                  isExpanded={expandedIndex === idx}
                  onToggleExpand={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  hiddenChildrenCount={plan.children?.length || 0}
                />

                {/* Expanded Children */}
                {expandedIndex === idx && plan.children && (
                  <div className="mt-4 space-y-4 ml-4 border-l-2 border-blue-300 pl-4">
                    {plan.children.map((childPlan) => (
                      <ChildSavingsPlanCard
                        key={childPlan.id}
                        plan={childPlan}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-lg font-bold text-slate-700 mb-2">No plans found</p>
              <p className="text-sm text-slate-600">Try adjusting your filters to see more plans</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="rounded-lg bg-white border-2 border-slate-200 overflow-hidden">
          <button
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <h3 className="font-bold text-navy">Disclaimers & Important Information</h3>
            {disclaimerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {disclaimerOpen && (
            <div className="border-t border-slate-200 px-6 py-4 space-y-4 text-sm text-slate-700 bg-slate-50">
              <section>
                <h4 className="font-bold text-navy mb-2">Tax Benefits Disclaimer</h4>
                <p>
                  Tax benefits under Section 80C, 80CCC, and other sections are subject to the conditions and limits specified in the Income Tax Act. Please consult with a tax advisor for accurate tax planning.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-navy mb-2">Market-Linked Returns</h4>
                <p>
                  Market-linked returns are subject to market risks. Past performance is not indicative of future results. The value of investments can go up or down.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-navy mb-2">Guaranteed Returns</h4>
                <p>
                  Guaranteed returns are assured by the insurer. However, returns on market-linked portions are subject to market conditions.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-navy mb-2">Life Cover</h4>
                <p>
                  Life cover mentioned is inbuilt and does not require additional premiums. Life cover is available throughout the policy term as long as premiums are paid regularly.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-navy mb-2">Terms & Conditions</h4>
                <p>
                  These plans are subject to the terms and conditions specified in the policy document. Please read the full policy document before purchase.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-navy mb-2">IRDAI Registration</h4>
                <p>
                  All insurers mentioned are registered with the Insurance Regulatory and Development Authority of India (IRDAI). IRDAI Registration Numbers are available on their respective websites.
                </p>
              </section>

              <section className="pt-4 border-t border-slate-300">
                <p className="text-xs text-slate-500">
                  © Copyright 2024. All Rights Reserved. | For more information, visit individual insurer websites.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Plan Details Drawer */}
      <ChildSavingsPlanDrawer
        plan={selectedPlan}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedPlan(null)
        }}
      />

      {/* Filters Sheet */}
      <ChildSavingsFiltersSheet
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </main>
  )
}
