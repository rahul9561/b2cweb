import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Headphones } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import { ChildSavingsPlan } from '../data/childSavingsPlans'

interface PurchaseDetails {
  name: string
  gender: 'male' | 'female'
  dateOfBirth: string
  mobile: string
  email: string
  pincode: string
  city: string
  nationality: string
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  const maskedName = name.substring(0, 3) + '*'.repeat(name.length - 3)
  return `${maskedName}@${domain}`
}

function maskMobile(mobile: string): string {
  return '*'.repeat(6) + mobile.slice(-4)
}

function ReviewBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
      <p className="text-xs text-slate-600 font-medium mb-1">{label}</p>
      <p className="font-bold text-navy text-sm">{value}</p>
    </div>
  )
}

export default function ChildSavingsReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as ChildSavingsPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined

  if (!plan || !details) return null

  const handleCheckout = () => {
    navigate('/child-savings-plans/payment', {
      state: { plan, details },
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm">
            <Headphones size={16} />
            Expert Help
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Review Details */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Title */}
              <div className="sticky top-16 z-20 border-b-2 border-blue-200 bg-white px-8 py-6">
                <h2 className="text-2xl font-bold text-navy mb-2">Review below details before proceeding</h2>
                <p className="text-sm text-amber-600 italic">These details cannot be changed at a later stage</p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Personal Details */}
                <section>
                  <h3 className="font-bold text-navy mb-4 text-lg">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewBox label="Name" value={details.name} />
                    <ReviewBox label="Gender" value={details.gender.charAt(0).toUpperCase() + details.gender.slice(1)} />
                    <ReviewBox label="Date of Birth" value={details.dateOfBirth} />
                    <ReviewBox label="Mobile Number" value={maskMobile(details.mobile)} />
                    <ReviewBox label="Email Address" value={maskEmail(details.email)} />
                  </div>
                </section>

                {/* Address Details */}
                <section className="border-t pt-8">
                  <h3 className="font-bold text-navy mb-4 text-lg">Address Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewBox label="Pincode" value={details.pincode} />
                    <ReviewBox label="City" value={details.city} />
                    <ReviewBox label="Nationality" value={details.nationality} className="col-span-2" />
                  </div>
                </section>

                {/* Plan Details */}
                <section className="border-t pt-8">
                  <h3 className="font-bold text-navy mb-4 text-lg">Plan Details</h3>
                  <div className="flex gap-4 mb-4 pb-4 border-b border-slate-200">
                    <img
                      src={plan.insurerLogo}
                      alt={plan.insurer}
                      className="h-12 w-12 object-contain rounded-lg bg-slate-50"
                    />
                    <div>
                      <p className="text-xs text-slate-600">{plan.insurer}</p>
                      <p className="font-bold text-navy">{plan.planName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ReviewBox label="6 Year Returns" value={`${plan.returns6yr}%`} />
                    <ReviewBox label="Fund Name" value={plan.fundName} />
                    <ReviewBox label="Maturity Payout (You)" value={`₹${(plan.maturityPayoutYou / 1000000).toFixed(1)} Cr`} />
                    <ReviewBox label="Maturity Payout (Nominee)" value={`₹${(plan.maturityPayoutNominee / 1000000).toFixed(1)} Cr`} />
                    <ReviewBox label="Life Cover" value={`₹${plan.lifeCoverLac} Lac`} />
                    <ReviewBox label="Investment Tenure" value={`${plan.investmentCriteria.investmentTenure} Years`} />
                  </div>
                </section>

                {/* Declarations */}
                <section className="border-t pt-8">
                  <h3 className="font-bold text-navy mb-4 text-lg">Declarations</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 mt-1 accent-blue-600" />
                      <span className="text-sm text-slate-700">
                        I have read and understood the product details and Electronic Benefit Illustration. I agree to purchase this product on merits and suitability of the product.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 mt-1 accent-blue-600" />
                      <span className="text-sm text-slate-700">
                        I agree to the terms and conditions of the plan and declare that the information provided is true and accurate.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 mt-1 accent-blue-600" />
                      <span className="text-sm text-slate-700">
                        I understand that my investment is subject to market risks and I have understood the risks involved.
                      </span>
                    </label>
                  </div>
                </section>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 border-t-2 border-slate-200 bg-white px-8 py-4 flex gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-navy font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-navy mb-4">Order Summary</h3>
              <div className="space-y-4">
                {/* Plan Info */}
                <div className="flex gap-3 pb-4 border-b border-slate-200">
                  <img
                    src={plan.insurerLogo}
                    alt={plan.insurer}
                    className="h-12 w-12 object-contain rounded-lg bg-slate-50"
                  />
                  <div>
                    <p className="text-xs text-slate-600">{plan.insurer}</p>
                    <p className="font-bold text-navy text-sm">{plan.planName}</p>
                  </div>
                </div>

                {/* Key Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">6 Year Returns</span>
                    <span className="font-bold text-green-600">{plan.returns6yr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maturity Payout</span>
                    <span className="font-bold text-navy">₹{(plan.maturityPayoutYou / 1000000).toFixed(1)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Life Cover</span>
                    <span className="font-bold text-navy">₹{plan.lifeCoverLac} Lac</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Investment Tenure</span>
                    <span className="font-bold text-navy">{plan.investmentCriteria.investmentTenure} Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
