import { useState } from 'react'
import HealthInsuranceModal from './HealthInsuranceModal'
import { useHealthProfile } from '../../context/HealthProfileContext'

interface PlanOptionModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onContinue: () => void
}

const OPTIONS = [
  { key: 'new' as const, label: 'Buy a new policy' },
  { key: 'port' as const, label: 'Switch my existing policy (Port)' },
]

export default function PlanOptionModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: PlanOptionModalProps) {
  const { dispatch } = useHealthProfile()
  const [selected, setSelected] = useState<'new' | 'port'>('new')

  const handleContinue = () => {
    dispatch({ type: 'SET_FIELD', key: 'policyChoice', value: selected })
    onContinue()
  }

  return (
    <HealthInsuranceModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose an option to see the best plans"
      size="max-w-3xl"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const active = selected === option.key
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelected(option.key)}
              className={`flex min-h-[58px] items-center gap-3 rounded-lg border-2 px-4 text-left text-base transition-all ${
                active
                  ? 'border-green-cta bg-white text-green-cta'
                  : 'border-[#b6c2d2] bg-white text-navy hover:border-green-cta'
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                  active ? 'border-green-cta' : 'border-[#7d8ca4]'
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />}
              </span>
              <span className="font-semibold">{option.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-20 flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-gray-50"
        >
          &lsaquo; Go back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 rounded-lg bg-[#ff4f34] py-4 text-base font-black text-white shadow-[0_10px_24px_rgba(255,79,52,0.28)] transition-all hover:bg-[#f3442a] active:scale-[0.98]"
        >
          Continue &rsaquo;
        </button>
      </div>
    </HealthInsuranceModal>
  )
}
