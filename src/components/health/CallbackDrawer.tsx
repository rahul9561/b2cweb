import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Calendar, Clock, CheckCircle2, User, MessageCircle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
]

export default function CallbackDrawer({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: d.toISOString(),
    }
  })

  const handleSubmit = () => {
    setStep(2)
  }

  const handleClose = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setMobile('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer — slides in from the right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-navy">
                  {step === 1 ? 'Schedule a callback' : 'Callback confirmed!'}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {step === 1
                    ? 'Our advisor will call you at your preferred time'
                    : `We'll call you on ${mobile}`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-navy" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* Name & Mobile */}
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-navy placeholder-gray-400 outline-none transition-colors focus:border-brand focus:bg-white"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="Mobile number"
                          maxLength={10}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-navy placeholder-gray-400 outline-none transition-colors focus:border-brand focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Date selection */}
                    <div>
                      <div className="mb-2.5 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand" />
                        <span className="text-sm font-semibold text-navy">Preferred date</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {dates.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => setSelectedDate(d.value)}
                            className={`flex-shrink-0 rounded-xl border px-4 py-2.5 text-center text-[11px] font-medium transition-colors ${
                              selectedDate === d.value
                                ? 'border-brand bg-brand/10 text-brand'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time selection */}
                    <div>
                      <div className="mb-2.5 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand" />
                        <span className="text-sm font-semibold text-navy">Preferred time</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors ${
                              selectedTime === t
                                ? 'border-brand bg-brand/10 text-brand'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedDate || !selectedTime || !mobile}
                      className="w-full rounded-xl bg-orange-tag py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-tag/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Schedule callback
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-cta/10">
                      <CheckCircle2 className="h-8 w-8 text-green-cta" />
                    </div>
                    <h4 className="mb-1 text-lg font-bold text-navy">You're all set!</h4>
                    <p className="mb-6 text-sm text-gray-500">
                      Our health insurance expert will call you on{' '}
                      <span className="font-semibold text-navy">
                        {dates.find((d) => d.value === selectedDate)?.label}
                      </span>{' '}
                      at <span className="font-semibold text-navy">{selectedTime}</span>
                    </p>

                    <div className="mb-6 w-full rounded-xl bg-blueBG/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                          <Phone className="h-5 w-5 text-brand" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-navy">What to expect</p>
                          <p className="text-[10px] text-gray-400">
                            Personalized plan recommendations, best price guarantee
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gray-50"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => {
                          setStep(1)
                          setSelectedDate(null)
                          setSelectedTime(null)
                        }}
                        className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
                      >
                        <MessageCircle className="mr-1.5 inline h-3.5 w-3.5" />
                        Chat now
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
