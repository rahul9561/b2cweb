import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { RetirementPlan } from '../data/retirementPlans'

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
  const maskedName = name.substring(0, 3) + '*'.repeat(Math.max(0, name.length - 3))
  return `${maskedName}@${domain}`
}

function maskMobile(mobile: string): string {
  return '*'.repeat(6) + mobile.slice(-4)
}

interface ReviewBoxProps {
  label: string
  value: string
}

function ReviewBox({ label, value }: ReviewBoxProps) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
      <p className="text-xs text-slate-600 font-semibold mb-1">{label}</p>
      <p className="font-semibold text-slate-900 break-words">{value}</p>
    </div>
  )
}

export default function RetirementPlanReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as RetirementPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined
  const [agreeTerms, setAgreeTerms] = React.useState(true)
  const [agreeProduct, setAgreeProduct] = React.useState(true)
  const [agreeRisk, setAgreeRisk] = React.useState(true)

  if (!plan || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">Review details not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Black Header */}
      <div className="sticky top-0 z-50 bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex-1 text-center">
            <img src="/av-logo.svg" alt="AV Management" className="h-6 mx-auto" />
          </div>
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Expert Help
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-navy">Review below details before proceeding</h2>
              <p className="text-sm italic text-amber-700 mt-2 bg-amber-50 p-3 rounded">
                ⚠️ These details cannot be changed at a later stage
              </p>
            </div>

            {/* Personal Details Section */}
            <section>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                👤 Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReviewBox label="Name" value={details.name} />
                <ReviewBox label="Gender" value={details.gender.charAt(0).toUpperCase() + details.gender.slice(1)} />
                <ReviewBox label="Date of Birth" value={details.dateOfBirth} />
                <ReviewBox label="Mobile Number" value={maskMobile(details.mobile)} />
                <ReviewBox label="Email Address" value={maskEmail(details.email)} />
              </div>
            </section>

            {/* Address Details Section */}
            <section>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                🏠 Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReviewBox label="Pincode" value={details.pincode} />
                <ReviewBox label="City" value={details.city} />
                <ReviewBox label="Residential Status" value={details.nationality} />
              </div>
            </section>

            {/* Plan Details Section */}
            <section>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                📋 Plan Details
              </h3>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <img src={plan.insurerLogo} alt={plan.insurer} className="h-10 w-10 rounded bg-white p-1" />
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">{plan.insurer}</p>
                    <p className="font-bold text-navy">{plan.planName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">7-Year Returns</p>
                    <p className="font-bold text-green-600 text-lg mt-1">{plan.returns7yr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Maturity Payout</p>
                    <p className="font-bold text-navy text-lg mt-1">₹{plan.maturityPayoutYou}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Life Cover</p>
                    <p className="font-bold text-blue-600 text-lg mt-1">₹{plan.lifeCoverLac}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Investment Tenure</p>
                    <p className="font-bold text-navy text-lg mt-1">{plan.investmentCriteria.investmentTenure}+ Years</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Declarations Section */}
            <section>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                ✅ Declarations
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeProduct}
                    onChange={() => setAgreeProduct(!agreeProduct)}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-sm text-slate-700">
                    I have read and understood the product features, benefits, terms and conditions.
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the terms and conditions and privacy policy.
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeRisk}
                    onChange={() => setAgreeRisk(!agreeRisk)}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-sm text-slate-700">
                    I acknowledge and understand the investment risks and market-related fluctuations.
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-navy mb-4">Order Summary</h3>

              {/* Plan Details Box */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-4">
                <img src={plan.insurerLogo} alt={plan.insurer} className="h-8 w-8 rounded bg-white/20 p-1 mb-2" />
                <p className="text-xs opacity-90">{plan.insurer}</p>
                <p className="font-bold text-sm mb-3">{plan.planName}</p>

                <div className="space-y-2 border-t border-white/30 pt-3">
                  <div className="flex justify-between text-xs">
                    <span>Premium:</span>
                    <span className="font-bold">₹{plan.investmentCriteria.minAmount / 1000}K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Plan Type:</span>
                    <span className="font-bold">{plan.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Tenure:</span>
                    <span className="font-bold">{plan.investmentCriteria.investmentTenure} Years</span>
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-2 text-sm border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">7-Yr Returns:</span>
                  <span className="font-bold text-green-600">{plan.returns7yr}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Maturity Payout:</span>
                  <span className="font-bold text-navy">₹{plan.maturityPayoutYou}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Life Cover:</span>
                  <span className="font-bold text-blue-600">₹{plan.lifeCoverLac}L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 font-bold text-slate-700 hover:text-slate-900"
          >
            Edit Details
          </button>
          <button
            onClick={() => navigate('/retirement-plans/payment', { state: { plan, details } })}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Checkout
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
