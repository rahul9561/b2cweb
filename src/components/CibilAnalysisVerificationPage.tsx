import { useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, CreditCard, FileSearch, Landmark, Loader2, ShieldCheck, User, XCircle } from 'lucide-react'
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
 * On "Submit Verification" the original verification data is POSTed once to
 * /analysis/credit-analysis/verify/, with every selected field's `verified`
 * value updated to a boolean.
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
  if (['null', 'none', 'undefined'].includes(text.toLowerCase())) return ''
  return text
}

/** Reads a loan field regardless of whether the API uses snake_case or camelCase. */
function getLoanField(loan: Record<string, unknown>, key: string): unknown {
  const aliases: Record<string, string[]> = {
    bank_name: ['bank_name', 'bankName'],
    loan_type: ['loan_type', 'loanType'],
    loan_amount: ['loan_amount', 'loanAmount'],
    current_balance: ['current_balance', 'currentBalance'],
  }

  for (const alias of aliases[key] ?? [key]) {
    if (loan[alias] !== undefined && loan[alias] !== null) return loan[alias]
  }
  return undefined
}

function extractSections(data: Record<string, unknown>, reportId = getReportId(data)): VerificationSection[] {
  const sections: VerificationSection[] = []

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
      title: 'Active Loans',
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
      title: 'Closed Loans',
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

    // Normalize into an array of loan objects. Some responses group loans under
    // their bank name, so also unwrap those bank-keyed arrays.
    let loanArray: unknown[] = []
    if (Array.isArray(raw)) {
      loanArray = raw
    } else if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      if (Array.isArray(obj.loans)) loanArray = obj.loans
      else if (Array.isArray(obj.data)) loanArray = obj.data
      else if (Array.isArray(obj.loan)) loanArray = obj.loan
      else {
        const bankGroupedLoans = Object.values(obj).filter(Array.isArray).flat()
        loanArray = bankGroupedLoans.length > 0 ? bankGroupedLoans : [obj]
      }
    }

    // Group loans by bank name (case-insensitive)
    const grouped = new Map<string, Array<Record<string, unknown>>>()
    loanArray.forEach((loan) => {
      if (!loan || typeof loan !== 'object') return
      const loanObj = loan as Record<string, unknown>
      const bank = (extractValue(getLoanField(loanObj, 'bank_name')) || 'Bank').toUpperCase()
      if (!grouped.has(bank)) grouped.set(bank, [])
      grouped.get(bank)!.push(loanObj)
    })

    const cards: LoanCard[] = []
    let loanNumber = 0
    grouped.forEach((loans, bankName) => {
      loans.forEach((loanObj, index) => {
        loanNumber += 1
        const loanId = String(
          loanObj.loan_id ?? loanObj.loanId ?? loanObj.id ?? `${def.type}_${bankName}_${index}`
        )
        const fields: FieldItem[] = []
        for (const [key, label] of def.fieldDefs) {
          const text = extractValue(getLoanField(loanObj, key))
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
          const displayBank = extractValue(getLoanField(loanObj, 'bank_name')) || bankName
          cards.push({
            loanId,
            heading: `Loan ${loanNumber} from ${displayBank}`,
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

/** Builds the nested payload required by the verification endpoint. */
function buildVerificationPayload(
  reportId: string,
  data: Record<string, unknown>,
  fields: FieldItem[],
  answers: Record<string, 'yes' | 'no'>
): Record<string, unknown> {
  const personalSource =
    data.personal_details && typeof data.personal_details === 'object'
      ? (data.personal_details as Record<string, unknown>)
      : {}
  const personalDetails: Record<string, unknown> = { ...personalSource }

  for (const field of fields.filter((item) => item.sectionType === 'personal_details')) {
    const source = personalSource[field.fieldKey]
    personalDetails[field.fieldKey] = {
      ...(source && typeof source === 'object' ? (source as Record<string, unknown>) : { value: field.value }),
      verified: answers[field.uniqueKey] === 'yes',
    }
  }

  const buildLoans = (sourceKey: 'active_loans' | 'closed_loans', sectionType: string) => {
    const sourceLoans = Array.isArray(data[sourceKey]) ? data[sourceKey] : []
    return sourceLoans.map((source) => {
      if (!source || typeof source !== 'object') return source
      const loan = source as Record<string, unknown>
      const loanId = String(loan.id ?? loan.loan_id ?? loan.loanId ?? '')
      const verified =
        loan.verified && typeof loan.verified === 'object'
          ? { ...(loan.verified as Record<string, unknown>) }
          : {}

      for (const field of fields) {
        if (field.sectionType === sectionType && field.loanId === loanId) {
          verified[field.fieldKey] = answers[field.uniqueKey] === 'yes'
        }
      }
      return { ...loan, verified }
    })
  }

  const numericReportId = Number(reportId)
  return {
    report_id: Number.isFinite(numericReportId) ? numericReportId : reportId,
    verification_data: {
      personal_details: personalDetails,
      active_loans: buildLoans('active_loans', 'active_loan'),
      closed_loans: buildLoans('closed_loans', 'close_loan'),
    },
  }
}

export default function CibilCrossVerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const rawData = (location.state?.apiData ?? location.state?.data ?? {}) as Record<string, unknown>
  // The analysis endpoint returns the loan and personal values inside
  // `verification_data`; retain the outer response separately for report_id.
  const verificationData =
    rawData.verification_data && typeof rawData.verification_data === 'object'
      ? (rawData.verification_data as Record<string, unknown>)
      : rawData
  const reportId = String(location.state?.reportId ?? getReportId(rawData) ?? '')
  const sections = useMemo(() => extractSections(verificationData, reportId), [verificationData, reportId])
  const allFields = useMemo(
    () => sections.flatMap((s) => s.cards.flatMap((c) => c.fields)),
    [sections]
  )

  const [verification, setVerification] = useState<Record<string, 'yes' | 'no'>>({})
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const { submitVerification, loading, error: submitError } = useCreditAnalysis()

  const setCardAnswer = (fields: FieldItem[], answer: 'yes' | 'no') => {
    setVerification((current) => {
      const next = { ...current }
      fields.forEach((field) => {
        next[field.uniqueKey] = answer
      })
      return next
    })
  }

  const allAnswered =
    allFields.length > 0 &&
    allFields.every((field) => verification[field.uniqueKey] === 'yes' || verification[field.uniqueKey] === 'no')

  const isSectionAnswered = (section: VerificationSection) =>
    section.cards.every((card) => card.fields.every((field) =>
      verification[field.uniqueKey] === 'yes' || verification[field.uniqueKey] === 'no'
    ))

  const currentSection = sections[Math.min(activeSectionIndex, sections.length - 1)]
  const currentSectionAnswered = currentSection ? isSectionAnswered(currentSection) : false
  const isLastSection = activeSectionIndex === sections.length - 1

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    try {
      await submitVerification(buildVerificationPayload(reportId, verificationData, allFields, verification))

      saveCibilAnalysisSession()
      navigate('/increase-cibil-score/success', { replace: true })
    } catch {
      // error handled by hook
    } finally {
      setSubmitting(false)
    }
  }

  const goToSection = (index: number) => {
    setActiveSectionIndex(index)
    window.requestAnimationFrame(() => {
      document.getElementById('verification-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
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
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck size={14} /> Verification step {activeSectionIndex + 1} of {sections.length}
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Cross Verify Information</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Please confirm that the details returned from your PAN and mobile number are correct.
          </p>
        </div>

        <div id="verification-workspace" className="scroll-mt-24 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-blue-950/5 lg:sticky lg:top-24 lg:overflow-visible lg:p-3">
            <p className="hidden px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">Verification sections</p>
            <nav className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col" aria-label="Verification sections">
              {sections.map((section, index) => {
                const complete = isSectionAnswered(section)
                const selected = index === activeSectionIndex
                const accessible = index <= activeSectionIndex || sections.slice(0, index).every(isSectionAnswered)
                return (
                  <button
                    key={section.type}
                    type="button"
                    onClick={() => accessible && goToSection(index)}
                    disabled={!accessible}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition lg:w-full ${selected ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : accessible ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-700' : 'cursor-not-allowed text-slate-300'}`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${selected ? 'bg-white/15' : complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100'}`}>
                      {complete && !selected ? <CheckCircle2 size={17} /> : section.icon}
                    </span>
                    <span className="whitespace-nowrap">{section.title}</span>
                    <span className="ml-auto hidden text-[10px] lg:block">{complete ? 'Done' : index + 1}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <div className="space-y-5">
          {currentSection && (
            <div
              key={currentSection.type}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-950/5"
            >
              {/* Section heading */}
              <header className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                <span className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
                  {currentSection.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-navy">{currentSection.title}</h2>
                  <p className="text-xs text-slate-500">Confirm each detail below as Yes or No</p>
                </div>
              </header>

              {/* Cards within the section */}
              <div className="space-y-4 p-4 md:p-6">
                {currentSection.cards.map((card) => (
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
                      {card.fields.map((field) => (
                        <div key={field.uniqueKey} className="px-5 py-4">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{field.label}</p>
                            <p className="mt-1 break-words text-base font-semibold text-navy">{field.value}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col gap-3 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-navy">Are these details correct?</p>
                        <div className="flex shrink-0 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setCardAnswer(card.fields, 'yes')}
                            className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                              verification[card.fields[0].uniqueKey] === 'yes'
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                            }`}
                          >
                            <CheckCircle2 size={16} /> Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardAnswer(card.fields, 'no')}
                            className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                              verification[card.fields[0].uniqueKey] === 'no'
                                ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:bg-red-50'
                            }`}
                          >
                            <XCircle size={16} /> No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {!currentSectionAnswered && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            Please confirm every card in this section before continuing.
          </p>
        )}

        {submitError && isLastSection && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {submitError}
          </p>
        )}

        {/* Submit Verification button — outside the container */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-blue-950/5">
          <button
            type="button"
            onClick={() => goToSection(activeSectionIndex - 1)}
            disabled={activeSectionIndex === 0 || submitting || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} /> Back
          </button>
          <button
            type="button"
            onClick={() => isLastSection ? void handleSubmit() : goToSection(activeSectionIndex + 1)}
            disabled={!currentSectionAnswered || (isLastSection && !allAnswered) || submitting || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting || loading ? (
              <><Loader2 size={19} className="animate-spin" /> Submitting…</>
            ) : isLastSection ? (
              <>Submit <ShieldCheck size={17} /></>
            ) : (
              <>Next <ArrowRight size={17} /></>
            )}
          </button>
        </div>
      </div>
      </div>
      </div>
    </section>
  )
}
