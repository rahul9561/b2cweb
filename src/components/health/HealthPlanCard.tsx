import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Check, AlertTriangle, ChevronDown,
  Hospital,
} from 'lucide-react'
import BrandMark from '../common/BrandMark'
import type { MockHealthPlan } from '../../data/mockHealthPlans'
import { coverAmountOptions } from '../../data/mockHealthPlans'

interface HealthPlanCardProps {
  plan: MockHealthPlan
  index?: number
  featured?: boolean
  isCompareSelected?: boolean
  onToggleCompare?: (id: string) => void
}

export default function HealthPlanCard({
  plan,
  index = 0,
  featured = false,
  isCompareSelected = false,
  onToggleCompare,
}: HealthPlanCardProps) {
  const navigate = useNavigate()
  const [wishlisted, setWishlisted] = useState(false)
  const [coverOpen, setCoverOpen] = useState(false)
  const [cover, setCover] = useState(plan.coverAmount)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close cover popover on outside click
  useEffect(() => {
    if (!coverOpen) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setCoverOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [coverOpen])

  const ribbonColors: Record<string, string> = {
    'Faster Issuance': 'bg-brand/10 text-brand',
    'Guaranteed': 'bg-green-cta/10 text-green-cta',
    'New Launch': 'bg-purple2/10 text-purple2',
    'Salaried Discount of 7.5%': 'bg-orange-tag/10 text-orange-tag',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: 'easeOut' }}
      className={`relative rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
        featured ? 'border-l-4 border-l-brand border-t border-r border-b border-gray-200' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left content */}
        <div className="flex-1 p-5">
          {/* Top row: logo + ribbon + wishlist */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <BrandMark name={plan.insurerName} size="sm" />
              <div>
                <p className="text-[10px] text-gray-400">{plan.insurerName}</p>
                <p className="text-sm font-bold text-navy">{plan.planName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {plan.ribbonBadge && (
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${ribbonColors[plan.ribbonBadge] || 'bg-gray-100 text-gray-600'}`}>
                  {plan.ribbonBadge}
                </span>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`h-4 w-4 ${wishlisted ? 'fill-orange-tag text-orange-tag' : 'text-gray-300'}`} />
              </button>
            </div>
          </div>

          {/* Cashless hospitals */}
          <div className="flex items-center gap-1.5 mb-3">
            <Hospital className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-navy">{plan.cashlessHospitals.toLocaleString()}</span> Cashless hospitals
            </span>
            <button className="text-[11px] font-semibold text-brand ml-1">View list</button>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {(showAllFeatures ? plan.features : plan.features.slice(0, 3)).map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                {f.type === 'highlight' && <Heart className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand" />}
                {f.type === 'standard' && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-cta" strokeWidth={3} />}
                {f.type === 'caveat' && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-tag" />}
                <span className="text-xs leading-relaxed text-navy">{f.text}</span>
              </div>
            ))}
          </div>

          {/* View all features + Watch plan video */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-brand">
            <button onClick={() => setShowAllFeatures(!showAllFeatures)}>
              {showAllFeatures ? 'Show less' : 'View all features'}
            </button>
            {plan.features.length > 3 && !showAllFeatures && (
              <>
                <span className="text-gray-300">|</span>
                <button>Watch plan video</button>
              </>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col items-end justify-between border-t border-gray-100 p-5 lg:w-64 lg:border-t-0 lg:border-l">
          {/* Cover amount dropdown */}
          <div ref={popoverRef} className="relative mb-4 self-start">
            <button
              onClick={() => setCoverOpen(!coverOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-navy hover:bg-gray-50 transition-colors"
            >
              Cover amount: <span className="font-bold">{cover}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${coverOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {coverOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 z-30 mt-1 w-48 rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  <div className="max-h-[200px] overflow-y-auto av-modal-scroll py-1">
                    {coverAmountOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setCover(opt); setCoverOpen(false) }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${
                          cover === opt ? 'bg-brand font-semibold text-white' : 'text-navy hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                        {cover === opt && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price */}
          <div className="text-right mb-3">
            <p className="text-[10px] text-gray-400 mb-1">Premium (1 year)</p>
            <p className="text-xl font-bold text-navy">Rs{plan.monthlyPremium.toLocaleString()}/month</p>
            <p className="text-[11px] text-gray-400">
              <span className="line-through">Rs{plan.originalPremium.toLocaleString()}</span> Incl. GST
            </p>
          </div>

          {/* Customize button */}
          <button
            type="button"
            onClick={() => navigate(`/health-insurance/product-detail?plan=${encodeURIComponent(plan.id)}`)}
            className="w-full rounded-xl bg-orange-tag py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-tag/90 active:scale-[0.98]"
          >
            Customize plan
          </button>

          {/* Discount line */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-green-cta">🏷</span>
            <span className="text-[10px] font-medium text-green-cta">
              Inclusive of {plan.discountPercent}% online discount
            </span>
          </div>

          {/* Add to compare */}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(plan.id)}
              className="mt-3 flex items-center gap-2 text-[11px] text-gray-500 hover:text-brand transition-colors"
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                isCompareSelected ? 'border-brand bg-brand' : 'border-gray-300'
              }`}>
                {isCompareSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
              Add to compare
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
