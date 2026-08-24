import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, FileWarning, Loader2, Send, ShieldCheck } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { displayAccountNumber, formatLoanAmount, loanStatus, loanTypeIcon } from '../components/loans/loanCardHelpers'
import { useAuth } from '../context/AuthContext'
import { useLoans } from '../context/LoansContext'
import {
  createDispute,
  getAccountDetail,
  getReportDetail,
  reviewAccount,
  type CreditIssue,
  type DisputeTypeValue,
  type IncorrectField,
  type LoanAccount,
  type ReviewAccountInput,
  type ReviewDecision,
} from '../lib/creditRepairApi'

const decisionOptions: Array<{ value: ReviewDecision; label: string }> = [
  { value: 'CORRECT', label: 'All account details are correct' },
  { value: 'NOT_RECOGNIZED', label: 'I do not recognize this account' },
  { value: 'INCORRECT', label: 'Some account details are incorrect' },
]

const incorrectFieldOptions: Array<{ value: IncorrectField; label: string }> = [
  { value: 'BALANCE', label: 'Balance' },
  { value: 'STATUS', label: 'Account status' },
  { value: 'DATES', label: 'Opened or closed dates' },
]

const disputeTypeOptions: Array<{ value: DisputeTypeValue; label: string }> = [
  { value: 'OWNERSHIP', label: 'Ownership Dispute' },
  { value: 'BALANCE', label: 'Incorrect Balance' },
  { value: 'OVERDUE', label: 'Incorrect Overdue' },
  { value: 'STATUS', label: 'Incorrect Status' },
  { value: 'DATES', label: 'Incorrect Dates' },
  { value: 'DPD', label: 'Incorrect Payment History / DPD' },
  { value: 'DUPLICATE', label: 'Duplicate Account' },
  { value: 'PERSONAL_INFO', label: 'Personal Information' },
  { value: 'OTHER', label: 'Other' },
]

const messageFrom = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback

const issueTime = (issue: CreditIssue) => {
  const parsed = Date.parse(issue.createdAt)
  return Number.isFinite(parsed) ? parsed : 0
}

const isNewerIssue = (candidate: CreditIssue, current: CreditIssue) => {
  const timeDifference = issueTime(candidate) - issueTime(current)
  if (timeDifference !== 0) return timeDifference > 0
  return Number(candidate.id) > Number(current.id)
}

export default function SelectIssuePage() {
  const { isAuthenticated } = useAuth()
  const { accountId = '' } = useParams()
  const navigate = useNavigate()
  const { getLoanById, refreshLoans, reportId } = useLoans()
  const contextLoan = getLoanById(accountId)
  const [account, setAccount] = useState<LoanAccount | undefined>(contextLoan)
  const [issues, setIssues] = useState<CreditIssue[]>([])
  const [decision, setDecision] = useState<ReviewDecision | ''>('')
  const [incorrectFields, setIncorrectFields] = useState<IncorrectField[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [creatingIssueId, setCreatingIssueId] = useState('')
  const [disputeTypes, setDisputeTypes] = useState<Record<string, DisputeTypeValue>>({})
  const [reviewSaved, setReviewSaved] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadAccountIssues = useCallback(async () => {
    if (!reportId) return
    const report = await getReportDetail(reportId)
    setIssues(report.issues.filter((issue) => issue.accountId === String(accountId)))
  }, [accountId, reportId])

  useEffect(() => {
    if (!isAuthenticated || !accountId) return
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getAccountDetail(accountId), loadAccountIssues().catch(() => undefined)])
      .then(([detail]) => { if (active) setAccount(detail) })
      .catch((requestError) => { if (active) setError(messageFrom(requestError, 'We could not load this account.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accountId, isAuthenticated, loadAccountIssues])

  const canSubmit = useMemo(() => {
    if (reviewSaved) return false
    if (!decision) return false
    if (decision === 'INCORRECT' && incorrectFields.length === 0) return false
    if (decision !== 'CORRECT' && !notes.trim()) return false
    return true
  }, [decision, incorrectFields.length, notes, reviewSaved])

  const eligibleIssues = useMemo(() => {
    const newestByIssue = new Map<string, CreditIssue>()
    issues.filter((issue) => issue.isDisputeEligible).forEach((issue) => {
      const key = `${issue.accountId}|${issue.issueType.trim().toUpperCase()}|${issue.title.trim().toLowerCase()}`
      const current = newestByIssue.get(key)
      if (!current || isNewerIssue(issue, current)) newestByIssue.set(key, issue)
    })
    return [...newestByIssue.values()].sort((left, right) => issueTime(right) - issueTime(left))
  }, [issues])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const toggleIncorrectField = (field: IncorrectField) => {
    setIncorrectFields((current) => current.includes(field) ? current.filter((value) => value !== field) : [...current, field])
    setError('')
  }

  const submitReview = async () => {
    if (!decision || !canSubmit || submitting) return
    setSubmitting(true)
    setReviewSaved(false)
    setError('')
    setNotice('')
    try {
      const input: ReviewAccountInput = { decision }
      if (decision === 'INCORRECT') input.incorrect_fields = incorrectFields
      if (decision !== 'CORRECT') input.notes = notes.trim()
      await reviewAccount(accountId, input)
      setAccount(await getAccountDetail(accountId))
      await Promise.all([refreshLoans().catch(() => undefined), loadAccountIssues().catch(() => undefined)])
      setReviewSaved(true)
      setNotice(decision === 'CORRECT' ? 'Account confirmed as correct.' : 'Your review was saved. You can now continue with an eligible issue below.')
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not review this account. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const startDispute = async (issue: CreditIssue) => {
    const disputeType = disputeTypes[issue.id]
    if (!issue.id || !disputeType || creatingIssueId) return
    setCreatingIssueId(issue.id)
    setError('')
    try {
      const dispute = await createDispute(issue.id, { dispute_type: disputeType })
      if (!dispute.id) throw new Error('The server did not return a dispute ID.')
      navigate(`/loans/disputes/${encodeURIComponent(dispute.id)}/`)
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not create the dispute. Please try again.'))
    } finally {
      setCreatingIssueId('')
    }
  }

  const status = loanStatus(account?.status || '')

  return (
    <main className="min-h-screen bg-blueBGMuted pb-0">
      <div className="container-pb max-w-3xl py-8 md:py-12">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate2-secondary hover:text-brand"><ArrowLeft size={17} /> Back</button>
        <h1 className="mt-5 font-serif text-2xl font-bold leading-tight text-navy md:text-4xl">Review your {account?.lenderName || contextLoan?.lenderName || 'loan account'}</h1>
        <p className="mt-2 text-sm text-slate2-secondary">Confirm the account or tell us which information needs to be corrected.</p>

        {loading ? (
          <div className="mt-8 animate-pulse rounded-cardlg border border-slate2-border bg-white p-6 shadow-card"><div className="h-5 w-48 rounded bg-slate-200" /><div className="mt-4 h-20 rounded-xl bg-slate-100" /></div>
        ) : account && (
          <section className="mt-8 rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blueBG text-brand">{loanTypeIcon(account.accountType, 'h-6 w-6')}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-navy">{account.lenderName || 'Loan provider'}</h2><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}>{status.label}</span></div>
                <p className="mt-1 text-sm text-slate2-secondary">{account.typeLabel} <span className="mx-1 text-slate-300">•</span> {displayAccountNumber(account.maskedNumber)}</p>
                <p className="mt-2 text-xs text-slate2-muted">Current balance: <strong className="text-navy">{formatLoanAmount(account.currentBalance)}</strong></p>
              </div>
            </div>
          </section>
        )}

        {!loading && account && (
          <section className="mt-6 overflow-hidden rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
            <label className="text-sm font-semibold text-navy" htmlFor="account-review-decision">Account review</label>
            <select id="account-review-decision" name="decision" required value={decision} onChange={(event) => { setDecision(event.target.value as ReviewDecision | ''); setIncorrectFields([]); setNotes(''); setReviewSaved(false); setError(''); setNotice('') }} className="mt-2 w-full rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">
              <option value="">Choose an option</option>
              {decisionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>

            {decision === 'INCORRECT' && (
              <fieldset className="mt-5">
                <legend className="text-sm font-semibold text-navy">What is incorrect?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {incorrectFieldOptions.map((field) => (
                    <label key={field.value} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium ${incorrectFields.includes(field.value) ? 'border-brand bg-blue-50 text-brand' : 'border-slate2-border text-navy'}`}>
                      <input type="checkbox" checked={incorrectFields.includes(field.value)} onChange={() => toggleIncorrectField(field.value)} className="h-4 w-4 accent-blue-600" />{field.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {decision && decision !== 'CORRECT' && (
              <div className="mt-5">
                <label className="block text-sm font-semibold text-navy" htmlFor="account-review-notes">Description</label>
                <textarea id="account-review-notes" name="notes" required value={notes} onChange={(event) => { setNotes(event.target.value); setError('') }} rows={6} placeholder="Explain what should be corrected in your credit report..." className="mt-2 w-full resize-y rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
              </div>
            )}
          </section>
        )}

        {notice && <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {notice}</div>}
        {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}</div>}

        {!loading && eligibleIssues.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-navy">Eligible issues</h2><p className="mt-1 text-sm text-slate2-secondary">Create a dispute for an issue confirmed on this account.</p></div><ShieldCheck className="text-brand" size={24} /></div>
            <div className="mt-3 space-y-3">
              {eligibleIssues.map((issue) => (
                <article key={issue.id} className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
                  <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><FileWarning size={20} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{issue.title}</h3><span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-600">{issue.severity}</span></div><p className="mt-2 text-sm leading-6 text-slate2-secondary">{issue.description}</p>{issue.recommendedAction && <p className="mt-2 text-xs leading-5 text-slate2-muted">{issue.recommendedAction}</p>}</div></div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:max-w-xs"><label htmlFor={`dispute-type-${issue.id}`} className="text-sm font-semibold text-navy">Dispute type</label><select id={`dispute-type-${issue.id}`} value={disputeTypes[issue.id] || ''} onChange={(event) => setDisputeTypes((current) => ({ ...current, [issue.id]: event.target.value as DisputeTypeValue }))} className="mt-2 w-full rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"><option value="">Select dispute type</option>{disputeTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                    <button type="button" onClick={() => void startDispute(issue)} disabled={!disputeTypes[issue.id] || Boolean(creatingIssueId)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{creatingIssueId === issue.id ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}{creatingIssueId === issue.id ? 'Creating...' : 'Create dispute'}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="sticky bottom-0 z-30 border-t border-slate2-border bg-white/95 shadow-[0_-8px_24px_rgba(23,43,77,0.08)] backdrop-blur">
        <div className="container-pb flex max-w-3xl items-center justify-between gap-3 py-4">
          <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate2-border px-5 py-3 text-sm font-semibold text-navy hover:border-brand disabled:opacity-50"><ArrowLeft size={16} /> Back</button>
          <button type="button" onClick={() => void submitReview()} disabled={!canSubmit || submitting || loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">{submitting ? <Loader2 size={17} className="animate-spin" /> : reviewSaved ? <CheckCircle2 size={17} /> : <Send size={17} />}{submitting ? 'Submitting...' : reviewSaved ? 'Review saved' : 'Submit review'}</button>
        </div>
      </div>
    </main>
  )
}
