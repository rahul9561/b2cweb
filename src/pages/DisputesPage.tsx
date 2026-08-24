import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowLeft, ChevronRight, FileCheck2, Loader2, RefreshCw } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listDisputes, type Dispute } from '../lib/creditRepairApi'

const messageFrom = (error: unknown) => error instanceof Error ? error.message : 'We could not load your disputes.'

const statusClass = (status: string) => {
  const value = status.toUpperCase()
  if (value.includes('SENT') || value.includes('COMPLETE')) return 'bg-emerald-50 text-emerald-700'
  if (value.includes('GENERATED') || value.includes('READY')) return 'bg-blue-50 text-brand'
  return 'bg-amber-50 text-amber-700'
}

export default function DisputesPage() {
  const { isAuthenticated } = useAuth()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setDisputes(await listDisputes())
    } catch (requestError) {
      setError(messageFrom(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (isAuthenticated) void load() }, [isAuthenticated, load])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <main className="min-h-screen bg-blueBGMuted pb-16">
      <section className="border-b border-blue-100 bg-white">
        <div className="container-pb py-9">
          <Link to="/loans" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate2-secondary hover:text-brand"><ArrowLeft size={16} /> Back to loans</Link>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Your disputes</h1>
          <p className="mt-2 text-sm text-slate2-secondary">Review the details and current status of your credit-report disputes.</p>
        </div>
      </section>

      <section className="container-pb max-w-4xl py-8">
        {loading && <div className="grid min-h-48 place-items-center rounded-cardlg border border-slate2-border bg-white shadow-card"><Loader2 className="animate-spin text-brand" size={30} /></div>}
        {error && !loading && <div className="rounded-cardlg border border-red-200 bg-white p-8 text-center shadow-card"><AlertCircle className="mx-auto text-red-500" size={32} /><p className="mt-3 text-sm text-red-700">{error}</p><button type="button" onClick={() => void load()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"><RefreshCw size={15} /> Retry</button></div>}
        {!loading && !error && disputes.length === 0 && <div className="rounded-cardlg border border-slate2-border bg-white p-10 text-center shadow-card"><FileCheck2 className="mx-auto text-brand" size={36} /><h2 className="mt-4 text-xl font-bold text-navy">No disputes yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate2-secondary">Review an account and create a dispute from an eligible issue. It will then appear here.</p><Link to="/loans" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">Review loans <ChevronRight size={16} /></Link></div>}
        {!loading && !error && disputes.length > 0 && <div className="space-y-4">{disputes.map((dispute) => <article key={dispute.id} className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blueBG text-brand"><FileCheck2 size={24} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-navy">{dispute.title || `${dispute.disputeType || 'Credit report'} dispute`}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(dispute.status)}`}>{dispute.status || 'Created'}</span></div><p className="mt-1 text-sm text-slate2-secondary">Dispute #{dispute.id}{dispute.accountId ? ` • Account #${dispute.accountId}` : ''}</p>{dispute.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate2-muted">{dispute.description}</p>}</div><Link to={`/loans/disputes/${encodeURIComponent(dispute.id)}`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Open <ChevronRight size={16} /></Link></div></article>)}</div>}
      </section>
    </main>
  )
}
