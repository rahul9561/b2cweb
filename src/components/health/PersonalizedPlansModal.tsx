import { useState } from 'react'
import { Check, User } from 'lucide-react'
import HealthInsuranceModal from './HealthInsuranceModal'
import { useHealthProfile } from '../../context/HealthProfileContext'

interface PersonalizedPlansModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onContinue: () => void
}

export default function PersonalizedPlansModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: PersonalizedPlansModalProps) {
  const { state, dispatch } = useHealthProfile()
  const [name, setName] = useState(state.name)
  const [mobile, setMobile] = useState(state.mobile)

  const canContinue = name.trim().length > 0 && mobile.length >= 10

  const handleContinue = () => {
    if (!canContinue) return
    dispatch({
      type: 'SET_PROFILE',
      payload: { name: name.trim(), mobile },
    })
    onContinue()
  }

  const benefits = [
    '100+ plans found',
    '18 insurers',
    'Plans starting @₹187/month',
    `${state.city || 'Your city'} — 190+ cashless hospitals`,
  ]

  return (
    <HealthInsuranceModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock personalised plans"
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* ── Form ── */}
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <div className="flex overflow-hidden rounded-xl border border-gray-200 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="flex items-center gap-1 border-r border-gray-200 bg-gray-50 px-3 text-sm text-navy">
              <span className="text-base">🇮🇳</span> +91
            </span>
            <input
              type="tel"
              placeholder="Enter mobile number"
              maxLength={10}
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              className="flex-1 px-4 py-3 text-sm text-navy placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* ── Benefit card ── */}
        <div className="hidden w-48 flex-shrink-0 rounded-2xl border border-gray-200 bg-blueBG/50 p-4 sm:block">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <User className="h-5 w-5 text-brand" />
          </div>
          <div className="space-y-2.5">
            {benefits.map((t) => (
              <div key={t} className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-cta"
                  strokeWidth={3}
                />
                <span className="text-[11px] font-medium leading-tight text-navy">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer buttons ── */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gray-50"
        >
          Go back
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all ${
            canContinue
              ? 'bg-orange-tag shadow-md hover:bg-orange-tag/90 active:scale-[0.98]'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Continue
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-400">
        By continuing you agree to receive assistance from AV Management and
        agree to our{' '}
        <a href="#" className="text-brand hover:underline">
          Privacy Policy
        </a>
        ,{' '}
        <a href="#" className="text-brand hover:underline">
          Terms of Use
        </a>
      </p>
    </HealthInsuranceModal>
  )
}
