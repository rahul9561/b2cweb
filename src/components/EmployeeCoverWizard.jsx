import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  FileCheck2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Users,
  User,
  Check,
} from 'lucide-react'
import { useEmployeeCover } from '../context/EmployeeCoverContext'
import { stepSlide } from '../lib/motion'
import EmployeeCoverTransitionFlow from './EmployeeCoverTransitionFlow'

const AREA_OPTIONS = ['Senior Management', 'Finance', 'HR', 'Sales', 'Operations', 'IT', 'Other']

/* ── Reusable toggle switch ── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-slate2-border'}`}
    >
      <motion.span
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute left-0.5 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
      />
    </button>
  )
}

/* ── Floating label input ── */
function FloatingLabelInput({ value, onChange, placeholder, type = 'text', error, onBlur }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div>
      <div
        className={`relative rounded-lg border bg-white transition-colors ${
          error ? 'border-orange-error' : focused ? 'border-brand' : 'border-slate2-border'
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur?.()
          }}
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
      {error && <p className="mt-1 text-[11px] text-orange-error">{error}</p>}
    </div>
  )
}

/* ── Floating label select (Area of Operation) ── */
function FloatingLabelSelect({ value, onChange, placeholder, options, error }) {
  const [open, setOpen] = useState(false)
  const active = value.length > 0

  return (
    <div>
      <div
        className={`relative rounded-lg border bg-white transition-colors ${
          error ? 'border-orange-error' : open ? 'border-brand' : 'border-slate2-border'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full rounded-lg px-3.5 pb-2.5 pt-5 text-left outline-none"
        >
          <span
            className={`pointer-events-none absolute left-3.5 transition-all ${
              active
                ? 'top-1.5 text-[10px] font-medium text-slate2-muted'
                : 'top-1/2 -translate-y-1/2 text-[13px] text-slate2-muted'
            }`}
          >
            {placeholder}
          </span>
          {active && <span className="block text-[13px] font-semibold text-navy">{value}</span>}
          <ChevronDown
            size={16}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-slate2-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate2-border bg-white py-1 shadow-card">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`block w-full px-3.5 py-2.5 text-left text-[13px] transition-colors hover:bg-blueBG ${
                  value === opt ? 'font-semibold text-brand' : 'text-navy'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-[11px] text-orange-error">{error}</p>}
    </div>
  )
}

/* ── Step 1 ── */
function Step1({ onNext }) {
  const { state, dispatch } = useEmployeeCover()
  const [errors, setErrors] = useState({})

  const handleNext = () => {
    const nextErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Please enter your name'
    if (!/^\d{10}$/.test(state.mobile)) nextErrors.mobile = 'Please enter a valid 10 digit mobile number'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onNext()
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blueBG px-3 py-1.5 text-[11px] font-semibold text-navy">
          <Users size={14} className="text-brand" />
          Step 1 of 2
        </span>
        <h2 className="mt-3 text-[22px] font-bold leading-snug text-navy">Request employee cover quotes</h2>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-navy">Your name</span>
        <input
          type="text"
          value={state.name}
          onChange={(e) => dispatch({ type: 'SET_FIELD', key: 'name', value: e.target.value })}
          placeholder="Enter your name"
          className={`w-full rounded-lg border px-3.5 py-3 text-[13px] outline-none transition-colors focus:border-brand ${
            errors.name ? 'border-orange-error' : 'border-slate2-border'
          }`}
        />
        {errors.name && <p className="mt-1 text-[11px] text-orange-error">{errors.name}</p>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-navy">Mobile number</span>
        <span
          className={`flex items-center rounded-lg border px-3.5 py-3 transition-colors focus-within:border-brand ${
            errors.mobile ? 'border-orange-error' : 'border-slate2-border'
          }`}
        >
          <span className="mr-3 flex items-center gap-1 border-r border-slate2-border pr-3 text-[12px] text-slate2-secondary">
            +91 <ChevronDown size={13} />
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={state.mobile}
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', key: 'mobile', value: e.target.value.replace(/\D/g, '').slice(0, 10) })
            }
            className="min-w-0 flex-1 text-[13px] outline-none"
            placeholder="10 digit mobile number"
          />
        </span>
        {errors.mobile && <p className="mt-1 text-[11px] text-orange-error">{errors.mobile}</p>}
      </label>

      <button
        type="button"
        onClick={handleNext}
        className="w-full rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
      >
        View Plan Instantly
      </button>

      <p className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-blueBG px-3 py-2 text-[11px] text-navy">
        <ShieldCheck size={14} className="text-brand" />
        An AV Management expert will assist you
      </p>

      <div className="flex items-center justify-center gap-1.5 text-[12px] text-navy">
        <MessageCircle size={14} className="text-brand" />
        Get updates on WhatsApp
        <Toggle
          checked={state.whatsappUpdates}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'whatsappUpdates', value: v })}
        />
      </div>

      <p className="text-center text-[10px] leading-4 text-slate2-muted">
        By continuing, you agree to AV Management's{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          privacy policy and terms
        </a>
        .
      </p>
    </div>
  )
}

/* ── Step 2 ── */
function Step2({ onNext, onBack }) {
  const { state, dispatch } = useEmployeeCover()
  const [errors, setErrors] = useState({})

  const handleNext = () => {
    const nextErrors = {}
    if (!state.totalEmployees || state.totalEmployees <= 0) {
      nextErrors.employees = 'Please enter a valid number of employees'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onNext()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border text-[22px] leading-none text-navy transition-colors hover:border-brand hover:text-brand"
        >
          ‹
        </button>
        <span className="rounded-full bg-blueBG px-3 py-1.5 text-[11px] font-semibold text-navy">Step 2/2</span>
      </div>

      <h2 className="text-[22px] font-bold leading-snug text-navy">Whom do you want to insure?</h2>

      <ul className="grid grid-cols-2 gap-3">
        {/* Employee, Spouse & Kids */}
        <li
          className={`relative cursor-pointer rounded-cardlg border-2 p-4 transition-all ${
            state.insureGroup === 'employeeSpouseKids'
              ? 'border-brand bg-brand/5'
              : 'border-slate2-border bg-white hover:border-brand/50'
          }`}
          onClick={() => dispatch({ type: 'SET_FIELD', key: 'insureGroup', value: 'employeeSpouseKids' })}
        >
          <span
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
              state.insureGroup === 'employeeSpouseKids' ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
            }`}
          >
            {state.insureGroup === 'employeeSpouseKids' && <Check size={12} strokeWidth={3} />}
          </span>
          <div className="flex h-16 items-end justify-center gap-1">
            <span className="flex h-9 w-7 items-end justify-center rounded-t-md bg-brand/20 pb-1">
              <User size={18} className="text-brand" />
            </span>
            <span className="flex h-12 w-7 items-end justify-center rounded-t-md bg-brand/30 pb-1">
              <User size={20} className="text-brand" />
            </span>
            <span className="flex h-8 w-6 items-end justify-center rounded-t-md bg-brand/20 pb-1">
              <User size={15} className="text-brand" />
            </span>
          </div>
          <p className="mt-3 text-center text-[13px] font-semibold leading-snug text-navy">
            Employee,<br />Spouse<br />& Kids
          </p>
        </li>

        {/* Employee only */}
        <li
          className={`relative cursor-pointer rounded-cardlg border-2 p-4 transition-all ${
            state.insureGroup === 'employeeOnly'
              ? 'border-brand bg-brand/5'
              : 'border-slate2-border bg-white hover:border-brand/50'
          }`}
          onClick={() => dispatch({ type: 'SET_FIELD', key: 'insureGroup', value: 'employeeOnly' })}
        >
          <span
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
              state.insureGroup === 'employeeOnly' ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
            }`}
          >
            {state.insureGroup === 'employeeOnly' && <Check size={12} strokeWidth={3} />}
          </span>
          <div className="flex h-16 items-end justify-center">
            <span className="flex h-12 w-9 items-end justify-center rounded-t-md bg-orange-tag/20 pb-1">
              <User size={22} className="text-orange-tag" />
            </span>
          </div>
          <p className="mt-3 text-center text-[13px] font-semibold leading-snug text-navy">
            Employee<br />only
          </p>
        </li>
      </ul>

      <div>
        <input
          type="number"
          min="1"
          inputMode="numeric"
          value={state.totalEmployees ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              key: 'totalEmployees',
              value: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          placeholder="Total number of employees"
          className={`w-full rounded-lg border px-3.5 py-3 text-[13px] outline-none transition-colors focus:border-brand ${
            errors.employees ? 'border-orange-error' : 'border-slate2-border'
          }`}
        />
        {errors.employees && <p className="mt-1 text-[11px] text-orange-error">{errors.employees}</p>}
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
      >
        View Plan Instantly
        <ArrowRight size={16} />
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate2-secondary">
        <Lock size={13} className="text-brand" />
        Your contact details help us show personalized quotes and provide assistance.
      </p>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate2-secondary">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blueBG">
          <FileCheck2 size={14} className="text-brand" />
        </span>
        Only IRDAI certified expert will assist you
      </p>

      <div className="flex items-center justify-center gap-1.5 text-[12px] text-navy">
        <MessageCircle size={14} className="text-brand" />
        Get Quotes on Whatsapp
        <Toggle
          checked={state.whatsappUpdates}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'whatsappUpdates', value: v })}
        />
      </div>

      <p className="text-center text-[10px] leading-4 text-slate2-muted">
        By clicking on "View Plan Instantly", you agree to our{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          Privacy Policy
        </a>
        ,{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          Terms of Use
        </a>{' '}
        &{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          <span className="inline-flex items-center gap-0.5">
            <span className="text-[11px] font-bold">+</span> Disclaimer
          </span>
        </a>
      </p>
    </div>
  )
}

/* ── Step 3 ── */
function Step3({ onBack, onComplete }) {
  const { state, dispatch } = useEmployeeCover()
  const [errors, setErrors] = useState({})

  const handleNext = () => {
    const nextErrors = {}
    if (!state.areaOfOperation) nextErrors.area = 'Please select your area of operation'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) nextErrors.email = 'Please enter a valid email id'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      // Part 2 picks up from here — clicking this opens the next modal
      onComplete?.()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border text-[22px] leading-none text-navy transition-colors hover:border-brand hover:text-brand"
        >
          ‹
        </button>
        <span className="rounded-full bg-blueBG px-3 py-1.5 text-[11px] font-semibold text-navy">Step 3/3</span>
      </div>

      <h2 className="text-[22px] font-bold leading-snug text-navy">Tell us about your requirement</h2>

      <ul className="grid grid-cols-2 gap-3">
        {/* Medical insurance for employees */}
        <li
          className={`relative cursor-pointer rounded-cardlg border-2 p-4 transition-all ${
            state.requirementType === 'medicalForEmployees'
              ? 'border-brand bg-brand/5'
              : 'border-slate2-border bg-white hover:border-brand/50'
          }`}
          onClick={() => dispatch({ type: 'SET_FIELD', key: 'requirementType', value: 'medicalForEmployees' })}
        >
          <span
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
              state.requirementType === 'medicalForEmployees' ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
            }`}
          >
            {state.requirementType === 'medicalForEmployees' && <Check size={12} strokeWidth={3} />}
          </span>
          <div className="flex h-16 items-end justify-center gap-1">
            <span className="flex h-10 w-7 items-end justify-center rounded-t-md bg-brand/20 pb-1">
              <User size={18} className="text-brand" />
            </span>
            <span className="flex h-12 w-7 items-end justify-center rounded-t-md bg-brand/30 pb-1">
              <User size={20} className="text-brand" />
            </span>
            <span className="flex h-9 w-7 items-end justify-center rounded-t-md bg-orange-tag/20 pb-1">
              <User size={18} className="text-orange-tag" />
            </span>
          </div>
          <p className="mt-3 text-center text-[12px] font-semibold leading-snug text-navy">
            I want medical insurance for employees
          </p>
        </li>

        {/* Health insurance for myself */}
        <li
          className={`relative cursor-pointer rounded-cardlg border-2 p-4 transition-all ${
            state.requirementType === 'healthForMyself'
              ? 'border-brand bg-brand/5'
              : 'border-slate2-border bg-white hover:border-brand/50'
          }`}
          onClick={() => dispatch({ type: 'SET_FIELD', key: 'requirementType', value: 'healthForMyself' })}
        >
          <span
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
              state.requirementType === 'healthForMyself' ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
            }`}
          >
            {state.requirementType === 'healthForMyself' && <Check size={12} strokeWidth={3} />}
          </span>
          <div className="flex h-16 items-end justify-center">
            <span className="flex h-12 w-9 items-end justify-center rounded-t-md bg-orange-tag/20 pb-1">
              <User size={24} className="text-orange-tag" />
            </span>
          </div>
          <p className="mt-3 text-center text-[12px] font-semibold leading-snug text-navy">
            I want health insurance for myself
          </p>
        </li>
      </ul>

      <AnimatePresence>
        {state.requirementType === 'medicalForEmployees' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-lg bg-orange-tagBg px-4 py-3 text-[12px] font-medium text-navy"
          >
            <span className="absolute -top-2 left-8 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-orange-tagBg" />
            <span className="mr-1">👉</span>
            Covers medical insurance for all the employees in your company
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingLabelSelect
        value={state.areaOfOperation}
        onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'areaOfOperation', value: v })}
        placeholder="My Area of Operation"
        options={AREA_OPTIONS}
        error={errors.area}
      />

      <FloatingLabelInput
        value={state.email}
        onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'email', value: v })}
        placeholder="Email Id"
        type="email"
        error={errors.email}
      />

      <button
        type="button"
        onClick={handleNext}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
      >
        View Plans Instantly
        <ArrowRight size={16} />
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate2-secondary">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blueBG">
          <FileCheck2 size={14} className="text-brand" />
        </span>
        Only IRDAI certified expert will assist you
      </p>

      <div className="flex items-center justify-center gap-1.5 text-[12px] text-navy">
        <MessageCircle size={14} className="text-brand" />
        Get Quotes on Whatsapp
        <Toggle
          checked={state.whatsappUpdates}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'whatsappUpdates', value: v })}
        />
      </div>

      <p className="text-center text-[10px] leading-4 text-slate2-muted">
        By clicking on "View Plans Instantly", you agree to our{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          Privacy
        </a>
        ,{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          Terms of Use
        </a>{' '}
        &{' '}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
          <span className="inline-flex items-center gap-0.5">
            <span className="text-[11px] font-bold">+</span> Disclaimer
          </span>
        </a>
      </p>
    </div>
  )
}

/* ── Wizard container ── */
export default function EmployeeCoverWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [showTransition, setShowTransition] = useState(false)

  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  return (
    <div className="rounded-cardlg bg-white p-5 sm:p-7">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          variants={stepSlide(direction)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {step === 1 && <Step1 onNext={goNext} />}
          {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <Step3 onBack={goBack} onComplete={() => setShowTransition(true)} />}
        </motion.div>
      </AnimatePresence>

      <EmployeeCoverTransitionFlow
        isOpen={showTransition}
        onClose={() => setShowTransition(false)}
      />
    </div>
  )
}
