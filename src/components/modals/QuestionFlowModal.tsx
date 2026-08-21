import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../context/UserProfileContext'
import { questionSteps } from '../../data/options'
import StepDots from '../common/StepDots'
import Button from '../common/Button'

interface QuestionFlowModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QuestionFlowModal({ isOpen, onClose }: QuestionFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const { dispatch } = useUserProfile()
  const navigate = useNavigate()

  const totalSteps = questionSteps.length
  const step = questionSteps[currentStep]
  const remaining = totalSteps - currentStep

  const handleSelect = useCallback(
    (value: any) => {
      setAnswers((prev) => ({ ...prev, [step.key]: value }))

      // Auto-advance after selection (except last step)
      if (currentStep < totalSteps - 1) {
        setTimeout(() => {
          setCurrentStep((s) => s + 1)
        }, 300)
      } else {
        // Last step — save all answers and navigate
        setTimeout(() => {
          const finalAnswers = { ...answers, [step.key]: value }
          dispatch({ type: 'SET_PROFILE', payload: {
            occupation: finalAnswers.occupation || null,
            annualIncome: finalAnswers.annualIncome || null,
            education: finalAnswers.education || null,
            smoker: finalAnswers.smoker || null,
          }})
          onClose()
          navigate('/quotes')
        }, 400)
      }
    },
    [currentStep, totalSteps, step, answers, dispatch, navigate, onClose]
  )

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[700px] rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Header countdown */}
            <div className="px-8 pt-6 pb-2">
              <p className="text-center text-sm text-gray-500 border-b border-dashed border-gray-300 pb-3">
                Just answer <span className="font-bold text-brand">{remaining}</span> simple question{remaining !== 1 ? 's' : ''} to get more accurate quotes
              </p>
            </div>

            {/* Step content */}
            <div className="px-8 py-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Title */}
                  <h2 className="text-xl font-bold text-navy text-center mb-6">
                    {step.title}
                  </h2>

                  {/* Step 1: Occupation cards */}
                  {step.type === 'cards' && (
                    <div className="flex gap-4">
                      {step.options.map((opt: any) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(opt.value)}
                          className={`flex-1 rounded-xl border-2 p-6 text-center font-semibold transition-all duration-200 ${
                            answers[step.key] === opt.value
                              ? 'border-brand bg-brand text-white shadow-md'
                              : 'border-gray-200 bg-white text-navy hover:border-brand/50 hover:bg-brand/5'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Income radio list */}
                  {step.type === 'radio-list' && (
                    <div className="flex flex-col gap-2">
                      {step.options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition-all duration-200 ${
                            answers[step.key] === opt
                              ? 'border-brand bg-brand/5 shadow-sm'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              answers[step.key] === opt
                                ? 'border-brand'
                                : 'border-gray-300'
                            }`}
                          >
                            {answers[step.key] === opt && (
                              <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-navy">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 3: Education boxed radio list */}
                  {step.type === 'boxed-radio-list' && (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {step.options.map((opt: string, i: number) => (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          className={`flex items-center gap-3 w-full px-5 py-4 text-left transition-all duration-200 ${
                            i < step.options.length - 1 ? 'border-b border-gray-200' : ''
                          } ${
                            answers[step.key] === opt
                              ? 'bg-brand/5'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              answers[step.key] === opt
                                ? 'border-brand'
                                : 'border-gray-300'
                            }`}
                          >
                            {answers[step.key] === opt && (
                              <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-navy">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 4: Smoker yes/no */}
                  {step.type === 'yes-no' && (
                    <div>
                      <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 px-5 py-3.5 text-sm text-gray-600">
                        Select <span className="font-bold text-brand">No</span> if you haven&apos;t smoked or chewed tobacco in the last 12 months
                      </div>
                      <div className="flex gap-4">
                        {step.options.map((opt: any) => (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`flex-1 rounded-xl border-2 py-4 text-center font-semibold transition-all duration-200 ${
                              answers[step.key] === opt.value
                                ? 'border-brand bg-brand text-white shadow-md'
                                : 'border-gray-200 bg-white text-navy hover:border-brand/50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
              <div>
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                )}
              </div>

              <StepDots total={totalSteps} current={currentStep} />

              <div>
                {currentStep === 0 && (
                  <Button onClick={handleNext} size="sm">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom advantage banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-navy/90 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
          >
            <span className="text-orange-tag font-bold">The AV Management Advantage</span>
            <span className="mx-2 text-gray-400">|</span>
            <span>{step.banner}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
