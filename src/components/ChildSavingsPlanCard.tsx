import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import type { ChildSavingsPlan } from '../data/childSavingsPlans'

interface ChildSavingsPlanCardProps {
  plan: ChildSavingsPlan
  onViewDetails: (plan: ChildSavingsPlan) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  hiddenChildrenCount?: number
}

export default function ChildSavingsPlanCard({
  plan,
  onViewDetails,
  isExpanded = false,
  onToggleExpand,
  hiddenChildrenCount = 0,
}: ChildSavingsPlanCardProps) {
  const [showMoreBadges, setShowMoreBadges] = useState(false)

  const badgeColors = {
    'Triple Benefit': 'bg-blue-100 text-blue-800 border-blue-300',
    'Inbuilt Life Cover': 'bg-green-100 text-green-800 border-green-300',
    'Plan with Zero GST': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    '2X Premium Funding': 'bg-purple-100 text-purple-800 border-purple-300',
    'Premium Waiver': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'New Fund Launched | 9th Aug': 'bg-orange-100 text-orange-800 border-orange-300',
    'Instant Tax Receipt': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  }

  const displayBadges = showMoreBadges ? plan.tags : plan.tags.slice(0, 3)
  const hiddenBadges = plan.tags.length - 3

  return (
    <div className="space-y-4">
      {/* Plan Card */}
      <div
        className="rounded-xl border-2 border-opacity-30 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: 'linear-gradient(88deg, rgba(76, 161, 235, 0.35) 1.64%, rgba(229, 128, 108, 0.35) 98.34%)',
          borderColor: 'rgba(76, 161, 235, 0.3)',
        }}
      >
        {/* Badge */}
        {plan.badge && (
          <div className="bg-green-500 text-white px-4 py-2 text-xs font-bold">
            {plan.badge === 'nfo' && '📢 Pre New Fund Offer  - Last 4 Days Left'}
            {plan.badge === 'premium' && '⭐ 2X Premium Funding'}
            {plan.badge === 'new' && '✨ New Fund Launched | 9th Aug'}
          </div>
        )}

        {/* Main Card Content */}
        <div className="p-6 grid grid-cols-6 gap-6 items-center">
          {/* Logo Column */}
          <div className="col-span-1">
            <img
              src={plan.insurerLogo}
              alt={plan.insurer}
              className="h-16 w-16 object-contain rounded-lg bg-white p-2"
            />
            <p className="text-xs font-bold text-navy mt-2 text-center">{plan.insurer}</p>
          </div>

          {/* Plan Name & Returns */}
          <div className="col-span-1">
            <h3 className="font-bold text-navy text-sm flex items-center gap-2">
              {plan.planName}
              <Info size={14} className="text-slate-400 cursor-help" />
            </h3>
            <div className="mt-3">
              <p className="text-xs text-slate-600">6 Yr Returns</p>
              <p className="text-2xl font-bold text-green-600">{plan.returns6yr}%</p>
              <p className="text-xs text-slate-600 mt-1">{plan.fundName}</p>
            </div>
          </div>

          {/* Payout Column */}
          <div className="col-span-2">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Maturity Payout to You</p>
                <p className="text-lg font-bold text-navy">
                  <span className="text-sm">₹</span>
                  {plan.maturityPayoutYou.toFixed(2)} Cr
                </p>
              </div>
              <div className="text-center text-sm font-bold text-slate-500">OR</div>
              <div>
                <p className="text-xs text-slate-600">Payout to Nominee</p>
                <p className="text-lg font-bold text-navy">
                  <span className="text-sm">₹</span>
                  {plan.maturityPayoutNominee.toFixed(2)} Cr
                  <Info size={12} className="inline ml-1 text-slate-400" />
                </p>
                <p className="text-xs text-slate-600 mt-1">{plan.inCaseOfDeath}</p>
              </div>
            </div>
          </div>

          {/* Buttons Column */}
          <div className="col-span-2 flex flex-col gap-2">
            <button
              onClick={() => onViewDetails(plan)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              View Details
            </button>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-xs font-bold text-blue-900">Avail units at ₹10 NAV</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="px-6 pb-4 flex flex-wrap gap-2 items-center">
          {displayBadges.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${
                badgeColors[tag as keyof typeof badgeColors] || 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {tag}
            </span>
          ))}
          {hiddenBadges > 0 && !showMoreBadges && (
            <button
              onClick={() => setShowMoreBadges(true)}
              className="text-xs font-bold text-blue-600 px-2 py-1 hover:text-blue-700"
            >
              +{hiddenBadges} More
            </button>
          )}
          {showMoreBadges && hiddenBadges > 0 && (
            <button
              onClick={() => setShowMoreBadges(false)}
              className="text-xs font-bold text-blue-600 px-2 py-1 hover:text-blue-700"
            >
              Less
            </button>
          )}
        </div>
      </div>

      {/* More Plans Expandable */}
      {hiddenChildrenCount > 0 && !isExpanded && (
        <div className="text-center">
          <button
            onClick={onToggleExpand}
            className="text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:text-blue-700 mx-auto"
          >
            + {hiddenChildrenCount} More Plan
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {isExpanded && hiddenChildrenCount > 0 && (
        <div className="text-center">
          <button
            onClick={onToggleExpand}
            className="text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:text-blue-700 mx-auto"
          >
            Hide Plans
            <ChevronDown size={16} className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  )
}
