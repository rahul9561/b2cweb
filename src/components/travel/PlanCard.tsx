import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PlanCard({ plan }: any) {
  const navigate = useNavigate()
  return (
    <article className="rounded-cardlg bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-12 rounded bg-slate-100 flex items-center justify-center text-sm font-bold">{plan.insurer.split(' ').map((n: string)=>n[0]).join('')}</div>
          <div>
            <div className="text-[14px] font-bold text-navy">{plan.insurer}</div>
            <div className="text-[12px] text-slate-500">{plan.plan}</div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-slate-600"><input type="checkbox"/> Compare</label>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[13px] text-slate-600"><Check size={14} className="text-brand"/> <span className="font-medium">{plan.note}</span></div>

      <ul className="mt-4 space-y-2 text-[13px]">
        <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="rounded bg-green-50 px-2 py-1 text-green-700">Medical Expenses</span></span><span className="font-bold bg-green-50 px-2 py-1 rounded">₹{plan.medical.toLocaleString()}</span></li>
        <li className="flex items-center justify-between text-[13px]"><span>Pre-Existing Disease</span><span className={plan.pedCovered ? 'font-bold text-green-700' : 'text-red-500'}>{plan.pedCovered ? `₹${plan.ped.toLocaleString()}` : '—'}</span></li>
        <li className="flex items-center justify-between"><span>Baggage Loss</span><span className="font-bold">₹{plan.baggage}</span></li>
        <li className="flex items-center justify-between"><span>Trip Cancellation</span><span className="font-bold">₹{plan.cancel}</span></li>
        <li className="flex items-center justify-between"><span>Personal Accident</span><span className="font-bold">₹{plan.accident}</span></li>
      </ul>

      <div className={`mt-4 rounded px-3 py-2 text-[13px] ${plan.pedCovered ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'}`}>{plan.pedCovered ? 'All pre-existing diseases covered' : 'Limited pre-existing diseases covered'}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(plan.coverages || []).map((c: string) => (
          <span key={c} className="rounded-full bg-slate-50 px-2 py-1 text-[12px] text-slate-700">{c}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-[12px] text-slate-600">Total Premium</div>
        <div className="flex items-center gap-4">
          <div className="text-[18px] font-bold">₹{plan.premium.toLocaleString()}</div>
            <button onClick={() => navigate('/travel-insurance/checkout', { state: { plan } })} className="rounded bg-brand px-4 py-2 text-white">Proceed</button>
        </div>
      </div>
    </article>
  )
}
