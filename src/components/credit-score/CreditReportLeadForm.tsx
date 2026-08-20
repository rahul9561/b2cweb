import { useRef, useState } from 'react'
import { ArrowRight, Check, CircleAlert, FileText, Loader2 } from 'lucide-react'
import OTPModal from '../OTPModal'
import PDFViewer from '../PDFViewer'
import InsufficientBalanceModal from '../wallet/InsufficientBalanceModal'
import { useCreditReport, type ReportType } from '../../hooks/useCreditReport'
import { formatReportPrice, useReportPurchaseGuard } from '../../hooks/useReportPurchaseGuard'

type Data = { name: string; phone: string; pan: string; gender: string }

type CreditReportLeadFormProps = {
  reportType?: ReportType
  reportName?: string
  bureauName?: string
}

export default function CreditReportLeadForm({
  reportType = 'cibil',
  reportName = 'CIBIL Report',
  bureauName = 'TransUnion CIBIL Limited',
}: CreditReportLeadFormProps) {
  const [data, setData] = useState<Data>({ name: '', phone: '', pan: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [reportId, setReportId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submissionLock = useRef(false)
  const { generateReport, sendOtp, verifyOtp, loading, error, setError } = useCreditReport()
  const {
    price,
    checkingBalance,
    ensureSufficientBalance,
    handleInsufficientApiError,
    reportPurchased,
    insufficientModalProps,
  } = useReportPurchaseGuard(reportType)

  const update = (key: keyof Data, value: string) => setData((current) => ({ ...current, [key]: value }))
  const errors = {
    name: !data.name.trim(),
    phone: data.phone.length !== 10,
    pan: data.pan.length !== 10,
    gender: !data.gender,
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.values(errors).some(Boolean) || submissionLock.current) return

    submissionLock.current = true
    setIsSubmitting(true)
    setError('')
    try {
      if (!await ensureSufficientBalance()) return
      const report = await generateReport({
        name: data.name,
        mobile: data.phone,
        pan: data.pan,
        gender: data.gender,
        reportType,
        consent: true,
      })
      await reportPurchased()
      const id = String(report?.report_id ?? report?.reportId ?? report?.id ?? '')
      if (!id) throw new Error('The report was created but no report ID was returned.')
      setReportId(id)
      await sendOtp(data.phone, id)
      setShowOtp(true)
    } catch (requestError) {
      if (await handleInsufficientApiError(requestError)) setError('')
      else setError(requestError instanceof Error ? requestError.message : 'Could not generate report. Please try again.')
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  const verify = async (otp: string) => {
    if (!reportId) return
    await verifyOtp(data.phone, reportId, otp)
    setShowOtp(false)
    setShowPDFViewer(true)
  }

  const resend = async () => {
    if (reportId) await sendOtp(data.phone, reportId)
  }

  if (showPDFViewer) {
    return <PDFViewer onClose={() => setShowPDFViewer(false)} reportName={reportName} bureauName={bureauName} />
  }

  const requestInFlight = isSubmitting || loading || checkingBalance

  return (
    <>
      <form onSubmit={submit} noValidate className="rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-950/10">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-blue-100 p-2.5 text-blue-600"><FileText size={21} /></span>
          <div>
            <h2 className="font-serif text-xl font-bold text-navy">Let&apos;s Get Started</h2>
            <p className="text-xs text-slate-500">Live price: {formatReportPrice(price)}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <Field label="Full Name" error={submitted && errors.name}>
            <input value={data.name} onChange={(event) => update('name', event.target.value)} placeholder="Enter your full name" disabled={requestInFlight} />
          </Field>
          <Field label="Phone Number" error={submitted && errors.phone}>
            <input value={data.phone} onChange={(event) => update('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Enter 10-digit number" disabled={requestInFlight} />
          </Field>
          <Field label="PAN Number" error={submitted && errors.pan}>
            <input value={data.pan} onChange={(event) => update('pan', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="ABCDE1234F" disabled={requestInFlight} />
          </Field>
          <div>
            <p className="text-xs font-semibold text-slate-700">Gender</p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map((item) => (
                <button type="button" key={item} disabled={requestInFlight} onClick={() => update('gender', item)} className={`rounded-lg border py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${data.gender === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}>
                  {item}
                </button>
              ))}
            </div>
            {submitted && errors.gender && <FieldError />}
          </div>
          <p className="text-[11px] leading-4 text-slate-500">The live report price will be deducted from your wallet. An OTP will be sent to your mobile number.</p>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
          <button disabled={requestInFlight || price === null} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {requestInFlight ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <>Get {reportName} · {formatReportPrice(price)} <ArrowRight size={16} /></>}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-emerald-700"><Check size={13} />Secure and protected journey</div>
      </form>

      {showOtp && <OTPModal phoneNumber={data.phone} onClose={() => setShowOtp(false)} onVerify={verify} onResendOtp={resend} />}
      <InsufficientBalanceModal {...insufficientModalProps} />
    </>
  )
}

function Field({ label, error, children }: { label: string; error: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label}
      <span className="mt-1 block [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-slate-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:font-normal [&>input]:outline-none [&>input]:focus:border-blue-600 [&>input]:disabled:bg-slate-50">{children}</span>
      {error && <FieldError />}
    </label>
  )
}

function FieldError() {
  return <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600"><CircleAlert size={12} />Please complete this field correctly.</span>
}
