import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowLeft, Check, CheckCircle2, FileText, Loader2, Mail, Paperclip, RefreshCw, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDisputeDetail, previewDispute, sendDisputeEmail, type Dispute, type DisputePreview } from '../lib/creditRepairApi'

const messageFrom = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback

export default function DisputePreviewPage() {
  const { isAuthenticated } = useAuth()
  const { disputeId = '' } = useParams()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [preview, setPreview] = useState<DisputePreview | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [detail, lenderPreview] = await Promise.all([getDisputeDetail(disputeId), previewDispute(disputeId)])
      setDispute(detail)
      setPreview(lenderPreview)
      setSent(Boolean(detail.sentAt) || ['SUBMITTED', 'SENT', 'COMPLETED'].includes(detail.status.toUpperCase()))
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not load the lender email preview.'))
    } finally {
      setLoading(false)
    }
  }, [disputeId])

  useEffect(() => { if (isAuthenticated && disputeId) void load() }, [disputeId, isAuthenticated, load])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const send = async () => {
    if (!preview?.readyToSend || sending || sent) return
    setSending(true)
    setError('')
    try {
      const result = await sendDisputeEmail(disputeId)
      setDispute(result)
      setSent(true)
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not send the dispute email. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-blueBGMuted pb-28">
      <section className="border-b border-blue-100 bg-white">
        <div className="container-pb max-w-4xl py-9">
          <Link to={`/loans/disputes/${encodeURIComponent(disputeId)}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate2-secondary hover:text-brand"><ArrowLeft size={16} /> Back to generated letter</Link>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Review lender email</h1>
          <p className="mt-2 text-sm text-slate2-secondary">Verify every detail below before sending this dispute to the lender.</p>
          <div className="mt-7 grid grid-cols-2 gap-2 sm:max-w-md">
            <div className="flex items-center justify-center gap-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-center text-xs font-bold text-emerald-700"><Check size={14} /> Generate</div>
            <div className={`flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-center text-xs font-bold ${sent ? 'bg-emerald-50 text-emerald-700' : 'bg-brand text-white'}`}>{sent && <Check size={14} />}{sent ? 'Review complete' : '2. Review'}</div>
          </div>
        </div>
      </section>

      <div className="container-pb max-w-4xl py-8">
        {loading && <div className="grid min-h-64 place-items-center rounded-cardlg border border-slate2-border bg-white shadow-card"><Loader2 className="animate-spin text-brand" size={30} /></div>}
        {error && <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span className="flex-1">{error}</span>{!preview && <button type="button" onClick={() => void load()} className="inline-flex items-center gap-1 font-semibold"><RefreshCw size={14} /> Retry</button>}</div>}

        {!loading && preview && dispute && <>
          {sent ? <section className="rounded-cardlg border border-emerald-200 bg-white p-8 text-center shadow-card"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></span><h2 className="mt-5 font-serif text-2xl font-bold text-navy">Dispute email sent</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate2-secondary">Your dispute was submitted to the lender successfully. You can track its latest status from your disputes.</p><Link to="/loans/disputes" className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">Back to disputes</Link></section> : <>
            {!preview.readyToSend && <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle size={19} className="mt-0.5 shrink-0" /><div><p className="font-semibold">This email is not ready to send</p><p className="mt-1 leading-6">The preview API did not return a verified lender recipient. Sending will become available when the lender email is available.</p></div></div>}

            <section className="overflow-hidden rounded-cardlg border border-slate2-border bg-white shadow-card">
              <div className="border-b border-slate2-border bg-slate-50 px-6 py-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand">Email preview</p><h2 className="mt-1 text-lg font-bold text-navy">Ready for your final review</h2></div><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${preview.readyToSend ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{preview.readyToSend ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}{preview.readyToSend ? 'Ready to send' : 'Recipient required'}</span></div></div>

              <div className="grid border-b border-slate2-border sm:grid-cols-[120px_minmax(0,1fr)]"><div className="bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate2-muted">To</div><div className="px-6 py-4 text-sm font-semibold text-navy">{preview.to || preview.toMasked || 'Lender email unavailable'}</div></div>
              <div className="grid border-b border-slate2-border sm:grid-cols-[120px_minmax(0,1fr)]"><div className="bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate2-muted">Subject</div><div className="px-6 py-4 text-sm font-semibold text-navy">{preview.subject || dispute.generatedEmailSubject || 'Credit Report Data Dispute'}</div></div>
              <div className="grid border-b border-slate2-border sm:grid-cols-[120px_minmax(0,1fr)]"><div className="bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate2-muted">Attachment</div><div className="flex flex-wrap gap-2 px-6 py-4">{preview.attachments.length ? preview.attachments.map((attachment) => <span key={attachment} className="inline-flex items-center gap-1.5 rounded-lg border border-slate2-border bg-white px-3 py-2 text-xs font-semibold text-navy"><Paperclip size={14} className="text-brand" /> {attachment}</span>) : <span className="text-sm text-slate2-muted">No attachments</span>}</div></div>

              <div className="bg-slate-100 p-4 sm:p-7"><article className="mx-auto max-w-3xl rounded-sm border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10"><div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-sm font-semibold text-navy"><FileText size={18} className="text-brand" /> Dispute message</div><pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">{preview.message || dispute.generatedEmailBody || dispute.generatedLetter}</pre></article></div>
            </section>
          </>}
        </>}
      </div>

      {!loading && preview && dispute && !sent && <div className="sticky bottom-0 z-30 border-t border-slate2-border bg-white/95 shadow-[0_-8px_24px_rgba(23,43,77,0.08)] backdrop-blur"><div className="container-pb flex max-w-4xl flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-navy">Final step: send to lender</p><p className="mt-0.5 text-xs text-slate2-muted">Clicking Send email confirms this lender communication.</p></div><button type="button" onClick={() => void send()} disabled={!preview.readyToSend || sending} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50">{sending ? <Loader2 size={17} className="animate-spin" /> : <Mail size={17} />}{sending ? 'Sending...' : 'Send email'}</button></div></div>}
    </main>
  )
}
