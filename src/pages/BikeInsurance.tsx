import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Languages, Phone, Star, Zap } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import heroImage from '../assets/images/loan.png'

export default function BikeInsurance() {
  const navigate = useNavigate()
  const [bikeNumber, setBikeNumber] = useState('')
  const [mobile, setMobile] = useState('')
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const cleanNumber = bikeNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const valid = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(cleanNumber)

  const submit = () => {
    if (!valid) return
    navigate(`/bike-insurance/loading?reg=${cleanNumber}&mobile=${mobile}`)
  }

  return (
    <main className="min-h-screen bg-white text-navy">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home"><img src={logo} alt="AV Management" className="h-12 w-auto" /></Link>
          <button className="rounded-full border border-brand bg-black px-5 py-2 text-sm font-black text-white"><Phone className="mr-1 inline h-4 w-4" /> Get Help</button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[520px] max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-[1fr_520px]">
        <div className="relative grid place-items-center">
          <div className="absolute h-80 w-80 rounded-full bg-[#eef7ff]" />
          <img src={heroImage} alt="AV Management bike insurance expert" className="relative z-10 max-h-[390px] w-auto object-contain" />
        </div>

        <div>
          <h1 className="text-3xl font-light leading-tight">Buy two-wheeler insurance in <br /><b>60 seconds!</b> <Zap className="inline h-7 w-7 fill-yellow text-yellow" /></h1>
          <div className="my-5 h-0.5 w-44 bg-yellow" />
          <p className="mb-6 text-sm text-slate2-secondary">Plan starting @ <span className="text-lg font-black text-purple2">Rs1.3/day*</span></p>
          <label className="mb-4 block rounded-lg border border-slate2-border bg-white px-5 py-4 shadow-sm">
            <input value={bikeNumber} onChange={(event) => setBikeNumber(event.target.value.toUpperCase())} placeholder="Enter bike number:  (eg. UP-15-AB-1234)" className="w-full text-xl outline-none placeholder:text-slate2-muted" />
          </label>
          {!valid && bikeNumber && <p className="-mt-3 mb-4 text-sm font-bold text-red-500">Enter number like UP-32-FJ-6317</p>}
          <label className="mb-5 flex rounded-lg border border-slate2-border bg-white px-5 py-3 shadow-sm">
            <span className="border-r pr-4 font-black">+91</span>
            <input value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional mobile number" className="ml-4 flex-1 outline-none" />
          </label>
          <button onClick={submit} className="h-14 w-full rounded-lg bg-brand text-lg font-black text-white shadow-card disabled:opacity-50" disabled={!valid}>
            View Prices
          </button>
          <div className="mt-7 flex justify-between text-sm font-bold text-brand">
            <button>Don't have bike number?</button>
            <button>Buying a new bike?</button>
          </div>
          <div className="mt-16 text-center text-sm">
            <Languages className="mr-2 inline h-4 w-4 text-slate2-muted" /> Switch Language :
            <span className="ml-2 font-bold text-brand">Kannada | Malayalam | Tamil | Telugu | Punjabi | Marathi | Hindi</span>
          </div>
        </div>
      </section>

      <section className="border-y bg-white py-5 shadow-[0_-6px_18px_rgba(0,0,0,0.04)]">
        <div className="mx-auto grid max-w-4xl grid-cols-4 text-center">
          <TrustMetric title="We are rated" sub="Source - Google Review Rating" stars />
          <TrustMetric title="1.2 crore" sub="Bikes insured" />
          <TrustMetric title="1.7 crore" sub="Policies sold" />
          <TrustMetric title="20" sub="Insurance partners" />
        </div>
      </section>

      <section className="mx-auto my-20 max-w-5xl overflow-hidden rounded-lg border bg-white">
        <button
          onClick={() => setDisclaimerOpen((open) => !open)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-black"
          aria-expanded={disclaimerOpen}
        >
          Disclaimer
          <ChevronDown className={`h-5 w-5 transition-transform ${disclaimerOpen ? 'rotate-180' : ''}`} />
        </button>
        {disclaimerOpen && (
          <div className="border-t px-5 py-5 text-sm leading-7 text-slate2-secondary">
            <p>*Savings are based on the comparison between the highest and the lowest premium for own damage cover provided by different insurance companies for the same vehicle with the same IDV and same NCB.</p>
            <p>*Rs1.3/day is an indicative third-party motor insurance premium for eligible private electric two-wheelers and may vary by vehicle category, RTO, policy tenure, insurer rules and GST.</p>
            <p>The purchase or renewal of an insurance policy is subject to insurer underwriting, document verification, operational availability and additional data requirements.</p>
          </div>
        )}
      </section>
    </main>
  )
}

function TrustMetric({ title, sub, stars }: { title: string; sub: string; stars?: boolean }) {
  return (
    <div className="border-r last:border-r-0">
      <p className="text-xl font-black">{title}</p>
      {stars && <p className="mt-1 text-yellow">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="inline h-4 w-4 fill-yellow" />)}</p>}
      <p className="mt-1 text-xs text-slate2-secondary">{sub}</p>
    </div>
  )
}
