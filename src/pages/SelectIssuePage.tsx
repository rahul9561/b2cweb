import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Send,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoans } from '../context/LoansContext'
import { reviewAccount } from '../lib/creditRepairApi'

type DecisionOption = {
  value: string
  label: string
}

const decisionLabel = (value: string) =>
  value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())

function decisionOptionsFrom(reviewStatus: unknown): DecisionOption[] {
  let source: unknown[] = []
  if (Array.isArray(reviewStatus)) {
    source = reviewStatus
  } else if (reviewStatus && typeof reviewStatus === 'object') {
    const record = reviewStatus as Record<string, unknown>
    const nestedOptions = record.choices ?? record.options ?? record.values
    if (nestedOptions !== undefined) return decisionOptionsFrom(nestedOptions)
    source = record.value !== undefined || record.decision !== undefined || record.code !== undefined
      ? [record]
      : Object.entries(record).map(([value, label]) => ({ value, label }))
  } else if (reviewStatus !== undefined && reviewStatus !== null) {
    source = [reviewStatus]
  }

  const options = source.flatMap((item): DecisionOption[] => {
    if (typeof item === 'string' || typeof item === 'number') {
      const value = String(item).trim()
      return value ? [{ value, label: decisionLabel(value) }] : []
    }
    if (!item || typeof item !== 'object') return []

    const record = item as Record<string, unknown>
    const rawValue = record.value ?? record.decision ?? record.code ?? record.key ?? record.review_status
    if (typeof rawValue !== 'string' && typeof rawValue !== 'number') return []
    const value = String(rawValue).trim()
    const rawLabel = record.label ?? record.name ?? record.title ?? record.display
    const label = typeof rawLabel === 'string' && rawLabel.trim() ? rawLabel.trim() : decisionLabel(value)
    return value ? [{ value, label }] : []
  })

  return options.filter((option, index) => options.findIndex(({ value }) => value === option.value) === index)
}

export default function SelectIssuePage() {
  const { isAuthenticated } = useAuth()
  const { accountId = '' } = useParams()
  const navigate = useNavigate()
  const { getLoanById } = useLoans()
  const loan = getLoanById(accountId)
  const [decision, setDecision] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const decisionOptions = useMemo(() => decisionOptionsFrom(loan?.raw.review_status), [loan])
  const canSubmit = Boolean(decision.trim() && notes.trim())

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const submit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await reviewAccount(accountId, {
        decision: decision.trim(),
        notes: notes.trim(),
      })
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not notify the lender. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-blueBGMuted px-4 py-14">
        <section className="w-full max-w-lg rounded-cardlg border border-slate2-border bg-white p-8 text-center shadow-card">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></span>
          <h1 className="mt-5 font-serif text-3xl font-bold text-navy">Email sent to the lender</h1>
          <p className="mt-3 text-sm leading-6 text-slate2-secondary">Your issue has been submitted successfully. You can review your other loan accounts at any time.</p>
          <button type="button" onClick={() => navigate('/loans')} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Back to loans <ChevronRight size={16} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-blueBGMuted pb-0">
      <div className="container-pb max-w-3xl py-8 md:py-12">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate2-secondary hover:text-brand"><ArrowLeft size={17} /> Back</button>
        <h1 className="mt-5 font-serif text-2xl font-bold leading-tight text-navy md:text-4xl">Select the issue for your a/c {loan?.lenderName || 'loan account'}</h1>
        <p className="mt-2 text-sm text-slate2-secondary">Choose the detail you want the lender to review and correct.</p>

        <section className="mt-8">
              <div className="overflow-hidden rounded-cardlg border border-slate2-border bg-white p-4 shadow-card">
                <label className="text-sm font-semibold text-navy" htmlFor="account-review-decision">Issue</label>
                <select id="account-review-decision" name="decision" required value={decision} onChange={(event) => { setDecision(event.target.value); setError('') }} className="mt-2 w-full rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">
                  <option value="">Select an issue</option>
                  {decisionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>

                <label className="mt-4 block text-sm font-semibold text-navy" htmlFor="account-review-notes">Description</label>
                <textarea id="account-review-notes" name="notes" required value={notes} onChange={(event) => { setNotes(event.target.value); setError('') }} rows={6} placeholder="Tell us what should be corrected in your credit report..." className="mt-2 w-full resize-y rounded-xl border border-slate2-border bg-white p-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
              </div>
        </section>

        {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}</div>}
      </div>

      <div className="sticky bottom-0 z-30 border-t border-slate2-border bg-white/95 shadow-[0_-8px_24px_rgba(23,43,77,0.08)] backdrop-blur">
        <div className="container-pb flex max-w-3xl items-center justify-between gap-3 py-4">
          <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate2-border px-5 py-3 text-sm font-semibold text-navy hover:border-brand disabled:opacity-50"><ArrowLeft size={16} /> Back</button>
          <button type="button" onClick={() => void submit()} disabled={!canSubmit || submitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
            {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            {submitting ? 'Sending...' : 'Send email to the lender'}
          </button>
        </div>
      </div>
    </main>
  )
}
