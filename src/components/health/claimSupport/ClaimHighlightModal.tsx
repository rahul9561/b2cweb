import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Quote } from 'lucide-react'
import { fadeScale } from '../../../lib/motion'
import type { Testimonial } from '../../../data/mockTestimonials'
import ClaimHighlightHeader from './ClaimHighlightHeader'
import ClaimHighlightSocialEmbed from './ClaimHighlightSocialEmbed'
import ClaimHighlightSummary from './ClaimHighlightSummary'
import ClaimHighlightDetails from './ClaimHighlightDetails'

interface Props {
  isOpen: boolean
  onClose: () => void
  testimonial: Testimonial | null
}

export default function ClaimHighlightModal({ isOpen, onClose, testimonial }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement as HTMLElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    const modal = modalRef.current
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Auto-focus first element
    first?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    modal.addEventListener('keydown', trap)
    return () => modal.removeEventListener('keydown', trap)
  }, [isOpen])

  if (!testimonial?.claimHighlight) return null

  const { claimHighlight } = testimonial

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            ref={modalRef}
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Claim highlight story"
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-base font-bold text-navy">Claim highlight</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              >
                <X className="h-4.5 w-4.5 text-gray-400" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto av-modal-scroll">
              <div className="space-y-5 p-5">
                {/* 1. User info block */}
                <ClaimHighlightHeader
                  name={testimonial.name}
                  ageMasked={testimonial.ageMasked}
                  age={testimonial.age}
                  customerSince={testimonial.customerSince}
                  platformIcon={testimonial.platformIcon}
                />

                {/* 2. Optional social post embed */}
                {claimHighlight.socialPostImage && (
                  <ClaimHighlightSocialEmbed
                    authorName={testimonial.name}
                    dateLabel={testimonial.dateLabel}
                    excerpt={testimonial.excerpt}
                  />
                )}

                {/* 3. Full quote block */}
                <div className="relative rounded-xl bg-blueBG/60 p-4">
                  <Quote className="absolute left-3 top-3 h-5 w-5 text-brand/25" />
                  <p className="pl-6 text-sm leading-relaxed text-gray-600 italic">
                    &ldquo;{claimHighlight.fullQuote}&rdquo;
                  </p>
                  <Quote className="absolute bottom-3 right-3 h-5 w-5 rotate-180 text-brand/25" />
                </div>

                {/* 4. Summary */}
                <ClaimHighlightSummary
                  problemFaced={claimHighlight.summary.problemFaced}
                  howWeHelped={claimHighlight.summary.howWeHelped}
                />

                {/* 5. Claim details 2x2 grid */}
                <ClaimHighlightDetails
                  policy={claimHighlight.claimDetails.policy}
                  relationshipManager={claimHighlight.claimDetails.relationshipManager}
                  dateOfClaim={claimHighlight.claimDetails.dateOfClaim}
                  hospitalName={claimHighlight.claimDetails.hospitalName}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
