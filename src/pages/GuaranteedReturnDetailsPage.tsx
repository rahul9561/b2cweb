import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Headphones, ArrowRight } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import type { GuaranteedPlan } from '../data/guaranteedPlans'

interface PurchaseDetails {
  name: string
  gender: 'male' | 'female'
  dob: string
  mobile: string
  email: string
  returnOfPremium: boolean
  premiumAfter: string
  lumpSumBenefit: string
  pincode: string
  city: string
  residentialStatus: string
}

const INITIAL_DETAILS: PurchaseDetails = {
  name: 'The Developer',
  gender: 'male',
  dob: '',
  mobile: '+91 78*****007',
  email: 'the**********@gmail.com',
  returnOfPremium: true,
  premiumAfter: '42 years',
  lumpSumBenefit: '100% of total invested amount',
  pincode: '',
  city: '',
  residentialStatus: 'Resident Indian',
}

export default function GuaranteedReturnDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as GuaranteedPlan | undefined

  const [step, setStep] = useState(1)
  const [details, setDetails] = useState<PurchaseDetails>(INITIAL_DETAILS)
  const [errors, setErrors] = useState<Partial<PurchaseDetails>>({})

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold text-red-600">No plan selected. Redirecting...</p>
      </div>
    )
  }

  const validateStep1 = () => {
    const newErrors: Partial<PurchaseDetails> = {}
    if (!details.name.trim()) newErrors.name = 'Name is required'
    if (!details.dob) newErrors.dob = 'Date of birth is required'
    if (!details.email.trim()) newErrors.email = 'Email is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Partial<PurchaseDetails> = {}
    if (!details.pincode.trim()) newErrors.pincode = 'Pincode is required'
    if (!details.city.trim()) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (e: FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
        setErrors({})
      }
    } else if (step === 2) {
      if (validateStep2()) {
        navigate('/guaranteed-return-plans/review', {
          state: { plan, details },
        })
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <button className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
            <Headphones size={16} />
            Talk to an Expert
          </button>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto grid max-w-4xl gap-6 px-5 py-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy">Your Details</h1>
            <p className="mt-2 text-sm text-slate-600">Step {step} of 2</p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Name */}
                <FormField
                  label="Your Full Name"
                  error={errors.name}
                  required
                >
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                    placeholder="Enter your full name"
                  />
                </FormField>

                {/* Gender */}
                <FormField label="Gender">
                  <div className="flex gap-4">
                    {(['male', 'female'] as const).map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={details.gender === g}
                          onChange={() => setDetails({ ...details, gender: g })}
                          className="h-4 w-4 accent-brand"
                        />
                        <span className="text-sm font-medium text-slate-700 capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </FormField>

                {/* Date of Birth */}
                <FormField
                  label="Date of Birth"
                  error={errors.dob}
                  required
                >
                  <input
                    type="date"
                    value={details.dob}
                    onChange={(e) => setDetails({ ...details, dob: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                  />
                </FormField>

                {/* Mobile */}
                <FormField label="Mobile Number" readonly>
                  <input
                    type="text"
                    value={details.mobile}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  />
                </FormField>

                {/* Email */}
                <FormField
                  label="Email Address"
                  error={errors.email}
                  required
                >
                  <input
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                    placeholder="your.email@gmail.com"
                  />
                </FormField>

                {/* Return of Purchase Premium */}
                <FormField label="Do you want to Opt for Return of Purchase Premium?">
                  <div className="flex gap-4">
                    {([
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ] as const).map((option) => (
                      <label key={String(option.value)} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="returnOfPremium"
                          checked={details.returnOfPremium === option.value}
                          onChange={() => setDetails({ ...details, returnOfPremium: option.value })}
                          className="h-4 w-4 accent-brand"
                        />
                        <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </FormField>

                {/* Premium receive after */}
                <FormField label="Receive your Premium After">
                  <select
                    value={details.premiumAfter}
                    onChange={(e) => setDetails({ ...details, premiumAfter: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                  >
                    <option value="42 years">42 years</option>
                    <option value="45 years">45 years</option>
                    <option value="50 years">50 years</option>
                    <option value="55 years">55 years</option>
                  </select>
                </FormField>

                {/* Get Lumpsum Benefit */}
                <FormField label="Get Lumpsum Benefit as">
                  <select
                    value={details.lumpSumBenefit}
                    onChange={(e) => setDetails({ ...details, lumpSumBenefit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                  >
                    <option value="100% of total invested amount">100% of total invested amount</option>
                    <option value="75% of total invested amount">75% of total invested amount</option>
                    <option value="50% of total invested amount">50% of total invested amount</option>
                  </select>
                </FormField>
              </>
            ) : (
              <>
                {/* Pincode */}
                <FormField
                  label="Pincode"
                  error={errors.pincode}
                  required
                >
                  <input
                    type="text"
                    value={details.pincode}
                    onChange={(e) => setDetails({ ...details, pincode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                    placeholder="Please enter the pincode of your current residential address"
                    maxLength={6}
                  />
                </FormField>

                {/* City */}
                <FormField
                  label="City"
                  error={errors.city}
                  required
                >
                  <select
                    value={details.city}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                  >
                    <option value="">Please select the city of your current residential address</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </FormField>

                {/* Residential Status */}
                <FormField label="Residential Status">
                  <input
                    type="text"
                    value={details.residentialStatus}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  />
                </FormField>
              </>
            )}

            {/* Next Button */}
            <button
              type="submit"
              className="mt-8 w-full flex items-center justify-center gap-2 rounded-lg bg-brand py-4 text-white font-bold hover:bg-brand-dark transition-colors"
            >
              {step === 2 ? (
                <>
                  Proceed to Review <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Next <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar - Plan Details */}
        <div className="space-y-4">
          {/* Plan Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={plan.insurerLogo}
                alt={plan.insurerName}
                className="h-10 w-10 rounded-full object-cover bg-slate-100"
              />
              <div>
                <h3 className="text-sm font-bold text-navy">{plan.planName}</h3>
                <p className="text-xs text-slate-600">{plan.insurerName}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-3">
              <InfoRow label="You give" value={`₹${plan.youGive} L`} />
              <InfoRow label="For" value={`${plan.youGiveYears} Years`} />
              <InfoRow label="You get" value={`₹${plan.youGet.toFixed(1)} L`} bold />
              <InfoRow label="At age" value={`${plan.maturityAge}`} />
            </div>
          </div>

          {/* Benefits Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold text-navy mb-3">Lumpsum Benefit</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">₹ {plan.maturityLumpsum.toFixed(1)} Lacs</p>

            <h4 className="font-bold text-navy mt-4 mb-2">Income Benefit</h4>
            <p className="text-lg font-bold text-navy">
              ₹ {(plan.incomePerPeriod * 12).toFixed(0)}/year
            </p>
            <p className="text-xs text-slate-600 mt-1">
              ₹ {plan.incomePerPeriod.toFixed(0)}K/{plan.perPeriodType} for {plan.incomeYears} years
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function FormField({
  label,
  error,
  required,
  readonly,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  readonly?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {readonly && <span className="text-slate-500 text-xs ml-2">(Read-only)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-600">{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-navy' : 'font-medium text-slate-700'}`}>
        {value}
      </span>
    </div>
  )
}
