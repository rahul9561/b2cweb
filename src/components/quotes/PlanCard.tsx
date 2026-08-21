import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ChevronDown, ChevronUp, Info, Gift, Calendar } from 'lucide-react'
import BrandMark from '../common/BrandMark'
import type { MockPlan } from '../../data/mockPlans'

interface PlanCardProps {
  plan: MockPlan
  premiumFrequency: 'monthly' | 'yearly'
  index?: number
}

export default function PlanCard({ plan, premiumFrequency, index = 0 }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const displayPremium = premiumFrequency === 'monthly' ? plan.monthlyPremium : Math.round(plan.yearlyPremium / 12)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: 'easeOut' }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Top banners */}
      <div className="flex items-center gap-2 px-5 pt-4">
        {plan.lowestPriceGuarantee && (
          <span className="rounded-full bg-green-tag/10 px-3 py-1 text-[10px] font-bold text-green-cta">
            Lowest Price Guarantee
          </span>
        )}
        {plan.priceRevisingDate && (
          <span className="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold text-brand">
            <Calendar className="h-3 w-3" />
            Price revising on {plan.priceRevisingDate}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <BrandMark name={plan.insurerName} />
            <div>
              <p className="text-xs text-gray-500">{plan.insurerName}</p>
              <p className="text-sm font-bold text-navy">{plan.planName}</p>
            </div>
          </div>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${
                wishlisted ? 'fill-orange-tag text-orange-tag' : 'text-gray-300'
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Life cover</p>
            <p className="text-sm font-bold text-navy">{plan.lifeCover}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Cover till age</p>
            <p className="text-sm font-bold text-navy">{plan.coverTillAge}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Claim settled</p>
            <p className={`text-sm font-bold ${plan.claimSettled >= 99.5 ? 'text-green-cta' : 'text-navy'}`}>
              {plan.claimSettled} %
              <Info className="inline h-3 w-3 ml-1 text-gray-400" />
            </p>
          </div>
        </div>

        {/* Benefit pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            {plan.benefits} Free benefits
            <ChevronDown className="h-3 w-3" />
          </button>
          {plan.fullRefund && (
            <button className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Full refund of premium
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          <button className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Plan details
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Price section */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-green-cta font-semibold">
                {plan.discountPercent}% discount included
              </span>
              <button className="text-[10px] text-brand underline">See how</button>
            </div>
            <p className="text-[10px] text-gray-400">
              Your premium from 2nd year - ₹{Math.round(displayPremium * 0.95).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-400 mb-0.5">
              Online Saving ₹{plan.onlineSaving.toLocaleString()}
            </p>
            <Link
              to={`/quotes/plan/${plan.id}`}
              className="inline-flex items-center rounded-xl bg-orange-tag px-5 py-3 text-white font-bold text-sm hover:bg-orange-status transition-colors shadow-sm"
            >
              ₹{displayPremium.toLocaleString()}/month
              <span className="text-[10px] font-normal ml-1">(1st yr)</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>

        {/* Save pill */}
        <div className="flex items-center gap-2 mt-3">
          <span className="flex items-center gap-1 rounded-full bg-green-tag/10 px-3 py-1 text-[10px] font-bold text-green-cta">
            <Gift className="h-3 w-3" />
            You save ₹{(plan.onlineSaving * 0.3).toLocaleString()}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </div>

        {/* Expandable row */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 w-full rounded-lg bg-blueBG py-2 text-center text-xs font-semibold text-brand hover:bg-brand/10 transition-colors"
          >
            +1 More Plan (Save ₹{Math.round(plan.onlineSaving * 0.15).toLocaleString()})
            <ChevronDown className="inline h-3.5 w-3.5 ml-1" />
          </button>
        )}

        {expanded && (
          <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-navy">Alternative Plan</p>
                <p className="text-[10px] text-gray-500">Same insurer, different benefits</p>
              </div>
              <button className="rounded-lg bg-orange-tag px-4 py-2 text-white text-xs font-bold">
                ₹{Math.round(displayPremium * 0.88).toLocaleString()}/mo
              </button>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="mt-2 text-[10px] text-brand font-medium"
            >
              Show less <ChevronUp className="inline h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
