import { formatINR, type HomePlanSelection } from '../../data/homeInsurance'

interface SummarySidebarProps {
  plan: HomePlanSelection
}

export default function SummarySidebar({ plan }: SummarySidebarProps) {
  const addonsTotal = plan.addons.reduce((sum, a) => sum + a.premium, 0)
  const total = plan.basePremium + addonsTotal

  return (
    <aside className="sticky top-24 w-full rounded-xl border border-gray-200 bg-white p-5 shadow-card lg:w-[340px]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-navy">Summary</h3>
        <span className="text-[12px] font-semibold text-slate-600">Policy Term: {plan.policyTermYears} Yrs</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <img
          src={plan.insurerLogo}
          alt={plan.insurerName}
          className="h-10 w-10 rounded-full border border-gray-100 object-contain bg-slate-50"
        />
        <p className="text-[14px] font-semibold text-navy">{plan.planName}</p>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">Sum Insured</p>
        <div className="flex items-center justify-between py-1">
          <span className="text-[13px] text-slate-600">Building</span>
          <span className="text-[13px] font-bold text-navy">{formatINR(plan.buildingSumInsured)}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[13px] text-slate-600">Household Items</span>
          <span className="text-[13px] font-bold text-navy">{formatINR(plan.householdSumInsured)}</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">
          Premium Breakdown (Incl. GST) -
        </p>
        <div className="flex items-center justify-between py-1">
          <span className="text-[13px] text-slate-600">Base Plan Premium</span>
          <span className="text-[13px] font-semibold text-navy">{formatINR(plan.basePremium)}</span>
        </div>
        {plan.addons.map((addon) => (
          <div key={addon.id} className="flex items-center justify-between py-1">
            <span className="text-[13px] text-slate-600">{addon.name}</span>
            <span className="text-[13px] font-semibold text-navy">{formatINR(addon.premium)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-navy">Total premium to be paid (Incl. GST)</span>
          <span className="text-[15px] font-bold text-navy">{formatINR(total)}</span>
        </div>
      </div>
    </aside>
  )
}
