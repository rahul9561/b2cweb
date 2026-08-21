import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgePercent,
  ChevronDown,
  Download,
  FileText,
  GraduationCap,
  Headphones,
  Info,
  Landmark,
  Play,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import logo from '../assets/images/av-logon.png'

const benefitCards = [
  ['Capital Guarantee', 'Your invested amount is 100% guaranteed and will be returned at maturity', ShieldCheck],
  ['Market upside', 'Get benefit of market linked returns with this plan', TrendingUp],
  ['In-built life cover', 'Rs 5.89 Lac of life cover throughout the policy duration', Headphones],
  ['Tax Benefits', 'You get tax benefits under Section 80(C) and no tax on returns under Section 10 (10D)', ReceiptText],
]

export default function InvestmentProposalPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'proceed' | 'review'>('proceed')

  const handleBottomAction = () => {
    if (stage === 'proceed') {
      setStage('review')
      document.getElementById('proposal-benefits')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    navigate('/investment-plans/review')
  }

  return (
    <main className="min-h-screen bg-[#f1f3f8] pb-28 text-navy">
      <InvestmentCheckoutHeader />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[368px_minmax(0,1fr)]">
        <ProductSummaryCard />
        <section className="rounded-lg bg-white shadow-card">
          <h1 className="border-b border-slate2-border px-8 py-6 text-xl font-black">Your Details</h1>
          <div className="space-y-7 px-20 py-8">
            <div>
              <p className="mb-3 text-xs font-bold">Gender</p>
              <div className="flex gap-8">
                {['Male', 'Female'].map((gender) => (
                  <label key={gender} className="flex items-center gap-2 text-base">
                    <input type="radio" name="gender" defaultChecked={gender === 'Male'} className="h-5 w-5 accent-brand" />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
            <DetailLine label="Life Assured Full Name" value="Mohd Faisal" />
            <DetailLine label="Email Address" value="moh***********@gmail.com" />
            <DetailLine label="Life Assured Date of Birth" value="22/09/2002" side="23 Years" sub="22 September, 2002" />
            <DetailLine label="Occupation" value="Salaried" chevron />
            <DetailLine label="Phone Number" value="+9178*****007" />
          </div>
        </section>
      </div>

      <BenefitsSection />
      <InvestmentCriteriaSection />
      <LegalCopy />
      <StickyProposalBar actionLabel={stage === 'proceed' ? 'PROCEED' : 'REVIEW DETAILS'} onAction={handleBottomAction} />
    </main>
  )
}

export function InvestmentCheckoutHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-black shadow-lg">
      <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-between px-5">
        <Link to="/" aria-label="Go to AV Management home">
          <img src={logo} alt="AV Management" className="h-12 w-auto object-contain" />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-bold text-white md:flex">
          <button className="inline-flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Power of Compounding</button>
          <button className="rounded-lg border border-dashed border-brand px-4 py-2"><FileText className="mr-1 inline h-4 w-4" /> Know Your Plan in 2 mins</button>
          <button><Download className="mr-1 inline h-4 w-4" /> Brochure</button>
          <button><Download className="mr-1 inline h-4 w-4" /> Benefit Illustration</button>
          <button><Headphones className="mr-1 inline h-4 w-4" /> Talk to an Expert</button>
        </div>
      </div>
    </header>
  )
}

function ProductSummaryCard() {
  return (
    <aside className="rounded-lg bg-white shadow-card">
      <div className="flex items-center gap-4 border-b border-slate2-border px-7 py-5">
        <div className="grid h-10 w-36 place-items-center rounded bg-white text-sm font-black text-brand shadow-sm">AV PRIME</div>
        <h2 className="font-black leading-tight">Save N Grow Plus-<br />Assure</h2>
      </div>
      <div className="space-y-6 p-7">
        <SummaryLine label="Investment Amount" value="Rs 5000" right="Monthly" helper="Five Thousand" />
        <SummaryLine label="Pay For" value="10 Years" />
        <SummaryLine label="Withdraw After" value="20 Years" />
        <div className="space-y-1 rounded-lg bg-[#fff8e1] p-4">
          <h3 className="font-black text-[#9b7400]">Capital Guarantee</h3>
          <p className="text-sm leading-6">Your amount is 100% Guaranteed and will be returned on Maturity</p>
        </div>
        <div className="rounded-lg bg-[#eef2ff] p-4">
          <h3 className="font-black text-brand">Rs 5.89 Lac Life Cover</h3>
          <p className="text-sm">Inbuilt cover</p>
        </div>
        <div className="rounded-lg bg-[#def8e9] p-4">
          <h3 className="font-black text-[#00845e]">Tax Savings **</h3>
          <p className="text-sm">Under Section 80C And Sec 10(10 D)</p>
          <p className="text-xs">**Tax benefits are subject to change in tax laws</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-blueBG p-2 text-left text-xs font-black"><Play className="mr-1 inline h-4 w-4 text-brand" /> CEO Speaks</button>
          <button className="rounded-lg bg-[#fff8e1] p-2 text-left text-xs font-black"><Landmark className="mr-1 inline h-4 w-4 text-orange-tag" /> Esteemed Partner</button>
        </div>
      </div>
    </aside>
  )
}

function SummaryLine({ label, value, right, helper }: { label: string; value: string; right?: string; helper?: string }) {
  return (
    <div className="border-b border-slate2-border pb-4">
      <p className="mb-2 text-xs">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-xl font-black">{value}</p>
        <button className="flex items-center gap-2 text-lg font-medium">{right} <ChevronDown className="h-5 w-5 text-slate2-muted" /></button>
      </div>
      {helper && <p className="mt-2 text-xs">{helper}</p>}
    </div>
  )
}

function DetailLine({ label, value, side, sub, chevron }: { label: string; value: string; side?: string; sub?: string; chevron?: boolean }) {
  return (
    <div className="border-b border-slate2-border pb-3">
      <p className="text-xs font-bold">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-lg font-black">{value}</p>
        {side && <span className="rounded bg-blueBG px-3 py-1 text-sm font-black text-brand">{side}</span>}
        {chevron && <ChevronDown className="h-5 w-5 text-slate2-muted" />}
      </div>
      {sub && <p className="mt-2 text-xs">{sub}</p>}
    </div>
  )
}

function BenefitsSection() {
  return (
    <section id="proposal-benefits" className="mx-auto mt-28 max-w-6xl px-4">
      <SectionTitle title="Benefits available under this plan" />
      <div className="grid gap-2 md:grid-cols-4">
        {benefitCards.map(([title, desc, Icon]) => {
          const BenefitIcon = Icon as typeof ShieldCheck
          return (
            <motion.article whileHover={{ y: -4 }} key={title as string} className="min-h-[255px] rounded-lg bg-white p-8 shadow-sm">
              <BenefitIcon className="mb-8 h-10 w-10 text-brand" />
              <h3 className="mb-5 text-lg font-black">{title as string}</h3>
              <p className="text-base leading-7">{desc as string}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function InvestmentCriteriaSection() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <SectionTitle title="Investment Criteria" />
      <div className="grid gap-2 md:grid-cols-3">
        <CriteriaCard icon={BadgePercent} title="Age to start investing" rows={[['Minimum', '18 Years'], ['Maximum', '45 Years']]} />
        <CriteriaCard icon={Wallet} title="Minimum amount to invest" rows={[['Monthly', 'Rs 2150'], ['Half Yearly', 'Rs 12400'], ['Yearly', 'Rs 24150']]} />
        <CriteriaCard icon={Landmark} title="Number of years after which your investment will mature" rows={[['Minimum', '15 Years'], ['Maximum', '20 Years']]} />
      </div>
      <div className="mt-2 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-8 text-lg font-black">Number of years you can invest</h3>
        <div className="flex gap-8">
          <GraduationCap className="h-10 w-10 text-brand" />
          <div>
            <h4 className="text-lg font-black">Limited Pay</h4>
            <p className="mt-3 text-base">Invest for a few years and stay invested for the entire policy duration Choose from <b>5, 7 and 10 Years</b></p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CriteriaCard({ icon: Icon, title, rows }: { icon: typeof BadgePercent; title: string; rows: string[][] }) {
  return (
    <article className="flex min-h-[190px] gap-7 rounded-lg bg-white p-9 shadow-sm">
      <Icon className="h-11 w-11 flex-shrink-0 text-brand" />
      <div>
        <h3 className="mb-4 text-lg font-black">{title}</h3>
        <div className="space-y-3">
          {rows.map(([label, value]) => (
            <p key={label} className="grid grid-cols-[110px_1fr] text-base"><span>{label}</span><b>{value}</b></p>
          ))}
        </div>
      </div>
    </article>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-black">{title}</h2>
      <span className="mx-auto mt-3 block h-1 w-16 rounded bg-navy" />
    </div>
  )
}

function LegalCopy() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4 pb-28 text-xs leading-6">
      <p>^ You can cancel the policy within 30 days of buying and get an easy refund for your policy. However for cancellation requests within 30 days of issuance of the policy, the expenses incurred by the company on medical examination and stamp duty charges shall be deducted.</p>
      <p className="mt-4">The Returns in ULIP plans are subject to market risk and are not guaranteed. The investment risk in the policy is borne by the policyholder. The actual returns can vary depending on the performance of the chosen fund, charges towards mortality, allocation, policy admin, cost of riders, etc.</p>
      <p className="mt-4 text-center">AV Management is registered as a Composite Broker | Registration No. 742 | Product information is authentic and based on information received from insurers.</p>
    </section>
  )
}

export function StickyProposalBar({ actionLabel, onAction }: { actionLabel: string; onAction: () => void }) {
  return (
    <motion.div
      initial={{ y: 90 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200 bg-[#e8f3ff]/95 shadow-[0_-6px_24px_rgba(0,101,255,0.12)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[170px_1fr_210px] items-center gap-4 px-4 py-4">
        <div>
          <p className="text-sm">Total Maturity Amount<sup>+</sup></p>
          <p className="text-xl font-black">Rs 2.18 Cr</p>
          <p className="text-xs">If you had invested <b>20 Years</b> ago</p>
        </div>
        <div className="flex items-center gap-3 border-l border-blue-200 pl-4">
          <div>
            <p className="text-sm">Returns</p>
            <p className="text-2xl font-black">24.5%</p>
          </div>
          <span className="rounded bg-[#fff8dc] px-2 py-1 text-xs font-bold">BSE 500 Momentum Value 50 Index Fund</span>
          <button className="rounded-full border border-dashed border-brand px-3 py-2 text-sm font-bold text-brand"><Info className="mr-1 inline h-4 w-4" /> More Info</button>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="h-13 rounded bg-brand px-8 py-4 text-base font-black text-white shadow-card"
        >
          {actionLabel}
        </motion.button>
      </div>
    </motion.div>
  )
}
