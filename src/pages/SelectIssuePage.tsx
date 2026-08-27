import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

const issueIdsFromReviewResponse = (value: unknown, ids = new Set<string>()): Set<string> => {
  if (Array.isArray(value)) {
    value.forEach((item) => issueIdsFromReviewResponse(item, ids))
    return ids
  }
  if (!value || typeof value !== 'object') return ids

  const record = value as Record<string, unknown>
  for (const key of ['issue_id', 'issueId']) {
    const issueId = record[key]
    if (typeof issueId === 'string' || typeof issueId === 'number') ids.add(String(issueId))
  }

  const issue = record.issue
  if (typeof issue === 'string' || typeof issue === 'number') ids.add(String(issue))
  else if (issue) issueIdsFromReviewResponse(issue, ids)

  for (const key of ['issues', 'data', 'result', 'response', 'payload']) {
    if (record[key]) issueIdsFromReviewResponse(record[key], ids)
  }
  return ids
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
  const [currentReviewIssue, setCurrentReviewIssue] = useState<CreditIssue | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const flowContentRef = useRef<HTMLDivElement>(null)

  const loadAccountIssues = useCallback(async (): Promise<CreditIssue[]> => {
    if (!reportId) return []
    const report = await getReportDetail(reportId)
    const accountIssues = report.issues.filter((issue) => issue.accountId === String(accountId))
    setIssues(accountIssues)
    return accountIssues
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

  useEffect(() => {
    if (!reviewSaved) return
    const frame = requestAnimationFrame(() => flowContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [reviewSaved])

  const canSubmit = useMemo(() => {
    if (reviewSaved) return false
    if (!decision) return false
    if (decision === 'INCORRECT' && incorrectFields.length === 0) return false
    if (decision !== 'CORRECT' && !notes.trim()) return false
    return true
  }, [decision, incorrectFields.length, notes, reviewSaved])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const toggleIncorrectField = (field: IncorrectField) => {
    setIncorrectFields((current) => current.includes(field) ? current.filter((value) => value !== field) : [...current, field])
    setError('')
  }

  const submitReview = async () => {
    if (!decision || !canSubmit || submitting) return
    const submittedDecision = decision
    const existingIssueIds = new Set(issues.map((issue) => issue.id).filter(Boolean))
    setSubmitting(true)
    setReviewSaved(false)
    setCurrentReviewIssue(null)
    setError('')
    setNotice('')
    try {
      const input: ReviewAccountInput = { decision: submittedDecision }
      if (submittedDecision === 'INCORRECT') input.incorrect_fields = incorrectFields
      if (submittedDecision !== 'CORRECT') input.notes = notes.trim()
      const reviewResponse = await reviewAccount(accountId, input)
      const responseIssueIds = issueIdsFromReviewResponse(reviewResponse)
      setAccount(await getAccountDetail(accountId))
      await refreshLoans().catch(() => undefined)
      const updatedIssues = await loadAccountIssues().catch(() => [] as CreditIssue[])
      const eligibleUpdatedIssues = updatedIssues.filter((issue) => issue.isDisputeEligible && issue.id)
      const responseIssue = eligibleUpdatedIssues
        .filter((issue) => responseIssueIds.has(issue.id))
        .reduce<CreditIssue | null>((latest, issue) => !latest || isNewerIssue(issue, latest) ? issue : latest, null)
      const newIssue = responseIssue || eligibleUpdatedIssues
        .filter((issue) => !existingIssueIds.has(issue.id))
        .reduce<CreditIssue | null>((latest, issue) => !latest || isNewerIssue(issue, latest) ? issue : latest, null)

      if (submittedDecision !== 'CORRECT') setCurrentReviewIssue(newIssue)
      setReviewSaved(true)
      setNotice(
        submittedDecision === 'CORRECT'
          ? 'Account confirmed as correct.'
          : newIssue
            ? 'Your review was saved. Complete the next step below to create the dispute.'
            : 'Your review was saved, but the API did not return a new dispute issue for this review.',
      )
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
      navigate(`/loans/disputes/${encodeURIComponent(dispute.id)}/`, { state: { allowGeneration: true } })
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not create the dispute. Please try again.'))
    } finally {
      setCreatingIssueId('')
    }
  }

  const status = loanStatus(account?.status || '')

  return (
    <main className="min-h-screen bg-blueBGMuted pb-0">
      <div className="container-pb max-w-5xl py-8 md:py-12">
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
          <div ref={flowContentRef} className={`mt-7 grid items-start gap-5 ${reviewSaved && decision === 'CORRECT' ? 'grid-cols-1' : 'lg:grid-cols-[220px_minmax(0,1fr)]'}`}>
            {!(reviewSaved && decision === 'CORRECT') && <aside className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your progress</p>
              <div className="mt-5">
                {[
                  { number: 1, title: 'Review account', detail: reviewSaved ? 'Review submitted' : 'Confirm the details', complete: reviewSaved, active: !reviewSaved },
                  { number: 2, title: 'Create dispute', detail: reviewSaved && decision !== 'CORRECT' ? 'Choose dispute type' : 'Available after review', complete: false, active: reviewSaved && decision !== 'CORRECT' },
                  { number: 3, title: 'Generate & send', detail: 'Review the lender copy', complete: false, active: false },
                ].map((step, index, steps) => (
                  <div key={step.number} className="relative flex gap-3 pb-7 last:pb-0">
                    {index < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px transition-colors duration-500 ${step.complete ? 'bg-brand' : 'bg-slate-200'}`} />}
                    <motion.span layout className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 ${step.complete ? 'border-brand bg-brand text-white' : step.active ? 'border-brand bg-blueBG text-brand shadow-[0_0_0_5px_rgba(0,102,255,0.08)]' : 'border-slate-200 bg-white text-slate2-muted'}`}>
                      {step.complete ? <CheckCircle2 size={16} /> : step.number}
                    </motion.span>
                    <div className="pt-0.5">
                      <p className={`text-sm font-bold ${step.active || step.complete ? 'text-navy' : 'text-slate2-muted'}`}>{step.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate2-muted">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>}

            <div className="min-w-0">
              {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}</motion.div>}

              <AnimatePresence mode="wait" initial={false}>
                {!reviewSaved ? (
                  <motion.section key="review" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="overflow-hidden rounded-cardlg border border-slate2-border bg-white shadow-card">
                    <div className="border-b border-slate2-border bg-gradient-to-r from-blueBG to-white px-5 py-5 sm:px-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand">Step 1 of 3</p>
                      <h2 className="mt-1 text-xl font-bold text-navy">Review account details</h2>
                      <p className="mt-1 text-sm leading-6 text-slate2-secondary">Tell us whether the lender information shown above is accurate.</p>
                    </div>
                    <div className="p-5 sm:p-6">
                      <label className="text-sm font-semibold text-navy" htmlFor="account-review-decision">Account review</label>
                      <select id="account-review-decision" name="decision" required value={decision} onChange={(event) => { setDecision(event.target.value as ReviewDecision | ''); setIncorrectFields([]); setNotes(''); setReviewSaved(false); setCurrentReviewIssue(null); setDisputeTypes({}); setError(''); setNotice('') }} className="mt-2 w-full rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10">
                        <option value="">Choose an option</option>
                        {decisionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>

                      <AnimatePresence initial={false}>
                        {decision === 'INCORRECT' && (
                          <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="mt-5 overflow-hidden">
                            <legend className="text-sm font-semibold text-navy">What is incorrect?</legend>
                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                              {incorrectFieldOptions.map((field) => (
                                <label key={field.value} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${incorrectFields.includes(field.value) ? 'border-brand bg-blue-50 text-brand shadow-sm' : 'border-slate2-border text-navy hover:border-brand/40'}`}>
                                  <input type="checkbox" checked={incorrectFields.includes(field.value)} onChange={() => toggleIncorrectField(field.value)} className="h-4 w-4 accent-blue-600" />{field.label}
                                </label>
                              ))}
                            </div>
                          </motion.fieldset>
                        )}
                      </AnimatePresence>

                      <AnimatePresence initial={false}>
                        {decision && decision !== 'CORRECT' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="mt-5">
                            <label className="block text-sm font-semibold text-navy" htmlFor="account-review-notes">Description</label>
                            <p className="mt-1 text-xs text-slate2-muted">Explain what is wrong so the lender receives clear and useful information.</p>
                            <textarea id="account-review-notes" name="notes" required value={notes} onChange={(event) => { setNotes(event.target.value); setError('') }} rows={6} placeholder="Explain what should be corrected in your credit report..." className="mt-2 w-full resize-y rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.section>
                ) : decision === 'CORRECT' ? (
                  <motion.section key="confirmed" initial={{ opacity: 0, y: 24, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42, ease: 'easeOut' }} className="relative min-h-[390px] overflow-hidden rounded-cardlg border border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50 p-7 shadow-card sm:p-10">
                    <motion.span aria-hidden="true" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.45, scale: 1 }} transition={{ duration: 0.7 }} className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-100 blur-2xl" />
                    <motion.span aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 0.2, duration: 0.7 }} className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-100 blur-2xl" />

                    <div className="relative z-10 mx-auto max-w-2xl text-center">
                      <div className="relative mx-auto h-24 w-24">
                        <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: [0.8, 1.12, 1], opacity: 1 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="absolute inset-0 rounded-full bg-emerald-100" />
                        <motion.span initial={{ scale: 0.5, rotate: -18 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 230, damping: 16, delay: 0.1 }} className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg shadow-emerald-100"><CheckCircle2 size={42} strokeWidth={2.2} /></motion.span>
                      </div>

                      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Review successfully submitted</motion.p>
                      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-2 font-serif text-2xl font-bold text-navy sm:text-3xl">Account review complete</motion.h2>
                      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate2-secondary">You confirmed that the information reported for this account is accurate. Your response has been saved successfully, and no dispute is required.</motion.p>

                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.35 }} className="mt-7 grid gap-3 text-left sm:grid-cols-2">
                        <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 shadow-sm backdrop-blur">
                          <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={19} /></span><div><h3 className="text-sm font-bold text-navy">Review saved</h3><p className="mt-1 text-xs leading-5 text-slate2-muted">Your confirmation is now recorded against this account.</p></div></div>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-white/90 p-4 shadow-sm backdrop-blur">
                          <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blueBG text-brand"><ShieldCheck size={19} /></span><div><h3 className="text-sm font-bold text-navy">No action needed</h3><p className="mt-1 text-xs leading-5 text-slate2-muted">Because the details are correct, no lender dispute will be created.</p></div></div>
                        </div>
                      </motion.div>

                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-xs leading-5 text-slate2-muted">You can use the Back button below to return to your previous page.</motion.p>
                    </div>
                  </motion.section>
                ) : (
                  <motion.section key="create-dispute" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: 'easeOut' }} className="overflow-hidden rounded-cardlg border border-slate2-border bg-white shadow-card">
                    <div className="flex items-start gap-4 border-b border-slate2-border bg-gradient-to-r from-blueBG to-white px-5 py-5 sm:px-6">
                      <motion.span initial={{ rotate: -12, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220 }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm"><ShieldCheck size={22} /></motion.span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand">Step 2 of 3</p>
                        <h2 className="mt-1 text-xl font-bold text-navy">Create your dispute</h2>
                        <p className="mt-1 text-sm leading-6 text-slate2-secondary">Your review is saved. Choose the dispute category before generating the lender copy.</p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      {notice && <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {notice}</div>}
                      {currentReviewIssue ? (
                        <>
                          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm"><FileWarning size={20} /></span>
                            <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wide text-amber-700">Issue created from this review</p><h3 className="mt-1 font-bold leading-6 text-navy">{currentReviewIssue.title}</h3>{currentReviewIssue.description && <p className="mt-1 text-sm leading-6 text-slate2-secondary">{currentReviewIssue.description}</p>}</div>
                          </motion.div>
                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="w-full sm:flex-1"><label htmlFor={`dispute-type-${currentReviewIssue.id}`} className="text-sm font-semibold text-navy">Dispute type</label><p className="mt-1 text-xs text-slate2-muted">Select the category that best describes the correction required.</p><select id={`dispute-type-${currentReviewIssue.id}`} value={disputeTypes[currentReviewIssue.id] || ''} onChange={(event) => setDisputeTypes((current) => ({ ...current, [currentReviewIssue.id]: event.target.value as DisputeTypeValue }))} className="mt-2 w-full rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"><option value="">Select dispute type</option>{disputeTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                            <button type="button" onClick={() => void startDispute(currentReviewIssue)} disabled={!disputeTypes[currentReviewIssue.id] || Boolean(creatingIssueId)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto">{creatingIssueId === currentReviewIssue.id ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}{creatingIssueId === currentReviewIssue.id ? 'Creating...' : 'Create dispute'}</button>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">The review was saved, but the API did not return a new issue ID. No previous or duplicate issue has been displayed.</div>
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-30 border-t border-slate2-border bg-white/95 shadow-[0_-8px_24px_rgba(23,43,77,0.08)] backdrop-blur">
        <div className="container-pb flex max-w-5xl items-center justify-between gap-3 py-4">
          <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate2-border px-5 py-3 text-sm font-semibold text-navy hover:border-brand disabled:opacity-50"><ArrowLeft size={16} /> Back</button>
          <button type="button" onClick={() => void submitReview()} disabled={!canSubmit || submitting || loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:flex-none">{submitting ? <Loader2 size={17} className="animate-spin" /> : reviewSaved ? <CheckCircle2 size={17} /> : <Send size={17} />}{submitting ? 'Saving review...' : reviewSaved ? 'Review completed' : 'Next Step'}</button>
        </div>
      </div>
    </main>
  )
}
