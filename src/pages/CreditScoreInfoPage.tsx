import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, Check, ChevronDown, ChevronUp, CircleAlert, FileText, Gauge, Lightbulb, Loader2, RefreshCw, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import OTPModal from '../components/OTPModal'
import PDFViewer from '../components/PDFViewer'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'
import { useCreditAnalysis } from '../hooks/useCreditAnalysis'
import { formatBlockedDate, getCibilAnalysisBlockedUntil } from '../lib/cibilAnalysisSession'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'

type PageKind = 'equifax' | 'crif' | 'pan' | 'improve'
type FormData = { name: string; phone: string; pan: string; gender: string }

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
    title: 'Check Your CIBIL Score by PAN Card',
    eyebrow: 'PAN-based credit check',
    intro: 'A PAN helps credit bureaus match your credit information. Use it with your verified mobile number to access your CIBIL credit profile.',
    report: 'CIBIL PAN Report',
    sections: [
      {
        heading: 'Check CIBIL Score by PAN Card',
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
  <label className="block text-sm font-medium text-slate-700">
    {label}
    {children}
    {error && <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"><CircleAlert size={13} />{error}</span>}
  </label>
)

function BlockedReportScreen({ blockedUntil }: { blockedUntil: Date }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50/40 to-white px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-blue-950/10">
        <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <RefreshCw size={36} />
        </span>
        <h1 className="mt-6 font-serif text-2xl font-bold text-navy">Report Already in Progress</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You have already submitted an analysis request. Please check back after{' '}
          <strong className="font-semibold text-navy">{formatBlockedDate(blockedUntil)}</strong> to generate your next report.
        </p>
      </div>
    </div>
  )
}

export default function CreditScoreInfoPage({ kind }: { kind: PageKind }) {
  const navigate = useNavigate()
  const config = configs[kind]
  const isImprove = kind === 'improve'

  const [data, setData] = useState<FormData>({ name: '', phone: '', pan: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)
  const [otp, setOtp] = useState(false)
  const [report, setReport] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const { generateReport, loading: analysisLoading, error: analysisError } = useCreditAnalysis()
  const blockedUntil = isImprove ? getCibilAnalysisBlockedUntil() : null

  const errors = {
    name: !data.name.trim() ? 'Please enter your full name.' : '',
    phone: data.phone.length !== 10 ? 'Please enter a valid 10-digit phone number.' : '',
    pan: data.pan.length !== 10 ? 'Please enter a valid PAN number.' : '',
    gender: kind !== 'pan' && !data.gender ? 'Please select your gender.' : '',
  }

  const update = (key: keyof FormData, value: string) => setData((current) => ({ ...current, [key]: value }))

  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    // pan kind — only PAN and phone are required; call the score-check API
    // and navigate straight to the score page (no OTP, no report download).
    if (kind === 'pan') {
      if (errors.phone || errors.pan) return
      setScoreLoading(true)
      setScoreError('')
      try {
        const apiData = await ApiClient.post(AppEndpoints.checkCibilScore, {
          pan: data.pan,
          mobile: data.phone,
        }, { auth: true })
        navigate('/cibil-score-by-pan/score', { state: { apiData } })
      } catch (err) {
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
    } catch {
      // analysisError already set by the hook
    }
  }

  if (report && !isImprove) return <PDFViewer onClose={() => setReport(false)} reportName={config.report} />

  if (isImprove && blockedUntil) {
    return <BlockedReportScreen blockedUntil={blockedUntil} />
  }

  const faqs = ['How is a credit score calculated?', 'How long does it take for the report to generate?', 'Can I correct an error in my credit report?', 'Does checking a score affect the credit profile?', 'How can I improve my score over time?']

  return (
    <div className="bg-white">
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 py-12">
        <div className="container-pb grid gap-9 lg:grid-cols-[1.2fr_.8fr]">
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Sparkles size={14} /> {config.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold text-navy md:text-5xl">{config.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{config.intro}</p>
            <div className="mt-7 grid gap-3 sm:max-w-xl">
              {(isImprove
                ? ['PAN-based CIBIL analysis', 'Detailed credit review', 'Personalised guidance from experts']
                : kind === 'pan'
                  ? ['Instant CIBIL score by PAN', 'No OTP required', 'Secure and protected']
                  : ['Secure OTP verification', 'Clear report summary and PDF download', 'Credit education and practical guidance']
              ).map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700">
                  <Check className="h-5 w-5 rounded-full bg-emerald-500 p-1 text-white" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-xl bg-white p-4 text-center shadow-sm"><Gauge className="mx-auto text-blue-600" /><strong className="mt-2 block text-navy">Credit Insights</strong></div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm"><BarChart3 className="mx-auto text-indigo-600" /><strong className="mt-2 block text-navy">Profile Review</strong></div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm"><ShieldCheck className="mx-auto text-emerald-600" /><strong className="mt-2 block text-navy">Protected</strong></div>
            </div>
          </div>

          {/* ── Let's Get Started form ── */}
          <form onSubmit={submit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-100 p-3 text-blue-600"><FileText size={22} /></span>
              <div>
                <h2 className="text-2xl font-bold text-navy">Let&rsquo;s Get Started</h2>
                <p className="text-xs text-slate-500">Complete your details to continue</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {kind !== 'pan' && (
                <Field label="Full Name" error={submitted ? errors.name : ''}>
                  <input value={data.name} onChange={(e) => update('name', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Enter your full name" />
                </Field>
              )}

              <Field label="Phone Number" error={submitted ? errors.phone : ''}>
                <input value={data.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Enter 10-digit phone number" />
              </Field>

              <Field label="PAN Number" error={submitted ? errors.pan : ''}>
                <input value={data.pan} onChange={(e) => update('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 font-mono outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Enter PAN number" />
              </Field>

              {kind !== 'pan' && (
                <Field label="Gender" error={submitted ? errors.gender : ''}>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <button key={option} type="button" onClick={() => update('gender', option)} className={`rounded-lg border py-2.5 text-sm font-medium transition ${data.gender === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600 hover:border-blue-400'}`}>{option}</button>
                    ))}
                  </div>
                </Field>
              )}

              {!isImprove && kind !== 'pan' && (
                <p className="text-xs text-slate-500">An OTP will be sent to your mobile number.</p>
              )}

              {isImprove && (
                <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600" />
                  I Authorize the deduction of ₹299 from my wallet balance to generate this report.
                </label>
              )}

              {submitted && isImprove && !consent && (
                <p className="text-xs font-medium text-red-600">Please check the consent box to continue.</p>
              )}

              {analysisError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{analysisError}</p>
              )}

              {scoreError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{scoreError}</p>
              )}

              <button
                type="submit"
                disabled={analysisLoading || scoreLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
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
