import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Leaf, ShieldCheck, X } from 'lucide-react'
import { useEmployeeCover } from '../context/EmployeeCoverContext'

const EXIT_SURVEY_OPTIONS = [
  'I will come back later to check the plans',
  'I am facing technical issues with the website',
  'My reason is not listed here',
  "I didn't find suitable plans",
  "I don't want to buy group health insurance",
]

const POPULAR_CITIES = ['Delhi', 'Gurgaon', 'Mumbai', 'Pune', 'Bengaluru', 'Ahmedabad']

/* ── Floating label input ── */
function FloatingInput({ value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="relative rounded-lg border border-slate2-border bg-white transition-colors focus-within:border-brand">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? '' : placeholder}
        className="w-full rounded-lg px-3.5 pb-2.5 pt-5 text-[13px] font-semibold text-navy outline-none"
      />
      <span
        className={`pointer-events-none absolute left-3.5 transition-all ${
          active
            ? 'top-1.5 text-[10px] font-medium text-slate2-muted'
            : 'top-1/2 -translate-y-1/2 text-[13px] text-slate2-muted'
        }`}
      >
        {placeholder}
      </span>
    </div>
  )
}

/* ── Modal shell ── */
function ModalShell({ children, onClose, maxWidth = 'max-w-lg' }) {
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
        className={`relative w-full ${maxWidth} rounded-2xl bg-white`}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ── Modal 1: Tell us about your policy ── */
function PolicyModal({ onBack, onContinue }) {
  const { state, dispatch } = useEmployeeCover()
  const [errors, setErrors] = useState({})

  const handleContinue = () => {
    const nextErrors = {}
    if (!state.companyName.trim()) nextErrors.companyName = 'Please enter your company name'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onContinue()
  }

  return (
    <ModalShell onClose={onBack}>
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border text-[22px] leading-none text-navy transition-colors hover:border-brand hover:text-brand"
          >
            ‹
          </button>
          <h2 className="text-[18px] font-bold text-navy">Tell us about your policy</h2>
        </div>

        <p className="mt-5 text-[14px] font-semibold text-navy">
          Buying Group Health Insurance for the first time?
        </p>

        {/* Yes / No cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Yes */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_FIELD', key: 'firstTimeBuyer', value: true })}
            className={`relative rounded-cardlg border-2 p-4 text-left transition-all ${
              state.firstTimeBuyer ? 'border-brand bg-brand/5' : 'border-slate2-border bg-white hover:border-brand/50'
            }`}
          >
            <span
              className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                state.firstTimeBuyer ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
              }`}
            >
              {state.firstTimeBuyer && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-cta/10">
              <Leaf size={20} className="text-green-cta" />
            </span>
            <p className="mt-3 text-[15px] font-bold text-navy">Yes</p>
            <p className="mt-0.5 text-[11px] text-slate2-secondary">Buying for the first time</p>
          </button>

          {/* No */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_FIELD', key: 'firstTimeBuyer', value: false })}
            className={`relative rounded-cardlg border-2 p-4 text-left transition-all ${
              !state.firstTimeBuyer ? 'border-brand bg-brand/5' : 'border-slate2-border bg-white hover:border-brand/50'
            }`}
          >
            <span
              className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                !state.firstTimeBuyer ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
              }`}
            >
              {!state.firstTimeBuyer && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-error/10">
              <ShieldCheck size={20} className="text-orange-error" />
            </span>
            <p className="mt-3 text-[15px] font-bold text-navy">No</p>
            <p className="mt-0.5 text-[11px] text-slate2-secondary">Existing policy is expiring</p>
          </button>
        </div>

        {/* Company Name */}
        <div className="mt-5">
          <FloatingInput
            value={state.companyName}
            onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'companyName', value: v })}
            placeholder="Company Name"
          />
          {errors.companyName && <p className="mt-1 text-[11px] text-orange-error">{errors.companyName}</p>}
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </ModalShell>
  )
}

/* ── Modal 2: Exit-intent survey ── */
function ExitSurveyModal({ onClose }) {
  const { state, dispatch } = useEmployeeCover()
  const [selected, setSelected] = useState(['I will come back later to check the plans'])

  const toggle = (opt) => {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]))
  }

  const handleSubmit = () => {
    dispatch({ type: 'SET_FIELD', key: 'exitSurveyReasons', value: selected })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSubmit} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-teal-50 shadow-2xl"
      >
        {/* Teal header with illustration */}
        <div className="relative bg-teal-600 px-6 pb-6 pt-5">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <X size={16} />
          </button>

          {/* Thinking person illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <span className="absolute -left-6 top-1 text-[18px] font-bold text-white/70">?</span>
              <span className="absolute -right-5 top-3 text-[14px] font-bold text-white/50">?</span>
              <span className="absolute -right-8 top-8 text-[11px] font-bold text-white/40">?</span>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <span className="text-[40px]">🤔</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-center text-[18px] font-bold text-navy">Tell us what went wrong</h2>

          <div className="mt-4 space-y-2">
            {EXIT_SURVEY_OPTIONS.map((opt) => {
              const checked = selected.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    checked ? 'border-brand bg-brand/5' : 'border-slate2-border bg-white hover:border-brand/40'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      checked ? 'border-brand bg-brand text-white' : 'border-slate2-border bg-white'
                    }`}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-[13px] font-medium text-navy">{opt}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 w-full rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Modal 3: Where is your company located? ── */
function LocationModal({ onBack, onViewQuotes }) {
  const { state, dispatch } = useEmployeeCover()
  const [error, setError] = useState('')

  const handleViewQuotes = () => {
    if (!state.city.trim()) {
      setError('Please enter or select your city')
      return
    }
    onViewQuotes()
  }

  return (
    <ModalShell onClose={onBack}>
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border text-[22px] leading-none text-navy transition-colors hover:border-brand hover:text-brand"
          >
            ‹
          </button>
          <h2 className="text-[18px] font-bold text-navy">Where is your company located?</h2>
        </div>

        {/* City input */}
        <div className="mt-5">
          <FloatingInput
            value={state.city}
            onChange={(v) => {
              dispatch({ type: 'SET_FIELD', key: 'city', value: v })
              if (error) setError('')
            }}
            placeholder="City"
          />
          {error && <p className="mt-1 text-[11px] text-orange-error">{error}</p>}
        </div>

        {/* Popular cities */}
        <div className="mt-5 flex items-center gap-3">
          <p className="text-[12px] font-semibold text-navy">Popular cities</p>
          <span className="h-px flex-1 bg-slate2-border" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => {
            const active = state.city === city
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_FIELD', key: 'city', value: city })
                  if (error) setError('')
                }}
                className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors ${
                  active
                    ? 'border-brand bg-brand/5 text-brand'
                    : 'border-slate2-border bg-white text-navy hover:border-brand/50'
                }`}
              >
                {city}
              </button>
            )
          })}
        </div>

        {/* View quotes */}
        <button
          type="button"
          onClick={handleViewQuotes}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          View quotes
          <ArrowRight size={16} />
        </button>
      </div>
    </ModalShell>
  )
}

/* ── Flow controller ── */
export default function EmployeeCoverTransitionFlow({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { state } = useEmployeeCover()
  const [modal, setModal] = useState('policy') // 'policy' | 'location'
  const [showExitSurvey, setShowExitSurvey] = useState(false)

  const handleBackOrClose = () => {
    setShowExitSurvey(true)
  }

  const handleExitSurveyClose = () => {
    setShowExitSurvey(false)
    onClose()
  }

  const handleContinue = () => {
    setModal('location')
  }

  const handleLocationBack = () => {
    setModal('policy')
  }

  const handleViewQuotes = () => {
    onClose()
    navigate('/employee-group-health-insurance/plans', {
      state: {
        name: state.name,
        mobile: state.mobile,
        insureGroup: state.insureGroup,
        totalEmployees: state.totalEmployees,
        requirementType: state.requirementType,
        areaOfOperation: state.areaOfOperation,
        email: state.email,
        firstTimeBuyer: state.firstTimeBuyer,
        companyName: state.companyName,
        city: state.city,
      },
    })
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {!showExitSurvey && modal === 'policy' && (
          <PolicyModal key="policy" onBack={handleBackOrClose} onContinue={handleContinue} />
        )}
        {!showExitSurvey && modal === 'location' && (
          <LocationModal key="location" onBack={handleLocationBack} onViewQuotes={handleViewQuotes} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitSurvey && <ExitSurveyModal key="exit" onClose={handleExitSurveyClose} />}
      </AnimatePresence>
    </>
  )
}