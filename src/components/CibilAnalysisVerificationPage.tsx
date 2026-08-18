import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BadgeCheck, CheckCircle2, FileSearch, Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { useCreditAnalysis } from '../hooks/useCreditAnalysis'
import { saveCibilAnalysisSession } from '../lib/cibilAnalysisSession'

/**
 * Displays the data returned by POST /analysis/credit-analysis/cibil/
 * inside a "Cross Verify Information" container so the user can confirm
 * each field as Yes (correct) or No (incorrect).
 *
 * On "Submit Verification" we POST everything to /analysis/credit-analysis/upload/
 * and navigate to the success page.
 */
interface VerificationField {
  key: string
  label: string
  value: string
}

function extractFields(data: Record<string, unknown>): VerificationField[] {
  const fields: VerificationField[] = []
  const seen = new Set<string>()
  const pushField = (key: string, label: string, value: unknown) => {
    if (value === undefined || value === null) return
    const text = String(value).trim()
    if (!text || text === 'null' || text === 'undefined') return
    if (seen.has(key)) return
    seen.add(key)
    fields.push({ key, label, value: text })
  }

  // Top-level known keys
  const mapping: Array<[string, string]> = [
    ['name', 'Name'],
    ['full_name', 'Full Name'],
    ['fullname', 'Full Name'],
    ['customer_name', 'Customer Name'],
    ['mobile', 'Phone Number'],
    ['phone', 'Phone Number'],
    ['phone_number', 'Phone Number'],
    ['mobile_number', 'Phone Number'],
    ['pan', 'PAN Number'],
    ['pan_number', 'PAN Number'],
    ['dob', 'Date of Birth'],
    ['date_of_birth', 'Date of Birth'],
    ['gender', 'Gender'],
    ['email', 'Email'],
    ['email_id', 'Email'],
    ['address', 'Address'],
    ['address_line1', 'Address'],
    ['address_line2', 'Address'],
    ['city', 'City'],
    ['state', 'State'],
    ['pincode', 'Pincode'],
    ['pin_code', 'Pincode'],
    ['zip', 'Pincode'],
    ['zipcode', 'Pincode'],
    ['nationality', 'Nationality'],
    ['mother_name', 'Mother Name'],
    ['father_name', 'Father Name'],
    ['spouse_name', 'Spouse Name'],
    ['aadhaar', 'Aadhaar Number'],
    ['aadhaar_number', 'Aadhaar Number'],
    ['voter_id', 'Voter ID'],
    ['passport_number', 'Passport Number'],
  ]
  for (const [key, label] of mapping) {
    if (data[key] !== undefined && data[key] !== null) pushField(key, label, data[key])
  }

  // Nested objects like data: { ... } or result: { ... }
  const nestedKeys = ['data', 'result', 'details', 'customer', 'user', 'profile', 'consumer']
  for (const nested of nestedKeys) {
    const obj = data[nested]
    if (obj && typeof obj === 'object') {
      for (const [key, label] of mapping) {
        if ((obj as Record<string, unknown>)[key] !== undefined) {
          pushField(`${nested}.${key}`, label, (obj as Record<string, unknown>)[key])
        }
      }
    }
  }

  // Fall back to generic extraction for any remaining object keys
  const genericKeys = ['employer', 'company', 'occupation', 'income', 'credit_score', 'cibil_score', 'score', 'enquiry_count', 'account_count', 'active_accounts', 'total_outstanding', 'credit_utilisation', 'utilization', 'report_id', 'reportId', 'id', 'status', 'message', 'error']
  for (const key of genericKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      pushField(key, label, data[key])
    }
  }
  // Nested generic scan
  for (const nested of nestedKeys) {
    const obj = data[nested]
    if (obj && typeof obj === 'object') {
      for (const key of genericKeys) {
        if ((obj as Record<string, unknown>)[key] !== undefined && (obj as Record<string, unknown>)[key] !== null) {
          const label = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
          pushField(key, label, (obj as Record<string, unknown>)[key])
        }
      }
    }
  }
  return fields
}

export default function CibilCrossVerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const rawData = (location.state?.apiData ?? location.state?.data ?? {}) as Record<string, unknown>
  const fields = useMemo(() => extractFields(rawData), [rawData])

  const [verification, setVerification] = useState<Record<string, 'yes' | 'no'>>({})
  const [submitting, setSubmitting] = useState(false)
  const { submitVerification, loading, error: submitError } = useCreditAnalysis()

  const setAnswer = (key: string, answer: 'yes' | 'no') => {
    setVerification((current) => ({ ...current, [key]: answer }))
  }

  const allAnswered = fields.length > 0 && fields.every((field) => verification[field.key] === 'yes' || verification[field.key] === 'no')

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    try {
      const verificationData = Object.fromEntries(
        fields.map((field) => [field.key, verification[field.key] === 'yes'])
      )
      const payload = {
        ...rawData,
        verification: verificationData,
        submitted_at: new Date().toISOString(),
      }
      await submitVerification(payload)
      saveCibilAnalysisSession()
      navigate('/increase-cibil-score/success', { replace: true })
    } catch {
      // error handled by hook
    } finally {
      setSubmitting(false)
    }
  }

  if (fields.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-blue-950/5">
          <span className="mx-auto inline-flex rounded-2xl bg-amber-100 p-4 text-amber-600">
            <FileSearch size={30} />
          </span>
          <h1 className="mt-6 font-serif text-2xl font-bold text-navy">No Data to Verify</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not find any data returned from the analysis API. Please go back and try again.
          </p>
          <button
            onClick={() => navigate('/increase-cibil-score', { replace: true })}
            className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck size={14} /> Verification step
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Cross Verify Information</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Please confirm that the details returned from your PAN and mobile number are correct.
          </p>
        </div>

        {/* Container with all JSON data fields */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-950/5">
          <header className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
            <span className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
              <BadgeCheck size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-navy">Cross Verify Information</h2>
              <p className="text-xs text-slate-500">Confirm each detail below as Yes or No</p>
            </div>
          </header>

          <div className="divide-y divide-slate-100">
            {fields.map((field) => {
              const answer = verification[field.key]
              return (
                <div key={field.key} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{field.label}</p>
                    <p className="mt-1 break-words text-base font-semibold text-navy">{field.value}</p>
                  </div>
                  <div className="flex shrink-0 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAnswer(field.key, 'yes')}
                      className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                        answer === 'yes'
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 size={16} /> Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswer(field.key, 'no')}
                      className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                        answer === 'no'
                          ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      <XCircle size={16} /> No
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {!allAnswered && (
          <p className="mt-5 text-center text-sm font-medium text-amber-600">
            Please confirm all details with Yes / No before submitting.
          </p>
        )}

        {submitError && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
            {submitError}
          </p>
        )}

        {/* Submit Verification button — outside the container */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting || loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting || loading ? (
              <><Loader2 size={19} className="animate-spin" /> Submitting…</>
            ) : (
              <>Submit Verification</>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}