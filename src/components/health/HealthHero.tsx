import { motion } from 'framer-motion'
import { Star, StarHalf } from 'lucide-react'
import loanImg from '../../assets/images/loan.png'

/**
 * Hero section for the Health Insurance landing page.
 * Desktop: brand ambassador image + form side by side.
 * Mobile: brand ambassador image above form.
 */
export default function HealthHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 items-start justify-center px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* ── Brand Ambassador Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a2744] to-[#253858] p-6 sm:p-8 lg:flex lg:items-center lg:gap-8"
        >
          {/* Left side - Image (desktop) */}
          <div className="hidden lg:flex lg:w-[280px] lg:flex-shrink-0 lg:justify-center">
            <img
              src={loanImg}
              alt="AV Management Insurance"
              className="h-[260px] w-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Mobile brand ambassador */}
          <div className="mb-4 flex justify-center lg:hidden">
            <img
              src={loanImg}
              alt="AV Management Insurance"
              className="h-[160px] w-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Right side - Text + ratings */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <div className="h-8 w-8 rounded-full bg-blueBG p-1.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-green-cta text-[8px] font-bold text-white">
                  AV
                </div>
              </div>
              <span className="text-sm font-bold text-white">AV Management</span>
            </div>

            <h1 className="mb-2 text-lg font-bold text-white sm:text-xl">
              Get 0% GST now
            </h1>
            <p className="mb-3 text-sm text-gray-300">
              with upto 25% extra discount**
            </p>

            {/* Google rating badge */}
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                <StarHalf className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
              </div>
              <span className="text-xs font-bold text-white">4.5</span>
              <span className="text-[10px] text-gray-300">Google rating</span>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Trusted by 55 Lakh+ people
            </p>
          </div>
        </motion.div>

        {/* ── Main two-column layout ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ── Left: Form ── */}
          <div className="flex-1">
            {/* Progress indicator */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                Complete your profile
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full bg-green-cta"
                    initial={{ width: '0%' }}
                    animate={{ width: '10%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-green-cta">10%</span>
              </div>
            </div>

            {children}
          </div>

          {/* ── Right: Trust ratings (desktop) ── */}
          <div className="hidden w-[300px] flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-4">
              {/* People trust heading */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h4 className="mb-3 text-sm font-bold text-navy">
                  People trust <span className="text-brand">AV Management</span>
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5 rounded-md bg-orange-tag/10 px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                    <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                    <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                    <Star className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                    <StarHalf className="h-3.5 w-3.5 fill-orange-tag text-orange-tag" />
                    <span className="ml-1 text-xs font-bold text-navy">4.5/5</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  AV Management is one of India's leading digital insurance platforms
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '13.2 crore', label: 'Registered Users' },
                  { value: '53', label: 'Insurance Partners' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center shadow-sm"
                  >
                    <p className="text-sm font-bold text-navy">{s.value}</p>
                    <p className="mt-0.5 text-[9px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Claim info */}
              <div className="rounded-xl border border-green-cta/30 bg-green-cta/5 px-4 py-3">
                <p className="text-xs font-semibold text-green-cta">
                  30 minute claim support
                </p>
                <p className="mt-1 text-[10px] text-gray-500">
                  Our dedicated team is available 24/7 to help you with claims
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
