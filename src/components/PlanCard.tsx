import React, { useState } from 'react'
import { ChevronDown, Info, Check, Calculator } from 'lucide-react'
import type { GuaranteedPlan } from '../data/guaranteedPlans'

interface PlanCardProps {
  plan: GuaranteedPlan
  onViewDetails?: (plan: GuaranteedPlan) => void
}

export default function PlanCard({ plan, onViewDetails }: PlanCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Logo + Plan Name */}
      <div className="mb-4 flex gap-4">
        <img
          src={plan.insurerLogo}
          alt={plan.insurerName}
          className="h-12 w-12 rounded-full object-cover bg-slate-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy text-sm leading-snug">{plan.planName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{plan.insurerName}</p>
        </div>
      </div>

      {/* Main content grid: You Give | You Get | Button */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 2fr auto' }}>
        {/* You Give */}
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[11px] text-slate-600 font-medium">You give</p>
          <p className="font-bold text-navy text-lg mt-1">₹{plan.youGive} L</p>
          <p className="text-xs text-slate-500 mt-1">In {plan.youGiveYears} years</p>
        </div>

        {/* You Get - Multiplier or Guaranteed+Bonus variant */}
        {plan.variant === 'multiplier' ? (
          <MultiplierVariant plan={plan} />
        ) : (
          <GuaranteedBonusVariant plan={plan} />
        )}

        {/* View Details Button */}
        <div className="flex items-center">
          <button
            onClick={() => onViewDetails?.(plan)}
            className="px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            View Details
            <ChevronDown size={14} className="rotate-[-90deg]" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
        {plan.tags.map((tag: string, idx: number) => (
          <TagPill key={idx} tag={tag} />
        ))}
        {plan.premiumWaiver && (
          <TagPill
            tag="Premium Waiver"
            icon={<Info size={12} />}
          />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Multiplier Variant (most plans)
   ───────────────────────────────────────── */
function MultiplierVariant({ plan }: { plan: GuaranteedPlan }) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-col justify-center">
      <p className="text-[11px] text-slate-600 font-medium mb-2">You get</p>

      {/* Amount row with multiplier badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-green-600 text-lg">₹{plan.youGet.toFixed(1)} L</span>
        {plan.multiplier && (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {plan.multiplier.toFixed(1)}X
          </span>
        )}
        {plan.taxFree && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            Tax Free
          </span>
        )}
      </div>

      {/* Two sub-stats with + connector */}
      <div className="flex items-center gap-1 text-xs">
        <div className="flex-1">
          <p className="font-bold text-navy">₹{plan.perPeriodAmount.toFixed(2)}K /{plan.perPeriodType}</p>
          <p className="text-slate-600">for {plan.incomeYears} years</p>
        </div>
        <span className="text-slate-400 font-bold">+</span>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="font-bold text-navy">₹{plan.age66Amount.toFixed(1)} L</p>
            <InfoTooltip text="at age 66" />
          </div>
          <p className="text-slate-600">at age {plan.maturityAge}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Guaranteed + Bonus Variant
   ───────────────────────────────────────── */
function GuaranteedBonusVariant({ plan }: { plan: GuaranteedPlan }) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-col justify-center">
      <p className="text-[11px] text-slate-600 font-medium mb-2">You get</p>

      {/* Guaranteed amount */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-green-600 text-lg">₹{plan.guaranteedAmount?.toFixed(1) || plan.youGet.toFixed(1)} L</span>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Guaranteed
        </span>
      </div>

      {/* Guaranteed info line */}
      <p className="text-xs text-slate-600 mb-3">
        ₹{(plan.guaranteedAmount || plan.youGet).toFixed(0)}/year — For whole life
      </p>

      {/* Plus icon and bonus */}
      <div className="flex items-center gap-1">
        <span className="text-slate-400 font-bold">+</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy">₹{plan.bonusAmount?.toFixed(1) || 0} L</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              Bonus
            </span>
          </div>
          <p className="text-xs text-slate-600">{plan.bonusFrequency || 'at maturity'}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Tag Pill Component
   ───────────────────────────────────────── */
interface TagPillProps {
  tag: string
  icon?: React.ReactNode
}

function TagPill({ tag, icon }: TagPillProps) {
  // Determine icon based on tag content
  let displayIcon = icon

  if (!displayIcon) {
    if (tag.includes('Premium Calculator')) {
      displayIcon = <Calculator size={12} />
    } else if (tag.includes('Save Tax') || tag.includes('Inbuilt')) {
      displayIcon = <Check size={12} />
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-700 font-medium hover:bg-slate-100 transition-colors">
      {displayIcon}
      {tag}
    </span>
  )
}

/* ─────────────────────────────────────────
   Info Tooltip Component
   ───────────────────────────────────────── */
function InfoTooltip({ text }: { text: string }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center h-4 w-4 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      >
        <Info size={10} />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-10">
          {text}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   More Plans Expander
   ───────────────────────────────────────── */
interface MorePlansExpanderProps {
  count: number
  isExpanded: boolean
  onToggle: () => void
}

export function MorePlansExpander({ count, isExpanded, onToggle }: MorePlansExpanderProps) {
  return (
    <div className="flex justify-center py-4">
      <button
        onClick={onToggle}
        className="px-6 py-2 border-2 border-brand text-brand font-medium rounded-full hover:bg-brand/5 transition-colors flex items-center gap-2"
      >
        {isExpanded ? `Hide Plans` : `${count} More Plans`}
        <ChevronDown
          size={16}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}
