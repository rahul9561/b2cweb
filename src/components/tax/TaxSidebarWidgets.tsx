import { useState } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  FileText,
  User,
  PlusCircle,
  Calculator,
  TrendingUp,
  Landmark,
} from 'lucide-react'

/* ── Reusable: Link list for sidebar widgets ── */
function SidebarLinkList({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="mb-4 rounded-xl border border-slate2-border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-[14px] font-semibold text-navy">{title}</h3>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="flex items-center justify-between py-2 text-[12px] text-slate2-secondary transition-colors hover:bg-blueBG hover:text-brand"
            >
              <span>{l}</span>
              <ChevronRight size={12} className="shrink-0 text-slate2-muted" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ═══════════════ Widget 1: Maximise your Tax Savings ═══════════════ */
export function TaxMaximiseWidget() {
  return (
    <div className="relative rounded-xl border border-slate2-border bg-white p-5 shadow-sm">
      {/* Decorative top-right illustration */}
      <div className="pointer-events-none absolute top-2 right-2 flex gap-1 opacity-30">
        <Sparkles size={14} className="text-yellow" />
        <Sparkles size={10} className="text-green-cta" />
      </div>

      <h3 className="text-[15px] font-semibold text-navy">
        Maximise your <span className="text-brand">Tax Savings!</span>
      </h3>

      <ul className="mt-3 space-y-2.5">
        {[
          'Tax savings under Sec 80c',
          'Get Instant Tax receipt',
          'Tax free returns upto 18%',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" />
            <span className="text-[12px] text-slate2-secondary">{item}</span>
          </li>
        ))}
      </ul>

      <button
        aria-label="View Plans"
        className="mt-4 w-full rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        VIEW PLANS
      </button>

      <p className="mt-2 text-center text-[10px] text-slate2-muted">
        Standard T & C Apply*
      </p>
    </div>
  )
}

/* ═══════════════ Widget 2: DOUBLE TAX BENEFIT ═══════════════ */
export function DoubleTaxBenefitWidget() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F1B33] via-[#1A2233] to-[#0F1B33] p-5 text-white shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-2 top-2 opacity-20">
          <FileText size={40} />
        </div>
        <div className="absolute -right-4 -bottom-4 flex gap-1 opacity-30">
          <User size={20} className="text-yellow" />
          <User size={20} className="text-yellow" />
        </div>
      </div>

      <h3 className="relative text-[17px] font-bold text-white">
        DOUBLE TAX BENEFIT
      </h3>
      <p className="relative mt-2 text-[11px] text-white/70">
        save tax upto <span className="text-yellow font-bold">₹46,800</span> under sec 80C &
      </p>
      <p className="relative text-[13px] font-bold text-yellow">INSTANT TAX RECEIPT</p>
      <p className="relative mt-1 text-[10px] text-white/60">
        no tax on maturity under sec 10 (10 d)
      </p>

      <p className="relative mt-6 text-[9px] text-white/40">GN/ADV/0165/Sep/26/23/28-21</p>
    </div>
  )
}

/* ═══════════════ Widget 3: INSTANT TAX RECEIPT ═══════════════ */
export function InstantTaxReceiptWidget() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-brand p-5 text-white shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-2 top-2 flex gap-1 opacity-30">
          <Sparkles size={16} className="text-yellow" />
          <Sparkles size={12} className="text-white" />
        </div>
        <FileText size={36} className="absolute -right-4 bottom-0 opacity-20" />
      </div>

      <h3 className="text-[17px] font-bold">INSTANT TAX RECEIPT</h3>

      <button
        aria-label="KNOW MORE"
        className="mt-3 rounded-full border-2 border-white px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-white hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        KNOW MORE
      </button>
    </div>
  )
}

/* ═══════════════ Widget 4: Income Tax Returns & eFiling ═══════════════ */
const ITR_LINKS = [
  'Income Tax Return Filing',
  'Income Tax Refund Status: Check ITR Refund',
  'Income Tax Return Form: How to download ITR Forms',
  'How to Check ITR-V Receipt Status?',
  'Income Tax Filing For the Freelancers',
  'Income Tax Form 16',
  'Income Tax for NRI in India',
]
export function IncomeTaxReturnsWidget() {
  return <SidebarLinkList title="Income Tax Returns & eFiling" links={ITR_LINKS} />
}

/* ═══════════════ Widget 5: AXE YOUR TAX ═══════════════ */
export function AxeYourTaxWidget() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6A00] via-[#fa6541] to-[#FF6A00] p-5 text-white shadow-sm">
      <h3 className="text-[19px] font-bold">AXE YOUR TAX</h3>
      <p className="mt-2 text-[12px] font-bold">
        Upto <span className="text-yellow">46,800</span> under Sec 80C &
      </p>
      <p className="text-[13px] font-bold">
        <span className="text-yellow">PAY ZERO TAX</span>
      </p>
      <p className="mt-1 text-[11px]">On Maturity unlike mutual funds</p>

      <div className="mt-4 flex items-center justify-end">
        <button
          aria-label="Know More"
          className="rounded-full bg-brand px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Know More
        </button>
      </div>

      <p className="mt-3 text-[8px] text-white/40">GN/ADV/0165/Sep/23/28-21</p>
      <p className="mt-1 text-[8px] text-white/40">Standard T&C Apply*</p>
    </div>
  )
}

/* ═══════════════ Widget 6: Tax Saving via NPS, ELSS, PPF, MFs ═══════════════ */
const TAX_SAVING_LINKS = [
  'Tax Saving Investments',
  'NPS Calculator',
  'How to Open NPS Account Online',
  'Equity Linked Savings Scheme Funds 2026',
  'Steps to Invest in ELSS Funds',
  'PPF Calculator',
  'PPF Interest Rate 2026 - All You Need to Know',
  'PPF or Public Provident Fund Account: A Complete Guide',
]
export function TaxSavingLinksWidget() {
  return <SidebarLinkList title="Tax Saving via NPS, ELSS, PPF, MFs" links={TAX_SAVING_LINKS} />
}

/* ═══════════════ Widget 7: Income Tax Section 80 & HRA ═══════════════ */
const SECTION_80_HRA_LINKS = [
  'Section 80C',
  'Income Tax Deductions',
  'Section 80D',
  'Section 80U',
  'Income Tax Rebate in India',
  'Income Tax Exemptions',
  'HRA Calculator',
  'House Rent Allowance',
]
export function Section80HraWidget() {
  return <SidebarLinkList title="Income Tax Section 80 & HRA" links={SECTION_80_HRA_LINKS} />
}

/* ═══════════════ Widget 8: Tax Slab Rates & Saving Tips ═══════════════ */
const TAX_SLAB_LINKS = [
  'Tax Saving - How to Save Income Tax For FY 2026-2027',
  'How to Pay Income Tax Online in India 2026',
  'Income Tax Slab Rates for FY 2026-2027 (AY 2027-2028)',
  'Advance Tax Payment',
  'How to Save Tax on Salary?',
]
export function TaxSlabTipsWidget() {
  return <SidebarLinkList title="Tax Slab Rates & Saving Tips" links={TAX_SLAB_LINKS} />
}

/* ═══════════════ Widget 9: Got a query about investment? (Ask-AV wizard) ═══════════════ */
type QueryType = 'buying' | 'existing'

export function AskAvWidget() {
  const [step, setStep] = useState(0)
  const [queryType, setQueryType] = useState<QueryType>('buying')
  const [concern, setConcern] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  return (
    <div className="rounded-xl border border-slate2-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
          AV
        </div>
        <h3 className="text-[14px] font-semibold text-navy">
          Got a query about investment?
        </h3>
      </div>

      <p className="text-[11px] text-slate2-secondary">
        Simply ask us and we will find the best solution to your problem
      </p>

      {step === 0 && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-[11px] font-medium text-navy">Select query type</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[12px] text-navy">
                <input
                  type="radio"
                  name="queryType"
                  checked={queryType === 'buying'}
                  onChange={() => setQueryType('buying')}
                  className="accent-brand"
                />
                Buying a new Policy
              </label>
              <label className="flex items-center gap-2 text-[12px] text-navy">
                <input
                  type="radio"
                  name="queryType"
                  checked={queryType === 'existing'}
                  onChange={() => setQueryType('existing')}
                  className="accent-brand"
                />
                Need help with Existing Policy
              </label>
            </div>
          </div>

          <div>
            <select
              aria-label="What do you need help with?"
              className="w-full appearance-none rounded-lg border border-slate2-border bg-gray-50 px-3 py-2 text-[12px] text-slate2-secondary focus:border-brand focus:ring-2 focus:ring-brand/10"
            >
              <option>What do you need help with?</option>
              <option>Tax Planning</option>
              <option>Investment Advice</option>
              <option>Insurance Claim</option>
            </select>
          </div>

          <div>
            <textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="Explain your concern in detail"
              rows={3}
              className="w-full resize-y rounded-lg border border-slate2-border bg-gray-50 px-3 py-2 text-[12px] text-navy placeholder:text-slate2-muted focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-navy">Name</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate2-border bg-gray-50 px-3 py-2">
              <User size={14} className="text-slate2-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full text-[12px] text-navy outline-none placeholder:text-slate2-muted"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-navy">Mobile Number</label>
            <div className="flex items-center gap-1 rounded-lg border border-slate2-border bg-gray-50 px-3 py-2">
              <span className="text-[12px] font-medium text-navy">India</span>
              <ChevronDown size={12} className="text-slate2-muted" />
              <span className="text-[12px] text-slate2-muted">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="78xxxxx007"
                className="w-full text-[12px] text-navy outline-none placeholder:text-slate2-muted"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="flex-1 rounded-lg border border-slate2-border py-2.5 text-[12px] font-medium text-slate2-secondary hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-cta/10">
            <CheckCircle2 size={28} className="text-green-cta" />
          </div>
          <h4 className="mt-3 text-[15px] font-bold text-navy">Thank You!</h4>
          <p className="mt-2 text-[12px] text-slate2-secondary">
            Your query has been submitted. Our expert will contact you shortly.
          </p>
          <button
            onClick={() => setStep(0)}
            className="mt-4 w-full rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Submit Another Query
          </button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════ Widget 10: Calculators ═══════════════ */
const VISIBLE_CALCULATORS = [
  { label: 'SIP Calculator', icon: 'calculator', color: 'bg-brand', link: '/sip-calculator' },
  { label: 'Compound Interest Calculator', icon: 'trending', color: 'bg-green-cta', link: '#' },
  { label: 'NPS Calculator', icon: 'landmark', color: 'bg-purple2', link: '#' },
]
const EXTRA_CALCULATORS = [
  'EMI Calculator',
  'Tax Calculator',
  'Retirement Calculator',
  'Medical Insurance Calculator',
  'Term Insurance Calculator',
]

export function CalculatorsWidget() {
  const [showMore, setShowMore] = useState(false)

  const renderIcon = (iconType: string, colorClass: string) => {
    const iconSize = 14
    const common = 'text-white'
    switch (iconType) {
      case 'calculator':
        return (
          <span className={`flex h-7 w-7 items-center justify-center rounded ${colorClass} ${common}`}>
            <Calculator size={iconSize} />
          </span>
        )
      case 'trending':
        return (
          <span className={`flex h-7 w-7 items-center justify-center rounded ${colorClass} ${common}`}>
            <TrendingUp size={iconSize} />
          </span>
        )
      case 'landmark':
        return (
          <span className={`flex h-7 w-7 items-center justify-center rounded ${colorClass} ${common}`}>
            <Landmark size={iconSize} />
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-xl border border-slate2-border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-[14px] font-semibold text-navy">Calculators</h3>
      <ul className="space-y-1">
        {VISIBLE_CALCULATORS.map((c) => (
          <li key={c.label}>
            <a
              href={c.link}
              className="flex items-center gap-2 py-2 text-[12px] text-slate2-secondary transition-colors hover:bg-blueBG hover:text-brand"
            >
              {renderIcon(c.icon, c.color)}
              <span>{c.label}</span>
              <ChevronRight size={12} className="ml-auto text-slate2-muted" />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-1">
        <button
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
          className="flex w-full items-center justify-center gap-1 py-2 text-[11px] font-medium text-slate2-secondary hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <PlusCircle size={14} />
          Show More Calculator
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`expandable overflow-hidden transition-all duration-300 ${showMore ? 'open' : ''}`}
        >
          <ul className="pt-1 space-y-1">
            {EXTRA_CALCULATORS.map((c) => (
              <li key={c}>
                <a
                  href="#"
                  className="flex items-center gap-2 py-2 text-[12px] text-slate2-secondary transition-colors hover:bg-blueBG hover:text-brand"
                >
                  <ChevronRight size={12} className="text-slate2-muted" />
                  <span>{c}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
