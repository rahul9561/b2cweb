import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RetirementPlan } from '../data/retirementPlans'

interface RetirementPlanDrawerProps {
  plan: RetirementPlan | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'benefits' | 'performance' | 'faq'

export default function RetirementPlanDrawer({ plan, isOpen, onClose }: RetirementPlanDrawerProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('benefits')

  if (!plan) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-[100] h-full w-full max-w-2xl flex flex-col bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 border-b-2 border-slate-200 bg-gradient-to-r from-orange-50 to-orange-25 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
                <h2 className="text-center font-bold text-navy text-lg flex-1">Retirement Plan</h2>
                <button className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors whitespace-nowrap">
                  📞 Talk to Expert
                </button>
              </div>

              {/* Plan Info */}
              <div className="flex items-center gap-3 px-6 pb-4">
                <img
                  src={plan.insurerLogo}
                  alt={plan.insurer}
                  className="h-10 w-10 rounded-lg object-contain bg-white p-1"
                />
                <div>
                  <p className="text-xs text-slate-600 font-medium">{plan.insurer}</p>
                  <p className="font-bold text-navy">{plan.planName}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-slate-200">
                {(['benefits', 'performance', 'faq'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'benefits' && 'Plan Benefits'}
                    {tab === 'performance' && 'Fund Performance'}
                    {tab === 'faq' && "FAQ's"}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Plan Benefits Tab */}
              {activeTab === 'benefits' && (
                <div className="p-6 space-y-6">
                  {/* How Plan Works */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                      🎯 How plan works?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                        <div>
                          <p className="font-bold text-navy text-sm">Start Investing</p>
                          <p className="text-xs text-slate-600 mt-1">Contribute regularly from age 18-60</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center">2</div>
                        <div>
                          <p className="font-bold text-navy text-sm">Wealth Accumulation</p>
                          <p className="text-xs text-slate-600 mt-1">Your investments grow with guaranteed returns + bonuses</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center">3</div>
                        <div>
                          <p className="font-bold text-navy text-sm">Retirement Income</p>
                          <p className="text-xs text-slate-600 mt-1">Receive guaranteed monthly/annual pension from age 55+</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center">4</div>
                        <div>
                          <p className="font-bold text-navy text-sm">Family Protection</p>
                          <p className="text-xs text-slate-600 mt-1">Life cover ensures your family's financial security</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Key Features */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-3">✨ Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {plan.benefits.map((benefit, i) => (
                        <div key={i} className={`p-4 rounded-lg ${i % 3 === 0 ? 'bg-blue-50 border-l-4 border-blue-600' : i % 3 === 1 ? 'bg-green-50 border-l-4 border-green-600' : 'bg-yellow-50 border-l-4 border-yellow-600'}`}>
                          <p className="text-2xl mb-2">{benefit.icon}</p>
                          <p className="font-bold text-sm text-navy">{benefit.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Investment Criteria */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-3">📋 Investment Criteria</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-100">
                        <p className="text-xs text-slate-600 font-semibold">Age Range</p>
                        <p className="font-bold text-navy mt-1">{plan.investmentCriteria.minAge} - {plan.investmentCriteria.maxAge} yrs</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-100">
                        <p className="text-xs text-slate-600 font-semibold">Investment Tenure</p>
                        <p className="font-bold text-navy mt-1">{plan.investmentCriteria.investmentTenure}+ Years</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-100">
                        <p className="text-xs text-slate-600 font-semibold">Minimum Amount</p>
                        <p className="font-bold text-navy mt-1">₹{(plan.investmentCriteria.minAmount / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-100">
                        <p className="text-xs text-slate-600 font-semibold">7-Yr Returns</p>
                        <p className="font-bold text-green-600 mt-1">{plan.returns7yr}%</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Fund Performance Tab */}
              {activeTab === 'performance' && (
                <div className="p-6 space-y-6">
                  {/* Returns Grid */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-4">📊 Annual Returns (Annualized)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50 text-center">
                        <p className="text-xs text-slate-600 font-semibold">10-Year Returns</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">{plan.fundPerformance.year10}%</p>
                      </div>
                      <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50 text-center">
                        <p className="text-xs text-slate-600 font-semibold">7-Year Returns</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">{plan.fundPerformance.year7}%</p>
                      </div>
                      <div className="p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 text-center">
                        <p className="text-xs text-slate-600 font-semibold">5-Year Returns</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-2">{plan.fundPerformance.year5}%</p>
                      </div>
                      <div className="p-4 rounded-lg border-2 border-teal-300 bg-teal-50 text-center">
                        <p className="text-xs text-slate-600 font-semibold">3-Year Returns</p>
                        <p className="text-2xl font-bold text-teal-600 mt-2">{plan.fundPerformance.year3}%</p>
                      </div>
                    </div>
                  </section>

                  {/* Current NAV */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-3">💰 Current NAV</h3>
                    <div className="p-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
                      <p className="text-sm font-semibold opacity-90">Current Net Asset Value</p>
                      <p className="text-4xl font-bold mt-2">{plan.fundPerformance.currentNav}</p>
                      <p className="text-xs opacity-75 mt-2">As on latest update</p>
                    </div>
                  </section>

                  {/* Star Rating */}
                  <section>
                    <h3 className="text-lg font-bold text-navy mb-3">⭐ Fund Rating</h3>
                    <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
                      <span className="font-semibold text-navy">Overall Rating</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < Math.floor(plan.fundPerformance.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg text-amber-600">{plan.fundPerformance.rating}/5</span>
                    </div>
                  </section>

                  {/* Disclaimer */}
                  <section>
                    <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
                      <p className="text-xs text-slate-700 font-semibold">⚠️ Important Disclaimer</p>
                      <p className="text-xs text-slate-600 mt-2">
                        Past performance is not indicative of future results. All returns shown are annualized and subject to market risks. Please read the offer document carefully before investing.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="p-6 space-y-4">
                  {plan.faqsList.map((faq, idx) => (
                    <details key={idx} className="group cursor-pointer">
                      <summary className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 font-bold text-navy hover:bg-slate-200 transition-colors">
                        <span className="text-sm">{faq.question}</span>
                        <ChevronRight
                          size={18}
                          className="transition-transform group-open:rotate-90"
                        />
                      </summary>
                      <div className="mt-2 px-4 py-3 text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-lg">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 border-t-2 border-slate-200 bg-white p-6 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-slate-600 font-semibold">Maturity at 55 Years</p>
                <p className="text-lg font-bold text-navy">₹{plan.maturityPayoutYou}L</p>
              </div>
              <button
                onClick={() => {
                  navigate('/retirement-plans/details', { state: { plan } })
                  onClose()
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
