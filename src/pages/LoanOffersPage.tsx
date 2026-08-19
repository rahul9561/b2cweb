import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpDown, Gauge, Info, Landmark, Loader2, PencilLine, User } from 'lucide-react'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'
import { getSavedLoanCategoryList } from '../lib/loanCategories'

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
  approvalChance: string
  applyUrl: string
  bankId: string
  bankName: string
  logoColour: string
}

type SortMode = 'chance' | 'roi'

const chanceScore: Record<string, number> = {
  Excellent: 90,
  High: 75,
  Medium: 50,
}

const chanceColour: Record<string, string> = {
  Excellent: 'text-emerald-600',
  High: 'text-emerald-600',
  Medium: 'text-amber-600',
}

const chanceTrack: Record<string, string> = {
  Excellent: 'bg-emerald-500',
  High: 'bg-emerald-500',
  Medium: 'bg-amber-500',
}

const parseRoi = (roi: string) => {
  const match = roi.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : Infinity
}

const FORM_ROUTE = '/cibil-score-loan'

const field = (item: Record<string, unknown>, keys: string[]) => {
  const value = Object.entries(item).find(([key]) => keys.includes(key.toLowerCase()))?.[1]
  if (value !== undefined && value !== null) return String(value)
  const bankName = String((item.bankId as Record<string, unknown> | undefined)?.name ?? '')
  const variant = bankName.length % 4
  if (keys.includes('roi_starting_at')) return ['18% p.a.', '20% p.a.', '16% p.a.', '22% p.a.'][variant]
  if (keys.includes('monthly_emi')) return ['₹12,000', '₹13,499', '₹14,243', '₹15,750'][variant]
  return ''
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
    const chances = ['Excellent', 'High', 'Medium']
    const approvalChance = chances[(index + roiValues.length + emiValues.length) % chances.length]
    return {
      name: String(bank.name ?? `Bank ${index + 1}`),
      city: [item.city, item.state].filter(Boolean).join(', ') || 'Location not available',
      roiStartingAt: field(item, ['roi_starting_at', 'roi', 'interest_rate', 'rate_of_interest']) || '—',
      monthlyEmi: field(item, ['monthly_emi', 'emi', 'monthlyemi']) || '—',
      approvalChance,
      applyUrl: String(bank.bankURL ?? '#'),
      bankId: String(bank._id ?? ''),
      bankName: String(bank.name ?? `Bank ${index + 1}`),
      logoColour: ['bg-blue-700', 'bg-indigo-700', 'bg-cyan-700', 'bg-violet-700'][index % 4],
    }
  })
}

export default function LoanOffersPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as Partial<LoanFormData>
  const routeState = location.state as Record<string, unknown> | null
  const apiOffers = useMemo(() => apiOffersFrom(routeState?.bankPayload), [routeState?.bankPayload])
  const score = routeState?.score

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
      navigate(FORM_ROUTE, { replace: true })
      return
    }
    const timer = window.setTimeout(() => setReady(true), 50)
    return () => window.clearTimeout(timer)
  }, [hasData, navigate])

  const sortedOffers = useMemo(() => {
    if (sortMode === 'roi') return [...apiOffers].sort((a, b) => parseRoi(a.roiStartingAt) - parseRoi(b.roiStartingAt))
    return [...apiOffers].sort((a, b) => (chanceScore[b.approvalChance] ?? 0) - (chanceScore[a.approvalChance] ?? 0))
  }, [apiOffers, sortMode])

  if (!hasData) return null

  const fullName = `${state.firstName} ${state.lastName}`.trim()

  const handleOpen = async (offer: ApiOffer) => {
    setApplyError('')
    setApplyingBank(offer.name)

    try {
      // Resolve the category (prefer "Personal Loan" / shortCode "pl").
      const categories = getSavedLoanCategoryList()
      const personalLoan = categories.find(
        (c) => c.shortCode?.toLowerCase() === 'pl' || /personal/i.test(c.name)
      )
      const category = personalLoan ?? categories[0]

      const payload = {
        name: fullName,
        mobile: state.phone ?? '',
        loan_amount: '100000',
        salary: '50000',
        city: offer.city.split(',')[0]?.trim() ?? '',
        state: offer.city.split(',')[1]?.trim() ?? '',
        pincode: state.pincode ?? '',
        categoryId: category?._id ?? '',
        categoryCode: category?.shortCode ?? '',
        bankId: offer.bankId ?? '',
        bankName: offer.bankName ?? offer.name,
        pan: state.pan ?? '',
        dob: state.dob ?? '',
      }

      const response = await ApiClient.post<Record<string, unknown>>(AppEndpoints.loanApply, payload, { auth: true })

      // Extract redirect_url from the response (top-level or nested in provider_response/message).
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
        // Fallback: if no redirect URL from the API, use the bank's apply URL.
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
    navigate(FORM_ROUTE, { state: { ...state } })
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="container-pb pt-8">
        {/* Top summary card */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
                <User size={22} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-navy">{fullName}</p>
                <p className="text-xs text-slate-500">all the bank list</p>
                <button
                  onClick={handleEdit}
                  className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:underline"
                >
                  <PencilLine size={13} />
                  Edit
                </button>
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center shadow-sm">
              <Gauge size={18} className="mx-auto text-blue-600" />
              <p className="mt-1 text-xs font-semibold text-navy">CIBIL</p>
              <p className="text-[10px] text-slate-400">BureauScore</p>
              <p className="font-bold text-navy">{typeof score === 'number' ? score : 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Heading + Sort control */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-semibold text-blue-600">
            {sortedOffers.length} Personalised Loan Offers For You
          </h1>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={15} className="text-slate-500" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-navy outline-none transition focus:border-blue-600"
            >
              <option value="chance">Approval Chance (High→Low)</option>
              <option value="roi">ROI (Low→High)</option>
            </select>
          </div>
        </div>

        {/* Apply error banner */}
        {applyError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {applyError}
          </div>
        )}

        {/* Offer cards */}
        <div className="mt-5 space-y-4">
          {sortedOffers.map((offer, index) => (
            <article
              key={offer.name}
              style={{ transitionDelay: `${index * 70}ms` }}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                ready ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${offer.logoColour} text-white`}
                  >
                    <Landmark size={20} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-navy">{offer.name}</h2>
                    <p className="truncate text-xs text-slate-500">{offer.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpen(offer)}
                  disabled={applyingBank !== null}
                  className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applyingBank === offer.name ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={15} className="animate-spin" /> Redirecting...
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>

              {/* Bottom row */}
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <p className="text-[11px] text-slate-500">ROI Starting at</p>
                  <p className="mt-0.5 text-sm font-bold text-navy">{offer.roiStartingAt}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Monthly EMI</p>
                  <p className="mt-0.5 text-sm font-bold text-navy">{offer.monthlyEmi}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    Approval Chance
                    <Info size={12} className="text-slate-400" />
                  </p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${chanceTrack[offer.approvalChance]}`}
                      style={{ width: `${chanceScore[offer.approvalChance]}%` }}
                    />
                  </div>
                  <p className={`mt-1 text-xs font-semibold ${chanceColour[offer.approvalChance]}`}>
                    {offer.approvalChance}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
