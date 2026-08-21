import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ThumbsUp, Calendar, Star } from 'lucide-react'
import { useHealthProfile } from '../../context/HealthProfileContext'
import { fadeScale, slideInRight } from '../../lib/motion'

type WizardStep = '4a' | '4b' | '4c' | '4d' | '4e'

const ILLNESS_OPTIONS = [
  'Diabetes', 'Blood Pressure', 'Heart disease', 'Any Surgery',
  'Thyroid', 'Asthma', 'Other disease', 'None of these',
]

const DATES = ['Fri 7 Aug', 'Sat 8 Aug', 'Sun 9 Aug', 'Mon 10 Aug']
const TIME_SLOTS = ['10 AM to 12 PM', '12 PM to 2 PM', '2 PM to 4 PM', '4 PM to 6 PM', '6 PM to 8 PM']

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function HealthOnboardingWizard({ isOpen, onClose }: Props) {
  const navigate = useNavigate()
  const { state, dispatch } = useHealthProfile()
  const [step, setStep] = useState<WizardStep>('4a')

  // Form state for step 4a
  const [name, setName] = useState(state.name)
  const [mobile, setMobile] = useState(state.mobile)

  // Step 4b
  const [policyChoice, setPolicyChoice] = useState<'new' | 'port'>(state.policyChoice || 'new')

  // Step 4c
  const [illness, setIllness] = useState<string[]>(state.existingIllness)
  const [whatsapp, setWhatsapp] = useState(state.whatsappUpdates)

  // Step 4d
  const [homeVisit, setHomeVisit] = useState<'yes' | 'no' | 'later' | null>(state.homeVisit)

  // Step 4e
  const [selectedDate, setSelectedDate] = useState(DATES[0])
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0])

  const advance = useCallback((next: WizardStep) => {
    setStep(next)
  }, [])

  const goBack = useCallback(() => {
    if (step === '4a') {
      onClose()
    } else {
      const prev: Record<string, WizardStep> = { '4b': '4a', '4c': '4b', '4d': '4c', '4e': '4d' }
      setStep(prev[step])
    }
  }, [step, onClose])

  const finishQuotes = useCallback(() => {
    dispatch({ type: 'SET_PROFILE', payload: { name, mobile, policyChoice, existingIllness: illness, whatsappUpdates: whatsapp } })
    onClose()
    navigate('/health-insurance/quotes')
  }, [dispatch, name, mobile, policyChoice, illness, whatsapp, onClose, navigate])

  const toggleIllness = (item: string) => {
    if (item === 'None of these') {
      setIllness(['None of these'])
      return
    }
    setIllness((prev) => {
      const without = prev.filter((x) => x !== 'None of these')
      return without.includes(item) ? without.filter((x) => x !== item) : [...without, item]
    })
  }

  // ─── Step renderers ───

  const render4a = () => (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-navy">Unlock personalised plans</h3>
      </div>

      <div className="flex gap-4">
        {/* Form */}
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="flex items-center gap-1 border-r border-gray-200 bg-gray-50 px-3 text-sm text-navy">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              placeholder="Enter mobile number"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 px-4 py-3 text-sm text-navy placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Info card */}
        <div className="hidden w-48 flex-shrink-0 rounded-2xl border border-gray-200 bg-blueBG/50 p-4 sm:block">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <span className="text-lg">👤</span>
          </div>
          <div className="space-y-2">
            {[
              '100+ plans found',
              '18 insurers',
              'Plans starting @₹187/month',
              `${state.city || 'Your city'} — 190+ cashless hospitals`,
            ].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-cta" strokeWidth={3} />
                <span className="text-[11px] font-medium text-navy leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WizardFooter
        onBack={goBack}
        onNext={() => advance('4b')}
        nextDisabled={!name.trim() || mobile.length < 10}
      />
      <WizardCaption />
    </div>
  )

  const render4b = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-navy">Choose an option to see the best plans</h3>
      <div className="grid grid-cols-2 gap-4">
        {([
          { key: 'new' as const, label: 'Buy a new policy' },
          { key: 'port' as const, label: 'Switch my existing policy (Port)' },
        ]).map((opt) => {
          const active = policyChoice === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => setPolicyChoice(opt.key)}
              className={`flex items-center gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                active ? 'border-green-cta bg-green-cta/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                active ? 'border-green-cta' : 'border-gray-300'
              }`}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />}
              </span>
              <span className="text-sm font-medium text-navy">{opt.label}</span>
            </button>
          )
        })}
      </div>
      <WizardFooter onBack={goBack} onNext={() => advance('4c')} />
    </div>
  )

  const render4c = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-navy">Medical history</h3>
        <p className="mt-1 text-xs text-gray-500">
          Do any member(s) have any existing illnesses for which they take regular medication?
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400">
          That'll make sure their condition is covered and the claim isn't rejected.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ILLNESS_OPTIONS.map((item) => {
          const active = illness.includes(item)
          return (
            <motion.button
              key={item}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleIllness(item)}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-xs font-medium transition-all ${
                active
                  ? 'border-green-cta bg-green-cta/10 text-green-cta'
                  : 'border-gray-200 text-navy hover:border-gray-300'
              }`}
            >
              <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                active ? 'border-green-cta bg-green-cta text-white' : 'border-gray-300 bg-white'
              }`}>
                {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
              <span>{item}</span>
            </motion.button>
          )
        })}
      </div>

      {/* WhatsApp toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
        <span className="text-sm font-medium text-navy">Get Updates on WhatsApp</span>
        <button
          onClick={() => setWhatsapp(!whatsapp)}
          className={`relative h-6 w-11 rounded-full transition-colors ${whatsapp ? 'bg-green-cta' : 'bg-gray-300'}`}
        >
          <motion.span
            animate={{ x: whatsapp ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-1 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
          />
        </button>
      </div>

      <WizardFooter onBack={goBack} onNext={() => advance('4d')} nextLabel="View plans" />
    </div>
  )

  const render4d = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-navy">Do you want to book a free home visit?</h3>
        <p className="mt-1 text-xs text-gray-500">
          Our certified advisor will help you choose the best health insurance plan for you.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          {(['yes', 'no', 'later'] as const).map((opt) => {
            const active = homeVisit === opt
            const label = opt === 'yes' ? 'Yes' : opt === 'no' ? 'No' : 'I will decide later'
            return (
              <button
                key={opt}
                onClick={() => setHomeVisit(opt)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  active ? 'border-green-cta bg-green-cta/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  active ? 'border-green-cta' : 'border-gray-300'
                }`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />}
                </span>
                <span className="text-sm font-medium text-navy">{label}</span>
              </button>
            )
          })}
        </div>

        <div className="hidden w-44 flex-shrink-0 rounded-2xl border border-gray-200 bg-blueBG/50 p-4 sm:block">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-cta/10">
            <ThumbsUp className="h-5 w-5 text-green-cta" />
          </div>
          <p className="mt-2 text-xs font-bold text-navy">6 lakh+ successful home visits done</p>
        </div>
      </div>

      <WizardFooter
        onBack={goBack}
        onNext={() => {
          if (!homeVisit) return
          dispatch({ type: 'SET_FIELD', key: 'homeVisit', value: homeVisit })
          if (homeVisit === 'yes') {
            advance('4e')
          } else {
            finishQuotes()
          }
        }}
        nextLabel="View plans"
        nextDisabled={!homeVisit}
      />
    </div>
  )

  const render4e = () => (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold leading-snug text-navy">
            Thank you for showing interest<br />in the home visit
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-orange-tag" />
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Date picker */}
        <p className="mb-3 text-xs font-semibold text-gray-500">Select a date</p>
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {DATES.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex flex-shrink-0 flex-col items-center rounded-xl border-2 px-4 py-3 text-xs font-medium transition-all ${
                selectedDate === d
                  ? 'border-green-cta bg-green-cta/5 text-green-cta'
                  : 'border-gray-200 text-navy hover:border-gray-300'
              }`}
            >
              <Calendar className="mb-1 h-4 w-4" />
              {d}
            </button>
          ))}
        </div>

        {/* Time slots */}
        <p className="mb-3 text-xs font-semibold text-gray-500">Select a time slot</p>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`rounded-xl border-2 px-3 py-3 text-xs font-medium transition-all ${
                selectedTime === t
                  ? 'border-green-cta bg-green-cta/5 text-green-cta'
                  : 'border-gray-200 text-navy hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Continue */}
      <div className="border-t border-gray-100 px-6 py-4">
        <button
          onClick={() => {
            dispatch({ type: 'SET_FIELD', key: 'homeVisitSlot', value: { date: selectedDate, time: selectedTime } })
            finishQuotes()
          }}
          className="w-full rounded-xl bg-orange-tag py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-tag/90 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </motion.div>
  )

  // ─── Step content ───
  const stepContent: Record<WizardStep, () => JSX.Element> = {
    '4a': render4a,
    '4b': render4b,
    '4c': render4c,
    '4d': render4d,
    '4e': render4e,
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <AnimatePresence mode="wait">
        {step === '4e' ? (
          render4e()
        ) : (
          <motion.div
            key={step}
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 z-10 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            {stepContent[step]()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Shared sub-components ── */

function WizardFooter({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = 'Continue',
}: {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextLabel?: string
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button onClick={onBack} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gray-50">
        Go back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all ${
          nextDisabled
            ? 'cursor-not-allowed bg-gray-300'
            : 'bg-orange-tag shadow-md hover:bg-orange-tag/90 active:scale-[0.98]'
        }`}
      >
        {nextLabel}
      </button>
    </div>
  )
}

function WizardCaption() {
  return (
    <p className="pt-1 text-center text-[10px] text-gray-400">
      By continuing you agree to receive assistance from AV Management and agree to our{' '}
      <a href="#" className="text-brand hover:underline">Privacy Policy</a>,{' '}
      <a href="#" className="text-brand hover:underline">Terms of Use</a>
    </p>
  )
}
