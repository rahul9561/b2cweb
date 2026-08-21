import React, { useState } from 'react'
import { ArrowRight, FileText, Loader2, Phone } from 'lucide-react'
import OTPModal from './OTPModal'
import PDFViewer from './PDFViewer'
import { useCreditReport } from '../hooks/useCreditReport'
import InsufficientBalanceModal from './wallet/InsufficientBalanceModal'
import { formatReportPrice, useReportPurchaseGuard } from '../hooks/useReportPurchaseGuard'

export type ReportType = 'cibil' | 'equifax' | 'crif'

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

interface CreditReportFlowProps {
  reportType: ReportType
  reportName: string
  bureauName: string
}

/**
 * Reusable credit-report request flow used by CIBIL, Equifax and CRIF pages.
 *
 * Flow:
 *   1. User fills the form and authorizes the live report-price deduction.
 *   2. On submit we hit  POST /cibil/generate-report/  (same endpoint for every bureau;
 *      the bureau is selected by the `report_type` field in the body).
 *   3. We extract  `report_id`  from the response and hit  POST /cibil/send-otp/  with
 *      { mobile, report_id } to dispatch the OTP.
 *   4. The user enters the OTP in OTPModal → we call  POST /accounts/verify-otp/.
 *   5. On success the PDFViewer preview is shown so the report can be downloaded.
 *
 * For Equifax, four additional mandatory fields are collected:
 * DOB, Address, State Code, and Pincode. These are appended to the generate-
 * report payload ONLY for equifax so the CIBIL and CRIF APIs stay untouched.
 */
const CreditReportFlow: React.FC<CreditReportFlowProps> = ({ reportType, reportName, bureauName }) => {
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
  const submissionLock = React.useRef(false)

  const isEquifax = reportType === 'equifax'
  const generatesBeforeOtp = reportType === 'cibil' || reportType === 'equifax' || reportType === 'crif'
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

  const canSubmit =
    fullName &&
    phone.length === 10 &&
    pan.length === 10 &&
    gender &&
    consent &&
    (!isEquifax || (dob && address && stateCode && pincode))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (!canSubmit) return
    if (submissionLock.current) return

    submissionLock.current = true
    setIsSubmitting(true)
    try {
      // Step 1: Hit /cibil/generate-report/ → get report_id
      // Step 2: Hit /cibil/send-otp/ → sends OTP to mobile
      if (generatesBeforeOtp) {
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
        const id = reportData?.report_id ?? reportData?.reportId ?? reportData?.id
        const generatedReportId = id === undefined || id === null ? undefined : String(id)
        setReportId(generatedReportId)
        await reportPurchased()
        await sendOtp(phone, generatedReportId)
      } else {
        await sendOtp(phone)
      }

      // Step 3: Show OTP modal for user to enter & verify OTP
      setShowOTPModal(true)
    } catch (error) {
      if (await handleInsufficientApiError(error)) setError('')
      else setError(generatesBeforeOtp ? friendlyCibilError(error) : friendlyReportError(error))
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(phone, generatesBeforeOtp ? reportId : undefined, otp)
      if (!generatesBeforeOtp) {
        await generateReport({
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
        await reportPurchased()
      }
      setShowOTPModal(false)
      setShowPDFViewer(true)
    } catch (error) {
      if (await handleInsufficientApiError(error)) setError('')
      else setError(generatesBeforeOtp ? friendlyCibilError(error) : friendlyReportError(error))
      setShowOTPModal(false)
    }
  }

  const handleResendOtp = async () => {
    await sendOtp(phone, generatesBeforeOtp ? reportId : undefined)
  }

  if (showPDFViewer) return <PDFViewer onClose={() => setShowPDFViewer(false)} reportName={reportName} bureauName={bureauName} />

  return (
    <>
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
          <label className="block text-sm font-medium text-slate-700">
            PAN Number
            <input required value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="Enter PAN number" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 font-mono outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Gender</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {['male', 'female', 'Other'].map((option) => (
                <button type="button" onClick={() => setGender(option)} key={option} className={`rounded-lg border py-2.5 text-sm font-medium transition ${gender === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600 hover:border-blue-400'}`}>{option}</button>
              ))}
            </div>
          </fieldset>

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
          <p className="text-xs text-slate-500">An OTP will be sent to the mobile number provided.</p>

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
            disabled={isSubmitting || generating || price === null || !consent || !fullName || !phone || !pan || !gender || (isEquifax && (!dob || !address || !stateCode || !pincode))}
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

      {showOTPModal && <OTPModal phoneNumber={phone} onVerify={handleVerifyOtp} onResendOtp={handleResendOtp} onClose={() => setShowOTPModal(false)} />}
      <InsufficientBalanceModal {...insufficientModalProps} />
    </>
  )
}

export default CreditReportFlow
