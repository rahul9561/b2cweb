import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, FileCheck2, Loader2, Mail, RefreshCw, WandSparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { generateDispute, getDisputeDetail, previewDispute, sendDisputeEmail, type Dispute } from '../lib/creditRepairApi'

const messageFrom = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback

const previewText = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return String(value ?? '')
  const record = value as Record<string, unknown>
  for (const key of ['html', 'preview', 'content', 'body', 'letter']) {
    if (typeof record[key] === 'string') return record[key]
  }
  return JSON.stringify(value, null, 2)
}

export default function DisputeDetailPage() {
  const { isAuthenticated } = useAuth()
  const { disputeId = '' } = useParams()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<'generate' | 'preview' | 'send' | ''>('')
  const [preview, setPreview] = useState('')
  const [confirmSend, setConfirmSend] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try { setDispute(await getDisputeDetail(disputeId)) }
    catch (requestError) { setError(messageFrom(requestError, 'We could not load this dispute.')) }
    finally { setLoading(false) }
  }, [disputeId])

  useEffect(() => { if (isAuthenticated && disputeId) void load() }, [disputeId, isAuthenticated, load])

  const previewIsHtml = useMemo(() => /<\s*(?:!doctype|html|body|div|p)\b/i.test(preview), [preview])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const runGenerate = async () => {
    setAction('generate'); setError(''); setNotice('')
    try { setDispute(await generateDispute(disputeId)); setNotice('Your lender dispute has been generated.') }
    catch (requestError) { setError(messageFrom(requestError, 'We could not generate the dispute.')) }
    finally { setAction('') }
  }

  const runPreview = async () => {
    setAction('preview'); setError(''); setNotice('')
    try { setPreview(previewText(await previewDispute(disputeId))) }
    catch (requestError) { setError(messageFrom(requestError, 'We could not load the lender preview.')) }
    finally { setAction('') }
  }

  const runSend = async () => {
    if (!confirmSend) return
    setAction('send'); setError(''); setNotice('')
    try { setDispute(await sendDisputeEmail(disputeId)); setNotice('The dispute email was sent to the lender successfully.'); setConfirmSend(false) }
    catch (requestError) { setError(messageFrom(requestError, 'We could not send the dispute email.')) }
    finally { setAction('') }
  }

  return (
    <main className="min-h-screen bg-blueBGMuted pb-16">
      <section className="border-b border-blue-100 bg-white"><div className="container-pb max-w-4xl py-9"><Link to="/loans/disputes" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate2-secondary hover:text-brand"><ArrowLeft size={16} /> Back to disputes</Link><h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Dispute workspace</h1><p className="mt-2 text-sm text-slate2-secondary">Generate the letter, review the lender copy, then confirm email delivery.</p></div></section>
      <div className="container-pb max-w-4xl py-8">
        {loading && <div className="grid min-h-48 place-items-center rounded-cardlg border border-slate2-border bg-white shadow-card"><Loader2 className="animate-spin text-brand" size={30} /></div>}
        {error && <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /> <span className="flex-1">{error}</span>{!dispute && <button type="button" onClick={() => void load()} className="inline-flex items-center gap-1 font-semibold"><RefreshCw size={14} /> Retry</button>}</div>}
        {notice && <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {notice}</div>}
        {!loading && dispute && <>
          <section className="rounded-cardlg border border-slate2-border bg-white p-6 shadow-card"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blueBG text-brand"><FileCheck2 size={24} /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-navy">{dispute.title || `${dispute.disputeType || 'Credit report'} dispute`}</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-brand">{dispute.status || 'Created'}</span></div><p className="mt-1 text-sm text-slate2-secondary">Dispute #{dispute.id}{dispute.accountId ? ` • Account #${dispute.accountId}` : ''}</p>{dispute.description && <p className="mt-4 text-sm leading-6 text-slate2-secondary">{dispute.description}</p>}</div></div></section>
          <section className="mt-5 grid gap-3 md:grid-cols-3"><button type="button" onClick={() => void runGenerate()} disabled={Boolean(action)} className="flex items-center justify-center gap-2 rounded-cardlg border border-slate2-border bg-white p-5 text-sm font-bold text-navy shadow-card hover:border-brand disabled:opacity-50">{action === 'generate' ? <Loader2 className="animate-spin" size={19} /> : <WandSparkles className="text-brand" size={19} />} Generate dispute</button><button type="button" onClick={() => void runPreview()} disabled={Boolean(action)} className="flex items-center justify-center gap-2 rounded-cardlg border border-slate2-border bg-white p-5 text-sm font-bold text-navy shadow-card hover:border-brand disabled:opacity-50">{action === 'preview' ? <Loader2 className="animate-spin" size={19} /> : <Eye className="text-brand" size={19} />} Preview for lender</button><div className="rounded-cardlg border border-slate2-border bg-white p-4 shadow-card"><label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate2-secondary"><input type="checkbox" checked={confirmSend} onChange={(event) => setConfirmSend(event.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />I reviewed the lender copy and confirm sending.</label><button type="button" onClick={() => void runSend()} disabled={!confirmSend || Boolean(action)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{action === 'send' ? <Loader2 className="animate-spin" size={17} /> : <Mail size={17} />} Send email</button></div></section>
          {preview && <section className="mt-6 overflow-hidden rounded-cardlg border border-slate2-border bg-white shadow-card"><div className="border-b border-slate2-border px-5 py-4"><h2 className="font-bold text-navy">Lender preview</h2><p className="mt-1 text-xs text-slate2-muted">This is the content returned by the preview endpoint.</p></div>{previewIsHtml ? <iframe title="Lender dispute preview" sandbox="" srcDoc={preview} className="h-[520px] w-full bg-white" /> : <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-5 text-sm leading-6 text-slate2-secondary">{preview}</pre>}</section>}
        </>}
      </div>
    </main>
  )
}
