import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { useHealthProfile } from '../context/HealthProfileContext'
import { dropdownMotion } from '../lib/motion'
import HealthInsuranceHeader from '../components/health/HealthInsuranceHeader'
import HealthProgressBar from '../components/health/HealthProgressBar'
import HealthTrustFooter from '../components/common/HealthTrustFooter'
import HealthWhyChoose from '../components/health/HealthWhyChoose'
import HealthKnowMore from '../components/health/HealthKnowMore'
import HealthDisclaimer from '../components/health/HealthDisclaimer'

const AGES = Array.from({ length: 82 }, (_, i) => 18 + i) // 18–99

export default function SelectAgePage() {
  const navigate = useNavigate()
  const { state, dispatch } = useHealthProfile()
  const [age, setAge] = useState<number | null>(state.age)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleContinue = () => {
    if (age == null) return
    dispatch({
      type: 'SET_PROFILE',
      payload: { age, memberAges: { ...state.memberAges, self: age } },
    })
    navigate('/health-insurance/city')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ── */}
      <HealthInsuranceHeader />

      {/* ── Progress bar ── */}
      <HealthProgressBar progress={25} />

      {/* ── Main content ── */}
      <div className="relative flex flex-1 items-start justify-center px-4 py-14 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/health-insurance')}
          className="fixed left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-navy" />
        </button>

        {/* Center column */}
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center font-serif text-[38px] font-black text-navy">
            Select your age
          </h2>

          {/* Age dropdown */}
          <div ref={dropdownRef} className="relative mb-12">
            <label className="absolute -top-2 left-4 z-10 bg-white px-1 text-xs font-medium text-navy">
              Your age
            </label>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-14 w-full items-center justify-between rounded-lg border border-[#223b63] bg-white px-4 text-left text-base transition-colors hover:border-brand focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <span className={age != null ? 'font-medium text-navy' : 'text-gray-400'}>
                {age != null ? `${age} yr` : 'Select your age'}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  variants={dropdownMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.18 }}
                  className="absolute top-full z-30 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  <div className="max-h-[240px] overflow-y-auto av-modal-scroll">
                    {AGES.map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setAge(a)
                          setOpen(false)
                        }}
                        className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                          age === a
                            ? 'bg-brand font-semibold text-white'
                            : 'text-navy hover:bg-gray-50'
                        }`}
                      >
                        {a} yr
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={age == null}
            className={`w-full rounded-lg py-4 text-base font-black text-white transition-all ${
              age != null
                ? 'bg-[#ff4f34] shadow-[0_10px_24px_rgba(255,79,52,0.28)] hover:bg-[#f3442a] active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Continue ›
          </button>
        </div>

        {/* ── Best Price helper card (desktop) ── */}
        <div className="ml-14 hidden w-64 lg:block">
          <div className="relative rounded-[22px] border border-gray-200 bg-white p-5 shadow-[0_10px_28px_rgba(31,45,72,0.08)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0bc] text-center text-[11px] font-black leading-tight text-[#e1006f]">
              BEST<br />PRICE
            </div>
            <h4 className="mt-5 text-lg font-black text-navy">Get best pricing</h4>
            <p className="mt-1 text-base leading-relaxed text-slate2-secondary">
              This will help us in calculating your premium & discounts
            </p>
          </div>
        </div>
      </div>
      {/* ── Why Choose Section ── */}
      <HealthWhyChoose />
      {/* ── Trust footer ── */}
      <HealthTrustFooter />
            {/* ── Know More about Health Insurance ── */}
            <HealthKnowMore />
      
            {/* ── Disclaimer ── */}
            <HealthDisclaimer />
    </div>
  )
}
