import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Star, FileText, Phone } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import SearchDetailsDrawer from '../components/home-insurance/SearchDetailsDrawer'
import {
  homePlans,
  POLICY_TERMS,
  CONSTRUCTION_YEAR_RANGES,
  ADDONS_CONFIG,
  formatINR,
} from '../data/homeInsurance'

export default function HomePlanListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    buildingValue?: number
    householdItems?: number
    propertyLocation?: string
    fullName?: string
    mobile?: string
  } | null

  const fullName = state?.fullName || 'The Developer'
  const mobile = state?.mobile || 'XXXXXX9007'
  const buildingValue = state?.buildingValue || 75000000
  const householdItems = state?.householdItems || 10000000
  const city = state?.propertyLocation || 'Lucknow'

  // Search drawer state
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false)
  const [leadData, setLeadData] = useState({
    fullName,
    mobile,
    city,
    buildingValue,
    householdItems,
  })

  // Filter states
  const [selectedPolicyTerm, setSelectedPolicyTerm] = useState(10)
  const [selectedConstructionYear, setSelectedConstructionYear] = useState('2021-26')
  const [buy20YearToggle, setBuy20YearToggle] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [policyTermDropdownOpen, setPolicyTermDropdownOpen] = useState(false)
  const [constructionYearDropdownOpen, setConstructionYearDropdownOpen] = useState(false)

  // Effective policy term (can be 20 if toggle is on)
  const effectivePolicyTerm = buy20YearToggle ? 20 : selectedPolicyTerm

  // Filter plans based on selected filters
  const filteredPlans = useMemo(() => {
    return homePlans.filter((plan) => {
      // Match policy term (or allow plans close to the selection)
      const termMatch = plan.policyTermYears === effectivePolicyTerm || 
        (effectivePolicyTerm === 20 && plan.policyTermYears === 20)
      
      // For now, allow all construction years (in real app would filter by plan.constructionYearRange)
      const constructionMatch = true

      return termMatch && constructionMatch
    })
  }, [effectivePolicyTerm])

  const handlePolicyTermChange = (term: number) => {
    setSelectedPolicyTerm(term)
    setBuy20YearToggle(false)
    setPolicyTermDropdownOpen(false)
  }

  const handleBuy20YearToggle = () => {
    if (!buy20YearToggle) {
      setSelectedPolicyTerm(20)
    }
    setBuy20YearToggle(!buy20YearToggle)
  }

  const handleSearchSave = (data: typeof leadData) => {
    setLeadData(data)
  }

  const handleAddonChange = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId))
    } else {
      setSelectedAddons([...selectedAddons, addonId])
    }
  }

  const handleClearAllAddons = () => {
    setSelectedAddons([])
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      {/* Top Summary Bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-[13px] text-slate-700">
            <span className="font-semibold">{leadData.fullName}</span> | {leadData.mobile} |{' '}
            <span className="font-semibold">{formatINR(leadData.buildingValue).slice(1)}</span> | {' '}
            <span className="font-semibold">{formatINR(leadData.householdItems).slice(1)}</span> | {leadData.city}
          </span>
          <button
            onClick={() => setSearchDrawerOpen(true)}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            Edit ›
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left Sidebar - Add-ons */}
          <div className="space-y-6 lg:col-span-1">
            {/* Add-ons Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-navy">Add ons</h3>
                {selectedAddons.length > 0 && (
                  <button
                    onClick={handleClearAllAddons}
                    className="text-[12px] font-semibold text-brand hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {ADDONS_CONFIG.filter((a) => a.category === 'addon').map((addon) => {
                  const isDisabled =
                    addon.enabledForTerms && !addon.enabledForTerms.includes(effectivePolicyTerm)

                  return (
                    <div
                      key={addon.id}
                      className={`flex items-start gap-3 ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <input
                        type="checkbox"
                        id={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => handleAddonChange(addon.id)}
                        disabled={isDisabled}
                        className="mt-1 accent-brand disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor={addon.id}
                        className={`flex-1 cursor-pointer text-[13px] ${
                          isDisabled ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {addon.label}
                      </label>
                      <ChevronDown size={14} className="mt-1 text-slate-400" />
                      {isDisabled && addon.note && (
                        <div className="text-[11px] text-slate-500 italic col-span-full">
                          ⓘ {addon.note}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional Coverage Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[14px] font-bold text-navy">Additional Coverage</h3>
              <div className="space-y-3">
                {ADDONS_CONFIG.filter((a) => a.category === 'coverage').map((addon) => {
                  const isDisabled =
                    addon.enabledForTerms && !addon.enabledForTerms.includes(effectivePolicyTerm)

                  return (
                    <div
                      key={addon.id}
                      className={`flex items-start gap-3 ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <input
                        type="checkbox"
                        id={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => handleAddonChange(addon.id)}
                        disabled={isDisabled}
                        className="mt-1 accent-brand disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor={addon.id}
                        className={`flex-1 cursor-pointer text-[13px] ${
                          isDisabled ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {addon.label}
                      </label>
                      {isDisabled && addon.note && (
                        <span className="text-[10px] text-slate-500">ⓘ {addon.note}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Filter Row */}
            <div className="mb-6 flex flex-wrap gap-3">
              {/* Policy Term Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPolicyTermDropdownOpen(!policyTermDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:border-slate-400"
                >
                  Policy Term: {selectedPolicyTerm} Years
                  <ChevronDown size={14} />
                </button>
                {policyTermDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                    {POLICY_TERMS.map((term) => (
                      <label
                        key={term}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name="policy-term"
                          checked={selectedPolicyTerm === term}
                          onChange={() => handlePolicyTermChange(term)}
                          className="accent-brand"
                        />
                        <span className="text-[13px] text-slate-700">{term} Year{term !== 1 ? 's' : ''}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Construction Year Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setConstructionYearDropdownOpen(!constructionYearDropdownOpen)
                  }
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:border-slate-400"
                >
                  Construction: {selectedConstructionYear}
                  <ChevronDown size={14} />
                </button>
                {constructionYearDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                    {CONSTRUCTION_YEAR_RANGES.map((range) => (
                      <label
                        key={range.value}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name="construction-year"
                          checked={selectedConstructionYear === range.value}
                          onChange={() => {
                            setSelectedConstructionYear(range.value)
                            setConstructionYearDropdownOpen(false)
                          }}
                          className="accent-brand"
                        />
                        <span className="text-[13px] text-slate-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Buy 20 Year Toggle */}
              <label className="flex items-center gap-2 rounded-full border-2 border-green-500 bg-white px-4 py-2 cursor-pointer hover:bg-green-50">
                <input
                  type="checkbox"
                  checked={buy20YearToggle}
                  onChange={handleBuy20YearToggle}
                  className="accent-green-500"
                />
                <span className="text-[13px] font-medium text-green-700">
                  Buy for 20 yrs — Save upto 25%#
                </span>
              </label>
            </div>

            {/* Plan List Header */}
            <div className="mb-4">
              <p className="text-[14px]">
                <span className="font-bold">{filteredPlans.length}</span>{' '}
                <span className="font-semibold">Plan(s)</span>
              </p>
              <p className="text-[12px] text-slate-500">All premiums are inclusive of GST</p>
            </div>

            {/* Plans */}
            <div className="space-y-4">
              {filteredPlans.map((plan, idx) => (
                <PlanCard
                  key={idx}
                  plan={plan}
                  buildingValue={leadData.buildingValue}
                  householdItems={leadData.householdItems}
                  onSelect={() =>
                    navigate('/home-insurance/owner-details', {
                      state: {
                        plan,
                        leadData,
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Checkout Extra Plans Sections */}
            <CollapsiblePlanSection title="Checkout extra plans in 20 Yr Term" defaultOpen={true} />
            <CollapsiblePlanSection title="Checkout extra plans in 5 Yr Term" defaultOpen={false} />

            {/* Trust Banner */}
            <div className="mt-6 rounded-xl border-2 border-green-500 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🏦</div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800">
                    Accepted by all Banks | As per RBI &amp; IRDAI
                  </p>
                  <p className="mt-2 text-[13px] text-slate-700">
                    As per RBI &amp; IRDAI guidelines, users are free to purchase home insurance from any
                    insurer or platform. Policies purchased on AV Management are accepted by banks for
                    loan compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <Disclaimer />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            {/* Home Loan Promo Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-[14px] font-bold text-navy mb-2">
                Don't let your Home Loan become a debt for your family.
              </h4>
              <p className="text-[12px] text-slate-600 mb-4">
                Protect your family's future with our comprehensive home loan protection plans.
              </p>
              <button className="text-[12px] font-semibold text-brand hover:underline">
                View Loan Protection Plans ›
              </button>
            </div>

            {/* News Carousel Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">MID-DAY</p>
              <h4 className="text-[13px] font-bold text-navy mb-3">
                Mumbai fire breaks out after suspected AC blast; 10 rescued
              </h4>
              <div className="mb-3 h-32 rounded-lg bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-[12px]">Image placeholder</span>
              </div>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-slate-800 w-3' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Housing Society Promo Card */}
            <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 p-5 shadow-sm">
              <h4 className="text-[14px] font-bold text-slate-800 mb-2">Entire Housing Society</h4>
              <p className="text-[12px] text-slate-700 mb-4">
                Secure your entire housing society against fire, theft and natural disasters
              </p>
              <button className="w-full rounded-lg bg-brand py-2 text-[12px] font-bold text-white hover:bg-brand-dark">
                Buy now
              </button>
            </div>

            {/* Agent Assist Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                  👤
                </div>
                <p className="text-[12px] text-slate-700">
                  Our agent can help you to buy the best home insurance!
                </p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                <Phone size={14} />
                Talk to us
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Bubble */}
      <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 flex items-center justify-center">
        💬
      </button>

      {/* Search Details Drawer */}
      <SearchDetailsDrawer
        isOpen={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
        initialData={leadData}
        onSave={handleSearchSave}
      />
    </div>
  )
}

interface PlanAddon {
  name: string
  cover?: number
}

interface HomeInsurancePlan {
  insurerLogo: string
  insurerName: string
  planName: string
  basePremium: number
  policyTermYears: number
  isCustomersChoice?: boolean
  addons?: PlanAddon[]
}

interface PlanCardProps {
  plan: HomeInsurancePlan
  buildingValue: number
  householdItems: number
  onSelect: () => void
}

function PlanCard({
  plan,
  buildingValue,
  householdItems,
  onSelect,
}: PlanCardProps) {
  const [expandedCoverages, setExpandedCoverages] = useState(false)

  const monthlyPremium = Math.round(plan.basePremium / 12)
  const yearlyPremium = plan.basePremium

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Customer's Choice Badge */}
      {plan.isCustomersChoice && (
        <div className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1">
          <span className="text-[11px] font-bold text-white">
            ✓ Customer's Choice
          </span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 md:items-center">
        {/* Left: Insurer + Plan Details */}
        <div className="flex items-start gap-4">
          <img
            src={plan.insurerLogo}
            alt={plan.insurerName}
            className="h-12 w-12 shrink-0 rounded-full bg-slate-50 object-contain"
          />

          <div>
            <h3 className="text-[14px] font-bold text-navy">
              {plan.planName}
            </h3>

            <p className="text-[12px] text-slate-500">
              {plan.insurerName}
            </p>

            <div className="mt-2 space-y-1 text-[12px]">
              <div>
                <span className="font-semibold">Building:</span>{' '}
                {formatINR(buildingValue)}
              </div>

              <div>
                <span className="font-semibold">Household Items:</span>{' '}
                {formatINR(householdItems)}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Expandable Add-ons */}
        {plan.addons && plan.addons.length > 0 && (
          <div className="md:col-span-1">
            <button
              type="button"
              onClick={() => setExpandedCoverages(!expandedCoverages)}
              className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 hover:text-navy"
            >
              <FileText size={14} />

              All {plan.addons.length}/{plan.addons.length} selected add ons

              {expandedCoverages ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            {expandedCoverages && (
              <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                {plan.addons.map((addon: PlanAddon, idx: number) => (
                  <div key={idx}>
                    • {addon.name}:{' '}
                    ₹{addon.cover?.toLocaleString('en-IN')} cover
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right: Price Button */}
        <div className="flex flex-col gap-2 md:items-end">
          <button
            type="button"
            onClick={onSelect}
            className="rounded-lg bg-brand px-6 py-2.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {formatINR(monthlyPremium)}/month
          </button>

          <p className="text-[11px] text-slate-500">
            One Time Payment for {plan.policyTermYears} years:{' '}
            {formatINR(yearlyPremium)}
          </p>

          <div className="mt-2 flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-1 text-[12px]">
              <input
                type="checkbox"
                className="accent-brand"
              />
              <span>Add to Compare</span>
            </label>

            <Star
              size={14}
              className="cursor-pointer text-slate-400 hover:text-yellow-500"
            />

            <button
              type="button"
              className="text-[12px] font-semibold text-brand hover:underline"
            >
              View Coverages ({plan.addons?.length || 0}) ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollapsiblePlanSection({
  title,
  defaultOpen = false,
}: {
  title: string
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-[13px] font-bold text-slate-800 hover:bg-slate-200"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="mt-3 space-y-3">
          <p className="text-[12px] text-slate-500 italic">Plans for this term would be shown here...</p>
        </div>
      )}
    </div>
  )
}

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-[13px] font-bold text-slate-800 hover:bg-slate-50"
      >
        Disclaimer*
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-4 text-[12px] text-slate-600 space-y-3">
          <p>
            <strong>AV Management Insurance Brokers Private Limited</strong> | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001
          </p>
          <p>
            <a href="#" className="text-brand hover:underline">Contact Us</a> | <a href="#" className="text-brand hover:underline">Legal and Admin Policies</a>
          </p>
          <p>
            AV Management is an insurance services platform. Visitors are hereby informed that information submitted on the website may be shared with insurers and third-party administrators for service fulfilment.
          </p>
          <p>
            <strong>*Disclaimer:</strong> We, at AV Management, are committed to offering unbiased product comparison and neutral editorial content. Our partnership with various insurers does not impact our editorial content or product comparisons.
          </p>
          <p>
            <strong>KYC:</strong> Know Your Customer norms are mandatory for all insurance transactions to prevent financial fraud.
          </p>
        </div>
      )}
    </div>
  )
}
