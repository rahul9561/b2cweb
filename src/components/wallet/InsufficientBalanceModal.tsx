import { AlertCircle, X } from 'lucide-react'

type InsufficientBalanceModalProps = {
  open: boolean
  shortfall: number
  onAddMoney: () => void
  onCancel: () => void
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

export default function InsufficientBalanceModal({
  open,
  shortfall,
  onAddMoney,
  onCancel,
}: InsufficientBalanceModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/60 px-4" role="dialog" aria-modal="true" aria-labelledby="insufficient-balance-title">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle size={25} />
          </span>
          <button type="button" onClick={onCancel} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <h2 id="insufficient-balance-title" className="mt-5 text-xl font-bold text-navy">Insufficient wallet balance</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add <strong className="text-navy">{formatMoney(shortfall)}</strong> to continue.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-navy hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={onAddMoney} className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900">Add Money</button>
        </div>
      </section>
    </div>
  )
}
