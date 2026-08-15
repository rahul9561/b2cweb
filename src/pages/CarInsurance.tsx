import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Pencil, Phone } from 'lucide-react'
import logo from '../assets/images/av-logon.png'

export default function CarInsurance() {
  const navigate = useNavigate()
  const [carNumber, setCarNumber] = useState('')
  const [mobile, setMobile] = useState('')
  const cleanNumber = carNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const valid = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(cleanNumber)

  const submit = () => {
    if (!valid) return
    navigate(`/car-insurance/quotes?reg=${cleanNumber}&mobile=${mobile}`)
  }

  return (
    <main className="min-h-screen bg-[#eef5ff] text-navy">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home">
            <img src={logo} alt="AV Management" className="h-12 w-auto" />
          </Link>
          <button className="rounded-full border border-brand bg-black px-5 py-2 text-sm font-black text-white"><Phone className="mr-1 inline h-4 w-4" /> Get Help</button>
        </div>
      </header>
      <section className="mx-auto grid max-w-5xl gap-20 px-4 py-16 lg:grid-cols-[330px_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <p className="mb-4 flex items-center gap-3 text-lg"><CheckCircle2 className="h-6 w-6 text-green-cta" /> We have found your car</p>
          <h1 className="text-xl font-black">HONDA AMAZE</h1>
          <p className="mt-2 text-sm text-slate2-secondary">Petrol - 2021</p>
          <button className="float-right text-brand"><Pencil className="h-4 w-4" /></button>
        </div>
        <div className="rounded-2xl bg-[#ddecff] p-8">
          <h2 className="mb-7 text-xl font-black">Almost done! Just one last step</h2>
          <label className="mb-5 block rounded-lg border bg-white px-5 py-3">
            <span className="text-xs font-bold text-slate2-secondary">CAR NUMBER</span>
            <input value={carNumber} onChange={(e) => setCarNumber(e.target.value.toUpperCase())} placeholder="UP-32-AB-3456" className="mt-1 w-full text-lg font-black outline-none" />
          </label>
          {!valid && carNumber && <p className="-mt-3 mb-4 text-sm font-bold text-red-500">Enter number like UP-32-AB-3456</p>}
          <label className="mb-6 flex rounded-lg border bg-white px-5 py-3">
            <span className="border-r pr-4 font-black">+91</span>
            <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional mobile number" className="ml-4 flex-1 outline-none" />
          </label>
          <button onClick={submit} className="h-14 w-full rounded-lg bg-[#ff5630] text-lg font-black text-white disabled:opacity-50" disabled={!valid}>
            View Car Prices <ArrowRight className="ml-2 inline h-5 w-5" />
          </button>
          <p className="mt-5 text-center text-xs text-slate2-secondary">By clicking View Prices, you agree to Privacy Policy & Terms of Use.</p>
        </div>
      </section>
    </main>
  )
}
