import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bike,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Languages,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Search,
  Wrench,
  X,
} from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import bajajLogo from '../assets/images/bajaj-general.svg'
import digitLogo from '../assets/images/digit-bike.svg'
import hdfcLogo from '../assets/images/hdfc_ergo.png'
import iciciLogo from '../assets/images/icici.png'
import indusindLogo from '../assets/images/indusind-insurance.svg'
import nationalLogo from '../assets/images/new_india.png'
import orientalLogo from '../assets/images/oriental.png'
import royalLogo from '../assets/images/royal-sundaram.svg'
import sbiLogo from '../assets/images/sbigeneral.png'
import tataAigLogo from '../assets/images/tata-aig.svg'
import unitedLogo from '../assets/images/unitedindia.png'
import zurichLogo from '../assets/images/zurich_kotak.png'

type PlanType = 'third' | 'comprehensive'
type ModalType = 'edit' | 'claims'

interface BikePlan {
  id: string
  insurer: string
  logo?: string
  logoUrl?: string
  badge?: string
  base: number
  idv: number
}

const thirdPartyPlans: BikePlan[] = [
  { id: 'digit', insurer: 'Digit', logoUrl: digitLogo, badge: 'Renew with same insurer', base: 714, idv: 0 },
  { id: 'bajaj', insurer: 'Bajaj General', logoUrl: bajajLogo, base: 714, idv: 0 },
  { id: 'tata', insurer: 'Tata AIG', logoUrl: tataAigLogo, badge: 'Instant buy in 30 sec', base: 714, idv: 0 },
  { id: 'oriental', insurer: 'Oriental', logoUrl: orientalLogo, base: 714, idv: 0 },
  { id: 'icici', insurer: 'ICICI Lombard', logoUrl: iciciLogo, base: 714, idv: 0 },
  { id: 'national', insurer: 'National Insurance', logoUrl: nationalLogo, base: 714, idv: 0 },
  { id: 'united', insurer: 'United India', logoUrl: unitedLogo, base: 714, idv: 0 },
  { id: 'zurich', insurer: 'Zurich Kotak', logoUrl: zurichLogo, base: 714, idv: 0 },
  { id: 'sbi', insurer: 'SBI', logoUrl: sbiLogo, base: 714, idv: 0 },
  { id: 'royal', insurer: 'Royal Sundaram', logoUrl: royalLogo, base: 714, idv: 0 },
]

const comprehensivePlans: BikePlan[] = [
  { id: 'digit-comp', insurer: 'Digit', logoUrl: digitLogo, badge: 'Renew with same insurer', base: 726, idv: 17596 },
  { id: 'bajaj-comp', insurer: 'Bajaj General', logoUrl: bajajLogo, base: 755, idv: 22867 },
  { id: 'indusind', insurer: 'IndusInd', logoUrl: indusindLogo, badge: 'Formerly Reliance General Insurance', base: 773, idv: 13076 },
  { id: 'sbi-comp', insurer: 'SBI', logoUrl: sbiLogo, base: 715, idv: 12801 },
  { id: 'zurich-comp', insurer: 'Zurich Kotak', logoUrl: zurichLogo, base: 739, idv: 14006 },
  { id: 'icici-comp', insurer: 'ICICI Lombard', logoUrl: iciciLogo, base: 805, idv: 33651 },
  { id: 'national-comp', insurer: 'National Insurance', logoUrl: nationalLogo, base: 785, idv: 15926 },
  { id: 'hdfc-comp', insurer: 'HDFC Ergo', logoUrl: hdfcLogo, base: 824, idv: 24683 },
  { id: 'tata-comp', insurer: 'Tata AIG', logoUrl: tataAigLogo, badge: 'Instant buy in 30 sec', base: 842, idv: 31828 },
]

export default function BikeQuotesPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [planType, setPlanType] = useState<PlanType>('third')
  const [planMenu, setPlanMenu] = useState(false)
  const [duration, setDuration] = useState('1 year')
  const [discount, setDiscount] = useState(false)
  const [addons, setAddons] = useState<string[]>([])
  const [sort, setSort] = useState('Recommended')
  const [modal, setModal] = useState<ModalType | null>(null)
  const reg = params.get('reg') || 'UP32FJ6317'

  const plans = useMemo(() => {
    const source = planType === 'third' ? thirdPartyPlans : comprehensivePlans
    const years = Number(duration.split(' ')[0])
    const addonCost = addons.length * 110
    const discountCut = discount ? 50 : 0
    const sorted = source.map((plan) => ({ ...plan, price: plan.base * years + addonCost - discountCut }))
    if (sort.includes('low to high')) return [...sorted].sort((a, b) => a.price - b.price)
    if (sort.includes('high to low')) return [...sorted].sort((a, b) => b.price - a.price)
    return sorted
  }, [addons.length, discount, duration, planType, sort])

  const toggleAddon = (addon: string) => {
    setAddons((current) => (current.includes(addon) ? current.filter((item) => item !== addon) : [...current, addon]))
  }

  const buy = (plan: BikePlan & { price: number }) => {
    navigate(`/bike-insurance/proposal?plan=${encodeURIComponent(plan.insurer)}&price=${plan.price}&type=${planType}`)
  }

  return (
    <main className="min-h-screen bg-[#eef5ff] text-navy">
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home"><img src={logo} alt="AV Management" className="h-12 w-auto" /></Link>
          <div className="flex gap-3">
            <button className="rounded-lg border border-brand px-4 py-2 text-sm font-bold text-white"><Languages className="mr-1 inline h-4 w-4" /> English</button>
            <button className="rounded-lg border border-brand px-4 py-2 text-sm font-bold text-white"><PhoneCall className="mr-1 inline h-4 w-4" /> Call us</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-4 lg:grid-cols-[275px_minmax(0,1fr)_295px]">
        <aside className="space-y-3">
          <InfoCard title="Your bike details" action="Edit" onAction={() => setModal('edit')}>
            <p className="font-bold">Honda CB Shine Electric Start Drum Brake Alloy Wheels (125 cc)</p>
            <p className="mt-3 text-sm text-slate2-secondary">{reg} | 2014 registered</p>
          </InfoCard>
          <InfoCard title="Addons" sub="Know more">
            {['Personal Accident Cover', 'PA cover for passenger', ...(planType === 'comprehensive' ? ['Road Side Assistance (RSA)'] : [])].map((addon) => (
              <label key={addon} className="mb-3 block text-sm"><input type="checkbox" checked={addons.includes(addon)} onChange={() => toggleAddon(addon)} className="mr-2 accent-brand" />{addon}</label>
            ))}
          </InfoCard>
          <InfoCard title="Plan duration">
            <select value={duration} onChange={(event) => setDuration(event.target.value)} className="w-full rounded-lg border px-3 py-2 outline-none">
              <option>1 year</option><option>2 year</option><option>3 year</option>
            </select>
          </InfoCard>
          {planType === 'comprehensive' && (
            <InfoCard title="Sort by">
              {['Recommended', 'Premium (low to high)', 'Premium (high to low)', 'IDV (high to low)'].map((item) => (
                <label key={item} className="mb-3 block text-sm"><input type="radio" checked={sort === item} onChange={() => setSort(item)} className="mr-2 accent-brand" />{item}</label>
              ))}
            </InfoCard>
          )}
        </aside>

        <section>
          <div className="mb-4 rounded-lg bg-[#ffe9e5] px-5 py-2 text-center font-bold text-orange-error">Hurry up! Your policy has already expired</div>
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <div className="relative">
              <button onClick={() => setPlanMenu(!planMenu)} className="flex h-14 w-full items-center justify-between rounded-lg border border-brand/30 bg-white px-4">
                <span className="text-slate2-secondary">Plan Type</span><b>{planType === 'third' ? 'Third Party' : 'Comprehensive'}</b><ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {planMenu && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-0 right-0 top-16 z-20 overflow-hidden rounded-lg border bg-white shadow-card">
                    <PlanChoice title="Comprehensive Plan" desc="Offers full coverage for your vehicle and damage to others or their property." active={planType === 'comprehensive'} onClick={() => { setPlanType('comprehensive'); setPlanMenu(false) }} />
                    <PlanChoice title="Third Party Plan" desc="Covers damage your vehicle causes to others, not to your own vehicle." active={planType === 'third'} onClick={() => { setPlanType('third'); setPlanMenu(false) }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {planType === 'third' ? (
              <button onClick={() => setDiscount(!discount)} className="flex h-14 items-center justify-between rounded-lg border border-green-cta bg-green-cta/10 px-4 text-left font-black text-green-cta">
                <span><Sparkles className="mr-2 inline h-5 w-5" /> Get discount! <span className="text-navy">Save Rs50 more</span></span>
                <span className={`h-6 w-11 rounded-full p-1 transition ${discount ? 'bg-green-cta' : 'bg-slate2-border'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${discount ? 'translate-x-5' : ''}`} /></span>
              </button>
            ) : (
              <button className="flex h-14 items-center justify-between rounded-lg border border-brand/30 bg-white px-4"><span>Insured Declared Value(IDV)</span><b>Rs11,590</b></button>
            )}
          </div>

          <h1 className="text-xl font-black">{plans.length} {planType === 'third' ? 'third party' : 'comprehensive'} plans available</h1>
          <p className="mb-5 text-slate2-secondary">Covers damages to {planType === 'third' ? 'third-party only and not your vehicle' : 'your vehicle and third-party'}</p>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => <BikePlanCard key={plan.id} plan={plan} comprehensive={planType === 'comprehensive'} onBuy={() => buy(plan)} />)}
          </div>
          <p className="mt-4 text-center text-sm"><b className="text-orange-tag">Note:</b> Prices are exclusive of GST</p>
          <Disclaimer />
        </section>

        <aside className="space-y-6">
          <ClaimCard onToggle={() => setModal('claims')} />
          <WhyBuyCard />
        </aside>
      </div>

      <AnimatePresence>
        {modal === 'edit' && <EditBikeDrawer onClose={() => setModal(null)} />}
        {modal === 'claims' && <ClaimsModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </main>
  )
}

function InfoCard({ title, sub, action, onAction, children }: { title: string; sub?: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center justify-between text-lg font-black"><span><SlidersHorizontal className="mr-2 inline h-5 w-5 text-slate2-muted" />{title}</span>{action && <button onClick={onAction} className="text-sm text-brand">{action}</button>}</h2>
      {sub && <p className="-mt-4 mb-4 ml-8 text-xs text-slate2-muted">{sub}</p>}
      {children}
    </div>
  )
}

function PlanChoice({ title, desc, active, onClick }: { title: string; desc: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex w-full items-start justify-between p-4 text-left ${active ? 'bg-blueBG' : 'bg-white'}`}><span><b className="block">{title}</b><small>{desc}</small></span><span className={`mt-1 h-4 w-4 rounded-full border ${active ? 'border-brand bg-brand' : ''}`} /></button>
}

function BikePlanCard({ plan, comprehensive, onBuy }: { plan: BikePlan & { price: number }; comprehensive: boolean; onBuy: () => void }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="relative flex min-h-[190px] flex-col rounded-lg border border-[#d7e7ff] bg-white px-5 pb-3 pt-8 text-center shadow-[0_10px_24px_rgba(29,90,180,0.10)]"
    >
      {plan.badge && (
        <div className="absolute left-0 right-0 top-0 rounded-t-lg bg-gradient-to-r from-[#4ab7c6] to-[#a46ac4] px-3 py-1 text-left text-[11px] font-black text-white">
          {plan.badge}
        </div>
      )}
      <div className="mx-auto grid h-12 w-36 place-items-center rounded border border-slate2-border bg-white px-3">
        {plan.logoUrl ? <img src={plan.logoUrl} alt={plan.insurer} className="max-h-10 max-w-full object-contain" /> : <span className="text-lg font-black text-brand">{plan.logo}</span>}
      </div>
      <h3 className="mt-3 text-sm font-black">{plan.insurer}</h3>
      {comprehensive && <p className="mt-2 text-xs text-slate2-secondary">IDV Rs{plan.idv.toLocaleString('en-IN')}</p>}
      <button
        onClick={onBuy}
        className="mx-auto mt-auto inline-flex h-10 w-full max-w-[148px] items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white shadow-[0_10px_18px_rgba(0,102,255,0.28)]"
      >
        Buy @ Rs{plan.price.toLocaleString('en-IN')}
        <ChevronRight className="h-4 w-4" />
      </button>
      <span className="mx-auto mt-2 inline-flex items-center gap-1 rounded-full border border-green-cta bg-green-cta/10 px-3 py-1 text-[11px] font-bold leading-none text-green-cta shadow-sm">
        <CheckCircle2 className="h-3 w-3 fill-green-cta/10" />
        Free RSA included
      </span>
    </motion.article>
  )
}

function ClaimCard({ onToggle }: { onToggle: () => void }) {
  return <div className="rounded-lg border border-green-cta/30 bg-green-cta/10 p-5 shadow-sm"><h3 className="mb-4 text-lg font-black">Claims support anytime, anywhere!</h3>{['24x7 Claims assistance for all customers', 'Dedicated claim manager helping you at every step', 'Get latest updates at regular intervals for claims'].map((item) => <p key={item} className="mb-3 text-sm"><CheckCircle2 className="mr-2 inline h-4 w-4 text-navy" />{item}</p>)}<button onClick={onToggle} className="mx-auto mt-2 block rounded-full border border-green-cta bg-white px-5 py-2 text-sm text-green-cta">Show claim process</button></div>
}

function WhyBuyCard() {
  return <div className="rounded-lg bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-black">Why buy from AV Management</h3>{['Claim assistance anytime, anywhere!', 'Compare and choose best plan', '24*7 support helpline', 'Get your policy instantly with quick and easy KYC process', '1 Lakh+ people visit to AV Management to buy bike insurance everyday'].map((item) => <p key={item} className="mb-4 text-sm"><ShieldCheck className="mr-2 inline h-4 w-4 text-purple2" />{item}</p>)}</div>
}

function Disclaimer() {
  return <div className="mt-12 rounded-lg bg-white p-6 text-sm leading-7 shadow-sm"><h3 className="mb-4 font-black">Disclaimer</h3><p>*Savings are based on the comparison between the highest and lowest premium for own damage cover provided by different insurance companies for the same vehicle with same IDV and NCB.</p><p>*Rs714 incl GST per annum is the price for third party motor insurance for two wheelers exceeding 75cc but not more than 150cc.</p><p>Actual premium may vary subject to additional covers and insurer underwriting rules.</p></div>
}

function EditBikeDrawer({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'make' | 'model' | 'variant' | 'year'>('form')
  const [bike, setBike] = useState({
    make: 'HONDA',
    model: 'CB SHINE',
    variant: 'ELECTRIC START DRUM BRAKE ALLOY WHEELS (125 CC)',
    year: '2014',
    policyType: '1-Year Third Party only',
    expiry: 'Expired more than 90 days',
  })

  const choose = (key: keyof typeof bike, value: string) => {
    setBike((current) => ({ ...current, [key]: value }))
    setStep('form')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-navy/60" onClick={onClose}>
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="ml-auto flex h-full w-full max-w-[555px] flex-col bg-white" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-slate2-border p-2"><X /></button>
        <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-8 pt-8">
          {step === 'form' && (
            <>
              <h2 className="mb-8 text-2xl font-black">Edit bike details</h2>
              <div className="mb-4 grid h-24 w-24 place-items-center rounded-full bg-blueBG"><Bike className="h-16 w-16 text-brand" /></div>
              <Field label="Registration number" value="UP32FJ6317" actionText="Edit" />
              <Field label="Make" value={bike.make} onClick={() => setStep('make')} />
              <Field label="Model" value={bike.model} onClick={() => setStep('model')} />
              <Field label="Variant" value={bike.variant} onClick={() => setStep('variant')} />
              <Field label="Registration year" value={bike.year} onClick={() => setStep('year')} />
              <SelectField label="Select previous policy type" value={bike.policyType} onChange={(value) => setBike((current) => ({ ...current, policyType: value }))} options={['1-Year Comprehensive Policy', '1-Year Third Party only', "I don't remember"]} />
              <SelectField label="Select policy expiry" value={bike.expiry} onChange={(value) => setBike((current) => ({ ...current, expiry: value }))} options={['Not Expired', 'Expired within 90 days', 'Expired more than 90 days', "I don't remember"]} />
            </>
          )}
          {step === 'make' && <SelectionScreen title="Select two wheeler make" search="Honda" section="Popular makes" options={['Honda', 'Bajaj', 'TVS', 'Yamaha', 'Hero Motocorp', 'Royal Enfield', 'Suzuki', 'Mahindra', 'KTM', 'LML', 'Ola', 'Harley Davidson']} active={bike.make} onBack={() => setStep('form')} onChoose={(value) => choose('make', value.toUpperCase())} />}
          {step === 'model' && <SelectionScreen title="Select Model of your bike/scooter" search={`Search ${bike.make}`} section="Popular models" options={['FZS', 'FZ 16', 'Fazer', 'FZ', 'YZF R15', 'Ray', 'Alpha', 'Aerox', 'Aerox E', 'MT-03', 'XSR']} otherTitle="Other models" otherOptions={['SZ R', 'Gladiator', 'SS', 'XJR 1300', 'XTZ 125', 'FZ X', 'MT 15']} active={bike.model} onBack={() => setStep('form')} onChoose={(value) => choose('model', value)} />}
          {step === 'variant' && <SelectionScreen title="Select Variant of your bike/scooter" search={`Search ${bike.make}-${bike.model}`} section="Popular variants" single options={['V4 World Gp 60Th Anniversary Edition (155 cc)', '4V Dark Knight (155 cc)', 'Dark Knight (155 cc)', 'M Abs Dual Channel (155 cc)', 'R15 M (155 cc)', 'S (150 CC)', 'S STD (155)', 'R15 V4 Metallic Red (155 cc)']} active={bike.variant} onBack={() => setStep('form')} onChoose={(value) => choose('variant', value.toUpperCase())} />}
          {step === 'year' && <SelectionScreen title="When did you buy your Bike/Scooter?" section="" options={['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008']} active={bike.year} onBack={() => setStep('form')} onChoose={(value) => choose('year', value)} />}
        </div>
        <div className="border-t bg-white p-6"><button onClick={onClose} className="h-14 w-full rounded-lg bg-brand text-lg font-black text-white">Update details</button></div>
      </motion.aside>
    </motion.div>
  )
}

function Field({ label, value, actionText, onClick }: { label: string; value: string; actionText?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="mb-4 block w-full rounded-lg border px-4 py-3 text-left">
      <span className="block text-xs text-slate2-secondary">{label}</span>
      <span className="mt-1 flex items-center justify-between gap-3">
        <b className="line-clamp-1">{value}</b>
        {actionText ? <span className="text-sm font-bold text-brand">{actionText}</span> : <ChevronRight className="h-5 w-5 shrink-0" />}
      </span>
    </button>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="mb-4 block rounded-lg border px-4 py-2">
      <span className="block text-xs text-slate2-secondary">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full bg-white py-1 font-black outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function SelectionScreen({
  title,
  search,
  section,
  options,
  otherTitle,
  otherOptions = [],
  active,
  single,
  onBack,
  onChoose,
}: {
  title: string
  search?: string
  section: string
  options: string[]
  otherTitle?: string
  otherOptions?: string[]
  active: string
  single?: boolean
  onBack: () => void
  onChoose: (value: string) => void
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg bg-blueBG p-2"><ArrowLeft className="h-5 w-5" /></button>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {search && (
        <label className="mb-6 flex h-14 items-center rounded-lg border px-4">
          <input defaultValue={search} className="flex-1 text-base outline-none" />
          <Search className="h-5 w-5" />
        </label>
      )}
      {section && <p className="mb-4 font-medium">{section} <span className="ml-3 inline-block h-px w-10 bg-navy align-middle" /></p>}
      <div className={`grid gap-3 ${single ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {options.map((option) => <OptionButton key={option} option={option} active={active.toLowerCase().includes(option.toLowerCase())} onChoose={onChoose} />)}
      </div>
      {otherTitle && <p className="mb-4 mt-8 font-medium">{otherTitle} <span className="ml-3 inline-block h-px w-10 bg-navy align-middle" /></p>}
      {otherOptions.length > 0 && <div className="grid grid-cols-2 gap-3">{otherOptions.map((option) => <OptionButton key={option} option={option} active={false} onChoose={onChoose} />)}</div>}
      <button className="mx-auto mt-8 block font-bold text-brand">Can't find your bike's {title.includes('Model') ? 'model' : 'make'}? Click here to search</button>
    </div>
  )
}

function OptionButton({ option, active, onChoose }: { option: string; active: boolean; onChoose: (value: string) => void }) {
  return <button onClick={() => onChoose(option)} className={`min-h-12 rounded-lg border bg-white px-4 py-3 font-medium shadow-sm ${active ? 'border-brand text-brand' : 'border-slate2-border'}`}>{option}</button>
}

function ClaimsModal({ onClose }: { onClose: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-4" onClick={onClose}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={onClose} className="float-right"><X /></button><h2 className="mb-4 text-xl font-black">Easy claim process</h2><p>Reach out to the AV Management team. We will help with the remaining process.</p><p className="mt-4">9217010023</p><p>info@help.com</p><div className="mt-6 grid grid-cols-2 gap-4">{['Register claim', 'Share documents', 'Choose garage', 'Track updates'].map((item) => <div key={item} className="rounded bg-blueBG p-4 text-center"><Wrench className="mx-auto mb-2 text-brand" />{item}</div>)}</div></motion.div></motion.div>
}
