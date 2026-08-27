import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  FileText,
  Landmark,
  SearchCheck,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  formatExperianCurrency,
  formatExperianDate,
  parseExperianReport,
  type ExperianAccount,
  type ReportDetail,
} from '../lib/experianReport'
import { isRequiredProfileComplete } from '../lib/profileApi'

type SectionId = 'overview' | 'accounts' | 'enquiries' | 'personal' | 'report'

const sectionIds: SectionId[] = ['overview', 'accounts', 'enquiries', 'personal', 'report']

const initialSection = (): SectionId => {
  const hash = typeof window === 'undefined' ? '' : window.location.hash.slice(1)
  return sectionIds.includes(hash as SectionId) ? hash as SectionId : 'overview'
}

type SectionLink = {
  id: SectionId
  label: string
  icon: LucideIcon
  visible: boolean
}

const DetailGrid = ({ details }: { details: ReportDetail[] }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {details.map((item) => (
      <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
        <p className="mt-1 break-words text-sm font-bold text-navy">{item.value}</p>
      </div>
    ))}
  </div>
)

const ReportSection = ({ id, icon: Icon, title, subtitle, children }: {
  id: SectionId
  icon: SectionLink['icon']
  title: string
  subtitle: string
  children: ReactNode
}) => (
  <section id={id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </span>
      <div>
        <h2 className="text-base font-bold text-navy sm:text-lg">{title}</h2>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>
)

const scoreStyle = (score: number | null) => {
  if (score === null) return { label: 'Not available', text: 'text-slate-600', ring: '#94a3b8' }
  if (score >= 750) return { label: 'Excellent', text: 'text-emerald-700', ring: '#16a34a' }
  if (score >= 700) return { label: 'Good', text: 'text-green-700', ring: '#22c55e' }
  if (score >= 650) return { label: 'Fair', text: 'text-amber-700', ring: '#eab308' }
  return { label: 'Needs attention', text: 'text-orange-700', ring: '#f97316' }
}

const FullScoreGauge = ({ score }: { score: number | null }) => {
  const style = scoreStyle(score)
  const progress = score === null ? 0 : Math.min(1, Math.max(0, (score - 300) / 600))
  return (
    <div className="relative mx-auto h-40 w-60">
      <svg viewBox="0 0 240 145" className="h-full w-full" aria-label={score === null ? 'Experian score unavailable' : `Experian score ${score}`}>
        <path d="M 30 120 A 90 90 0 0 1 210 120" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" pathLength="100" />
        <path d="M 30 120 A 90 90 0 0 1 210 120" fill="none" stroke={style.ring} strokeWidth="14" strokeLinecap="round" pathLength="100" strokeDasharray={`${progress * 100} 100`} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <strong className="block text-4xl font-black text-navy">{score ?? '—'}</strong>
        <span className={`mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm ${style.text}`}>{style.label}</span>
        <span className="mt-1 block text-xs font-semibold text-slate-500">Experian Score</span>
      </div>
    </div>
  )
}

const accountDetails = (account: ExperianAccount): ReportDetail[] => [
  account.currentBalance !== null ? { label: 'Current balance', value: formatExperianCurrency(account.currentBalance) } : null,
  account.amountPastDue !== null ? { label: 'Amount past due', value: formatExperianCurrency(account.amountPastDue) } : null,
  account.originalAmount !== null ? { label: 'Original / highest amount', value: formatExperianCurrency(account.originalAmount) } : null,
  account.creditLimit !== null ? { label: 'Credit limit', value: formatExperianCurrency(account.creditLimit) } : null,
  account.openedOn ? { label: 'Opened on', value: formatExperianDate(account.openedOn) } : null,
  account.closedOn ? { label: 'Closed on', value: formatExperianDate(account.closedOn) } : null,
  account.reportedOn ? { label: 'Last reported', value: formatExperianDate(account.reportedOn) } : null,
  account.tenureMonths !== null ? { label: 'Repayment tenure', value: `${account.tenureMonths} months` } : null,
  account.maxDaysPastDue !== null ? { label: 'Maximum payment delay', value: account.maxDaysPastDue === 0 ? 'No delay reported' : `${account.maxDaysPastDue} days` } : null,
].filter(Boolean) as ReportDetail[]

const LoadingReport = () => (
  <main className="min-h-screen bg-slate-50 py-8">
    <div className="container-pb animate-pulse">
      <div className="h-32 rounded-2xl bg-white shadow-card" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="h-72 rounded-2xl bg-white shadow-card" />
        <div className="space-y-6"><div className="h-80 rounded-2xl bg-white shadow-card" /><div className="h-64 rounded-2xl bg-white shadow-card" /></div>
      </div>
    </div>
  </main>
)

export default function CreditAnalysisLoansPage() {
  const {
    isAuthenticated,
    user,
    experianReport,
    experianLoading,
    experianError,
    refreshExperianReport,
  } = useAuth()
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection)
  const requestedReport = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !experianReport && user && isRequiredProfileComplete(user) && !experianLoading && !requestedReport.current) {
      requestedReport.current = true
      void refreshExperianReport(user).catch(() => undefined)
    }
  }, [experianLoading, experianReport, isAuthenticated, refreshExperianReport, user])

  const report = useMemo(() => experianReport ? parseExperianReport(experianReport) : null, [experianReport])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (experianLoading && !report) return <LoadingReport />

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="container-pb">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
            <FileText className="mx-auto text-blue-600" size={36} />
            <h1 className="mt-4 text-2xl font-bold text-navy">Credit report unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{experianError || 'We could not load your latest Experian credit report.'}</p>
            {user && isRequiredProfileComplete(user) && (
              <button type="button" onClick={() => void refreshExperianReport(user).catch(() => undefined)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Try again
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  const hasOverview = report.creditSummary.length > 0 || report.overview.score !== null
  const allSections: SectionLink[] = [
    { id: 'overview', label: 'Credit overview', icon: BarChart3, visible: hasOverview },
    { id: 'accounts', label: `Credit accounts (${report.accounts.length})`, icon: CreditCard, visible: report.accounts.length > 0 },
    { id: 'enquiries', label: 'Credit enquiries', icon: SearchCheck, visible: report.enquiries.length > 0 },
    { id: 'personal', label: 'Personal details', icon: UserRound, visible: report.personalDetails.length > 0 },
    { id: 'report', label: 'Report information', icon: FileText, visible: report.reportDetails.length > 0 },
  ]
  const sections = allSections.filter((section) => section.visible)
  const displayedSection = sections.some((section) => section.id === activeSection)
    ? activeSection
    : sections[0]?.id

  return (
    <main className="min-h-screen bg-slate-50 pb-12 pt-7">
      <div className="container-pb">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-5 py-6 text-white shadow-lg sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                <ShieldCheck size={14} /> Secure Experian report
              </div>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Your Full Credit Report</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">A clear view of the important information in your latest report. Empty and unavailable fields are automatically hidden.</p>
            </div>
            {report.overview.reportDate && (
              <div className="shrink-0 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-100">Report generated</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold"><CalendarDays size={16} /> {formatExperianDate(report.overview.reportDate)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="sticky top-20 z-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-card lg:top-24 lg:overflow-visible lg:p-3">
            <p className="hidden px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">Report sections</p>
            <nav className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col" aria-label="Credit report sections">
              {sections.map((section) => {
                const Icon = section.icon
                const selected = displayedSection === section.id
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition lg:w-full ${selected ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{section.label}</span>
                    <ChevronRight size={14} className="ml-auto hidden lg:block" />
                  </a>
                )
              })}
            </nav>
          </aside>

          <div className="min-w-0 space-y-6">
            {displayedSection === 'overview' && hasOverview && (
              <ReportSection id="overview" icon={BarChart3} title="Credit overview" subtitle="Your score and key credit indicators at a glance">
                <div className="grid items-center gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white px-3 pb-5 pt-2 ring-1 ring-blue-100">
                    <FullScoreGauge score={report.overview.score} />
                  </div>
                  {report.creditSummary.length > 0 && <DetailGrid details={report.creditSummary} />}
                </div>
              </ReportSection>
            )}

            {displayedSection === 'accounts' && report.accounts.length > 0 && (
              <ReportSection id="accounts" icon={CreditCard} title="Credit accounts" subtitle="Important balances, repayment status and account dates reported by lenders">
                <div className="space-y-4">
                  {report.accounts.map((account) => {
                    const details = accountDetails(account)
                    const isActive = account.status === 'Active'
                    return (
                      <article key={account.id} className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-blue-200 hover:shadow-md">
                        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700"><Building2 size={20} /></span>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-navy">{account.lender || 'Credit provider'}</h3>
                              <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-slate-500">
                                {account.accountType && <span>{account.accountType}</span>}
                                {account.accountNumber && <span className="font-medium text-slate-600">{account.accountNumber}</span>}
                              </p>
                            </div>
                          </div>
                          {account.status && <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{account.status}</span>}
                        </div>
                        {details.length > 0 && <div className="p-4 sm:p-5"><DetailGrid details={details} /></div>}
                      </article>
                    )
                  })}
                </div>
              </ReportSection>
            )}

            {displayedSection === 'enquiries' && report.enquiries.length > 0 && (
              <ReportSection id="enquiries" icon={SearchCheck} title="Credit enquiries" subtitle="Applications for credit recorded during recent periods">
                <DetailGrid details={report.enquiries} />
              </ReportSection>
            )}

            {displayedSection === 'personal' && report.personalDetails.length > 0 && (
              <ReportSection id="personal" icon={UserRound} title="Personal details" subtitle="Identity details associated with this report; sensitive values are masked">
                <DetailGrid details={report.personalDetails} />
              </ReportSection>
            )}

            {displayedSection === 'report' && report.reportDetails.length > 0 && (
              <ReportSection id="report" icon={FileText} title="Report information" subtitle="Reference details for your latest Experian report">
                <DetailGrid details={report.reportDetails} />
              </ReportSection>
            )}

            {displayedSection === 'report' && <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-blue-600 shadow-sm"><Landmark size={16} /></span>
              <p><strong className="block">About this report</strong>This summary is based on the information supplied by Experian and may change when lenders submit new updates.</p>
            </div>}
          </div>
        </div>
      </div>
    </main>
  )
}
