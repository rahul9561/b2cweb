import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Pencil, Phone, User, X } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import {
  GuaranteedFiltersProvider,
  useGuaranteedFilters,
  currentYear,
  type GuaranteedFilters,
  type GetMoneyAs,
  type GuaranteedSub,
  type InvestmentFrequency,
  type MarketSub,
  type PlanType,
} from '../context/GuaranteedFiltersContext'
import { guaranteedPlans, type GuaranteedPlan } from '../data/guaranteedPlans'
import PlanCard, { MorePlansExpander } from '../components/PlanCard'
import ResultsSidebar from '../components/ResultsSidebar'
import GuaranteedResultsDisclaimers from '../components/GuaranteedResultsDisclaimers'
import UnderstandYourPlanDrawer from '../components/UnderstandYourPlanDrawer'

type SheetKey = 'amount' | 'investFor' | 'planType' | 'getMoneyAs'

/* ────────────────────────────────────────────
   Shared user/profile shape
   ──────────────────────────────────────────── */
interface UserChip {
  name: string
  age: number
  mobile: string // already masked +91 display
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
   Page root — provides shared filter state
   (Part 2 will consume the same context)
   ──────────────────────────────────────────── */
export default function GuaranteedReturnPlansPage() {
  return (
    <GuaranteedFiltersProvider>
      <GuaranteedReturnPlansInner />
    </GuaranteedFiltersProvider>
  )
}

function GuaranteedReturnPlansInner() {
  const location = useLocation()
  const { filters, dispatch } = useGuaranteedFilters()

  const [activeSheet, setActiveSheet] = useState<SheetKey | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [expertOpen, setExpertOpen] = useState(false)
  const [user, setUser] = useState<UserChip>(DEFAULT_USER)
  const [selectedPlan, setSelectedPlan] = useState<GuaranteedPlan | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedInsurerGroups, setExpandedInsurerGroups] = useState<Record<string, boolean>>({})

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
      <ResultsHeader user={user} onOpenProfile={openProfile} />

      <ResultsFilterBar
        filters={filters}
        activeSheet={activeSheet}
        onOpenSheet={openSheet}
        onTalkExpert={openExpert}
        dark={user.dark}
      />

      {/* ─── Main content — 70/30 split ─── */}
      <main className="container-pb mx-auto grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          {/* Section header */}
          <PlanListHeader filters={filters} />

          {/* Plan cards grouped by insurer */}
          <PlanListRenderer
            plans={guaranteedPlans}
            expandedInsurerGroups={expandedInsurerGroups}
            onToggleExpanded={(insurer) => {
              setExpandedInsurerGroups((prev) => ({
                ...prev,
                [insurer]: !prev[insurer],
              }))
            }}
            onViewDetails={(plan) => {
              setSelectedPlan(plan)
              setDrawerOpen(true)
            }}
          />

          {/* Disclaimers */}
          <GuaranteedResultsDisclaimers />
        </section>

        <aside className="hidden lg:block">
          <ResultsSidebar
            filters={filters}
            onFiltersChange={(payload) => dispatch({ type: 'SET_FILTERS', payload })}
            onOpenChat={openExpert}
          />
        </aside>
      </main>

      {/* Understand Your Plan Drawer */}
      <UnderstandYourPlanDrawer
        plan={selectedPlan}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedPlan(null)
        }}
        onProceed={(plan) => {
          console.log('Proceed with plan:', plan)
          // Navigate to next step in purchase flow
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
        {activeSheet === 'getMoneyAs' && (
          <GetMoneyAsSheet
            key="getMoneyAs"
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
   1. Scroll progress bar (fixed, highest z)
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
   2. Custom black header (page-specific)
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
   3. Sticky filter bar — 4 chips + Talk to Expert
   ──────────────────────────────────────────── */
function ResultsFilterBar({
  filters,
  activeSheet,
  onOpenSheet,
  onTalkExpert,
  dark,
}: {
  filters: GuaranteedFilters
  activeSheet: SheetKey | null
  onOpenSheet: (key: SheetKey) => void
  onTalkExpert: () => void
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
            {filters.investFor === 0 ? 'One Time' : `${filters.investFor} Years`}
            {filters.investFor > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate2-secondary'}`}>
                Till {currentYear + filters.investFor}
              </span>
            )}
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
          label="Get money as"
          active={activeSheet === 'getMoneyAs'}
          onClick={() => onOpenSheet('getMoneyAs')}
          dark={dark}
        >
          <span className="text-[15px] font-bold">{filters.getMoneyAs}</span>
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
   Plan List Rendering Components
   ──────────────────────────────────────────── */
function PlanListHeader({ filters }: { filters: GuaranteedFilters }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-6 w-1 bg-brand rounded-full" />
      <h2 className="text-lg font-bold text-navy">{filters.planType}</h2>
    </div>
  )
}

interface PlanListRendererProps {
  plans: GuaranteedPlan[]
  expandedInsurerGroups: Record<string, boolean>
  onToggleExpanded: (insurer: string) => void
  onViewDetails: (plan: GuaranteedPlan) => void
}

function PlanListRenderer({
  plans,
  expandedInsurerGroups,
  onToggleExpanded,
  onViewDetails,
}: PlanListRendererProps) {
  // Group plans by insurer
  const grouped = plans.reduce(
    (acc, plan) => {
      if (!acc[plan.insurerName]) {
        acc[plan.insurerName] = []
      }
      acc[plan.insurerName].push(plan)
      return acc
    },
    {} as Record<string, GuaranteedPlan[]>
  )

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([insurer, insurerPlans]) => {
        const isExpanded = expandedInsurerGroups[insurer] || false
        const showExpander = insurerPlans.length > 2
        const displayPlans = showExpander && !isExpanded ? insurerPlans.slice(0, 2) : insurerPlans

        return (
          <div key={insurer}>
            {/* Plan cards */}
            <div className="space-y-4">
              {displayPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onViewDetails={onViewDetails} />
              ))}
            </div>

            {/* More Plans expander */}
            {showExpander && (
              <MorePlansExpander
                count={insurerPlans.length - 2}
                isExpanded={isExpanded}
                onToggle={() => onToggleExpanded(insurer)}
              />
            )}
          </div>
        )
      })}
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
      if (e.key === 'Escape') onClose() // discard in-progress selection
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
      {/* Outside click → discard */}
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl"
      >
        {/* Drag handle */}
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
   3.1 Filter 1 — Investment amount
   ──────────────────────────────────────────── */
function AmountSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: GuaranteedFilters
  onApply: (payload: Partial<GuaranteedFilters>) => void
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
   3.2 Filter 2 — Invest for
   ──────────────────────────────────────────── */
const DURATIONS = [0, 5, 6, 7, 10, 12] as const

function InvestForSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: GuaranteedFilters
  onApply: (payload: Partial<GuaranteedFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(filters.investFor)

  return (
    <FilterSheet title="Invest for" onClose={onClose} onApply={() => onApply({ investFor: draft })}>
      <div className="space-y-2.5">
        {DURATIONS.map((duration) => {
          const label = duration === 0 ? 'One Time' : `${duration} Years`
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
                {label}
              </span>
              {duration > 0 && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                    selected ? 'bg-brand text-white' : 'bg-slate-100 text-slate2-secondary'
                  }`}
                >
                  Till {currentYear + duration}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   3.3 Filter 3 — Plan type
   ──────────────────────────────────────────── */
const PLAN_TYPES: PlanType[] = ['Market linked', '100% Guaranteed returns']
const MARKET_SUBS: MarketSub[] = ['All Plans', 'With Capital Guarantee', 'Market Linked', 'With High Life Cover']
const GUARANTEED_SUBS: GuaranteedSub[] = ['With Return of Premium', 'Without Return of Premium']

function PlanTypeSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: GuaranteedFilters
  onApply: (payload: Partial<GuaranteedFilters>) => void
  onClose: () => void
}) {
  const [planType, setPlanType] = useState<PlanType>(filters.planType)
  const [marketSub, setMarketSub] = useState<MarketSub>(filters.marketSub)
  const [guaranteedSub, setGuaranteedSub] = useState<GuaranteedSub>(filters.guaranteedSub)

  const selectType = (type: PlanType) => {
    setPlanType(type)
    // Reset the newly-activated group to its default on switch
    if (type === 'Market linked') setMarketSub('All Plans')
    else setGuaranteedSub('With Return of Premium')
  }

  const handleApply = () => {
    if (planType === 'Market linked') {
      onApply({ planType, marketSub })
    } else {
      onApply({ planType, guaranteedSub })
    }
  }

  return (
    <FilterSheet title="Select plan type" onClose={onClose} onApply={handleApply}>
      <div className="space-y-2.5">
        {PLAN_TYPES.map((type) => {
          const selected = planType === type
          return (
            <button
              key={type}
              onClick={() => selectType(type)}
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
            </button>
          )
        })}
      </div>

      {/* Market linked sub-group — enabled only when its radio is active */}
      <div className={planType === 'Market linked' ? 'mt-5' : 'pointer-events-none mt-5 opacity-35'}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate2-muted">Market linked options</p>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_SUBS.map((sub) => {
            const selected = planType === 'Market linked' && marketSub === sub
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setMarketSub(sub)}
                className={`rounded-lg px-3 py-2.5 text-[12px] font-bold transition-colors ${
                  selected ? 'bg-brand text-white shadow-sm' : 'bg-blueBG text-slate2-secondary'
                }`}
              >
                {sub}
              </button>
            )
          })}
        </div>
      </div>

      {/* 100% Guaranteed sub-group — enabled only when its radio is active */}
      <div className={planType === '100% Guaranteed returns' ? 'mt-4' : 'pointer-events-none mt-4 opacity-35'}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate2-muted">Guaranteed options</p>
        <div className="grid grid-cols-2 gap-2">
          {GUARANTEED_SUBS.map((sub) => {
            const selected = planType === '100% Guaranteed returns' && guaranteedSub === sub
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setGuaranteedSub(sub)}
                className={`rounded-lg px-3 py-2.5 text-[12px] font-bold transition-colors ${
                  selected ? 'bg-brand text-white shadow-sm' : 'bg-blueBG text-slate2-secondary'
                }`}
              >
                {sub}
              </button>
            )
          })}
        </div>
      </div>
    </FilterSheet>
  )
}

/* ────────────────────────────────────────────
   3.4 Filter 4 — Get money as
   ──────────────────────────────────────────── */
const GET_MONEY_OPTIONS: GetMoneyAs[] = ['Lumpsum', 'Income for Short Term', 'Income for Long Term', 'Immediate Income']

function GetMoneyAsSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: GuaranteedFilters
  onApply: (payload: Partial<GuaranteedFilters>) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(filters.getMoneyAs)

  return (
    <FilterSheet title="Get money as" onClose={onClose} onApply={() => onApply({ getMoneyAs: draft })}>
      <div className="space-y-2.5">
        {GET_MONEY_OPTIONS.map((option) => {
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
   Profile modal — "Personalise your experience"
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
      mobile: user.mobile, // read-only, never changes
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
   Talk to Expert — callback modal
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
                <p className="mt-1 text-[12px] text-slate2-secondary">An AV Management expert will call you at <b>{mobile}</b>.</p>
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