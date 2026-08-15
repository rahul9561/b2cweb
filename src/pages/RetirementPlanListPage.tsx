import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Pencil, Phone, User, X } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import { retirementPlans, type RetirementPlan } from '../data/retirementPlans'
import RetirementPlanDrawer from '../components/RetirementPlanDrawer'

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

export default function RetirementPlanListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<UserChip>(DEFAULT_USER)
  const [profileOpen, setProfileOpen] = useState(false)
  const [expertOpen, setExpertOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<RetirementPlan | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters state
  const [selectedReturn, setSelectedReturn] = useState<string>('all')
  const [selectedAge, setSelectedAge] = useState<string>('all')
  const [selectedInsurer, setSelectedInsurer] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('returns')

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
  }, [])

  useEffect(() => {
    const anyOpen = profileOpen || expertOpen || drawerOpen
    document.body.style.overflow = anyOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [profileOpen, expertOpen, drawerOpen])

  // Filter and sort plans
  const filteredPlans = retirementPlans
    .filter((plan) => {
      if (selectedReturn !== 'all' && plan.returns7yr < parseFloat(selectedReturn)) return false
      if (selectedAge !== 'all' && plan.investmentCriteria.minAge > parseFloat(selectedAge)) return false
      if (selectedInsurer !== 'all' && !plan.insurer.toLowerCase().includes(selectedInsurer.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'returns') return b.returns7yr - a.returns7yr
      if (sortBy === 'maturity') return b.maturityPayoutYou - a.maturityPayoutYou
      return 0
    })

  return (
    <div className={`min-h-screen transition-colors ${user.dark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f4f8ff] text-navy'}`}>
      <ScrollProgressBar />
      <ResultsHeader user={user} onOpenProfile={() => setProfileOpen(true)} />

      <ResultsFilterBar
        selectedReturn={selectedReturn}
        selectedAge={selectedAge}
        selectedInsurer={selectedInsurer}
        sortBy={sortBy}
        onReturnChange={setSelectedReturn}
        onAgeChange={setSelectedAge}
        onInsurerChange={setSelectedInsurer}
        onSortChange={setSortBy}
        onTalkExpert={() => setExpertOpen(true)}
        dark={user.dark}
      />

      <main className="container-pb mx-auto grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          <PlanListHeader />

          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <RetirementPlanCard
                key={plan.id}
                plan={plan}
                onViewDetails={() => {
                  setSelectedPlan(plan)
                  setDrawerOpen(true)
                }}
              />
            ))}
          </div>
        </section>

        <aside className="hidden lg:block">
          <RetirementResultsSidebar onOpenChat={() => setExpertOpen(true)} />
        </aside>
      </main>

      <RetirementPlanDrawer plan={selectedPlan} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-white/20">
      <div className="h-full bg-brand transition-[width] duration-75 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

function ResultsHeader({ user, onOpenProfile }: { user: UserChip; onOpenProfile: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-lg">
      <div className="container-pb flex h-[60px] items-center justify-between">
        <button className="flex items-center rounded-lg px-1 py-1">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
        </button>

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
          <ChevronDown size={14} className="text-white/70" />
        </button>
      </div>
    </header>
  )
}

function ResultsFilterBar({
  selectedReturn,
  selectedAge,
  selectedInsurer,
  sortBy,
  onReturnChange,
  onAgeChange,
  onInsurerChange,
  onSortChange,
  onTalkExpert,
  dark,
}: {
  selectedReturn: string
  selectedAge: string
  selectedInsurer: string
  sortBy: string
  onReturnChange: (val: string) => void
  onAgeChange: (val: string) => void
  onInsurerChange: (val: string) => void
  onSortChange: (val: string) => void
  onTalkExpert: () => void
  dark: boolean
}) {
  return (
    <div
      className={`sticky top-[60px] z-30 border-b shadow-sm backdrop-blur transition-colors ${
        dark ? 'border-slate-800 bg-[#111827]' : 'border-slate2-border bg-white'
      }`}
    >
      <div className="container-pb flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
        <FilterChip label="Minimum Return" active={selectedReturn !== 'all'} dark={dark}>
          <span className="text-[15px] font-bold">{selectedReturn === 'all' ? 'All' : `${selectedReturn}%+`}</span>
        </FilterChip>

        <FilterChip label="Age Group" active={selectedAge !== 'all'} dark={dark}>
          <span className="text-[15px] font-bold">{selectedAge === 'all' ? 'All' : `${selectedAge}+ years`}</span>
        </FilterChip>

        <FilterChip label="Insurer" active={selectedInsurer !== 'all'} dark={dark}>
          <span className="text-[15px] font-bold">{selectedInsurer === 'all' ? 'All' : selectedInsurer}</span>
        </FilterChip>

        <FilterChip label="Sort By" active={sortBy !== 'returns'} dark={dark}>
          <span className="text-[15px] font-bold">{sortBy === 'returns' ? 'Returns' : 'Maturity'}</span>
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
  dark,
}: {
  label: string
  children: React.ReactNode
  active: boolean
  dark: boolean
}) {
  const inactive = dark ? 'bg-[#1f2937] text-white shadow-none' : 'bg-white text-navy shadow-card'
  return (
    <button
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

function PlanListHeader() {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-6 w-1 bg-brand rounded-full" />
      <h2 className="text-lg font-bold text-navy">Retirement Plans</h2>
    </div>
  )
}

function RetirementPlanCard({
  plan,
  onViewDetails,
}: {
  plan: RetirementPlan
  onViewDetails: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <img src={plan.insurerLogo} alt={plan.insurer} className="h-12 w-12 rounded-lg object-contain bg-slate-50 p-1 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase">{plan.insurer}</p>
              <h3 className="font-bold text-navy truncate">{plan.planName}</h3>
            </div>
            {plan.badge && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 whitespace-nowrap flex-shrink-0">
                {plan.badge.toUpperCase()}
              </span>
            )}
          </div>

          {/* Tags */}
          {plan.tags && plan.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {plan.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  ✓ {tag}
                </span>
              ))}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-600 font-semibold mb-0.5">7-Year Returns</p>
              <p className="font-bold text-green-600">{plan.returns7yr}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold mb-0.5">Life Cover</p>
              <p className="font-bold text-blue-600">₹{plan.lifeCoverLac}L</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold mb-0.5">Maturity Amount</p>
              <p className="font-bold text-navy">₹{plan.maturityPayoutYou}L</p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col gap-2 sm:ml-4 sm:flex-shrink-0">
          <button
            onClick={onViewDetails}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
          >
            View Details
          </button>
          <button className="rounded-lg border-2 border-slate-200 px-6 py-2 font-semibold text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap text-sm">
            Compare
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function RetirementResultsSidebar({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div className="sticky top-[200px] space-y-4">
      {/* Compare & Invest Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
        <h3 className="font-bold text-navy mb-3">Compare Plans</h3>
        <p className="text-sm text-slate-600 mb-4">Compare up to 3 plans side by side</p>
        <button className="w-full rounded-lg bg-brand text-white py-2.5 font-bold text-sm hover:bg-brand-dark transition-colors">
          Compare
        </button>
      </div>

      {/* Talk to Expert Card */}
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 shadow-sm">
        <h3 className="font-bold text-navy mb-2">Need Help?</h3>
        <p className="text-sm text-slate-600 mb-4">Talk to our retirement planning experts</p>
        <button
          onClick={onOpenChat}
          className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          <Phone size={14} className="inline mr-2" />
          Call Expert
        </button>
      </div>

      {/* Key Facts Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
        <h3 className="font-bold text-navy mb-3">Quick Facts</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-navy">Golden Years:</span> 55+ years
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-navy">Active Plans:</span> 20+
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-navy">Avg Returns:</span> 8-10% p.a.
          </p>
        </div>
      </div>
    </div>
  )
}

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
            className="fixed right-4 top-[64px] z-[90] w-[min(420px,calc(100vw-2rem))] rounded-2xl bg-white p-6 text-navy shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-bold">Personalise your experience</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4">
              <label>
                <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Your name</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] outline-none focus:border-brand"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Your age</span>
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={draft.age}
                  onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] outline-none focus:border-brand"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">City</span>
                <input
                  value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] outline-none focus:border-brand"
                />
              </label>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-[13px] font-semibold text-navy">Dark mode</span>
                <button
                  onClick={() => setDraft({ ...draft, dark: !draft.dark })}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors ${draft.dark ? 'bg-brand' : 'bg-slate-300'}`}
                >
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${draft.dark ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <button
              onClick={update}
              className="mt-5 w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
            >
              UPDATE
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

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
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-navy shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[18px] font-bold">Talk to an Expert</h3>
                <p className="mt-1 text-[12px] text-slate-600">We'll call you back shortly</p>
              </div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                <X size={17} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-cta/10 text-green-cta">
                  <Check size={26} />
                </span>
                <p className="mt-4 text-[15px] font-bold">Request received!</p>
                <p className="mt-1 text-[12px] text-slate-600">
                  An AV Management expert will call you at <b>{mobile}</b>.
                </p>
                <button onClick={onClose} className="mt-5 w-full rounded-lg bg-brand py-3 text-[14px] font-bold text-white hover:bg-brand-dark">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label>
                    <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Your name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] outline-none focus:border-brand"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Mobile number</span>
                    <span className="flex items-center rounded-lg border border-slate-200 px-3.5 focus-within:border-brand">
                      <span className="mr-2 border-r border-slate-200 pr-2.5 text-[12px] font-medium text-slate-600">+91</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        placeholder="10 digit mobile"
                        className="min-w-0 flex-1 py-2.5 text-[14px] outline-none"
                      />
                    </span>
                  </label>
                </div>
                <button
                  onClick={() => canSubmit && setSubmitted(true)}
                  disabled={!canSubmit}
                  className="mt-5 w-full rounded-lg bg-green-cta py-3.5 text-[15px] font-bold text-white hover:bg-green-ctaDark disabled:opacity-50"
                >
                  Request Callback
                </button>
                <p className="mt-3 text-center text-[10px] text-slate-600">By continuing, you agree to AV Management's privacy policy and terms.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
