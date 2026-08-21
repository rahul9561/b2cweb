import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Armchair,
  Award,
  BellRing,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  HeartHandshake,
  Home,
  Info,
  Landmark,
  MessageCircle,
  Minus,
  Phone,
  Play,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react'

type PlanType = 'Market linked' | '100% Guaranteed returns' | 'Pension Plan'
type MarketSub = 'All Plans' | 'With Capital Guarantee' | 'Market Linked' | 'With High Life Cover'
type PayoutVariant = 'split' | 'combined'

interface InvestmentPlan {
  id: string
  insurer: string
  planName: string
  logoUrl?: string
  category: string
  type: PlanType
  marketSub: MarketSub[]
  returns: Record<number, number>
  fundName: string
  maturityLac: number
  nomineeLac: number
  lifeCoverLac: number
  tags: string[]
  promo?: 'nfo' | 'growth'
  variant: PayoutVariant
  children?: InvestmentPlan[]
}

interface Filters {
  amount: number
  frequency: 'Monthly' | 'Yearly'
  investFor: number
  withdrawAfter: number
  planType: PlanType
  marketSub: MarketSub
  performance: number
  mandate: '' | '4%' | '8%'
}

const currentYear = new Date().getFullYear()
const initialFilters: Filters = {
  amount: 5000,
  frequency: 'Monthly',
  investFor: 10,
  withdrawAfter: 20,
  planType: 'Market linked',
  marketSub: 'All Plans',
  performance: 7,
  mandate: '',
}

const plans: InvestmentPlan[] = [
  {
    id: 'icici-cgs',
    insurer: 'Aviva Prime',
    planName: 'Capital Guarantee Solution',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/6.svg',
    category: 'Capital Guarantee Solution',
    type: 'Market linked',
    marketSub: ['All Plans', 'With Capital Guarantee', 'Market Linked'],
    returns: { 10: 21.2, 8: 26.4, 7: 24.5, 6: 18.8, 5: 17.4 },
    fundName: 'BSE 500 Momentum Value 50 Index Fund',
    maturityLac: 218,
    nomineeLac: 235,
    lifeCoverLac: 104,
    tags: ['Triple Benefit', 'Inbuilt Life Cover', 'Plan with Zero GST', 'Save Tax Upto Rs28.2 Lac'],
    promo: 'nfo',
    variant: 'split',
    children: [
      {
        id: 'icici-cgs-child',
        insurer: 'Aviva Prime',
        planName: 'Capital Guarantee Select',
        logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/6.svg',
        category: 'Capital Guarantee Solution',
        type: 'Market linked',
        marketSub: ['All Plans', 'With Capital Guarantee'],
        returns: { 10: 18.6, 8: 16.9, 7: 12.6, 6: 12.1, 5: 11.8 },
        fundName: 'Opportunities Fund',
        maturityLac: 40,
        nomineeLac: 48,
        lifeCoverLac: 79,
        tags: ['Inbuilt Life Cover', 'Plan with Zero GST', 'Instant Tax Receipt', 'Save Tax Upto Rs5.97 Lac'],
        variant: 'combined',
      },
    ],
  },
  {
    id: 'axis-max',
    insurer: 'Axis Max',
    planName: 'Smart Goal Ensuring Multiplier-Wealth',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/12.svg',
    category: 'Capital Guarantee Solution',
    type: 'Market linked',
    marketSub: ['All Plans', 'Market Linked', 'With Capital Guarantee'],
    returns: { 10: 15.2, 8: 16.4, 7: 17.7, 6: 14.4, 5: 12.7 },
    fundName: 'High Growth Fund',
    maturityLac: 83,
    nomineeLac: 159,
    lifeCoverLac: 92,
    tags: ['Triple Benefit', '2X Premium Funding', 'New Fund Launched | 9th Aug', 'Inbuilt Life Cover', 'Plan with Zero GST', 'Instant Tax Receipt'],
    variant: 'split',
  },
  {
    id: 'hdfc-life',
    insurer: 'Tata AIA',
    planName: 'Smart Fortune Plus-Wealth Secure',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/15.svg',
    category: 'Capital Guarantee Solution',
    type: 'Market linked',
    marketSub: ['All Plans', 'With Capital Guarantee'],
    returns: { 10: 13.5, 8: 13.1, 7: 12.4, 6: 11.2, 5: 10.8 },
    fundName: 'Opportunities Fund',
    maturityLac: 38.8,
    nomineeLac: 46.8,
    lifeCoverLac: 60,
    tags: ['Triple Benefit', 'Inbuilt Life Cover', 'Plan with Zero GST', 'Instant Tax Receipt', 'Save Tax Upto Rs5.81 Lac'],
    variant: 'split',
    children: [
      {
        id: 'hdfc-life-child',
        insurer: 'Tata AIA',
        planName: 'Income Advantage',
        logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/15.svg',
        category: 'Capital Guarantee Solution',
        type: '100% Guaranteed returns',
        marketSub: ['All Plans'],
        returns: { 10: 8.1, 8: 7.9, 7: 7.4, 6: 7.1, 5: 6.9 },
        fundName: 'Guaranteed Fund',
        maturityLac: 32,
        nomineeLac: 42,
        lifeCoverLac: 50,
        tags: ['Inbuilt Life Cover', 'Instant Tax Receipt', 'Save Tax Upto Rs4.2 Lac'],
        variant: 'combined',
      },
    ],
  },
  {
    id: 'tata-aia',
    insurer: 'Bajaj Life',
    planName: 'e-Wealth Royale',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/24.svg',
    category: 'Capital Guarantee Solution',
    type: 'Market linked',
    marketSub: ['All Plans', 'With High Life Cover', 'Market Linked'],
    returns: { 10: 18.1, 8: 17.2, 7: 16.6, 6: 14.9, 5: 14.4 },
    fundName: 'Large Cap Equity Fund',
    maturityLac: 459,
    nomineeLac: 104,
    lifeCoverLac: 104,
    tags: ['2.75% Discount (Lifetime) on Term Premium', 'Plan with Zero GST', 'Instant Tax Receipt', 'Save Tax Upto Rs58.3 Lac'],
    promo: 'growth',
    variant: 'combined',
  },
  {
    id: 'pnb-metlife',
    insurer: 'SBI Life',
    planName: 'Nivesh Plus',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/10.svg',
    category: 'Capital Guarantee Solution',
    type: 'Pension Plan',
    marketSub: ['All Plans'],
    returns: { 10: 12.8, 8: 12.3, 7: 12.1, 6: 11.7, 5: 11.1 },
    fundName: 'Virtue II Fund',
    maturityLac: 37.4,
    nomineeLac: 46.7,
    lifeCoverLac: 60,
    tags: ['Premium Waiver', 'Inbuilt Life Cover', 'Instant Tax Receipt', 'Save Tax Upto Rs5.7 Lac'],
    variant: 'split',
  },
  {
    id: 'bajaj-life',
    insurer: 'HDFC Life',
    planName: 'Click2Wealth',
    logoUrl: 'https://static.pbcdn.in/investment-cdn/images/insurerLogos/6.svg',
    category: 'Market Linked Plan',
    type: 'Market linked',
    marketSub: ['All Plans', 'Market Linked'],
    returns: { 10: 19.1, 8: 18.4, 7: 17.3, 6: 16.2, 5: 14.8 },
    fundName: 'Opportunities Fund',
    maturityLac: 517,
    nomineeLac: 79,
    lifeCoverLac: 79,
    tags: ['15% Discount (1st year) on Term Premium', 'Plan with Zero GST', 'Instant Tax Receipt', 'Save Tax Upto Rs65.6 Lac'],
    variant: 'combined',
  },
]

function money(valueLac: number) {
  if (valueLac >= 100) return `Rs${(valueLac / 100).toFixed(valueLac % 100 ? 2 : 0)} Cr`
  return `Rs${valueLac.toFixed(valueLac % 1 ? 1 : 0)} L`
}

function multiplier(filters: Filters) {
  return (filters.amount / 5000) * (filters.frequency === 'Yearly' ? 12 : 1) * (filters.investFor / 10)
}

function filterInvestmentPlans(source: InvestmentPlan[], filters: Filters) {
  return source.filter((plan) => {
    if (plan.type !== filters.planType) return false
    if (filters.planType === 'Market linked' && filters.marketSub !== 'All Plans' && !plan.marketSub.includes(filters.marketSub)) return false
    return true
  })
}

function displayReturn(plan: InvestmentPlan, filters: Filters) {
  return filters.mandate ? Number(filters.mandate.replace('%', '')) : plan.returns[filters.performance]
}

export default function InvestmentQuotesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(() => ({
    ...initialFilters,
    amount: Number(searchParams.get('amount')) || initialFilters.amount,
    investFor: Number(searchParams.get('investFor')) || initialFilters.investFor,
    withdrawAfter: Number(searchParams.get('withdrawAfter')) || initialFilters.withdrawAfter,
    performance: Number(searchParams.get('performance')) || initialFilters.performance,
    planType: (searchParams.get('planType') as PlanType) || initialFilters.planType,
    marketSub: (searchParams.get('marketSub') as MarketSub) || initialFilters.marketSub,
  }))
  const [loading, setLoading] = useState(false)
  const [goalProtection, setGoalProtection] = useState(true)
  const [personaliseOpen, setPersonaliseOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [user, setUser] = useState({
    name: searchParams.get('name') || 'Mohd',
    age: searchParams.get('age') || '23',
    mobile: searchParams.get('mobile') || '+9178******007',
    city: searchParams.get('city') || 'Lucknow',
    dark: false,
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set('amount', String(filters.amount))
    params.set('investFor', String(filters.investFor))
    params.set('withdrawAfter', String(filters.withdrawAfter))
    params.set('performance', String(filters.performance))
    params.set('planType', filters.planType)
    params.set('marketSub', filters.marketSub)
    setSearchParams(params, { replace: true })
  }, [filters])

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(timer)
  }, [filters])

  const filteredPlans = useMemo(() => filterInvestmentPlans(plans, filters), [filters])

  return (
    <div className={`min-h-screen ${user.dark ? 'bg-[#111827]' : 'bg-[#f4f8ff]'} text-navy`}>
      <MarketTickerBar />
      <QuotesHeader user={user} onPersonalise={() => setPersonaliseOpen(true)} />
      <FilterBar filters={filters} setFilters={setFilters} />

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="border-l-4 border-brand pl-3 text-xl font-black">
              {filters.planType === 'Market linked' ? 'Capital Guarantee Solution' : filters.planType}{' '}
              <span className="text-sm font-medium">(Market Linked + Guaranteed Plan)</span> <Info className="inline h-4 w-4" />
            </h1>
            <button
              onClick={() => setGoalProtection((value) => !value)}
              className={`flex items-center gap-3 rounded-full border-2 px-4 py-1.5 text-sm font-black ${goalProtection ? 'border-brand text-navy' : 'border-slate2-border text-slate2-secondary'}`}
            >
              Enable Goal Protection
              <span className={`flex h-6 w-11 items-center rounded-full p-0.5 ${goalProtection ? 'bg-brand' : 'bg-gray-300'}`}>
                <span className={`h-5 w-5 rounded-full bg-white transition-transform ${goalProtection ? 'translate-x-5' : ''}`} />
              </span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-xl bg-white shadow-card" />)}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-5">
                {filteredPlans.map((plan, index) => (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <PlanCard plan={plan} filters={filters} onView={() => setSelectedPlan(plan)} />
                  </motion.div>
                ))}
                {filteredPlans.length === 0 && (
                  <div className="rounded-xl bg-white p-10 text-center shadow-card">
                    <p className="text-lg font-black">No plans match the selected filters.</p>
                    <button onClick={() => setFilters(initialFilters)} className="mt-4 rounded-lg bg-brand px-5 py-3 text-sm font-black text-white">Reset filters</button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
          <FooterAttribution />
        </section>

        <SidebarStack goalProtection={goalProtection} />
      </main>

      <FloatingChat />
      <PersonaliseModal isOpen={personaliseOpen} user={user} onClose={() => setPersonaliseOpen(false)} onSave={setUser} />
      <PlanDetailsDrawer
        plan={selectedPlan}
        filters={filters}
        onClose={() => setSelectedPlan(null)}
        onProceed={() => navigate('/investment-plans/proposal')}
      />
    </div>
  )
}

function MarketTickerBar() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 10000)
    return () => window.clearInterval(id)
  }, [])
  const indexes = ['BSE SENSEX', 'BSE 150 Midcap Index', 'BSE 250 SmallCap Index', 'BSE 100 Index']
  return (
    <div className="border-b border-blue-100 bg-[#eaf4ff]">
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-3 overflow-x-auto px-4 text-[11px] scrollbar-hide">
        <span className="min-w-max leading-tight text-slate2-secondary">Last updated:<br />11 Aug, 12:41 PM IST</span>
        {indexes.map((name, index) => {
          const up = (index + tick) % 3 === 0
          const value = 78102 + index * 421 + tick * 3
          return (
            <button key={name} className="min-w-max rounded-full bg-white px-4 py-2 font-bold text-navy shadow-sm">
              {name} {value.toLocaleString('en-IN')} <span className={up ? 'text-green-600' : 'text-slate2-muted'}>({up ? '+0.20%' : '-0.56%'}) {up ? '▲' : '▼'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuotesHeader({ user, onPersonalise }: { user: { name: string; age: string; city: string }; onPersonalise: () => void }) {
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <p className="text-lg font-black text-navy">Best investment plans are here</p>
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-tag">Grow confidently with AV Management</p>
        </div>
        <button onClick={onPersonalise} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black text-navy hover:bg-blueBG">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gray-200">{user.name.charAt(0).toUpperCase()}</span>
          {user.name} <span>•</span> {user.age} Yrs <span>•</span> {user.city} <ChevronDown className="h-4 w-4 text-brand" />
        </button>
      </div>
    </header>
  )
}

function FilterBar({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto overflow-y-visible px-4 py-3 scrollbar-hide">
        <AmountFilter filters={filters} setFilters={setFilters} />
        <RadioFilter title="Invest for" value={`${filters.investFor} Years`} options={[0, 5, 7, 10, 15, 20, 25]} selected={filters.investFor} onSelect={(value) => setFilters((f) => ({ ...f, investFor: value }))} suffix="Till" />
        <RadioFilter title="Withdraw after" value={`${filters.withdrawAfter} Years`} options={[10, 15, 20, 25, 30]} selected={filters.withdrawAfter} onSelect={(value) => setFilters((f) => ({ ...f, withdrawAfter: value }))} suffix="In" />
        <PlanTypeFilter filters={filters} setFilters={setFilters} />
        <PastPerformanceFilter filters={filters} setFilters={setFilters} />
        <a href="tel:9917500023" className="flex h-[58px] min-w-[150px] items-center justify-center gap-2 rounded bg-[#3f963f] px-5 text-sm font-black text-white">
          <BellRing className="h-5 w-5 animate-pulse" /> Talk to Expert
        </a>
      </div>
    </div>
  )
}

function FilterShell({ title, value, children }: { title: string; value: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 260 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  const toggleOpen = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
      const panelWidth = title === 'Plan type' ? 352 : title === 'Past performance' ? 320 : 258
    if (rect) {
      setPosition({
        top: rect.bottom + 10,
        left: Math.max(16, Math.min(rect.left, window.innerWidth - panelWidth - 16)),
        width: panelWidth,
      })
    }
    setOpen((value) => !value)
  }

  return (
    <div>
      <button ref={triggerRef} onClick={toggleOpen} className="h-[58px] min-w-[175px] rounded bg-white px-4 text-left shadow-card">
        <span className="block text-xs text-slate2-muted">{title}</span>
        <span className="flex items-center justify-between text-base font-black text-navy">{value} <ChevronDown className="h-4 w-4 text-brand" /></span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button className="fixed inset-0 z-40 cursor-default bg-transparent" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[70] max-h-[72vh] overflow-y-auto rounded-lg bg-white p-5 text-navy shadow-[0_12px_32px_rgba(23,43,77,0.28)]"
              style={{ top: position.top, left: position.left, width: position.width }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function AmountFilter({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  return (
    <FilterShell title="Investment amount" value={`Rs ${filters.amount.toLocaleString('en-IN')}  ${filters.frequency}`}>
      <h3 className="mb-4 text-base font-black">Invested amount</h3>
      <div className="flex items-center border-b border-brand pb-2">
        <input value={filters.amount} onChange={(e) => setFilters((f) => ({ ...f, amount: Number(e.target.value.replace(/\D/g, '')) || 0 }))} className="w-full text-xl font-medium outline-none" />
        <span className="flex min-w-max items-center gap-1 text-xs text-slate2-muted"><ReceiptText className="h-4 w-4" /> to save</span>
      </div>
      <h4 className="mb-3 mt-6 font-black">Payment frequency</h4>
      {(['Monthly', 'Yearly'] as const).map((item) => (
        <button key={item} onClick={() => setFilters((f) => ({ ...f, frequency: item }))} className={`mb-3 flex items-center gap-3 font-bold ${filters.frequency === item ? 'text-brand' : 'text-slate2-secondary'}`}>
          <span className={`h-5 w-5 rounded-full border-2 ${filters.frequency === item ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'}`} /> {item}
        </button>
      ))}
    </FilterShell>
  )
}

function RadioFilter({ title, value, options, selected, onSelect, suffix }: { title: string; value: string; options: number[]; selected: number; onSelect: (v: number) => void; suffix: 'Till' | 'In' }) {
  return (
    <FilterShell title={title} value={value}>
      <h3 className="mb-4 text-base font-black">{title}</h3>
      {options.map((option) => {
        const label = option === 0 ? 'One Time' : `${option} Years`
        const isSelected = selected === option
        return (
          <button key={label} onClick={() => onSelect(option)} className={`mb-4 flex w-full items-center justify-between gap-5 text-left ${isSelected ? 'text-brand' : 'text-slate2-secondary'}`}>
            <span className="flex items-center gap-3 font-bold"><span className={`h-5 w-5 rounded-full border-2 ${isSelected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'}`} /> {label}</span>
            {option > 0 && <span className={`rounded px-2 py-1 text-xs font-black ${isSelected ? 'bg-brand text-white' : 'bg-slate-100 text-slate2-secondary'}`}>{suffix} {currentYear + option}</span>}
          </button>
        )
      })}
    </FilterShell>
  )
}

function PlanTypeFilter({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  const types: PlanType[] = ['Market linked', '100% Guaranteed returns', 'Pension Plan']
  const subs: MarketSub[] = ['All Plans', 'With Capital Guarantee', 'Market Linked', 'With High Life Cover']
  return (
    <FilterShell title="Plan type" value={filters.planType}>
      <h3 className="mb-4 font-black">Select plan type</h3>
      {types.map((type) => (
        <button key={type} onClick={() => setFilters((f) => ({ ...f, planType: type }))} className={`mb-4 flex items-center gap-3 font-bold ${filters.planType === type ? 'text-brand' : 'text-slate2-secondary'}`}>
          <span className={`h-5 w-5 rounded-full border-2 ${filters.planType === type ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'}`} /> {type}
        </button>
      ))}
      {filters.planType === 'Market linked' && (
        <div className="grid grid-cols-2 gap-3">
          {subs.map((sub) => (
            <button key={sub} onClick={() => setFilters((f) => ({ ...f, marketSub: sub }))} className={`rounded-lg px-3 py-2 text-sm font-bold ${filters.marketSub === sub ? 'bg-brand text-white' : 'bg-blueBG text-slate2-secondary'}`}>{sub}</button>
          ))}
        </div>
      )}
    </FilterShell>
  )
}

function PastPerformanceFilter({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  const [rolling, setRolling] = useState(false)
  const [bench, setBench] = useState(false)
  return (
    <FilterShell title="Past performance" value={`${filters.performance} Years`}>
      <div className="mb-4 flex items-center justify-between"><h3 className="font-black">Point To Point <Tooltip text="Point-to-point returns compare fund value over exact start and end dates. Avg 7 yr Return: 12.99%." /></h3><ChevronDown className="h-4 w-4" /></div>
      {[10, 8, 7, 6, 5].map((year) => (
        <button key={year} onClick={() => setFilters((f) => ({ ...f, performance: year }))} className={`mb-4 flex items-center gap-3 font-bold ${filters.performance === year ? 'text-brand' : 'text-slate2-secondary'}`}>
          <span className={`h-5 w-5 rounded-full border-2 ${filters.performance === year ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'}`} /> {year} Years
        </button>
      ))}
      <h4 className="mb-3 font-black">IRDAI Mandate Returns</h4>
      {(['4%', '8%'] as const).map((item) => <button key={item} onClick={() => setFilters((f) => ({ ...f, mandate: f.mandate === item ? '' : item }))} className="mb-3 flex items-center gap-3 font-bold text-slate2-secondary"><span className={`h-5 w-5 rounded-full border-2 ${filters.mandate === item ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'}`} />{item}</button>)}
      <button onClick={() => setRolling((v) => !v)} className="flex w-full justify-between py-2 font-black">Rolling Returns <ChevronDown className={`h-4 w-4 ${rolling ? 'rotate-180' : ''}`} /></button>
      {rolling && <p className="text-xs text-slate2-secondary">Rolling return averages smooth short market movements. Best 7 yr: 18.2%.</p>}
      <button onClick={() => setBench((v) => !v)} className="flex w-full justify-between py-2 font-black">Benchmark Returns <ChevronDown className={`h-4 w-4 ${bench ? 'rotate-180' : ''}`} /></button>
      {bench && <p className="text-xs text-slate2-secondary">Benchmarks show how the fund compares with broad-market indices.</p>}
    </FilterShell>
  )
}

function Tooltip({ text }: { text: string }) {
  return <span className="group relative inline-flex"><Info className="h-4 w-4 text-slate2-secondary" /><span className="pointer-events-none absolute left-0 top-5 z-20 hidden w-56 rounded bg-navy p-3 text-xs font-medium leading-5 text-white group-hover:block">{text}</span></span>
}

function PlanCard({ plan, filters, onView }: { plan: InvestmentPlan; filters: Filters; onView: () => void }) {
  const [moreTags, setMoreTags] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const factor = multiplier(filters)
  const tags = moreTags ? plan.tags : plan.tags.slice(0, 5)
  return (
    <article className={`relative rounded-xl border bg-white shadow-card ${plan.promo === 'nfo' ? 'border-blue-200 bg-gradient-to-r from-[#cfe8ff] to-[#ffd9d3]' : 'border-slate2-border'}`}>
      {plan.promo === 'nfo' && <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-[#2c923f] px-4 py-1 text-xs font-black text-white">Pre New Fund Offer - Last 7 Days Left</div>}
      {plan.promo === 'growth' && <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0e6c9d] px-4 py-1 text-xs font-black text-white">Growth Meets Protection · View Detail</div>}
      <div className="grid gap-5 p-5 md:grid-cols-[135px_185px_1fr_112px] md:items-center">
        <LogoBlock plan={plan} />
        <div>
          <p className="text-xs text-slate2-secondary">{filters.performance} Yr Returns</p>
          <p className="text-2xl font-black text-[#28923d]">{displayReturn(plan, filters).toFixed(1)}%</p>
          <span className="rounded bg-blueBG px-2 py-1 text-xs font-bold">{plan.fundName}</span>
        </div>
        {plan.variant === 'split' ? <SplitPayout plan={plan} factor={factor} /> : <CombinedPayout plan={plan} factor={factor} filters={filters} />}
        <button onClick={onView} className="rounded bg-brand px-5 py-3 text-sm font-black text-white">View Details <ChevronRight className="inline h-4 w-4" /></button>
      </div>
      {plan.promo === 'nfo' && <div className="mx-auto mb-2 flex w-fit items-center gap-2 rounded bg-white px-3 py-1 text-xs font-bold text-orange-tag"><span className="animate-spin">🪙</span> Avail units at Rs10 NAV</div>}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate2-border bg-white/60 px-5 py-3">
        {tags.map((tag) => <TagPill key={tag} tag={tag} />)}
        {plan.tags.length > 5 && <button onClick={() => setMoreTags((v) => !v)} className="rounded-full bg-brand/80 px-3 py-1 text-xs font-black text-white">{moreTags ? 'Less' : 'More'} <ChevronDown className={`inline h-3 w-3 ${moreTags ? 'rotate-180' : ''}`} /></button>}
      </div>
      {plan.children?.length && (
        <div className="bg-[#e3f0ff] py-2 text-center">
          <button onClick={() => setExpanded((v) => !v)} className="text-xs font-black text-brand">
            {expanded ? 'Hide Plans' : `+ ${plan.children.length} More Plan`} <ChevronDown className={`inline h-3 w-3 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
      <AnimatePresence>
        {expanded && plan.children?.map((child) => (
          <motion.div key={child.id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[160px_1fr_160px_120px] md:items-center">
                <LogoBlock plan={child} />
                <div><p className="font-black text-[#28923d]">{displayReturn(child, filters).toFixed(1)}%</p><span className="rounded bg-blueBG px-2 py-1 text-xs font-bold">{child.fundName}</span></div>
                <div><p className="text-xs">Maturity Value#</p><p className="text-xl font-black">{money(child.maturityLac * factor)}</p></div>
                <button onClick={onView} className="rounded bg-brand px-4 py-2 text-sm font-black text-white">View Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </article>
  )
}

function LogoBlock({ plan }: { plan: InvestmentPlan }) {
  const initials = plan.insurer.split(' ').map((p) => p[0]).join('')
  return (
    <div>
      <div className="mb-3 flex h-11 w-28 items-center justify-center rounded bg-white p-2 shadow-sm">
        {plan.logoUrl ? (
          <img src={plan.logoUrl} alt={plan.insurer} className="max-h-8 max-w-full object-contain" />
        ) : (
          <span className="text-sm font-black text-brand">{initials}</span>
        )}
      </div>
      <p className="text-sm font-black">{plan.planName} <Info className="inline h-3.5 w-3.5" /></p>
    </div>
  )
}

function SplitPayout({ plan, factor }: { plan: InvestmentPlan; factor: number }) {
  return <div className="grid grid-cols-[1fr_40px_1fr] items-center rounded-lg border border-slate2-border p-4 text-center"><div><p className="text-xs">Maturity Payout to You</p><p className="text-xl font-black">{money(plan.maturityLac * factor)}</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-blueBG text-xs font-black">OR</span><div><p className="text-xs">Payout to Nominee</p><p className="text-xl font-black">{money(plan.nomineeLac * factor)} <Info className="inline h-3 w-3" /></p><p className="text-xs">in case of death</p></div></div>
}

function CombinedPayout({ plan, factor, filters }: { plan: InvestmentPlan; factor: number; filters: Filters }) {
  return <div className="grid grid-cols-[1fr_34px_1fr] items-center rounded-lg bg-blueBG p-4"><div><p className="text-xs">Maturity Value#</p><p className="text-xl font-black">{money(plan.maturityLac * factor)}</p><p className="text-xs">at {currentYear + filters.withdrawAfter}</p></div><span className="text-center text-brand">&</span><div><p className="text-xs">Life Cover</p><p className="text-xl font-black text-brand">{money(plan.lifeCoverLac * factor)}</p><p className="text-xs">Cover till age 60</p></div></div>
}

function TagPill({ tag }: { tag: string }) {
  const green = tag.includes('Discount') || tag.includes('Premium Funding')
  const yellow = tag.includes('New Fund')
  const triple = tag.includes('Triple')
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${triple ? 'bg-gradient-to-r from-[#3457a6] to-[#29b2b3] text-white' : green ? 'bg-[#39a34a] text-white' : yellow ? 'bg-[#fff3bf] text-navy' : 'bg-white text-navy'}`}>{tag.includes('Zero GST') && <Star className="mr-1 inline h-3 w-3 animate-pulse text-yellow" />}{tag}</span>
}

function SidebarStack({ goalProtection }: { goalProtection: boolean }) {
  const [promo, setPromo] = useState(0)
  const promos = ['Wartime investing Yes | No?', 'Money & Markets', 'Historical Sensex returns']
  return (
    <aside className="hidden space-y-4 lg:block">
      {goalProtection && <Card><h2 className="text-center text-base text-slate2-secondary">Protect what<br /><span className="text-3xl font-black text-navy">matters to you</span></h2><div className="my-4 flex animate-marquee gap-5 overflow-hidden text-brand"><Home /><Armchair /><GraduationCap /><HeartHandshake /></div><h3 className="font-black">Why Goal Protection Matters?</h3>{['Life cover payout to meet immediate financial needs.', 'A steady income stream to maintain lifestyle.', 'Premium waiver benefit.', 'Maturity value paid to ensure goals stay on track.'].map((x, i) => <p key={x} className="mt-2 text-sm text-slate2-secondary"><b className="mr-2 text-2xl text-gray-300">0{i + 1}</b>{x}</p>)}</Card>}
      <Card><h3 className="mb-2 font-black">Let's plan your goals</h3>{['Power of Compounding', 'Compare & Invest', 'Tax benefits on ULIP'].map((x) => <button key={x} className="flex w-full items-center justify-between py-3 font-bold"><span className="flex items-center gap-2"><Landmark className="h-5 w-5 text-brand" />{x}</span><ChevronDown className="h-4 w-4 text-brand" /></button>)}</Card>
      <Card><p className="font-black">{promos[promo]}</p><button className="mt-3 rounded-full border border-brand px-3 py-1 font-black text-brand"><Play className="inline h-4 w-4" /> Play</button><div className="mt-4 flex justify-center gap-2"><button onClick={() => setPromo(Math.max(0, promo - 1))} className="rounded-full bg-gray-200 p-1"><ChevronLeft className="h-4 w-4" /></button><button onClick={() => setPromo((promo + 1) % promos.length)} className="rounded-full bg-brand p-1 text-white"><ChevronRight className="h-4 w-4" /></button></div></Card>
      <Card><h3 className="mb-3 text-lg font-black">Why buy from AV Management?</h3>{[['10.5 Lac customers, 15,200 Cr investment', Users], ['No hidden charges', ShieldCheck], ['Expert advice', Trophy], ['100% call recorded', Phone]].map(([x, Icon]) => { const I = Icon as typeof Users; return <p key={x as string} className="mb-3 flex gap-3 text-sm font-bold"><I className="h-5 w-5 text-brand" />{x as string}</p> })}<button className="text-sm font-black text-brand">KNOW MORE</button></Card>
      <Card><h3 className="mb-3 text-lg font-black">See why customers love investing from AV Management!</h3><div className="relative h-28 rounded-lg bg-gradient-to-br from-navy to-brand p-3 text-white"><p className="absolute bottom-3 left-3 font-black">Sanjay Sharma</p><Play className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2" /></div><button className="mt-4 rounded border border-brand px-4 py-2 font-black text-brand">Read testimonials</button></Card>
      <Card><button className="w-full rounded-lg border border-brand py-3 font-black text-brand">See claim support process</button><p className="mt-2 text-xs italic text-slate2-muted">Dedicated assistance when your family needs it most.</p></Card>
    </aside>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-white p-4 shadow-card">{children}</div>
}

function FooterAttribution() {
  const [open, setOpen] = useState(false)
  return <div className="mt-8"><div className="mb-4 inline-flex items-center gap-2 rounded border bg-white px-4 py-2 text-xs font-bold">BSE Index data sourced by BSE</div><div className="rounded-lg bg-white shadow-sm"><button onClick={() => setOpen((v) => !v)} className="flex w-full justify-between p-5 text-left text-xl font-black">Disclaimers + <ChevronDown className={`h-5 w-5 text-brand ${open ? 'rotate-180' : ''}`} /></button>{open && <p className="px-5 pb-5 text-sm leading-7 text-slate2-secondary">Tax benefits and savings are subject to changes in tax laws. Investment risk in market-linked plans is borne by the policyholder. Past performance is not guaranteed and should not be treated as advice.</p>}</div></div>
}

function PersonaliseModal({ isOpen, user, onClose, onSave }: { isOpen: boolean; user: { name: string; age: string; mobile: string; city: string; dark: boolean }; onClose: () => void; onSave: (u: { name: string; age: string; mobile: string; city: string; dark: boolean }) => void }) {
  const [draft, setDraft] = useState(user)
  useEffect(() => setDraft(user), [user])
  useEffect(() => {
    const esc = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    if (isOpen) window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [isOpen, onClose])
  if (!isOpen) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/65" onClick={onClose}><div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"><h2 className="mb-5 text-xl font-black">Personalise your experience</h2>{(['name', 'age', 'city'] as const).map((field) => <label key={field} className="mb-4 block text-sm font-black capitalize">Your {field}<input value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} className="mt-2 w-full border-b border-slate2-border pb-2 font-medium outline-none" /></label>)}<label className="mb-4 block text-sm font-black">Your mobile number<input value={draft.mobile.replace(/(\+\d{2})(\d{2})\d+(\d{3})/, '$1 $2****$3')} readOnly className="mt-2 w-full border-b border-slate2-border pb-2 font-medium outline-none" /></label><div className="mb-5 flex items-center justify-between font-black">Dark mode<button onClick={() => setDraft({ ...draft, dark: !draft.dark })} className={`h-6 w-11 rounded-full p-0.5 ${draft.dark ? 'bg-brand' : 'bg-gray-300'}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${draft.dark ? 'translate-x-5' : ''}`} /></button></div><button onClick={() => { onSave(draft); onClose() }} className="w-full rounded bg-brand py-3 font-black text-white">UPDATE</button></div></div>
}

function PlanDetailsDrawer({
  plan,
  filters,
  onClose,
  onProceed,
}: {
  plan: InvestmentPlan | null
  filters: Filters
  onClose: () => void
  onProceed: () => void
}) {
  const [tab, setTab] = useState<'benefits' | 'fund' | 'faq'>('benefits')
  useEffect(() => {
    document.body.style.overflow = plan ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [plan])
  if (!plan) return null
  return <div className="fixed inset-0 z-50 bg-black/65" onClick={onClose}><motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.28 }} onClick={(e) => e.stopPropagation()} className="ml-auto flex h-full w-full flex-col bg-white shadow-2xl lg:w-[52%]"><div className="sticky top-0 z-10 bg-[#ead7e1] p-5 text-center"><button onClick={onClose} className="absolute left-4 top-4 rounded bg-white p-2"><X /></button><a className="absolute right-4 top-4 rounded-full bg-brand px-4 py-2 text-sm font-black text-white"><Phone className="inline h-4 w-4 animate-pulse" /> Talk to Expert</a><p className="font-black">Understand Your Plan</p><div className="mt-5 flex items-center justify-center gap-4"><LogoBlock plan={plan} /></div></div><div className="sticky top-0 z-10 grid grid-cols-3 bg-white shadow-sm">{[['benefits','Plan Benefits'],['fund','Fund Performance'],['faq',`FAQ's`]].map(([key,label]) => <button key={key} onClick={() => setTab(key as typeof tab)} className={`py-4 font-black ${tab === key ? 'border-b-2 border-brand text-brand' : ''}`}>{label}</button>)}</div><div className="flex-1 overflow-y-auto p-5 pb-28">{tab === 'benefits' && <BenefitsTab plan={plan} filters={filters} />}{tab === 'fund' && <FundTab />}{tab === 'faq' && <FaqTab />}</div><div className="sticky bottom-0 grid grid-cols-[120px_1fr_150px] items-center gap-4 border-t bg-white p-4 shadow-[0_-6px_18px_rgba(23,43,77,0.12)]"><LogoBlock plan={plan} /><div><p className="text-sm">Maturity Value</p><p className="text-2xl font-black text-brand">{money(plan.maturityLac * multiplier(filters))}</p><p className="text-xs">If you had invested 20 yrs ago</p></div><button onClick={onProceed} className="rounded bg-brand py-3 font-black text-white transition hover:scale-[1.02] hover:bg-brand-dark">Proceed</button></div></motion.aside></div>
}

function BenefitsTab({ plan, filters }: { plan: InvestmentPlan; filters: Filters }) {
  const [readMore, setReadMore] = useState(false)
  return <div className="space-y-6"><div className="mx-auto w-fit rounded-full bg-yellow/60 px-8 py-2 font-black">Industry's 1st {plan.fundName}</div><h2 className="text-center text-xl">{plan.fundName} has given <b>{displayReturn(plan, filters).toFixed(1)}% returns in last {filters.performance} years</b></h2><div className="rounded-xl bg-gradient-to-r from-blueBG to-white p-5"><h3 className="text-4xl font-black text-brand">AV HERO</h3><div className="mt-4 grid grid-cols-4 gap-2">{['High Potential','Established','Right Price','Outstanding'].map((x) => <div key={x} className="rounded-lg border border-brand/30 bg-white p-3 text-sm font-black">{x}</div>)}</div></div><Section title={`Why Invest in ${plan.fundName}?`}><div className="grid gap-3 md:grid-cols-3">{['Built to Perform','Growth with Value','Replicates the Index'].map((x) => <div key={x} className="rounded-lg border border-brand/30 p-4"><Sparkles className="mb-3 h-6 w-6 text-brand" /><h4 className="font-black">{x}</h4><p className="mt-2 text-sm text-slate2-secondary">Designed for disciplined long-term wealth creation with transparent allocation.</p></div>)}</div></Section><KeyFeatures /><ChatExpert /><InvestmentBreakdown plan={plan} filters={filters} /><Timeline filters={filters} plan={plan} /><PerformanceBars plan={plan} /><CertifiedCard plan={plan} /><Section title="Investment Strategies"><ul className="space-y-3 text-sm text-slate2-secondary">{['Self-Managed','Fund Allocation as per your age','Target Asset Allocation strategy','Trigger Portfolio Strategy'].map((x) => <li key={x}><b className="text-navy">{x}</b> - choose and rebalance funds as per your needs and market movements.</li>)}</ul></Section><Criteria /><div className={`relative text-xs leading-6 text-slate2-secondary ${readMore ? '' : 'max-h-12 overflow-hidden'}`}>The point to point return shown is based on historical fund performance. Past performance is not guaranteed and investment risk is borne by the policyholder. Please read the policy brochure before purchase.</div><button onClick={() => setReadMore((v) => !v)} className="text-sm font-black text-brand">Read More <ChevronDown className={`inline h-4 w-4 ${readMore ? 'rotate-180' : ''}`} /></button></div>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-4 border-b pb-2 text-lg font-black">{title}</h3>{children}</section> }
function KeyFeatures() { return <Section title="Key Features"><div className="flex snap-x gap-4 overflow-x-auto pb-2 scrollbar-hide">{['Capital Guarantee','Tax Savings','AUM','Life Cover','Partial Withdrawals','Monthly Income Benefits'].map((x) => <div key={x} className="min-w-44 snap-start rounded-lg bg-blueBG p-4"><Award className="mb-2 h-6 w-6 text-brand" /><h4 className="font-black">{x}</h4><p className="mt-2 text-xs text-slate2-secondary">Helpful benefit built around long-term goals.</p></div>)}</div></Section> }
function ChatExpert() { return <div className="rounded-lg border border-orange-tag bg-orange-tag/10 p-5 text-center"><p className="font-bold">Let us help you choose the right investment plan for you</p><button className="mt-3 rounded bg-orange-tag px-6 py-2 font-black text-white"><Phone className="inline h-4 w-4" /> Chat with an Expert</button></div> }
function InvestmentBreakdown({ plan, filters }: { plan: InvestmentPlan; filters: Filters }) { return <Section title={`What is ${plan.category}?`}><div className="grid gap-5 md:grid-cols-2"><div className="rounded-lg bg-blueBG p-5"><h4 className="font-black">You invest</h4><p className="text-2xl font-black">Rs{((filters.amount * 12 * filters.investFor) / 100000).toFixed(1)} L</p><p>Market Linked Plan Rs2,859 vs Guaranteed Plan Rs2,141</p><p className="mt-2 text-xs">For {filters.investFor} years | Till {currentYear + filters.investFor}</p></div><div className="rounded-lg bg-green-cta/10 p-5"><h4 className="font-black">You Get</h4><p className="text-2xl font-black text-green-cta">{money(plan.maturityLac * multiplier(filters))}</p><p>Guaranteed Returns Rs6 L</p></div></div></Section> }
function Timeline({ filters, plan }: { filters: Filters; plan: InvestmentPlan }) { return <Section title="How plan works?"><div className="space-y-5 border-l-2 border-dashed border-brand pl-6">{['1st Year - Policy Starts / You Pay Rs5,000/Month','2nd Year - In event of unfortunate demise / Triple Benefit activated',`Policy Maturity in ${filters.withdrawAfter}th Year - ${money(plan.maturityLac * multiplier(filters))}`].map((x) => <div key={x} className="relative rounded-lg bg-blueBG p-4"><span className="absolute -left-9 top-4 h-4 w-4 rounded-full bg-brand" />{x}</div>)}</div></Section> }
function PerformanceBars({ plan }: { plan: InvestmentPlan }) { return <Section title="Past Performance - Annualized Returns">{[10,7,5,3,1].map((year) => { const val = plan.returns[year] || Math.max(6, plan.returns[7] - year); return <div key={year} className="mb-4 grid grid-cols-[95px_1fr_55px] items-center gap-3"><span className="text-sm font-bold">In last {year} Yr</span><span className="h-2 rounded bg-gray-100"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(val * 4, 100)}%` }} className="block h-full rounded bg-green-cta" /></span><b className="text-green-cta">{val.toFixed(1)}%</b></div>})}</Section> }
function CertifiedCard({ plan }: { plan: InvestmentPlan }) { return <div className="rounded-lg border border-dashed border-yellow p-4"><h3 className="font-black">AV Management is Certified Partner in Excellence for {plan.insurer}</h3><p className="mt-2 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-cta" /> Hassle free service</p><p className="text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-cta" /> Excellent claims assistance</p><button className="mt-2 text-brand">View Certificate</button></div> }
function Criteria() { return <Section title="Investment Criteria">{[['Age to start Investing','Minimum 18 Years','Maximum 45 Years'],['Number of years after which investment will mature','Minimum 15 Years','Maximum 20 Years'],['Minimum amount to invest','Monthly Rs2,050','Yearly Rs24,000'],['Number of years you can invest','Limited Pay','Invest for a few years and stay invested for entire policy duration']].map((row) => <div key={row[0]} className="mb-4"><p className="mb-2 text-sm font-black">{row[0]}</p><div className="grid grid-cols-2 bg-blueBG"><span className="p-4">{row[1]}</span><span className="p-4 text-right">{row[2]}</span></div></div>)}</Section> }

function FundTab() { const rows = ['BSE 500 Momentum Value 50 Index Fund','Opportunities Fund','BSE Enhanced Value 30 Index Fund','India Consumption Fund','MidSmallCap 400 Momentum Quality 100 Index Fund','Sector Leaders Index Fund']; return <div><div className="mb-4 flex gap-3"><button className="rounded-full bg-blueBG px-5 py-2 font-bold text-brand">Point to Point Returns</button><button className="rounded-full px-5 py-2 font-bold text-slate2-secondary">Rolling Returns</button><Tooltip text="Compare annualized returns over selected combinations." /></div><div className="mb-4 rounded bg-brand p-4 text-center font-black text-white">Fund Performance</div><div className="space-y-4">{rows.map((row, i) => <div key={row} className="rounded-lg bg-white p-4 shadow-card"><div className="grid grid-cols-[1fr_80px_80px_80px_110px] items-center gap-3 text-sm"><a className="font-black text-brand underline">{row}</a><span>{i ? '17.6%' : 'NFO'}</span><span>{i ? '14.1%' : 'NFO'}</span><span>{i ? '12%' : 'NFO'}</span><button className="rounded-full border border-brand px-3 py-1 text-xs text-brand"><Download className="inline h-3 w-3" /> Download</button></div><p className="mt-2 text-xs text-slate2-secondary">Fund Size: Rs{200 + i * 56} Cr | NAV: Rs{10 + i}.79 <span className={i % 2 ? 'text-red-500' : 'text-green-cta'}>{i % 2 ? '-0.09%' : '0.42%'}</span></p></div>)}</div></div> }
function FaqTab() { const [open, setOpen] = useState(0); const faqs = ['What is a Capital Guarantee Solution Plan?','What is ULIP?','What are Guaranteed Returns Plans?','What happens if I miss a premium?','Can I switch funds?','What tax benefits are available?','What is the lock-in period?','How is death benefit calculated?']; return <div><h2 className="mb-8 text-2xl font-black">Frequently Asked Questions</h2>{faqs.map((q, i) => <div key={q} className="border-b"><button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between py-4 text-left font-bold">{q}{open === i ? <Minus /> : <Plus />}</button>{open === i && <p className="pb-4 text-sm leading-6 text-slate2-secondary">This benefit is explained in simple terms for comparison. Actual values depend on the selected premium, policy term, chosen funds and insurer underwriting rules. Read the brochure before proceeding.</p>}</div>)}</div> }
function FloatingChat() { return <button className="fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-soft"><span className="absolute -left-1 top-2 h-4 w-4 rounded-full bg-red-500" /><MessageCircle className="h-8 w-8" /></button> }
