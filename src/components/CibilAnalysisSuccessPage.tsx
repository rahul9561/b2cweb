import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, FileText, Home, PhoneCall, RefreshCw, ShieldCheck, Users } from 'lucide-react'
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

  const goHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* ── Success container ── */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          {/* Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-9 text-center text-white">
            <div className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -right-8 h-56 w-56 rounded-full bg-white/10" />
            <span className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 size={42} className="relative text-white" />
            </span>
            <h1 className="relative mt-5 font-serif text-2xl font-bold md:text-3xl">
              Submission Successful!
            </h1>
            <p className="relative mt-2 text-sm leading-6 text-emerald-50">
              Your credit analysis request has been submitted successfully.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-8 md:px-9">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
                  <PhoneCall size={22} />
                </span>
                <div>
                  <h2 className="font-bold text-navy">You will be contacted by our Sales Team</h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    Our sales team will reach out to you within{' '}
                    <strong className="font-semibold text-navy">15–30 working days</strong> with your
                    detailed credit analysis and personalised guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/70 p-6">
              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-xl bg-amber-500 p-3 text-white shadow-lg shadow-amber-500/20">
                  <Clock3 size={22} />
                </span>
                <div>
                  <h2 className="font-bold text-navy">Analyse your next report later</h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    You will be able to generate your next report after{' '}
                    <strong className="font-semibold text-navy">15–30 working days</strong>.
                    {blockedUntil && (
                      <>
                        <br />
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          <RefreshCw size={14} />
                          Next report available on {formatBlockedDate(blockedUntil)}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-500" />
              <p>
                This session has been stored so you can generate your next report only after the
                cooling-off period. For any queries, contact our support team.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={goHome}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                <Home size={17} /> Go to Home
              </button>
              <button
                onClick={() => navigate('/cibil-report', { replace: true })}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <FileText size={17} /> Explore CIBIL Report
              </button>
            </div>
          </div>

          <footer className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Users size={13} /> AV Management Pvt Ltd · Credit Analysis Team
            </p>
          </footer>
        </div>

        {/* Cooldown reminder */}
        {blockedUntil && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3.5 text-sm text-slate-600">
            <RefreshCw size={16} className="text-blue-500" />
            New analysis will be available from <strong className="text-navy">{formatBlockedDate(blockedUntil)}</strong>
          </div>
        )}
      </div>
    </section>
  )
}