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
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-gradient-to-b from-[#f0f4fd] via-[#f7faff] to-[#edf3fc] text-slate-800">
      <style>{`
        @keyframes reportPageEnter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reportGlow {
          0%, 100% { transform: scale(1); opacity: .45; }
          50% { transform: scale(1.08); opacity: .7; }
        }
        .report-page-enter { animation: reportPageEnter .4s cubic-bezier(.2,.8,.2,1) both; }
        .report-glow { animation: reportGlow 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .report-page-enter, .report-glow { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="report-glow absolute -left-28 top-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="report-glow absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl [animation-delay:1.2s]" />
      </div>

      <main className="report-page-enter relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        {/* Return Button */}
        <button
          type="button"
          onClick={onClose}
          className="group mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to {reportName}</span>
        </button>

        {/* Header */}
        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 shadow-sm">
            <CheckCircle2 size={16} className="text-emerald-600" /> {otpVerified ? 'OTP Verified · Report Generated' : 'Report Generated Successfully'}
          </span>
          <h1 className="mt-4 font-sans text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Your Credit Report is Ready
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            Your official {reportName} has been generated securely and is ready for live preview or download.
          </p>
        </header>

        {/* Main Document Showcase Section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#081f4a] via-[#103d8f] to-[#39269e] px-6 py-6 text-white sm:px-10">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10 bg-white/10" />
            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-cyan-300/15 blur-2xl" />

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
                  <FileCheck2 size={30} className="text-white" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">{bureauName}</p>
                  <h2 className="mt-0.5 text-xl font-black text-white sm:text-2xl">{reportName}</h2>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm shadow-sm">
                <ShieldCheck size={16} className="text-emerald-300" /> {otpVerified ? 'OTP Verified & Bank Encrypted' : '256-Bit Encrypted'}
              </span>
            </div>
          </div>

          {/* Grid: Left Preview, Right Download Box */}
          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
            {/* Left Preview Box */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-inner sm:p-3">
              {documentUrl && isPdf ? (
                <iframe
                  src={documentUrl}
                  title={`${reportName} preview`}
                  className="h-[65vh] min-h-[500px] w-full rounded-xl border-0 bg-white shadow-sm md:min-h-[640px]"
                />
              ) : (
                <div className="grid h-[65vh] min-h-[500px] place-items-center rounded-xl bg-white px-6 text-center md:min-h-[640px]">
                  <div>
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-blue-600 border border-blue-100">
                      <FileText size={40} />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-900">Official Credit Report Document</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                      The document is generated and verified. Click the download button on the right to save the full PDF to your device.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Download Card */}
            <aside className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 p-6 sm:p-7">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-600/20">
                  <Sparkles size={14} className="text-amber-300" /> Instant Download
                </span>
                <h3 className="mt-4 text-2xl font-black text-slate-900">Download Your Official PDF</h3>
                <p className="mt-2 text-xs font-medium leading-6 text-slate-600">
                  Keep a permanent digital copy for your records, loan applications, or financial planning.
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    'Complete multi-page bureau report',
                    'Detailed account balances & DPD history',
                    otpVerified ? 'OTP-authenticated document' : 'Encrypted download link',
                    'Authorized for bank loan verification',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={downloadReport}
                  disabled={!documentUrl}
                  className={`group flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none ${
                    downloaded
                      ? 'bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-700'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/30 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl'
                  }`}
                >
                  {downloaded ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Report Downloaded Successfully</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                      <span>Download {reportName} PDF</span>
                    </>
                  )}
                </button>

                <p className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-slate-500">
                  <LockKeyhole size={13} className="text-emerald-600" /> Handled securely under RBI data protection guidelines.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Footer Navigation Buttons */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
          >
            <Home size={18} className="text-blue-600 transition-transform group-hover:scale-110" />
            <span>Return to Home Page</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="group flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 px-5 py-4 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
          >
            <RefreshCw size={18} className="transition-transform duration-500 group-hover:rotate-180" />
            <span>Generate Another {reportName}</span>
          </button>
        </div>
      </main>
    </div>,
    document.body
  )
}

export default PDFViewer
