import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Disclaimer() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-8">
      <button onClick={() => setOpen((s) => !s)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left">
        <div className="text-[14px] font-semibold">Disclaimer</div>
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {open && (
        <div className="mt-3 rounded-cardlg bg-white p-4 text-[13px] text-slate-600 shadow-sm">
          <ul className="space-y-2">
            <li>Guaranteed approval by insurer on all legitimate claims for PolicyBazaar customers.</li>
            <li>Coverage for pre-existing conditions only in the event of a life-threatening illness to guarantee policyholder stability as declared at time of purchase.</li>
            <li>As per IRDAI guidelines, KYC verification is required for policy issuance.</li>
            <li>Please note that these features/benefits shown above are to name a few and read the product details to know about more features/benefits.</li>
            <li>$2000 is on floater basis across different benefits and is not limited to these features.</li>
          </ul>
        </div>
      )}
    </div>
  )
}
