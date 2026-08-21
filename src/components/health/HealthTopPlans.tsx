import { useState } from 'react'
import { Check, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  mockHealthPlans,
  groupByInsurer,
  type MockHealthPlan,
} from '../../data/mockHealthPlans'

/* ── Tab config ── */
const TABS = ['Individual', 'Family Plan', 'Senior Citizen'] as const
type Tab = (typeof TABS)[number]

const INSURER_TYPES = ['All', 'Private', 'Public'] as const

/* ── Logo colour map (initials fallback) ── */
const LOGO_COLORS: Record<string, { bg: string; text: string }> = {
  'CareShield Health': { bg: '#e8f5e9', text: '#2e7d32' },
  'TrustCare General': { bg: '#e3f2fd', text: '#1565c0' },
  'Wellness Assure': { bg: '#fff3e0', text: '#e65100' },
  'Guardian Health Plus': { bg: '#fce4ec', text: '#c62828' },
  'PureLife Insurance': { bg: '#f3e5f5', text: '#7b1fa2' },
}

function InsurerLogo({ name }: { name: string }) {
  const colors = LOGO_COLORS[name] || { bg: '#f5f5f5', text: '#616161' }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {initials}
    </div>
  )
}

/* ── Plan Card ── */
function PlanCard({
  plan,
  index,
}: {
  plan: MockHealthPlan
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:p-5"
    >
      {/* Ribbon */}
      {plan.ribbonBadge && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-block rounded-full bg-orange-tag px-2.5 py-0.5 text-[9px] font-bold uppercase text-white">
            {plan.ribbonBadge}
          </span>
        </div>
      )}

      {/* Logo + info */}
      <div className="mb-4 flex items-start gap-3 sm:mb-0 sm:flex-1">
        <InsurerLogo name={plan.insurerName} />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-navy">
            {plan.planName}
          </h4>
          <p className="mt-0.5 text-xs text-gray-500">
            {plan.insurerName}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Cashless hospitals:{' '}
            <span className="font-semibold text-navy">
              {plan.cashlessHospitals.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4 sm:mb-0 sm:w-[260px]">
        {plan.features.slice(0, 3).map((f, i) => (
          <div key={i} className="mb-1.5 flex items-start gap-2">
            {f.type === 'caveat' ? (
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-tag" />
            ) : (
              <Check
                className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                  f.type === 'highlight' ? 'text-green-cta' : 'text-gray-400'
                }`}
              />
            )}
            <span
              className={`text-[11px] leading-tight ${
                f.type === 'highlight'
                  ? 'font-semibold text-navy'
                  : f.type === 'caveat'
                    ? 'text-orange-tag'
                    : 'text-gray-500'
              }`}
            >
              {f.text}
            </span>
          </div>
        ))}
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col items-end gap-2 sm:w-[140px] sm:items-end">
        <div className="text-right">
          <span className="text-xs text-gray-400 line-through">
            ₹{plan.originalPremium.toLocaleString()}/mo
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-navy">
              ₹{plan.monthlyPremium.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500">/mo</span>
          </div>
        </div>
        <button className="flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand/90 active:scale-[0.98]">
          <Shield className="h-3.5 w-3.5" />
          Check premium
        </button>
      </div>
    </motion.div>
  )
}

/* ── View More Plans (inline expansion per insurer) ── */
function ViewMorePlans({
  insurerName,
  plans,
}: {
  insurerName: string
  plans: MockHealthPlan[]
}) {
  const [expanded, setExpanded] = useState(false)
  const visiblePlans = expanded ? plans.slice(1) : plans.slice(1, 2)

  if (plans.length <= 1) return null

  return (
    <div className="mt-3">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs font-semibold text-brand hover:underline"
        >
          View {plans.length - 1} more plans from {insurerName}
        </button>
      ) : (
        <div className="space-y-3">
          {visiblePlans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
          <button
            onClick={() => setExpanded(false)}
            className="text-xs font-semibold text-gray-500 hover:text-navy"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Main component ── */
export default function HealthTopPlans() {
  const [activeTab, setActiveTab] = useState<Tab>('Individual')
  const [insurerType, setInsurerType] = useState<string>('All')
  const [showAll, setShowAll] = useState(false)

  const groups = groupByInsurer(mockHealthPlans)
  const firstPlanPerGroup = groups.map((g) => g.plans[0])
  const visibleCards = showAll ? firstPlanPerGroup : firstPlanPerGroup.slice(0, 4)

  return (
    <section className="w-full bg-white px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ── Section heading ── */}
        <h2 className="mb-2 text-center text-xl font-bold text-navy sm:text-left">
          Top Health Insurance plans
        </h2>
        <p className="mb-6 text-center text-xs text-gray-500 sm:text-left">
          Showing plans for{' '}
          <span className="font-semibold text-navy">₹10 Lakh</span> cover for a{' '}
          <span className="font-semibold text-navy">26 year old</span>
        </p>

        {/* ── Tabs ── */}
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab ? 'text-navy' : 'text-gray-500 hover:text-navy'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="plan-tab"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* ── Insurer type filter ── */}
        <div className="mb-5 flex gap-2">
          {INSURER_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setInsurerType(t)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                insurerType === t
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Plan cards ── */}
        <div className="space-y-4">
          {visibleCards.map((plan, i) => (
            <div key={plan.id}>
              <PlanCard plan={plan} index={i} />
              <ViewMorePlans
                insurerName={plan.insurerName}
                plans={groups.find((g) => g.insurerName === plan.insurerName)?.plans || []}
              />
            </div>
          ))}
        </div>

        {/* ── Show more ── */}
        {!showAll && firstPlanPerGroup.length > 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-brand px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand/5"
            >
              Show more plans
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
