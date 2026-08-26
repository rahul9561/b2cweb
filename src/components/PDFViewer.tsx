import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Home,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface PDFViewerProps {
  onClose: () => void
  reportName?: string
  bureauName?: string
  documentBytes?: Uint8Array | null
  externalDocumentUrl?: string
  mimeType?: string
  otpVerified?: boolean
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  onClose,
  reportName = 'CIBIL Report',
  bureauName = 'TransUnion CIBIL Limited',
  documentBytes = null,
  externalDocumentUrl = '',
  mimeType = 'application/pdf',
  otpVerified = true,
}) => {
  const navigate = useNavigate()
  const [downloaded, setDownloaded] = useState(false)
  const [documentUrl, setDocumentUrl] = useState('')
  const isPdf = mimeType.toLowerCase().includes('pdf')

  useEffect(() => {
    if (!documentBytes?.length) {
      setDocumentUrl(externalDocumentUrl)
      return
    }

    const stableBytes = new Uint8Array(documentBytes)
    const objectUrl = URL.createObjectURL(new Blob([stableBytes.buffer], { type: mimeType }))
    setDocumentUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [documentBytes, externalDocumentUrl, mimeType])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const downloadReport = () => {
    if (!documentUrl) return
    const link = document.createElement('a')
    link.href = documentUrl
    link.download = `${reportName.replace(/\s+/g, '_')}${isPdf ? '.pdf' : '.json'}`
    if (externalDocumentUrl) {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    }
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloaded(true)
  }

  const goHome = () => {
    onClose()
    navigate('/')
  }

  return createPortal(
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-[#f4f7fc] text-slate-800">
      <style>{`
        @keyframes reportPageEnter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reportGlow {
          0%, 100% { transform: scale(1); opacity: .45; }
          50% { transform: scale(1.08); opacity: .7; }
        }
        .report-page-enter { animation: reportPageEnter .5s cubic-bezier(.2,.8,.2,1) both; }
        .report-glow { animation: reportGlow 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .report-page-enter, .report-glow { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="report-glow absolute -left-28 top-16 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="report-glow absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl [animation-delay:1.2s]" />
      </div>

      <main className="report-page-enter relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <button
          type="button"
          onClick={onClose}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
        >
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to {reportName}
        </button>

        <header className="mb-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
            <CheckCircle2 size={15} /> {otpVerified ? 'Verification complete' : 'Report generated'}
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
            Your report is ready
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Your {reportName} has been generated securely and is ready to preview or download.
          </p>
        </header>

        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_70px_rgba(30,64,175,0.14)]">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#082e6d] via-[#1457c9] to-[#5438df] px-5 py-6 text-white sm:px-8 md:px-10">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10 bg-white/10" />
            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
                  <FileCheck2 size={29} />
                </span>
                <div>
                  <p className="text-sm font-medium text-blue-100">{bureauName}</p>
                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">{reportName}</h2>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck size={15} /> {otpVerified ? 'OTP verified & protected' : 'Securely generated'}
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-inner sm:p-3">
              {documentUrl && isPdf ? (
                <iframe
                  src={documentUrl}
                  title={`${reportName} preview`}
                  className="h-[62vh] min-h-[480px] w-full rounded-xl border-0 bg-white shadow-sm md:min-h-[620px]"
                />
              ) : (
                <div className="grid h-[62vh] min-h-[480px] place-items-center rounded-xl bg-white px-6 text-center md:min-h-[620px]">
                  <div>
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-blue-600">
                      <FileText size={38} />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-navy">Secure report document</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Preview is unavailable for this file type, but your verified report can still be downloaded securely.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <aside className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-6 sm:p-7">
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/20">
                  <Sparkles size={14} /> Ready now
                </span>
                <h3 className="mt-5 text-2xl font-bold text-navy">Download your report</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep a secure copy for your records, financial planning, or future credit applications.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    'Complete bureau report',
                    otpVerified ? 'OTP-verified document' : 'Securely generated document',
                    'Secure and private download',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check size={15} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={downloadReport}
                  disabled={!documentUrl}
                  className={`group flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none ${
                    downloaded
                      ? 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                      : 'bg-blue-600 shadow-blue-600/25 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl'
                  }`}
                >
                  {downloaded ? <CheckCircle2 size={19} /> : <Download size={19} className="transition-transform duration-300 group-hover:translate-y-0.5" />}
                  {downloaded ? 'Report downloaded' : `Download ${reportName}`}
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-5 text-slate-500">
                  <LockKeyhole size={13} /> Your report is handled securely and privately.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg"
          >
            <Home size={19} className="text-blue-600 transition-transform duration-300 group-hover:scale-110" />
            Go to Home Page
          </button>
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-100 hover:shadow-lg"
          >
            <RefreshCw size={19} className="transition-transform duration-500 group-hover:rotate-180" />
            Download another {reportName}
          </button>
        </div>
      </main>
    </div>,
    document.body
  )
}

export default PDFViewer
