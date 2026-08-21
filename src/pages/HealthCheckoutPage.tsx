import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, MessageCircle } from 'lucide-react'
import avLogo from '../assets/images/av-logon.png'
import careLogo from '../assets/images/star.png'

const periods = [
  ['1 Year @', 5945],
  ['2 Years @', 12385],
  ['3 Years @', 19606],
] as const

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-sm">
      <div className="container-pb flex h-[74px] items-center justify-between">
        <Link to="/"><img src={avLogo} alt="AV Management" className="h-16 w-auto object-contain" /></Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#eaf3ff] px-4 py-2 text-sm font-black text-brand">
          <MessageCircle className="h-4 w-4" /> Talk to us
        </button>
      </div>
    </header>
  )
}

function Progress() {
  const steps = ['Proposer', 'Members', 'Medical', 'Nominee', 'Checkout']
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="grid grid-cols-5">
        {steps.map((item, index) => (
          <div key={item} className="relative flex flex-col items-center gap-2 text-xs font-bold text-navy">
            {index > 0 && <span className="absolute right-1/2 top-[10px] h-px w-full bg-green-cta" />}
            <span className="relative z-10 grid h-5 w-5 place-items-center rounded-full border-2 border-green-cta bg-white text-green-cta">
              {index < 4 ? <Check className="h-3 w-3" /> : ''}
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HealthCheckoutPage() {
  const [period, setPeriod] = useState(0)
  const navigate = useNavigate()
  const total = periods[period][1]

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-navy">
      <Header />
      <main className="container-pb grid gap-5 py-7 lg:grid-cols-[1fr_370px]">
        <section className="space-y-5">
          <button onClick={() => navigate('/health-insurance/proposal')} className="inline-flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-5 w-5" /> Go back to Proposal
          </button>
          <Progress />

          <div className="rounded-2xl bg-white p-6">
            <h1 className="text-[26px] font-black">Almost there! Please review your information before payment</h1>
            <h2 className="mt-7 text-lg font-black">Plan for Mohd Faisal</h2>
            <div className="mt-5 grid items-center gap-5 sm:grid-cols-[120px_1fr_160px]">
              <img src={careLogo} alt="Care" className="h-12 w-[100px] rounded border object-contain" />
              <div><b className="text-lg">Ultimate Care (Direct)</b><p className="text-slate2-secondary">Cover Rs25Lakhs</p></div>
              <div className="text-right"><p className="text-sm text-slate2-secondary">Premium - 1 Year</p><b>Rs5,945</b></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="flex justify-between"><h2 className="text-xl font-black">Proposer Details</h2><button className="font-black text-green-cta">Edit &rsaquo;</button></div>
            <p className="mt-2 text-sm text-slate2-secondary">We have shared these details on your email moh############@gmail.com</p>
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {[
                ['Name', 'Mohd Faisal'],
                ['Date of birth', '02-02-2003'],
                ['Gender', 'Female'],
                ['Height', '6 feet 10 inch'],
                ['Weight (kg)', '78'],
                ['Communication Address', 'vrvrw,weffew,Kanpur Nagar,Uttar Pradesh,208007'],
                ['Permanent Address', 'vrvrw,weffew,Kanpur Nagar,Uttar Pradesh,208007'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate2-secondary">{label}</p>
                  <p className="mt-2 font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="flex justify-between"><h2 className="text-xl font-black">Nominee</h2><button className="font-black text-green-cta">Edit &rsaquo;</button></div>
            <p className="mt-6 text-lg font-black text-[#5740c3]">dgih ssw <span className="text-sm text-slate2-secondary">(Father)</span></p>
            <p className="mt-4 text-xs text-slate2-secondary">Date of birth</p>
            <p className="font-black">02-02-1928</p>
          </div>

          <footer className="py-8 text-center text-xs leading-relaxed text-slate2-secondary">
            <p>AV Management Insurance Brokers Private Limited | Registered Office - Gurugram, Haryana - 122001</p>
            <p className="mt-3">AV Management is registered as a Composite Broker. Product information is authentic and solely based on the information received from the insurers.</p>
            <p className="mt-3">Copyright 2008-2026 AV Management. All Rights Reserved.</p>
          </footer>
        </section>

        <aside className="sticky top-24 h-fit overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(31,45,72,.12)]">
          <h2 className="border-b p-5 text-xl font-black">Save more with multi-year plans</h2>
          <div className="space-y-1 p-5">
            <p className="mb-4 font-bold">Select policy period</p>
            {periods.map(([label, price], index) => (
              <button
                key={label}
                onClick={() => setPeriod(index)}
                className="flex w-full items-center gap-4 border-b border-[#e1e6ef] py-4 text-left"
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${period === index ? 'border-green-cta' : 'border-[#8190a6]'}`}>
                  {period === index && <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />}
                </span>
                <span>{label} <b>Rs{price.toLocaleString('en-IN')}</b></span>
              </button>
            ))}
          </div>
          <div className="bg-[#edf5ff] p-5">
            <div className="flex justify-between text-lg"><span>Total Premium</span><b>Rs{total.toLocaleString('en-IN')}/-</b></div>
            <button className="mt-6 h-12 w-full rounded-lg bg-[#ff4f34] font-black text-white">
              Proceed to payment
            </button>
          </div>
          <label className="flex items-center gap-2 p-4 text-sm">
            <span className="grid h-5 w-5 place-items-center rounded bg-green-cta text-white"><Check className="h-3 w-3" /></span>
            Get updates on <b className="text-green-cta">WhatsApp</b>
          </label>
        </aside>
      </main>
    </div>
  )
}
