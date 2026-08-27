import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, CircleAlert, FileText, Loader2 } from 'lucide-react'
import { AppEndpoints } from '../../config/appConfig'
import { ApiClient, ApiError } from '../../lib/apiClient'

type Data = {
  firstName: string
  lastName: string
  dob: string
  pincode: string
  phone: string
  pan: string
}

/**
 * PAN-based score form used on credit-score article detail pages.
 * It mirrors the request and result flow used by `/cibil-score`.
 */
export default function CreditReportLeadForm() {
  const navigate = useNavigate()
  const [data, setData] = useState<Data>({
    firstName: '',
    lastName: '',
    dob: '',
    pincode: '',
    phone: '',
    pan: '',
  })
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submissionLock = useRef(false)

  const update = (key: keyof Data, value: string) => {
    setData((current) => ({ ...current, [key]: value }))
  }

  const errors = {
    firstName: !data.firstName.trim(),
    lastName: !data.lastName.trim(),
    dob: !data.dob,
    pincode: !/^\d{6}$/.test(data.pincode),
    phone: !/^\d{10}$/.test(data.phone),
    pan: data.pan.length !== 10,
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.values(errors).some(Boolean) || !consent || submissionLock.current) return

    submissionLock.current = true
    setLoading(true)
    setError('')
    try {
      const apiData = await ApiClient.post<Record<string, unknown>>(
        AppEndpoints.experianLoanReport,
        {
          mobile: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dob,
          pan: data.pan,
          pincode: data.pincode,
        },
        { auth: true },
      )
      const creditScore = (apiData.analysis as Record<string, unknown> | undefined)?.credit_score
      navigate('/cibil-score/score', {
        state: { apiData: { ...apiData, credit_score: creditScore } },
      })
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Could not fetch your CIBIL score. Please try again.',
      )
    } finally {
      submissionLock.current = false
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-white/20 bg-slate-900/60 p-6 sm:p-7 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-blue-300 shadow-inner">
          <FileText size={20} />
        </span>
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-white">Let&apos;s Get Started</h2>
          <p className="text-xs font-medium text-blue-200/80">Complete your details to continue</p>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        <Field label="First Name" error={submitted && errors.firstName}>
          <input value={data.firstName} onChange={(event) => update('firstName', event.target.value)} placeholder="Enter your first name" disabled={loading} />
        </Field>
        <Field label="Last Name" error={submitted && errors.lastName}>
          <input value={data.lastName} onChange={(event) => update('lastName', event.target.value)} placeholder="Enter your last name" disabled={loading} />
        </Field>
        <Field label="DOB" error={submitted && errors.dob}>
          <input type="date" value={data.dob} onChange={(event) => update('dob', event.target.value)} disabled={loading} className="[color-scheme:dark]" />
        </Field>
        <Field label="Pin Code" error={submitted && errors.pincode}>
          <input value={data.pincode} onChange={(event) => update('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="Enter 6-digit pin code" disabled={loading} />
        </Field>
        <Field label="Phone Number" error={submitted && errors.phone}>
          <input value={data.phone} onChange={(event) => update('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Enter 10-digit phone number" disabled={loading} />
        </Field>
        <Field label="PAN Number" error={submitted && errors.pan}>
          <input value={data.pan} onChange={(event) => update('pan', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="Enter PAN number" disabled={loading} className="font-mono" />
        </Field>

        <label className="flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 p-3 text-[11px] leading-4 text-slate-300 backdrop-blur-sm">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={loading} className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 accent-blue-500" />
          I consent to AV Management fetching my CIBIL score using the details provided and agree to the Terms of Use and Privacy Policy.
        </label>
        {submitted && !consent && (
          <p className="text-xs font-medium text-red-400">Please check the consent box to continue.</p>
        )}

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Fetching your score...</>
            : <>Get CIBIL PAN Report <ArrowRight size={16} /></>}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-400">
        <Check size={14} className="rounded-full bg-emerald-500/20 p-0.5" />
        <span>Secure and protected journey</span>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200">
      {label}
      <span className="mt-1 block [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-white/15 [&>input]:bg-white/[0.07] [&>input]:px-3.5 [&>input]:py-2.5 [&>input]:text-sm [&>input]:font-normal [&>input]:text-white [&>input]:placeholder:text-slate-400 [&>input]:outline-none [&>input]:transition [&>input]:focus:border-blue-400 [&>input]:focus:bg-white/[0.12] [&>input]:focus:ring-2 [&>input]:focus:ring-blue-400/25 [&>input]:disabled:opacity-50">{children}</span>
      {error && <FieldError />}
    </label>
  )
}

function FieldError() {
  return <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-400"><CircleAlert size={12} />Please complete this field correctly.</span>
}
