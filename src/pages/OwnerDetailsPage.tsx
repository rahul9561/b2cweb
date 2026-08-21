import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import StepIndicator from '../components/home-insurance/StepIndicator'
import SummarySidebar from '../components/home-insurance/SummarySidebar'
import { defaultHomeOwner } from '../data/homeInsurance'

export default function OwnerDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    plan?: any
    leadData?: any
  } | null

  const plan = state?.plan
  const leadData = state?.leadData

  const [salutation, setSalutation] = useState(defaultHomeOwner.salutation)
  const [fullName, setFullName] = useState(leadData?.fullName || defaultHomeOwner.fullName)
  const [dob, setDob] = useState(defaultHomeOwner.dob)
  const [email, setEmail] = useState(defaultHomeOwner.email)
  const [emailEditable, setEmailEditable] = useState(false)
  const [pan, setPan] = useState(defaultHomeOwner.pan)

  const handleContinue = () => {
    if (!salutation || !fullName || !dob || !email || !pan) {
      alert('Please fill all required fields')
      return
    }

    navigate('/home-insurance/property-address', {
      state: {
        plan,
        leadData,
        ownerDetails: {
          salutation,
          fullName,
          dob,
          mobile: leadData?.mobile || defaultHomeOwner.mobile,
          email,
          pan,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Back link */}
        <button
          onClick={() => navigate('/home-insurance/plan-list', { state: leadData })}
          className="mb-6 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Back to quotes
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Form Column */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <StepIndicator currentStep={1} />

            {/* Heading */}
            <h1 className="mb-6 text-[24px] font-bold text-navy border-b-4 border-yellow-400 pb-3 inline-block">
              Home owner details
            </h1>

            {/* Form */}
            <form className="space-y-5">
              {/* Salutation and Full Name Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Salutation
                  </label>
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Ms</option>
                    <option>Dr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Full name (as per PAN card for KYC)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Date of Birth and Mobile */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Date of birth (as per PAN card for KYC)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Mobile number
                  </label>
                  <input
                    type="text"
                    value={leadData?.mobile || ''}
                    disabled
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] bg-slate-50 text-slate-600 cursor-not-allowed outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Pre-filled and locked</p>
                </div>
              </div>

              {/* Email and PAN */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Email ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!emailEditable}
                      className={`flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand ${
                        !emailEditable ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setEmailEditable(!emailEditable)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit email"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    placeholder="Enter PAN number"
                  />
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-lg bg-brand py-3 text-[14px] font-bold text-white hover:bg-brand-dark transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </form>

            {/* Disclaimer */}
            <Disclaimer />
          </div>

          {/* Right: Summary Sidebar */}
          {plan && <SummarySidebar plan={plan} />}
        </div>
      </main>
    </div>
  )
}

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-[13px] font-bold text-slate-800 hover:bg-slate-50"
      >
        Disclaimer*
        {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-4 text-[12px] text-slate-600 space-y-3">
          <p>
            <strong>AV Management Insurance Brokers Private Limited</strong> | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001
          </p>
          <p>
            <a href="#" className="text-brand hover:underline">Contact Us</a> | <a href="#" className="text-brand hover:underline">Legal and Admin Policies</a>
          </p>
          <p>
            AV Management is an insurance services platform. Visitors are hereby informed that information submitted on the website may be shared with insurers and third-party administrators for service fulfilment.
          </p>
          <p>
            <strong>*Disclaimer:</strong> We, at AV Management, are committed to offering unbiased product comparison and neutral editorial content. Our partnership with various insurers does not impact our editorial content or product comparisons.
          </p>
          <p>
            <strong>KYC:</strong> Know Your Customer norms are mandatory for all insurance transactions to prevent financial fraud.
          </p>
          <p className="italic text-slate-500">
            Sample premium rates (Annual): Single Coverage starting from ₹2,500 | With Add-ons starting from ₹3,500
          </p>
        </div>
      )}
    </div>
  )
}
