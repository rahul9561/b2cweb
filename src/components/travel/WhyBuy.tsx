import { Headphones, ShieldCheck, Zap } from 'lucide-react'

export default function WhyBuy() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-cardlg bg-white p-6 shadow-card">
        <h3 className="text-[16px] font-bold text-navy">Why buy from AV Management</h3>
        <ul className="mt-4 space-y-3 text-[13px] text-slate-700">
          <li className="flex items-start gap-3"><Headphones className="mt-1 text-brand"/> Claim assistance anytime, anywhere!</li>
          <li className="flex items-start gap-3"><ShieldCheck className="mt-1 text-brand"/> Compare and choose best plan as per your requirements</li>
          <li className="flex items-start gap-3"><Zap className="mt-1 text-brand"/> Get your policy instantly with quick and easy KYC Process</li>
        </ul>
        <div className="mt-4"><a className="text-brand font-semibold">Know more ›</a></div>
      </div>

      <div className="rounded-cardlg bg-blue-50 p-6 shadow-card flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-navy">Need help picking a plan?</h3>
          <p className="mt-2 text-[13px] text-slate-600">Our advisor will simplify it for you</p>
          <div className="mt-4"><button className="rounded bg-white px-4 py-2 font-semibold">Talk to our advisor ›</button></div>
        </div>

        <div className="hidden md:block">
          <img src="https://static.pbcdn.in/travel-cdn/images/illustrations/advisor.png" alt="advisor" className="h-28 w-28 object-contain" />
        </div>
      </div>
    </section>
  )
}
