import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Home,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { formatBlockedDate, getCibilAnalysisBlockedUntil } from '../lib/cibilAnalysisSession'

/**
 * Success page shown after the user submits verification.
 * Tells the user their report is under review and that they will be
 * contacted by the sales team within 15–30 working days. The session
 * stored in sessionStorage prevents generating a new report until
 * the 30-working-day cool-down window has passed.
 */
export default function CibilAnalysisSuccessPage() {
  const navigate = useNavigate()
  const blockedUntil = getCibilAnalysisBlockedUntil()

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f2f6fd] via-[#f8faff] to-white py-12 md:py-16 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/increase-cibil-score', { replace: true })}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to CIBIL Analysis</span>
        </button>

        {/* ── Main Container ── */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-blue-950/10">
          {/* Top Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 px-8 py-12 text-center text-white">
            {/* Background Decorative Rings */}
            <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-white/10 blur-xl" />

            {/* Glowing Success Badge */}
            <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 p-2 shadow-2xl backdrop-blur-md border border-white/30">
              <span className="grid h-full w-full place-items-center rounded-full bg-white text-emerald-600 shadow-inner">
                <CheckCircle2 size={46} strokeWidth={2.5} />
              </span>
            </div>

            <div className="relative mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/40 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-200 backdrop-blur-sm border border-emerald-400/30">
                <Sparkles size={13} /> Request Confirmed
              </span>
              <h1 className="mt-3 font-sans text-3xl font-black tracking-tight text-white md:text-4xl">
                Submission Successful!
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-emerald-50 leading-6">
                Your credit analysis and score improvement request has been registered in our system.
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Card 1: Sales Reach-out */}
            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 p-6 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <PhoneCall size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-sans text-base font-black text-slate-900">
                      Dedicated Credit Specialist Contact
                    </h2>
                    <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      Priority Support
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Our credit advisory team will analyze your verified credit history and reach out to you within{' '}
                    <strong className="font-extrabold text-blue-900 underline decoration-blue-300">
                      15–30 working days
                    </strong>{' '}
                    with a personalized score improvement roadmap.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Next Analysis Cooldown */}
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 p-6 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                  <Clock3 size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-sans text-base font-black text-slate-900">
                      Cooldown Period &amp; Next Report
                    </h2>
                    <span className="rounded-full bg-amber-600/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                      Standard Interval
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Credit bureaus typically take up to 30 days to process disputes and reflect corrections. You can generate your next updated report after{' '}
                    <strong className="font-extrabold text-amber-950">15–30 working days</strong>.
                  </p>

                  {blockedUntil && (
                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-amber-900 shadow-sm border border-amber-200">
                      <RefreshCw size={14} className="text-amber-600" />
                      <span>Next report available on: <strong>{formatBlockedDate(blockedUntil)}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: 3-Step Process Guide */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6">
              <h3 className="font-sans text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" /> What Happens Next?
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-extrabold text-blue-700">
                    1
                  </span>
                  <h4 className="mt-2.5 text-xs font-black text-slate-900">Bureau Audit</h4>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Our team cross-references your inputs against TransUnion &amp; Experian logs.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-extrabold text-indigo-700">
                    2
                  </span>
                  <h4 className="mt-2.5 text-xs font-black text-slate-900">Dispute Rectification</h4>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Discrepancies and inaccurate DPD accounts are flagged for bureau correction.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-extrabold text-emerald-700">
                    3
                  </span>
                  <h4 className="mt-2.5 text-xs font-black text-slate-900">Score Improvement</h4>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Your credit score enhances as rectified accounts update in upcoming cycles.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Note */}
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 p-4.5 text-xs leading-5 text-emerald-900 border border-emerald-200/70">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" />
              <p>
                <strong>Confidential &amp; Secure:</strong> Your verification session is encrypted with bank-level security. We never share your credit history with unauthorized third parties.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate('/cibil-score-loan')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700"
              >
                <span>Check Loan &amp; Card Offers</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/', { replace: true })}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-4 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Home size={17} />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Users size={14} className="text-slate-400" /> AV Management Pvt Ltd · Credit Advisory &amp; Solutions
            </p>
          </footer>
        </div>
      </div>
    </section>
  )
}
