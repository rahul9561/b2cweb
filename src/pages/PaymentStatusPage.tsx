import { CheckCircle2, XCircle } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

type PaymentStatusState = {
  success: boolean
  amount: number
  message?: string
  transactionId?: string
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)

export default function PaymentStatusPage() {
  const navigate = useNavigate()
  const state = useLocation().state as PaymentStatusState | null

  if (!state || typeof state.success !== 'boolean' || !Number.isFinite(Number(state.amount))) {
    return <Navigate to="/wallet" replace />
  }

  const amount = Number(state.amount)
  const fallbackMessage = state.message?.trim() || 'Something went wrong. Please try again.'

  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-950/5 md:p-10">
        {state.success ? (
          <CheckCircle2 className="mx-auto text-emerald-500" size={76} strokeWidth={1.7} />
        ) : (
          <XCircle className="mx-auto text-red-500" size={76} strokeWidth={1.7} />
        )}
        <h1 className="mt-6 text-2xl font-bold text-navy md:text-3xl">{state.success ? 'Payment Successful' : 'Payment Failed'}</h1>
        <p className={`mt-4 text-4xl font-bold ${state.success ? 'text-navy' : 'text-red-600'}`}>{formatMoney(amount)}</p>
        {!state.success && <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">{fallbackMessage}</p>}
        {state.success && state.transactionId && <p className="mt-4 break-all text-xs text-slate-500">Transaction ID: {state.transactionId}</p>}
        <button
          type="button"
          onClick={() => navigate(state.success ? '/wallet' : '/wallet/add-money', { replace: true })}
          className={`mt-8 w-full rounded-xl py-3.5 text-sm font-bold text-white ${state.success ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-black hover:bg-slate-900'}`}
        >
          Done
        </button>
      </section>
    </main>
  )
}
