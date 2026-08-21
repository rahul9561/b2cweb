import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Info, Plus } from 'lucide-react'
import SipHeader from '../components/sip/SipHeader'
import Footer from '../components/Footer'
import StickySaveTaxBar from '../components/tax/StickySaveTaxBar'
import { calculateTax, type TaxResult } from '../lib/taxCalculator'

/* ── Constants ── */
const OLD_BLUE = '#1163D0'
const NEW_GREEN = '#1FAD6B'

/* ── Currency formatting (Indian numbering) ──
   Spec: ₹46,800 | ₹1.03 Cr | ₹98.8 L  (no K abbreviation)
   Values below 1 lakh use full Indian-grouped numerals with ₹ prefix. */
function formatIndianCurrency(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`
  }
  if (abs >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

function formatIndianNumber(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

/* ── Info icon with tooltip ── */
function InfoIcon({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <Info size={13} className="cursor-help text-slate2-muted transition-colors hover:text-brand" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy p-3 text-[11px] leading-4 text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

/* ── Checkbox ── */
interface CheckboxProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate2-border accent-brand focus:ring-2 focus:ring-brand focus:ring-offset-2"
      />
      <span className="text-[12px] leading-4 text-navy">{label}</span>
    </label>
  )
}

/* ── Result card ── */
interface ResultCardProps {
  title: string
  color: string
  result: TaxResult | null
  loading: boolean
}

function ResultCard({ title, color, result, loading }: ResultCardProps) {
  const [breakupOpen, setBreakupOpen] = useState(false)
  const displayValue = result ? result.taxPayable : 0
  const effectiveRate = result ? result.effectiveRatePct : 0

  return (
    <div
      className="flex flex-1 flex-col rounded-xl p-5 text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-white/80">{title}</p>

      {/* Tax amount */}
      <div className="mt-2 flex items-start gap-1">
        <span
          key={displayValue}
          className={`text-[28px] font-bold leading-none md:text-[32px] ${
            loading ? 'tax-pulse' : 'count-up'
          }`}
        >
          {formatIndianCurrency(displayValue)}
        </span>
        <button
          onClick={() => setBreakupOpen(!breakupOpen)}
          aria-expanded={breakupOpen}
          aria-label={`Toggle ${title} tax breakup`}
          className="mt-0.5 flex items-center gap-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Plus size={10} />
          <Plus size={10} className="-ml-1.5" />
        </button>
      </div>

      {/* Effective rate */}
      <p className="mt-2 text-[11px] text-white/80">
        <span className="text-[13px] font-bold text-white">{effectiveRate.toFixed(1)}%</span>{' '}
        <span className="inline-flex items-center gap-0.5">
          of income
          <button
            onClick={() => setBreakupOpen(!breakupOpen)}
            aria-expanded={breakupOpen}
            aria-label={`Toggle ${title} effective rate breakup`}
            className="flex items-center rounded-full bg-white/20 px-1 py-0.5 text-[8px] font-bold transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Plus size={8} />
            <Plus size={8} className="-ml-1" />
          </button>
        </span>
      </p>

      {/* Breakup expandable */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: breakupOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="mt-4 space-y-2 rounded-lg bg-white/10 p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/80">Tax on Slabs</span>
              <span className="font-semibold">{formatIndianCurrency(result?.breakup.slabTax ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/80">Surcharge</span>
              <span className="font-semibold">{formatIndianCurrency(result?.breakup.surcharge ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/80">Health & Edu. Cess (4%)</span>
              <span className="font-semibold">{formatIndianCurrency(result?.breakup.cess ?? 0)}</span>
            </div>
            {result && result.breakup.rebate > 0 && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/80">Section 87A Rebate</span>
                <span className="font-semibold text-green-highlight">
                  −{formatIndianCurrency(result.breakup.rebate)}
                </span>
              </div>
            )}
            <div className="border-t border-white/20 pt-2">
              <div className="flex items-center justify-between text-[12px] font-bold">
                <span>Total Tax</span>
                <span>{formatIndianCurrency(result?.taxPayable ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function IncomeTaxCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState('')
  const [deductions, setDeductions] = useState('')
  const [applyStandardDeduction, setApplyStandardDeduction] = useState(false)
  const [useNewRegime, setUseNewRegime] = useState(false)
  const [oldResult, setOldResult] = useState<TaxResult | null>(null)
  const [newResult, setNewResult] = useState<TaxResult | null>(null)
  const [loading, setLoading] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  const handleCalculate = () => {
    const income = Number(annualIncome.replace(/[^0-9]/g, '')) || 0
    const ded = Number(deductions.replace(/[^0-9]/g, '')) || 0

    setLoading(true)

    // Brief loading/pulse animation (200–300ms) before values count-up
    setTimeout(() => {
      const old = calculateTax(income, ded, applyStandardDeduction, 'old')
      const fresh = calculateTax(income, ded, applyStandardDeduction, 'new')
      setOldResult(old)
      setNewResult(fresh)
      setLoading(false)
    }, 250)
  }

  const handleIncomeInput = (raw: string) => {
    const num = raw.replace(/[^0-9]/g, '')
    setAnnualIncome(num ? formatIndianNumber(Number(num)) : '')
  }

  const handleDeductionsInput = (raw: string) => {
    const num = raw.replace(/[^0-9]/g, '')
    setDeductions(num ? formatIndianNumber(Number(num)) : '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SipHeader />

      {/* Page Title + Intro */}
      <section className="border-b border-slate2-border bg-white">
        <div className="container-pb py-8">
          <h1 className="text-[28px] font-bold text-[#1A2233] md:text-[32px]">
            Income Tax Calculator
          </h1>
          <p className="mt-3 max-w-3xl text-[13px] leading-6 text-slate2-secondary">
            Many people worry about paying more tax than necessary. An income tax calculator helps
            you avoid this by giving a clear estimate of your tax liability. It helps you understand
            where you stand financially and plan deductions properly.{' '}
            <a href="#" className="font-medium text-brand hover:underline">
              Read more
            </a>
          </p>
        </div>
      </section>

      {/* Calculator Card */}
      <section className="container-pb py-8">
        <div className="rounded-xl bg-gradient-to-br from-[#F3EFFF] via-[#FDF0F5] to-[#F3EFFF] p-5 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* LEFT — Input form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl bg-white p-5 shadow-sm md:p-6">
                {/* Total Annual Income */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center gap-1.5">
                    <label htmlFor="annual-income" className="text-[13px] font-medium text-navy">
                      Total Annual Income
                    </label>
                    <InfoIcon text="Annual income includes salary, business income, capital gains, rental income, interest, and any other taxable income earned during the financial year." />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3 py-2.5 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                    <span className="text-[14px] font-semibold text-slate2-secondary">₹</span>
                    <input
                      id="annual-income"
                      type="text"
                      inputMode="numeric"
                      value={annualIncome}
                      onChange={(e) => handleIncomeInput(e.target.value)}
                      placeholder="Enter Annual Income"
                      className="w-full text-[14px] font-medium text-navy outline-none placeholder:text-slate2-muted"
                    />
                  </div>
                </div>

                {/* Deductions */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center gap-1.5">
                    <label htmlFor="deductions" className="text-[13px] font-medium text-navy">
                      Deductions (Exemptions & Deductions)
                    </label>
                    <InfoIcon text="Includes deductions under Section 80C, 80CCD, 80D, 80TTA, 10(10D), 80G, 80E and other eligible exemptions." />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3 py-2.5 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                    <span className="text-[14px] font-semibold text-slate2-secondary">₹</span>
                    <input
                      id="deductions"
                      type="text"
                      inputMode="numeric"
                      value={deductions}
                      onChange={(e) => handleDeductionsInput(e.target.value)}
                      placeholder="Enter Deductions"
                      className="w-full text-[14px] font-medium text-navy outline-none placeholder:text-slate2-muted"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="mb-6 space-y-3">
                  <Checkbox
                    checked={applyStandardDeduction}
                    onChange={setApplyStandardDeduction}
                    label="Apply standard deduction (only salaried Income)"
                  />
                  <Checkbox
                    checked={useNewRegime}
                    onChange={setUseNewRegime}
                    label="Use New FY 25-26 tax regime (as per latest budget)"
                  />
                </div>

                {/* Calculate button */}
                <button
                  onClick={handleCalculate}
                  className="w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-brand-dark active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* RIGHT — Result cards (stacked vertically on mobile, side-by-side on desktop) */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 lg:col-span-2">
              <ResultCard
                title="OLD TAX REGIME"
                color={OLD_BLUE}
                result={oldResult}
                loading={loading}
              />
              <ResultCard
                title="NEW TAX REGIME"
                color={NEW_GREEN}
                result={newResult}
                loading={loading}
              />
            </div>
          </div>
        </div>

          {/* Breadcrumb */}
        <nav className="mt-6 flex items-center gap-1 text-[11px] text-slate2-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-brand">Income Tax</Link>
          <span>/</span>
          <span className="text-slate2-secondary">Income Tax Calculator</span>
        </nav>
      </section>

      {/* PART 2 & 3 — Two Column Layout */}
      <section className="border-t border-slate2-border bg-white">
        <div className="container-pb grid gap-8 py-8 lg:grid-cols-3">
          {/* LEFT COLUMN — Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2.2 Top Tax Saving Plans */}
            <TopTaxSavingPlans />

            {/* 2.9 What is an Income Tax Calculator? */}
            <Section2_9_WhatIsCalculator />

            {/* 2.10 Union Budget Highlights */}
            <Section2_10_BudgetHighlights />

            {/* 2.11 How to Use AV Management's Income Tax Calculator */}
            <Section2_11_HowToUse />

            {/* 2.12 Why to Use */}
            <Section2_12_WhyToUse />

            {/* 2.13 Use Effectively */}
            <Section2_13_UseEffectively />

            {/* 2.14 Smart Tips */}
            <Section2_14_SmartTips />

            {/* 2.15 Income Tax Slabs */}
            <Section2_15_IncomeTaxSlabs />

            {/* 3.1 Surcharge Rates */}
            <Section3_1_SurchargeRates />

            {/* 3.2 Health & Education Cess */}
            <Section3_2_HealthEducationCess />

            {/* 3.3 Rebate Section 87A */}
            <Section3_3_RebateSection87A />

            {/* 3.4 Deductions & Exemptions */}
            <Section3_4_DeductionsExemptions />

            {/* 3.5 Different Income Sources */}
            <Section3_5_IncomeSources />

            {/* 3.6 How Income Tax Calculator Works */}
            <Section3_6_HowWorks />

            {/* 3.7 Illustration */}
            <Section3_7_Illustration />

            {/* 3.9 FAQ's */}
            <Section3_9_FAQs />

            {/* 3.10 Disclaimers */}
            <Section3_10_Disclaimers />

            {/* 3.11 Income Tax Articles */}
            <Section3_11_Articles />

            {/* 3.8 Summing Up */}
            <Section3_8_SummingUp />
          </div>

          {/* RIGHT COLUMN — Sidebar Widgets */}
          <aside className="space-y-5">
            {/* Widget 1: Maximise Savings */}
            <SidebarWidget1_MaximiseSavings />

            {/* Widget 2: Double Tax Benefit */}
            <SidebarWidget2_DoubleTaxBenefit />

            {/* Widget 3: Instant Tax Receipt */}
            <SidebarWidget3_InstantTaxReceipt />

            {/* Widget 4: Income Tax Returns & eFiling */}
            <SidebarWidget4_ITR_eFiling />

            {/* Widget 5: Axe Your Tax */}
            <SidebarWidget5_AxeYourTax />

            {/* Widget 6: Tax Saving via NPS, ELSS, PPF */}
            <SidebarWidget6_NPS_ELSS_PPF />

            {/* Widget 7: Section 80 & HRA */}
            <SidebarWidget7_Section80_HRA />

            {/* Widget 8: Tax Slab Rates & Saving Tips */}
            <SidebarWidget8_TaxSlab_Tips />

            {/* Widget 9: Got a query about investment */}
            <SidebarWidget9_QueryHelper />

            {/* Widget 10: Calculators */}
            <SidebarWidget10_Calculators />
          </aside>
        </div>
      </section>

      {/* Floating help button & scroll-to-top */}
      <FloatingHelpButton />

      {/* Footer */}
      <div ref={footerRef}>
        <Footer />
      </div>
      <StickySaveTaxBar footerRef={footerRef} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PART 2 & 3 SECTION COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* 2.2 Top Tax Saving Plans */
function TopTaxSavingPlans() {
  const [expanded, setExpanded] = useState(false)

  const plans = [
    { logo: '🏢', name: 'HDFC Life — Click2Invest - Loyalty Plus - Classic', taxSaving: '13.0 L', returns: '13.9%', payout: '₹98.8 L', insurer: 'Private' },
    { logo: '🏦', name: 'Axis Max Life Insurance — Online Savings Plan Plus', taxSaving: '25.7 L', returns: '19.8%', payout: '₹2.26 Cr', insurer: 'Private' },
    { logo: '📊', name: 'ICICI Prudential Life Insurance — Signature', taxSaving: '32.1 L', returns: '21.2%', payout: '₹2.91 Cr', insurer: 'Private', featured: true },
    { logo: '🏛️', name: 'Tata AIA Life Insurance — Smart SIP - Wealth Secure', taxSaving: '12.2 L', returns: '13.3%', payout: '₹90.8 L', insurer: 'Private' },
    { logo: '💼', name: 'Bajaj Life Insurance — Smart Wealth Goal VII - WOP', taxSaving: '21.0 L', returns: '18%', payout: '₹1.79 Cr', insurer: 'Private' },
    { logo: '🏦', name: 'Birla Sun Life Insurance — Wealth Smart Plus', taxSaving: '15.4 L', returns: '15.44%', payout: '₹1.23 Cr', insurer: 'Private' },
    { logo: '📈', name: 'Kotak Mahindra Life Insurance — E-Invest Plus', taxSaving: '12.6 L', returns: '13.55%', payout: '₹94.7 L', insurer: 'Private' },
    { logo: '🏦', name: 'PNB MetLife India Insurance — Smart Goal Ensuring Multiplier-Wealth', taxSaving: '14.4 L', returns: '14.99%', payout: '₹1.13 Cr', insurer: 'Private' },
    { logo: '🏢', name: 'Canara HSBC Life Insurance — Promise4Wealth - Maximiser', taxSaving: '17.3 L', returns: '16%', payout: '₹1.42 Cr', insurer: 'Private' },
    { logo: '🏛️', name: 'Pramerica Life Insurance — Smart Invest 1 UP', taxSaving: '20.7 L', returns: '17.8%', payout: '₹1.76 Cr', insurer: 'Private' },
  ]

  return (
    <div>
      <h2 className="mb-2 text-[20px] font-bold text-navy">Top Tax Saving Plans 2026<span className="text-[12px]">˜</span></h2>
      <div className="mb-4 flex items-center gap-4 flex-wrap text-[12px]">
        <span><strong>You Invest:</strong> ₹150,000/year</span>
        <span><strong>Invest For:</strong> 10 Years</span>
        <span><strong>Age:</strong> 30 Year</span>
      </div>

      <div className="space-y-3">
        {plans.slice(0, expanded ? plans.length : 5).map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-4 transition-colors ${
              plan.featured
                ? 'bg-gradient-to-r from-blue-50 to-pink-50 border-blue-200'
                : 'bg-white border-slate2-border hover:border-brand/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block rounded-full bg-pink-100 px-2 py-1 text-[11px] font-semibold text-pink-700">
                    Tax Saving {plan.taxSaving}
                  </span>
                  <span className="text-[11px] text-slate2-muted">{plan.insurer} Insurer</span>
                </div>
                <p className="text-[13px] font-medium text-navy">{plan.name}</p>
              </div>
              <button className="shrink-0 rounded-lg bg-brand px-4 py-2 text-[12px] font-semibold text-white hover:bg-brand-dark">
                Know More &gt;
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate2-muted">10 Yr Returns</p>
                <p className="text-[14px] font-bold text-green-600">{plan.returns}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate2-muted">Lump sum Payout</p>
                <p className="text-[14px] font-bold text-brand">{plan.payout}</p>
                <p className="text-[10px] text-slate2-muted">If you had invested 20 Yrs ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 w-full rounded-lg border border-slate2-border py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-slate2-bg"
      >
        {expanded ? 'View Less Plans ⌃' : 'View More Plans ⌄'}
      </button>
    </div>
  )
}

/* Section 2.9 */
function Section2_9_WhatIsCalculator() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">What is an Income Tax Calculator?</h2>
      <p className="mb-3 text-[13px] leading-6 text-slate2-secondary">
        An Income Tax Calculator is an online tool that calculates your total tax payable based on:
      </p>
      <ul className="mb-3 space-y-2 text-[13px] text-slate2-secondary ml-4">
        <li>• Your annual income</li>
        <li>• Eligible deductions and exemptions</li>
        <li>• Applicable tax slabs</li>
        <li>• Chosen <Link to="#" className="text-brand font-medium hover:underline">new vs old tax regime</Link></li>
      </ul>
      <p className="text-[13px] leading-6 text-slate2-secondary">
        It gives you a clear picture of how much tax you need to pay or how much you can save with better planning. An income tax calculator is a must-use financial tool for salaried employees, freelancers, business owners, and investors alike.
      </p>
    </div>
  )
}

/* Section 2.10 */
function Section2_10_BudgetHighlights() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Union Budget 2026 Highlights on Tax Rules in India</h2>
      <ul className="space-y-2 text-[13px] text-slate2-secondary ml-4">
        <li>• The Income Tax Slabs remain unchanged from the previous year.</li>
        <li>• A new Income Tax Act is set to take effect from April 1, 2026, promising simplified rules.</li>
        <li>• The government continues to support both the Old Tax Regime and the New Tax Regime, with taxpayers free to choose whichever benefits them.</li>
        <li>• Around 88% of taxpayers have moved to the new tax regime, showing its growing popularity.</li>
      </ul>
    </div>
  )
}

/* Section 2.11 */
function Section2_11_HowToUse() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">How to Use AV Management's Income Tax Calculator?</h2>
      <p className="mb-4 text-[13px] leading-6 text-slate2-secondary">
        You can use AV Management's Income Tax Calculator to quickly check your tax under both the old and new tax regimes, as per the Union Budget 2026. Follow these simple steps:
      </p>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[13px] font-bold text-navy">1. Enter your total annual income:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Enter your total yearly income in Indian Rupees (₹). Include income from salary, interest, rental income, dividends, and any other sources.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">2. Enter your deductions and exemptions:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Add the deductions and exemptions you are eligible for, excluding the standard deduction. These may include benefits under Sections <Link to="#" className="text-brand">80C</Link>, <Link to="#" className="text-brand">80CCD</Link>, <Link to="#" className="text-brand">80D</Link>, <Link to="#" className="text-brand">80TTA</Link>, <Link to="#" className="text-brand">10(10D)</Link>, <Link to="#" className="text-brand">80G</Link>, and <Link to="#" className="text-brand">80E</Link>.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">3. Apply the standard deduction:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">If you are a salaried individual, the calculator applies the standard deduction under <Link to="#" className="text-brand">Section 16</Link> of the Income Tax Act, 1961, as applicable under Budget 2026 provisions.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">4. Calculate your tax:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Click the "CALCULATE" button. The calculator shows your tax liability under both the old and new tax regimes, helping you compare them easily.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">5. Unlock the detailed tax summary:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Enter your basic contact details and click "Unlock." You will see a detailed tax breakup for both tax regimes, calculated as per the latest rules announced in the Union Budget 2026.</p>
        </div>
      </div>

      {/* Inline promo card */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-center gap-4 mb-6">
        <div className="text-4xl">📓</div>
        <div>
          <p className="text-[14px] font-bold text-navy">Tax-Free Maturity and High Returns!</p>
          <p className="text-[12px] text-slate2-secondary">Save on taxes & secure your financial future.</p>
        </div>
        <button className="shrink-0 rounded-lg bg-brand px-4 py-2 text-[12px] font-semibold text-white hover:bg-brand-dark">
          View plans
        </button>
      </div>
      <p className="text-[11px] text-slate2-muted">T&C Apply*</p>
    </div>
  )
}

/* Section 2.12 */
function Section2_12_WhyToUse() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Why to Use an Income Tax Calculator Online?</h2>
      <p className="mb-4 text-[13px] text-slate2-secondary">Key benefits of using an online income tax calculator include:</p>
      <div className="space-y-3">
        <div>
          <p className="text-[13px] font-bold text-navy">Estimate Your Tax Quickly:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Instead of manually applying slab rates and deductions, calculators do it in seconds.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">Compare Tax Regimes:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">See which regime, among old or new tax regimes, gives you the best outcome.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">Plan Deductions Smartly:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Know how much more saving you can achieve with additional investment.</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-navy">Avoid Errors:</p>
          <p className="text-[13px] text-slate2-secondary ml-4">Human errors in manual calculation can lead to under-estimation or penalties.</p>
        </div>
      </div>
    </div>
  )
}

/* Section 2.13 */
function Section2_13_UseEffectively() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">How to Use an Income Tax Calculator Effectively?</h2>
      <ul className="space-y-2 text-[13px] text-slate2-secondary ml-4">
        <li>• Always compare the results of both regimes before choosing.</li>
        <li>• If your total deductions are high, the old regime can save more.</li>
        <li>• If you prefer simplicity and fewer exemptions, the new regime may be better.</li>
        <li>• Update input data yearly along with tax laws and slabs change.</li>
      </ul>
    </div>
  )
}

/* Section 2.14 */
function Section2_14_SmartTips() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Smart Tips to Save More Tax</h2>
      <p className="mb-4 text-[13px] leading-6 text-slate2-secondary">
        The use of an income tax calculator helps you know your tax liability, but choosing the right tax-saving strategy can save you thousands more. Here are some expert-level tips:
      </p>
      <ol className="space-y-2 text-[13px] text-slate2-secondary ml-4">
        <li>1. Combine the calculator with investment planning (like NPS, ELSS)</li>
        <li>2. Run scenario planning for different deduction inputs</li>
        <li>3. Compare how changing jobs or salary components affects taxes</li>
        <li>4. Use the calculator early in the year and not just before filing.</li>
      </ol>
    </div>
  )
}

/* Section 2.15 */
function Section2_15_IncomeTaxSlabs() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Income Tax Slabs for FY 2025-26 and FY 2026–27</h2>
      <p className="mb-4 text-[13px] text-slate2-secondary">
        The tax slabs for the Financial Year (FY) 2026-27 (Assessment Year 2027-28) remain unchanged after Budget 2026. Individuals can continue to choose between the Old Tax Regime and the New Tax Regime.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-slate2-bg border-b-2 border-slate2-border">
              <th className="text-left font-bold text-navy px-3 py-2">Annual Income (₹)</th>
              <th className="text-left font-bold text-navy px-3 py-2">Old Regime (FY 2025-26 & 2026-27)</th>
              <th className="text-left font-bold text-navy px-3 py-2">New Regime (FY 2025-26 & 2026-27)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Up to ₹2,50,000', '0%', '0%'],
              ['₹2,50,001 – ₹4,00,000', '5%', '0%'],
              ['₹4,00,001 – ₹5,00,000', '5%', '5%'],
              ['₹5,00,001 – ₹8,00,000', '20%', '5%'],
              ['₹8,00,001 – ₹10,00,000', '20%', '10%'],
              ['₹10,00,001 – ₹12,00,000', '30%', '10%'],
              ['₹12,00,001 – ₹16,00,000', '30%', '15%'],
              ['₹16,00,001 – ₹20,00,000', '30%', '20%'],
              ['₹20,00,001 – ₹24,00,000', '30%', '25%'],
              ['Above ₹24,00,000', '30%', '30%'],
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate2-border hover:bg-slate2-bg/50">
                <td className="text-left px-3 py-2 text-slate2-secondary font-medium">{row[0]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[1]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-slate2-muted italic">*The tax slab rates vary for senior citizens (60-80 age) and super-senior (≥80 age) in the old tax regime.</p>
    </div>
  )
}

/* Section 3.1 */
function Section3_1_SurchargeRates() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Income Tax Surcharge Rates for FY 2025-26 and FY 2026-27</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-slate2-bg border-b-2 border-slate2-border">
              <th className="text-left font-bold text-navy px-3 py-2">Total Income</th>
              <th className="text-left font-bold text-navy px-3 py-2">Old Tax Regime Surcharge</th>
              <th className="text-left font-bold text-navy px-3 py-2">New Tax Regime Surcharge</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['> ₹50 lakh and ≤ ₹1 crore', '10% of income tax', '10% of income tax'],
              ['> ₹1 crore and ≤ ₹2 crore', '15% of income tax', '15% of income tax'],
              ['> ₹2 crore and ≤ ₹5 crore', '25% of income tax', '25% of income tax'],
              ['> ₹5 crore', '37% of income tax', '25% of income tax (capped)'],
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate2-border hover:bg-slate2-bg/50">
                <td className="text-left px-3 py-2 text-slate2-secondary font-medium">{row[0]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[1]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-slate2-muted">*Key Difference: The maximum surcharge under the new tax regime is capped at 25%, whereas it goes up to 37% in the old tax regime.</p>
    </div>
  )
}

/* Section 3.2 */
function Section3_2_HealthEducationCess() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Health and Education Cess (FY 2025-26 & FY 2026-27)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-slate2-bg border-b-2 border-slate2-border">
              <th className="text-left font-bold text-navy px-3 py-2">Particulars</th>
              <th className="text-left font-bold text-navy px-3 py-2">Old Tax Regime</th>
              <th className="text-left font-bold text-navy px-3 py-2">New Tax Regime</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate2-border hover:bg-slate2-bg/50">
              <td className="text-left px-3 py-2 text-slate2-secondary font-medium">Health and Education Cess</td>
              <td className="text-left px-3 py-2 text-slate2-secondary">4% of income tax + surcharge</td>
              <td className="text-left px-3 py-2 text-slate2-secondary">4% of income tax + surcharge</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* Section 3.3 */
function Section3_3_RebateSection87A() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Rebate under Section 87A (FY 2026–27)</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-slate2-bg border-b-2 border-slate2-border">
              <th className="text-left font-bold text-navy px-3 py-2">Tax Regime</th>
              <th className="text-left font-bold text-navy px-3 py-2">Maximum Income Eligible for Rebate</th>
              <th className="text-left font-bold text-navy px-3 py-2">Maximum Rebate Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Old Tax Regime', 'Up to ₹5,00,000', 'Up to ₹12,500'],
              ['New Tax Regime', 'Up to ₹12,00,000*', 'Tax payable or ₹25,000 (whichever is lower)'],
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate2-border hover:bg-slate2-bg/50">
                <td className="text-left px-3 py-2 text-slate2-secondary font-medium">{row[0]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[1]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-[12px] font-bold text-navy mb-2">*Important Conditions for New Regime Rebate:</p>
        <ul className="text-[12px] text-slate2-secondary space-y-1 ml-4">
          <li>• From FY 2026–27, rebate under Section 87A is not available on income taxed at special rates.</li>
          <li>• Rebate is not applicable on Long-Term Capital Gains taxable under Section 112A in any financial year.</li>
        </ul>
      </div>
    </div>
  )
}

/* Section 3.4 */
function Section3_4_DeductionsExemptions() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Deductions and Exemptions Available under Old and New Tax Regime in 2026</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-slate2-bg border-b-2 border-slate2-border">
              <th className="text-left font-bold text-navy px-3 py-2">Particulars</th>
              <th className="text-left font-bold text-navy px-3 py-2">Old Tax Regime</th>
              <th className="text-left font-bold text-navy px-3 py-2">New Tax Regime</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Section 80C (PPF, EPF, ULIP, etc.)', 'Available', 'Not available'],
              ['Section 80D (Health Insurance)', 'Available', 'Not available'],
              ['HRA / LTA / Other Allowances', 'Available', 'Not available'],
              ['Home Loan Interest (Self-occupied)', 'Available', 'Not available'],
              ['Standard Deduction', 'Available', 'Available (higher limit)'],
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate2-border hover:bg-slate2-bg/50">
                <td className="text-left px-3 py-2 text-slate2-secondary font-medium">{row[0]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[1]}</td>
                <td className="text-left px-3 py-2 text-slate2-secondary">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate2-secondary">
        You can check the detailed deductions under the new tax regime & old tax regimes here — <Link to="#" className="text-brand font-medium hover:underline">Deductions in New Tax Regime under Union Budget 2026.</Link>
      </p>
    </div>
  )
}

/* Section 3.5 */
function Section3_5_IncomeSources() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Different Income Sources Considered in Income Tax Calculator</h2>
      <p className="mb-4 text-[13px] text-slate2-secondary">
        The following income sources contribute to your gross taxable income for ITR filing:
      </p>

      <div className="space-y-4">
        {[
          { num: '1', title: 'Salary Income:', items: ['Includes basic salary, allowances, bonuses, and commissions.', 'Employer-provided benefits like leave encashment or gratuity may also be taxable.', 'The old regime permits exemptions like HRA (link), while the new regime offers lower rates but no exemptions.'] },
          { num: '2', title: 'House Property Income:', items: ['This includes rental income from owned properties.', 'A standard deduction of 30% is permitted on rental income, with adjustments for municipal taxes.', 'The old regime provides a home loan interest deduction under Section 24 (link), which is not available in the new regime.'] },
          { num: '3', title: 'Business or Professional Income:', items: ['This includes profits earned by self-employed professionals, freelancers, or business owners.', 'Also, business expenses such as rent, office supplies, or transportation can be deducted from revenue to calculate net income.', 'The old tax regime offers more deductions, while the new regime simplifies with fewer claims.'] },
          { num: '4', title: 'Capital Gains:', items: ['This category includes earnings from selling capital assets like gold or property. It is classified as Short-Term Capital Gains (STCG) or Long-Term Capital Gains (LTCG), with taxation varying based on the asset\'s holding period.', 'Both regimes adhere to the same capital gains tax rules.'] },
          { num: '5', title: 'Other Investment Income:', items: ['Other income sources include interest from savings accounts, Fixed Deposit (FDs), dividends, and gifts.', 'Lottery winnings or income from freelance work may also fall under this category.', 'The old regime provides tax benefits for investments, whereas the new regime offers none.'] },
        ].map((block, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-[13px]">
              {block.num}
            </div>
            <div>
              <p className="text-[13px] font-bold text-navy mb-2">{block.title}</p>
              <ul className="space-y-1 text-[12px] text-slate2-secondary ml-2">
                {block.items.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Inline promo banner */}
      <div className="mt-6 rounded-lg bg-[#0F1B33] p-4 text-white flex items-center gap-4">
        <div className="text-4xl">💰</div>
        <div className="flex-1">
          <p className="text-[14px] font-bold">Double Win — <span className="text-yellow-400">Wealth Creation + Tax Savings!</span></p>
          <p className="text-[12px] text-white/80">Invest and enjoy tax-free returns</p>
        </div>
        <button className="shrink-0 rounded-lg bg-brand px-4 py-2 text-[12px] font-semibold text-white hover:bg-brand-dark">
          View plans
        </button>
      </div>
      <p className="mt-2 text-[11px] text-slate2-muted">Standard T&C Applies*</p>
    </div>
  )
}

/* Section 3.6 */
function Section3_6_HowWorks() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">How Income Tax Calculator Work?</h2>
      <ul className="space-y-2 text-[13px] text-slate2-secondary ml-4">
        <li>• An Income Tax Calculator works by taking your income details and applying the latest income tax rules to estimate how much tax you need to pay.</li>
        <li>• It automatically considers tax slabs, deductions, rebates, and cess, so you don't have to calculate anything manually.</li>
      </ul>
    </div>
  )
}

/* Section 3.7 Illustration */
function Section3_7_Illustration() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Illustration of Tax Calculation for a Salaried Employee</h2>
      <p className="mb-4 text-[13px] text-slate2-secondary">
        Let us understand how income tax is calculated using a simple example of a salaried employee below 60 years with an annual income of ₹15,00,000.
      </p>

      <div className="space-y-4 mb-6">
        <IllustrationStep num="1" title="Gross Salary" content="This includes your basic salary, HRA, special allowance, and other salary components before any deductions." data={{ value: '₹15,00,000' }} />
        <IllustrationStep num="2" title="HRA Exemption (Only if You Live in a Rented House)" content="HRA exemption is available under Section 10(13A) (link) and is calculated as the lowest of:" data={{ list: ['Actual HRA received', '50% of basic salary (metro cities) or 40% (non-metro)', 'Rent paid minus 10% of basic salary'], table: { 'Old Regime (with savings)': '₹3,50,000', 'Old Regime (without savings)': '₹0', 'New Regime': '₹0' } }} />
        <IllustrationStep num="3" title="Gross Total Income from Salary" content="After reducing HRA and allowances from the gross salary:" data={{ table: { 'Old Regime (with savings)': '₹11,50,000', 'Old Regime (without savings)': '₹15,00,000', 'New Regime': '₹15,00,000' } }} />
        <IllustrationStep num="4" title="Standard Deduction" content="A flat deduction allowed to all salaried individuals under Section 16(ia) (link):" data={{ table: { 'Old Regime (with or without savings)': '₹50,000', 'New Regime': '₹75,000' } }} />
        <IllustrationStep num="5" title="Home Loan Interest (Old Regime Only)" content="Interest paid on a home loan for a self-occupied house can be claimed under Section 80EE:" data={{ table: { 'Old Regime (with savings)': '₹2,00,000', 'Old Regime (without savings)': '₹0', 'New Regime': '₹0' } }} />
        <IllustrationStep num="6" title="Gross Total Income (After Key Deductions)" data={{ table: { 'Old Regime (with savings)': '₹9,00,000', 'Old Regime (without savings)': '₹14,50,000', 'New Regime': '₹14,25,000' } }} />
        <IllustrationStep num="7" title="Investment-Linked Deductions (Old Regime Only)" content="You can further reduce your taxable income through:" data={{ list: ['Section 80C: ₹1,50,000 (PPF, EPF, ULIP, SSY, home loan principal, etc.)', 'Section 80D: ₹25,000 (Health insurance for self and family)', 'Section 80CCD(1B): ₹50,000 (Additional NPS contribution)'] }} />
        <IllustrationStep num="8" title="Final Taxable Income" content="After all eligible deductions:" data={{ table: { 'Old Regime (with savings)': '₹6,75,000', 'Old Regime (without savings)': '₹14,50,000', 'New Regime': '₹14,25,000' } }} />
        <IllustrationStep num="9" title="Tax Calculation for FY 2025-26 (AY 2026-27)" data={{ fullTable: true, table: { 'Taxable Income': ['₹6,75,000', '₹14,50,000', '₹14,25,000'], 'Tax as per slabs': ['₹47,500', '₹2,47,500', '₹1,25,000'], 'Health & Education Cess (4%)': ['₹1,900', '₹9,900', '₹5,000'], 'Total Tax Payable': ['₹49,400', '₹2,57,400', '₹1,30,000'] }, headers: ['Particulars', 'Old Tax Regime (with Savings)', 'Old Tax Regime (without savings)', 'New Regime (FY 2025-26)'] }} />
        <IllustrationStep num="10" title="Tax Rebate (Section 87A)" data={{ list: ['Old Regime: Available only if income is up to ₹5,00,000 (rebate up to ₹12,500)', 'New Regime: Available if income is up to ₹7,00,000 (rebate up to ₹25,000)'], note: 'In this example, rebate is not applicable under any regime.' }} />
        <IllustrationStep num="11" title="TDS and Form 16" content="Your employer deducts tax at source (TDS) and provides Form 16, which summarises your salary and tax deductions." />
        <IllustrationStep num="12" title="Filing Your Income Tax Return" content="To complete the process, you must file your Income Tax Return (ITR) accurately before the due date, usually 31st July." />
      </div>

      {/* Trending in Tax Savings carousel */}
      <div className="rounded-lg bg-pink-50 border border-pink-200 p-4 mb-6">
        <p className="text-[13px] font-bold text-navy mb-3">Trending in Tax Savings</p>
        <div className="grid grid-cols-2 gap-2">
          {['Income Tax', 'Take Home, Net Gross Salary vs CTC', 'Tax Saving - How to Save Income Tax For FY 2024-25', 'Income Tax Slab Rates for FY 2024-25 (AY 2025-26)'].map((item, idx) => (
            <button key={idx} className="rounded-full bg-white border border-pink-300 px-3 py-1.5 text-[11px] font-medium text-navy hover:bg-pink-100 text-left">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Helper for Illustration steps */
function IllustrationStep({ num, title, content, data }: any) {
  return (
    <div className="border-l-4 border-brand pl-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-[12px]">
          {num}
        </div>
        <p className="text-[13px] font-bold text-navy mt-0.5">{title}</p>
      </div>
      {content && <p className="text-[12px] text-slate2-secondary mb-2">{content}</p>}
      {data?.value && <p className="text-[12px] font-medium text-navy">{data.value}</p>}
      {data?.list && (
        <ul className="text-[12px] text-slate2-secondary space-y-1 ml-4 mb-2">
          {data.list.map((item: string, idx: number) => <li key={idx}>• {item}</li>)}
        </ul>
      )}
      {data?.note && <p className="text-[11px] text-slate2-muted italic mt-2">*{data.note}</p>}
      {data?.table && !data?.fullTable && (
        <div className="text-[12px] space-y-1 my-2">
          {Object.entries(data.table).map(([key, value]: any, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-slate2-secondary">{key}</span>
              <span className="font-medium text-navy">{value}</span>
            </div>
          ))}
        </div>
      )}
      {data?.fullTable && (
        <div className="overflow-x-auto my-2">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate2-bg border-b border-slate2-border">
                {data.headers.map((h: string, idx: number) => (
                  <th key={idx} className="text-left font-bold text-navy px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.table).map(([label, values]: any, ridx: number) => (
                <tr key={ridx} className="border-b border-slate2-border hover:bg-slate2-bg/50">
                  <td className="text-left font-medium text-navy px-2 py-1">{label}</td>
                  {values.map((val: string, idx: number) => (
                    <td key={idx} className="text-left text-slate2-secondary px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* Section 3.8 */
function Section3_8_SummingUp() {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-bold text-navy">Summing Up</h2>
      <p className="text-[13px] leading-6 text-slate2-secondary">
        An Income Tax Calculator is a quick and easy tool to estimate your tax liability. It helps you compare tax savings under different regimes, plan finances better, and make informed decisions. With just a few inputs, you can avoid complex calculations and efficiently manage your tax obligations.
      </p>
    </div>
  )
}

/* Section 3.9 FAQs */
function Section3_9_FAQs() {
  const [expanded, setExpanded] = useState<number | null>(0)

  const faqs = [
    { q: 'Why do tax calculators show zero tax on ₹12 lakh in 2026–27?', a: 'Under the Union Budget 2026 tax slabs, in the new tax regime, income up to ₹12 lakh often results in zero tax after standard deduction and rebate are applied. The rebate effectively nullifies tax liability for many middle-income taxpayers.' },
    { q: 'Will the Income Tax Calculator include changes from the new Income Tax Act, 2025?', a: 'Content coming soon.' },
    { q: 'Can calculators estimate tax for capital gains and other non-salary income?', a: 'Content coming soon.' },
    { q: 'Does the online tax calculator account for the updated return filing deadlines in Budget 2026?', a: 'Content coming soon.' },
    { q: 'Can the calculator factor in rebates under Section 87A automatically?', a: 'Content coming soon.' },
    { q: 'Can I use an income tax calculator before my employer provides Form 16?', a: 'Content coming soon.' },
  ]

  return (
    <div>
      <h2 className="mb-4 text-[20px] font-bold text-navy">FAQ's</h2>
      <div className="space-y-2">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-slate2-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              aria-expanded={expanded === idx}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate2-bg transition-colors bg-white"
            >
              <span className="text-[13px] font-medium text-navy text-left">{faq.q}</span>
              <span className={`shrink-0 text-slate2-muted transition-transform duration-300 ${expanded === idx ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            {expanded === idx && (
              <div className="px-4 py-3 border-t border-slate2-border bg-slate2-bg/30 text-[13px] text-slate2-secondary animate-in fade-in duration-300">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Section 3.10 Disclaimers */
function Section3_10_Disclaimers() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="border border-slate2-border rounded-lg overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate2-bg transition-colors bg-white"
        >
          <span className="text-[13px] font-bold text-brand uppercase">Disclaimers</span>
          <span className={`shrink-0 text-slate2-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </button>
        {expanded && (
          <div className="px-4 py-3 border-t border-slate2-border bg-slate2-bg/30 text-[12px] text-slate2-secondary leading-6 animate-in fade-in duration-300">
            <p>Tax benefits are subject to changes in tax laws. Please consult your tax advisor for exact applicability. The calculations shown are indicative and for illustrative purposes only, based on the tax slabs and rules applicable for FY 2025-26 and FY 2026-27 as per the Union Budget 2026. AV Management does not guarantee the accuracy of tax outcomes and recommends independent verification before filing. All information provided is subject to review and update with changes in tax regulations.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* Section 3.11 Articles Carousel */
function Section3_11_Articles() {
  const [tab, setTab] = useState('recent')

  const recentArticles = [
    { img: '📊', title: "RBI's New FD Rules", date: '10 Aug 2026', excerpt: 'The Reserve Bank of India has revised the rules governing' },
    { img: '🏦', title: 'How to Fill the Form 121 for SBI FD', date: '16 Jul 2026', excerpt: 'Form 121 allows eligible SBI Fixed Deposit holders to avoid TDS' },
    { img: '📅', title: 'Karnataka Bank Mini Statement', date: '06 Jul 2026', excerpt: 'Karnataka Bank offers convenient ways for customers to check' },
  ]

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[20px] font-bold text-navy">Income Tax Articles</h2>
      </div>

      <div className="flex items-center gap-3 mb-4 border-b border-slate2-border">
        <button
          onClick={() => setTab('recent')}
          className={`pb-2.5 px-1 text-[13px] font-medium transition-colors ${tab === 'recent' ? 'text-brand border-b-2 border-brand' : 'text-slate2-muted hover:text-navy'}`}
        >
          Recent Article
        </button>
        <button
          onClick={() => setTab('popular')}
          className={`pb-2.5 px-1 text-[13px] font-medium transition-colors ${tab === 'popular' ? 'text-brand border-b-2 border-brand' : 'text-slate2-muted hover:text-navy'}`}
        >
          Popular Articles
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {recentArticles.map((article, idx) => (
          <div key={idx} className="rounded-lg border border-slate2-border overflow-hidden hover:shadow-md transition-shadow bg-white">
            <div className="h-40 bg-slate2-bg flex items-center justify-center text-4xl">
              {article.img}
            </div>
            <div className="p-3">
              <p className="text-[12px] text-slate2-muted mb-2">{article.date}</p>
              <p className="text-[13px] font-bold text-navy mb-2">{article.title}</p>
              <p className="text-[12px] text-slate2-secondary mb-3">{article.excerpt}</p>
              <button className="text-[12px] font-medium text-brand hover:underline">Read more ›</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR WIDGETS (RIGHT COLUMN)
   ═══════════════════════════════════════════════════════════════ */

function SidebarWidget1_MaximiseSavings() {
  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-[12px] text-slate2-secondary">Maximise your</p>
          <p className="text-[14px] font-bold text-brand">Tax Savings!</p>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        {['Tax savings under Sec 80c', 'Get Instant Tax receipt', 'Tax free returns upto 18%'].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-[12px] text-navy">{item}</span>
          </div>
        ))}
      </div>
      <button className="w-full rounded-lg bg-brand py-2.5 text-[12px] font-bold text-white hover:bg-brand-dark">
        VIEW PLANS
      </button>
      <p className="mt-2 text-center text-[10px] text-slate2-muted">Standard T & C Apply*</p>
    </div>
  )
}

function SidebarWidget2_DoubleTaxBenefit() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 p-4 text-white shadow-sm">
      <p className="text-[14px] font-bold mb-2">DOUBLE TAX BENEFIT</p>
      <p className="text-[12px] mb-1">save tax upto <span className="font-bold">₹46,800</span> under sec 80C &</p>
      <p className="text-[12px] font-bold text-yellow-300">INSTANT TAX RECEIPT</p>
      <p className="text-[11px] text-white/80 mb-3">no tax on maturity under sec 10 (10 d)</p>
      <div className="text-2xl">📄</div>
      <p className="mt-2 text-[9px] text-white/60">GN/ADV/0165/Sep/26/23/28-21</p>
    </div>
  )
}

function SidebarWidget3_InstantTaxReceipt() {
  return (
    <div className="rounded-lg bg-brand p-4 text-white shadow-sm">
      <p className="text-[14px] font-bold mb-3">INSTANT TAX RECEIPT</p>
      <div className="text-3xl mb-3">📓✨</div>
      <button className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-brand hover:bg-slate-100">
        KNOW MORE
      </button>
    </div>
  )
}

function SidebarWidget4_ITR_eFiling() {
  const links = [
    'Income Tax Return Filing',
    'Income Tax Refund Status: Check ITR Refund',
    'Income Tax Return Form: How to download ITR Forms',
    "How to Check ITR-V Receipt Status?",
    'Income Tax Filing For the Freelancers',
    'Income Tax Form 16',
    'Income Tax for NRI in India',
  ]

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <p className="text-[13px] font-bold text-navy mb-3">Income Tax Returns & eFiling</p>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link key={idx} to="#" className="flex items-center justify-between text-[12px] text-slate2-secondary hover:text-brand group">
            <span>{link}</span>
            <span className="text-slate2-muted group-hover:text-brand transition-colors">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SidebarWidget5_AxeYourTax() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-orange-600 to-red-600 p-4 text-white shadow-sm">
      <p className="text-[14px] font-bold mb-2">AXE YOUR TAX</p>
      <p className="text-[12px] mb-1">Upto 46,800 under Sec 80C &</p>
      <p className="text-[12px] font-bold text-yellow-300">PAY ZERO TAX</p>
      <p className="text-[11px] text-white/80 mb-3">On Maturity unlike mutual funds</p>
      <div className="text-2xl mb-3">💰</div>
      <button className="rounded-full bg-blue-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-blue-700">
        Know More
      </button>
      <p className="mt-3 text-[9px] text-white/60">GN/ADV/0165/Sep/23/28-21 | Standard T&C Apply*</p>
    </div>
  )
}

function SidebarWidget6_NPS_ELSS_PPF() {
  const links = [
    'Tax Saving Investments',
    'NPS Calculator',
    'How to Open NPS Account Online',
    'Equity Linked Savings Scheme Funds 2026',
    'Steps to Invest in ELSS Funds',
    'PPF Calculator',
    'PPF Interest Rate 2026 - All You Need to Know',
    'PPF or Public Provident Fund Account: A Complete Guide',
  ]

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <p className="text-[13px] font-bold text-navy mb-3">Tax Saving via NPS, ELSS, PPF, MFs</p>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link key={idx} to="#" className="flex items-center justify-between text-[12px] text-slate2-secondary hover:text-brand group">
            <span>{link}</span>
            <span className="text-slate2-muted group-hover:text-brand transition-colors">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SidebarWidget7_Section80_HRA() {
  const links = [
    'Section 80C',
    'Income Tax Deductions',
    'Section 80D',
    'Section 80U',
    'Income Tax Rebate in India',
    'Income Tax Exemptions',
    'HRA Calculator',
    'House Rent Allowance',
  ]

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <p className="text-[13px] font-bold text-navy mb-3">Section 80 & HRA</p>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link key={idx} to="#" className="flex items-center justify-between text-[12px] text-slate2-secondary hover:text-brand group">
            <span>{link}</span>
            <span className="text-slate2-muted group-hover:text-brand transition-colors">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SidebarWidget8_TaxSlab_Tips() {
  const links = [
    'Tax Saving - How to Save Income Tax For FY 2026-2027',
    'How to Pay Income Tax Online in India 2026',
    'Income Tax Slab Rates for FY 2026-2027 (AY 2027-2028)',
    'Advance Tax Payment',
    'How to Save Tax on Salary?',
  ]

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <p className="text-[13px] font-bold text-navy mb-3">Tax Slab Rates & Saving Tips</p>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link key={idx} to="#" className="flex items-center justify-between text-[12px] text-slate2-secondary hover:text-brand group">
            <span>{link}</span>
            <span className="text-slate2-muted group-hover:text-brand transition-colors">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SidebarWidget9_QueryHelper() {
  const [step, setStep] = useState(1)

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <p className="text-[12px] font-bold text-navy">Got a query about investment?</p>
      </div>
      <p className="text-[11px] text-slate2-secondary mb-4">Simply ask us and we will find the best solution to your problem</p>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-[11px] font-medium text-navy">Select query type:</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" defaultChecked className="w-3 h-3" />
              <span className="text-[12px] text-navy">Buying a new Policy</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" className="w-3 h-3" />
              <span className="text-[12px] text-navy">Need help with Existing Policy</span>
            </label>
          </div>
          <select className="w-full px-2.5 py-2 text-[12px] border border-slate2-border rounded-lg">
            <option>What do you need help with?</option>
          </select>
          <textarea
            placeholder="Explain your concern in detail"
            className="w-full px-2.5 py-2 text-[12px] border border-slate2-border rounded-lg min-h-20 resize-none"
          />
          <button
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-brand py-2 text-[12px] font-bold text-white hover:bg-brand-dark"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center py-4">
          <p className="text-[12px] font-bold text-navy mb-3">Contact Information</p>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-2.5 py-2 text-[12px] border border-slate2-border rounded-lg mb-2"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full px-2.5 py-2 text-[12px] border border-slate2-border rounded-lg"
          />
          <button className="w-full rounded-lg bg-green-600 py-2 text-[12px] font-bold text-white hover:bg-green-700 mt-3">
            Submit
          </button>
        </div>
      )}
    </div>
  )
}

function SidebarWidget10_Calculators() {
  const [expanded, setExpanded] = useState(false)

  const calculators = [
    { icon: '📊', label: 'SIP Calculator' },
    { icon: '📈', label: 'Compound Interest Calculator' },
    { icon: '🏛️', label: 'NPS Calculator' },
    { icon: '💰', label: 'Mutual Fund Calculator' },
    { icon: '🏠', label: 'Home Loan EMI Calculator' },
  ]

  return (
    <div className="rounded-lg border border-slate2-border bg-white p-4 shadow-sm">
      <p className="text-[13px] font-bold text-navy mb-3">Calculators</p>
      <div className="space-y-2">
        {calculators.slice(0, expanded ? calculators.length : 3).map((calc, idx) => (
          <Link key={idx} to="#" className="flex items-center justify-between text-[12px] text-slate2-secondary hover:text-brand group">
            <span className="flex items-center gap-2">
              <span>{calc.icon}</span>
              <span>{calc.label}</span>
            </span>
            <span className="text-slate2-muted group-hover:text-brand transition-colors">›</span>
          </Link>
        ))}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-[12px] font-medium text-brand hover:underline"
      >
        <span className="text-lg">⊕</span>
        Show More Calculators
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING HELP BUTTON
   ═══════════════════════════════════════════════════════════════ */

function FloatingHelpButton() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3 md:bottom-24">
      {/* Help bubble */}
      <button
        onClick={() => {
          const widget = document.getElementById('query-helper')
          widget?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-white shadow-lg hover:bg-orange-600 transition-colors font-semibold text-[12px]"
      >
        <span>?</span>
        NEED HELP WITH TAX SAVINGS
      </button>

      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-brand text-brand shadow-lg hover:bg-brand hover:text-white transition-all"
        >
          ↑
        </button>
      )}
    </div>
  )
}
