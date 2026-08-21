import { useState } from 'react'
import { ChevronDown, Calculator } from 'lucide-react'
import Reveal from '../../hooks/useReveal.tsx'

/* ── Insurer logos (available in assets) ── */
import hdfcLogo from '../../assets/images/hdfc_logo.svg'
import iciciLogo from '../../assets/images/icici.png'
import tataaiaLogo from '../../assets/images/tataaia.png'
import kotakLogo from '../../assets/images/kotak.png'
import prameraLogo from '../../assets/images/pramera.png'
import licLogo from '../../assets/images/lic.png'

/* ── Types ── */
interface TaxPlan {
  id: number
  insurer: string
  planName: string
  taxSaving: string
  returns: string
  payout: string
  isPublic: boolean
  isFeatured: boolean
  logo?: string
}

/* ── Plan data (11 rows as specified) ── */
const TAX_PLANS: TaxPlan[] = [
  {
    id: 1,
    insurer: 'HDFC Life',
    planName: 'Click2Invest - Loyalty Plus - Classic',
    taxSaving: '13.0 L',
    returns: '13.9%',
    payout: '₹98.8 L',
    isPublic: false,
    isFeatured: false,
    logo: hdfcLogo,
  },
  {
    id: 2,
    insurer: 'Axis Max Life Insurance',
    planName: 'Online Savings Plan Plus',
    taxSaving: '25.7 L',
    returns: '19.8%',
    payout: '₹2.26 Cr',
    isPublic: false,
    isFeatured: false,
  },
  {
    id: 3,
    insurer: 'ICICI Prudential Life Insurance',
    planName: 'Signature',
    taxSaving: '32.1 L',
    returns: '21.2%',
    payout: '₹2.91 Cr',
    isPublic: false,
    isFeatured: true,
    logo: iciciLogo,
  },
  {
    id: 4,
    insurer: 'Tata AIA Life Insurance',
    planName: 'Smart SIP - Wealth Secure',
    taxSaving: '12.2 L',
    returns: '13.3%',
    payout: '₹90.8 L',
    isPublic: false,
    isFeatured: false,
    logo: tataaiaLogo,
  },
  {
    id: 5,
    insurer: 'Bajaj Life Insurance',
    planName: 'Smart Wealth Goal VII - WOP',
    taxSaving: '21.0 L',
    returns: '18%',
    payout: '₹1.79 Cr',
    isPublic: false,
    isFeatured: false,
  },
  {
    id: 6,
    insurer: 'Birla Sun Life Insurance',
    planName: 'Wealth Smart Plus',
    taxSaving: '15.4 L',
    returns: '15.44%',
    payout: '₹1.23 Cr',
    isPublic: false,
    isFeatured: false,
  },
  {
    id: 7,
    insurer: 'Kotak Mahindra Life Insurance',
    planName: 'E-Invest Plus',
    taxSaving: '12.6 L',
    returns: '13.55%',
    payout: '₹94.7 L',
    isPublic: false,
    isFeatured: false,
    logo: kotakLogo,
  },
  {
    id: 8,
    insurer: 'PNB MetLife India Insurance',
    planName: 'Smart Goal Ensuring Multiplier-Wealth',
    taxSaving: '14.4 L',
    returns: '14.99%',
    payout: '₹1.13 Cr',
    isPublic: false,
    isFeatured: false,
  },
  {
    id: 9,
    insurer: 'Canara HSBC Life Insurance',
    planName: 'Promise4Wealth - Maximiser',
    taxSaving: '17.3 L',
    returns: '16%',
    payout: '₹1.42 Cr',
    isPublic: false,
    isFeatured: false,
  },
  {
    id: 10,
    insurer: 'Pramerica Life Insurance',
    planName: 'Smart Invest 1 UP',
    taxSaving: '20.7 L',
    returns: '17.8%',
    payout: '₹1.76 Cr',
    isPublic: false,
    isFeatured: false,
    logo: prameraLogo,
  },
  {
    id: 11,
    insurer: 'LIC India',
    planName: 'Index Plus',
    taxSaving: '25.7 L',
    returns: '18.7%',
    payout: '₹2.26 Cr',
    isPublic: true,
    isFeatured: false,
    logo: licLogo,
  },
]

/* ── Tax slabs table data ── */
const TAX_SLABS = [
  { range: 'Up to ₹2,50,000', old: '0%', new: '0%' },
  { range: '₹2,50,001 – ₹4,00,000', old: '5%', new: '0%' },
  { range: '₹4,00,001 – ₹5,00,000', old: '5%', new: '5%' },
  { range: '₹5,00,001 – ₹8,00,000', old: '20%', new: '5%' },
  { range: '₹8,00,001 – ₹10,00,000', old: '20%', new: '10%' },
  { range: '₹10,00,001 – ₹12,00,000', old: '30%', new: '10%' },
  { range: '₹12,00,001 – ₹16,00,000', old: '30%', new: '15%' },
  { range: '₹16,00,001 – ₹20,00,000', old: '30%', new: '20%' },
  { range: '₹20,00,001 – ₹24,00,000', old: '30%', new: '25%' },
  { range: 'Above ₹24,00,000', old: '30%', new: '30%' },
]

/* ── Helper: get initials for placeholder logo ── */
function getInitials(name: string): string {
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/* ── Helper: SectionHeading ── */
function SectionHeading({ title, accent = 'orange' }: { title: string; accent?: 'orange' | 'blue' }) {
  const accentClass = accent === 'blue' ? 'bg-brand' : 'bg-orange-tag'
  return (
    <div className="mb-6">
      <h2 className="text-[22px] font-bold text-navy md:text-[24px]">{title}</h2>
      <span className={`mt-2 block h-1 w-12 rounded-full ${accentClass}`} />
    </div>
  )
}

/* ── InsurerLogo: real image or initials placeholder ── */
function InsurerLogo({ insurer, logo }: { insurer: string; logo?: string }) {
  if (logo) {
    return <img src={logo} alt={insurer} className="h-8 w-auto object-contain" />
  }
  const initials = getInitials(insurer)
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-navy">
      {initials}
    </div>
  )
}

/* ═══════════════ TaxPlanCard ── used in TopTaxSavingPlans ═══════════════ */
function TaxPlanCard({ plan }: { plan: TaxPlan }) {
  const cardClass = plan.isFeatured
    ? 'bg-gradient-to-br from-[#E0F2FE] to-[#FFE0CC]'
    : 'bg-white'

  return (
    <div
      className={`relative rounded-xl border border-slate2-border p-4 shadow-sm ${cardClass}`}
    >
      {/* Top badges */}
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-pink-100/50 px-2 py-0.5 text-[10px] font-bold text-pink-700">
          Tax Saving {plan.taxSaving}
        </span>
        <span className="rounded-full bg-slate2-muted/30 px-2 py-0.5 text-[10px] font-medium text-slate2-secondary">
          {plan.isPublic ? 'Public Insurer' : 'Private Insurer'}
        </span>
      </div>

      {/* Logo + Plan name */}
      <div className="mb-4 flex items-center gap-2">
        <InsurerLogo insurer={plan.insurer} logo={plan.logo} />
        <span className="text-[13px] font-semibold text-navy">{plan.planName}</span>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-slate2-muted">10 Yr Returns</p>
          <p className="text-[16px] font-bold text-green-cta">{plan.returns}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate2-muted">Lump sum Payout</p>
          <p className="text-[16px] font-bold text-brand">{plan.payout}</p>
          <p className="text-[10px] text-slate2-muted">If you had invested 20 Yrs ago</p>
        </div>
      </div>

      {/* Know More button */}
      <div className="flex justify-end">
        <button
          aria-label={`Know More about ${plan.planName}`}
          className="rounded-lg bg-brand px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Know More {' >'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════ Section 2.2: Top Tax Saving Plans ═══════════════ */
export function TopTaxSavingPlans() {
  const [showAll, setShowAll] = useState(false)
  const visiblePlans = TAX_PLANS.slice(0, 5)
  const hiddenPlans = TAX_PLANS.slice(5)

  return (
    <section className="mb-10">
      <Reveal>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-[22px] font-bold text-navy md:text-[24px]">
            Top Tax Saving Plans 2026<span className="text-xs align-super">˜</span>
          </h2>
          <span className="h-1 w-12 rounded-full bg-orange-tag" />
        </div>
      </Reveal>

      {/* Recap sub-row */}
      <Reveal delay={0.05}>
        <div className="mt-4 flex flex-wrap gap-4 border-b border-slate2-border pb-3 text-[12px] text-slate2-secondary">
          <span>
            You Invest: <span className="font-semibold text-navy">₹150,000/year</span>
          </span>
          <span>
            Invest For: <span className="font-semibold text-navy">10 Years</span>
          </span>
          <span>
            Age: <span className="font-semibold text-navy">30 Year</span>
          </span>
        </div>
      </Reveal>

      {/* Plan cards */}
      <Reveal delay={0.1}>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visiblePlans.map((plan) => (
            <TaxPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Reveal>

      {/* View More Plans button */}
      <Reveal delay={0.15}>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
            className="flex items-center gap-1 rounded-full border border-slate2-border bg-white px-4 py-1.5 text-[11px] font-medium text-navy shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            View More Plans
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </Reveal>

      {/* Hidden plans (expandable) */}
      <div className={`expandable overflow-hidden transition-all duration-300 ${showAll ? 'open' : ''}`}>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hiddenPlans.map((plan) => (
            <TaxPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ Section 2.9: What is an Income Tax Calculator? ═══════════════ */
export function WhatIsIncomeTaxCalculator() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="What is an Income Tax Calculator?" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="text-[14px] leading-relaxed text-slate2-secondary">
          An Income Tax Calculator is an online tool that calculates your total tax payable based on:
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <ul className="mt-3 space-y-1 text-[14px] text-slate2-secondary">
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Your annual income
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Eligible deductions and exemptions
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Applicable tax slabs
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Chosen{' '}
            <a href="#" className="text-brand font-medium hover:underline">
              new vs old tax regime
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-4 text-[14px] leading-relaxed text-slate2-secondary">
          It gives you a clear picture of how much tax you need to pay or how much you can save with better planning. An income tax calculator is a must-use financial tool for salaried employees, freelancers, business owners, and investors alike.
        </p>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.10: Union Budget 2026 Highlights ═══════════════ */
export function UnionBudgetHighlights() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="Union Budget 2026 Highlights on Tax Rules in India" />
      </Reveal>

      <Reveal delay={0.05}>
        <ul className="space-y-2 text-[14px] text-slate2-secondary">
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            The Income Tax Slabs remain unchanged from the previous year.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            A new Income Tax Act is set to take effect from April 1, 2026, promising simplified rules.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            The government continues to support both the Old Tax Regime and the New Tax Regime, with taxpayers free to choose whichever benefits them.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Around 88% of taxpayers have moved to the new tax regime, showing its growing popularity.
          </li>
        </ul>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.11: How to Use AV Management's Income Tax Calculator ═══════════════ */
export function HowToUseAVManagement() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="How to Use AV Management's Income Tax Calculator?" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mb-4 text-[14px] leading-relaxed text-slate2-secondary">
          You can use AV Management's Income Tax Calculator to quickly check your tax under both the old and new tax regimes, as per the Union Budget 2026. Follow these simple steps:
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <ol className="space-y-3 text-[14px] text-slate2-secondary">
          <li>
            <span className="font-bold text-navy">Enter your total annual income:</span> Enter your total yearly income in Indian Rupees (₹). Include income from salary, interest, rental income, dividends, and any other sources.
          </li>
          <li>
            <span className="font-bold text-navy">Enter your deductions and exemptions:</span> Add the deductions and exemptions you are eligible for, excluding the standard deduction. These may include benefits under Sections{' '}
            <a href="#" className="text-brand font-medium hover:underline">80C</a>,{' '}
            <a href="#" className="text-brand font-medium hover:underline">80CCD</a>,{' '}
            <a href="#" className="text-brand font-medium hover:underline">80D</a>,{' '}
            <a href="#" className="text-brand font-medium hover:underline">80TTA</a>,{' '}
            <a href="#" className="text-brand font-medium hover:underline">10(10D)</a>,{' '}
            <a href="#" className="text-brand font-medium hover:underline">80G</a>, and{' '}
            <a href="#" className="text-brand font-medium hover:underline">80E</a>.
          </li>
          <li>
            <span className="font-bold text-navy">Apply the standard deduction:</span> If you are a salaried individual, the calculator applies the standard deduction under Section 16 of the Income Tax Act, 1961, as applicable under Budget 2026 provisions.
          </li>
          <li>
            <span className="font-bold text-navy">Calculate your tax:</span> Click the "CALCULATE" button. The calculator shows your tax liability under both the old and new tax regimes, helping you compare them easily.
          </li>
          <li>
            <span className="font-bold text-navy">Unlock the detailed tax summary:</span> Enter your basic contact details and click "Unlock." You will see a detailed tax breakup for both tax regimes, calculated as per the latest rules announced in the Union Budget 2026.
          </li>
        </ol>
      </Reveal>

      {/* Inline promo card */}
      <Reveal delay={0.1}>
        <div className="mt-6 rounded-xl border border-slate2-border bg-white p-4 md:flex md:items-center md:gap-4">
          <div className="mb-3 shrink-0 md:mb-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blueBG">
              <Calculator size={24} className="text-brand" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-navy">Tax-Free Maturity and High Returns!</h4>
            <p className="text-[12px] text-slate2-secondary">Save on taxes & secure your financial future.</p>
          </div>
          <div className="mt-2 shrink-0 md:mt-0">
            <button
              aria-label="View plans"
              className="rounded-lg bg-brand px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              View plans
            </button>
          </div>
          <p className="mt-2 text-[9px] text-slate2-muted md:col-span-3 md:mt-0">T&C Apply*</p>
        </div>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.12: Why to Use an Income Tax Calculator Online? ═══════════════ */
export function WhyUseOnlineCalculator() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="Why to Use an Income Tax Calculator Online?" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mb-4 text-[14px] leading-relaxed text-slate2-secondary">
          Key benefits of using an online income tax calculator include:
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <ul className="space-y-3 text-[14px] text-slate2-secondary">
          <li>
            <span className="font-bold text-navy">Estimate Your Tax Quickly:</span> Instead of manually applying slab rates and deductions, calculators do it in seconds.
          </li>
          <li>
            <span className="font-bold text-navy">Compare Tax Regimes:</span> See which regime, among old or new tax regimes, gives you the best outcome.
          </li>
          <li>
            <span className="font-bold text-navy">Plan Deductions Smartly:</span> Know how much more saving you can achieve with additional investment.
          </li>
          <li>
            <span className="font-bold text-navy">Avoid Errors:</span> Human errors in manual calculation can lead to under-estimation or penalties.
          </li>
        </ul>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.13: How to Use an Income Tax Calculator Effectively? ═══════════════ */
export function HowToUseEffectively() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="How to Use an Income Tax Calculator Effectively?" />
      </Reveal>

      <Reveal delay={0.05}>
        <ul className="space-y-2 text-[14px] text-slate2-secondary">
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Always compare the results of both regimes before choosing.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            If your total deductions are high, the old regime can save more.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            If you prefer simplicity and fewer exemptions, the new regime may be better.
          </li>
          <li className="flex items-baseline gap-2">
            <span className="w-2 shrink-0">•</span>
            Update input data yearly along with tax laws and slabs change.
          </li>
        </ul>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.14: Smart Tips to Save More Tax ═══════════════ */
export function SmartTipsToSave() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="Smart Tips to Save More Tax" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mb-4 text-[14px] leading-relaxed text-slate2-secondary">
          The use of an income tax calculator helps you know your tax liability, but choosing the right tax-saving strategy can save you thousands more. Here are some expert-level tips:
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <ol className="space-y-3 text-[14px] text-slate2-secondary">
          <li>
            <span className="font-bold text-navy">1.</span> Combine the calculator with investment planning (like NPS, ELSS)
          </li>
          <li>
            <span className="font-bold text-navy">2.</span> Run scenario planning for different deduction inputs
          </li>
          <li>
            <span className="font-bold text-navy">3.</span> Compare how changing jobs or salary components affects taxes
          </li>
          <li>
            <span className="font-bold text-navy">4.</span> Use the calculator early in the year and not just before filing.
          </li>
        </ol>
      </Reveal>
    </section>
  )
}

/* ═══════════════ Section 2.15: Income Tax Slabs ═══════════════ */
export function IncomeTaxSlabs() {
  return (
    <section className="mb-10">
      <Reveal>
        <SectionHeading title="Income Tax Slabs for FY 2025-26 and FY 2026-27" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mb-4 text-[14px] leading-relaxed text-slate2-secondary">
          The tax slabs for the Financial Year (FY) 2026-27 (Assessment Year 2027-28) remain unchanged after Budget 2026. Individuals can continue to choose between the Old Tax Regime and the New Tax Regime.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border border-slate2-border text-[13px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-slate2-border px-4 py-3 text-left font-bold text-navy">
                  Annual Income (₹)
                </th>
                <th className="border border-slate2-border px-4 py-3 text-left font-bold text-navy">
                  Tax Rate - Old Regime (For FY 2025-26 & FY 2026-27)
                </th>
                <th className="border border-slate2-border px-4 py-3 text-left font-bold text-navy">
                  Tax Rate - New Regime (For FY 2025-26 & FY 2026-27)
                </th>
              </tr>
            </thead>
            <tbody>
              {TAX_SLABS.map((slab, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/30' : ''}>
                  <td className="border border-slate2-border px-4 py-3 text-navy">{slab.range}</td>
                  <td className="border border-slate2-border px-4 py-3 text-center">{slab.old}</td>
                  <td className="border border-slate2-border px-4 py-3 text-center">{slab.new}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-3 text-[11px] italic text-slate2-muted">
          *The tax slab rates vary for senior citizens (60-80 age) and super-senior (&ge;80 age) in the old tax regime.
        </p>
      </Reveal>

      {/* Mobile-only banner */}
      <Reveal delay={0.1}>
        <div className="mt-4 lg:hidden">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#FDE6F3] to-[#E0F7FE] p-3">
            <Calculator size={20} className="text-brand" />
            <span className="text-[11px] font-medium text-navy">
              Invest & Save upto ₹46,800 per annum in tax
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
