import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pencil,
  Play,
  Clock,
  IndianRupee,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  GraduationCap,
  Wallet,
  Baby,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Calculator,
  Percent,
  Scale,
  PieChart,
  ExternalLink,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import hdfcLogo from '../../assets/images/hdfc_logo.svg'
import growwLogo from '../../assets/images/groww_logo.png'

/* ── Section heading helper ── */
function SectionHeading({ title, align = 'left' }: { title: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <h2 className="text-[22px] font-bold text-navy md:text-[24px]">{title}</h2>
      <span
        className={`mt-2 block h-1 w-12 rounded-full bg-orange-tag ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  )
}

/* ═══════════════ 2.1 Best Mutual Funds ═══════════════ */
interface Fund {
  name: string
  logo: string
  fiveYear: string
  sevenYear: string
  tenYear: string
  aum: string
  expense: string
  nav: string
  maturity: string
}

const fundTabs = ['Flexi Cap Funds', 'Large Cap Funds', 'Mid Cap Funds', 'Small Cap Funds', 'Debt Funds']
const returnTabs = ['5 years', '7 years', '10 years']

const fundsData: Fund[] = [
  {
    name: 'HDFC Flexi Cap Fund - Direct Plan',
    logo: hdfcLogo,
    fiveYear: '18.73%',
    sevenYear: '16.42%',
    tenYear: '15.38%',
    aum: '₹106,495.63',
    expense: '0.74%',
    nav: '₹2,305.46',
    maturity: '₹9.57 L',
  },
  {
    name: 'JM Flexicap Fund - Direct Plan',
    logo: growwLogo,
    fiveYear: '17.37%',
    sevenYear: '15.21%',
    tenYear: '14.02%',
    aum: '₹52,871.90',
    expense: '0.62%',
    nav: '₹1,847.32',
    maturity: '₹9.26 L',
  },
  {
    name: 'Parag Parikh Flexi Cap Fund - Direct Plan',
    logo: hdfcLogo,
    fiveYear: '21.45%',
    sevenYear: '18.93%',
    tenYear: '17.65%',
    aum: '₹78,324.55',
    expense: '0.49%',
    nav: '₹1,156.87',
    maturity: '₹10.84 L',
  },
  {
    name: 'Quant Flexi Cap Fund - Direct Plan',
    logo: hdfcLogo,
    fiveYear: '25.18%',
    sevenYear: '22.04%',
    tenYear: '19.87%',
    aum: '₹45,210.33',
    expense: '0.55%',
    nav: '₹987.65',
    maturity: '₹12.35 L',
  },
]

export function BestMutualFunds() {
  const [activeTab, setActiveTab] = useState('Flexi Cap Funds')
  const [returnTab, setReturnTab] = useState('5 years')
  const [paymentMode, setPaymentMode] = useState('Yearly SIP')
  const [investAmount, setInvestAmount] = useState('₹10,000')
  const [investYears, setInvestYears] = useState('5 Years')
  const [visibleCount, setVisibleCount] = useState(2)

  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <SectionHeading title="Best Mutual Funds" />

        <div className="mt-6 rounded-xl bg-green-cta/5 p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              className="group flex items-center gap-2 text-[12px] text-slate2-secondary hover:text-brand"
              onClick={() => setPaymentMode(paymentMode === 'Yearly SIP' ? 'Monthly SIP' : 'Yearly SIP')}
            >
              <span className="font-medium">Payment Mode:</span>
              <span className="font-bold text-navy">{paymentMode}</span>
              <Pencil size={12} className="text-slate2-muted transition-colors group-hover:text-brand" />
            </button>
            <button
              className="group flex items-center gap-2 text-[12px] text-slate2-secondary hover:text-brand"
              onClick={() => setInvestAmount(investAmount === '₹10,000' ? '₹15,000' : '₹10,000')}
            >
              <span className="font-medium">Invest:</span>
              <span className="font-bold text-navy">{investAmount}</span>
              <Pencil size={12} className="text-slate2-muted transition-colors group-hover:text-brand" />
            </button>
            <button
              className="group flex items-center gap-2 text-[12px] text-slate2-secondary hover:text-brand"
              onClick={() => setInvestYears(investYears === '5 Years' ? '10 Years' : '5 Years')}
            >
              <span className="font-medium">Invest for:</span>
              <span className="font-bold text-navy">{investYears}</span>
              <Pencil size={12} className="text-slate2-muted transition-colors group-hover:text-brand" />
            </button>
          </div>
        </div>

        <div className="scrollbar-hide mt-6 flex gap-2 overflow-x-auto pb-1">
          {fundTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${
                activeTab === t
                  ? 'bg-brand text-white'
                  : 'border border-slate2-border bg-white text-slate2-secondary hover:border-brand hover:text-brand'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-1 border-b border-slate2-border">
          {returnTabs.map((t) => (
            <button
              key={t}
              onClick={() => setReturnTab(t)}
              className={`border-b-2 px-4 py-2 text-[12px] font-medium transition-colors ${
                returnTab === t
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate2-secondary hover:text-navy'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {fundsData.slice(0, visibleCount).map((fund) => {
            const returnValue =
              returnTab === '5 years' ? fund.fiveYear : returnTab === '7 years' ? fund.sevenYear : fund.tenYear
            return (
              <div
                key={fund.name}
                className="flex flex-col gap-4 rounded-xl border border-slate2-border p-4 transition-shadow hover:shadow-md md:flex-row md:items-center"
              >
                <div className="flex flex-1 items-center gap-3">
                  <img src={fund.logo} alt={fund.name} className="h-10 w-10 shrink-0 rounded-full border border-slate2-border object-contain" />
                  <div>
                    <Link to="#" className="text-[13px] font-semibold text-navy hover:text-brand">
                      {fund.name}
                    </Link>
                    <p className="text-[11px] text-slate2-muted">Direct Plan • Growth</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
                  <div>
                    <p className="text-[10px] text-slate2-muted">{returnTab} return</p>
                    <p className="text-[13px] font-bold text-green-cta">{returnValue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate2-muted">AUM (Cr)</p>
                    <p className="text-[13px] font-semibold text-navy">{fund.aum}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate2-muted">Expense ratio</p>
                    <p className="text-[13px] font-semibold text-navy">{fund.expense}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate2-muted">Current NAV</p>
                    <p className="text-[13px] font-semibold text-navy">{fund.nav}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-cta/10 px-3 py-2 text-center">
                    <p className="text-[10px] text-slate2-muted">Maturity Value</p>
                    <p className="text-[15px] font-bold text-green-cta">{fund.maturity}</p>
                  </div>
                  <button className="rounded-lg bg-brand px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-brand-dark">
                    Compare Funds
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {visibleCount < fundsData.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount(fundsData.length)}
              className="rounded-full border border-brand px-8 py-2.5 text-[12px] font-medium text-brand transition-colors hover:bg-brand hover:text-white"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ═══════════════ 2.2 Increase Your SIP Wealth ═══════════════ */
const wealthCards = [
  { term: '15 Years', totalInvestment: '₹18 Lakh', wealth: '₹47.6 Lakh' },
  { term: '20 Years', totalInvestment: '₹24 Lakh', wealth: '₹92 Lakh' },
  { term: '25 Years', totalInvestment: '₹30 Lakh', wealth: '₹1.7 Crore' },
]

export function IncreaseSipWealth() {
  return (
    <section className="bg-orange-tagBg/50 py-14">
      <div className="container-pb">
        <SectionHeading title="Increase Your SIP Wealth" align="center" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-6 text-slate2-secondary">
          See how increasing your contribution by just ₹5,000 and staying invested for 5 extra
          years can more than triple your final wealth.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] font-medium text-navy">
            MONTHLY SIP <strong className="text-brand">₹10,000</strong>
          </span>
          <span className="rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] font-medium text-navy">
            RATE OF RETURN <strong className="text-brand">12% p.a.</strong>
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {wealthCards.map((c) => (
            <div
              key={c.term}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-6">
                <p className="text-[11px] font-medium tracking-wide text-slate2-muted">INVESTMENT TERM</p>
                <p className="mt-1 text-[20px] font-bold text-navy">{c.term}</p>
                <div className="mt-3 border-t border-slate2-border pt-3">
                  <p className="text-[11px] text-slate2-muted">TOTAL INVESTMENT</p>
                  <p className="text-[15px] font-semibold text-navy">{c.totalInvestment}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-green-cta px-6 py-4 text-white">
                <div>
                  <p className="text-[10px] text-white/80">Estimated Wealth Created</p>
                  <p className="text-[18px] font-bold">{c.wealth}</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-cta">
                  <TrendingUp size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ 2.3 What is an SIP Calculator? ═══════════════ */
export function WhatIsSipCalculator() {
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <section className="bg-white py-14">
      <div className="container-pb grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-[22px] font-bold text-navy md:text-[24px]">What is an SIP Calculator?</h2>
          <span className="mt-2 block h-1 w-12 rounded-full bg-orange-tag" />
          <p className="mt-5 text-[13px] leading-6 text-slate2-secondary">
            An SIP calculator is a financial tool for estimating the returns you can get by
            investing in mutual funds. It helps in multiple ways, including providing accurate
            calculations, selecting the most suitable plan, and empowering you to achieve
            financial independence as an investor.
          </p>
          <p className="mt-4 text-[13px] leading-6 text-slate2-secondary">
            By using an SIP calculator, you can choose which are the best{' '}
            <Link to="#" className="font-medium text-brand underline">SIP plans</Link>{' '}
            for your short- or long-term goals. With numerous options available in the market,
            making informed decisions ensures you maximize the benefits of your investments.
          </p>
        </div>

        <div className="relative">
          {videoPlaying ? (
            <div className="aspect-video overflow-hidden rounded-xl border-2 border-brand">
              <iframe
                src="https://www.youtube.com/embed/PzWpBqOp1KU?autoplay=1"
                title="SIP Calculator: Calculate Your Wealth Growth Easily!"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              onClick={() => setVideoPlaying(true)}
              className="group relative block w-full overflow-hidden rounded-xl border-2 border-brand"
              aria-label="Play video"
            >
              <div className="aspect-video w-full bg-gradient-to-br from-brand to-brand-dark" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110">
                  <Play size={24} className="ml-1 text-brand" fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 rounded-md bg-yellow px-2 py-1 text-[10px] font-bold tracking-wide text-navy">
                SIP CALCULATOR
              </span>
            </button>
          )}
         <p className="mt-3 text-center text-[12px] font-medium text-slate2-secondary">
            SIP Calculator: Calculate Your Wealth Growth Easily!
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ 2.4 How Does the Mutual Fund SIP Calculator Work? ═══════════════ */
function FormulaChip({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple2 text-[13px] font-bold text-white">
        {label}
      </span>
      <p className="text-[12px] text-slate2-secondary">{desc}</p>
    </div>
  )
}

export function HowSipCalculatorWorks() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="container-pb">
        <SectionHeading title="How Does the Mutual Fund SIP Calculator Work?" align="center" />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Formula card */}
          <div className="rounded-xl border border-slate2-border bg-white p-6">
            <p className="text-[13px] leading-6 text-slate2-secondary">
              The SIP mutual fund calculator works on the basis of the following formula:
            </p>
            <div className="mt-4 rounded-lg bg-orange-tagBg px-4 py-3 text-center font-mono text-[15px] font-bold text-navy">
              M = P × ( ( [1 + i]<sup>n</sup> − 1 ) / i ) × (1 + i)
            </div>
            <p className="mt-5 text-[12px] font-semibold text-navy">
              Terms used in Mutual Fund SIP Calculator formula:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormulaChip label="P" desc="Amount invested at regular intervals" />
              <FormulaChip label="M" desc="Sum you will get upon maturity" />
              <FormulaChip label="n" desc="Number of times payments made" />
              <FormulaChip label="i" desc="Interest rate" />
            </div>
          </div>

          {/* Worked example */}
          <div className="rounded-xl border border-slate2-border bg-blueBG p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] leading-6 text-slate2-secondary">
                Rohit, a young professional, wants to invest <strong>₹10,000</strong> monthly for{' '}
                <strong>30 years</strong> at a <strong>12%</strong> interest rate. The monthly
                interest rate is calculated as <strong>12% / 12 = 1%</strong> or{' '}
                <strong>0.01</strong> in decimal.
              </p>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">
                R
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <FormulaChip label="P" desc="is the monthly investment amount (₹10,000)" />
              <FormulaChip
                label="n"
                desc="is the total number of payments (30 years * 12 months/year = 360 months)"
              />
              <FormulaChip
                label="i"
                desc="is the periodic interest rate (12% per year, compounded monthly, so 12%/12 = 1% per month or 0.01)"
              />
            </div>

            <div className="mt-4 rounded-lg bg-white p-4">
              <p className="text-[11px] font-semibold text-slate2-muted">Calculation:</p>
              <p className="mt-1 font-mono text-[12px] leading-6 text-navy">
                Future Value = 10000 × ( ( (1 + 0.01)<sup>360</sup> − 1 ) / 0.01 ) × (1 + 0.01)
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-gradient-to-r from-green-cta to-brand p-4 text-white">
              <p className="text-[11px] font-semibold text-white/80">Result:</p>
              <p className="mt-1 text-[18px] font-bold">Future Value ≈ ₹3.08 Crore</p>
              <p className="mt-1 text-[11px] leading-5 text-white/90">
                Therefore, Rohit's investment of ₹10,000 per month for 30 years at a 12% annual
                interest rate will grow to approximately ₹3.08 Cr.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-slate2-border bg-white p-4">
          <BookOpen size={16} className="mt-0.5 shrink-0 text-brand" />
          <p className="text-[11px] leading-5 text-slate2-muted">
            **The interest rate on an SIP will vary as per the market situation. It may decrease
            or increase and can change the returns estimated.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ 2.5 Beat Inflation with SIP Calculator ═══════════════ */
interface ScenarioCardProps {
  title: string
  highlighted?: boolean
  childAge: string
  monthlySip: string
  duration: string
  totalInvestment: string
  estReturns: string
  targetCorpus: string
}

function ScenarioCard({
  title,
  highlighted,
  childAge,
  monthlySip,
  duration,
  totalInvestment,
  estReturns,
  targetCorpus,
}: ScenarioCardProps) {
  const rows = [
    { icon: Clock, label: 'Child\'s Age', value: childAge },
    { icon: IndianRupee, label: 'Monthly SIP', value: monthlySip },
    { icon: Calendar, label: 'Investment Duration', value: duration },
    { icon: TrendingUp, label: 'Total Investment', value: totalInvestment },
    { icon: Activity, label: 'Estimated Returns', value: estReturns },
    { icon: Target, label: 'Target Corpus', value: targetCorpus },
  ]

  return (
    <div
      className={`relative rounded-xl p-6 ${
        highlighted
          ? 'bg-navy text-white shadow-lg'
          : 'border border-slate2-border bg-white'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-green-cta px-2.5 py-1 text-[9px] font-bold text-white">
          <CheckCircle2 size={10} /> Recommended
        </span>
      )}
      <h3 className={`text-[15px] font-bold ${highlighted ? 'text-white' : 'text-navy'}`}>
        {title}
      </h3>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => {
          const Icon = r.icon
          return (
            <div key={r.label} className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  highlighted ? 'bg-white/15' : 'bg-gray-100'
                }`}
              >
                <Icon size={13} className={highlighted ? 'text-white' : 'text-brand'} />
              </span>
              <span className={`text-[11px] ${highlighted ? 'text-white/70' : 'text-slate2-muted'}`}>
                {r.label}
              </span>
              <span className={`ml-auto text-[12px] font-bold ${highlighted ? 'text-white' : 'text-navy'}`}>
                {r.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BeatInflation() {
  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <SectionHeading title="Beat Inflation with SIP Calculator" align="center" />
        <div className="mt-4 flex justify-center">
          <span className="rounded-full border border-slate2-border bg-blueBG px-4 py-2 text-[12px] font-medium text-navy">
            Target: <strong className="text-brand">₹55 Lakh</strong>{' '}
            <span className="text-slate2-muted">(Expected Rate of Return: 12%)</span>
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ScenarioCard
            title="Seema Starts Early"
            highlighted
            childAge="1 year"
            monthlySip="₹8,235"
            duration="17 years"
            totalInvestment="₹16.8 Lakh"
            estReturns="₹38.2 Lakh"
            targetCorpus="₹55 Lakh"
          />
          <ScenarioCard
            title="Seema Starts Later"
            childAge="5 years"
            monthlySip="₹14,630"
            duration="13 years"
            totalInvestment="₹22.82 Lakh"
            estReturns="₹32.18 Lakh"
            targetCorpus="₹55 Lakh"
          />
          <ScenarioCard
            title="Seema Starts Very Late"
            childAge="10 years"
            monthlySip="₹34,050"
            duration="8 years"
            totalInvestment="₹32.69 Lakh"
            estReturns="₹22.31 Lakh"
            targetCorpus="₹55 Lakh"
          />
        </div>

        {/* Sub-section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-navy">
              When Child is 18 <span className="font-medium text-slate2-muted">(Higher Education Starts)</span>
            </h3>
            <div className="rounded-xl border border-orange-tag/30 bg-orange-tagBg/50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-tag/10">
                  <GraduationCap size={16} className="text-orange-tag" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-navy">Inflation Alert!</p>
                  <p className="text-[11px] text-slate2-secondary">College costs DOUBLE every 7-8 years!</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-green-cta/30 bg-green-cta/5 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-cta/10">
                  <Wallet size={16} className="text-green-cta" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-navy">Seema Wealth ₹55 Lakh</p>
                  <p className="text-[11px] text-slate2-secondary">(Target Achieved!)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fear factor panel */}
          <div className="rounded-xl border border-slate2-border bg-gray-50 p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-tag/15">
                <Baby size={18} className="text-orange-tag" />
              </span>
              <div>
                <p className="text-[12px] font-medium text-slate2-secondary">Fear Factor</p>
                <p className="text-[16px] font-bold uppercase text-navy">The Cost of Waiting is Huge!</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                'Every YEAR you delay = Your child\'s dream is at risk!',
                'You\'ll have to invest DOUBLE later!',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-orange-tag" />
                  <span className="text-[12px] leading-5 text-slate2-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="rounded-lg bg-brand px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark">
            Start your SIP today!
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ 2.6 SIP vs Lumpsum ═══════════════ */
const sipPoints = [
  'Regular fixed payments',
  'No market timing needed',
  'Lower risk',
  'Starts with ₹500',
  'Regular income earners',
]

const lumpsumPoints = [
  'One-time payment',
  'One-time payment',
  'Higher capital risk',
  'Large amount needed',
  'Investors with a large corpus',
]

export function SipVsLumpsum() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="container-pb">
        <SectionHeading title="SIP vs Lumpsum" align="center" />

        <div className="relative mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* SIP card */}
          <div className="rounded-xl bg-blueBG p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                <TrendingUp size={18} />
              </span>
              <h3 className="text-[16px] font-bold text-navy">SIP (Systematic Investment Plan)</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {sipPoints.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Plus size={14} className="shrink-0 text-brand" />
                  <span className="text-[12px] text-slate2-secondary">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lumpsum card */}
          <div className="rounded-xl bg-green-cta/5 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-cta text-white">
                <Wallet size={18} />
              </span>
              <h3 className="text-[16px] font-bold text-navy">Lumpsum Investment</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {lumpsumPoints.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Plus size={14} className="shrink-0 text-green-cta" />
                  <span className="text-[12px] text-slate2-secondary">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VS badge */}
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-gray-50 bg-navy text-[12px] font-bold text-white shadow-md">
            VS
          </span>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ 2.7 Types of SIP Calculators ═══════════════ */
const calculatorTypes = [
  {
    icon: Calculator,
    title: 'Basic SIP Calculator',
    desc: 'Calculates the future value of your SIP investments based on investment amount, tenure, and expected return. Ideal for beginners.',
  },
  {
    icon: TrendingUp,
    title: 'Step-Up SIP Calculator',
    desc: 'Helps you estimate returns when you increase your SIP amount annually. Useful for those whose income grows over time.',
  },
  {
    icon: Percent,
    title: 'SIP with Inflation Adjustment Calculator',
    desc: 'Adjusts your investment returns for inflation to show the real value of your corpus. Helps assess true purchasing power.',
  },
  {
    icon: Clock,
    title: 'Cost of Delay Calculator',
    desc: 'Shows how delaying your SIP by months or years can reduce your final corpus. Encourages early investing.',
  },
  {
    icon: Scale,
    title: 'SIP vs Lumpsum Calculator',
    desc: 'Compares lump sum investing with monthly SIPs to help you understand which strategy suits your financial goals better.',
  },
  {
    icon: PieChart,
    title: 'XIRR SIP Calculator',
    desc: 'Calculates the actual return of your SIP investments using the Extended Internal Rate of Return (XIRR) method. Best for tracking irregular investments.',
  },
]

export function TypesOfSipCalculators() {
  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <SectionHeading title="Types of SIP Calculators" align="center" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-6 text-slate2-secondary">
          Systematic Investment Plan (SIP) calculators come in various forms to help investors
          plan their investments better. Below are the key types of SIP calculators and their
          specific uses:
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {calculatorTypes.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="rounded-xl border border-slate2-border p-6 transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple2/10">
                  <Icon size={20} className="text-purple2" />
                </span>
                <Link
                  to="#"
                  className="mt-4 flex items-center gap-1 text-[14px] font-bold text-navy hover:text-brand"
                >
                  {c.title}
                  <ExternalLink size={12} className="text-slate2-muted" />
                </Link>
                <p className="mt-2 text-[12px] leading-5 text-slate2-secondary">{c.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark">
            View Plans <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
