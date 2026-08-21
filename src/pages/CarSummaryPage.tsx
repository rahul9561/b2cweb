import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, Gift } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import zunoLogo from '../assets/images/zuno.png'

export default function CarSummaryPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const premium = Number(params.get('price') || 3526)
  const gst = Math.round(premium * 0.18)
  const paCover = 378
  const total = premium + gst + paCover

  const pay = () => {
    setLoading(true)
    window.setTimeout(() => navigate('/car-insurance/payment'), 1400)
  }

  return (
    <main className="min-h-screen bg-[#eef5ff] text-navy">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home">
            <img src={logo} alt="AV Management" className="h-12 w-auto" />
          </Link>
          <button className="rounded-lg border border-brand px-5 py-2 font-bold text-brand">Need Help?</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <button onClick={() => navigate(-1)} className="font-bold text-brand"><ArrowLeft className="mr-2 inline h-4 w-4" />Back</button>
          <h1 className="text-2xl font-black">Summary</h1>

          <div className="rounded-2xl border border-[#e0b847] bg-white p-6 shadow-sm">
            <span className="-ml-6 -mt-6 mb-5 inline-flex rounded-br bg-[#d4aa3d] px-3 py-1 text-xs font-bold text-white">Assured by AV Management | Explore</span>
            <div className="flex items-center gap-5">
              <div className="grid h-16 w-24 place-items-center rounded border bg-white px-3"><img src={zunoLogo} alt="Zuno Insurance" className="max-h-10 object-contain" /></div>
              <div>
                <p>Zuno Insurance</p>
                <h2 className="font-black">Comprehensive policy</h2>
              </div>
              <button className="ml-auto text-sm font-bold text-brand">See what's covered <ArrowRight className="inline h-4 w-4" /></button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <h2 className="bg-blueBG px-8 py-5 text-xl font-black">Confirm & Pay</h2>
            <div className="space-y-6 p-8">
              <div>
                <p className="mb-3 font-bold">Car registration date (as per RC)</p>
                <div className="grid max-w-md grid-cols-3 gap-4">
                  {['1', 'August', '2023'].map((item) => <SelectBox key={item}>{item}</SelectBox>)}
                </div>
              </div>
              <RadioRow title="Existing policy type" options={['Third Party', 'Comprehensive/Package']} active="Comprehensive/Package" />
              <RadioRow title="Car is owned by" options={['A Company', 'An Individual']} active="An Individual" />
              <RadioRow title="Car ownership changed in last 12 months?" options={['Yes', 'No']} active="No" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">MARUTI 800 LPG (796cc)</h3>
            <p className="mt-2">LPG - 2023 - UP32AB1234</p>
          </div>
        </section>

        <aside className="sticky top-6 h-fit space-y-4">
          <div className="rounded-lg bg-white p-5 shadow-card">
            <h2 className="mb-5 font-black">Plan Summary</h2>
            <SummaryRow label="IDV Cover" value="Rs1,09,736" />
            <SummaryRow label="NCB%" value="0%" />
            <SummaryRow label="Premium Amount" value={`Rs${premium.toLocaleString('en-IN')}`} />
            <SummaryRow label="GST @18%" value={`+ Rs${gst.toLocaleString('en-IN')}`} />
            <p className="my-4 flex items-center justify-between border-y py-4">
              <span><Gift className="mr-2 inline h-5 w-5 text-orange-tag" />Car Servicing Included</span><b className="text-green-cta">Free</b>
            </p>
            <label className="mb-5 flex rounded border border-brand bg-blueBG p-3 text-sm"><input type="checkbox" className="mr-3 accent-brand" /> Personal Accident cover of Rs15 lakhs by Digit <b className="ml-auto">+ Rs{paCover}</b></label>
            <div className="mb-4 flex items-center justify-between text-xl font-black"><span>You'll Pay</span><span className="text-orange-error">Rs{total.toLocaleString('en-IN')}</span></div>
            <button onClick={pay} className="h-12 w-full rounded bg-[#ff4b1f] text-lg font-black text-white">PAY SECURELY <ArrowRight className="ml-2 inline h-5 w-5" /></button>
            <label className="mt-4 block text-xs"><input type="checkbox" defaultChecked className="mr-2 accent-brand" />Get updates on Whatsapp</label>
            <label className="mt-3 block text-xs"><input type="checkbox" defaultChecked className="mr-2 accent-brand" />I agree to the terms & conditions and confirm my details.</label>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="rounded bg-[#e8f4c9] px-3 py-1 text-sm font-bold">Next step</span>
            <p className="mt-3 text-sm">After payment, we'll ask you to fill a few details and complete your KYC for policy issuance.</p>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-navy/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="mx-auto mb-8 h-24 w-28 rounded-lg bg-blueBG p-5">
                <div className="mb-4 h-2 rounded bg-brand" />
                <div className="mx-auto mb-3 h-2 w-10 rounded bg-slate2-border" />
                <div className="mx-auto h-2 w-16 rounded bg-slate2-border" />
              </div>
              <h2 className="text-lg font-black">We are verifying the premium from the insurer.</h2>
              <p className="mt-2 font-bold">This may take a couple of seconds.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function SelectBox({ children }: { children: string }) {
  return <button className="flex h-12 items-center justify-between rounded-lg border border-slate2-muted px-5">{children}<ChevronDown className="h-4 w-4" /></button>
}

function RadioRow({ title, options, active }: { title: string; options: string[]; active: string }) {
  return (
    <div>
      <p className="mb-3 font-bold">{title}</p>
      <div className="flex gap-14">
        {options.map((option) => (
          <label key={option} className="text-brand"><input type="radio" name={title} defaultChecked={option === active} className="mr-3 accent-brand" />{option}</label>
        ))}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <p className="mb-3 flex justify-between"><span className="text-slate2-secondary">{label}</span><b>{value}</b></p>
}
