import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronDown, Heart, MessageCircle } from 'lucide-react'
import avLogo from '../assets/images/av-logon.png'
import careLogo from '../assets/images/star.png'
import adityaLogo from '../assets/images/aditya_birla.png'

const periods = [
  { label: '1 Year', price: 6446 },
  { label: '2 Years', price: 13372 },
  { label: '3 Years', price: 21078, tag: 'Most popular' },
]

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-sm">
      <div className="container-pb flex h-[74px] items-center justify-between">
        <Link to="/" className="inline-flex items-center">
          <img src={avLogo} alt="AV Management" className="h-16 w-auto object-contain" />
        </Link>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#eaf3ff] px-4 py-2 text-sm font-black text-brand">
          <MessageCircle className="h-4 w-4" /> Talk to us
        </button>
      </div>
    </header>
  )
}

function Summary({ total, selectedAddOn }: { total: number; selectedAddOn: boolean }) {
  const navigate = useNavigate()
  return (
    <aside className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(31,45,72,.12)]">
      <div className="border-b border-[#c7cfdb] p-4 text-xl font-black text-navy">Summary</div>
      <div className="space-y-5 p-4 text-sm text-navy">
        <div className="flex justify-between"><span>Premium - 1 year</span><b>Rs6,446</b></div>
        <div>
          <b>Select Rider(s)</b>
          <button className="mt-3 flex w-full justify-between rounded border border-dashed border-[#aeb8c8] px-4 py-3 text-slate2-secondary">
            Missing out on benefits <span className="font-bold text-green-cta">View riders</span>
          </button>
        </div>
        <div>
          <b>{selectedAddOn ? 'Selected Add-ons' : 'Select Add-ons'}</b>
          <div className="mt-3 flex w-full justify-between rounded border border-dashed border-[#aeb8c8] px-4 py-3">
            <span>{selectedAddOn ? 'Cancer Secure(Self)' : 'No add-ons selected'}</span>
            <span className="font-bold text-green-cta">{selectedAddOn ? 'Rs2,298' : 'View add-ons'}</span>
          </div>
        </div>
        <label className="flex items-center gap-2 font-semibold">
          <span className="h-5 w-5 rounded border border-[#8aa0bb]" /> I want to port my existing policy
        </label>
      </div>
      <div className="border-t bg-[#f5f6f8] p-4">
        <div className="flex justify-between text-base font-black text-navy"><span>Total premium</span><span>Rs{total.toLocaleString('en-IN')}</span></div>
      </div>
      <div className="bg-[#ecfff8] px-4 py-3 text-center text-sm text-navy">
        Get up to <b>Rs{selectedAddOn ? '2,623' : '1,934'}</b> in benefits. <span className="font-bold text-green-cta">See how</span>
      </div>
      <div className="p-4">
        <button
          type="button"
          onClick={() => navigate('/health-insurance/proposal')}
          className="h-12 w-full rounded-lg bg-[#ff4f34] text-base font-black text-white shadow-[0_10px_24px_rgba(255,79,52,.22)] transition hover:bg-[#f3442a]"
        >
          Proceed to proposal
        </button>
      </div>
    </aside>
  )
}

export default function HealthProductDetailPage() {
  const navigate = useNavigate()
  const [cover, setCover] = useState('Rs25 Lakh')
  const [option, setOption] = useState<'basic' | 'enhanced'>('basic')
  const [period, setPeriod] = useState(0)
  const [selectedAddOn, setSelectedAddOn] = useState(false)
  const total = useMemo(() => periods[period].price + (selectedAddOn ? 2298 : 0) + (option === 'enhanced' ? 1899 : 0), [period, selectedAddOn, option])

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-navy">
      <Header />
      <main className="container-pb grid gap-5 py-7 lg:grid-cols-[1fr_370px]">
        <section className="space-y-4">
          <button onClick={() => navigate('/health-insurance/quotes')} className="mb-2 inline-flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-5 w-5" /> Go back to quotes
          </button>

          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center gap-4 p-4">
              <img src={careLogo} alt="Care Health" className="h-14 w-[96px] rounded border object-contain" />
              <div className="flex-1">
                <h1 className="text-xl font-black">Ultimate Care (Direct) <Heart className="inline h-5 w-5 text-slate2-secondary" /></h1>
                <p className="mt-2 font-semibold text-green-cta">View all features <span className="mx-3 text-slate2-secondary">.</span> 61 Cashless hospitals (+Cashless anywhere support)</p>
              </div>
            </div>
            <div className="bg-[#dff8fb] py-3 text-center text-sm font-bold text-[#00a1b5]">AV Management is a 5 Star Partner for Care Health</div>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Cover Amount</h2>
            <p className="mt-2 text-sm text-slate2-secondary">Medical treatments are getting costlier every year. Higher the cover better it is.</p>
            <label className="mt-5 flex h-14 max-w-[330px] items-center justify-between rounded-lg border border-[#53657e] px-4 text-base font-black">
              <select value={cover} onChange={(e) => setCover(e.target.value)} className="w-full bg-transparent outline-none">
                {['Rs5 Lakh', 'Rs10 Lakh', 'Rs25 Lakh', 'Rs50 Lakh', 'Unlimited'].map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown className="h-5 w-5" />
            </label>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Select an option that fits your needs</h2>
            {[
              ['basic', 'Basic Protection @ Rs6,446', 'Basic plan features + Add more features'],
              ['enhanced', 'Enhanced Protection @ Rs8,345', 'All inbuilt plan features are included, Consumables Cover, 100% increase in SI every year'],
            ].map(([key, title, text]) => (
              <button
                key={key}
                type="button"
                onClick={() => setOption(key as 'basic' | 'enhanced')}
                className={`mt-5 block w-full rounded-xl border p-4 text-left transition ${option === key ? 'border-green-cta bg-green-cta/7' : 'border-[#d7dde7] bg-white'}`}
              >
                <span className="flex items-center gap-3 text-lg font-black">
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${option === key ? 'border-green-cta' : 'border-[#8190a6]'}`}>
                    {option === key && <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />}
                  </span>
                  {title}
                </span>
                <span className="ml-8 mt-3 block text-sm text-slate2-secondary"><Check className="inline h-4 w-4 text-green-cta" /> {text}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Policy Period</h2>
            <p className="mt-2 text-sm text-slate2-secondary">Choosing a multi-year plan saves your money and the trouble of remembering yearly renewals.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {periods.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setPeriod(index)}
                  className={`relative rounded-lg border p-4 text-left font-semibold ${period === index ? 'border-green-cta bg-green-cta/7' : 'border-[#aeb8c8] bg-white'}`}
                >
                  {item.tag && <span className="absolute -top-3 right-3 rounded bg-[#eadfff] px-3 py-1 text-xs font-black text-[#6d3fc7]">{item.tag}</span>}
                  <span className={`mr-3 inline-block h-5 w-5 rounded-full border-2 align-middle ${period === index ? 'border-green-cta bg-green-cta' : 'border-[#8190a6]'}`} />
                  {item.label} @ <b>Rs{item.price.toLocaleString('en-IN')}</b>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#dfeaff] p-6">
            <div>
              <h2 className="text-xl font-black">Decode Your Plan with Expert Help!</h2>
              <p className="mt-2 text-slate2-secondary">Need help understanding your chosen health plan? Schedule a call now for detailed insights!</p>
            </div>
            <button className="rounded-xl bg-white px-7 py-4 font-black text-brand shadow">Talk to our advisor &rsaquo;</button>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Riders</h2>
            {['Claim-Shield', 'Money Back', 'Infinity Bonus'].map((item, index) => (
              <div key={item} className="mt-4 grid gap-4 rounded-lg border border-[#d7dde7] p-4 sm:grid-cols-[1fr_90px_80px]">
                <div>
                  <b className="text-lg">{item} <span className="rounded bg-[#eadfff] px-2 py-1 text-xs text-[#6d3fc7]">Must Have</span></b>
                  <p className="mt-2 text-sm text-slate2-secondary">{index === 0 ? 'Non-payable items will be covered.' : index === 1 ? 'Get a refund of your first year base premium after every 5 claim-free years.' : 'Get an unlimited 100% increase in your Sum Insured every year.'}</p>
                </div>
                <div><span className="text-sm text-slate2-secondary">Premium</span><b className="block">Rs{[656, 794, 838][index]}</b></div>
                <button className="rounded-lg border border-[#ff4f34] font-black text-[#ff4f34]">+ Add</button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Recommended Add-Ons</h2>
            <div className="mt-5 rounded-lg border border-[#d7dde7] p-4">
              <div className="grid gap-4 sm:grid-cols-[90px_1fr_90px_100px]">
                <img src={adityaLogo} alt="Aditya Birla" className="h-11 rounded border object-contain" />
                <div>
                  <b className="text-lg">Cancer Secure</b>
                  <p className="mt-1 text-sm text-slate2-secondary">Member(s): Self</p>
                  <p className="mt-2 text-sm text-slate2-secondary">Option to have a secondary doctor opinion. Wellness coach benefits.</p>
                </div>
                <div><span className="text-sm">Cover</span><b className="block">Rs25L</b></div>
                <button onClick={() => setSelectedAddOn((v) => !v)} className={`rounded-lg border font-black ${selectedAddOn ? 'border-green-cta text-green-cta' : 'border-[#ff4f34] text-[#ff4f34]'}`}>
                  {selectedAddOn ? 'Added' : '+ Add'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-xl font-black">Members Covered</h2>
            <p className="mt-4 text-lg">Mohd Faisal(27)</p>
          </div>
        </section>

        <Summary total={total} selectedAddOn={selectedAddOn} />
      </main>
    </div>
  )
}
