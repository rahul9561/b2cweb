import { useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, CheckCircle2, CreditCard, FileSearch, Landmark, Loader2, ShieldCheck, User, XCircle } from 'lucide-react'
import { useCreditAnalysis } from '../hooks/useCreditAnalysis'
import { saveCibilAnalysisSession } from '../lib/cibilAnalysisSession'

/**
 * "Cross Verify Information" page for the Increase CIBIL Score flow.
 *
 * Groups the analysis API response into separate containers:
 *   - Personal Details  → name, mobile, dob, pan, address
 *   - Active Loan       → bank_name, loan_type, current_balance, loan_amount, emi
 *   - Close Loan        → bank_name, loan_type, loan_amount
 *
 * Loans are grouped by bank. Each loan is rendered in its own card with a
 * heading such as "Loan 1 from ICICI BANK".
 *
 * On "Submit Verification" each field is POSTed to /analysis/credit-analysis/verify/
 * with the body:
 *   { reportId, sectionType, loanId, fieldKey, fieldValue, verified }
 */

interface FieldItem {
  uniqueKey: string
  fieldKey: string
  label: string
  value: string
  sectionType: string
  loanId: string
}

interface LoanCard {
  loanId: string
  heading: string
  fields: FieldItem[]
}

interface VerificationSection {
  type: string
  title: string
  icon: ReactNode
  cards: LoanCard[]
}

function getReportId(data: Record<string, unknown>): string {
  const candidates = ['report_id', 'reportId', 'id']
  for (const key of candidates) {
    const val = data[key]
    if (val !== undefined && val !== null) return String(val)
  }
  // Check nested
  for (const nested of ['data', 'result', 'details', 'verification_data']) {
    const obj = data[nested]
    if (obj && typeof obj === 'object') {
      for (const key of candidates) {
        const val = (obj as Record<string, unknown>)[key]
        if (val !== undefined && val !== null) return String(val)
      }
    }
  }
  return ''
}

/**
 * Extracts the display value from an API field.
 * Handles both flat values and the `{ value, verified }` object structure.
 */
function extractValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if (obj.value !== undefined && obj.value !== null) {
      const v = String(obj.value).trim()
      if (v !== 'null' && v !== 'undefined') return v
    }
  }
  const text = String(value).trim()
  if (text === 'null' || text === 'undefined') return ''
  return text
}

function extractSections(data: Record<string, unknown>): VerificationSection[] {
  const sections: VerificationSection[] = []
  const reportId = getReportId(data)

  // ── Personal Details ──
  const personalFieldKeys: Array<[string, string]> = [
    ['name', 'Name'],
    ['mobile', 'Phone Number'],
    ['dob', 'Date of Birth'],
    ['pan', 'PAN Number'],
    ['address', 'Address'],
  ]

  const personalFields: FieldItem[] = []

  // Look for nested personal_details / personal object
  let personalObj: Record<string, unknown> | null = null
  for (const key of ['personal_details', 'personal']) {
    if (data[key] && typeof data[key] === 'object') {
      personalObj = data[key] as Record<string, unknown>
      break
    }
  }
  if (!personalObj) {
    for (const wrap of ['data', 'result', 'details', 'response', 'verification_data']) {
      const wrapObj = data[wrap]
      if (wrapObj && typeof wrapObj === 'object') {
        for (const key of ['personal_details', 'personal']) {
          const val = (wrapObj as Record<string, unknown>)[key]
          if (val && typeof val === 'object') {
            personalObj = val as Record<string, unknown>
            break
          }
        }
        if (personalObj) break
      }
    }
  }

  if (personalObj) {
    for (const [key, label] of personalFieldKeys) {
      const text = extractValue(personalObj[key])
      if (text) {
        personalFields.push({
          uniqueKey: `personal_${key}`,
          fieldKey: key,
          label,
          value: text,
          sectionType: 'personal_details',
          loanId: reportId,
        })
      }
    }
  }

  // Fallback: top-level flat keys
  if (personalFields.length === 0) {
    for (const [key, label] of personalFieldKeys) {
      const text = extractValue(data[key])
      if (text) {
        personalFields.push({
          uniqueKey: `personal_${key}`,
          fieldKey: key,
          label,
          value: text,
          sectionType: 'personal_details',
          loanId: reportId,
        })
      }
    }
  }

  if (personalFields.length > 0) {
    sections.push({
      type: 'personal_details',
      title: 'Personal Details',
      icon: <User size={20} />,
      cards: [{ loanId: reportId, heading: '', fields: personalFields }],
    })
  }

  // ── Active Loan / Close Loan sections ──
  const loanSectionDefs: Array<{
    key: string
    type: string
    title: string
    icon: ReactNode
    fieldDefs: Array<[string, string]>
    alternateKeys: string[]
  }> = [
    {
      key: 'active_loans',
      type: 'active_loan',
      title: 'Active Loan',
      icon: <CreditCard size={20} />,
      fieldDefs: [
        ['bank_name', 'Bank Name'],
        ['loan_type', 'Loan Type'],
        ['current_balance', 'Current Balance'],
        ['loan_amount', 'Loan Amount'],
        ['emi', 'EMI'],
      ],
      alternateKeys: ['active_loan', 'active', 'loans', 'activeLoans'],
    },
    {
      key: 'close_loans',
      type: 'close_loan',
      title: 'Close Loan',
      icon: <Briefcase size={20} />,
      fieldDefs: [
        ['bank_name', 'Bank Name'],
        ['loan_type', 'Loan Type'],
        ['loan_amount', 'Loan Amount'],
      ],
      alternateKeys: ['close_loan', 'closed_loans', 'closed_loan', 'closed', 'closeLoans', 'closedLoans'],
    },
  ]

  const findLoanRaw = (def: (typeof loanSectionDefs)[number]): unknown => {
    // Top level
    if (data[def.key] !== undefined && data[def.key] !== null) return data[def.key]
    for (const alt of def.alternateKeys) {
      if (data[alt] !== undefined && data[alt] !== null) return data[alt]
    }
    // Nested wrappers
    for (const wrap of ['data', 'result', 'details', 'response', 'verification_data']) {
      const wrapObj = data[wrap]
      if (wrapObj && typeof wrapObj === 'object') {
        const w = wrapObj as Record<string, unknown>
        if (w[def.key] !== undefined && w[def.key] !== null) return w[def.key]
        for (const alt of def.alternateKeys) {
          if (w[alt] !== undefined && w[alt] !== null) return w[alt]
        }
      }
    }
    return undefined
  }

  for (const def of loanSectionDefs) {
    const raw = findLoanRaw(def)
    if (raw === undefined || raw === null) continue

    // Normalize into an array of loan objects
    let loanArray: unknown[] = []
    if (Array.isArray(raw)) {
      loanArray = raw
    } else if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      if (Array.isArray(obj.loans)) loanArray = obj.loans
      else if (Array.isArray(obj.data)) loanArray = obj.data
      else if (Array.isArray(obj.loan)) loanArray = obj.loan
      else loanArray = [obj]
    }

    // Group loans by bank name (case-insensitive)
    const grouped = new Map<string, Array<Record<string, unknown>>>()
    loanArray.forEach((loan) => {
      if (!loan || typeof loan !== 'object') return
      const loanObj = loan as Record<string, unknown>
      const bank = String(loanObj.bank_name ?? loanObj.bankName ?? 'Bank').trim().toUpperCase()
      if (!grouped.has(bank)) grouped.set(bank, [])
      grouped.get(bank)!.push(loanObj)
    })

    const cards: LoanCard[] = []
    grouped.forEach((loans, bankName) => {
      loans.forEach((loanObj, index) => {
        const loanId = String(
          loanObj.loan_id ?? loanObj.loanId ?? loanObj.id ?? `${def.type}_${bankName}_${index}`
        )
        const fields: FieldItem[] = []
        for (const [key, label] of def.fieldDefs) {
          const text = extractValue(loanObj[key])
          if (text) {
            fields.push({
              uniqueKey: `${def.type}_${loanId}_${key}`,
              fieldKey: key,
              label,
              value: text,
              sectionType: def.type,
              loanId,
            })
          }
        }
        if (fields.length > 0) {
          const displayBank = String(loanObj.bank_name ?? loanObj.bankName ?? bankName).trim()
          cards.push({
            loanId,
            heading: `Loan ${index + 1} from ${displayBank}`,
            fields,
          })
        }
      })
    })

    if (cards.length > 0) {
      sections.push({
        type: def.type,
        title: def.title,
        icon: def.icon,
        cards,
      })
    }
  }

  return sections
}

export default function CibilCrossVerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const rawData = (location.state?.apiData ?? location.state?.data ?? {}) as Record<string, unknown>
  const sections = useMemo(() => extractSections(rawData), [rawData])
  const allFields = useMemo(
    () => sections.flatMap((s) => s.cards.flatMap((c) => c.fields)),
    [sections]
  )

  const [verification, setVerification] = useState<Record<string, 'yes' | 'no'>>({})
  const [submitting, setSubmitting] = useState(false)
  const { submitVerification, loading, error: submitError } = useCreditAnalysis()

  const setAnswer = (key: string, answer: 'yes' | 'no') => {
    setVerification((current) => ({ ...current, [key]: answer }))
  }

  const allAnswered =
    allFields.length > 0 &&
    allFields.every((field) => verification[field.uniqueKey] === 'yes' || verification[field.uniqueKey] === 'no')

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    try {
      const reportId = getReportId(rawData)

      // Send each field verification as a separate request to the verify endpoint
      for (const field of allFields) {
        const body = {
          reportId,
          sectionType: field.sectionType,
          loanId: field.loanId,
          fieldKey: field.fieldKey,
          fieldValue: field.value,
          verified: verification[field.uniqueKey] === 'yes',
        }
        await submitVerification(body)
      }

      saveCibilAnalysisSession()
      navigate('/increase-cibil-score/success', { replace: true })
    } catch {
      // error handled by hook
    } finally {
      setSubmitting(false)
    }
  }

  if (allFields.length === 0) {
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

        {/* Separate containers for each section */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.type}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-950/5"
            >
              {/* Section heading */}
              <header className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                <span className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
                  {section.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-navy">{section.title}</h2>
                  <p className="text-xs text-slate-500">Confirm each detail below as Yes or No</p>
                </div>
              </header>

              {/* Cards within the section */}
              <div className="space-y-4 p-4 md:p-6">
                {section.cards.map((card) => (
                  <div
                    key={`${card.loanId}_${card.heading || 'details'}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
                  >
                    {card.heading && (
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-5 py-3">
                        <Landmark size={16} className="shrink-0 text-blue-600" />
                        <h4 className="text-sm font-bold text-navy">{card.heading}</h4>
                      </div>
                    )}
                    <div className="divide-y divide-slate-100">
                      {card.fields.map((field) => {
                        const answer = verification[field.uniqueKey]
                        return (
                          <div
                            key={field.uniqueKey}
                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{field.label}</p>
                              <p className="mt-1 break-words text-base font-semibold text-navy">{field.value}</p>
                            </div>
                            <div className="flex shrink-0 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setAnswer(field.uniqueKey, 'yes')}
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
                                onClick={() => setAnswer(field.uniqueKey, 'no')}
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
                ))}
              </div>
            </div>
          ))}
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