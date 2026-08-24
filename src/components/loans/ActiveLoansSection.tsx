import { ArrowRight, ChevronRight, FileCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLoans } from '../../context/LoansContext'
import {
  displayAccountNumber,
  formatLoanAmount,
  loanStatus,
  loanTypeIcon,
} from './loanCardHelpers'

const LoanSkeleton = () => (
  <div className="animate-pulse rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
    <div className="flex items-center gap-4">
      <span className="h-12 w-12 rounded-xl bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-3 w-56 max-w-full rounded bg-slate-100" />
      </div>
      <div className="hidden h-10 w-28 rounded-lg bg-slate-100 sm:block" />
    </div>
  </div>
)

export default function ActiveLoansSection() {
  const { isAuthenticated } = useAuth()
  const { loans, loading, loaded } = useLoans()

  if (!isAuthenticated) return null
  return (
    <section className="container-pb pb-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-navy md:text-2xl">Active Loans Lender</h2>
        <div className="flex items-center gap-4">
          <Link to="/loans/disputes" className="hidden items-center gap-1 text-sm font-semibold text-slate2-secondary hover:text-brand sm:inline-flex"><FileCheck2 size={15} /> My disputes</Link>
          <Link to="/loans" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">See All Loans <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className="space-y-4">
        <Link to="/loans/disputes" className="inline-flex items-center gap-1 text-sm font-semibold text-brand sm:hidden"><FileCheck2 size={15} /> My disputes</Link>
        {!loaded || (loading && loans.length === 0) ? (
          <><LoanSkeleton /><LoanSkeleton /></>
        ) : loans.length === 0 ? (
          <div className="rounded-cardlg border border-slate2-border bg-white px-5 py-8 text-center shadow-card">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blueBG text-brand">{loanTypeIcon('', 'h-6 w-6')}</span>
            <h3 className="mt-3 text-base font-bold text-navy">No active loans available</h3>
            <p className="mt-1 text-sm text-slate2-secondary">No active loans are available for your account right now.</p>
          </div>
        ) : loans.slice(0, 2).map((loan) => {
          const status = loanStatus(loan.status)
          return (
            <article key={loan.id || `${loan.lenderName}-${loan.maskedNumber}`} className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blueBG text-brand">
                  {loanTypeIcon(loan.accountType, 'h-6 w-6')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-bold text-navy">{loan.lenderName || 'Loan provider'}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate2-secondary">
                    {loan.typeLabel} <span className="mx-1 text-slate-300">•</span> {displayAccountNumber(loan.maskedNumber)}
                  </p>
                  {loan.currentBalance !== null && <p className="mt-2 text-xs text-slate2-muted">Current balance: <strong className="text-navy">{formatLoanAmount(loan.currentBalance)}</strong></p>}
                </div>
                <Link to={`/loans/${encodeURIComponent(loan.id)}/issues`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">
                  Select Issues <ChevronRight size={16} />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
