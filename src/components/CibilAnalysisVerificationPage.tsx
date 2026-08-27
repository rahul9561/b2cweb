import { useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  FileSearch,
  FileText,
  HelpCircle,
  Landmark,
  Loader2,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'
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
  bankName: string
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
    bank_name: ['bank_name', 'bankName', 'bank'],
    loan_type: ['loan_type', 'loanType', 'type'],
    loan_amount: ['loan_amount', 'loanAmount', 'amount'],
    current_balance: ['current_balance', 'currentBalance', 'balance'],
    emi: ['emi', 'monthly_emi', 'monthlyEmi'],
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
    ['name', 'Full Name'],
    ['mobile', 'Phone Number'],
    ['dob', 'Date of Birth'],
    ['pan', 'PAN Number'],
    ['address', 'Current Address'],
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
      icon: <User size={18} />,
      cards: [{ loanId: reportId, heading: 'Applicant Information', bankName: '', fields: personalFields }],
    })
  }

  // ── Active Loan / Close Loan sections ──
  const loanSectionDefs: Array<{
    key: string
    type: string
    title: string
    icon: ReactNode
    keys: Array<[string, string]>
  }> = [
    {
      key: 'active_loans',
      type: 'active_loans',
      title: 'Active Loans',
      icon: <CreditCard size={18} />,
      keys: [
        ['bank_name', 'Bank Name'],
        ['loan_type', 'Loan Type'],
        ['current_balance', 'Current Balance'],
        ['loan_amount', 'Loan Amount'],
        ['emi', 'Monthly EMI'],
      ],
    },
    {
      key: 'closed_loans',
      type: 'closed_loans',
      title: 'Closed Loans',
      icon: <Briefcase size={18} />,
      keys: [
        ['bank_name', 'Bank Name'],
        ['loan_type', 'Loan Type'],
        ['loan_amount', 'Loan Amount'],
      ],
    },
  ]

  for (const def of loanSectionDefs) {
    let loanArray: Array<Record<string, unknown>> = []
    if (Array.isArray(data[def.key])) {
      loanArray = data[def.key] as Array<Record<string, unknown>>
    } else if (Array.isArray(data[def.type])) {
      loanArray = data[def.type] as Array<Record<string, unknown>>
    }

    if (loanArray.length > 0) {
      const cards: LoanCard[] = []
      loanArray.forEach((loan, idx) => {
        const bankName = extractValue(getLoanField(loan, 'bank_name'))
        const cardHeading = `Loan ${idx + 1}${bankName ? ` from ${bankName}` : ''}`
        const loanId = String(loan.id ?? loan.loan_id ?? `${def.type}_${idx}`)
        const cardFields: FieldItem[] = []

        for (const [fKey, fLabel] of def.keys) {
          const val = extractValue(getLoanField(loan, fKey))
          if (val) {
            cardFields.push({
              uniqueKey: `${def.type}_${idx}_${fKey}`,
              fieldKey: fKey,
              label: fLabel,
              value: val,
              sectionType: def.type,
              loanId,
            })
          }
        }

        if (cardFields.length > 0) {
          cards.push({
            loanId,
            heading: cardHeading,
            bankName,
            fields: cardFields,
          })
        }
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
  }

  return sections
}

function buildVerificationPayload(
  reportId: string,
  verificationData: Record<string, unknown>,
  allFields: FieldItem[],
  verification: Record<string, 'yes' | 'no'>
) {
  const isVerified = (uniqueKey: string) => verification[uniqueKey] === 'yes'

  // Personal details
  const personalDetails: Record<string, { value: string; verified: boolean }> = {}
  allFields
    .filter((f) => f.sectionType === 'personal_details')
    .forEach((f) => {
      personalDetails[f.fieldKey] = {
        value: f.value,
        verified: isVerified(f.uniqueKey),
      }
    })

  // Helper for loans
  const buildLoans = (sectionType: string, alias: string) => {
    const rawLoans = (verificationData[sectionType] ?? verificationData[alias] ?? []) as Array<Record<string, unknown>>
    if (!Array.isArray(rawLoans)) return []

    return rawLoans.map((loan, idx) => {
      const output: Record<string, unknown> = { ...loan }
      const matchingFields = allFields.filter(
        (f) => f.sectionType === sectionType && f.uniqueKey.startsWith(`${sectionType}_${idx}_`)
      )

      matchingFields.forEach((f) => {
        output[f.fieldKey] = {
          value: f.value,
          verified: isVerified(f.uniqueKey),
        }
      })
      return output
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

function getFieldIcon(key: string) {
  const k = key.toLowerCase()
  if (k.includes('bank')) return <Building2 size={15} className="text-blue-600" />
  if (k.includes('type')) return <FileText size={15} className="text-indigo-600" />
  if (k.includes('balance') || k.includes('amount')) return <Wallet size={15} className="text-emerald-600" />
  if (k.includes('emi')) return <CreditCard size={15} className="text-purple-600" />
  if (k.includes('phone') || k.includes('mobile')) return <Phone size={15} className="text-blue-600" />
  if (k.includes('dob') || k.includes('birth')) return <Calendar size={15} className="text-amber-600" />
  if (k.includes('address')) return <MapPin size={15} className="text-rose-600" />
  return <Sparkles size={15} className="text-slate-400" />
}

export default function CibilCrossVerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const rawData = (location.state?.apiData ?? location.state?.data ?? {}) as Record<string, unknown>
  const verificationData =
    rawData.verification_data && typeof rawData.verification_data === 'object'
      ? (rawData.verification_data as Record<string, unknown>)
      : rawData
  const reportId = String(location.state?.reportId ?? getReportId(rawData) ?? '')
  const sections = useMemo(() => extractSections(verificationData, reportId), [verificationData, reportId])
  const allFields = useMemo(() => sections.flatMap((s) => s.cards.flatMap((c) => c.fields)), [sections])

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

  const isCardAnswered = (card: LoanCard) =>
    card.fields.every((field) => verification[field.uniqueKey] === 'yes' || verification[field.uniqueKey] === 'no')

  const getCardAnswer = (card: LoanCard): 'yes' | 'no' | null => {
    if (!card.fields.length) return null
    const first = verification[card.fields[0].uniqueKey]
    if (first && card.fields.every((f) => verification[f.uniqueKey] === first)) return first
    return null
  }

  const isSectionAnswered = (section: VerificationSection) => section.cards.every(isCardAnswered)

  const answeredCardsCount = useMemo(() => {
    let count = 0
    sections.forEach((s) => {
      s.cards.forEach((c) => {
        if (isCardAnswered(c)) count++
      })
    })
    return count
  }, [sections, verification])

  const totalCardsCount = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.cards.length, 0)
  }, [sections])

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
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-blue-950/5">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <FileSearch size={32} />
          </span>
          <h1 className="mt-6 font-sans text-2xl font-bold text-slate-900">No Data to Verify</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not find any active data returned from the analysis API. Please restart the analysis flow.
          </p>
          <button
            onClick={() => navigate('/increase-cibil-score', { replace: true })}
            className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Back to Analysis Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f3f7fd] via-[#f9fbff] to-white py-10 md:py-14 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header Banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            <ShieldCheck size={15} className="text-blue-600" /> Step 2 of 2 · Cross Verification
          </div>
          <h1 className="mt-4 font-sans text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Cross Verify Your Credit Records
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Confirm whether the accounts and personal data retrieved from the credit bureau are recognized by you. This ensures accurate dispute resolution.
          </p>

          {/* Progress Overview Bar */}
          <div className="mx-auto mt-5 max-w-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>Overall Progress</span>
              <span className="text-blue-600">
                {answeredCardsCount} of {totalCardsCount} cards answered
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                style={{ width: `${(answeredCardsCount / (totalCardsCount || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div id="verification-workspace" className="scroll-mt-24 grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Left Sidebar */}
          <aside className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl shadow-blue-950/5 lg:sticky lg:top-24">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Verification Steps
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Select a category to review</p>
            </div>
            <nav className="mt-2 space-y-1.5" aria-label="Verification sections">
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
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left text-xs font-bold transition-all duration-200 ${
                      selected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                        : accessible
                        ? 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-700'
                        : 'cursor-not-allowed text-slate-300 opacity-60'
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
                        selected
                          ? 'bg-white/20 text-white'
                          : complete
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {complete && !selected ? <CheckCircle2 size={18} /> : section.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold">{section.title}</p>
                      <p className={`text-[10px] ${selected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {section.cards.length} {section.cards.length === 1 ? 'record' : 'records'}
                      </p>
                    </div>
                    {complete ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          selected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        Done
                      </span>
                    ) : (
                      <span className={`text-[11px] font-semibold ${selected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {index + 1}/{sections.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="mt-4 rounded-2xl bg-blue-50/60 p-3.5 text-xs text-blue-900 border border-blue-100/80">
              <p className="flex items-center gap-1.5 font-bold">
                <HelpCircle size={14} className="text-blue-600" /> Need Help?
              </p>
              <p className="mt-1 text-[11px] text-slate-600 leading-4">
                Marking "No" flags disputed or unrecognized loans for bureau correction.
              </p>
            </div>
          </aside>

          {/* Right Main Cards Section */}
          <div className="space-y-6">
            {currentSection && (
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-blue-950/5">
                {/* Section Header */}
                <header className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white backdrop-blur-sm border border-white/15">
                      {currentSection.icon}
                    </span>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-white">{currentSection.title}</h2>
                      <p className="text-xs text-blue-200">
                        {currentSection.cards.length} {currentSection.cards.length === 1 ? 'item' : 'items'} to verify in this category
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-sm border border-white/10">
                    <Sparkles size={13} className="text-amber-300" /> Section {activeSectionIndex + 1} of {sections.length}
                  </span>
                </header>

                {/* Cards List */}
                <div className="space-y-6 p-6 md:p-8">
                  {currentSection.cards.map((card, cIdx) => {
                    const cardStatus = getCardAnswer(card)

                    return (
                      <div
                        key={`${card.loanId}_${card.heading || 'details'}`}
                        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                          cardStatus === 'yes'
                            ? 'border-emerald-300 bg-emerald-50/10 shadow-md shadow-emerald-500/5'
                            : cardStatus === 'no'
                            ? 'border-rose-300 bg-rose-50/10 shadow-md shadow-rose-500/5'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        {/* Card Title Banner */}
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                              {cIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              {card.bankName ? (
                                <Landmark size={17} className="text-blue-600" />
                              ) : (
                                <User size={17} className="text-blue-600" />
                              )}
                              <h3 className="text-sm font-black text-slate-900">
                                {card.heading || 'Personal Profile'}
                              </h3>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {cardStatus === 'yes' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                              <CheckCircle2 size={14} /> Verified Correct
                            </span>
                          )}
                          {cardStatus === 'no' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                              <XCircle size={14} /> Reported Discrepancy
                            </span>
                          )}
                          {cardStatus === null && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                              Pending Action
                            </span>
                          )}
                        </div>

                        {/* Fields Grid */}
                        <div className="p-6">
                          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            {card.fields.map((field) => (
                              <div
                                key={field.uniqueKey}
                                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50"
                              >
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                  {getFieldIcon(field.fieldKey)}
                                  <span>{field.label}</span>
                                </div>
                                <p className="mt-1 font-sans text-sm font-bold text-slate-900 break-words">
                                  {field.value}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Action Verification Question Bar */}
                          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50/40 p-4 sm:flex-row">
                            <div>
                              <p className="text-sm font-extrabold text-slate-900">
                                Do these details belong to you and look accurate?
                              </p>
                              <p className="text-xs text-slate-500">
                                Select Yes if correct, or No if you do not recognize this record.
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setCardAnswer(card.fields, 'yes')}
                                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                                  cardStatus === 'yes'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                <Check size={16} strokeWidth={3} /> Yes, Correct
                              </button>

                              <button
                                type="button"
                                onClick={() => setCardAnswer(card.fields, 'no')}
                                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                                  cardStatus === 'no'
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700'
                                }`}
                              >
                                <X size={16} strokeWidth={3} /> No, Disputed
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Incomplete warning if any card unconfirmed */}
            {!currentSectionAnswered && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
                <ShieldAlert size={20} className="shrink-0 text-amber-600" />
                <span>Please confirm every card in this section as "Yes" or "No" before moving to the next step.</span>
              </div>
            )}

            {submitError && isLastSection && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                {submitError}
              </div>
            )}

            {/* Bottom Floating Navigation Toolbar */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-blue-950/5">
              <button
                type="button"
                onClick={() => goToSection(activeSectionIndex - 1)}
                disabled={activeSectionIndex === 0 || submitting || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} /> Previous Section
              </button>

              <button
                type="button"
                onClick={() => (isLastSection ? void handleSubmit() : goToSection(activeSectionIndex + 1))}
                disabled={!currentSectionAnswered || (isLastSection && !allAnswered) || submitting || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting || loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting Verification...
                  </>
                ) : isLastSection ? (
                  <>
                    <span>Submit Full Verification</span>
                    <ShieldCheck size={18} />
                  </>
                ) : (
                  <>
                    <span>Next Section</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
