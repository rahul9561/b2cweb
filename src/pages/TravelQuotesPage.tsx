import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditTravellerDrawer from '../components/travel/EditTravellerDrawer'
import FiltersBar from '../components/travel/FiltersBar'
import PlanCard from '../components/travel/PlanCard'
import FrequentlyCompared from '../components/travel/FrequentlyCompared'
import WhyBuy from '../components/travel/WhyBuy'
import Disclaimer from '../components/travel/Disclaimer'

const MOCK_PLANS = [
  { id: 'indusind', insurer: 'IndusInd General', plan: 'Travel Care Individual', premium: 6916, medical: 250000, ped: 250000, baggage: 1200, cancel: 600, accident: 25000, pedCovered: false, note: 'Limited pre-existing diseases covered', planType: 'single', visaTypes: ['tourist'], coverages: ['pre-existing'], purposes: ['holiday'] },
  { id: 'icici', insurer: 'ICICI Lombard', plan: 'Trip Secure Plus', premium: 9895, medical: 250000, ped: 20000, baggage: 300, cancel: 1000, accident: 15000, pedCovered: true, note: 'All pre-existing diseases covered', planType: 'frequent', visaTypes: ['tourist','work'], coverages: ['pre-existing'], purposes: ['holiday','business'] },
  { id: 'care', insurer: 'Care Health', plan: 'Explore Gold', premium: 7462, medical: 300000, ped: 30000, baggage: 750, cancel: 1000, accident: 20000, pedCovered: true, note: 'All pre-existing diseases covered', planType: 'student', visaTypes: ['student'], coverages: ['adventure','pre-existing'], purposes: ['studies'] },
  { id: 'tataaig', insurer: 'Tata AIG', plan: 'International Plus Gold', premium: 7161, medical: 250000, ped: 0, baggage: 500, cancel: 800, accident: 20000, pedCovered: false, note: 'Limited pre-existing diseases covered', planType: 'single', visaTypes: ['tourist'], coverages: [], purposes: ['holiday'] },
  { id: 'digit', insurer: 'Digit', plan: 'Smart 360', premium: 8700, medical: 250000, ped: 7500, baggage: 750, cancel: 750, accident: 10000, pedCovered: false, note: 'Limited pre-existing diseases covered', planType: 'single', visaTypes: ['tourist'], coverages: ['pre-existing'], purposes: ['holiday'] },
  { id: 'bajaj', insurer: 'Bajaj General', plan: 'Travel Ace Lite', premium: 8652, medical: 250000, ped: 0, baggage: 700, cancel: 900, accident: 18000, pedCovered: false, note: 'Limited pre-existing diseases covered', planType: 'frequent', visaTypes: ['tourist','work'], coverages: ['adventure'], purposes: ['business'] },
  { id: 'niva', insurer: 'Niva Bupa', plan: 'Global Care', premium: 9200, medical: 300000, ped: 50000, baggage: 1200, cancel: 1200, accident: 25000, pedCovered: true, note: 'All pre-existing diseases covered', planType: 'single', visaTypes: ['tourist'], coverages: ['pre-existing'], purposes: ['holiday'] },
  { id: 'zurich', insurer: 'Zurich Kotak', plan: 'World Traveller', premium: 10200, medical: 500000, ped: 100000, baggage: 1500, cancel: 1500, accident: 50000, pedCovered: true, note: 'All pre-existing diseases covered', planType: 'frequent', visaTypes: ['tourist','work'], coverages: ['pre-existing'], purposes: ['business'] },
]

export default function TravelQuotesPage() {
  const location = useLocation()
  const state = (location.state ?? {}) as any
  const travellerGroups = state.travellers ?? [{ id: 'g1', age: 20, spouse: null, children: [] }]
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode] = useState<'dates'|'duration'|'student'|'editTravellers'>('editTravellers')
  const [plansVisible, setPlansVisible] = useState(6)
  const [basePlans] = useState(MOCK_PLANS)
  const [plans, setPlans] = useState(MOCK_PLANS)
  const [, setFilters] = useState<any>({})
  const [travellerState, setTravellerState] = useState(travellerGroups)
  const totalMembers = travellerGroups.reduce((s: number, g: any) => s + 1 + (g.spouse ? 1 : 0) + (g.children ? g.children.length : 0), 0)

  useEffect(() => {
    // Simple deterministic premium adjuster: increase premium by 2% per extra member over 1
    const multiplier = 1 + (Math.max(0, totalMembers - 1) * 0.02)
    setPlans(basePlans.map((p) => ({ ...p, premium: Math.round(p.premium * multiplier) })))
  }, [totalMembers])

  useEffect(()=>{
    // Open edit traveller drawer when header sets editTravellers flag
    if ((location.state as any)?.editTravellers) {
      setDrawerOpen(true)
      // clear the flag so repeated navigation doesn't keep it open
      try { (location.state as any).editTravellers = false } catch {}
    }
  }, [location.state])

  const handleApplyFilters = (applied: any) => {
    setFilters(applied)
    let filtered = basePlans.slice()
    if (applied.planType) filtered = filtered.filter((p) => p.planType === applied.planType)
    if (applied.sumInsured) filtered = filtered.filter((p) => p.medical >= applied.sumInsured)
    if (applied.insurers && applied.insurers.length) filtered = filtered.filter((p) => applied.insurers.includes(p.insurer))
    if (applied.visaTypes && applied.visaTypes.length) filtered = filtered.filter((p)=> p.visaTypes?.some((v:any)=> applied.visaTypes.includes(v)))
    if (applied.coverages && applied.coverages.length) filtered = filtered.filter((p)=> applied.coverages.every((c:string)=> p.coverages?.includes(c)))
    if (applied.purposes && applied.purposes.length) filtered = filtered.filter((p)=> p.purposes?.some((pu:any)=> applied.purposes.includes(pu)))
    if (applied.regular === false) {
      // if not regular, include only frequent/student
      filtered = filtered.filter((p)=> p.planType !== 'single')
    }

    // recompute premium multiplier based on current travellers
    const total = travellerState.reduce((s: number, g: any) => s + 1 + (g.spouse ? 1 : 0) + (g.children ? g.children.length : 0), 0)
    const multiplier = 1 + (Math.max(0, total - 1) * 0.02)
    setPlans(filtered.map((p) => ({ ...p, premium: Math.round(p.premium * multiplier) })))

    // open drawers based on plan type
    // Do not open drawer on filter apply — just update visible plans
  }

  const handleSaveTravellerEdits = (newState: any) => {
    if (newState?.travellers) setTravellerState(newState.travellers)
    if (newState?.startDate) {
      // optional set start/end
    }
    setDrawerOpen(false)
  }

  return (
    <div className="bg-blueBG py-8 min-h-screen">
      <div className="container-pb mt-6">
        <h2 className="text-[20px] font-bold text-navy">Showing <span className="font-bold">{plans.length}</span> plans for <span className="font-bold">{totalMembers}</span> members</h2>

        <div className="sticky top-[72px] z-40 mt-4 bg-blueBG/60 backdrop-blur-sm">
          <div className="container-pb">
            <FiltersBar onApply={handleApplyFilters} insurers={[...new Set(basePlans.map((p)=>p.insurer))]} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {plans.slice(0, plansVisible).map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {plansVisible < plans.length && (
          <div className="mt-6 text-center">
            <button onClick={() => setPlansVisible(plans.length)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-brand shadow-sm">Show more plans</button>
          </div>
        )}

        <div className="mt-10">
          <FrequentlyCompared />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <WhyBuy />
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </div>

      {drawerOpen && (
        <EditTravellerDrawer
          mode={drawerMode}
          initialState={state}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSaveTravellerEdits}
        />
      )}
    </div>
  )
}
