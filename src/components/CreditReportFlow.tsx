import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CircleAlert, FileText, Loader2, Phone, X } from 'lucide-react'
import OTPModal from './OTPModal'
import PDFViewer from './PDFViewer'
import { useCreditReport } from '../hooks/useCreditReport'
import InsufficientBalanceModal from './wallet/InsufficientBalanceModal'
import { formatReportPrice, useReportPurchaseGuard } from '../hooks/useReportPurchaseGuard'
import { ApiError } from '../lib/apiClient'
import { useAuth } from '../context/AuthContext'

export type ReportType = 'cibil' | 'experian' | 'equifax' | 'crif'

const friendlyReportError = (error: unknown): string => {
  const message = error instanceof Error ? error.message.trim() : ''
  if (!message) return 'Could not generate your report. Please try again.'
  if (/<(?:!doctype|html|head|body)\b|page not found|\b404\b/i.test(message)) {
    return 'The report service is currently unavailable. Please try again later.'
  }
  return message
}

const friendlyCibilError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : ''
  if (/token.*(?:not valid|invalid|expired)|(?:invalid|expired).*token/i.test(message)) {
    return 'Your login session has expired. Please sign in again and retry.'
  }
  return friendlyReportError(error)
}

const isAuthenticationError = (error: unknown): boolean => {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return true
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /authentication credentials|not authenticated|login session|token.*(?:not valid|invalid|expired)|(?:invalid|expired).*token/i.test(message)
}

interface CreditReportFlowProps {
  reportType: ReportType
  reportName: string
  bureauName: string
}

/**
 * Reusable credit-report request flow used by CIBIL, Experian, Equifax and CRIF pages.
 *
 * Flow:
 *   1. User fills the form and authorizes the live report-price deduction.
 *   2. On submit we hit the selected bureau's generation endpoint.
 *   3. We preserve the returned report bytes, extract `report_id`, and send
 *      { mobile, report_id } to the configured OTP endpoint.
 *   4. The user enters the OTP in OTPModal and we verify { report_id, otp }.
 *   5. On success the PDFViewer preview is shown so the report can be downloaded.
 *
 * For Equifax, four additional mandatory fields are collected:
 * DOB, Address, State Code, and Pincode. These are appended to the generate-
 * report payload ONLY for equifax so the CIBIL, Experian and CRIF APIs stay untouched.
 */
const CreditReportFlow: React.FC<CreditReportFlowProps> = ({ reportType, reportName, bureauName }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pan, setPan] = useState('')
  const [gender, setGender] = useState('')
  const [consent, setConsent] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportId, setReportId] = useState<string | undefined>()
  const [documentMimeType, setDocumentMimeType] = useState('application/pdf')
  const [reportDocumentUrl, setReportDocumentUrl] = useState('')
  const [loginToast, setLoginToast] = useState<{ id: number; message: string } | null>(null)
  const submissionLock = React.useRef(false)
  const documentBytes = React.useRef<Uint8Array | null>(null)

  const isEquifax = reportType === 'equifax'
  const isCrif = reportType === 'crif'
  // Equifax-specific fields
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [pincode, setPincode] = useState('')

  const { generateReport, sendOtp, verifyOtp, loading: generating, error: reportError, setError } = useCreditReport()
  const {
    price,
    handleInsufficientApiError,
    reportPurchased,
    insufficientModalProps,
  } = useReportPurchaseGuard(reportType)

  React.useEffect(() => {
    if (!loginToast) return
    const timeoutId = window.setTimeout(() => {
      setLoginToast((current) => current?.id === loginToast.id ? null : current)
    }, 4500)
    return () => window.clearTimeout(timeoutId)
  }, [loginToast])

  const redirectToLogin = () => {
    const message = `Please log in first to generate your ${reportName}.`
    setLoginToast({ id: Date.now(), message })
    navigate('/login', { state: { authToast: message } })
  }

  const canSubmit =
    fullName &&
    phone.length === 10 &&
    (isCrif || (pan.length === 10 && gender)) &&
    consent &&
    (!isEquifax || (dob && address && stateCode && pincode))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (!canSubmit) return
    if (!isAuthenticated) {
      redirectToLogin()
      return
    }
    if (submissionLock.current) return

    submissionLock.current = true
    setIsSubmitting(true)
    documentBytes.current = null
    setReportDocumentUrl('')
    setReportId(undefined)
    try {
      const reportData = await generateReport({
        name: fullName,
        mobile: phone,
        pan,
        gender,
        reportType,
        consent,
        dob,
        address,
        stateCode,
        pincode,
      })
      const generatedReportId = reportData.reportId
      documentBytes.current = reportData.documentBytes
      setDocumentMimeType(reportData.mimeType)
      setReportDocumentUrl(reportData.creditReportLink)

      if (isCrif) {
        setShowPDFViewer(true)
        void reportPurchased()
        return
      }

      if (!generatedReportId) {
        documentBytes.current = null
        throw new Error('OTP verification cannot start because the report service did not return a report ID. Please try again.')
      }
      setReportId(generatedReportId)
      await reportPurchased()
      await sendOtp(reportType, phone, generatedReportId)

      // Step 3: Show OTP modal for user to enter & verify OTP
      setShowOTPModal(true)
    } catch (error) {
      documentBytes.current = null
      setReportDocumentUrl('')
      setReportId(undefined)
      if (isAuthenticationError(error)) {
        redirectToLogin()
        return
      }
      if (await handleInsufficientApiError(error)) setError('')
      else setError(friendlyCibilError(error))
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    try {
      if (!reportId) throw new Error('The report ID is unavailable. Please generate the report again.')
      await verifyOtp(reportType, reportId, otp)
      setShowOTPModal(false)
      setShowPDFViewer(true)
    } catch (error) {
      documentBytes.current = null
      setReportDocumentUrl('')
      setReportId(undefined)
      if (isAuthenticationError(error)) {
        redirectToLogin()
        return
      }
      if (await handleInsufficientApiError(error)) setError('')
      else setError(friendlyCibilError(error))
      setShowOTPModal(false)
    }
  }

  const handleResendOtp = async () => {
    if (!reportId) throw new Error('The report ID is unavailable. Please generate the report again.')
    await sendOtp(reportType, phone, reportId)
  }

  const closeOtp = () => {
    documentBytes.current = null
    setReportDocumentUrl('')
    setReportId(undefined)
    setShowOTPModal(false)
  }

  const closePdf = () => {
    documentBytes.current = null
    setReportDocumentUrl('')
    setReportId(undefined)
    setShowPDFViewer(false)
  }

  if (showPDFViewer) return <PDFViewer onClose={closePdf} reportName={reportName} bureauName={bureauName} documentBytes={documentBytes.current} externalDocumentUrl={reportDocumentUrl} mimeType={documentMimeType} otpVerified={!isCrif} />

  return (
    <>
      {loginToast && (
        <div
          key={loginToast.id}
          role="alert"
          aria-live="assertive"
          className="fixed left-1/2 top-24 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-red-200 bg-white px-4 py-3.5 shadow-[0_18px_45px_rgba(15,23,42,0.22)]"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <CircleAlert size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">Login required</p>
            <p className="mt-0.5 text-sm leading-5 text-slate-600">{loginToast.message}</p>
          </div>
          <button type="button" aria-label="Dismiss login message" onClick={() => setLoginToast(null)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={17} />
          </button>
        </div>
      )}
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-900/5 md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-xl bg-blue-100 p-3 text-blue-600"><FileText size={22} /></span>
          <div>
            <h2 className="text-2xl font-bold text-navy">Let&rsquo;s Get Started</h2>
            <p className="text-xs text-slate-500">Complete your details to continue</p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Full Name
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Phone Number
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" className="w-full rounded-lg border border-slate-300 py-3 pl-9 pr-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </label>
          {!isCrif && <label className="block text-sm font-medium text-slate-700">
            PAN Number
            <input required value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="Enter PAN number" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 font-mono outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>}
          {!isCrif && <fieldset>
            <legend className="text-sm font-medium text-slate-700">Gender</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {['male', 'female', 'Other'].map((option) => (
                <button type="button" onClick={() => setGender(option)} key={option} className={`rounded-lg border py-2.5 text-sm font-medium transition ${gender === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600 hover:border-blue-400'}`}>{option}</button>
              ))}
            </div>
          </fieldset>}

          {/* ── Equifax-specific fields: DOB, Address, State Code, Pincode ── */}
          {isEquifax && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Date of Birth
                <input
                  required
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Address
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                State Code
                <input
                  required
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
                  placeholder="e.g. U.P"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 font-mono outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Pincode
                <input
                  required
                  type="tel"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit pincode"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </>
          )}

          {attempted && isEquifax && (!dob || !address || !stateCode || !pincode) && (
            <p className="text-xs font-medium text-red-600">
              Please fill in all the required details (DOB, Address, State Code, Pincode) to continue.
            </p>
          )}
          <p className="text-xs text-slate-500">
            {isCrif ? 'Your report will be available to download after generation.' : 'An OTP will be sent to the mobile number provided.'}
          </p>

          {/* ── Mandatory consent ── */}
          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
            />
            I authorize the deduction of {formatReportPrice(price)} from my wallet balance to generate this report.
          </label>
          {attempted && !consent && (
            <p className="text-xs font-medium text-red-600">Please provide your consent to continue.</p>
          )}
          {reportError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {reportError}
            </p>
          )}

          <button
            disabled={isSubmitting || generating || price === null || !consent || !fullName || !phone || (!isCrif && (!pan || !gender)) || (isEquifax && (!dob || !address || !stateCode || !pincode))}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting || generating ? (
              <><Loader2 size={17} className="animate-spin" /> Generating report...</>
            ) : (
              <>Get {reportName} <ArrowRight size={17} /></>
            )}
          </button>
          <p className="text-center text-[11px] leading-4 text-slate-500">By continuing, you agree to the Terms of Use and Privacy Policy.</p>
        </div>
      </form>

      {showOTPModal && <OTPModal phoneNumber={phone} onVerify={handleVerifyOtp} onResendOtp={handleResendOtp} onClose={closeOtp} />}
      <InsufficientBalanceModal {...insufficientModalProps} />
    </>
  )
}

export default CreditReportFlow
