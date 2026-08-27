import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FileSearch,
  Landmark,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function CibilLoanEligibilityPage({
  product = 'personal-loan',
}: {
  product?: 'personal-loan' | 'credit-card' | 'business-loan'
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as { score?: number; [key: string]: unknown }

  const isCreditCard = product === 'credit-card'
  const isBusinessLoan = product === 'business-loan'
  const formRoute = isCreditCard ? '/apply-credit-card' : isBusinessLoan ? '/business-loan' : '/cibil-score-loan'
  const productTitle = isCreditCard ? 'Credit Card' : isBusinessLoan ? 'Business Loan' : 'Personal Loan'
  const productLabel = isCreditCard ? 'a credit card' : isBusinessLoan ? 'a business loan' : 'a personal loan'

  const score = typeof state.score === 'number' ? state.score : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f2f6fd] via-[#f8faff] to-white py-10 md:py-14 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(formRoute)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            <ArrowLeft size={16} /> Back to {productTitle} Form
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-700">
            Eligibility Evaluation
          </span>
        </div>

        {/* ── Main Status Hero Card ── */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-blue-950/5">
          {/* Top Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1a40] via-[#142850] to-[#1c2541] px-6 py-10 text-center text-white sm:px-12">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

            {/* Glowing Status Icon */}
            <div className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 p-3 shadow-2xl backdrop-blur-md border border-white/20">
              <span className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-inner">
                <ShieldAlert size={36} />
              </span>
            </div>

            {/* Credit Score Tag if available */}
            {score !== null && (
              <div className="mt-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-200 backdrop-blur-md">
                  <TrendingUp size={14} className="text-amber-400" />
                  Your Bureau Credit Score: <strong className="text-white text-sm">{score}</strong>
                </span>
              </div>
            )}

            <h1 className="mt-4 font-sans text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
              You are currently not eligible for {productLabel}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm font-medium leading-6 text-slate-300">
              Based on the lender's automated credit risk assessment, recent payment records (DPD), or credit history thresholds, this application cannot proceed at this time.
            </p>
          </div>

          {/* Actionable Next Steps Section */}
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-sans text-lg font-black text-slate-900">
                    Recommended Solutions &amp; Next Steps
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose one of the verified pathways below to improve your approval chances.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <Sparkles size={13} /> High Success Rate
                </span>
              </div>

              {/* 3 Pathway Cards */}
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {/* Pathway 1: Score Improvement */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-gradient-to-b from-blue-50/80 to-white p-6 shadow-md transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    Recommended
                  </div>
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-black text-slate-900">
                      Increase CIBIL Score
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-600">
                      Identify false loan entries, rectify bureau errors, and get a tailored score restoration plan.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/increase-cibil-score')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-600/20 transition group-hover:bg-blue-700"
                  >
                    <span>Improve Score Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Pathway 2: View CIBIL Report */}
                <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <FileSearch size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-black text-slate-900">
                      Inspect Full Credit Report
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-600">
                      Download the official multi-bureau report PDF to check account balances, defaults, and inquiry counts.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/cibil-report')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 py-3 text-xs font-bold text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <span>View Bureau Report</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Pathway 3: Other Products */}
                <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                      <Landmark size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-black text-slate-900">
                      Explore Other Categories
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-600">
                      Check eligibility for alternative loan categories or secured credit options with flexible criteria.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(isCreditCard ? '/cibil-score-loan' : '/apply-credit-card')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-700 transition group-hover:border-slate-400 group-hover:bg-slate-50"
                  >
                    <span>{isCreditCard ? 'Check Personal Loans' : 'Check Credit Cards'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Expert Tips to Boost Approval Odds */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6">
              <h3 className="font-sans text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> 4 Best Practices to Become Eligible
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-slate-100">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Maintain Credit Utilization Under 30%</h4>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                      Keep your monthly credit card spending below 30% of your total credit limit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-slate-100">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ensure 100% On-Time EMI Repayments</h4>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                      Even a single 30-day delay (DPD) can impact your lending eligibility for months.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-slate-100">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Avoid Frequent Hard Inquiries</h4>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                      Multiple loan applications in a short span signal credit hunger to lenders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-slate-100">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Maintain a Balanced Credit Mix</h4>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                      A healthy blend of secured loans (home/auto) and unsecured credit builds trust.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Direct CTA Toolbar */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Ready to restore your credit health?</p>
                  <p className="text-[11px] text-slate-500">Get expert guidance with our CIBIL improvement program.</p>
                </div>
              </div>

              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={() => navigate(formRoute)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw size={14} /> Re-apply with Updated Data
                </button>

                <button
                  onClick={() => navigate('/increase-cibil-score')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
                >
                  <span>Boost CIBIL Score</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
