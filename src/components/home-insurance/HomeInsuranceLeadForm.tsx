import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Info, UserRound, Phone, FileText, PencilLine } from 'lucide-react'
import HomeInsuranceHeader from './Header'

export interface HomeInsuranceLeadFormState {
  fullName: string
  mobile: string
  protectHome: boolean
  protectFamily: boolean
  forBankLoan: boolean
  whatsappUpdates: boolean
}

export default function HomeInsuranceLeadForm() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [protectHome, setProtectHome] = useState(true)
  const [protectFamily, setProtectFamily] = useState(true)
  const [forBankLoan, setForBankLoan] = useState(false)
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)

  const handleViewPrices = () => {
    if (!fullName.trim() || mobile.length !== 10) {
      alert('Please enter your full name and a valid 10-digit mobile number.')
      return
    }

    navigate('/home-insurance/building-value', {
      state: {
        fullName: fullName.trim(),
        mobile,
        protectHome,
        protectFamily,
        forBankLoan,
        whatsappUpdates,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-100">
      <HomeInsuranceHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            Your Home or Home Loan: Get it Secured now!
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-[2.7rem]">
            Compare &amp; Save
            <span className="ml-2 text-green-600">upto 25%</span>
            <sup className="align-super text-[0.7em] text-slate-500">#</sup>
          </h1>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {['Bank Approved', 'Discounted Plans', 'Free Addons'].map((label) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                ✓
              </span>
              <span className="text-sm font-bold text-slate-800">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8">
          <div className="space-y-5">
            <div className="relative">
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=" "
                className="peer w-full rounded-xl border border-slate-300 bg-white px-4 pb-3 pt-6 text-base text-slate-800 placeholder:text-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <label
                htmlFor="full-name"
                className="pointer-events-none absolute left-4 top-3 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Full Name
              </label>
              <UserRound size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div>
              <div className="relative">
                <input
                  id="mobile-number"
                  type="text"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder=" "
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-4 pb-3 pt-6 text-base text-slate-800 placeholder:text-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <label
                  htmlFor="mobile-number"
                  className="pointer-events-none absolute left-4 top-3 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Mobile Number
                </label>
                <Phone size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                {mobile.length === 10 && (
                  <button
                    type="button"
                    aria-label="Edit mobile number"
                    className="absolute -bottom-2 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-white shadow-md"
                  >
                    <PencilLine size={14} className="text-blue-600" />
                  </button>
                )}
              </div>
              {mobile.length > 0 && (
                <div className="mt-3 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm">
                  We don't spam
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">
                  What do you need insurance for? (Optional)
                </span>
                <div className="group relative">
                  <Info size={14} className="cursor-help text-blue-600" />
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    Choose the purpose that best matches your needs.
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={protectHome}
                    onChange={(e) => setProtectHome(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">To protect my home &amp; belongings</span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={forBankLoan}
                    onChange={(e) => setForBankLoan(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">For bank requirement (Home loan approval)</span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={protectFamily}
                    onChange={(e) => setProtectFamily(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    To protect my family from home loan burden (Loan repayment cover for death or disability)
                  </span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleViewPrices}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:brightness-105"
            >
              View Prices
            </button>

            <div className="flex items-center justify-center rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText size={16} className="text-slate-600" />
                <span>Only AV Management certified experts will assist you</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MessageCircle size={18} className="text-green-600" />
                <span>Get Updates on WhatsApp</span>
              </div>

              <button
                type="button"
                aria-label="Toggle WhatsApp updates"
                onClick={() => setWhatsappUpdates((current) => !current)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  whatsappUpdates ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    whatsappUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-600 sm:text-sm">
          <p>
            By clicking on "View Prices", you agree to our{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Terms of Use
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
