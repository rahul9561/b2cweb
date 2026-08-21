import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, MessageCircle, Sparkles, Coins, Clipboard, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GuaranteedPlan } from '../data/guaranteedPlans'

interface UnderstandYourPlanDrawerProps {
  plan: GuaranteedPlan | null
  isOpen: boolean
  onClose: () => void
  onProceed?: (plan: GuaranteedPlan) => void
}

export default function UnderstandYourPlanDrawer({
  plan,
  isOpen,
  onClose,
}: UnderstandYourPlanDrawerProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'benefits' | 'compare'>('benefits')
  const [scrollY, setScrollY] = useState(0)
  const [headerLabel, setHeaderLabel] = useState('Need Help?')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setHeaderLabel(scrollY > 100 ? 'Talk to Expert' : 'Need Help?')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleProceed = () => {
    if (!plan) return
    navigate('/guaranteed-return-plans/details', { state: { plan } })
    onClose()
  }

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
            className="fixed right-0 top-0 z-[100] h-full w-full max-w-2xl flex flex-col bg-white shadow-2xl"
          >
            {/* Header — sticky, salmon/pink background */}
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-gradient-to-b from-pink-50 to-pink-25 shadow-sm">
              {/* Top row: close + title + need help button */}
              <div className="flex items-center justify-between px-5 py-4">
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>

                <h2 className="text-center font-bold text-navy text-lg">Understand Your Plan</h2>

                <button className="flex items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-dark transition-colors whitespace-nowrap">
                  <MessageCircle size={14} />
                  {headerLabel}
                </button>
              </div>

              {/* Insurer logo + plan name */}
              <div className="flex items-center gap-3 px-5 pb-4">
                <img
                  src={plan.insurerLogo}
                  alt={plan.insurerName}
                  className="h-10 w-10 rounded-full object-cover bg-white"
                />
                <div>
                  <p className="font-bold text-navy text-sm">{plan.planName}</p>
                  <p className="text-xs text-slate-500">{plan.insurerName}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-slate-200 bg-white">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`flex-1 px-4 py-3 text-sm font-bold transition-colors relative ${
                    activeTab === 'benefits'
                      ? 'text-brand'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Plan Benefits
                  {activeTab === 'benefits' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 px-4 py-3 text-sm font-bold transition-colors relative ${
                    activeTab === 'compare'
                      ? 'text-brand'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Compare with FD
                  {activeTab === 'compare' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t" />
                  )}
                </button>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-white">
              {activeTab === 'benefits' ? (
                <PlanBenefitsTab plan={plan} />
              ) : (
                <CompareWithFDTab plan={plan} />
              )}
            </div>

            {/* Footer — sticky, blue line + maturity amount + proceed */}
            <div className="sticky bottom-0 border-t-2 border-brand bg-white px-5 py-4 shadow-lg">
              <div className="flex items-center justify-between">
                {/* Maturity amount */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                    Tax free
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-600">Maturity Amount</p>
                    <p className="text-lg font-bold text-blue-600">₹{plan.youGet.toFixed(1)} L</p>
                  </div>
                </div>

                {/* Proceed button */}
                <button
                  onClick={handleProceed}
                  className="px-6 py-2.5 bg-brand text-white font-bold text-sm rounded-lg hover:bg-brand-dark transition-colors"
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

/* ─────────────────────────────────────────
   Tab 1: Plan Benefits
   ───────────────────────────────────────── */
function PlanBenefitsTab({ plan }: { plan: GuaranteedPlan }) {
  return (
    <div className="space-y-6">
      {/* 2.1 Key Features */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-navy">Key Features</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Life Cover Card */}
          <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
            <p className="text-xs font-bold text-blue-900">₹{plan.lifeCover.toFixed(2)} Lac</p>
            <p className="text-xs text-blue-900 font-semibold">Life Cover</p>
            <p className="text-[10px] text-blue-800 mt-2 leading-snug">
              Inbuilt life cover to take care of your family even in your absence.
            </p>
          </div>

          {/* Tax Savings Card */}
          <div className="rounded-lg bg-orange-50 p-3 border border-orange-100">
            <p className="text-xs font-bold text-orange-900">Tax Savings*</p>
            <p className="text-xs text-orange-900 font-semibold">Save Upto</p>
            <p className="text-[10px] text-orange-800 mt-1">₹{plan.taxSavingsMax.toFixed(2)} Lac</p>
            <p className="text-[10px] text-orange-800 mt-2 leading-snug">
              Under Sec 80C and Sec 10(10D)
            </p>
            <p className="text-[9px] text-orange-700 mt-2">
              *Tax benefits subject to change in tax laws.
            </p>
            <button className="text-[10px] text-brand font-bold mt-1 hover:underline">
              View Details
            </button>
          </div>

          {/* Guaranteed Returns Card */}
          <div className="rounded-lg bg-green-50 p-3 border border-green-100">
            <p className="text-xs font-bold text-green-900">Guaranteed Returns</p>
            <p className="text-[10px] text-green-800 mt-2 leading-snug">
              Get 100% guaranteed tax-free returns at the time of maturity.
            </p>
          </div>
        </div>
      </section>

      {/* 2.2 Chat with Financial Expert */}
      <section>
        <div className="mb-4 flex items-center gap-2 pb-3 border-b border-slate-200">
          <Coins size={18} className="text-amber-600" />
          <h3 className="text-sm font-bold text-navy">Chat with Financial Expert</h3>
        </div>

        <div className="flex gap-4 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          {/* Illustration placeholder */}
          <div className="h-20 w-20 shrink-0 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center text-2xl">
            👨‍💻
          </div>

          {/* Text + button */}
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-xs text-slate-700 leading-snug">
              Let us help you to choose the right investment plan for you
            </p>
            <button className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors w-fit">
              <MessageCircle size={12} />
              Chat with an Expert
            </button>
          </div>
        </div>
      </section>

      {/* 2.3 Investment Summary */}
      <section>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-xs text-slate-700 leading-relaxed">
          <span className="inline-block mb-2">🐷 📈</span>
          <p>
            You invest ₹{plan.perPeriodAmount.toFixed(2)}K/{plan.perPeriodType} for {plan.investYears}{' '}
            years. From age {plan.incomeStartAge}, you receive ₹{plan.incomePerPeriod.toFixed(2)}K/month income for next{' '}
            {plan.incomeYears} year{plan.incomeYears !== 1 ? 's' : ''}. Also get a additional lumpsum of ₹{plan.maturityLumpsum.toFixed(2)} L at age{' '}
            {plan.maturityAge}.
          </p>
        </div>
      </section>

      {/* 2.4 Give/Get Timeline Visualization */}
      <section>
        <div className="mb-3 flex gap-2 items-center">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-900 text-xs font-bold rounded-full">
            You Give: ₹{plan.youGive} Lac
          </span>
          <span className="px-3 py-1.5 bg-green-100 text-green-900 text-xs font-bold rounded-full">
            You Get: ₹{plan.youGet.toFixed(1)} Lac
          </span>
        </div>

        <div className="relative ml-4">
          <div className="text-[10px] font-bold text-slate-600 mb-2">Age</div>

          {/* Timeline */}
          <div className="space-y-0">
            {/* Start */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {plan.startAge}
                </div>
                <div className="w-0.5 h-8 bg-blue-600" />
              </div>
              <div className="pb-4">
                <p className="text-xs font-bold text-navy">Policy Starts</p>
                <p className="text-[10px] text-slate-600">You Pay ₹{plan.perPeriodAmount.toFixed(2)}K/{plan.perPeriodType}</p>
              </div>
            </div>

            {/* Growing period */}
            <div className="ml-4 -mt-3 flex gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-500 italic">Your investment continues to grow*</div>
              </div>
            </div>

            {/* Invest end */}
            <div className="flex gap-3 -mt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {plan.payEndAge}
                </div>
                <div className="w-0.5 h-8 bg-slate-300 border-l border-dashed" />
              </div>
              <div className="pb-4">
                <p className="text-xs font-bold text-navy">You Invest</p>
                <p className="text-[10px] text-slate-600">₹{plan.youGive} L in {plan.investYears} Years</p>
              </div>
            </div>

            {/* Waiting period */}
            <div className="ml-4 -mt-3 flex gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] text-slate-500 italic">You wait for {plan.waitYears} more years*</div>
              </div>
            </div>

            {/* Income starts */}
            <div className="flex gap-3 -mt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  {plan.incomeStartAge}
                </div>
                <div className="w-0.5 h-12 bg-green-600" />
              </div>
              <div className="pb-4">
                <p className="text-xs font-bold text-navy">◄ Income Starts</p>
                <p className="text-[10px] text-slate-600">
                  ₹{plan.incomePerPeriod.toFixed(2)}K/month for {plan.incomeYears} years
                </p>
              </div>
            </div>

            {/* Maturity */}
            <div className="flex gap-3 -mt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {plan.maturityAge}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                <p className="text-xs font-bold text-navy">On Maturity</p>
                <p className="text-[10px] text-slate-600">Additional Lump Sum Amount</p>
                <p className="text-xs font-bold text-blue-600">₹{plan.maturityLumpsum.toFixed(1)} L</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Certified Partner */}
      <section>
        <div className="border-2 border-dashed border-yellow-400 rounded-lg p-3 bg-yellow-50">
          <div className="flex gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <p className="text-xs text-slate-700">
              <span className="font-bold">AV Management is Certified Partner for {plan.insurerName}</span>
            </p>
          </div>
          <div className="space-y-1 mb-2">
            <p className="flex items-center gap-2 text-xs text-slate-700">
              <Check size={12} className="text-green-600" /> Hassle free service
            </p>
            <p className="flex items-center gap-2 text-xs text-slate-700">
              <Check size={12} className="text-green-600" /> Excellent claims assistance
            </p>
          </div>
          <button className="text-brand text-xs font-bold hover:underline">
            View Certificate →
          </button>
        </div>
      </section>

      {/* 2.6 Investment Criteria */}
      <section>
        <div className="mb-4 flex items-center gap-2 pb-3 border-b border-slate-200">
          <Clipboard size={18} className="text-slate-600" />
          <h3 className="text-sm font-bold text-navy">Investment Criteria</h3>
        </div>

        <div className="space-y-4">
          {/* Age to start */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Age to start Investing</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                <span className="text-slate-600">Minimum</span>
                <span className="font-bold text-navy">{plan.investmentCriteria.minStartAge} Years</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded text-xs border border-slate-200">
                <span className="text-slate-600">Maximum</span>
                <span className="font-bold text-navy">{plan.investmentCriteria.maxStartAge} Years</span>
              </div>
            </div>
          </div>

          {/* Maturity years */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Number of years after which your investment will mature</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                <span className="text-slate-600">Minimum</span>
                <span className="font-bold text-navy">{plan.investmentCriteria.minMaturityYears} Years</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded text-xs border border-slate-200">
                <span className="text-slate-600">Maximum</span>
                <span className="font-bold text-navy">{plan.investmentCriteria.maxMaturityYears} Years</span>
              </div>
            </div>
          </div>

          {/* Minimum investment */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Minimum amount to invest</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                <span className="text-slate-600">Monthly</span>
                <span className="font-bold text-navy">₹{plan.investmentCriteria.minMonthly.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded text-xs border border-slate-200">
                <span className="text-slate-600">Half Yearly</span>
                <span className="font-bold text-navy">₹{plan.investmentCriteria.minHalfYearly.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                <span className="text-slate-600">Yearly</span>
                <span className="font-bold text-navy">₹{plan.investmentCriteria.minYearly.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Limited pay */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Number of years you can invest</p>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-bold text-blue-900 mb-1">Limited Pay</p>
              <p className="text-xs text-blue-900 leading-relaxed">
                Invest for a few years and stay invested for the entire policy duration. Choose from {plan.investmentCriteria.limitedPayOptions.join(', ')} years.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─────────────────────────────────────────
   Tab 2: Compare with FD
   ───────────────────────────────────────── */
function CompareWithFDTab({ plan }: { plan: GuaranteedPlan }) {
  return (
    <div className="space-y-6">
      {/* VS Header */}
      <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 h-10">
        <div className="flex-1 bg-green-100 px-3 py-2 text-xs font-bold text-green-900">
          {plan.planName}
        </div>
        <div className="flex items-center justify-center h-full w-12 bg-white border-l border-r border-slate-200">
          <span className="text-xs font-bold text-slate-600">vs</span>
        </div>
        <div className="flex-1 bg-pink-100 px-3 py-2 text-xs font-bold text-pink-900 text-right">
          Fixed Deposits
        </div>
      </div>

      {/* Your Investment */}
      <section>
        <p className="text-center text-xs text-slate-600 mb-2">Your Investment Over {plan.youGiveYears} Years</p>
        <p className="text-center text-2xl font-bold text-blue-600">₹{plan.youGive} Lacs</p>
      </section>

      {/* Returns You Get */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-2 rounded mb-3">
          Returns You Get
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-lg font-bold text-green-700">{(plan.multiplier || 4).toFixed(2)}%</p>
            <p className="text-xs font-bold text-green-600 mt-1">Tax Free</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-lg font-bold text-red-700">{plan.fdComparison.fdRate}%</p>
            <p className="text-xs font-bold text-red-600 mt-1">Taxable</p>
          </div>
        </div>
      </section>

      {/* Returns After Tax */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-2 rounded mb-3">
          Returns After Tax
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-lg font-bold text-green-700">{(plan.multiplier || 4).toFixed(2)}%</p>
            <p className="text-xs text-slate-600 mt-1">(unaffected by tax)</p>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="border-l-2 border-b-2 border-slate-300 rounded-bl pl-2 pr-2 py-2">
                <div className="grid grid-cols-3 gap-1 mb-1">
                  {Object.entries(plan.fdComparison.postTaxRates).map(([slab, rate]) => (
                    <div
                      key={slab}
                      className={`text-center p-1 rounded text-xs font-bold ${
                        slab === '30'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rate}%
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-slate-600 mt-1">Tax Slab</p>
            </div>
          </div>
        </div>
      </section>

      {/* In Case Of Death */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-2 rounded mb-3">
          In Case Of Death Your Family Gets
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg font-bold text-blue-700">₹{plan.lifeCover.toFixed(1)} L</p>
            <p className="text-xs text-slate-600 mt-1">Life Cover</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg font-bold text-slate-700">Zero</p>
            <p className="text-xs text-slate-600 mt-1">No coverage</p>
          </div>
        </div>
      </section>
    </div>
  )
}
