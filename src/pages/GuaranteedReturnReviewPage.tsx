import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Headphones } from 'lucide-react'
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

export default function GuaranteedReturnReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as GuaranteedPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined

  if (!plan || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold text-red-600">Invalid state. Redirecting...</p>
      </div>
    )
  }

  const handleCheckout = () => {
    navigate('/guaranteed-return-plans/payment', {
      state: { plan, details },
    })
  }

  const handleEditDetails = () => {
    navigate(-1)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32 text-navy">
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

      {/* Main Content */}
      <section className="mx-auto mt-6 max-w-4xl rounded-xl bg-white shadow-sm border border-slate-200">
        {/* Plan Header */}
        <div className="flex items-center gap-5 border-b border-slate-200 px-8 py-6">
          <img
            src={plan.insurerLogo}
            alt={plan.insurerName}
            className="h-12 w-12 rounded-full object-cover bg-slate-100"
          />
          <div>
            <h3 className="text-sm font-bold text-brand">{plan.insurerName}</h3>
            <h1 className="text-base font-bold text-navy">{plan.planName}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-navy mb-1">Review below details before proceeding</h2>
          <p className="text-sm italic text-amber-700 mb-6">These details cannot be changed at a later stage</p>

          {/* Personal Details Grid */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <ReviewBox label="Name" value={details.name} />
            <ReviewBox label="Date of Birth" value={details.dob} />
            <ReviewBox label="Email" value={details.email} masked />
            <ReviewBox label="Mobile Number" value={details.mobile} />
            <ReviewBox label="Pincode" value={details.pincode} />
            <ReviewBox label="City" value={details.city} />
          </div>

          {/* Plan Details */}
          <div className="overflow-hidden rounded-lg border border-slate-200 mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-navy">Plan Details</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Investment Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <DetailBox label="You Give" value={`₹${plan.youGive} L`} />
                  <DetailBox label="Period" value={`${plan.youGiveYears} Years`} />
                  <DetailBox label="You Get" value={`₹${plan.youGet.toFixed(1)} L`} highlight />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Plan Options</h4>
                <div className="grid grid-cols-2 gap-3">
                  <DetailBox label="Return of Premium" value={details.returnOfPremium ? 'Yes' : 'No'} />
                  <DetailBox label="Premium After" value={details.premiumAfter} />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Benefits</h4>
                <div className="grid grid-cols-2 gap-3">
                  <DetailBox label="Lumpsum at Maturity" value={`₹${plan.maturityLumpsum.toFixed(1)} L`} highlight />
                  <DetailBox
                    label="Monthly Income"
                    value={`₹${plan.incomePerPeriod.toFixed(0)}K for ${plan.incomeYears} years`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Declarations */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-bold text-navy mb-5 flex items-center gap-2">
              Declarations
              <ChevronDown size={18} className="text-slate-400 ml-auto" />
            </h3>
            <div className="space-y-4">
              {[
                `${plan.insurerName} will send you updates on your policy, new products & services, insurance solutions or related information.`,
                'I have read and understood Electronic Benefit Illustration. I/We agree to purchase this product on merits and suitability of the product, based on the information provided by me.',
                'I Agree to the terms and conditions',
              ].map((text, index) => (
                <label key={index} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-5 w-5 accent-brand flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">{text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200 bg-blue-50 shadow-lg backdrop-blur">
        <div className="mx-auto max-w-4xl px-5 py-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div>
              <div className="flex items-baseline gap-2 text-lg font-bold text-navy">
                Total Premium
                <span className="text-2xl">₹ {plan.youGive.toFixed(0)},000</span>
                <span className="text-sm font-medium text-slate-600">{plan.perPeriodType === 'month' ? 'Monthly' : 'Yearly'}</span>
              </div>
            </div>
            <button
              onClick={handleEditDetails}
              className="px-6 py-3 rounded-lg border-2 border-brand text-brand font-bold text-sm hover:bg-brand/5 transition-colors"
            >
              EDIT DETAILS
            </button>
            <button
              onClick={handleCheckout}
              className="px-8 py-3 rounded-lg bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-colors"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function ReviewBox({
  label,
  value,
  masked,
}: {
  label: string
  value: string
  masked?: boolean
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-600 font-medium">{label}</p>
      <p className="mt-2 font-bold text-navy text-sm">{masked ? maskValue(value) : value}</p>
    </div>
  )
}

function DetailBox({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        highlight
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-slate-50 border border-slate-200'
      }`}
    >
      <p className="text-xs text-slate-600 font-medium">{label}</p>
      <p className={`font-bold mt-1 ${highlight ? 'text-blue-600' : 'text-navy'}`}>
        {value}
      </p>
    </div>
  )
}

function maskValue(value: string): string {
  if (value.includes('@')) {
    // Email
    const [name, domain] = value.split('@')
    return `${name.substring(0, 3)}${'*'.repeat(Math.max(0, name.length - 3))}@${domain}`
  }
  if (value.includes('+91')) {
    // Phone
    return `+91 ${value.slice(-3).padStart(10, '*')}`
  }
  // Default
  return value
}
