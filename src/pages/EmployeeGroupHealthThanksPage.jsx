import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Download } from 'lucide-react'
import EmployeeFlowHeader from '../components/EmployeeFlowHeader'
import thumbsUpIllustration from '../assets/images/illustration-thumbs-up.svg'

/**
 * "Thanks for showing interest" confirmation page.
 * Reached when a user clicks "Premium on Request" on any plan card
 * in the Employee Group Health Insurance plans list.
 */
export default function EmployeeGroupHealthThanksPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state ?? {}

  // Plan info passed via navigation state — available for future use
  // (e.g. downloadable docs, follow-up contact) even if not rendered here.
  const _planId = state.planId ?? ''
  const _insurerName = state.insurerName ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f8ff]">
      {/* ── Background decorative elements (behind content, non-interactive) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dotted-grid pattern — top-right area */}
        <svg
          className="absolute top-0 right-0 h-40 w-40 opacity-[0.07]"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.5" fill="#0065ff" />
            </pattern>
          </defs>
          <rect width="80" height="80" fill="url(#dot-grid)" />
        </svg>

        {/* Soft translucent pink circle — bottom-left */}
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-pink-200 opacity-[0.18] blur-3xl" />

        {/* Soft translucent yellow circle — top-right */}
        <div className="absolute top-10 right-10 h-44 w-44 rounded-full bg-yellow opacity-[0.14] blur-3xl" />

        {/* Faint triangular shape — bottom-left */}
        <div
          className="absolute bottom-0 left-0 h-32 w-32 opacity-[0.07]"
          style={{
            clipPath: 'polygon(0% 100%, 100% 100%, 0% 0%)',
            backgroundColor: '#0065ff',
          }}
        />
      </div>

      {/* ── Header ── */}
      <EmployeeFlowHeader />

      {/* ── Main content ── */}
      <main className="container-pb relative z-10 mx-auto py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* ── Left column ── */}
          <section className="min-w-0">
            {/* Back-chevron button */}
            <button
              type="button"
              onClick={() => navigate('/employee-group-health-insurance/plans')}
              aria-label="Back to plans"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-navy transition-colors hover:bg-slate-200 hover:text-brand"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Heading */}
            <h1 className="mt-5 text-3xl font-bold leading-tight text-navy">
              Thanks for showing interest in Group Health Insurance
            </h1>
            {/* Short teal/green underline accent under the start of the heading */}
            <div className="mt-2 h-1 w-24 rounded-full bg-green-cta" />

            {/* Paragraphs */}
            <p className="mt-5 text-[15px] leading-6 text-slate2-secondary">
              Our experts will get in touch with you shortly to assist you with the payment and book
              your group health insurance policy.
            </p>
            <p className="mt-3 text-[15px] leading-6 text-slate2-secondary">
              Meanwhile, you can keep proposed member data handy with you for exact premium
              computation.
            </p>

            {/* Download buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <a
                href="/documents/av-management-group-health-insurance-introduction.pdf"
                download="AV Management Group Health Insurance Introduction.pdf"
                className="flex w-full items-center gap-3 rounded-lg bg-brand px-4 py-3 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark"
              >
                <Download size={16} />
                AV Management Group Health Insurance Introduction.pdf
              </a>
              <a
                href="/documents/member-data-format.xlsx"
                download="Member Data Format.xlsx"
                className="flex w-full items-center gap-3 rounded-lg bg-brand px-4 py-3 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark"
              >
                <Download size={16} />
                Member Data Format.xlsx
              </a>
            </div>
          </section>

          {/* ── Right column — illustration panel ── */}
          <aside className="flex flex-col items-center text-center">
            <img
              src={thumbsUpIllustration}
              alt="Person giving thumbs up with checkmark badge near a laptop"
              className="h-auto w-full max-w-[280px]"
            />

            {/* "Easy & Convenient" heading */}
            <h2 className="mt-6 text-[20px] font-bold text-navy">Easy & Convenient</h2>
            {/* Short yellow/gold underline accent */}
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-yellow" />

            {/* Description */}
            <p className="mt-3 text-[13px] leading-6 text-slate2-secondary">
              You get expert advice, purchase assistance, & a dedicated group health insurance app.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}
