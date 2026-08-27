import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  FileSearch,
  Landmark,
  Loader2,
  SearchCheck,
  ShieldCheck,
  IndianRupee,
  LockKeyhole,
  Sparkles,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLoans } from '../../context/LoansContext'
import { useWallet } from '../../context/WalletContext'
import { fetchCrifReport } from '../../lib/creditRepairApi'
import { formatExperianDate, parseExperianReport } from '../../lib/experianReport'
import { isRequiredProfileComplete, type ExperianReportResponse } from '../../lib/profileApi'

type JsonRecord = Record<string, unknown>

type CreditOverview = {
  score: number | null
  totalAccounts: number | null
  activeAccounts: number | null
  closedAccounts: number | null
  currentBalance: number | null
  overdueAccounts: number | null
  recentEnquiries: number | null
  creditMix: string
  reportDate: string
  reference: string
  nextUpdate: string
}

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : null

const responseRecords = (response: ExperianReportResponse): JsonRecord[] => {
  const records: JsonRecord[] = []
  const queue: Array<{ value: JsonRecord; depth: number }> = [{ value: response, depth: 0 }]
  const seen = new Set<JsonRecord>()
  while (queue.length) {
    const current = queue.shift()
    if (!current || seen.has(current.value)) continue
    seen.add(current.value)
    records.push(current.value)
    if (current.depth >= 3) continue
    Object.values(current.value).forEach((value) => {
      const nested = asRecord(value)
      if (nested) queue.push({ value: nested, depth: current.depth + 1 })
    })
  }
  return records
}

const pick = (records: JsonRecord[], aliases: string[]): unknown => {
  for (const record of records) {
    for (const alias of aliases) {
      if (record[alias] !== undefined && record[alias] !== null && record[alias] !== '') return record[alias]
    }
  }
  return undefined
}

const numberValue = (value: unknown): number | null => {
  const normalized = typeof value === 'string' ? value.replace(/[₹,\s]/g, '') : value
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const textValue = (value: unknown): string => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'object') {
    const record = asRecord(value)
    return record ? textValue(record.value ?? record.label ?? record.status ?? record.rating) : ''
  }
  const text = String(value).trim()
  return ['null', 'undefined', 'none'].includes(text.toLowerCase()) ? '' : text
}

const findAccounts = (records: JsonRecord[]): JsonRecord[] => {
  for (const record of records) {
    for (const key of ['accounts', 'credit_accounts', 'creditAccounts', 'tradelines', 'loans']) {
      if (Array.isArray(record[key])) return (record[key] as unknown[]).map(asRecord).filter(Boolean) as JsonRecord[]
    }
  }
  return []
}

const normalizeOverview = (response: ExperianReportResponse): CreditOverview => {
  const parsedOverview = parseExperianReport(response).overview
  if (Object.values(parsedOverview).some((value) => value !== null && value !== '')) return parsedOverview
  const records = responseRecords(response)
  const accounts = findAccounts(records)
  const activeFromAccounts = accounts.filter((account) => /active|open|current/i.test(textValue(account.status))).length
  const closedFromAccounts = accounts.filter((account) => /closed|settled/i.test(textValue(account.status))).length
  const totalAccounts = numberValue(pick(records, ['total_accounts', 'totalAccounts', 'accounts_count', 'account_count']))
  const activeAccounts = numberValue(pick(records, ['active_accounts', 'activeAccounts', 'open_accounts', 'openAccounts']))
  const closedAccounts = numberValue(pick(records, ['closed_accounts', 'closedAccounts']))

  return {
    score: numberValue(pick(records, ['credit_score', 'creditScore', 'experian_score', 'experianScore', 'bureau_score', 'score'])),
    totalAccounts: totalAccounts ?? (accounts.length ? accounts.length : null),
    activeAccounts: activeAccounts ?? (accounts.length ? activeFromAccounts : null),
    closedAccounts: closedAccounts ?? (accounts.length ? closedFromAccounts : null),
    currentBalance: numberValue(pick(records, ['total_current_balance', 'totalCurrentBalance', 'current_balance', 'currentBalance', 'total_balance', 'outstanding_balance'])),
    overdueAccounts: numberValue(pick(records, ['overdue_accounts', 'overdueAccounts', 'delinquent_accounts', 'past_due_accounts'])),
    recentEnquiries: numberValue(pick(records, ['recent_enquiries', 'recentEnquiries', 'enquiries_last_6_months', 'inquiries_last_6_months', 'enquiry_count'])),
    creditMix: textValue(pick(records, ['credit_mix', 'creditMix', 'mix_rating', 'portfolio_mix'])),
    reportDate: textValue(pick(records, ['report_date', 'reportDate', 'generated_at', 'generatedAt', 'created_at', 'createdAt'])),
    reference: textValue(pick(records, ['reference', 'report_reference', 'reportReference', 'report_id', 'reportId'])),
    nextUpdate: textValue(pick(records, ['next_update', 'nextUpdate', 'next_update_date', 'next_report_date'])),
  }
}

const formatCurrency = (value: number | null) => value === null
  ? '—'
  : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const formatDate = (value: string) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const scorePresentation = (score: number | null) => {
  if (score === null) return { label: 'Not available', color: '#94a3b8', background: 'bg-slate-100 text-slate-600' }
  if (score >= 750) return { label: 'Excellent', color: '#16a34a', background: 'bg-emerald-100 text-emerald-700' }
  if (score >= 700) return { label: 'Good', color: '#22c55e', background: 'bg-green-100 text-green-700' }
  if (score >= 650) return { label: 'Fair', color: '#eab308', background: 'bg-amber-100 text-amber-700' }
  return { label: 'Needs attention', color: '#f97316', background: 'bg-orange-100 text-orange-700' }
}

function ScoreGauge({ score }: { score: number | null }) {
  const presentation = scorePresentation(score)
  const progress = score === null ? 0 : Math.min(1, Math.max(0, (score - 300) / 600))
  const dashoffset = 100 - progress * 100

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center p-2">
      <div className="relative h-40 w-60 drop-shadow-md">
        <svg viewBox="0 0 220 130" className="h-full w-full" aria-label={score === null ? 'Credit score unavailable' : `Credit score ${score}`}>
          <defs>
            <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Background track */}
          <path d="M 25 110 A 85 85 0 0 1 195 110" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" pathLength="100" />
          {/* Progress track */}
          <path
            d="M 25 110 A 85 85 0 0 1 195 110"
            fill="none"
            stroke="url(#scoreArcGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={dashoffset}
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline justify-center gap-1">
            <strong className="text-4xl font-black tracking-tight text-navy sm:text-5xl">{score ?? '—'}</strong>
            <span className="text-xs font-semibold text-slate-400">/900</span>
          </div>
          <div className="mt-1 flex items-center justify-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-extrabold shadow-sm ${presentation.background}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
              </span>
              {presentation.label}
            </span>
          </div>
          <span className="mt-1 text-[11px] font-bold tracking-wide uppercase text-slate-400">Experian Score</span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, detail, tone = 'blue' }: { icon: ReactNode; label: string; value: ReactNode; detail: string; tone?: 'blue' | 'violet' | 'orange' | 'green' }) {
  const tones = {
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
    violet: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
    orange: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/20',
    green: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
  }
  return (
    <div className="group relative flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 ${tones[tone]}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-lg font-extrabold text-navy transition-colors group-hover:text-brand">{value}</p>
        <p className="mt-0.5 text-[10px] font-medium text-slate-500">{detail}</p>
      </div>
    </div>
  )
}

const LoadingOverview = () => (
  <section className="container-pb pb-10">
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
      <div className="h-7 w-52 rounded-lg bg-slate-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="h-44 rounded-2xl bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-24 rounded-2xl bg-slate-100" />)}
        </div>
      </div>
    </div>
  </section>
)

export default function ExperianCreditOverview() {
  const navigate = useNavigate()
  const {
    user,
    isAuthenticated,
    experianReport,
    experianLoading,
    experianError,
    refreshProfile,
    refreshExperianReport,
  } = useAuth()
  const { refreshLoans } = useLoans()
  const { refreshBalance } = useWallet()
  const requestedOnThisVisit = useRef(false)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const loadOverview = async () => {
    const profile = await refreshProfile().catch(() => user)
    if (profile && isRequiredProfileComplete(profile)) await refreshExperianReport(profile)
  }

  useEffect(() => {
    if (!isAuthenticated || requestedOnThisVisit.current) return
    requestedOnThisVisit.current = true
    void loadOverview().catch(() => undefined)
    // This request intentionally runs once each time the Home screen mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const overview = useMemo(() => experianReport ? normalizeOverview(experianReport) : null, [experianReport])
  const hasOverview = Boolean(overview && Object.values(overview).some((value) => value !== null && value !== ''))

  const handleDeepAnalysis = async () => {
    if (!consent || !user || submitting) return
    setSubmitting(true)
    setSubmissionError('')
    try {
      await fetchCrifReport({
        mobile: String(user.mobile ?? ''),
        first_name: String(user.first_name ?? '').trim(),
        last_name: String(user.last_name ?? '').trim(),
        name_lookup: 0,
      })
      await Promise.all([
        refreshLoans().catch(() => undefined),
        refreshBalance().catch(() => undefined),
      ])
      navigate('/credit-analysis/deep-analysis')
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'We could not start your credit analysis. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="container-pb pb-10">
        <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />
          <ShieldCheck className="mx-auto text-blue-400 drop-shadow-lg" size={40} />
          <h2 className="mt-4 text-2xl font-black text-white">Your Credit Overview, All in One Place</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-blue-100">
            Sign in and complete your profile to securely view your official Experian credit score and detailed analysis.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-navy shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-105"
          >
            Sign in to continue <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    )
  }

  if (experianLoading && !experianReport) return <LoadingOverview />

  if (!isRequiredProfileComplete(user)) {
    return (
      <section className="container-pb pb-10">
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-8 text-center shadow-lg">
          <FileSearch className="mx-auto text-amber-600" size={38} />
          <h2 className="mt-3 text-2xl font-extrabold text-navy">Complete your profile to view credit overview</h2>
          <p className="mt-2 text-sm text-slate-600">Your first name, last name, date of birth and PAN are needed to securely retrieve it.</p>
          <Link to="/profile" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105">
            Complete profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    )
  }

  if (!hasOverview) {
    return (
      <section className="container-pb pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <FileSearch className="mx-auto text-blue-600" size={38} />
          <h2 className="mt-3 text-2xl font-extrabold text-navy">Your credit overview is not available yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{experianError || 'We could not find enough credit information to build your overview right now.'}</p>
          <button type="button" onClick={() => void loadOverview().catch(() => undefined)} disabled={experianLoading} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60">
            {experianLoading && <Loader2 size={16} className="animate-spin" />} Try again
          </button>
        </div>
      </section>
    )
  }

  const data = overview!
  return (
    <section className="container-pb pb-10">
      {/* Top Section Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl">
        {/* Top vibrant gradient accent border */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-brand">
                <ShieldCheck size={14} /> Official Experian Bureau Report
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-navy md:text-3xl">Your Credit Overview</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Real-time credit score metrics & account health analysis</p>
            </div>
            <Link
              to="/credit-analysis/loans"
              className="group inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-blue-50/50 px-5 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-md"
            >
              View Full Credit Report <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-inner">
              <ScoreGauge score={data.score} />
              {data.nextUpdate && (
                <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
                  📅 Next report update on <span className="font-bold text-navy">{formatDate(data.nextUpdate)}</span>
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard icon={<CreditCard size={20} />} label="Total Accounts" value={data.totalAccounts ?? '—'} detail={`Active: ${data.activeAccounts ?? '—'}  ·  Closed: ${data.closedAccounts ?? '—'}`} />
              <MetricCard icon={<WalletCards size={20} />} label="Total Current Balance" value={formatCurrency(data.currentBalance)} detail="Across all credit accounts" tone="violet" />
              <MetricCard icon={<CalendarDays size={20} />} label="Overdue Accounts" value={data.overdueAccounts ?? '—'} detail={data.overdueAccounts === 0 ? '✨ Great! No active overdues' : '⚠️ Review overdue accounts'} tone="orange" />
              <MetricCard icon={<SearchCheck size={20} />} label="Recent Enquiries" value={data.recentEnquiries ?? '—'} detail="In latest report period" tone="green" />
              <MetricCard icon={<TrendingUp size={20} />} label="Credit Mix" value={data.creditMix || '—'} detail="Loan & Credit Card ratio" />
              <MetricCard icon={<ShieldCheck size={20} />} label="Report Date" value={formatExperianDate(data.reportDate) || '—'} detail={data.reference ? `Ref: ${data.reference}` : 'Latest available report'} tone="violet" />
            </div>
          </div>
        </div>

        {/* Lower Banner - Improvement Tips & Deep Credit Analysis */}
        <div className="border-t border-blue-100 bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-blue-50/90 p-6 md:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            {/* Real 3D Graphic Visual Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-slate-900 shadow-lg group">
              <img
                src="/images/products/credit_score_graphic_1787806109189.jpg"
                alt="Credit score 850 overview graphic"
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md rounded-lg bg-black/40 py-1 border border-white/20">
                ⭐ Score Growth Insights
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-blue-950 sm:text-lg">
                💡 Keep it up! Here’s how you can boost your credit score
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [CalendarDays, 'Pay bills on time', 'Timely payments build high trust'],
                  [CreditCard, 'Keep credit usage low', 'Use under 30% of total limit'],
                  [SearchCheck, 'Avoid frequent enquiries', 'Hard inquiries reduce score'],
                  [Landmark, 'Maintain long history', 'Older credit accounts boost score'],
                ].map(([Icon, title, detail]) => {
                  const TipIcon = Icon as typeof CalendarDays
                  return (
                    <div
                      key={String(title)}
                      className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white/90 p-3 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <TipIcon size={16} />
                      </span>
                      <div>
                        <strong className="block text-xs font-bold text-blue-950">{String(title)}</strong>
                        <span className="mt-0.5 block text-[10px] font-medium leading-tight text-slate-500">{String(detail)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Unlock Deep Credit Analysis Card */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-md transition-all hover:shadow-xl">
                <div className="flex flex-col gap-4 bg-gradient-to-r from-navy via-indigo-900 to-blue-900 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-md">
                      <Sparkles size={24} className="text-amber-300 animate-pulse" />
                    </span>
                    <div>
                      <p className="text-base font-extrabold text-white sm:text-lg">Unlock Deep Credit Analysis</p>
                      <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-blue-100">
                        Get an in-depth account-by-account audit, delinquency report, and personalized action plan.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-blue-900 shadow-lg sm:self-auto">
                    <IndianRupee size={20} strokeWidth={2.5} className="text-brand" />
                    <div>
                      <strong className="block text-2xl font-black leading-none text-navy">150</strong>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">One-time fee</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <label className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-300 ${consent ? 'border-blue-400 bg-blue-50/80 ring-2 ring-blue-200' : 'border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/50'}`}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      disabled={submitting}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      <strong className="block text-sm font-bold text-blue-950">I agree to continue with the deep credit analysis</strong>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                        I authorize a wallet deduction of <strong className="font-bold text-brand">₹150</strong> to generate my complete score report & analysis.
                      </span>
                    </span>
                  </label>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <LockKeyhole size={15} className="text-emerald-600" /> 100% Encrypted &amp; Secure Wallet Transaction
                    </span>
                    {consent && (
                      <div className="sm:text-right">
                        <button
                          type="button"
                          onClick={() => void handleDeepAnalysis()}
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
                        >
                          {submitting && <Loader2 size={18} className="animate-spin" />}
                          {submitting ? 'Processing Analysis…' : 'Submit & Analyze'}
                        </button>
                      </div>
                    )}
                  </div>
                  {submissionError && consent && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {submissionError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
