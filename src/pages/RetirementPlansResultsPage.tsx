import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Coins,
  Info,
  MessageCircle,
  Pencil,
  Phone,
  Play,
  RefreshCw,
  Star,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import {
  RetirementFiltersProvider,
  useRetirementFilters,
  currentYear,
  type GetPensionAs,
  type InvestmentFrequency,
  type IrdaiMandate,
  type PointToPointYears,
  type RetirementFilters,
  type RetirementPlanType,
  type RollingReturnYears,
} from '../context/RetirementFiltersContext'
import { retirementResultsPlans, type RetirementResultsPlan } from '../data/retirementResultsPlans'

type SheetKey = 'amount' | 'investFor' | 'retireAt' | 'planType' | 'pastPerformance' | 'getPensionAs'

/* ────────────────────────────────────────────
   Shared user/profile shape
   ──────────────────────────────────────────── */
interface UserChip {
  name: string
  age: number
  mobile: string
  city: string
  dark: boolean
}

const DEFAULT_USER: UserChip = {
  name: 'The Developer',
  age: 23,
  mobile: '+91 78*****007',
  city: 'Lucknow',
  dark: false,
}

const computeAge = (dob?: string) => {
  if (!dob) return 23
  const d = new Date(dob)
  if (isNaN(d.getTime())) return 23
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return Math.max(18, age)
}

const maskMobile = (mobile: string) => {
  const digits = mobile.replace(/\D/g, '')
  if (digits.length < 10) return DEFAULT_USER.mobile
  return `+91 ${digits.slice(0, 2)}*****${digits.slice(-3)}`
}

/* ────────────────────────────────────────────
   Shared computePlanFigures — drives every card
   ──────────────────────────────────────────── */
export interface PlanFigures {
  returnsPct: number
  pensionPerMonth: number
  taxSavingsCr: number
}

export function computePlanFigures(plan: RetirementResultsPlan, filters: RetirementFilters): PlanFigures {
  // Base return from point-to-point selection
  const base = plan.baseReturns[filters.pointToPoint] ?? plan.baseReturns[7] ?? 0

  // IRDAI mandate adjustment
  const irdai = plan.irdaiReturns[filters.irdaiMandate] ?? base

  // Rolling returns blend
  const rolling = plan.rollingReturns[filters.rollingReturns] ?? base

  // Weighted blend: point-to-point 50%, irdai 30%, rolling 20%
  const returnsPct = Math.round((base * 0.5 + irdai * 0.3 + rolling * 0.2) * 10) / 10

  // Pension scales with amount & frequency
  const annualAmount = filters.frequency === 'Yearly' ? filters.amount : filters.amount * 12
  const scale = annualAmount / 60000 // baseline ₹60k/yr
  const pensionPerMonth = Math.round(plan.pensionPerMonth * scale * 100) / 100

  // Tax savings scale with amount
  const taxSavingsCr = Math.round((plan.saveTaxUpto ?? 0) * scale * 100) / 100

  return { returnsPct, pensionPerMonth, taxSavingsCr }
}

/* ────────────────────────────────────────────
   Page root
   ──────────────────────────────────────────── */
export default function RetirementPlansResultsPage() {
  return (
    <RetirementFiltersProvider>
      <RetirementPlansResultsInner />
    </RetirementFiltersProvider>
  )
}

function RetirementPlansResultsInner() {
  const location = useLocation()
  const { filters, dispatch } = useRetirementFilters()

  const [activeSheet, setActiveSheet] = useState<SheetKey | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [expertOpen, setExpertOpen] = useState(false)
  const [user, setUser] = useState<UserChip>(DEFAULT_USER)
  const [selectedPlan, setSelectedPlan] = useState<RetirementResultsPlan | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  /* Hydrate user chip from the View Plans form submission */
  useEffect(() => {
    const state = location.state as { name?: string; dob?: string; mobile?: string; city?: string } | null
    if (state && (state.name || state.dob || state.mobile)) {
      setUser((prev) => ({
        ...prev,
        name: state.name?.trim() || prev.name,
        age: computeAge(state.dob),
        mobile: maskMobile(state.mobile || ''),
        city: state.city?.trim() || prev.city,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Lock body scroll while any overlay is open */
  useEffect(() => {
    const anyOpen = activeSheet !== null || profileOpen || expertOpen || drawerOpen
    document.body.style.overflow = anyOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeSheet, profileOpen, expertOpen, drawerOpen])

  const openSheet = (key: SheetKey) => {
    setProfileOpen(false)
    setExpertOpen(false)
    setActiveSheet(key)
  }

  const openProfile = () => {
    setActiveSheet(null)
    setExpertOpen(false)
    setProfileOpen(true)
  }

  const openExpert = () => {
    setActiveSheet(null)
    setProfileOpen(false)
    setExpertOpen(true)
  }

  return (
    <div className={`min-h-screen transition-colors ${user.dark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f4f8ff] text-navy'}`}>
      <ScrollProgressBar />
      <MarketTickerBar />
      <ResultsHeader user={user} onOpenProfile={openProfile} />

      <ResultsFilterBar
        filters={filters}
        activeSheet={activeSheet}
        onOpenSheet={openSheet}
        onTalkExpert={openExpert}
        userAge={user.age}
        dark={user.dark}
      />

      {/* ─── Main content — 70/30 split ─── */}
      <main className="container-pb mx-auto grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          <PlanListHeader filters={filters} />

          <div className="space-y-4">
            {retirementResultsPlans.map((plan, idx) => (
              <div key={plan.id} className="relative">
                {idx === 0 && <PreNfoBadge />}
                <RetirementPlanCard
                  plan={plan}
                  filters={filters}
                  onViewDetails={() => {
                    setSelectedPlan(plan)
                    setDrawerOpen(true)
                  }}
                />
              </div>
            ))}
          </div>

          <RetirementResultsDisclaimers />
        </section>

        <aside className="hidden lg:block">
          <RetirementResultsSidebar onOpenChat={openExpert} />
        </aside>
      </main>

      {/* Plan Details Drawer */}
      <RetirementPlanDetailsDrawer
        plan={selectedPlan}
        filters={filters}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedPlan(null)
        }}
      />

      {/* ─── Bottom sheets (Apply-gated) ─── */}
      <AnimatePresence>
        {activeSheet === 'amount' && (
          <AmountSheet
            key="amount"
            filters={filters}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeSheet === 'investFor' && (
          <InvestForSheet
            key="investFor"
            filters={filters}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeSheet === 'retireAt' && (
          <RetireAtSheet
            key="retireAt"
            filters={filters}
            userAge={user.age}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeSheet === 'planType' && (
          <PlanTypeSheet
            key="planType"
            filters={filters}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeSheet === 'pastPerformance' && (
          <PastPerformanceSheet
            key="pastPerformance"
            filters={filters}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeSheet === 'getPensionAs' && (
          <GetPensionAsSheet
            key="getPensionAs"
            filters={filters}
            onApply={(payload) => {
              dispatch({ type: 'SET_FILTERS', payload })
              setActiveSheet(null)
            }}
            onClose={() => setActiveSheet(null)}
          />
        )}
      </AnimatePresence>

      <ProfileModal
        isOpen={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
        onSave={(next) => setUser(next)}
      />
      <ExpertModal isOpen={expertOpen} onClose={() => setExpertOpen(false)} />
    </div>
  )
}

/* ────────────────────────────────────────────
   1. Scroll progress bar
   ──────────────────────────────────────────── */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-white/20">
      <div className="h-full bg-brand transition-[width] duration-75 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

/* ────────────────────────────────────────────
   2. Market ticker bar (above header)
   ──────────────────────────────────────────── */
interface IndexTicker {
  name: string
  value: string
  change: number
}

const INDEX_TICKERS: IndexTicker[] = [
  { name: 'BSE SENSEX', value: '77,809.78', change: -0.35 },
  { name: 'BSE 150 Midcap Index', value: '18,234.56', change: 0.82 },
  { name: 'BSE 250 SmallCap Index', value: '15,678.90', change: 1.24 },
  { name: 'BSE 100 Index', value: '24,567.12', change: -0.12 },
]

function MarketTickerBar() {
  const lastUpdated = '14 Aug, 01:33 PM IST'

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container-pb flex items-center gap-4 overflow-x-auto py-2 scrollbar-hide">
        <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-slate2-muted">
          <RefreshCw size={12} className="text-brand" />
          <span>
            Last updated: <span className="font-bold text-navy">{lastUpdated}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {INDEX_TICKERS.map((ticker) => {
            const isPositive = ticker.change >= 0
            return (
              <div key={ticker.name} className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-slate2-muted">{ticker.name}</p>
                  <p className="text-[12px] font-bold text-navy">{ticker.value}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {ticker.change.toFixed(2)}%
                </span>
                <ChevronDown size={12} className="text-slate-400" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   3. Black header (reused pattern)
   ──────────────────────────────────────────── */
function ResultsHeader({ user, onOpenProfile }: { user: UserChip; onOpenProfile: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-lg">
      <div className="container-pb flex h-[60px] items-center justify-between">
        <Link to="/" className="flex items-center rounded-lg px-1 py-1">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
        </Link>

        <button
          onClick={onOpenProfile}
          className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-3 text-white transition-colors hover:border-brand/60 hover:bg-white/10"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
            <User size={16} />
          </span>
          <span className="hidden text-[13px] font-medium sm:block">
            {user.name} <span className="text-white/50">•</span> {user.age} Yrs{' '}
            <span className="text-white/50">•</span> {user.city}
          </span>
          <ChevronDown size={14} className="text-white/70 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </header>
  )
}

/* ────────────────────────────────────────────
   4. Sticky filter bar — 6 chips
   ──────────────────────────────────────────── */
function ResultsFilterBar({
  filters,
  activeSheet,
  onOpenSheet,
  onTalkExpert,
  userAge,
  dark,
}: {
  filters: RetirementFilters
  activeSheet: SheetKey | null
  onOpenSheet: (key: SheetKey) => void
  onTalkExpert: () => void
  userAge: number
  dark: boolean
}) {
  return (
    <div className={`sticky top-[60px] z-30 border-b shadow-sm backdrop-blur transition-colors ${dark ? 'border-slate-800 bg-[#111827]' : 'border-slate2-border bg-white'}`}>
      <div className="container-pb flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
        <FilterChip
          label="Investment amount"
          active={activeSheet === 'amount'}
          onClick={() => onOpenSheet('amount')}
          dark={dark}
        >
          <span className="text-[15px] font-bold">
            ₹{filters.amount.toLocaleString('en-IN')} <span className="font-medium text-slate2-muted">/ {filters.frequency}</span>
          </span>
        </FilterChip>

        <FilterChip
          label="Invest for"
          active={activeSheet === 'investFor'}
          onClick={() => onOpenSheet('investFor')}
          dark={dark}
        >
          <span className="flex items-center gap-2 text-[15px] font-bold">
            {filters.investFor} Years
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate2-secondary'}`}>
              Till {currentYear + filters.investFor}
            </span>
          </span>
        </FilterChip>

        <FilterChip
          label="Retire at"
          active={activeSheet === 'retireAt'}
          onClick={() => onOpenSheet('retireAt')}
          dark={dark}
        >
          <span className="flex items-center gap-2 text-[15px] font-bold">
            {filters.retireAt} Years
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate2-secondary'}`}>
              From {currentYear + Math.max(0, filters.retireAt - userAge)}
            </span>
          </span>
        </FilterChip>

        <FilterChip
          label="Plan type"
          active={activeSheet === 'planType'}
          onClick={() => onOpenSheet('planType')}
          dark={dark}
        >
          <span className="text-[15px] font-bold">{filters.planType}</span>
        </FilterChip>

        <FilterChip
          label="Past performance"
          active={activeSheet === 'pastPerformance'}
          onClick={() => onOpenSheet('pastPerformance')}
          dark={dark}
        >
          <span className="text-[15px] font-bold">{filters.pointToPoint} Years</span>
        </FilterChip>

        <FilterChip
          label="Get pension as"
          active={activeSheet === 'getPensionAs'}
          onClick={() => onOpenSheet('getPensionAs')}
          dark={dark}
        >
          <span className="text-[15px] font-bold">{filters.getPensionAs}</span>
        </FilterChip>

        <button
          onClick={onTalkExpert}
          className="flex h-[62px] min-w-[150px] shrink-0 items-center justify-center gap-2 rounded-lg bg-green-cta px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-ctaDark"
        >
          <Phone size={16} />
          Talk to Expert
        </button>
      </div>
    </div>
  )
}

function FilterChip({
  label,
  children,
  active,
  onClick,
  dark,
}: {
  label: string
  children: React.ReactNode
  active: boolean
  onClick: () => void
  dark: boolean
}) {
  const inactive = dark ? 'bg-[#1f2937] text-white shadow-none' : 'bg-white text-navy shadow-card'
  return (
    <button
      onClick={onClick}
      className={`flex h-[62px] min-w-[175px] shrink-0 items-center justify-between gap-3 rounded-lg border px-4 text-left transition-all ${
        active
          ? 'border-brand bg-brand/5 text-brand shadow-sm'
          : `border-transparent ${inactive} hover:border-brand/40`
      }`}
    >
      <span className="min-w-0">
        <span className={`block text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-slate2-muted'}`}>{label}</span>
        <span className="mt-0.5 block truncate">{children}</span>
      </span>
      <ChevronDown size={16} className={`shrink-0 transition-transform ${active ? 'rotate-180 text-brand' : dark ? 'text-slate-400' : 'text-brand'}`} />
    </button>
  )
}

/* ────────────────────────────────────────────
   Plan List Header + Pre-NFO badge
   ──────────────────────────────────────────── */
function PlanListHeader({ filters }: { filters: RetirementFilters }) {
  const heading =
    filters.planType === 'Market linked' ? 'Market Linked Plans' : `${filters.planType} Plans`
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-brand" />
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
    </div>
  )
}

function PreNfoBadge() {
  return (
    <div className="relative z-10 -mb-3 flex justify-center">
      <span className="rounded-full bg-green-cta px-4 py-1.5 text-[11px] font-bold text-white shadow-md">
        Pre New Fund Offer – Last 4 Days Left
      </span>
    </div>
  )
}

/* ────────────────────────────────────────────
   Retirement Plan Card (retirementReturns variant)
   ──────────────────────────────────────────── */
function RetirementPlanCard({
  plan,
  filters,
  onViewDetails,
}: {
  plan: RetirementResultsPlan
  filters: RetirementFilters
  onViewDetails: () => void
}) {
  const figures = computePlanFigures(plan, filters)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header: Logo + Plan Name */}
      <div className="mb-4 flex gap-4">
        <img
          src={plan.insurerLogo}
          alt={plan.insurer}
          className="h-12 w-12 rounded-full object-cover bg-slate-100"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-navy">{plan.planName}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{plan.insurer}</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
        {/* Middle stat: N Yr Returns */}
        <div className="flex flex-col justify-center rounded-lg bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-600">{filters.pointToPoint} Yr Returns</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{figures.returnsPct}%</p>
        </div>

        {/* Right stat: Tax free + Pension */}
        <div className="flex flex-col justify-center rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Tax free</span>
            <span className="text-[11px] font-medium text-slate-600">{plan.pensionLabel}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-navy">₹{figures.pensionPerMonth.toFixed(2)} L/month</p>
        </div>

        {/* View Details Button */}
        <div className="flex items-center">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            View Details
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Optional info pill */}
      {plan.infoPill && (
        <div className="mb-3 flex items-center gap-1.5 rounded-full bg-orange-tagBg px-3 py-1.5 text-[11px] font-semibold text-orange-tag">
          <Coins size={13} />
          {plan.infoPill}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {plan.tags.map((tag, idx) => (
          <TagPill key={idx} tag={tag} />
        ))}
        {plan.newFundLaunched && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
            New Fund Launched | {plan.newFundLaunched}
          </span>
        )}
        {plan.instantTaxReceipt && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
            <Check size={12} />
            Instant Tax Receipt
          </span>
        )}
      </div>
    </motion.div>
  )
}

function TagPill({ tag }: { tag: string }) {
  let icon: React.ReactNode = null
  if (tag.includes('Save Tax')) icon = <Check size={12} />
  if (tag.includes('Inbuilt')) icon = <Check size={12} />
  if (tag.includes('Zero GST')) icon = <Star size={12} className="fill-amber-400 text-amber-400" />

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100">
      {icon}
      {tag}
    </span>
  )
}

/* ────────────────────────────────────────────
   Disclaimers
   ──────────────────────────────────────────── */
function RetirementResultsDisclaimers() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-[11px] leading-relaxed text-slate2-muted">
      <p>
        * All returns shown are point-to-point annualized returns for the selected period. Past performance is not
        indicative of future results. Pension amounts are illustrative and depend on the chosen plan, investment
        amount, frequency, and retirement age. Please read the offer document carefully before investing.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────
   Shared Apply-gated bottom sheet
   ──────────────────────────────────────────── */
function FilterSheet({
  title,
  children,
  onClose,
  onApply,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  onApply: () => void
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80]"
    >
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <h3 className="text-[17px] font-bold text-navy">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        <div className="av-modal-scroll max-h-[58vh] overflow-y-auto px-5 pb-5 pt-3">{children}</div>

        <div className="border-t border-slate2-border bg-white p-4">
          <button
            onClick={onApply}
            className="w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Filter 1 — Investment amount
   ──────────────────────────────────────────── */
function AmountSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [amount, setAmount] = useState(filters.amount)
  const [frequency, setFrequency] = useState<InvestmentFrequency>(filters.frequency)
  const [editing, setEditing] = useState(false)

  return (
    <FilterSheet
      title="Investment amount"
      onClose={onClose}
      onApply={() => onApply({ amount: Math.max(0, amount || 0), frequency })}
    >
      <p className="text-[13px] font-semibold text-slate2-secondary">Invested amount</p>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate2-border bg-blueBG/40 px-4 py-3 focus-within:border-brand">
        <span className="text-xl font-bold text-navy">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={amount === 0 ? '' : String(amount)}
          onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          placeholder="0"
          className="min-w-0 flex-1 bg-transparent text-xl font-bold text-navy outline-none"
        />
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${editing ? 'bg-brand text-white' : 'bg-white text-brand shadow-sm'}`}
          aria-label={editing ? 'Save amount' : 'Edit amount'}
        >
          {editing ? <Check size={15} /> : <Pencil size={15} />}
        </button>
        <span className="whitespace-nowrap text-[11px] font-medium text-slate2-muted">to save</span>
      </div>

      <h4 className="mb-3 mt-6 text-sm font-bold text-navy">Payment frequency</h4>
      <div className="space-y-2.5">
        {(['Monthly', 'Yearly'] as const).map((item) => {
          const selected = frequency === item
          return (
            <button
              key={item}
              onClick={() => setFrequency(item)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                }`}
              />
              {item}
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Filter 2 — Invest for
   ──────────────────────────────────────────── */
const DURATIONS = [5, 7, 10, 12, 15, 20] as const

function InvestForSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(filters.investFor)

  return (
    <FilterSheet title="Invest for" onClose={onClose} onApply={() => onApply({ investFor: draft })}>
      <div className="space-y-2.5">
        {DURATIONS.map((duration) => {
          const selected = draft === duration
          return (
            <button
              key={duration}
              onClick={() => setDraft(duration)}
              className={`flex w-full items-center justify-between gap-5 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                selected ? 'border-brand bg-brand/5' : 'border-slate2-border'
              }`}
            >
              <span className={`flex items-center gap-3 text-[14px] font-semibold ${selected ? 'text-brand' : 'text-navy'}`}>
                <span
                  className={`h-5 w-5 rounded-full border-2 ${
                    selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                  }`}
                />
                {duration} Years
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                  selected ? 'bg-brand text-white' : 'bg-slate-100 text-slate2-secondary'
                }`}
              >
                Till {currentYear + duration}
              </span>
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Filter 3 — Retire at (age)
   ──────────────────────────────────────────── */
const RETIRE_AGES = [50, 55, 60, 65, 70, 75] as const

function RetireAtSheet({
  filters,
  userAge,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  userAge: number
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(filters.retireAt)

  return (
    <FilterSheet title="Retire at (age)" onClose={onClose} onApply={() => onApply({ retireAt: draft })}>
      <div className="space-y-2.5">
        {RETIRE_AGES.map((age) => {
          const selected = draft === age
          const yearsToRetire = Math.max(0, age - userAge)
          return (
            <button
              key={age}
              onClick={() => setDraft(age)}
              className={`flex w-full items-center justify-between gap-5 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                selected ? 'border-brand bg-brand/5' : 'border-slate2-border'
              }`}
            >
              <span className={`flex items-center gap-3 text-[14px] font-semibold ${selected ? 'text-brand' : 'text-navy'}`}>
                <span
                  className={`h-5 w-5 rounded-full border-2 ${
                    selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                  }`}
                />
                {age} Yrs
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                  selected ? 'bg-brand text-white' : 'bg-slate-100 text-slate2-secondary'
                }`}
              >
                From {currentYear + yearsToRetire}
              </span>
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Filter 4 — Plan type
   ──────────────────────────────────────────── */
const PLAN_TYPES: RetirementPlanType[] = ['Pension Plan', 'Market Linked Annuity', 'Annuity Plans', 'Market linked']

function PlanTypeSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<RetirementPlanType>(filters.planType)

  return (
    <FilterSheet title="Select plan type" onClose={onClose} onApply={() => onApply({ planType: draft })}>
      <div className="space-y-2.5">
        {PLAN_TYPES.map((type) => {
          const selected = draft === type
          return (
            <button
              key={type}
              onClick={() => setDraft(type)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                }`}
              />
              {type}
              {type === 'Market Linked Annuity' && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">New</span>
              )}
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Filter 5 — Past performance
   ──────────────────────────────────────────── */
const POINT_TO_POINT_OPTIONS: PointToPointYears[] = [10, 8, 7, 6, 5]
const IRDAI_OPTIONS: IrdaiMandate[] = [4, 8]
const ROLLING_OPTIONS: RollingReturnYears[] = [3, 5, 7, 10]

function PastPerformanceSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [pointToPoint, setPointToPoint] = useState<PointToPointYears>(filters.pointToPoint)
  const [irdai, setIrdai] = useState<IrdaiMandate>(filters.irdaiMandate)
  const [rolling, setRolling] = useState<RollingReturnYears>(filters.rollingReturns)
  const [rollingOpen, setRollingOpen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <FilterSheet
      title="Point To Point"
      onClose={onClose}
      onApply={() => onApply({ pointToPoint, irdaiMandate: irdai, rollingReturns: rolling })}
    >
      {/* Title row with info icon + collapse */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-navy">Point To Point</h4>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600"
            >
              <Info size={12} />
            </button>
            {showInfo && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-[10px] leading-relaxed text-white shadow-lg">
                Point-to-point returns measure the growth of an investment from a specific start date to an end date.
              </div>
            )}
          </div>
        </div>
        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* Point to Point radio list */}
      <div className="space-y-2.5">
        {POINT_TO_POINT_OPTIONS.map((years) => {
          const selected = pointToPoint === years
          return (
            <button
              key={years}
              onClick={() => setPointToPoint(years)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                }`}
              />
              {years} Years
            </button>
          )
        })}
      </div>

      {/* IRDAI Mandate Returns */}
      <h4 className="mb-3 mt-6 text-sm font-bold text-navy">IRDAI Mandate Returns</h4>
      <div className="space-y-2.5">
        {IRDAI_OPTIONS.map((pct) => {
          const selected = irdai === pct
          return (
            <button
              key={pct}
              onClick={() => setIrdai(pct)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                }`}
              />
              {pct}%
            </button>
          )
        })}
      </div>

      {/* Rolling Returns (collapsible) */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setRollingOpen(!rollingOpen)}
          className="flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-navy">
            Rolling Returns
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Info size={12} />
            </span>
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${rollingOpen ? 'rotate-180' : ''}`} />
        </button>

        {rollingOpen && (
          <div className="mt-3 space-y-2.5">
            {ROLLING_OPTIONS.map((years) => {
              const selected = rolling === years
              return (
                <button
                  key={years}
                  onClick={() => setRolling(years)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                    selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border-2 ${
                      selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                    }`}
                  />
                  {years} Years
                </button>
              )
            })}
          </div>
        )}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Filter 6 — Get pension as
   ──────────────────────────────────────────── */
const PENSION_OPTIONS: GetPensionAs[] = ['Monthly', 'Quarterly', 'Yearly', 'Lumpsum']

function GetPensionAsSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: RetirementFilters
  onApply: (payload: Partial<RetirementFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<GetPensionAs>(filters.getPensionAs)

  return (
    <FilterSheet title="Get pension as" onClose={onClose} onApply={() => onApply({ getPensionAs: draft })}>
      <div className="space-y-2.5">
        {PENSION_OPTIONS.map((option) => {
          const selected = draft === option
          return (
            <button
              key={option}
              onClick={() => setDraft(option)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${
                selected ? 'border-brand bg-brand/5 text-brand' : 'border-slate2-border text-navy'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_white]' : 'border-slate2-secondary'
                }`}
              />
              {option}
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   Plan Details Drawer (stub for retirement)
   ──────────────────────────────────────────── */
function RetirementPlanDetailsDrawer({
  plan,
  filters,
  isOpen,
  onClose,
}: {
  plan: RetirementResultsPlan | null
  filters: RetirementFilters
  isOpen: boolean
  onClose: () => void
}) {
  if (!plan) return null
  const figures = computePlanFigures(plan, filters)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-20 border-b-2 border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-navy">Retirement Plan</h2>
                <button className="flex items-center gap-2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                  <Phone size={12} />
                  Talk to Expert
                </button>
              </div>

              <div className="flex items-center gap-3 px-6 pb-4">
                <img src={plan.insurerLogo} alt={plan.insurer} className="h-10 w-10 rounded-lg bg-white p-1 object-contain" />
                <div>
                  <p className="text-xs font-medium text-slate-600">{plan.insurer}</p>
                  <p className="font-bold text-navy">{plan.planName}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">{filters.pointToPoint} Yr Returns</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{figures.returnsPct}%</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">Pension</p>
                  <p className="mt-1 text-2xl font-bold text-navy">₹{figures.pensionPerMonth.toFixed(2)} L/month</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-bold text-navy">Key Features</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-sm font-bold text-navy">Regular Income</p>
                      <p className="text-xs text-slate-600">Monthly pension after retirement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="text-sm font-bold text-navy">Tax Savings</p>
                      <p className="text-xs text-slate-600">Save tax up to ₹{figures.taxSavingsCr} Cr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="text-sm font-bold text-navy">Life Cover</p>
                      <p className="text-xs text-slate-600">Inbuilt life cover protects your family</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t-2 border-slate-200 bg-white p-6 shadow-lg">
              <button className="w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark">
                Proceed
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────
   Sidebar
   ──────────────────────────────────────────── */
function RetirementResultsSidebar({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div className="sticky top-[200px] space-y-4">
      <GstPromoCard />
      <QuickLinksList />
      <VideoPromoCard />
      <FloatingChatBubble onClick={onOpenChat} />
    </div>
  )
}

function GstPromoCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-navy">India's growth story gets a GST 2.0 Boost</h3>
      <div className="mt-3 flex h-24 items-center justify-center rounded-lg border border-amber-100 bg-gradient-to-br from-yellow-50 to-amber-50">
        <span className="text-3xl">📈</span>
      </div>
      <button className="mt-3 w-full rounded-lg border border-slate-300 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
        Read stories
      </button>
    </div>
  )
}

function QuickLinksList() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggle = (key: string) => setOpenSection(openSection === key ? null : key)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-[13px] font-semibold text-navy transition-colors hover:bg-slate-50">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-brand">
            <CircleDollarSign size={16} />
          </span>
          Let's plan your goals
        </button>

        <button
          onClick={() => toggle('compounding')}
          className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-[13px] font-semibold text-navy transition-colors hover:bg-slate-50"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-green-50 text-green-600">
              <TrendingUp size={16} />
            </span>
            Power of Compounding
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSection === 'compounding' ? 'rotate-180' : ''}`} />
        </button>
        {openSection === 'compounding' && (
          <div className="ml-11 space-y-2 border-l border-slate-200 pl-3">
            <a href="#" className="block text-xs font-medium text-brand hover:text-brand-dark">How compounding works</a>
            <a href="#" className="block text-xs font-medium text-brand hover:text-brand-dark">Compounding calculator</a>
          </div>
        )}

        <button
          onClick={() => toggle('compare')}
          className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-[13px] font-semibold text-navy transition-colors hover:bg-slate-50"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-purple-50 text-purple2">
              <TrendingDown size={16} />
            </span>
            Compare & Invest
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSection === 'compare' ? 'rotate-180' : ''}`} />
        </button>
        {openSection === 'compare' && (
          <div className="ml-11 space-y-2 border-l border-slate-200 pl-3">
            <a href="#" className="block text-xs font-medium text-brand hover:text-brand-dark">Compare Retirement Plans</a>
            <a href="#" className="block text-xs font-medium text-brand hover:text-brand-dark">Compare Pension Plans</a>
          </div>
        )}

        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-[13px] font-semibold text-navy transition-colors hover:bg-slate-50">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-orange-tag">
            <Coins size={16} />
          </span>
          Tax benefits on ULIP
        </button>
      </div>
    </div>
  )
}

function VideoPromoCard() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-navy">Wartime investing Yes | No?</h3>
      <div className="relative mt-3 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900">
        <span className="text-3xl">📊</span>
        <button
          onClick={() => setVideoOpen(true)}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play video"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-brand shadow-lg transition-transform hover:scale-110">
            <Play size={20} className="ml-0.5 fill-brand" />
          </span>
        </button>
      </div>

      {videoOpen && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/70 p-4" onClick={() => setVideoOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy">Wartime investing Yes | No?</h4>
              <button onClick={() => setVideoOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex h-40 items-center justify-center rounded-lg bg-slate-900">
              <span className="text-4xl">📊</span>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">Video player coming soon</p>
          </div>
        </div>
      )}
    </div>
  )
}

function FloatingChatBubble({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-colors hover:scale-110 hover:bg-brand-dark"
      aria-label="Chat with us"
    >
      <MessageCircle size={24} />
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500" />
    </button>
  )
}

/* ────────────────────────────────────────────
   Profile modal
   ──────────────────────────────────────────── */
function ProfileModal({
  isOpen,
  user,
  onClose,
  onSave,
}: {
  isOpen: boolean
  user: UserChip
  onClose: () => void
  onSave: (user: UserChip) => void
}) {
  const [draft, setDraft] = useState(user)

  useEffect(() => {
    if (isOpen) setDraft(user)
  }, [isOpen, user])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (isOpen) window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [isOpen, onClose])

  const update = () => {
    onSave({
      name: draft.name.trim() || user.name,
      age: Math.max(18, draft.age || user.age),
      mobile: user.mobile,
      city: draft.city.trim() || user.city,
      dark: draft.dark,
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[85] bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed right-4 top-[64px] z-[90] w-[min(420px,calc(100vw-2rem))] rounded-2xl bg-white p-6 text-navy shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-navy">Personalise your experience</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">Your name</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-[14px] font-medium text-navy outline-none focus:border-brand"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">Your age</span>
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={draft.age}
                  onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-[14px] font-medium text-navy outline-none focus:border-brand"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">Your mobile number</span>
                <span className="flex w-full items-center rounded-lg border border-slate2-border bg-slate-50 px-3.5 py-2.5 text-[14px] font-medium text-slate2-secondary">
                  {user.mobile}
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">City</span>
                <input
                  value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                  className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-[14px] font-medium text-navy outline-none focus:border-brand"
                />
              </label>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-[13px] font-semibold text-navy">Dark mode</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.dark}
                  onClick={() => setDraft({ ...draft, dark: !draft.dark })}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors ${draft.dark ? 'bg-brand' : 'bg-slate-300'}`}
                >
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${draft.dark ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <button
              onClick={update}
              className="mt-5 w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
            >
              UPDATE
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────
   Talk to Expert modal
   ──────────────────────────────────────────── */
function ExpertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false)
      setName('')
      setMobile('')
    }
  }, [isOpen])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (isOpen) window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [isOpen, onClose])

  const canSubmit = name.trim().length > 0 && mobile.replace(/\D/g, '').length >= 10

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] grid place-items-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-navy shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-navy">Talk to an Expert</h3>
                <p className="mt-1 text-[12px] text-slate2-secondary">We'll call you back shortly</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-cta/10 text-green-cta">
                  <Check size={26} />
                </span>
                <p className="mt-4 text-[15px] font-bold text-navy">Request received!</p>
                <p className="mt-1 text-[12px] text-slate2-secondary">
                  An AV Management expert will call you at <b>{mobile}</b>.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 w-full rounded-lg bg-brand py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">Your name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-[14px] text-navy outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-semibold text-slate2-secondary">Mobile number</span>
                    <span className="flex items-center rounded-lg border border-slate2-border px-3.5 focus-within:border-brand">
                      <span className="mr-2 border-r border-slate2-border pr-2.5 text-[12px] font-medium text-slate2-secondary">+91</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        placeholder="10 digit mobile number"
                        className="min-w-0 flex-1 py-2.5 text-[14px] outline-none"
                      />
                    </span>
                  </label>
                </div>
                <button
                  onClick={() => canSubmit && setSubmitted(true)}
                  disabled={!canSubmit}
                  className="mt-5 w-full rounded-lg bg-green-cta py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-green-ctaDark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Request Callback
                </button>
                <p className="mt-3 text-center text-[10px] leading-4 text-slate2-muted">
                  By continuing, you agree to AV Management's privacy policy and terms.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}