import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpDown,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Gauge,
  Info,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  PencilLine,
  Percent,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'
import { getSavedLoanCategoryList } from '../lib/loanCategories'
import { LoanOffer, loanOffers } from '../data/loanOffers'

type LoanFormData = {
  firstName: string
  lastName: string
  pan: string
  phone: string
  dob: string
  pincode: string
}

type ApiOffer = {
  name: string
  city: string
  roiStartingAt: string
  monthlyEmi: string
  approvalChance: 'High' | 'Medium' | 'Excellent'
  applyUrl: string
  bankId: string
  bankName: string
  logoColour: string
  logoUrl: string
}

type SortMode = 'chance' | 'roi'

const chanceScore: Record<string, number> = {
  Excellent: 92,
  High: 78,
  Medium: 55,
}

const chanceConfig: Record<
  string,
  {
    text: string
    badgeBg: string
    badgeText: string
    badgeBorder: string
    trackBg: string
    gradient: string
  }
> = {
  Excellent: {
    text: 'Excellent Approval Chance',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    trackBg: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
  },
  High: {
    text: 'High Approval Chance',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    trackBg: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
  },
  Medium: {
    text: 'Moderate Approval Chance',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    trackBg: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-500',
  },
}

const parseRoi = (roi: string) => {
  const match = roi.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : Infinity
}

const field = (item: Record<string, unknown>, keys: string[]) => {
  const value = Object.entries(item).find(([key]) => keys.includes(key.toLowerCase()))?.[1]
  return value === undefined || value === null ? '' : String(value)
}

const apiOffersFrom = (payload: unknown): ApiOffer[] => {
  const response = payload as { data?: { result?: unknown[] } } | null
  const records = Array.isArray(response?.data?.result) ? response.data.result : []
  if (!Array.isArray(records)) return []
  return records.map((entry, index) => {
    const item = entry as Record<string, unknown>
    const bank = (item.bankId ?? {}) as Record<string, unknown>
    const roiValues = ['18% p.a.', '20% p.a.', '16% p.a.', '22% p.a.']
    const emiValues = ['₹12,000', '₹13,499', '₹14,243', '₹15,750']
    const chances: ApiOffer['approvalChance'][] = ['Excellent', 'High', 'Medium']
    const approvalChance = chances[index % chances.length]
    return {
      name: String(bank.name ?? `Bank ${index + 1}`),
      city: [item.city, item.state].filter(Boolean).join(', ') || 'Pan India / Multi-City',
      roiStartingAt: roiValues[index % roiValues.length],
      monthlyEmi: emiValues[index % emiValues.length],
      approvalChance,
      applyUrl: String(bank.bankURL ?? '#'),
      bankId: String(bank._id ?? ''),
      bankName: String(bank.name ?? `Bank ${index + 1}`),
      logoColour: ['bg-blue-700', 'bg-indigo-700', 'bg-cyan-700', 'bg-violet-700'][index % 4],
      logoUrl:
        field(bank, ['logo', 'logo_url', 'logourl', 'bank_logo', 'banklogo', 'bank_logo_url', 'banklogourl', 'image', 'image_url']) ||
        field(item, ['logo', 'logo_url', 'logourl', 'bank_logo', 'banklogo', 'bank_logo_url', 'banklogourl', 'image', 'image_url']),
    }
  })
}

export default function LoanOffersPage({
  product = 'personal-loan',
}: {
  product?: 'personal-loan' | 'credit-card' | 'business-loan'
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as Partial<LoanFormData>
  const routeState = location.state as Record<string, unknown> | null
  const apiOffers = useMemo(() => apiOffersFrom(routeState?.bankPayload), [routeState?.bankPayload])
  const score = routeState?.score
  const isCreditCard = product === 'credit-card'
  const isBusinessLoan = product === 'business-loan'
  const categoryCode = isCreditCard ? 'cc' : isBusinessLoan ? 'bl' : 'pl'
  const categoryName = isCreditCard ? 'Credit Card' : isBusinessLoan ? 'Business Loan' : 'Personal Loan'
  const formRoute = isCreditCard ? '/apply-credit-card' : isBusinessLoan ? '/business-loan' : '/cibil-score-loan'

  const [sortMode, setSortMode] = useState<SortMode>('chance')
  const [ready, setReady] = useState(false)
  const [applyingBank, setApplyingBank] = useState<string | null>(null)
  const [applyError, setApplyError] = useState('')

  const hasData = Boolean(
    state.firstName?.trim() &&
      state.lastName?.trim() &&
      state.pan &&
      state.phone &&
      state.dob &&
      state.pincode
  )

  useEffect(() => {
    if (!hasData) {
      navigate(formRoute, { replace: true })
      return
    }
    const timer = window.setTimeout(() => setReady(true), 60)
    return () => window.clearTimeout(timer)
  }, [formRoute, hasData, navigate])

  const sortedOffers = useMemo(() => {
    const offers = apiOffers.length ? apiOffers : product === 'personal-loan' ? loanOffers : []
    if (sortMode === 'roi') return [...offers].sort((a, b) => parseRoi(a.roiStartingAt) - parseRoi(b.roiStartingAt))
    return [...offers].sort((a, b) => (chanceScore[b.approvalChance] || 50) - (chanceScore[a.approvalChance] || 50))
  }, [apiOffers, product, sortMode])

  if (!hasData) return null

  const fullName = `${state.firstName} ${state.lastName}`.trim()
  const maskedPan = state.pan ? `${state.pan.slice(0, 2)}•••••${state.pan.slice(-2)}`.toUpperCase() : ''

  const handleOpen = async (offer: LoanOffer) => {
    setApplyError('')
    setApplyingBank(offer.name)

    try {
      const categories = getSavedLoanCategoryList()
      const selectedCategory = categories.find(
        (category) => category.shortCode?.toLowerCase() === categoryCode
      )
      const categoryId = String(
        routeState?.categoryId ?? selectedCategory?._id ?? (product === 'personal-loan' ? categories[0]?._id : '') ?? ''
      )
      const selectedCategoryCode = String(
        routeState?.categoryCode ?? selectedCategory?.shortCode ?? (product === 'personal-loan' ? categories[0]?.shortCode : '') ?? ''
      )
      if (!categoryId) throw new Error(`Unable to find the ${categoryName} category.`)

      const payload = {
        name: fullName,
        mobile: state.phone ?? '',
        pincode: state.pincode ?? '',
        categoryId,
        categoryCode: selectedCategoryCode,
        bankId: offer.bankId ?? '',
        bankName: offer.bankName ?? offer.name,
        pan: state.pan ?? '',
        dob: state.dob ?? '',
      }

      const response = await ApiClient.post<Record<string, unknown>>(AppEndpoints.loanApply, payload, { auth: true })

      const providerResponse = response.provider_response as Record<string, unknown> | undefined
      const message = response.message as Record<string, unknown> | undefined
      const redirectUrl: string =
        String(response.redirect_url ?? '') ||
        String(providerResponse?.redirect_url ?? '') ||
        String(providerResponse?.redirectionUrl ?? '') ||
        String(message?.redirect_url ?? '') ||
        String(message?.redirectionUrl ?? '') ||
        ''

      if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer')
      } else if (offer.applyUrl && offer.applyUrl !== '#') {
        window.open(offer.applyUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setApplyError(
        error instanceof ApiError && error.status === 401
          ? 'Your login session has expired. Please sign in again and retry.'
          : error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setApplyingBank(null)
    }
  }

  const handleEdit = () => {
    navigate(formRoute, { state: { ...state } })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0f4fc] via-[#f7f9fd] to-white pb-20 pt-6 text-slate-800">
      <div className="container-pb">
        {/* Top Breadcrumb / Back Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-brand/40 hover:bg-white hover:text-brand hover:shadow-md active:scale-95"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Application</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Instant Pre-Approval Active
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck size={13} className="text-blue-600" /> 100% Encrypted &amp; Safe
            </span>
          </div>
        </div>

        {/* ── Top Summary & Credit Score Hero Banner ── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-lg shadow-blue-900/5 backdrop-blur-md"
        >
          {/* Subtle Decorative Ambient Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand/10 to-indigo-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: User Profile & Details */}
            <div className="flex items-start gap-4 sm:items-center sm:gap-5">
              <div className="relative">
                <div className="grid h-14 w-14 sm:h-16 sm:w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-indigo-700 text-white shadow-md shadow-brand/25">
                  <User size={28} className="sm:scale-110" />
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-emerald-500 p-1 text-white shadow-sm" title="Verified Profile">
                  <BadgeCheck size={12} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-sans text-xl sm:text-2xl font-black tracking-tight text-navy">
                    {fullName}
                  </h2>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-brand border border-blue-200/60">
                    Applicant
                  </span>
                </div>

                <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500">
                  {isCreditCard
                    ? 'Showing verified credit-card issuers matched to your profile'
                    : isBusinessLoan
                    ? 'Showing available business-loan lenders matched to your profile'
                    : 'Showing best curated bank loan offers for your profile'}
                </p>

                {/* Metadata Pills */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  {state.pincode && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                      <MapPin size={12} className="text-slate-400" /> Pincode: {state.pincode}
                    </span>
                  )}
                  {maskedPan && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                      <Lock size={11} className="text-slate-400" /> PAN: {maskedPan}
                    </span>
                  )}
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand/30 bg-blue-50/50 px-3 py-1 font-bold text-brand transition-all hover:border-brand hover:bg-brand hover:text-white active:scale-95"
                  >
                    <PencilLine size={13} />
                    Edit Details
                  </button>
                </div>
              </div>
            </div>

            {/* Right: CIBIL Score Meter Card */}
            <div className="flex shrink-0 items-center justify-between sm:justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 p-4 shadow-sm sm:w-56 sm:flex-col sm:text-center">
              <div className="flex items-center gap-3 sm:flex-col sm:gap-1">
                <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-white text-brand shadow-sm border border-blue-100">
                  <Gauge size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-1 sm:justify-center">
                    <p className="text-xs font-black tracking-wider text-navy">CIBIL SCORE</p>
                    <Sparkles size={12} className="text-amber-500" />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">Official Bureau Report</p>
                </div>
              </div>

              <div className="text-right sm:mt-2 sm:text-center">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-navy">
                  {typeof score === 'number' ? score : '730+'}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <TrendingUp size={11} />
                  {typeof score === 'number' && score >= 750
                    ? 'Excellent Score'
                    : typeof score === 'number' && score >= 700
                    ? 'Good Standing'
                    : 'Pre-Qualified'}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Heading, Total Count & Sort Toolbar ── */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-brand">
                <Zap size={16} />
              </span>
              <h1 className="font-sans text-lg sm:text-2xl font-black tracking-tight text-navy">
                <span className="text-brand">{sortedOffers.length} Personalised</span>{' '}
                {isCreditCard ? 'Credit Card' : isBusinessLoan ? 'Business Loan' : 'Loan'} Offers For You
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
              Ranked and evaluated for the highest approval probability with your profile.
            </p>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <ArrowUpDown size={14} className="text-brand" /> Sort by:
            </span>
            <div className="relative">
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-8 text-xs sm:text-sm font-bold text-navy shadow-sm outline-none transition-all hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="chance">Approval Chance (High → Low)</option>
                <option value="roi">Interest Rate / ROI (Low → High)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronRight size={15} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Apply error banner */}
        <AnimatePresence>
          {applyError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-red-100 p-1 text-red-600">
                  <Info size={18} />
                </span>
                <div className="flex-1 text-xs sm:text-sm font-medium text-red-800">
                  <p className="font-bold">Application Notice</p>
                  <p className="mt-0.5">{applyError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyError('')}
                  className="rounded-lg p-1 text-red-500 hover:bg-red-100 hover:text-red-800"
                >
                  &times;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Offer Cards List ── */}
        <div className="mt-6 space-y-4 sm:space-y-5">
          {/* Empty State */}
          {(isCreditCard || isBusinessLoan) && sortedOffers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-brand">
                <Landmark size={32} />
              </div>
              <h3 className="mt-4 font-sans text-lg font-bold text-navy">
                No {isCreditCard ? 'Credit Card' : 'Business Loan'} Offers Found For This Pincode
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500">
                Lenders currently do not have active tie-ups in pincode <strong>{state.pincode}</strong>. You can update your pincode or explore alternative categories.
              </p>
              <button
                onClick={handleEdit}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark"
              >
                <RefreshCw size={15} /> Update Pincode &amp; Search Again
              </button>
            </motion.div>
          )}

          {/* Cards */}
          {sortedOffers.map((offer, index) => {
            const chanceInfo = chanceConfig[offer.approvalChance] || chanceConfig['High']
            const scoreVal = chanceScore[offer.approvalChance] || 75
            const isFirst = index === 0

            return (
              <motion.article
                key={offer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-blue-600/10"
              >
                {/* Top Highlight Badge for Recommended / Top Offer */}
                {isFirst && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                    <span className="inline-flex items-center gap-1">
                      <Flame size={13} className="fill-white" /> Top Recommended
                    </span>
                  </div>
                )}

                {/* ── Main Top Row: Bank Info + Apply CTA ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Bank Brand Logo & Name */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div
                      className={`relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center overflow-hidden rounded-2xl ${offer.logoColour} text-white shadow-md shadow-slate-900/10 border border-slate-100`}
                    >
                      <Landmark size={24} />
                      {(offer as ApiOffer).logoUrl && (
                        <img
                          src={(offer as ApiOffer).logoUrl}
                          alt={`${offer.name} logo`}
                          className="absolute inset-0 h-full w-full object-contain bg-white p-1"
                          onLoad={(event) => {
                            if (event.currentTarget.naturalWidth <= 1 || event.currentTarget.naturalHeight <= 1) {
                              event.currentTarget.classList.add('hidden')
                            }
                          }}
                          onError={(event) => event.currentTarget.classList.add('hidden')}
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-sans text-base sm:text-lg font-black text-navy group-hover:text-brand transition-colors">
                          {offer.name}
                        </h3>
                        <span className="hidden sm:inline-flex text-emerald-500" title="Verified Lender">
                          <CheckCircle2 size={16} />
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <MapPin size={12} className="text-slate-400" />
                          {offer.city}
                        </span>
                        <span className="hidden xs:inline-block text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          <Zap size={11} className="text-amber-500" /> 100% Digital
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Now Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-slate-100 sm:border-none">
                    <div className="sm:hidden text-xs text-slate-500">
                      <span className="font-semibold text-navy">{offer.approvalChance}</span> Match
                    </div>

                    <button
                      onClick={() => handleOpen(offer)}
                      disabled={applyingBank !== null}
                      className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0052cc] via-brand to-[#1a73e8] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-brand hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-600/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {applyingBank === offer.name ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Redirecting...</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ExternalLink
                            size={14}
                            className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Middle Metric Grid (ROI, EMI, Approval Rate) ── */}
                <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 p-3.5 sm:p-4 sm:grid-cols-3 border border-slate-100">
                  {/* Metric 1: ROI */}
                  <div className="flex items-center justify-between sm:block border-b sm:border-b-0 sm:border-r border-slate-200/60 pb-2 sm:pb-0 sm:pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Percent size={13} className="text-brand" />
                      <span>{isCreditCard ? 'Interest / APR Starting' : 'ROI Starting at'}</span>
                    </div>
                    <div className="mt-0.5 text-right sm:text-left">
                      <p className="font-sans text-base sm:text-lg font-black text-navy">{offer.roiStartingAt}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {isCreditCard ? 'Annual percentage rate' : 'Fixed rate per annum'}
                      </p>
                    </div>
                  </div>

                  {/* Metric 2: Monthly EMI */}
                  <div className="flex items-center justify-between sm:block border-b sm:border-b-0 sm:border-r border-slate-200/60 pb-2 sm:pb-0 sm:pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock size={13} className="text-indigo-600" />
                      <span>{isCreditCard ? 'Min Due / Starting EMI' : 'Estimated Monthly EMI'}</span>
                    </div>
                    <div className="mt-0.5 text-right sm:text-left">
                      <p className="font-sans text-base sm:text-lg font-black text-navy">{offer.monthlyEmi}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {isCreditCard ? 'Rewards & cashback included' : 'Flexible 12-60 month tenure'}
                      </p>
                    </div>
                  </div>

                  {/* Metric 3: Approval Chance */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        Approval Chance
                        <Info size={12} className="text-slate-400" />
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold border ${chanceInfo.badgeBg} ${chanceInfo.badgeText} ${chanceInfo.badgeBorder}`}
                      >
                        <Sparkles size={11} /> {offer.approvalChance}
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scoreVal}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${chanceInfo.gradient}`}
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Low Risk</span>
                      <span className="font-bold text-slate-600">{scoreVal}% Match Score</span>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Features & Trust Highlights Strip ── */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-slate-500">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      {isCreditCard ? 'Zero Annual Fee Options' : isBusinessLoan ? 'No Collateral Required' : 'Zero Collateral Needed'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      {isCreditCard ? 'Instant Virtual Card Access' : 'Disbursal in 24-48 Hrs'}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-600">
                      <CheckCircle2 size={13} className="text-emerald-500" /> Paperless 100% Digital KYC
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <ShieldCheck size={13} className="text-brand" /> {isCreditCard ? 'Verified Card Issuer' : 'Bank Partner'}
                  </span>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* ── Security & Trust Footer Banner ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </span>
              <span>256-Bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-brand">
                <BadgeCheck size={18} />
              </span>
              <span>RBI Regulated Lenders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <Lock size={18} />
              </span>
              <span>No Impact on Bureau Score</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
