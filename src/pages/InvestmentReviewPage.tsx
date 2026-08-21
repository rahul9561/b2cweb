import { useNavigate } from 'react-router-dom'
import { ChevronDown, Headphones } from 'lucide-react'
import logo from '../assets/images/av-logon.png'

export default function InvestmentReviewPage() {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen bg-[#f1f3f8] pb-28 text-navy">
      <header className="sticky top-0 z-30 border-b border-slate2-border bg-white">
        <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-between px-5">
          <img src={logo} alt="AV Management" className="h-12 w-auto object-contain" />
          <button className="inline-flex items-center gap-2 text-sm font-bold text-brand"><Headphones className="h-4 w-4" /> Talk to an Expert</button>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-4xl rounded-lg bg-white shadow-card">
        <div className="flex items-center gap-5 border-b border-slate2-border px-14 py-7">
          <div className="grid h-12 w-44 place-items-center rounded bg-white text-sm font-black text-brand shadow-sm">AV PRIME</div>
          <h1 className="text-base font-black">Save N Grow Plus- Assure</h1>
        </div>

        <div className="px-14 py-7">
          <h2 className="text-xl font-black">Review below details before proceeding</h2>
          <p className="mt-1 text-sm italic text-[#9b7400]">These details cannot be changed at a later stage</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ReviewBox label="Name" value="Mohd Faisal" />
            <ReviewBox label="Date of Birth" value="22/09/2002" />
            <ReviewBox label="Email" value="m************9@gmail.com" />
            <ReviewBox label="Mobile Number" value="******9007" />
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-slate2-border">
            <h3 className="bg-[#f7f7ff] px-5 py-4 text-lg font-black">
              Plan Details <span className="ml-2 text-sm font-bold">(This Solution is a combination of 2 Plans)</span>
            </h3>
            <div className="space-y-6 p-6">
              <PlanRow title="Plan A" values={['EzyGrow', '105L189V08', 'Rs 2,859']} />
              <PlanRow title="Plan B" values={['GIFT Assure', '105N224V03', 'Rs 2,141']} />
            </div>
          </div>

          <button className="mt-5 flex w-full items-center justify-between rounded-lg border border-slate2-border bg-[#f7f7ff] px-5 py-4 text-left text-lg font-black">
            Additional Details <ChevronDown className="h-5 w-5 text-slate2-muted" />
          </button>

          <div className="mt-5 rounded-lg border border-slate2-border bg-[#f7f7ff] p-6">
            <h3 className="mb-5 text-lg font-black">Declarations</h3>
            {[
              'AV Management will send you updates on your policy, new products & services, insurance solutions or related information.',
              'I/We have read and understood the product details and Electronic Benefit Illustration. I/We agree to purchase this product on merits and suitability of the product, based on the information provided by me.',
              'I Agree to the terms and conditions',
            ].map((text) => (
              <label key={text} className="mb-4 flex items-start gap-3 text-base font-medium">
                <input type="checkbox" defaultChecked className="mt-1 h-5 w-5 accent-brand" />
                <span>{text}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200 bg-[#e8f3ff]/95 shadow-[0_-6px_24px_rgba(0,101,255,0.12)] backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-[1fr_126px_200px] items-center gap-3 px-4 py-4">
          <div>
            <p className="text-lg font-black">Total Premium&nbsp; <span>Rs 5,000</span> <span className="text-sm font-normal">Monthly</span></p>
            <p className="text-sm">(Base Premium <b>Rs 5,000</b> + GST <span className="line-through">Rs 98</span> <b className="text-green-cta">Rs 0</b> )</p>
          </div>
          <button onClick={() => navigate('/investment-plans/proposal')} className="rounded border border-brand bg-white px-4 py-4 font-black text-brand">
            EDIT DETAILS
          </button>
          <button onClick={() => navigate('/investment-plans/payment')} className="rounded bg-brand px-5 py-4 font-black text-white">
            CHECKOUT
          </button>
        </div>
      </div>
    </main>
  )
}

function ReviewBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate2-border bg-[#f7f7ff] px-4 py-3">
      <p className="text-sm text-slate2-secondary">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  )
}

function PlanRow({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-black">{title}</h4>
      <div className="grid gap-2 md:grid-cols-3">
        {['Name', 'UIN', 'Premium'].map((label, index) => (
          <div key={label} className="rounded bg-[#f7f7ff] p-3">
            <p className="text-sm text-slate2-secondary">{label}</p>
            <p className="font-black">{values[index]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
