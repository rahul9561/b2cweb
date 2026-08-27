import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import { quickBuyItems } from '../data/home'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'

type QuickBuyProps = {
  onViewAll?: () => void
  onComingSoon?: (featureName: string) => void
}

export default function QuickBuy({ onViewAll, onComingSoon }: QuickBuyProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-white py-8">
      <div className="container-pb">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-brand">
              <Zap size={16} />
            </span>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-navy sm:text-lg">
              Quick Buy <span className="text-xs font-normal text-slate-400">| Direct Insurance Access</span>
            </h2>
          </div>
          {onViewAll ? (
            <button
              onClick={onViewAll}
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-brand transition-colors hover:text-brand-dark hover:underline"
            >
              View all products <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          ) : null}
        </div>
        <div
          ref={scrollRef}
          className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-3 scrollbar-hide"
        >
          {quickBuyItems.map((item) => (
            <Link
              key={item.label}
              to="/"
              onClick={(event) => {
                if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                event.preventDefault()
                onComingSoon?.(item.label)
              }}
              className="group flex shrink-0 items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
              style={{ minWidth: 200 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 shadow-inner ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={item.iconUrl}
                  alt={item.label}
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-navy transition-colors group-hover:text-brand">
                  {item.label}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Buy Now <ArrowRight size={9} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
