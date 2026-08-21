import { useState } from 'react'
import { Home, Calendar, ThumbsUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import HealthInsuranceModal from './HealthInsuranceModal'
import { useHealthProfile } from '../../context/HealthProfileContext'

interface HomeVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onFinish: () => void
}

const DATES = ['Fri 7 Aug', 'Sat 8 Aug', 'Sun 9 Aug', 'Mon 10 Aug']
const TIME_SLOTS = [
  '10 AM to 12 PM',
  '12 PM to 2 PM',
  '2 PM to 4 PM',
  '4 PM to 6 PM',
  '6 PM to 8 PM',
]

type SubStep = 'choose' | 'schedule'

export default function HomeVisitModal({
  isOpen,
  onClose,
  onBack,
  onFinish,
}: HomeVisitModalProps) {
  const { dispatch } = useHealthProfile()
  const [subStep, setSubStep] = useState<SubStep>('choose')
  const [selectedDate, setSelectedDate] = useState(DATES[0])
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0])

  const handleYes = () => {
    dispatch({ type: 'SET_FIELD', key: 'homeVisit', value: 'yes' as const })
    setSubStep('schedule')
  }

  const handleNo = () => {
    dispatch({ type: 'SET_FIELD', key: 'homeVisit', value: 'no' as const })
    onFinish()
  }

  const handleSchedule = () => {
    dispatch({
      type: 'SET_FIELD',
      key: 'homeVisitSlot',
      value: { date: selectedDate, time: selectedTime },
    })
    onFinish()
  }

  const handleBack = () => {
    if (subStep === 'schedule') {
      setSubStep('choose')
    } else {
      onBack()
    }
  }

  return (
    <HealthInsuranceModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        subStep === 'choose'
          ? 'Do you want to book a free home visit?'
          : 'Select a date & time'
      }
    >
      <AnimatePresence mode="wait">
        {subStep === 'choose' ? (
          <motion.div
            key="choose"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <p className="text-xs text-gray-500">
              Get assistance from our representative at your preferred time and
              location.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* ── Options ── */}
              <div className="flex flex-1 flex-col gap-3">
                <button
                  onClick={handleYes}
                  className="flex items-center gap-4 rounded-xl border-2 border-green-cta bg-green-cta/5 p-5 text-left transition-all hover:bg-green-cta/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-cta/15">
                    <Home className="h-6 w-6 text-green-cta" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Yes, book a visit
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      At your home or office
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleNo}
                  className="flex items-center gap-4 rounded-xl border-2 border-gray-200 p-5 text-left transition-all hover:border-gray-300"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Not now</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      I'll decide later
                    </p>
                  </div>
                </button>
              </div>

              {/* ── Info card ── */}
              <div className="hidden w-44 flex-shrink-0 rounded-2xl border border-gray-200 bg-blueBG/50 p-4 sm:block">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-cta/10">
                  <ThumbsUp className="h-5 w-5 text-green-cta" />
                </div>
                <p className="mt-2 text-xs font-bold text-navy">
                  6 lakh+ successful home visits done
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* ── Date picker ── */}
            <div>
              <p className="mb-3 text-xs font-semibold text-gray-500">
                Select a date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
            </div>

            {/* ── Time slots ── */}
            <div>
              <p className="mb-3 text-xs font-semibold text-gray-500">
                Select a time slot
              </p>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gray-50"
        >
          Go back
        </button>
        {subStep === 'schedule' && (
          <button
            onClick={handleSchedule}
            className="flex-1 rounded-xl bg-orange-tag py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-tag/90 active:scale-[0.98]"
          >
            Confirm & view plans
          </button>
        )}
      </div>
    </HealthInsuranceModal>
  )
}
