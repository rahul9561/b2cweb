import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, Star, Shield, TrendingUp, Lock, CheckCircle, DollarSign, Calendar, Users, Award, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChildSavingsPlan } from '../data/childSavingsPlans'

interface ChildSavingsPlanDrawerProps {
  plan: ChildSavingsPlan | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'benefits' | 'performance' | 'faq'

export default function ChildSavingsPlanDrawer({ plan, isOpen, onClose }: ChildSavingsPlanDrawerProps) {
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
            <div className="sticky top-0 z-20 border-b-2 border-slate-200 bg-gradient-to-r from-pink-50 to-pink-25 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
                <h2 className="text-center font-bold text-navy text-lg flex-1">Child Savings Plan</h2>
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
                      📋 How plan works?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                          1
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm">Policy Starts</p>
                          <p className="text-xs text-slate-600 mt-1">You pay ₹5,000/Month</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                          2
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm">In event of unfortunate demise</p>
                          <p className="text-xs text-slate-600 mt-1">Paid ₹100 K</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                          3
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm">Triple Benefit gets activated</p>
                          <p className="text-xs text-slate-600 mt-1">Your Market Linked Policy continues.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Key Features */}
                  <section className="border-t pt-6">
                    <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                      ✨ Key Features
                    </h3>
                    <div className="space-y-3">
                      {plan.benefits.length > 0 ? (
                        plan.benefits.map((benefit, idx) => (
                          <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-bold text-navy text-sm flex items-center gap-2">
                              <span className="text-lg">{benefit.icon}</span>
                              {benefit.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-2">{benefit.description}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-bold text-navy text-sm">🛡️ Inbuilt Life Cover</p>
                            <p className="text-xs text-slate-600 mt-2">
                              Guaranteed life cover of ₹{plan.lifeCoverLac} lac throughout policy term
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-bold text-navy text-sm">💰 Guaranteed Returns</p>
                            <p className="text-xs text-slate-600 mt-2">
                              100% guaranteed maturity benefit with market-linked upside
                            </p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="font-bold text-navy text-sm">✓ Tax Benefits</p>
                            <p className="text-xs text-slate-600 mt-2">
                              Tax deduction under Section 80C and other provisions
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  {/* Investment Criteria */}
                  <section className="border-t pt-6">
                    <h3 className="text-lg font-bold text-navy mb-4">Investment Criteria</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 font-medium">Age to start investing</p>
                        <p className="font-bold text-navy mt-1">Min: {plan.investmentCriteria.minAge}</p>
                        <p className="font-bold text-navy">Max: {plan.investmentCriteria.maxAge} Years</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 font-medium">Investment Tenure</p>
                        <p className="font-bold text-navy mt-1">{plan.investmentCriteria.investmentTenure} Years</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 col-span-2">
                        <p className="text-xs text-slate-600 font-medium">Minimum amount to invest</p>
                        <p className="font-bold text-navy mt-1">₹{plan.investmentCriteria.minAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Fund Performance Tab */}
              {activeTab === 'performance' && (
                <div className="p-6 space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-navy mb-4">Fund Performance (Annual Returns)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded p-3 border border-blue-200">
                        <p className="text-xs text-slate-600 font-medium">6 Years</p>
                        <p className="font-bold text-blue-600 text-lg mt-1">{plan.fundPerformance.year6}%</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-blue-200">
                        <p className="text-xs text-slate-600 font-medium">7 Years</p>
                        <p className="font-bold text-blue-600 text-lg mt-1">{plan.fundPerformance.year7}%</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-blue-200">
                        <p className="text-xs text-slate-600 font-medium">8 Years</p>
                        <p className="font-bold text-blue-600 text-lg mt-1">{plan.fundPerformance.year8}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                    <h4 className="font-bold mb-4">Current NAV</h4>
                    <p className="text-3xl font-bold">{plan.fundPerformance.currentNav}</p>
                    <p className="text-sm mt-2">As on 31/05/2026</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy mb-3">Rating</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className={i < plan.fundPerformance.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-900">
                    <p className="font-semibold">Disclaimer</p>
                    <p className="mt-2">
                      Past performance does not guarantee future returns. For detailed information, please consult with a financial advisor.
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="p-6 space-y-4">
                  {plan.faqsList.length > 0 ? (
                    plan.faqsList.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <summary className="font-bold text-navy flex items-center justify-between">
                          {faq.question}
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))
                  ) : (
                    <>
                      <details className="group p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300">
                        <summary className="font-bold text-navy flex items-center justify-between">
                          What is a Child Savings Plan?
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          A child savings plan is a market-linked investment plan designed to secure your child's financial future with guaranteed returns and life cover benefits.
                        </p>
                      </details>

                      <details className="group p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300">
                        <summary className="font-bold text-navy flex items-center justify-between">
                          What age can I start investing?
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          You can start investing as early as birth (age 0) for most child savings plans. The maximum age is usually 18 years.
                        </p>
                      </details>

                      <details className="group p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300">
                        <summary className="font-bold text-navy flex items-center justify-between">
                          Are there tax benefits?
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          Yes! Premiums paid towards child savings plans are eligible for tax deduction under Section 80C of the Income Tax Act.
                        </p>
                      </details>

                      <details className="group p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300">
                        <summary className="font-bold text-navy flex items-center justify-between">
                          Can I make partial withdrawals?
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          Yes, you can make partial withdrawals from the fund after a lock-in period for education and other needs of your child.
                        </p>
                      </details>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 border-t-2 border-blue-200 bg-blue-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Maturity Value</p>
                  <p className="text-2xl font-bold text-navy">₹{plan.maturityPayoutNominee.toFixed(1)} Cr</p>
                </div>
                <button 
                  onClick={() => {
                    navigate('/child-savings-plans/details', { state: { plan } })
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Proceed
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
