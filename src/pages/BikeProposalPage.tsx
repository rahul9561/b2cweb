import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bike, Lock, ShieldCheck } from 'lucide-react'
import logo from '../assets/images/av-logon.png'

export default function BikeProposalPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [years, setYears] = useState('1')
  const price = Number(params.get('price') || 714)
  const plan = params.get('plan') || 'Bajaj General'
  const type = params.get('type') === 'comprehensive' ? 'Comprehensive' : 'Third-party'
  const gst = Math.round(price * 0.18)
  const finalPremium = price + gst

  return (
    <main className="min-h-screen bg-[#eef5ff] text-navy">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="Go to AV Management home"><img src={logo} alt="AV Management" className="h-12 w-auto" /></Link>
          <button className="rounded-lg border border-brand px-5 py-2 font-bold text-white">Call us</button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="mb-5 text-sm font-bold text-brand"><ArrowLeft className="mr-1 inline h-4 w-4" /> Back To Plans Page</button>
        <div className="grid gap-6 lg:grid-cols-[1fr_410px]">
          <section className="rounded-lg bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-black">Hi <span className="text-green-cta">Arifh!</span> Great Choice</h1>
            <p className="mt-4 font-medium">85% of the vehicles stolen in India are two wheelers, let's protect yours!</p>
            <div className="mt-8 grid gap-4 md:grid-cols-[100px_1fr]">
              <label className="rounded-lg border px-4 py-3"><span className="text-xs">Title</span><select className="mt-1 w-full font-black outline-none"><option>Mr.</option><option>Ms.</option></select></label>
              <InputLine label="Vehicle owner name" value="Arifh Ah***" editable />
              <InputLine label="Mobile number" value="78*****007" editable wide />
              <InputLine label="Email address" value="moh***********@gmail.com" editable wide />
            </div>
            <p className="mt-5 text-sm text-slate2-muted"><ShieldCheck className="mr-2 inline h-4 w-4 text-brand" />Above details will be used for policy related communication.</p>
            <div className="mt-8 rounded-lg bg-green-cta/5 p-6">
              <h2 className="text-xl font-black text-green-cta">Save More with a Multi-Year Plan</h2>
              <p className="mt-2 text-sm">Enjoy exclusive discounts and don't worry about annual renewals</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  ['1', price],
                  ['2', price * 2],
                  ['3', price * 3],
                ].map(([year, amount]) => (
                  <label key={year} className={`rounded-lg border px-4 py-3 font-bold ${years === year ? 'border-brand bg-white text-brand' : 'bg-white'}`}>
                    <input type="radio" checked={years === year} onChange={() => setYears(String(year))} className="mr-2 accent-brand" />
                    {year} year @ Rs{Number(amount).toLocaleString('en-IN')}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-lg bg-white shadow-card">
            <div className="border-b p-5">
              <div className="flex justify-between"><div><h2 className="text-lg font-black">Honda CB Shine</h2><p className="text-sm text-slate2-secondary">UP32FJ6317 | Registered in 2014</p></div><Bike className="h-12 w-12" /></div>
            </div>
            <div className="p-5">
              <div className="mb-5 flex gap-4"><div className="grid h-12 w-24 place-items-center rounded bg-blueBG font-black text-brand">B</div><div><h3 className="font-black">{plan}</h3><p className="text-sm">1 Year {type}</p><p className="text-sm text-slate2-secondary">IDV: Rs17,596</p></div></div>
              <label className="mb-5 flex rounded-lg bg-[#fff0e4] p-4 text-sm"><span><b className="block text-orange-error">Compulsory personal accident cover of Rs15 Lakh @Rs310 for 1 year</b>Not having this may lead to rejection of claim</span><input type="checkbox" className="ml-auto accent-brand" /></label>
              <h3 className="mb-4 text-lg font-black">Premium details</h3>
              <Summary label="Plan premium" value={`Rs${price.toLocaleString('en-IN')}`} />
              <Summary label="GST" value={`Rs${gst.toLocaleString('en-IN')}`} />
              <div className="mt-5 flex justify-between border-t pt-5 text-lg font-black"><span>Final premium</span><span className="text-brand">Rs{finalPremium.toLocaleString('en-IN')}</span></div>
              <button onClick={() => navigate('/bike-insurance/redirecting')} className="mt-5 h-14 w-full rounded-lg bg-brand text-lg font-black text-white"><Lock className="mr-2 inline h-5 w-5" />Pay securely</button>
              <p className="mt-4 text-xs">By clicking on Pay securely, I agree to the terms & conditions</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function InputLine({ label, value, editable, wide }: { label: string; value: string; editable?: boolean; wide?: boolean }) {
  return <label className={`rounded-lg border px-4 py-3 ${wide ? 'md:col-span-2' : ''}`}><span className="text-xs text-slate2-muted">{label}</span><span className="mt-1 flex justify-between"><b>{value}</b>{editable && <button className="text-sm text-brand">Edit</button>}</span></label>
}

function Summary({ label, value }: { label: string; value: string }) {
  return <p className="mb-3 flex justify-between"><span className="text-slate2-secondary">{label}</span><b>{value}</b></p>
}
