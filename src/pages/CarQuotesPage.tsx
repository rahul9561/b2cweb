import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Car,
  ChevronRight,
  Gift,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
  X,
} from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import nationalLogo from '../assets/images/new_india.png'
import shriramLogo from '../assets/images/shriram.png'
import zunoLogo from '../assets/images/zuno.png'
import zurichLogo from '../assets/images/zurich_kotak.png'

type PlanMode = 'complete' | 'super'
type ModalType = 'edit' | 'idv' | 'ncb' | 'policy' | 'claims' | 'note' | 'renewal'

interface CarPlan {
  id: string
  insurer: string
  logo: string
  logoUrl?: string
  price: number
  garages: number
  saver?: boolean
  tags: string[]
}

const plans: CarPlan[] = [
  { id: 'zurich', insurer: 'Zurich Kotak', logo: 'ZURICH kotak', logoUrl: zurichLogo, price: 7343, garages: 286, tags: ['Zero Depreciation cover', 'Car Servicing Included', 'Repair Anywhere', 'Zero Paper Claims'] },
  { id: 'zuno', insurer: 'Zuno Insurance', logo: 'zuno', logoUrl: zunoLogo, price: 13342, garages: 188, tags: ['Zero Depreciation cover', '6-Month Repair Warranty', 'Free Pick-up & Drop'] },
  { id: 'national', insurer: 'National Insurance', logo: 'National', logoUrl: nationalLogo, price: 14471, garages: 1000, tags: ['Roadside Assistance Included', 'Zero Paper Claims'] },
  { id: 'shriram', insurer: 'Shriram General', logo: 'SHRIRAM', logoUrl: shriramLogo, price: 7351, garages: 65, saver: true, tags: ['Pay As You Drive', 'Zero Depreciation cover', 'Self-Video Claims'] },
  { id: 'zuno-super', insurer: 'Zuno Insurance', logo: 'zuno', logoUrl: zunoLogo, price: 6940, garages: 286, saver: true, tags: ['Cheapest Plan', 'Pay As You Drive', 'Zero Depreciation cover'] },
  { id: 'digit', insurer: 'Digit', logo: 'digit', price: 8210, garages: 210, saver: true, tags: ['Smart Saver', 'Zero Paper Claims'] },
]

const lastYearAddons = ['Zero Depreciation', '24x7 Roadside Assistance', 'Engine Protection Cover', 'Consumables', 'Key & Lock Replacement']
const addonFilters = ['Invoice Price Cover', 'Tyre Protector', 'Loss of Personal Belongings', 'Daily Allowance', 'NCB Protector']

export default function CarQuotesPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<PlanMode>('complete')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Zero Depreciation'])
  const [deductible, setDeductible] = useState('0')
  const [modal, setModal] = useState<ModalType | null>(null)

  const reg = params.get('reg') || 'UP32AB1234'
  const visiblePlans = useMemo(() => {
    const base = plans.filter((plan) => (mode === 'super' ? plan.saver : !plan.saver))
    const addonCost = selectedAddons.length * 180
    const deductibleDiscount = Number(deductible) / 30
    return base.map((plan) => ({ ...plan, price: Math.max(2499, Math.round(plan.price + addonCost - deductibleDiscount)) }))
  }, [deductible, mode, selectedAddons])

  const toggleAddon = (addon: string) => {
    setSelectedAddons((current) => (current.includes(addon) ? current.filter((item) => item !== addon) : [...current, addon]))
  }

  return (
    <main className="min-h-screen bg-[#eef5ff] text-navy">
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home">
            <img src={logo} alt="AV Management" className="h-12 w-auto" />
          </Link>
          <button className="rounded-lg border border-brand px-5 py-2 font-bold text-brand">Talk to Expert</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-5 lg:grid-cols-[285px_1fr_335px]">
        <aside className="space-y-5">
          <VehicleCard compact={mode === 'super'} reg={reg} onModal={setModal} />
          <FilterPanel
            deductible={deductible}
            selectedAddons={selectedAddons}
            setDeductible={setDeductible}
            toggleAddon={toggleAddon}
          />
        </aside>

        <section>
          <div className="mb-5 flex max-w-[520px] rounded-full border-2 border-purple2/20 bg-[#eadff4] p-1 shadow-sm">
            <PlanTab active={mode === 'complete'} title="Complete Protection" sub="Unlimited kilometers" onClick={() => setMode('complete')} />
            <PlanTab active={mode === 'super'} title="Super Saver plans" sub="Smart coverage, less price" badge="35% cheaper" onClick={() => setMode('super')} />
          </div>

          <div className="mb-4 border-b border-dashed border-slate2-border text-center text-xs">
            <Car className="mx-auto h-8 w-8 text-brand" />
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            {selectedAddons.map((addon) => (
              <button key={addon} onClick={() => toggleAddon(addon)} className="rounded border bg-white px-3 py-2 text-sm">
                {addon} x
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-lg border border-dashed border-green-cta bg-green-cta/5 p-4">
            <ShieldCheck className="mr-2 inline h-6 w-6 text-green-cta" />
            <b className="text-green-cta">Zero depreciation=Zero worries!</b> Insurer pays 100% of the repair or replacement cost
          </div>

          <button onClick={() => setModal('note')} className="mb-5 flex w-full items-center justify-between rounded-lg border border-yellow bg-[#fff8e7] px-5 py-3 text-left">
            <span><Gift className="mr-2 inline h-8 w-8 text-brand" /> Upto 5% Welcome Back Reward Unlocked</span>
            <b className="rounded bg-[#c79a3a] px-3 py-1 text-white">+3 Perks</b>
          </button>

          <h1 className="mb-1 text-2xl font-black">
            {visiblePlans.length} plans <span className="text-orange-tag">available from 03 November, 2026</span>
          </h1>
          <p className="mb-5 text-slate2-secondary">Plans NOT available to buy more than 60 days before expiry</p>

          <div className="space-y-4">
            {visiblePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                mode={mode}
                plan={plan}
                onBuy={() => (plan.id === 'zurich' ? setModal('renewal') : navigate(`/car-insurance/summary?plan=${plan.id}&price=${plan.price}`))}
              />
            ))}
          </div>
        </section>

        <BenefitsCard onClaims={() => setModal('claims')} />
      </div>

      <button className="fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-2xl">
        <span className="text-3xl">?</span>
      </button>

      <AnimatePresence>
        {modal === 'edit' && <EditCarModal onClose={() => setModal(null)} />}
        {modal === 'idv' && <IdvModal onClose={() => setModal(null)} />}
        {modal === 'ncb' && <NcbModal onClose={() => setModal(null)} />}
        {modal === 'policy' && <PolicyModal onClose={() => setModal(null)} />}
        {modal === 'claims' && <ClaimsDrawer onClose={() => setModal(null)} />}
        {modal === 'note' && <NoteModal onClose={() => setModal(null)} />}
        {modal === 'renewal' && <RenewalModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </main>
  )
}

function VehicleCard({ onModal, reg, compact }: { onModal: (modal: ModalType) => void; reg: string; compact: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {!compact && (
        <div className="border-b p-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-black">HONDA AMAZE</h2>
            <button onClick={() => onModal('edit')} className="text-sm font-bold text-brand">Edit Car</button>
          </div>
          <p className="text-sm">{reg} | 2021 | Petrol</p>
        </div>
      )}
      <button onClick={() => onModal('idv')} className="flex w-full justify-between border-b px-4 py-3 text-sm">
        <span>IDV Cover (Insured Value)</span><b>Rs5,58,900 <ChevronRight className="inline h-4 w-4" /></b>
      </button>
      {!compact && (
        <>
          <button onClick={() => onModal('ncb')} className="flex w-full justify-between border-b px-4 py-3 text-sm">
            <span>No Claim Bonus (NCB)</span><b>50% <ChevronRight className="inline h-4 w-4" /></b>
          </button>
          <button onClick={() => onModal('policy')} className="flex w-full justify-between px-4 py-3 text-sm">
            <span>Policy Expiry Date</span><b>1-Jan-2027 <ChevronRight className="inline h-4 w-4" /></b>
          </button>
        </>
      )}
    </div>
  )
}

function FilterPanel({
  selectedAddons,
  toggleAddon,
  deductible,
  setDeductible,
}: {
  selectedAddons: string[]
  toggleAddon: (addon: string) => void
  deductible: string
  setDeductible: (value: string) => void
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Sort & Filter</h2>
        <button onClick={() => selectedAddons.forEach(toggleAddon)} className="text-sm text-orange-tag">Clear all</button>
      </div>
      <div className="max-h-[430px] overflow-y-auto rounded-2xl bg-white shadow-sm">
        <FilterGroup title="Last year's addons">
          {lastYearAddons.map((item) => <CheckRow key={item} label={item} checked={selectedAddons.includes(item)} onChange={() => toggleAddon(item)} />)}
        </FilterGroup>
        <FilterGroup title="Addons">
          {addonFilters.map((item) => <CheckRow key={item} label={item} checked={selectedAddons.includes(item)} onChange={() => toggleAddon(item)} />)}
        </FilterGroup>
        <FilterGroup title="Deductibles">
          {['0', '2500', '5000', '7500', '15000'].map((item) => (
            <label key={item} className="mb-3 flex gap-3 text-sm">
              <input type="radio" checked={deductible === item} onChange={() => setDeductible(item)} className="accent-brand" />
              {item === '0' ? 'Zero Deductible' : `Rs${item} Voluntary Deductible`}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Accident covers">
          {['Owner-Driver PA Cover', 'Paid Driver Cover', 'Rs1 Lac Unnamed Passenger Cover', 'Rs2 Lac Unnamed Passenger Cover'].map((item) => (
            <CheckRow key={item} label={item} checked={selectedAddons.includes(item)} onChange={() => toggleAddon(item)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Accessories cover">
          <CheckRow label="Bi-Fuel Kit Cover" checked={selectedAddons.includes('Bi-Fuel Kit Cover')} onChange={() => toggleAddon('Bi-Fuel Kit Cover')} />
          {selectedAddons.includes('Bi-Fuel Kit Cover') && <input className="mb-3 ml-6 w-40 rounded border px-2 py-2" placeholder="Enter amount" />}
          <CheckRow label="Electrical Accessories" checked={selectedAddons.includes('Electrical Accessories')} onChange={() => toggleAddon('Electrical Accessories')} />
          <CheckRow label="Non-Electrical Accessories" checked={selectedAddons.includes('Non-Electrical Accessories')} onChange={() => toggleAddon('Non-Electrical Accessories')} />
        </FilterGroup>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return <div className="border-b p-4"><h3 className="mb-3 flex justify-between font-black">{title}<span>-</span></h3>{children}</div>
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="mb-3 flex gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-brand" />
      <span>{label}<small className="block text-slate2-muted">{label === 'Zero Depreciation' ? "Also called 'Bumper-to-Bumper' cover" : ''}</small></span>
    </label>
  )
}

function PlanTab({ active, title, sub, badge, onClick }: { active: boolean; title: string; sub: string; badge?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex min-h-[66px] flex-1 items-center gap-3 rounded-full px-4 py-2 text-left transition ${active ? 'bg-white shadow-card' : 'bg-transparent'}`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-purple2/10 text-purple2"><ShieldCheck className="h-5 w-5" /></span>
      {badge && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-purple2 text-center text-[10px] font-black leading-3 text-white">35%<br />cheaper</span>}
      <span className="min-w-0"><b className="block text-[15px] leading-5">{title}</b><small className="block text-xs leading-5 text-slate2-muted">{sub}</small></span>
    </button>
  )
}

function PlanCard({ plan, mode, onBuy }: { plan: CarPlan; mode: PlanMode; onBuy: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-brand to-cyan py-2 text-center text-sm font-black text-white">Gift Roadside Assistance Included</div>
      <div className="p-4">
        <p className="mb-3 text-xs font-bold text-slate2-secondary">Cashless Claim Guarantee</p>
        <div className="grid grid-cols-[120px_1fr_110px] items-center gap-4">
          <div className={`grid h-10 place-items-center rounded border bg-white px-2 text-sm font-black ${plan.logo === 'digit' ? 'bg-black text-white' : 'text-cyan'}`}>
            {plan.logoUrl ? <img src={plan.logoUrl} alt={plan.insurer} className="max-h-8 max-w-full object-contain" /> : plan.logo}
          </div>
          <div><p className="text-xs text-slate2-muted">IDV Cover</p><p className="text-lg font-medium">Rs5,58,900</p></div>
          <button onClick={onBuy} className="inline-flex h-12 items-center justify-center gap-1 rounded-lg bg-brand px-3 text-base font-black leading-none text-white shadow-sm">
            <span className="whitespace-nowrap">Rs{plan.price.toLocaleString('en-IN')}</span>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </button>
        </div>
        {mode === 'super' && (
          <div className="mt-4 rounded bg-gray-50 p-3 text-sm">
            <b className="text-green-cta">Pay As You Drive!</b> Choose & pay only for the kms you drive
            <div className="mt-3 flex gap-8">
              <label><input type="radio" defaultChecked className="accent-brand" /> 7,500 km/yr</label>
              <label><input type="radio" className="accent-brand" /> 10,000 km/yr</label>
            </div>
          </div>
        )}
        <div className="mt-3 rounded bg-green-50 px-3 py-2 text-sm font-bold text-green-cta">Shield Zero Depreciation cover (+{mode === 'super' ? 1 : 2} extra addons) <button className="float-right">see all</button></div>
        <div className="mt-3 rounded bg-purple2/5 px-3 py-2 text-sm"><Gift className="mr-2 inline h-5 w-5 text-orange-tag" /> <b>Car Servicing Included</b><small className="ml-2">Get free car wash & oil filter check</small></div>
        <div className="mt-3 flex flex-wrap gap-2">{plan.tags.slice(2).map((tag) => <span key={tag} className="rounded border px-2 py-1 text-xs">{tag}</span>)}</div>
        <div className="mt-4 flex justify-between border-t pt-3 text-sm"><label><input type="radio" className="mr-2" />Add to Compare</label><button className="text-brand">{plan.garages} Cashless Garages</button><button className="underline">Premium Breakup</button></div>
      </div>
    </article>
  )
}

function BenefitsCard({ onClaims }: { onClaims: () => void }) {
  return (
    <aside className="sticky top-24 h-fit rounded-2xl bg-[#fff9e9] shadow-sm">
      <div className="rounded-t-2xl bg-[#77106d] py-5 text-center font-black text-white">AV MANAGEMENT<br />Exclusive Benefits</div>
      <div className="space-y-4 p-8">
        <p className="font-black">Rs440 Crores settled in claims</p>
        {['24x7 claim support, even on holidays', 'Get assigned a dedicated manager'].map((item) => <p key={item}><Star className="mr-2 inline h-4 w-4 fill-yellow text-yellow" />{item}</p>)}
        <div className="rounded bg-[#fff7d6] p-3"><UserRound className="mr-2 inline h-10 w-10 text-brand" /> Amit Sharma, 98*****240</div>
        <p className="border-t pt-5 font-black">1,000+ Network Garages Across India</p>
        {['Nationwide Cashless Claim Support', 'Quick Repairs in 5 Days or Less', 'Car Pick-Up & Drop Service, 365 Days a Year'].map((item) => <p key={item}><Star className="mr-2 inline h-4 w-4 fill-yellow text-yellow" />{item}</p>)}
        <button onClick={onClaims} className="w-full rounded-lg bg-[#ddb64e] py-3 font-black">View all Free Benefits</button>
      </div>
    </aside>
  )
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        {children}
        <button onClick={onClose} className="absolute right-4 top-4"><X /></button>
      </motion.div>
    </motion.div>
  )
}

function EditCarModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="bg-blueBG p-5"><h2 className="text-xl font-black">HONDA AMAZE VX CVT</h2><p>UP16CZ5679 | 2021 | Petrol</p></div><div className="space-y-4 p-5"><h3 className="font-black">Vehicle type</h3><button className="rounded-full border border-brand px-6 py-2 text-brand">Private</button><input className="h-12 w-full rounded border px-4" value="30 October, 2021" readOnly /><input className="h-12 w-full rounded border px-4" value="October-2021" readOnly /><button onClick={onClose} className="h-12 w-full rounded bg-brand font-black text-white">Update</button></div></ModalShell>
}

function IdvModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="bg-blueBG p-5"><h2 className="text-xl font-black">Car insured value (IDV)</h2><p>What the insurer pays in case of total damage/theft</p></div><div className="space-y-4 p-5"><label className="flex justify-between rounded border bg-blueBG p-4"><span><input type="radio" defaultChecked className="accent-brand" /> Recommended IDV</span><b>Rs5,58,900</b></label><label className="block rounded border p-4"><input type="radio" className="accent-brand" /> Choose your own IDV</label><button onClick={onClose} className="h-12 w-full rounded bg-brand font-black text-white">Update</button></div></ModalShell>
}

function NcbModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="bg-blueBG p-5"><h2 className="text-xl font-black">Confirm your existing NCB%</h2><p>This is mentioned in your existing policy document</p></div><div className="p-5"><p className="mb-4 font-black">What is the No Claim Bonus (NCB%) in your current policy?</p><div className="mb-5 flex flex-wrap gap-3">{['0%', '20%', '25%', '35%', '45%'].map((item) => <button key={item} className={`rounded-full border px-6 py-2 ${item === '45%' ? 'border-brand bg-blueBG text-brand' : ''}`}>{item}</button>)}</div><p className="mb-5 rounded bg-green-cta/10 p-3 text-green-cta">You are eligible for 50% NCB in your new policy</p><button onClick={onClose} className="h-12 w-full rounded bg-brand font-black text-white">Confirm and proceed</button></div></ModalShell>
}

function PolicyModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="bg-blueBG p-5"><h2 className="text-xl font-black">Previous policy details</h2></div><div className="space-y-4 p-5"><input className="h-12 w-full rounded border px-4" value="01 January, 2027" readOnly /><input className="h-12 w-full rounded border px-4" value="Zurich Kotak" readOnly /><button onClick={onClose} className="mt-20 h-12 w-full rounded bg-brand font-black text-white">Update</button></div></ModalShell>
}

function NoteModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="p-5"><h2 className="mb-8 text-xl font-black">Please note</h2><p>This plan includes an extra discount for repairing your car at Zurich Kotak's preferred garages at the time of claim.</p><div className="my-5 rounded bg-blueBG p-4"><b>What if the car is repaired at non-preferred garage?</b><p className="mt-2">If you repair elsewhere, an additional Rs5,000 deductible will be applied at non-Zurich Kotak garages.</p></div><button onClick={onClose} className="h-12 w-full rounded bg-brand font-black text-white">I understand and accept</button></div></ModalShell>
}

function RenewalModal({ onClose }: { onClose: () => void }) {
  return <ModalShell onClose={onClose}><div className="p-8 text-center"><div className="mx-auto mb-5 h-28 w-48 rounded bg-blueBG" /><h2 className="mb-5 text-xl font-black">You've still got time for renewal</h2><p>This insurer allows renewal 60 days before your car insurance expires. Please try again after 03 November, 2026.</p></div></ModalShell>
}

function ClaimsDrawer({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-navy/55" onClick={onClose}>
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="ml-auto h-full w-full max-w-3xl overflow-y-auto bg-white" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="float-right m-5"><X /></button>
        <section className="p-8">
          <h2 className="mb-4 text-2xl font-black">Your claim is our responsibility</h2>
          <p>Along with helping crores of people like you find the right insurance, we also take care of your entire claim - from filing to settlement.</p>
          <div className="my-8 grid grid-cols-3 text-center"><b className="text-3xl text-[#d6a32f]">187<br /><span className="text-sm text-navy">AV Management workshops</span></b><b className="text-3xl text-[#d6a32f]">75,000<br /><span className="text-sm text-navy">Claims settled</span></b><b className="text-3xl text-[#d6a32f]">95%<br /><span className="text-sm text-navy">Happy customers</span></b></div>
          <div className="rounded bg-[#fff8e6] p-6"><h3 className="mb-6 font-black">To file claim, call your claim manager and we'll do the rest</h3><div className="grid grid-cols-4 gap-4 text-center">{['Co-ordinate with insurer & garage', 'Arrange all your paperwork', 'Find the best garage near you', 'Ensure highest claim payout'].map((item) => <p key={item}><Wrench className="mx-auto mb-2 text-[#d6a32f]" />{item}</p>)}</div></div>
          <h3 className="mt-8 font-black">Your claim is our responsibility</h3>
          <div className="mt-5 flex gap-4 overflow-x-auto">{['Monu Rawal', 'Arqam Hasan Khan', 'Ravi Kumar'].map((item) => <div key={item} className="min-w-64 rounded border p-4"><div className="mb-3 grid h-24 place-items-center rounded bg-blueBG text-red-500">Play</div><b>{item}</b><p>Ford Figo | 2015</p></div>)}</div>
        </section>
      </motion.aside>
    </motion.div>
  )
}
