import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  HeartPulse,
  IndianRupee,
  Linkedin,
  MessageCircle,
  Phone,
  Play,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
  Zap,
} from 'lucide-react'
import EmployeeFlowHeader from '../components/EmployeeFlowHeader'
import EditSearchDrawer from '../components/EditSearchDrawer'
import {
  groupHealthPlans,
  filterAndSortPlans,
  defaultGroupHealthFilters,
  SUM_INSURED_OPTIONS,
  MATERNITY_OPTIONS,
  ROOM_RENT_OPTIONS,
  PRE_EXISTING_OPTIONS,
  SORT_OPTIONS,
} from '../data/groupHealthPlans'

/* ────────────────────────────────────────────
   Shared modal chrome
   ──────────────────────────────────────────── */
function FilterModal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blueBG text-navy transition-colors hover:bg-slate2-border"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}

/* ── Radio row ── */
function RadioRow({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        selected ? 'border-brand bg-brand/5' : 'border-slate2-border bg-white hover:border-brand/40'
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-brand' : 'border-slate2-border'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      <span className="text-[13px] font-medium text-navy">{label}</span>
    </button>
  )
}

/* ────────────────────────────────────────────
   Sort by modal
   ──────────────────────────────────────────── */
function SortModal({ value, onSelect, onClose }) {
  return (
    <FilterModal title="Sort by" onClose={onClose}>
      <div className="space-y-2">
        {SORT_OPTIONS.map((opt) => (
          <RadioRow
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => {
              onSelect(opt)
              onClose()
            }}
          />
        ))}
      </div>
    </FilterModal>
  )
}

/* ────────────────────────────────────────────
   Sum Insured modal
   ──────────────────────────────────────────── */
function SumInsuredModal({ value, onSelect, onClose }) {
  return (
    <FilterModal title="Sum Insured" onClose={onClose}>
      <div className="flex flex-wrap gap-2">
        {SUM_INSURED_OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value)
                onClose()
              }}
              className={`relative rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors ${
                active
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-slate2-border bg-white text-navy hover:border-brand/50'
              }`}
            >
              {opt.label}
              {opt.popular && (
                <span className="absolute -top-2 right-0 rounded-full bg-orange-tag px-1.5 py-0.5 text-[8px] font-bold text-white">
                  Most Popular
                </span>
              )}
            </button>
          )
        })}
      </div>
    </FilterModal>
  )
}

/* ────────────────────────────────────────────
   Maternity Benefits modal
   ──────────────────────────────────────────── */
function MaternityModal({ value, onSelect, onClose }) {
  return (
    <FilterModal title="Maternity Benefits" onClose={onClose}>
      <div className="rounded-lg bg-gradient-to-r from-peach to-orange-tagBg px-4 py-3 text-[12px] leading-5 text-navy">
        <span className="mr-1">😊</span>
        Provides coverage for medical expenses for normal & C-section deliveries or complicated pregnancy during the policy period
      </div>
      <div className="mt-4 space-y-2">
        {MATERNITY_OPTIONS.map((opt) => (
          <RadioRow
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => {
              onSelect(opt)
              onClose()
            }}
          />
        ))}
      </div>
    </FilterModal>
  )
}

/* ────────────────────────────────────────────
   Room Rent Limits modal
   ──────────────────────────────────────────── */
function RoomRentModal({ value, onSelect, onClose }) {
  return (
    <FilterModal title="Room Rent Limits" onClose={onClose}>
      <div className="space-y-2">
        {ROOM_RENT_OPTIONS.map((opt) => (
          <RadioRow
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => {
              onSelect(opt)
              onClose()
            }}
          />
        ))}
      </div>
    </FilterModal>
  )
}

/* ────────────────────────────────────────────
   Cover Pre-Existing Diseases modal
   ──────────────────────────────────────────── */
function PreExistingModal({ value, onSelect, onClose }) {
  return (
    <FilterModal title="Cover Pre-Existing Diseases" onClose={onClose}>
      <div className="rounded-lg bg-gradient-to-r from-purple2/10 to-pink-100 px-4 py-3 text-[12px] leading-5 text-navy">
        <span className="mr-1">🤔</span>
        Covers diseases/ailments 48 months prior to the date of first policy inception one of the standout features of group health insurance, highly recommended!
      </div>
      <div className="mt-4 space-y-2">
        {PRE_EXISTING_OPTIONS.map((opt) => (
          <RadioRow
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => {
              onSelect(opt)
              onClose()
            }}
          />
        ))}
      </div>
    </FilterModal>
  )
}

/* ────────────────────────────────────────────
   Stub modals (Talk to expert / Share quotes / Video / Chat)
   ──────────────────────────────────────────── */
function StubModal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[85] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blueBG text-navy transition-colors hover:bg-slate2-border"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Plan card
   ──────────────────────────────────────────── */
function PlanCard({ plan }) {
  const navigate = useNavigate()
  return (
    <article className="relative rounded-cardlg border border-slate2-border bg-white p-5 shadow-sm">
      {/* Ribbon badges */}
      <div className="absolute -left-1 top-4 space-y-1">
        {plan.ribbons.map((ribbon) => (
          <span
            key={ribbon}
            className={`block rounded-r-md px-2.5 py-1 text-[9px] font-bold text-white shadow-sm ${
              ribbon.includes('★')
                ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                : 'bg-gradient-to-r from-teal-500 to-teal-400'
            }`}
          >
            {ribbon}
          </span>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[110px_1fr_auto] md:items-center">
        {/* Insurer logo */}
        <div className="flex items-center justify-center">
          <img src={plan.logo} alt={plan.insurerName} className="h-14 w-auto object-contain" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate2-muted">Sum insured</p>
            <p className="mt-0.5 text-[16px] font-bold text-navy">{plan.sumInsured}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate2-muted">Cashless Hospitals</p>
            <p className="mt-0.5 text-[16px] font-bold text-navy">
              {plan.cashlessHospitals ? plan.cashlessHospitals.toLocaleString('en-IN') : '-'}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="md:text-right">
          <button
            type="button"
            onClick={
              plan.premiumOnRequest
                ? () => navigate('/employee-group-health-insurance/thanks', { state: { planId: plan.id, insurerName: plan.insurerName } })
                : undefined
            }
            className="rounded-lg bg-brand px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {plan.premiumOnRequest ? 'Premium on Request' : 'View Plan'}
          </button>
        </div>
      </div>
    </article>
  )
}

/* ────────────────────────────────────────────
   Testimonial carousel
   ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    id: 'abhinav',
    name: 'Abhinav',
    role: 'Chief Technology Officer - Pharmeasy',
    quote:
      'Hi Rajeshwari, I am writing to you to express my gratitude for the support your team has provided in setting up our group health insurance. The process was seamless and the team was extremely responsive throughout.',
    bg: 'bg-white',
    source: null,
  },
  {
    id: 'adda247',
    name: 'Adda247',
    role: 'Source : LinkedIn',
    quote:
      'In the middle of deadlines, meetings, and everything else, our team at Adda247 found a reliable partner in AV Management for our employee benefits. The wellness programs have been a huge hit with our staff.',
    bg: 'bg-purple-50',
    source: 'linkedin',
  },
]

function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const maxIndex = Math.max(0, TESTIMONIALS.length - 2)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))

  return (
    <section className="container-pb py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-navy">See what our clients say</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous testimonials"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-navy transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= maxIndex}
            aria-label="Next testimonials"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-navy transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {TESTIMONIALS.slice(index, index + 2).map((t) => (
          <article key={t.id} className={`rounded-cardlg border border-slate2-border p-6 shadow-sm ${t.bg}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-[14px] font-bold text-brand">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-[14px] font-bold text-navy">{t.name}</p>
                <p className="text-[11px] text-slate2-secondary">{t.role}</p>
              </div>
              {t.source === 'linkedin' && (
                <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm">
                  <Linkedin size={16} className="text-brand" />
                </span>
              )}
            </div>
            <p className="mt-4 text-[13px] leading-6 text-slate2-secondary">{t.quote}</p>
            <button className="mt-4 text-[12px] font-semibold text-brand hover:underline">
              See their story ›
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────── */
export default function EmployeeGroupHealthPlansPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state ?? {}

  const employees = state.totalEmployees ?? 0
  const city = state.city || '—'

  const [filters, setFilters] = useState(defaultGroupHealthFilters)
  const [activeModal, setActiveModal] = useState(null) // 'sort' | 'sumInsured' | 'maternity' | 'roomRent' | 'preExisting'
  const [stubModal, setStubModal] = useState(null) // 'expert' | 'share' | 'video' | 'chat'
  const [disclaimersOpen, setDisclaimersOpen] = useState(false)
  const [showScrollControls, setShowScrollControls] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [leadState, setLeadState] = useState({
    totalEmployees: employees,
    city,
    insureGroup: state.insureGroup ?? 'employeeOnly',
  })

  const filteredPlans = useMemo(() => filterAndSortPlans(groupHealthPlans, filters), [filters])

  const topRef = useRef(null)

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const truncate = (text, max) => (text.length > max ? `${text.slice(0, max)}...` : text)

  return (
    <div ref={topRef} className="min-h-screen bg-[#f4f8ff]">
      <EmployeeFlowHeader />

      {/* ── Top bar ── */}
      <div className="container-pb flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-orange-300 font-semibold text-orange-500">
            AV
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span className="font-semibold text-navy">{leadState.totalEmployees} Employees</span>
            <span className="opacity-60">|</span>
            <span className="text-navy">{leadState.city}</span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="ml-3 font-semibold text-brand hover:underline"
          >
            Edit ›
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStubModal('expert')}
            className="flex items-center gap-2 rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
          >
            <Phone size={14} className="text-brand" />
            Talk to expert
          </button>
          <button
            type="button"
            onClick={() => setStubModal('share')}
            className="flex items-center gap-2 rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
          >
            <Share2 size={14} className="text-brand" />
            Share quotes
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-[60px] z-30 border-b border-slate2-border bg-white shadow-sm">
        <div className="container-pb flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate2-border text-navy transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Sort by */}
          <button
            type="button"
            onClick={() => setActiveModal('sort')}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-slate2-border bg-white px-3 py-2 text-[12px] font-semibold text-navy transition-colors hover:border-brand"
          >
            <SlidersHorizontal size={14} className="text-brand" />
            Sort by
            <ChevronDown size={13} className="text-slate2-muted" />
          </button>

          {/* Filter chips */}
          <FilterChip
            label="Sum Insured"
            value={filters.sumInsured}
            onClick={() => setActiveModal('sumInsured')}
          />
          <FilterChip
            label="Maternity Benefits"
            value={truncate(filters.maternityBenefits, 22)}
            onClick={() => setActiveModal('maternity')}
          />
          <FilterChip
            label="Room Rent Limits"
            value={truncate(filters.roomRentLimit, 22)}
            onClick={() => setActiveModal('roomRent')}
          />
          <FilterChip
            label="Cover Pre-Existing Diseases"
            value={truncate(filters.coverPreExisting, 18)}
            onClick={() => setActiveModal('preExisting')}
          />
        </div>
      </div>

      {/* ── Promotional banner ── */}
      <div className="container-pb mt-4">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-cardlg bg-orange-tagBg px-5 py-4">
          <span className="absolute -left-1 top-3 -rotate-45 rounded-r-md bg-red-600 px-3 py-0.5 text-[10px] font-bold text-white shadow-sm">
            New
          </span>
          <p className="ml-8 text-[13px] font-semibold text-navy">
            Cashless claims anywhere for all insurers
          </p>
          <button className="ml-auto text-[12px] font-bold text-brand hover:underline">Know more</button>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="container-pb grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          {/* Private limited banner */}
          <div className="flex items-center gap-2 rounded-lg bg-peach px-4 py-3 text-[12px] font-medium text-navy">
            <span>👉</span>
            For private limited & partnership firms only
          </div>

          {/* Plan list */}
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PlanCard plan={plan} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPlans.length === 0 && (
            <div className="rounded-cardlg border border-slate2-border bg-white p-10 text-center">
              <p className="text-[14px] font-semibold text-navy">No plans match your filters</p>
              <p className="mt-1 text-[12px] text-slate2-secondary">
                Try adjusting your filter selections.
              </p>
            </div>
          )}

          {/* Testimonial carousel */}
          <TestimonialCarousel />
        </section>

        {/* ── Sidebar ── */}
        <aside className="hidden space-y-4 lg:block">
          {/* Claims trust card */}
          <div className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blueBG">
                <ShieldCheck size={18} className="text-brand" />
              </span>
              <h3 className="text-[15px] font-bold text-navy">Experience lightning-fast claim settlements</h3>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-slate2-secondary">
              Over <strong className="text-navy">₹17 Crore</strong> and resolved{' '}
              <strong className="text-navy">2,800+ cases</strong> in just{' '}
              <strong className="text-navy">48 hours!</strong>
            </p>

            {/* Video thumbnail */}
            <button
              type="button"
              onClick={() => setStubModal('video')}
              className="relative mt-4 block w-full overflow-hidden rounded-cardlg bg-gradient-to-br from-navy to-slate-800"
            >
              <div className="flex h-32 items-center justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-red-600 shadow-lg">
                  <Play size={20} className="ml-0.5 text-white" fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white">
                Claims Samadhan Utsav 2.0 Highlights
              </span>
            </button>
          </div>

          {/* Trust stat card */}
          <div className="rounded-cardlg bg-gradient-to-br from-purple-600 to-pink-500 p-5 text-white shadow-sm">
            <span className="text-[24px]">🏢</span>
            <p className="mt-2 text-[15px] font-bold leading-6">
              25K+ businesses trust AV Management for employee benefits
            </p>
          </div>

          {/* Testimonial card */}
          <div className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-[14px] font-bold text-brand">
                A
              </span>
              <div>
                <p className="text-[14px] font-bold text-navy">Abhinav</p>
                <p className="text-[11px] text-slate2-secondary">Chief Technology Officer - Pharmeasy</p>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-slate2-secondary">
              Hi Rajeshwari, I am writing to you to express my gratitude...
            </p>
          </div>

          {/* Trust bullet list */}
          <div className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-sm">
            {[
              {
                icon: IndianRupee,
                title: 'Affordable Pricing',
                desc: 'We provide you with the best prices in the market with excellent services',
              },
              {
                icon: Zap,
                title: '2-minutes Claim Filing',
                desc: 'We offer you best in class self-servicing portal with instant claim filling and claim support',
              },
              {
                icon: Users,
                title: 'Dedicated Relationship Manager',
                desc: 'A full-time relationship manager is assigned for all your group health insurance needs',
              },
              {
                icon: HeartPulse,
                title: 'Customized Wellness Plans',
                desc: 'We offer customizable wellness benefit plans to provide a total protection to your workforce',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.title} className={i > 0 ? 'mt-4 border-t border-slate2-border pt-4' : ''}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-blueBG">
                      <Icon size={15} className="text-brand" />
                    </span>
                    <p className="text-[13px] font-bold text-navy">{item.title}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate2-secondary">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </aside>
      </main>

      {/* ── Disclaimers + Scroll to top ── */}
      <div className="container-pb pb-10">
        <div className="rounded-cardlg border border-slate2-border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setDisclaimersOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-[13px] font-bold text-navy">Disclaimers⁺</span>
            <ChevronDown
              size={16}
              className={`text-slate2-muted transition-transform ${disclaimersOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {disclaimersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 border-t border-slate2-border px-5 py-4 text-[11px] leading-5 text-slate2-secondary">
                  <p>
                    * Sum insured and coverage benefits vary by insurer and selected plan. Please review the
                    policy brochure and terms before purchase.
                  </p>
                  <p>
                    * Quotes displayed are indicative and subject to insurer underwriting, employee
                    demographics, and final policy issuance.
                  </p>
                  <p>
                    * AV Management is an IRDAI-registered insurance web aggregator. We facilitate the
                    purchase and are not the insurer.
                  </p>
                  <p>© 2026 AV Management. All rights reserved.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll controls */}
        {showScrollControls && (
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
            >
              Scroll to top
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowScrollControls(false)}
              aria-label="Hide scroll controls"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate2-border bg-white text-navy transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Edit your search drawer ── */}
      <EditSearchDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={{
          sumInsured: filters.sumInsured,
          insureGroup: leadState.insureGroup,
          totalEmployees: leadState.totalEmployees,
          ageBrackets: [2, 1, 0, 0],
          city: leadState.city,
        }}
        onApply={(pending) => {
          // Apply sum insured to filters
          setFilters((prev) => ({ ...prev, sumInsured: pending.sumInsured }))
          // Apply lead state changes
          setLeadState({
            totalEmployees: pending.totalEmployees,
            city: pending.city,
            insureGroup: pending.insureGroup,
          })
        }}
      />

      {/* ── Floating chat avatar ── */}
      <button
        type="button"
        onClick={() => setStubModal('chat')}
        aria-label="Chat with us"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand shadow-lg transition-transform hover:scale-105"
      >
        <span className="text-[24px]">🧑‍💼</span>
      </button>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeModal === 'sort' && (
          <SortModal
            value={filters.sortBy}
            onSelect={(v) => updateFilter('sortBy', v)}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'sumInsured' && (
          <SumInsuredModal
            value={filters.sumInsured}
            onSelect={(v) => updateFilter('sumInsured', v)}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'maternity' && (
          <MaternityModal
            value={filters.maternityBenefits}
            onSelect={(v) => updateFilter('maternityBenefits', v)}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'roomRent' && (
          <RoomRentModal
            value={filters.roomRentLimit}
            onSelect={(v) => updateFilter('roomRentLimit', v)}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'preExisting' && (
          <PreExistingModal
            value={filters.coverPreExisting}
            onSelect={(v) => updateFilter('coverPreExisting', v)}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stubModal === 'expert' && (
          <StubModal title="Talk to expert" onClose={() => setStubModal(null)}>
            <p className="text-[13px] text-slate2-secondary">
              Our expert will call you shortly. For immediate assistance, call{' '}
              <a href="tel:9917500023" className="font-semibold text-brand">
                9917500023
              </a>
              .
            </p>
          </StubModal>
        )}
        {stubModal === 'share' && (
          <StubModal title="Share quotes" onClose={() => setStubModal(null)}>
            <p className="text-[13px] text-slate2-secondary">
              Share link copied to clipboard! Send it to your team to compare quotes together.
            </p>
          </StubModal>
        )}
        {stubModal === 'video' && (
          <StubModal title="Claims Samadhan Utsav 2.0" onClose={() => setStubModal(null)}>
            <div className="flex aspect-video items-center justify-center rounded-cardlg bg-gradient-to-br from-navy to-slate-800">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-red-600 shadow-lg">
                <Play size={22} className="ml-0.5 text-white" fill="currentColor" />
              </span>
            </div>
            <p className="mt-3 text-center text-[12px] text-slate2-secondary">
              Video player stub — full video will play here.
            </p>
          </StubModal>
        )}
        {stubModal === 'chat' && (
          <StubModal title="Chat with us" onClose={() => setStubModal(null)}>
            <p className="text-[13px] text-slate2-secondary">
              Our team is online. Send us a message and we'll respond within minutes.
            </p>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-[13px] font-bold text-white">
              <MessageCircle size={15} />
              Start chat
            </button>
          </StubModal>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Filter chip ── */
function FilterChip({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-shrink-0 flex-col items-start rounded-lg border border-slate2-border bg-white px-3 py-2 text-left transition-colors hover:border-brand"
    >
      <span className="text-[9px] uppercase tracking-wide text-slate2-muted">{label}</span>
      <span className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-navy">
        {value}
        <ChevronDown size={12} className="text-slate2-muted" />
      </span>
    </button>
  )
}
