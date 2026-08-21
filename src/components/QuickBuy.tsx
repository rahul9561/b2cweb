import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { quickBuyItems } from '../data/home'

export default function QuickBuy({ onViewAll }: { onViewAll?: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-white py-10">
      <div className="container-pb">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold uppercase tracking-wide text-brand">
            Quick Buy
          </h2>
          {onViewAll ? (
            <button onClick={onViewAll} className="text-[12px] font-semibold text-brand hover:underline">
              View all
            </button>
          ) : null}
        </div>
        <div
          ref={scrollRef}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide"
        >
          {quickBuyItems.map((item) => (
            <Link
              key={item.label}
              to="/"
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ minWidth: 180 }}
            >
              <img
                src={item.iconUrl}
                alt={item.label}
                className="h-10 w-10 rounded-xl object-contain"
              />
              <span className="text-[12px] font-medium leading-tight text-navy group-hover:text-brand">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
       
      </div>
    </section>
  )
}
