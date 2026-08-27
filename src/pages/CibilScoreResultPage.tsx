import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  FileSearch,
  FileText,
  Gauge,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
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

function getScoreRating(score: number): {
  label: string
  color: string
  gradient: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  cardBg: string
  cardBorder: string
  description: string
  advice: string
} {
  if (score >= 800) {
    return {
      label: 'Excellent',
      color: '#10b981',
      gradient: 'from-emerald-400 to-teal-500',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/40',
      cardBg: 'bg-emerald-950/40',
      cardBorder: 'border-emerald-500/30',
      description: 'You have an exceptional credit track record. Top-tier banks and lenders offer preferential low interest rates and instant approvals.',
      advice: 'Keep maintaining your timely payment streak and low credit card utilization to preserve this elite tier.',
    }
  }
  if (score >= 750) {
    return {
      label: 'Very Good',
      color: '#22c55e',
      gradient: 'from-green-400 to-emerald-500',
      badgeBg: 'bg-green-500/20',
      badgeText: 'text-green-300',
      badgeBorder: 'border-green-500/40',
      cardBg: 'bg-green-950/40',
      cardBorder: 'border-green-500/30',
      description: 'You have a very strong credit profile. Most banks and NBFCs will readily approve your credit card and loan applications.',
      advice: 'Ensure credit utilization stays under 30% to push your score into the Excellent 800+ tier.',
    }
  }
  if (score >= 700) {
    return {
      label: 'Good',
      color: '#f59e0b',
      gradient: 'from-amber-400 to-yellow-500',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/40',
      cardBg: 'bg-amber-950/40',
      cardBorder: 'border-amber-500/30',
      description: 'You have a good credit score with solid creditworthiness. Many lenders will approve your applications with competitive terms.',
      advice: 'Avoid making multiple hard inquiries in short intervals and pay off high-balance cards.',
    }
  }
  if (score >= 600) {
    return {
      label: 'Average',
      color: '#f97316',
      gradient: 'from-orange-400 to-amber-500',
      badgeBg: 'bg-orange-500/20',
      badgeText: 'text-orange-300',
      badgeBorder: 'border-orange-500/40',
      cardBg: 'bg-orange-950/40',
      cardBorder: 'border-orange-500/30',
      description: 'Your credit profile needs attention. You may encounter higher interest rates or stricter eligibility requirements from lenders.',
      advice: 'Review your detailed report for errors, clear past dues, and start a credit improvement program.',
    }
  }
  return {
    label: 'Poor',
    color: '#ef4444',
    gradient: 'from-rose-500 to-red-600',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-500/40',
    cardBg: 'bg-red-950/40',
    cardBorder: 'border-red-500/30',
    description: 'Your credit score is in the critical zone. Immediate corrective action is recommended to resolve outstanding defaults or discrepancies.',
    advice: 'Initiate a bureau dispute if you notice incorrect entries, or consult our credit specialists for repair.',
  }
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
  const r = 78
  const startX = cx + r * Math.cos(startRad)
  const startY = cy + r * Math.sin(startRad)
  const endX = cx + r * Math.cos(endRad)
  const endY = cy + r * Math.sin(endRad)

  return (
    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      {/* Decorative Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${rating.color}25 0%, transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor={rating.color} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Background track (full 270° sweep) */}
        <path
          d="M 44.8 155.2 A 78 78 0 1 1 155.2 155.2"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Coloured progress arc with glow */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none"
          stroke={rating.color}
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Pin indicator tip */}
        <circle cx={endX} cy={endY} r="7" fill="#ffffff" stroke={rating.color} strokeWidth="3" />
      </svg>

      {/* Center content with crystal clear high-contrast white text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 drop-shadow-sm">
          YOUR CIBIL SCORE
        </span>
        <span className="mt-1 font-sans text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)] sm:text-7xl">
          {score}
        </span>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg ${rating.badgeBg} ${rating.badgeText} ${rating.badgeBorder}`}
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: rating.color }} />
            {rating.label}
          </span>
        </div>
      </div>

      {/* Range labels */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[11px] font-bold text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <span>300</span>
      </div>
      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[11px] font-bold text-slate-300">
        <span>900</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
    </div>
  )
}

function ScoreSpectrum({ currentScore }: { currentScore: number }) {
  const tiers = [
    { label: 'Poor', range: '300-599', color: 'bg-rose-500', min: 300, max: 599 },
    { label: 'Average', range: '600-699', color: 'bg-orange-500', min: 600, max: 699 },
    { label: 'Good', range: '700-749', color: 'bg-amber-500', min: 700, max: 749 },
    { label: 'Very Good', range: '750-799', color: 'bg-green-500', min: 750, max: 799 },
    { label: 'Excellent', range: '800-900', color: 'bg-emerald-500', min: 800, max: 900 },
  ]

  const clamped = Math.min(900, Math.max(300, currentScore))
  const percent = ((clamped - 300) / 600) * 100

  return (
    <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <span className="flex items-center gap-1.5 text-white">
          <TrendingUp size={14} className="text-blue-400" /> CIBIL Bureau Rating Scale
        </span>
        <span className="text-slate-300">You are at {currentScore}</span>
      </div>

      {/* Progress Bar Spectrum */}
      <div className="relative mt-4">
        <div className="grid grid-cols-5 h-2.5 overflow-hidden rounded-full gap-0.5 bg-slate-800 p-0.5">
          {tiers.map((tier) => (
            <div key={tier.label} className={`h-full rounded-sm ${tier.color}`} />
          ))}
        </div>

        {/* Score indicator arrow */}
        <div
          className="absolute -top-1.5 flex -translate-x-1/2 flex-col items-center transition-all duration-700"
          style={{ left: `${percent}%` }}
        >
          <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
        </div>
      </div>

      {/* Tier labels */}
      <div className="mt-3 grid grid-cols-5 text-center text-[10px] sm:text-xs">
        {tiers.map((tier) => {
          const isActive = currentScore >= tier.min && currentScore <= tier.max
          return (
            <div key={tier.label} className={`px-0.5 ${isActive ? 'font-black text-white' : 'font-medium text-slate-400'}`}>
              <p className="truncate">{tier.label}</p>
              <p className="text-[9px] opacity-75">{tier.range}</p>
            </div>
          )
        })}
      </div>
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
    setTimeout(() => {
      navigate('/cibil-score', { replace: true })
    }, 300)
  }

  if (score === null || !rating) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#0b132b] px-4 py-16 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <FileSearch size={32} />
          </span>
          <h1 className="mt-6 font-sans text-2xl font-black text-white">Score Not Found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            We could not retrieve your CIBIL score from the bureau response. Please verify your details and try again.
          </p>
          <button
            onClick={goBack}
            disabled={checking}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
          >
            {checking ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Returning...
              </>
            ) : (
              <>
                <ArrowLeft size={17} /> Back to Form
              </>
            )}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#070e22] via-[#0c1a40] to-[#08122c] py-10 md:py-16 text-white">
      <div className="mx-auto max-w-4xl px-4">
        {/* Top Breadcrumb / Return */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft size={15} /> Check Another Score
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-300">
            <ShieldCheck size={14} /> Official TransUnion Bureau
          </span>
        </div>

        {/* Heading Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-300 backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-amber-400" /> Credit Health Report
          </span>
          <h1 className="mt-4 font-sans text-3xl font-black tracking-tight text-white md:text-5xl">
            Your CIBIL Credit Score
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-300">
            Real-time score fetched using your verified PAN and mobile number.
          </p>
        </div>

        {/* Main Score Glass Card */}
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          {/* Top Gauge Area */}
          <div className="relative border-b border-white/10 px-6 py-10 text-center sm:px-12">
            <ScoreGauge score={score} />

            {/* Score Standing High-Contrast Callout Card */}
            <div
              className={`mx-auto mt-8 max-w-xl rounded-2xl border p-6 text-left backdrop-blur-md shadow-xl ${rating.cardBg} ${rating.cardBorder}`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${rating.badgeBg} ${rating.badgeText}`}>
                  <Gauge size={22} />
                </span>
                <div>
                  <h2 className="text-lg font-black text-white">{rating.label} Credit Profile</h2>
                  <p className={`text-xs font-bold uppercase tracking-wider ${rating.badgeText}`}>
                    Status: {rating.label} Standing
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{rating.description}</p>
              <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-black/25 p-3 text-xs text-slate-300 border border-white/5">
                <Info size={16} className="shrink-0 text-blue-400 mt-0.5" />
                <span><strong className="text-white">Expert Tip:</strong> {rating.advice}</span>
              </div>
            </div>

            {/* Spectrum Bar */}
            <div className="mx-auto max-w-xl">
              <ScoreSpectrum currentScore={score} />
            </div>
          </div>

          {/* 3 Core Highlights Grid */}
          <div className="grid gap-4 bg-black/20 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-white">Bank-Grade Security</h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                256-bit encrypted PAN transmission with zero spam guarantee.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-emerald-400/40">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Zap size={24} />
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-white">Direct Bureau Sync</h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Live credit record fetched straight from TransUnion CIBIL servers.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-indigo-400/40">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Award size={24} />
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-white">Score Improvement</h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Get dedicated guidance to fix bureau errors and boost your score.
              </p>
            </div>
          </div>

          {/* Actions & Next Steps */}
          <div className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate('/increase-cibil-score')}
                className="group flex items-center justify-center gap-2.5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 py-4 text-sm font-extrabold text-amber-200 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:from-amber-500/30 hover:to-orange-500/30 hover:shadow-lg hover:shadow-amber-500/20"
              >
                <Sparkles size={18} className="text-amber-400" />
                <span>Improve Your CIBIL Score</span>
              </button>

              <button
                onClick={() => navigate('/cibil-report')}
                className="group flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/35 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700"
              >
                <FileText size={18} />
                <span>Get Full CIBIL Report PDF</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
              <p className="text-[11px] leading-4 text-slate-400">
                * Score is provided for informational and financial advisory purposes. Lenders may review additional bureau metrics.
              </p>
              <button
                onClick={goBack}
                disabled={checking}
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              >
                <RefreshCw size={13} /> Re-check with another PAN
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}