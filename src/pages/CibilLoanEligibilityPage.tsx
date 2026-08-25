import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function CibilLoanEligibilityPage({ product = 'personal-loan' }: { product?: 'personal-loan' | 'credit-card' }) {
  const navigate = useNavigate()
  const state = (useLocation().state ?? {}) as { score?: number }
  const isCreditCard = product === 'credit-card'

  return (
    <main className="min-h-[55vh] bg-slate-50 px-4 py-10 md:py-16">
      <div className="container-pb">
        <button onClick={() => navigate(isCreditCard ? '/apply-credit-card' : '/cibil-score-loan')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:bg-slate-100">
          <ArrowLeft size={17} /> Back
        </button>
        <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-100 bg-white px-6 py-14 text-center shadow-sm md:px-12">
          <span className="inline-grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600"><CheckCircle2 size={36} /></span>
          {typeof state.score === 'number' && <p className="mt-6 text-sm font-semibold text-blue-600">Your credit score: {state.score}</p>}
          <h1 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">You are not eligible to apply for {isCreditCard ? 'a credit card' : 'a loan'}</h1>
        </section>
      </div>
    </main>
  )
}
