import { AlertCircle, ArrowLeft, ChevronRight, FileCheck2, RefreshCw } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoans } from '../context/LoansContext'
import { useEffect } from 'react'
import {
  displayAccountNumber,
  formatLoanAmount,
  formatLoanDate,
  loanStatus,
  loanTypeIcon,
} from '../components/loans/loanCardHelpers'

const ListSkeleton = () => (
  <div className="animate-pulse rounded-cardlg border border-slate2-border bg-white p-6 shadow-card">
    <div className="flex gap-4"><span className="h-12 w-12 rounded-xl bg-slate-200" /><div className="flex-1 space-y-3"><div className="h-5 w-44 rounded bg-slate-200" /><div className="h-4 w-64 max-w-full rounded bg-slate-100" /></div></div>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <span key={index} className="h-16 rounded-xl bg-slate-100" />)}</div>
  </div>
)

export default function LoansListPage() {
  const { isAuthenticated } = useAuth()
  const { loans, loading, loaded, error, refreshLoans } = useLoans()
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [])
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 py-10 text-white shadow-xl shadow-blue-900/10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="container-pb relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-300 transition hover:text-white">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Your <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">active loans</span>
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-300">
                Review your reported loan accounts and select any details that need correction.
              </p>
            </div>
            <Link to="/loans/disputes" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:border-blue-400 hover:bg-blue-600">
              <FileCheck2 size={18} /> My disputes
            </Link>
          </div>
        </div>
      </section>

      <section className="container-pb py-8">
        {(!loaded || (loading && loans.length === 0)) && <div className="space-y-5"><ListSkeleton /><ListSkeleton /></div>}

        {error && !loading && (
          <div className="rounded-cardlg border border-red-200 bg-white p-8 text-center shadow-card">
            <AlertCircle className="mx-auto text-red-500" size={32} />
            <h2 className="mt-3 text-lg font-bold text-navy">We couldn't load your loans</h2>
            <p className="mt-2 text-sm text-slate2-secondary">{error}</p>
            <button type="button" onClick={() => void refreshLoans().catch(() => undefined)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"><RefreshCw size={15} /> Retry</button>
          </div>
        )}

        {!loading && !error && loaded && loans.length === 0 && (
          <div className="rounded-cardlg border border-slate2-border bg-white p-10 text-center shadow-card">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blueBG text-brand">{loanTypeIcon('', 'h-7 w-7')}</span>
            <h2 className="mt-4 text-xl font-bold text-navy">No active loans available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate2-secondary">No active loans are available for your account right now. When a loan appears in your credit report, it will be shown here.</p>
          </div>
        )}

        {!error && loans.length > 0 && (
          <div className="space-y-5">
            {loans.map((loan) => {
              const status = loanStatus(loan.status)
              return (
                <article key={loan.id || `${loan.lenderName}-${loan.maskedNumber}`} className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft md:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blueBG text-brand">{loanTypeIcon(loan.accountType, 'h-6 w-6')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-navy">{loan.lenderName || 'Loan provider'}</h2>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate2-secondary">{loan.typeLabel} <span className="mx-1 text-slate-300">•</span> {displayAccountNumber(loan.maskedNumber)}</p>
                    </div>
                    <Link to={`/loans/${encodeURIComponent(loan.id)}/issues`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Select Issues <ChevronRight size={16} /></Link>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 md:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate2-muted">Current balance</dt><dd className="mt-1 text-sm font-bold text-navy">{formatLoanAmount(loan.currentBalance)}</dd></div>
                    <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate2-muted">Sanctioned amount</dt><dd className="mt-1 text-sm font-bold text-navy">{formatLoanAmount(loan.sanctionedAmount)}</dd></div>
                    <div className={`rounded-xl p-3 ${loan.overdueAmount && loan.overdueAmount > 0 ? 'bg-red-50' : 'bg-slate-50'}`}><dt className="text-xs text-slate2-muted">Overdue amount</dt><dd className={`mt-1 text-sm font-bold ${loan.overdueAmount && loan.overdueAmount > 0 ? 'text-red-600' : 'text-navy'}`}>{formatLoanAmount(loan.overdueAmount)}</dd></div>
                    <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate2-muted">Open date</dt><dd className="mt-1 text-sm font-bold text-navy">{formatLoanDate(loan.openDate)}</dd></div>
                  </dl>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
