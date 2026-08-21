import { useState, useRef } from 'react'
import { ChevronRight, MessageCircle } from 'lucide-react'
import type { GuaranteedFilters } from '../context/GuaranteedFiltersContext'

interface ResultsSidebarProps {
  filters: GuaranteedFilters
  onFiltersChange: (filters: Partial<GuaranteedFilters>) => void
  onOpenChat?: () => void
}

export default function ResultsSidebar({ onOpenChat }: ResultsSidebarProps) {
  return (
    <div className="sticky top-[200px] space-y-4 lg:block hidden">
      <CompareAndInvestCard />
      <PromoCard />
      <TrustCard />
      <TrustContinuedCard />
      <ReturnViewToggleCard />
      <TestimonialsCard />
      <FloatingChatBubble onClick={onOpenChat} />
    </div>
  )
}

/* ─────────────────────────────────────────
   1. Compare & Invest
   ───────────────────────────────────────── */
function CompareAndInvestCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-bold text-navy hover:text-brand transition-colors"
      >
        <span>Compare & Invest</span>
        <ChevronRight
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
          <a
            href="#"
            className="block text-xs font-medium text-brand hover:text-brand-dark transition-colors"
          >
            Compare FD & Guaranteed Plans
          </a>
          <a
            href="#"
            className="block text-xs font-medium text-brand hover:text-brand-dark transition-colors"
          >
            Compare Guaranteed Return Instruments
          </a>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   2. Promo Card
   ───────────────────────────────────────── */
function PromoCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-navy mb-3">
        The only investment plan with
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge text="100% Guaranteed Return" color="blue" />
        <Badge text="Tax Free Maturity" color="yellow" />
        <Badge text="Life Cover" color="green" />
        <Badge text="No reinvestment Risk" color="purple" />
      </div>

      {/* Promo illustration placeholder */}
      <div className="h-24 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg flex items-center justify-center mb-3 border border-amber-100">
        <span className="text-3xl">💰</span>
      </div>

      <button className="w-full py-2 px-3 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-colors">
        Know more
      </button>
    </div>
  )
}

interface BadgeProps {
  text: string
  color: 'blue' | 'yellow' | 'green' | 'purple'
}

function Badge({ text, color }: BadgeProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    green: 'bg-green-50 text-green-700 border border-green-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  }

  return (
    <span className={`px-2 py-1 text-[10px] font-semibold rounded-full whitespace-nowrap ${colors[color]}`}>
      {text}
    </span>
  )
}

/* ─────────────────────────────────────────
   3. Trust Card
   ───────────────────────────────────────── */
function TrustCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-navy mb-4">Why buy from AV Management?</h3>

      <div className="space-y-3">
        {/* Stat 1 */}
        <div>
          <div className="flex items-start gap-3">
            <span className="text-xl">👥</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-navy">10.5 Lac customers, 15,200 Cr of investment</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Highlights Trust</p>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div>
          <div className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-navy">No hidden charges</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Full transparency</p>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div>
          <div className="flex items-start gap-3">
            <span className="text-xl">👨‍💼</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-navy">Expert advice</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Certified advisors always happy to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   4. Trust Continued Card
   ───────────────────────────────────────── */
function TrustContinuedCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl">📞</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-navy">100% call recorded</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Honest selling</p>
        </div>
      </div>

      <button className="mt-3 w-full text-brand text-[11px] font-bold uppercase hover:text-brand-dark transition-colors">
        Know More
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────
   5. Return View Toggle Card
   ───────────────────────────────────────── */
function ReturnViewToggleCard() {
  // Note: These toggles would be added to the filter state in a real implementation
  const [annualized, setAnnualized] = useState(false)
  const [taxAdjusted, setTaxAdjusted] = useState(false)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {/* Toggle 1 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={annualized}
            onChange={(e) => setAnnualized(e.target.checked)}
            className="w-5 h-5 accent-brand rounded"
          />
          <span className="text-xs font-medium text-navy">Annualized returns</span>
        </label>

        {/* Toggle 2 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={taxAdjusted}
            onChange={(e) => setTaxAdjusted(e.target.checked)}
            className="w-5 h-5 accent-brand rounded"
          />
          <span className="text-xs font-medium text-navy">Tax adjusted returns</span>
        </label>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   6. Testimonials Carousel
   ───────────────────────────────────────── */
const testimonials = [
  {
    id: 't1',
    name: 'Vikram Sharma',
    city: 'Pune',
    quote: 'The entire investment process was smooth and transparent. Great customer support!',
  },
  {
    id: 't2',
    name: 'Priya Nair',
    city: 'Bengaluru',
    quote: 'Got guaranteed returns exactly as promised. No hidden charges. Highly recommended!',
  },
  {
    id: 't3',
    name: 'Rajesh Kumar',
    city: 'Delhi',
    quote: 'Expert advisors helped me choose the right plan for my future. Amazing experience!',
  },
]

function TestimonialsCard() {
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold text-navy mb-4">
          See why customers love investing from AV Management!
        </h3>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="snap-start shrink-0 w-[calc(100%_-_12px)] p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <p className="text-[11px] font-bold text-navy leading-snug">
                  {testimonial.name}, {testimonial.city}
                </p>
                <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAllTestimonials(true)}
          className="mt-3 w-full py-2 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Read testimonials
        </button>
      </div>

      {/* Testimonials Modal */}
      {showAllTestimonials && (
        <TestimonialsModal
          testimonials={testimonials}
          onClose={() => setShowAllTestimonials(false)}
        />
      )}
    </>
  )
}

interface Testimonial {
  id: string
  name: string
  city: string
  quote: string
}

function TestimonialsModal({
  testimonials,
  onClose,
}: {
  testimonials: Testimonial[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <h2 className="text-sm font-bold text-navy">Customer Testimonials</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <p className="text-sm font-bold text-navy">
                {testimonial.name} <span className="text-slate-500">{testimonial.city}</span>
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   7. Floating Chat Bubble
   ───────────────────────────────────────── */
interface FloatingChatBubbleProps {
  onClick?: () => void
}

function FloatingChatBubble({ onClick }: FloatingChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark transition-colors hover:scale-110"
      aria-label="Chat with us"
    >
      <MessageCircle size={24} />
      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
    </button>
  )
}
