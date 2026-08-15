import { Star, StarHalf } from 'lucide-react'

const stats = [
  { value: '13.2 crore', label: 'Registered Consumers' },
  { value: '53', label: 'Insurance Partners' },
  { value: '6.29 crore', label: 'Policies Sold' },
]

export default function HealthTrustFooter() {
  return (
    <section className="w-full rounded-t-3xl bg-blueBG/60 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl text-center lg:text-left">
        {/* ── People trust heading ── */}
        <h3 className="mb-6 text-lg font-bold text-navy">
          People trust <span className="text-brand">AV Management</span>
        </h3>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* ── Left: Brand + stars ── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold leading-snug text-navy">
              AV Management is one of India's leading
              <br className="hidden sm:block" />
              digital insurance platforms
            </p>

            {/* Google rating visual */}
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-sm">
                <Star className="h-4 w-4 fill-orange-tag text-orange-tag" />
                <Star className="h-4 w-4 fill-orange-tag text-orange-tag" />
                <Star className="h-4 w-4 fill-orange-tag text-orange-tag" />
                <Star className="h-4 w-4 fill-orange-tag text-orange-tag" />
                <StarHalf className="h-4 w-4 fill-orange-tag text-orange-tag" />
                <span className="ml-1 text-sm font-bold text-navy">4.5</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-semibold text-gray-500">
                  Google rating
                </span>
                <span className="text-[10px] text-gray-400">Based on 2.1 lakh reviews</span>
              </div>
            </div>
          </div>

          {/* ── Right: Statistics cards ── */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-2xl bg-white px-3 py-4 text-center shadow-sm"
              >
                <p className="text-sm font-bold text-navy sm:text-base">{s.value}</p>
                <p className="mt-1 text-[9px] leading-tight text-gray-500 sm:text-[10px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
