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
import improveScoreIllustration from '../../assets/images/illustration-thumbs-up.svg'
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
  return (
    <div className="relative mx-auto h-36 w-56">
      <svg viewBox="0 0 220 130" className="h-full w-full" aria-label={score === null ? 'Credit score unavailable' : `Credit score ${score}`}>
        <path d="M 25 110 A 85 85 0 0 1 195 110" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" pathLength="100" />
        <path d="M 25 110 A 85 85 0 0 1 195 110" fill="none" stroke={presentation.color} strokeWidth="12" strokeLinecap="round" pathLength="100" strokeDasharray={`${progress * 100} 100`} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <strong className="block text-4xl font-black text-navy">{score ?? '—'}</strong>
        <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${presentation.background}`}>{presentation.label}</span>
        <span className="mt-1 block text-xs font-semibold text-slate-500">Experian Score</span>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, detail, tone = 'blue' }: { icon: ReactNode; label: string; value: ReactNode; detail: string; tone?: 'blue' | 'violet' | 'orange' | 'green' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-500',
    green: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="flex min-h-24 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${tones[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="mt-1 truncate text-lg font-extrabold text-navy">{value}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">{detail}</p>
      </div>
    </div>
  )
}

const LoadingOverview = () => (
  <section className="container-pb pb-10">
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[260px_1fr]"><div className="h-36 rounded-xl bg-slate-100" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-24 rounded-xl bg-slate-100" />)}</div></div>
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
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-7 text-center shadow-card">
          <ShieldCheck className="mx-auto text-blue-600" size={32} />
          <h2 className="mt-3 text-xl font-bold text-navy">Your credit overview, all in one place</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Sign in and complete your profile to securely view your latest credit overview.</p>
          <Link to="/login" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Sign in to continue <ArrowRight size={15} /></Link>
        </div>
      </section>
    )
  }

  if (experianLoading && !experianReport) return <LoadingOverview />

  if (!isRequiredProfileComplete(user)) {
    return (
      <section className="container-pb pb-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7 text-center shadow-card">
          <FileSearch className="mx-auto text-amber-600" size={32} />
          <h2 className="mt-3 text-xl font-bold text-navy">Complete your profile to view your credit overview</h2>
          <p className="mt-2 text-sm text-slate-600">Your first name, last name, date of birth and PAN are needed to securely retrieve it.</p>
          <Link to="/profile" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Complete profile <ArrowRight size={15} /></Link>
        </div>
      </section>
    )
  }

  if (!hasOverview) {
    return (
      <section className="container-pb pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-card">
          <FileSearch className="mx-auto text-blue-600" size={32} />
          <h2 className="mt-3 text-xl font-bold text-navy">Your credit overview is not available yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{experianError || 'We could not find enough credit information to build your overview right now.'}</p>
          <button type="button" onClick={() => void loadOverview().catch(() => undefined)} disabled={experianLoading} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{experianLoading && <Loader2 size={15} className="animate-spin" />} Try again</button>
        </div>
      </section>
    )
  }

  const data = overview!
  return (
    <section className="container-pb pb-10">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 className="text-xl font-bold text-navy md:text-2xl">Your Credit Overview</h2><p className="mt-1 text-xs text-slate-500">As per your latest Experian credit report</p></div>
            <Link to="/credit-analysis/loans" className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">View Full Credit Report <ArrowRight size={14} /></Link>
          </div>

          <div className="mt-6 grid items-center gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div>
              <ScoreGauge score={data.score} />
              {data.nextUpdate && <p className="mt-3 text-center text-[10px] text-slate-500">Next update on {formatDate(data.nextUpdate)}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard icon={<CreditCard size={19} />} label="Total Accounts" value={data.totalAccounts ?? '—'} detail={`Active: ${data.activeAccounts ?? '—'}  ·  Closed: ${data.closedAccounts ?? '—'}`} />
              <MetricCard icon={<WalletCards size={19} />} label="Total Current Balance" value={formatCurrency(data.currentBalance)} detail="Across all accounts" tone="violet" />
              <MetricCard icon={<CalendarDays size={19} />} label="Overdue Accounts" value={data.overdueAccounts ?? '—'} detail={data.overdueAccounts === 0 ? 'Great! No active overdues' : 'Review overdue accounts'} tone="orange" />
              <MetricCard icon={<SearchCheck size={19} />} label="Recent Enquiries" value={data.recentEnquiries ?? '—'} detail="In the latest report period" tone="green" />
              <MetricCard icon={<TrendingUp size={19} />} label="Credit Mix" value={data.creditMix || '—'} detail="Based on your credit accounts" />
              <MetricCard icon={<ShieldCheck size={19} />} label="Report Date" value={formatExperianDate(data.reportDate) || '—'} detail={data.reference ? `Ref: ${data.reference}` : 'Latest available report'} tone="violet" />
            </div>
          </div>
        </div>

        <div className="border-t border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 px-5 py-6 md:px-7">
          <div className="grid items-center gap-6 lg:grid-cols-[170px_minmax(0,1fr)]">
            <img src={improveScoreIllustration} alt="Improve your credit score" className="mx-auto h-28 w-40 object-contain" />
            <div>
              <h3 className="font-bold text-blue-950">Keep it up! Here’s how you can improve your score</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [CalendarDays, 'Pay bills on time', 'Timely payments boost your score'],
                  [CreditCard, 'Keep credit usage low', 'Use less than 30% of your limit'],
                  [SearchCheck, 'Avoid frequent enquiries', 'Too many enquiries can lower your score'],
                  [Landmark, 'Maintain long credit history', 'Older accounts help improve your score'],
                ].map(([Icon, title, detail]) => {
                  const TipIcon = Icon as typeof CalendarDays
                  return <div key={String(title)} className="flex gap-3 border-blue-200 xl:border-r xl:pr-4 last:border-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-blue-600 shadow-sm"><TipIcon size={17} /></span><span><strong className="block text-xs text-blue-950">{String(title)}</strong><span className="mt-1 block text-[10px] leading-4 text-slate-500">{String(detail)}</span></span></div>
                })}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-white/90 shadow-sm">
                <div className="flex flex-col gap-4 bg-gradient-to-r from-blue-700 to-indigo-600 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20"><Sparkles size={21} /></span>
                    <div>
                      <p className="text-base font-bold text-white">Unlock your deep credit analysis</p>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100">Get a detailed review of your credit profile and identify opportunities to improve your score.</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-blue-700 shadow-lg sm:self-auto">
                    <IndianRupee size={18} strokeWidth={2.5} />
                    <div><strong className="block text-xl font-black leading-none">150</strong><span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">One-time charge</span></div>
                  </div>
                </div>
                <div className="p-5">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${consent ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/50'}`}>
                  <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={submitting} className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span><strong className="block text-sm font-semibold text-blue-950">I agree to continue with the analysis</strong><span className="mt-1 block text-xs leading-5 text-slate-600">I consent to this analysis and authorize a wallet deduction of <strong className="font-bold text-blue-700">₹150</strong>.</span></span>
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-500"><LockKeyhole size={14} className="text-emerald-600" /> Secure wallet transaction</span>
                {consent && (
                  <div className="sm:text-right">
                    <button type="button" onClick={() => void handleDeepAnalysis()} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:translate-y-0 disabled:opacity-60">
                      {submitting && <Loader2 size={16} className="animate-spin" />} {submitting ? 'Submitting…' : 'Submit'}
                    </button>
                  </div>
                )}
                </div>
                {submissionError && consent && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">{submissionError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
