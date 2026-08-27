import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarDays, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import CreditReportLeadForm from '../components/credit-score/CreditReportLeadForm'
import { CreditScoreArticles, creditArticles } from '../components/credit-score/CreditScoreArticles'

export default function CreditScoreArticleDetailPage() {
  const { slug } = useParams()
  const article = creditArticles.find((item) => item.slug === slug)

  if (!article) return <Navigate to="/category/credit-score" replace />

  const tips = [
    'Pay every EMI and credit-card bill on or before its due date.',
    'Keep credit utilisation comfortably below your available limit.',
    'Review your report regularly and raise a dispute for inaccurate information.',
    'Avoid several new loan or card applications within a short period.',
  ]

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-blue-900/50 bg-blue-950">
        <div className="container-pb py-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
          <Link to="/category/credit-score" className="text-blue-400 hover:text-white transition">Home</Link>
          <ChevronRight className="mx-2 inline text-slate-600" size={13} />
          <Link to="/category/credit-score" className="text-blue-400 hover:text-white transition">Credit Score</Link>
          <ChevronRight className="mx-2 inline text-slate-600" size={13} />
          <span className="text-slate-200">{article.title}</span>
        </div>
      </div>

      {/* ── Hero section ── */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl shadow-blue-900/10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="container-pb relative z-10 grid gap-10 py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <article>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-300 backdrop-blur-md">
              <ShieldCheck size={16} /> Credit Score Guide
            </span>
            <h1 className="mt-4 max-w-4xl font-sans text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                By {article.author}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                <CalendarDays size={15} className="text-sky-400" />
                {article.date}
              </span>
            </div>
            <p className="mt-7 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {article.excerpt} Get clear, practical steps to make stronger credit decisions.
            </p>
          </article>

          {/* Form wrapper */}
          <div>
            <CreditReportLeadForm />
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container-pb grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-10 overflow-hidden rounded-2xl shadow-lg shadow-slate-200">
            <img src={article.image} alt="" className="aspect-[16/8] w-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <p className="text-sm leading-8 text-slate-700 md:text-base">
            Your credit score is shaped by the information in your credit report and the way you manage credit over time. Small, consistent habits can make it easier to understand your profile and prepare for future borrowing.
          </p>
          
          <h2 className="mt-10 font-sans text-2xl font-extrabold tracking-tight text-navy">What this means for your credit profile</h2>
          <p className="mt-4 text-sm leading-8 text-slate-700 md:text-base">
            Lenders may consider repayment history, outstanding balances, account age and recent credit applications while assessing an application. Looking at your report regularly helps you spot changes and respond early if information needs to be corrected.
          </p>
          
          <h2 className="mt-10 font-sans text-2xl font-extrabold tracking-tight text-navy">Practical steps you can take</h2>
          <ul className="mt-6 space-y-4 rounded-2xl bg-blue-50/50 p-6">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-4 text-sm leading-7 text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CheckCircle2 size={16} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
          
          <h2 className="mt-10 font-sans text-2xl font-extrabold tracking-tight text-navy">Keep your report up to date</h2>
          <p className="mt-4 text-sm leading-8 text-slate-700 md:text-base">
            If you find an account or personal detail that does not look right, contact the relevant credit bureau or lender using its official dispute process. Retain any reference numbers and follow up until the correction is reflected in your report.
          </p>
        </article>

        <aside className="lg:pt-0">
          <div className="sticky top-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-sm">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
              <ShieldCheck size={24} />
            </span>
            <h2 className="font-sans text-xl font-extrabold tracking-tight text-navy">Build a stronger profile</h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-800">
              A free credit report can help you track the information that supports your credit journey.
            </p>
            <a
              href="#credit-score-articles"
              className="mt-6 block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-center text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
            >
              Explore more guides
            </a>
          </div>
        </aside>
      </div>

      <div className="container-pb pb-14">
        <CreditScoreArticles limit={3} />
      </div>
    </main>
  )
}
