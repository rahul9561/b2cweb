import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MessageCircle } from 'lucide-react'

export default function HomeInsuranceLandingPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [protectHome, setProtectHome] = useState(true)
  const [protectFamily, setProtectFamily] = useState(true)
  const [forBankLoan, setForBankLoan] = useState(false)
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)

  const handleViewPrices = () => {
    if (!fullName || !mobile) {
      alert('Please fill in Full Name and Mobile Number')
      return
    }

    navigate('/home-insurance/building-value', {
      state: {
        fullName,
        mobile,
        protectHome,
        protectFamily,
        forBankLoan,
        whatsappUpdates,
        fromLanding: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <img src="/av-logo.png" alt="AV Logo" className="h-8 w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold text-navy mb-2">
            Your Home or Home Loan: Get it Secured now!
          </h1>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-[32px] font-bold text-navy">Compare &amp; Save</span>
            <span className="text-[32px] font-bold text-green-600">upto 25%</span>
            <span className="text-[18px] text-slate-600">#</span>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <Check size={20} className="text-blue-600" />
            <span className="text-[14px] font-semibold text-blue-600">Bank Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} className="text-blue-600" />
            <span className="text-[14px] font-semibold text-blue-600">Discounted Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} className="text-blue-600" />
            <span className="text-[14px] font-semibold text-blue-600">Free Addons</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Enter your full name"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                👤
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="XXXXXX9007"
                maxLength={10}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-[11px] text-blue-500 mt-1">We don't spam</p>
          </div>

          {/* What do you need insurance for? */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-slate-700 mb-3 flex items-center gap-1">
              What do you need insurance for?{' '}
              <span className="text-blue-500 cursor-help" title="Select your insurance needs">
                ⓘ
              </span>
              <span className="text-slate-500">(Optional)</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={protectHome}
                  onChange={(e) => setProtectHome(e.target.checked)}
                  className="w-5 h-5 accent-brand rounded"
                />
                <span className="text-[13px] text-slate-700">
                  To protect my home &amp; belongings
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forBankLoan}
                  onChange={(e) => setForBankLoan(e.target.checked)}
                  className="w-5 h-5 accent-brand rounded"
                />
                <span className="text-[13px] text-slate-700">
                  For bank requirement (Home loan approval)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={protectFamily}
                  onChange={(e) => setProtectFamily(e.target.checked)}
                  className="w-5 h-5 accent-brand rounded"
                />
                <div>
                  <span className="text-[13px] text-slate-700 block">
                    To protect my family from home loan burden
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (Loan repayment cover for death or disability)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* View Prices Button */}
          <button
            onClick={handleViewPrices}
            className="w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark transition-colors mb-4"
          >
            View Prices
          </button>

          {/* Info Banner */}
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 mb-4">
            <p className="text-[12px] text-slate-700 flex items-start gap-2">
              <span>📋</span>
              <span>Only AV Management certified experts will assist you</span>
            </p>
          </div>

          {/* WhatsApp Updates */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-green-600" />
              <span className="text-[13px] text-slate-700">Get Updates on WhatsApp</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
            </label>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-[12px] text-slate-600">
          <p>
            By clicking on "View Prices", you agree to our{' '}
            <a href="#" className="text-brand hover:underline font-medium">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="#" className="text-brand hover:underline font-medium">
              Terms of Use
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
