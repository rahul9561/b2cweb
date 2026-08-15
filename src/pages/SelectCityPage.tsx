import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerList } from '../lib/motion'
import { useHealthProfile } from '../context/HealthProfileContext'
import HealthInsuranceHeader from '../components/health/HealthInsuranceHeader'
import HealthProgressBar from '../components/health/HealthProgressBar'
import HealthTrustFooter from '../components/common/HealthTrustFooter'
import PersonalizedPlansModal from '../components/health/PersonalizedPlansModal'
import PlanOptionModal from '../components/health/PlanOptionModal'
import MedicalHistoryModal from '../components/health/MedicalHistoryModal'
import HealthWhyChoose from '../components/health/HealthWhyChoose'
import HealthKnowMore from '../components/health/HealthKnowMore'
import HealthDisclaimer from '../components/health/HealthDisclaimer'
const POPULAR_CITIES = [
  'Lucknow',
  'Gautam Buddha Nagar',
  'Kanpur Nagar',
  'Agra',
  'Allahabad',
  'Meerut',
  'Varanasi',
  'Bareilly',
  'Mathura',
  'Gorakhpur',
  'Delhi',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Mumbai',
  'Thane',
  'Gurgaon',
  'Chennai',
  'Ghaziabad',
  'Ernakulam',
]

type WizardStep = 'personal' | 'planOption' | 'medical'

export default function SelectCityPage() {
  const navigate = useNavigate()
  const { dispatch } = useHealthProfile()
  const [query, setQuery] = useState('Kanpur Nagar')
  const [selected, setSelected] = useState<string | null>('Kanpur Nagar')
  const inputRef = useRef<HTMLInputElement>(null)

  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  )

  const handleSelect = (city: string) => {
    setSelected(city)
    setQuery(city)
  }

  const handleContinue = () => {
    if (!selected) return
    dispatch({ type: 'SET_FIELD', key: 'city', value: selected })
    setWizardStep('personal')
  }

  const closeWizard = () => setWizardStep(null)

  const advanceWizard = () => {
    if (wizardStep === 'personal') setWizardStep('planOption')
    else if (wizardStep === 'planOption') setWizardStep('medical')
    else if (wizardStep === 'medical') finishWizard()
  }

  const backWizard = () => {
    if (wizardStep === 'planOption') setWizardStep('personal')
    else if (wizardStep === 'medical') setWizardStep('planOption')
    else closeWizard()
  }

  const finishWizard = () => {
    closeWizard()
    navigate('/health-insurance/quotes')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ── */}
      <HealthInsuranceHeader />

      {/* ── Progress bar ── */}
      <HealthProgressBar progress={50} />

      {/* ── Main content ── */}
      <div className="relative flex flex-1 items-start justify-center px-4 py-10 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/health-insurance/age')}
          className="fixed left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-navy" />
        </button>

        {/* Center column */}
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center font-serif text-[38px] font-black text-navy">
            Select your city
          </h2>

          {/* Search box */}
          <div className="relative mb-5">
            <label className="absolute -top-2 left-4 bg-white px-1 text-xs font-medium text-navy">
              Search your city
            </label>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelected(null)
              }}
              placeholder="Search your city"
              className="h-14 w-full rounded-lg border border-[#223b63] bg-white px-4 pr-10 text-base text-navy placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Popular cities */}
          <p className="mb-3 text-xs font-semibold text-gray-500">Popular cities</p>
          <motion.div
            variants={staggerList}
            initial="hidden"
            animate="show"
            className="mb-6 flex flex-wrap gap-2"
          >
            {filtered.map((city) => {
              const isActive = selected === city || query === city
              return (
                <motion.button
                  key={city}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(city)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-green-cta bg-green-cta/10 text-green-cta'
                      : 'border-gray-200 bg-white text-navy hover:border-gray-300'
                  }`}
                >
                  {city}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`mt-7 w-full rounded-lg py-4 text-base font-black text-white transition-all ${
              selected
                ? 'bg-[#ff4f34] shadow-[0_10px_24px_rgba(255,79,52,0.28)] hover:bg-[#f3442a] active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Continue ›
          </button>
        </div>

        {/* ── Right panel tip (desktop) ── */}
        <div className="ml-8 hidden w-60 lg:block">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blueBG">
              <MapPin className="h-5 w-5 text-brand" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-navy">Cashless Hospitals</h4>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              This will help us in finding the network of{' '}
              <span className="font-semibold text-navy">Cashless Hospitals</span>{' '}
              in your city
            </p>
          </div>
        </div>
      </div>
       <HealthWhyChoose />
      {/* ── Trust footer ── */}
      <HealthTrustFooter />

      {/* ── Wizard modals ── */}
      <PersonalizedPlansModal
        isOpen={wizardStep === 'personal'}
        onClose={closeWizard}
        onBack={backWizard}
        onContinue={advanceWizard}
      />
      <PlanOptionModal
        isOpen={wizardStep === 'planOption'}
        onClose={closeWizard}
        onBack={backWizard}
        onContinue={advanceWizard}
      />
      <MedicalHistoryModal
        isOpen={wizardStep === 'medical'}
        onClose={closeWizard}
        onBack={backWizard}
        onContinue={advanceWizard}
      />
            {/* ── Why Choose Section ── */}
     
            {/* ── Trust footer ── */}
            {/* <HealthTrustFooter /> */}
                  {/* ── Know More about Health Insurance ── */}
                  <HealthKnowMore />
            
                  {/* ── Disclaimer ── */}
                  <HealthDisclaimer />
    </div>
  )
}
