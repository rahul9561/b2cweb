import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowLeft, Check, ChevronRight, FileCheck2, Loader2, RefreshCw, ShieldCheck, WandSparkles } from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { generateDispute, getDisputeDetail, type Dispute } from '../lib/creditRepairApi'

const messageFrom = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback

const displayStatus = (status: string) => (status || 'Created').replace(/_/g, ' ')

export default function DisputeDetailPage() {
  const { isAuthenticated } = useAuth()
  const { disputeId = '' } = useParams()
  const location = useLocation()
  const allowGeneration = Boolean((location.state as { allowGeneration?: boolean } | null)?.allowGeneration)
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
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

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const generatedLetter = dispute?.generatedLetter || dispute?.generatedEmailBody || dispute?.preview || ''
  const generated = Boolean(generatedLetter)
  const alreadySent = Boolean(dispute?.sentAt) || ['SUBMITTED', 'SENT', 'COMPLETED'].includes((dispute?.status || '').toUpperCase())
  const isDraftWorkflow = allowGeneration || (dispute?.status || '').toUpperCase() === 'DRAFT'

  const generate = async () => {
    if (!isDraftWorkflow || generated) return
    setGenerating(true)
    setError('')
    setNotice('')
    try {
      setDispute(await generateDispute(disputeId))
      setNotice('Your dispute letter is ready to review.')
    } catch (requestError) {
      setError(messageFrom(requestError, 'We could not generate the dispute. Please try again.'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-blueBGMuted pb-16">
      <section className="border-b border-blue-100 bg-white">
        <div className="container-pb max-w-4xl py-9">
          <Link to="/loans/disputes" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate2-secondary hover:text-brand"><ArrowLeft size={16} /> Back to disputes</Link>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">{isDraftWorkflow ? 'Generate your dispute' : 'Dispute details'}</h1>
          <p className="mt-2 text-sm text-slate2-secondary">{isDraftWorkflow ? 'Create a formal lender letter from the account issue you confirmed.' : 'Review the information and generated lender letter for this dispute.'}</p>
          {isDraftWorkflow && <div className="mt-7 grid grid-cols-2 gap-2 sm:max-w-md">
            <div className="rounded-xl bg-brand px-3 py-2.5 text-center text-xs font-bold text-white">1. Generate</div>
            <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-center text-xs font-semibold text-slate2-muted">2. Review</div>
          </div>}
        </div>
      </section>

      <div className="container-pb max-w-4xl py-8">
        {loading && <div className="grid min-h-56 place-items-center rounded-cardlg border border-slate2-border bg-white shadow-card"><Loader2 className="animate-spin text-brand" size={30} /></div>}
        {error && <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span className="flex-1">{error}</span>{!dispute && <button type="button" onClick={() => void load()} className="inline-flex items-center gap-1 font-semibold"><RefreshCw size={14} /> Retry</button>}</div>}
        {notice && <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><ShieldCheck size={18} className="mt-0.5 shrink-0" /> {notice}</div>}

        {!loading && dispute && <>
          <section className="rounded-cardlg border border-slate2-border bg-white p-6 shadow-card md:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${generated ? 'bg-emerald-50 text-emerald-600' : 'bg-blueBG text-brand'}`}>{generated ? <Check size={27} /> : <WandSparkles size={27} />}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-navy">{generated ? 'Dispute generated' : 'Generate lender dispute'}</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-brand">{displayStatus(dispute.status)}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate2-secondary">{generated ? 'Your formal letter has been created from the report, lender and issue details.' : 'We will prepare a professional dispute letter using the verified details associated with this issue.'}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate2-muted"><span>Dispute #{dispute.id}</span>{dispute.disputeType && <span>Type: {displayStatus(dispute.disputeType)}</span>}{dispute.lenderName && <span>Lender: {dispute.lenderName}</span>}</div>
              </div>
              {isDraftWorkflow && !generated && <button type="button" onClick={() => void generate()} disabled={generating} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50">{generating ? <Loader2 size={17} className="animate-spin" /> : <WandSparkles size={17} />}{generating ? 'Generating...' : 'Generate dispute'}</button>}
            </div>
          </section>

          {generated && <>
            <section className="mt-6 overflow-hidden rounded-cardlg border border-slate2-border bg-white shadow-card">
              <div className="flex flex-col gap-3 border-b border-slate2-border bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-brand">Generated lender letter</p><h2 className="mt-1 font-bold text-navy">{dispute.generatedEmailSubject || dispute.title || 'Credit Report Data Dispute'}</h2></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><FileCheck2 size={14} /> Ready for review</span></div>
              <div className="bg-slate-100 p-4 sm:p-7"><article className="mx-auto max-w-3xl rounded-sm border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10"><pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">{generatedLetter}</pre></article></div>
            </section>

            {isDraftWorkflow && !alreadySent && <section className="mt-6 flex flex-col gap-4 rounded-cardlg border border-blue-200 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-navy">Letter generated successfully</h2><p className="mt-1 text-sm text-slate2-secondary">Continue to verify the recipient, subject, message and attachments.</p></div><Link to={`/loans/disputes/${encodeURIComponent(dispute.id)}/preview`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Review lender email <ChevronRight size={17} /></Link></section>}
          </>}
        </>}
      </div>
    </main>
  )
}
