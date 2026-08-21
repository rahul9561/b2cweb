import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: 1 | 2
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const step1Completed = currentStep > 1
  const step2Active = currentStep === 2

  return (
    <div className="flex items-start w-full max-w-md mx-auto mb-8">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            step1Completed
              ? 'border-green-cta bg-green-cta text-white'
              : 'border-purple2 bg-purple2 text-white'
          }`}
        >
          {step1Completed ? <Check size={16} strokeWidth={3} /> : <span className="text-[13px] font-bold">1</span>}
        </div>
        <div className="mt-2 text-center">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-500 ${
              step1Completed ? 'bg-green-100 text-green-cta' : 'bg-purple-100 text-purple2'
            }`}
          >
            {step1Completed ? 'Completed' : 'In progress'}
          </span>
          <p className="mt-1 text-[12px] font-medium text-navy">STEP 1</p>
          <p className="text-[11px] text-slate-500">Personal details</p>
        </div>
      </div>

      {/* Connecting line */}
      <div className="relative mx-2 mt-4 h-0.5 flex-1 overflow-hidden rounded bg-gray-200">
        <div
          className={`absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out ${
            step1Completed ? 'w-full bg-green-cta' : 'w-1/2 bg-purple2'
          }`}
        />
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            step2Active ? 'border-purple2 bg-purple2 text-white' : 'border-gray-300 bg-white text-gray-400'
          }`}
        >
          <span className="text-[13px] font-bold">2</span>
        </div>
        <div className="mt-2 text-center">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-500 ${
              step2Active ? 'bg-purple-100 text-purple2' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step2Active ? 'In Process' : 'Pending'}
          </span>
          <p className={`mt-1 text-[12px] font-medium ${step2Active ? 'text-navy' : 'text-gray-400'}`}>STEP 2</p>
          <p className={`text-[11px] ${step2Active ? 'text-slate-500' : 'text-gray-400'}`}>Property address</p>
        </div>
      </div>
    </div>
  )
}
