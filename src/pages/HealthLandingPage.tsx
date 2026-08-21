import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHealthProfile } from '../context/HealthProfileContext'
import HealthInsuranceHeader from '../components/health/HealthInsuranceHeader'
import HealthHero from '../components/health/HealthHero'
import MemberSelector from '../components/health/MemberSelector'
import HealthTopPlans from '../components/health/HealthTopPlans'
import HealthWhyChoose from '../components/health/HealthWhyChoose'
import HealthTrustFooter from '../components/common/HealthTrustFooter'
import HealthKnowMore from '../components/health/HealthKnowMore'
import HealthDisclaimer from '../components/health/HealthDisclaimer'

export default function HealthLandingPage() {
  const navigate = useNavigate()
  const { dispatch } = useHealthProfile()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [members, setMembers] = useState<string[]>(['Self'])
  const [showMore, setShowMore] = useState(false)

  const toggleMember = (m: string) => {
    setMembers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    )
  }

  const canContinue = members.length > 0

  const handleContinue = () => {
    dispatch({ type: 'SET_PROFILE', payload: { gender, members } })
    navigate('/health-insurance/age')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Health-specific header ── */}
      <HealthInsuranceHeader />

      {/* ── Hero area with brand ambassador + form ── */}
      <HealthHero>
        {/* ── Gender toggle ── */}
        <div className="mb-6 flex justify-center sm:justify-start">
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-gray-50 p-1">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`relative rounded-full px-8 py-2.5 text-sm font-semibold transition-colors ${
                  gender === g ? 'text-white' : 'text-gray-500 hover:text-navy'
                }`}
              >
                {gender === g && (
                  <motion.div
                    layoutId="gender-pill"
                    className="absolute inset-0 rounded-full bg-green-cta"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">{g}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Member selector ── */}
        <MemberSelector
          members={members}
          onToggle={toggleMember}
          showMore={showMore}
          onToggleMore={() => setShowMore(!showMore)}
        />

        {/* ── Continue button ── */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all ${
            canContinue
              ? 'bg-orange-tag shadow-md hover:bg-orange-tag/90 active:scale-[0.98]'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Continue ›
        </button>

        {/* ── Disclaimer link ── */}
        <p className="mt-4 max-w-md text-center text-[11px] text-gray-400 sm:text-left">
          By clicking on "Continue", you agree to our{' '}
          <a href="#" className="text-brand hover:underline">
            Privacy Policy
          </a>
          ,{' '}
          <a href="#" className="text-brand hover:underline">
            Terms of Use
          </a>{' '}
          &{' '}
          <a href="#" className="text-brand hover:underline">
            Disclaimer
          </a>
        </p>
      </HealthHero>

      {/* ── Top Health Insurance Plans ── */}
      <HealthTopPlans />

      {/* ── Why Choose Section ── */}
      <HealthWhyChoose />

      {/* ── Trust / statistics section ── */}
      <HealthTrustFooter />

      {/* ── Know More about Health Insurance ── */}
      <HealthKnowMore />

      {/* ── Disclaimer ── */}
      <HealthDisclaimer />
    </div>
  )
}
