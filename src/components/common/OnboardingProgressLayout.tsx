import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Phone, Star } from 'lucide-react'

interface OnboardingProgressLayoutProps {
  /** 0–100, controls the green fill bar */
  progress: number
  /** Content rendered in the center column */
  children: ReactNode
  /** Optional right-side tip card */
  rightPanel?: ReactNode
}

export default function OnboardingProgressLayout({
  progress,
  children,
  rightPanel,
}: OnboardingProgressLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Top navbar ── */}
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
        <span className="text-lg font-bold text-navy">
          AV<span className="text-brand"> Management</span>
        </span>
        <button className="flex items-center gap-2 rounded-full border border-green-cta/30 bg-green-cta/10 px-4 py-1.5 text-xs font-semibold text-green-cta transition-colors hover:bg-green-cta/20">
          <Phone className="h-3.5 w-3.5" />
          Help
        </button>
      </header>

      {/* ── Progress bar ── */}
      <div className="relative h-2 w-full bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-r-full bg-green-cta transition-[width] duration-[400ms] ease-out"
          style={{ width: `${progress}%` }}
        />
        {progress >= 10 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-cta mix-blend-multiply">
            {progress}%
          </span>
        )}
      </div>

      {/* ── Main content area ── */}
      <div className="relative flex flex-1 items-start justify-center px-4 py-10 lg:px-8">
        {/* Back button — left center */}
        <button
          onClick={() => navigate(-1)}
          className="fixed left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5 text-navy" />
        </button>

        {/* Center column */}
        <div className="w-full max-w-md">{children}</div>

        {/* Right panel slot */}
        {rightPanel && (
          <div className="ml-8 hidden w-64 lg:block">{rightPanel}</div>
        )}
      </div>

      {/* ── Trust banner ── */}
      <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Left */}
          <div className="text-center md:text-left">
            <p className="text-[11px] font-semibold text-navy">
              AV Management is one of India's leading digital insurance platforms
            </p>
            <div className="mt-1 flex items-center justify-center gap-1 md:justify-start">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3 w-3 fill-orange-tag text-orange-tag" />
              ))}
              <span className="relative inline-block h-3 w-3">
                <Star className="absolute inset-0 h-3 w-3 text-orange-tag" />
                <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className="h-3 w-3 fill-orange-tag text-orange-tag" />
                </span>
              </span>
              <span className="ml-1 text-[10px] font-bold text-navy">4.5/5</span>
            </div>
          </div>

          {/* Right — 3 stats */}
          <div className="flex gap-6">
            {[
              { value: '13.2 crore', label: 'Registered Consumers' },
              { value: '53', label: 'Insurance Partners' },
              { value: '6.29 crore', label: 'Policies Sold' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xs font-bold text-navy">{s.value}</p>
                <p className="text-[9px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
