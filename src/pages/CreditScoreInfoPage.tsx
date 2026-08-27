import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Check, CheckCircle2, ChevronDown, ChevronUp, CircleAlert, Clock, FileText, Gauge, Lightbulb, Loader2, RefreshCw, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react'
import OTPModal from '../components/OTPModal'
import PDFViewer from '../components/PDFViewer'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'
import { useCreditAnalysis } from '../hooks/useCreditAnalysis'
import { formatBlockedDate, getCibilAnalysisBlockedUntil } from '../lib/cibilAnalysisSession'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'
import { useAuth } from '../context/AuthContext'

type PageKind = 'equifax' | 'crif' | 'pan' | 'improve'
type FormData = {
  name: string
  firstName: string
  lastName: string
  dob: string
  pincode: string
  phone: string
  pan: string
  gender: string
}

const configs: Record<PageKind, {
  title: string
  eyebrow: string
  intro: string
  report: string
  sections: Array<{ heading: string; text: string; points: string[] }>
}> = {
  equifax: {
    title: 'Check Equifax Credit Score & Report',
    eyebrow: 'Equifax credit profile',
    intro: 'Your credit score helps lenders understand your credit behaviour. Review your Equifax report to better understand the information used in credit decisions.',
    report: 'Equifax Report',
    sections: [
      {
        heading: 'Features of Credit Score by Equifax India',
        text: 'Equifax uses a proprietary algorithm to create a credit score from the information available in your credit profile.',
        points: [
          'Helps lenders assess the creditworthiness of a prospective borrower.',
          'Lets you monitor repayment track record, account activity and credit health.',
          'Reflects repayment history, credit utilisation, new credit and the length of credit history.',
        ],
      },
      {
        heading: '5 Steps to Check Your Equifax Credit Report',
        text: 'A clear report journey gives you a simple way to review your credit profile.',
        points: [
          'Provide your basic identity details and PAN number.',
          'Verify the mobile number through a one-time password.',
          'Review the generated Equifax report.',
          'Download a PDF copy for your records.',
          'Raise a discrepancy with Equifax if a record needs correction.',
        ],
      },
      {
        heading: '5 Factors that Affect Your Equifax Credit Score',
        text: 'These credit habits can influence the score shown in your report.',
        points: [
          'Payment history: timely loan EMI and card bill payments show responsible behaviour.',
          'Credit utilisation: keep use of your available credit proportionate to your limit.',
          'Credit mix: a healthy balance of secured and unsecured products can help.',
          'New credit applications: multiple applications in a short period may affect the score.',
          'Length of credit history: a longer responsible history gives lenders more context.',
        ],
      },
    ],
  },
  crif: {
    title: 'CRIF High Mark Credit Report & Score',
    eyebrow: 'CRIF credit profile',
    intro: 'CRIF High Mark is a credit bureau that records credit information used by lenders. Use your report to understand your current credit profile and related score indicators.',
    report: 'CRIF High Mark Report',
    sections: [
      {
        heading: 'What is CRIF High Mark Credit Score?',
        text: 'CRIF High Mark provides credit information services for borrowers, lenders, businesses and institutions.',
        points: [
          'Credit score ranges from 300 to 900 for eligible credit profiles.',
          'A stronger score may support better eligibility for credit offers.',
          'CRIF High Mark reports help assess repayment behaviour and credit exposure.',
        ],
      },
      {
        heading: 'CRIF High Mark Credit Score Range and Meaning',
        text: 'These broad indicators help you understand the range displayed in a CRIF report.',
        points: [
          '900: highest CRIF credit score possible.',
          '800+: very good credit standing.',
          '650-799: good for credit approval with scope for improvement.',
          '580-649: average score that may need improvement.',
          'Below 579: poor score; improve credit behaviour before applying for new credit.',
        ],
      },
      {
        heading: 'Factors Affecting the CRIF High Mark Credit Score',
        text: 'The report reflects information reported by credit institutions.',
        points: [
          'Payment history and timely settlements.',
          'Length of credit history and account age.',
          'Recent credit applications and enquiries.',
          'Credit utilisation across active accounts.',
          'Accuracy of personal and loan information reported to the bureau.',
        ],
      },
    ],
  },
  pan: {
    title: 'Check Your CIBIL Score',
    eyebrow: 'PAN-based credit check',
    intro: 'A PAN helps credit bureaus match your credit information. Use it with your verified mobile number to access your CIBIL credit profile.',
    report: 'CIBIL PAN Report',
    sections: [
      {
        heading: 'Check CIBIL Score',
        text: 'Your PAN is a unique identification number used to access credit information connected with your active credit profile.',
        points: [
          'Enter your PAN and basic personal details.',
          'Verify your registered mobile number via OTP.',
          'Review your generated score and report summary.',
          'Keep your PAN information accurate across all financial accounts.',
        ],
      },
      {
        heading: 'Importance of PAN Card in Credit Report',
        text: 'PAN acts as an identifier for credit products such as loans and credit cards.',
        points: [
          'PAN helps credit information companies identify the correct credit profile.',
          'Lenders use related credit information to assess repayment risk.',
          'A valid PAN makes it easier to maintain consistent credit records.',
          'PAN is used only for the permitted credit-reporting purpose.',
        ],
      },
      {
        heading: 'Factors that Affect Your CIBIL Score',
        text: 'Maintain healthy credit behaviour to build a more reliable profile over time.',
        points: [
          'Pay loan EMIs and card bills before the due date.',
          'Avoid very high credit utilisation on your available limits.',
          'Space out new loan and credit-card applications.',
          'Review your report and raise a correction for any inaccurate information.',
        ],
      },
    ],
  },
  improve: {
    title: 'How to Increase CIBIL Score',
    eyebrow: 'Build a stronger profile',
    intro: 'A healthy credit score can strengthen your eligibility for loans and credit cards. Responsible credit habits and regular review can help improve your profile over time.',
    report: 'Credit Profile Report',
    sections: [
      {
        heading: 'Why Do You Need a Good CIBIL Score?',
        text: 'Lenders use credit information to understand how consistently an applicant has handled past credit.',
        points: [
          'Improve your chances of credit approval.',
          'Access more favourable interest rates.',
          'Establish a stronger borrowing profile.',
          'Help access higher credit limits where applicable.',
        ],
      },
      {
        heading: 'Common Reasons for a Low CIBIL Score',
        text: 'A score can be affected by several patterns in your credit behaviour.',
        points: [
          'Delayed or missed loan and card repayments.',
          'High credit utilisation relative to your available limit.',
          'Errors or duplicate records in the credit report.',
          'Several loan or credit-card applications in a short time.',
          'Settled or written-off accounts that remain on the report.',
        ],
      },
      {
        heading: '6 Practical Ways to Improve Your Credit Score',
        text: 'Improvement generally takes time and consistent financial behaviour.',
        points: [
          'Review your report to identify missed payments or incorrect accounts.',
          'Pay every due on or before the due date.',
          'Keep credit utilisation low and avoid maxing out available limits.',
          'Avoid multiple applications within a short duration.',
          'Build a healthy history with responsible use of credit.',
        ],
      },
    ],
  },
}

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200">
    {label}
    {children}
    {error && <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400"><CircleAlert size={13} />{error}</span>}
  </label>
)

const getCreditAnalysisErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) return 'Please sign in again and retry.'
    if (error.status === 404 || /<\/?(?:html|body|head|footer)\b/i.test(error.message)) {
      return 'The credit analysis service is currently unavailable. Please try again later.'
    }
    if (error.message && !/^Request failed \(\d+\)$/.test(error.message)) return error.message
  }
  return 'We could not generate your credit analysis report. Please try again.'
}

const isAuthenticationError = (error: unknown) => {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return true
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /authentication credentials|not authenticated|login session|token.*(?:not valid|invalid|expired)|(?:invalid|expired).*token/i.test(message)
}

function BlockedReportScreen({ blockedUntil }: { blockedUntil: Date }) {
  const navigate = useNavigate()
  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c1b33] via-[#0f284e] to-[#0a1628] px-4 py-16 text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/20 bg-slate-900/60 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl ring-1 ring-white/10 sm:p-10">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Request Under Processing
        </div>

        {/* Center Animated Icon Container */}
        <div className="relative mx-auto mt-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 blur-lg" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 text-blue-300 shadow-inner">
            <RefreshCw size={36} className="animate-spin text-blue-400" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        <h1 className="mt-6 font-sans text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Report Already in Progress
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You have already submitted a CIBIL analysis request. Credit bureaus refresh official scoring records periodically.
        </p>

        {/* Date highlight card */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <Clock size={15} />
            Next Eligible Generation Date
          </div>
          <div className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {formatBlockedDate(blockedUntil)}
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Please check back after this date to run your next credit health analysis.
          </p>
        </div>

        {/* Helpful bullet hints */}
        <div className="mt-6 space-y-2.5 text-left">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-200">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>Existing analysis request is safely queued &amp; being evaluated</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-200">
            <CheckCircle2 size={16} className="shrink-0 text-blue-400" />
            <span>Bureau records typically refresh within 30-45 day cycles</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50 hover:brightness-110 active:scale-[0.99]"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/cibil-score')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15 hover:border-white/30"
          >
            View Cibil Score <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CreditScoreInfoPage({ kind }: { kind: PageKind }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const config = configs[kind]
  const isImprove = kind === 'improve'

  const [data, setData] = useState<FormData>({
    name: '',
    firstName: '',
    lastName: '',
    dob: '',
    pincode: '',
    phone: '',
    pan: '',
    gender: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)
  const [otp, setOtp] = useState(false)
  const [report, setReport] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loginToast, setLoginToast] = useState<{ id: number; message: string } | null>(null)
  const analysisSubmissionLock = useRef(false)

  const { generateReport, loading: analysisLoading, error: analysisError, setError: setAnalysisError } = useCreditAnalysis()
  const blockedUntil = isImprove ? getCibilAnalysisBlockedUntil() : null

  const errors = {
    name: !data.name.trim() ? 'Please enter your full name.' : '',
    firstName: kind === 'pan' && !data.firstName.trim() ? 'Please enter your first name.' : '',
    lastName: kind === 'pan' && !data.lastName.trim() ? 'Please enter your last name.' : '',
    dob: kind === 'pan' && !data.dob ? 'Please enter your date of birth.' : '',
    pincode: kind === 'pan' && !/^\d{6}$/.test(data.pincode) ? 'Please enter a valid 6-digit pin code.' : '',
    phone: data.phone.length !== 10 ? 'Please enter a valid 10-digit phone number.' : '',
    pan: data.pan.length !== 10 ? 'Please enter a valid PAN number.' : '',
    gender: kind !== 'pan' && !data.gender ? 'Please select your gender.' : '',
  }

  const update = (key: keyof FormData, value: string) => setData((current) => ({ ...current, [key]: value }))

  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState('')

  useEffect(() => {
    if (!loginToast) return
    const timeoutId = window.setTimeout(() => {
      setLoginToast((current) => current?.id === loginToast.id ? null : current)
    }, 4500)
    return () => window.clearTimeout(timeoutId)
  }, [loginToast])

  const redirectToLogin = (message: string) => {
    setLoginToast({ id: Date.now(), message })
    navigate('/login', { state: { authToast: message } })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    // pan kind — send the requested identity fields to the Experian API
    // and navigate straight to the score page (no OTP, no report download).
    if (kind === 'pan') {
      if (errors.firstName || errors.lastName || errors.dob || errors.pincode || errors.phone || errors.pan) return
      if (!isAuthenticated) {
        redirectToLogin('Please log in first to generate your CIBIL PAN report.')
        return
      }
      setScoreLoading(true)
      setScoreError('')
      try {
        const apiData = await ApiClient.post<Record<string, unknown>>(AppEndpoints.experianLoanReport, {
          mobile: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dob,
          pan: data.pan,
          pincode: data.pincode,
        }, { auth: true })
        const creditScore = (apiData.analysis as Record<string, unknown> | undefined)?.credit_score
        navigate('/cibil-score/score', {
          state: { apiData: { ...apiData, credit_score: creditScore } },
        })
      } catch (err) {
        if (isAuthenticationError(err)) {
          redirectToLogin('Please log in first to generate your CIBIL PAN report.')
          return
        }
        const message =
          err instanceof ApiError ? err.message : 'Could not fetch your CIBIL score. Please try again.'
        setScoreError(message)
      } finally {
        setScoreLoading(false)
      }
      return
    }

    if (!isImprove) {
      if (!Object.values(errors).some(Boolean)) setOtp(true)
      return
    }

    // improve kind — validate the required fields and fire the analysis API
    if (errors.name || errors.phone || errors.pan || errors.gender) return
    if (!consent) return
    if (!isAuthenticated) {
      redirectToLogin('Please log in first to analyse your credit profile.')
      return
    }
    if (analysisSubmissionLock.current) return

    analysisSubmissionLock.current = true
    try {
      const apiData = await generateReport({
        pan: data.pan,
        mobile: data.phone,
        consent,
        name: data.name,
        gender: data.gender,
      })
      navigate('/increase-cibil-score/verify', {
        state: {
          apiData,
          // Kept in navigation state for the verification API; never rendered.
          reportId: apiData?.report_id ?? apiData?.reportId,
        },
      })
    } catch (error) {
      if (isAuthenticationError(error)) {
        redirectToLogin('Please log in first to analyse your credit profile.')
        return
      }
      setAnalysisError(getCreditAnalysisErrorMessage(error))
    } finally {
      analysisSubmissionLock.current = false
    }
  }

  if (report && !isImprove) return <PDFViewer onClose={() => setReport(false)} reportName={config.report} />

  if (isImprove && blockedUntil) {
    return <BlockedReportScreen blockedUntil={blockedUntil} />
  }

  const faqs = ['How is a credit score calculated?', 'How long does it take for the report to generate?', 'Can I correct an error in my credit report?', 'Does checking a score affect the credit profile?', 'How can I improve my score over time?']

  return (
    <div className="bg-white">
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
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 py-12 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="container-pb relative z-10 grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-300 backdrop-blur-md">
              <Sparkles size={14} /> {config.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl font-sans text-3xl font-extrabold tracking-tight text-white md:text-5xl">{config.title}</h1>
            <p className="mt-5 max-w-2xl text-xs font-medium leading-relaxed text-slate-300 sm:text-base">{config.intro}</p>
            <div className="mt-7 grid gap-3 sm:max-w-xl">
              {(isImprove
                ? ['PAN-based CIBIL analysis', 'Detailed credit review', 'Personalised guidance from experts']
                : kind === 'pan'
                  ? ['Instant CIBIL score by PAN', 'No OTP required', 'Secure and protected']
                  : ['Secure OTP verification', 'Clear report summary and PDF download', 'Credit education and practical guidance']
              ).map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  <Check className="h-5 w-5 shrink-0 rounded-full bg-emerald-500 p-1 text-white shadow-md shadow-emerald-500/30" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"><Gauge className="mx-auto text-blue-300" /><strong className="mt-2 block text-xs font-extrabold text-white">Credit Insights</strong></div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"><BarChart3 className="mx-auto text-indigo-300" /><strong className="mt-2 block text-xs font-extrabold text-white">Profile Review</strong></div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"><ShieldCheck className="mx-auto text-emerald-300" /><strong className="mt-2 block text-xs font-extrabold text-white">Protected</strong></div>
            </div>
          </div>

          {/* ── Let's Get Started form ── */}
          <form onSubmit={submit} noValidate className="rounded-3xl border border-white/20 bg-slate-900/60 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/10 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-blue-300 shadow-inner">
                <FileText size={22} />
              </span>
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Let&rsquo;s Get Started</h2>
                <p className="text-xs font-medium text-blue-200/80">Complete your details to continue</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {kind === 'pan' && (
                <>
                  <Field label="First Name" error={submitted ? errors.firstName : ''}>
                    <input
                      value={data.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                      placeholder="Enter your first name"
                    />
                  </Field>

                  <Field label="Last Name" error={submitted ? errors.lastName : ''}>
                    <input
                      value={data.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                      placeholder="Enter your last name"
                    />
                  </Field>

                  <Field label="DOB" error={submitted ? errors.dob : ''}>
                    <input
                      type="date"
                      value={data.dob}
                      onChange={(e) => update('dob', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white [color-scheme:dark] outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                    />
                  </Field>

                  <Field label="Pin Code" error={submitted ? errors.pincode : ''}>
                    <input
                      value={data.pincode}
                      onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      inputMode="numeric"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                      placeholder="Enter 6-digit pin code"
                    />
                  </Field>
                </>
              )}

              {kind !== 'pan' && (
                <Field label="Full Name" error={submitted ? errors.name : ''}>
                  <input
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                    placeholder="Enter your full name"
                  />
                </Field>
              )}

              <Field label="Phone Number" error={submitted ? errors.phone : ''}>
                <input
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                  placeholder="Enter 10-digit phone number"
                />
              </Field>

              <Field label="PAN Number" error={submitted ? errors.pan : ''}>
                <input
                  value={data.pan}
                  onChange={(e) => update('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 font-mono text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/25"
                  placeholder="Enter PAN number"
                />
              </Field>

              {kind !== 'pan' && (
                <Field label="Gender" error={submitted ? errors.gender : ''}>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => update('gender', option)}
                        className={`rounded-xl border py-2.5 text-sm font-medium transition ${data.gender === option ? 'border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25' : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/25'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              {!isImprove && kind !== 'pan' && (
                <p className="text-xs text-slate-300">An OTP will be sent to your mobile number.</p>
              )}

              {isImprove && (
                <label className="flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 p-3 text-xs leading-5 text-slate-300 backdrop-blur-sm">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 accent-blue-500"
                  />
                  I authorize the deduction of ₹299 from my wallet balance to generate this report.
                </label>
              )}

              {submitted && isImprove && !consent && (
                <p className="text-xs font-medium text-red-400">Please check the consent box to continue.</p>
              )}

              {analysisError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">{analysisError}</p>
              )}

              {scoreError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">{scoreError}</p>
              )}

              <button
                type="submit"
                disabled={analysisLoading || scoreLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50 hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
              >
                {analysisLoading ? (
                  <><Loader2 size={17} className="animate-spin" /> Generating report...</>
                ) : scoreLoading ? (
                  <><Loader2 size={17} className="animate-spin" /> Fetching your score...</>
                ) : (
                  <>{isImprove ? 'Analyse My Credit Profile' : kind === 'pan' ? 'Get CIBIL PAN Report' : `Get ${config.report}`} <ArrowRight size={17} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <main className="container-pb py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-14">
            {config.sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">{section.heading}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">{section.text}</p>
                {kind === 'crif' && index === 1 ? (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="bg-blue-50 text-left text-navy">
                        <tr><th className="p-3">CRIF score</th><th className="p-3">Meaning</th></tr>
                      </thead>
                      <tbody>
                        {section.points.map((item) => {
                          const idx = item.indexOf(':')
                          const score = idx < 0 ? item : item.slice(0, idx)
                          const meaning = idx < 0 ? '' : item.slice(idx + 1).trim()
                          return (
                            <tr key={item} className="border-t border-slate-200">
                              <td className="p-3 font-semibold">{score}</td>
                              <td className="p-3 text-slate-600">{meaning}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <ul className="mt-5 space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                        <Check className="mt-1 h-4 w-4 shrink-0 rounded-full bg-blue-600 p-0.5 text-white" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24">
              <Lightbulb className="text-green-600" />
              <h2 className="mt-4 font-serif text-xl font-bold text-navy">Your report journey</h2>
              <div className="mt-6 space-y-5">
                {(isImprove
                  ? ['Enter your PAN and phone', 'Verify your details', 'Get expert guidance']
                  : kind === 'pan'
                    ? ['Enter PAN & phone number', 'Get your score instantly']
                    : ['Enter your details', 'Verify your mobile OTP', 'Review your report', 'Download the PDF']
                ).map((item, index) => (
                  <div key={item} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-7 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700">{kind === 'pan' ? 'Get My Score' : 'Start Report Request'}</button>
            </div>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-700 p-6 text-white">
              <TrendingUp className="text-yellow-300" />
              <h3 className="mt-4 text-lg font-semibold">Credit knowledge matters</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Small, consistent steps can support a healthier credit profile over time.</p>
            </div>
          </aside>
        </div>

        <section className="mt-16 rounded-2xl bg-slate-50 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-navy">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((question, index) => (
              <div key={question} className="rounded-xl border border-slate-200 bg-white">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-5 p-4 text-left text-sm font-semibold text-navy">
                  {question}
                  {openFaq === index ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
                </button>
                {openFaq === index && (
                  <p className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">
                    Your report is based on information provided by credit institutions. Review it regularly and contact the relevant bureau if you notice an error.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <CreditScoreArticles />
        <CreditScoreDisclaimer />
      </main>

      {otp && !isImprove && (
        <OTPModal
          phoneNumber={data.phone}
          onClose={() => setOtp(false)}
          onVerify={async () => {
            setOtp(false)
            setReport(true)
          }}
        />
      )}
    </div>
  )
}
