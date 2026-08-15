import { useState } from 'react'
import { Check } from 'lucide-react'
import HealthInsuranceModal from './HealthInsuranceModal'
import { useHealthProfile } from '../../context/HealthProfileContext'

interface MedicalHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onContinue: () => void
}

const ILLNESS_OPTIONS = [
  'Diabetes',
  'Blood Pressure',
  'Heart disease',
  'Any Surgery',
  'Thyroid',
  'Asthma',
  'Other disease',
  'None of these',
]

export default function MedicalHistoryModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: MedicalHistoryModalProps) {
  const { dispatch } = useHealthProfile()
  const [illness, setIllness] = useState<string[]>([])
  const [whatsapp, setWhatsapp] = useState(true)

  const toggleIllness = (item: string) => {
    if (item === 'None of these') {
      setIllness(['None of these'])
      return
    }
    setIllness((prev) => {
      const next = prev.filter((value) => value !== 'None of these')
      return next.includes(item) ? next.filter((value) => value !== item) : [...next, item]
    })
  }

  const handleContinue = () => {
    dispatch({ type: 'SET_PROFILE', payload: { existingIllness: illness, whatsappUpdates: whatsapp } })
    onContinue()
  }

  return (
    <HealthInsuranceModal isOpen={isOpen} onClose={onClose} title="Medical history" size="max-w-3xl">
      <div>
        <h4 className="text-base font-black text-navy">
          Do any member(s) have any existing illnesses for which they take regular medication?
        </h4>
        <p className="mt-2 text-sm text-slate2-secondary">
          That'll make sure their condition is covered and the claim isn't rejected.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ILLNESS_OPTIONS.map((item) => {
            const active = illness.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleIllness(item)}
                className={`flex min-h-[58px] items-center gap-3 rounded-lg border px-3 text-left text-base transition ${
                  active
                    ? 'border-green-cta bg-green-cta/5 text-green-cta'
                    : 'border-[#b6c2d2] bg-white text-navy hover:border-green-cta'
                }`}
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded border ${
                    active ? 'border-green-cta bg-green-cta text-white' : 'border-[#7d8ca4] bg-white'
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" strokeWidth={4} />}
                </span>
                <span>{item}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="text-xs font-medium text-navy">Get Updates on WhatsApp</span>
          <button
            type="button"
            onClick={() => setWhatsapp((value) => !value)}
            aria-label={`WhatsApp updates ${whatsapp ? 'on' : 'off'}`}
            className={`relative h-5 w-10 rounded-full transition ${whatsapp ? 'bg-green-cta' : 'bg-gray-300'}`}
          >
            <span
              className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
              style={{ transform: `translateX(${whatsapp ? 21 : 3}px)` }}
            />
          </button>
        </div>

        <div className="mt-8 flex items-center gap-6">
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
            className="flex-1 rounded-lg bg-[#ff4f34] py-4 text-base font-black text-white shadow-[0_10px_24px_rgba(255,79,52,0.28)] transition hover:bg-[#f3442a] active:scale-[0.98]"
          >
            View plans &rsaquo;
          </button>
        </div>
      </div>
    </HealthInsuranceModal>
  )
}
