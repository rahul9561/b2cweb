import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileSearch, Gauge, Loader2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { useState } from 'react'

/**
 * Score result page shown after POST /loans/score-check/ succeeds.
 * The user's CIBIL score is displayed at the centre with a gauge-style
 * visual. No OTP step and no report download — just the score.
 */
interface ScoreData {
  score?: unknown
  cibil_score?: unknown
  cibilScore?: unknown
  credit_score?: unknown
  creditScore?: unknown
  data?: Record<string, unknown>
  result?: Record<string, unknown>
}

function extractScore(raw: ScoreData): number | null {
  const candidates: unknown[] = [raw.score, raw.cibil_score, raw.cibilScore, raw.credit_score, raw.creditScore]
  if (raw.data && typeof raw.data === 'object') {
    candidates.push(raw.data.score, raw.data.cibil_score, raw.data.cibilScore, raw.data.credit_score, raw.data.creditScore)
  }
  if (raw.result && typeof raw.result === 'object') {
    candidates.push(raw.result.score, raw.result.cibil_score, raw.result.cibilScore, raw.result.credit_score, raw.result.creditScore)
  }
  for (const val of candidates) {
    if (val === undefined || val === null) continue
    const num = Number(String(val).replace(/\D/g, ''))
    if (!Number.isNaN(num) && num > 0) return num
  }
  return null
}

function getScoreRating(score: number): { label: string; color: string; bg: string; text: string; description: string } {
  if (score >= 800) return { label: 'Excellent', color: '#059669', bg: 'bg-emerald-100', text: 'text-emerald-700', description: 'You have an excellent credit history. Lenders are likely to offer you the best rates and terms.' }
  if (score >= 750) return { label: 'Very Good', color: '#22c55e', bg: 'bg-green-100', text: 'text-green-700', description: 'You have a very good credit profile. Most banks and NBFCs would be willing to extend credit to you.' }
  if (score >= 700) return { label: 'Good', color: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-700', description: 'You have a good credit score. Many lenders may approve your application, though some may offer stricter terms.' }
  if (score >= 600) return { label: 'Average', color: '#f97316', bg: 'bg-orange-100', text: 'text-orange-700', description: 'Your credit score needs improvement. Only a few lenders are likely to approve your application.' }
  return { label: 'Poor', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700', description: 'Your credit history needs immediate attention. Review your report and take corrective action.' }
}

function ScoreGauge({ score }: { score: number }) {
  const rating = getScoreRating(score)
  // Map score (300–900) to gauge angle (start 135° → end 405°) i.e. 270° sweep
  const clamped = Math.min(900, Math.max(300, score))
  const progress = (clamped - 300) / 600
  const endAngle = 135 + 270 * progress
  const largeArc = endAngle - 135 > 180 ? 1 : 0
  const startRad = (135 * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180
  const cx = 100
  const cy = 100
  const r = 80
  const startX = cx + r * Math.cos(startRad)
  const startY = cy + r * Math.sin(startRad)
  const endX = cx + r * Math.cos(endRad)
  const endY = cy + r * Math.sin(endRad)

  return (
    <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-0">
        {/* Background track (full 270° sweep) */}
        <path
          d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Coloured progress arc */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none"
          stroke={rating.color}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Your CIBIL Score</span>
        <span className="mt-1 font-serif text-6xl font-bold text-navy sm:text-7xl">{score}</span>
        <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${rating.bg} ${rating.text}`}>{rating.label}</span>
      </div>
      {/* Range labels */}
      <span className="absolute bottom-1 left-2 text-[10px] font-medium text-slate-400">300</span>
      <span className="absolute bottom-1 right-2 text-[10px] font-medium text-slate-400">900</span>
    </div>
  )
}

export default function CibilScoreResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)

  const rawData = (location.state?.apiData ?? location.state?.data ?? {}) as ScoreData
  const score = extractScore(rawData)
  const rating = score !== null ? getScoreRating(score) : null

  const goBack = () => {
    setChecking(true)
    // Simulate a brief moment then navigate back to the form
    setTimeout(() => {
      navigate('/cibil-score-by-pan', { replace: true })
    }, 400)
  }

  if (score === null || !rating) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50/40 to-white px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-blue-950/10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <FileSearch size={30} />
          </span>
          <h1 className="mt-6 font-serif text-2xl font-bold text-navy">Score Not Found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not find your CIBIL score in the response. Please go back and try again.
          </p>
          <button
            onClick={goBack}
            disabled={checking}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {checking ? <><Loader2 size={17} className="animate-spin" /> Please wait...</> : <><ArrowLeft size={17} /> Back to Form</>}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles size={14} /> Your credit summary
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Your CIBIL Score</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Here is your CIBIL score based on the PAN and mobile number you provided.
          </p>
        </div>

        {/* Score card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-8 text-center sm:px-10">
            <ScoreGauge score={score} />

            <div className={`mx-auto mt-8 max-w-md rounded-2xl border p-5 ${rating.bg}`}>
              <div className="flex items-center justify-center gap-2">
                <Gauge size={20} className={rating.text} />
                <h2 className={`font-serif text-lg font-bold ${rating.text}`}>{rating.label} Credit Standing</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{rating.description}</p>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid gap-4 px-6 py-7 sm:grid-cols-3 sm:px-10">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center">
              <ShieldCheck size={20} className="mx-auto text-blue-600" />
              <p className="mt-2 text-xs font-semibold text-navy">Secure Check</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">Your data is protected with bank-grade security.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
              <CheckCircle2 size={20} className="mx-auto text-emerald-600" />
              <p className="mt-2 text-xs font-semibold text-navy">Instant Result</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">Your score was fetched instantly using your PAN.</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-center">
              <TrendingUp size={20} className="mx-auto text-indigo-600" />
              <p className="mt-2 text-xs font-semibold text-navy">Score Range</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">CIBIL scores range from 300 to 900.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-10">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={goBack}
                disabled={checking}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 disabled:opacity-60"
              >
                {checking ? <><Loader2 size={17} className="animate-spin" /> Please wait...</> : <><ArrowLeft size={17} /> Check Another Score</>}
              </button>
              <button
                onClick={() => navigate('/cibil-report')}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore CIBIL Report
              </button>
            </div>
            <p className="mt-5 text-center text-[11px] leading-4 text-slate-400">
              This score is provided for informational purposes. Lenders may use a different credit score when assessing your application.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}