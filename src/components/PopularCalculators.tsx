import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { useRef } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  PiggyBank,
  ShieldCheck,
  Stethoscope,
  Calculator,
} from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'

type CalcGroup = {
  title: string
  icon: typeof ShieldCheck
  theme: {
    bg: string
    iconBg: string
    iconColor: string
  }
  links: string[]
  linksTo?: string[]
}

const calculatorGroups: CalcGroup[] = [
  {
    title: 'Investment calculators',
    icon: PiggyBank,
    theme: {
      bg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      iconBg: 'bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30',
      iconColor: 'text-white',
    },
    links: ['SIP Calculator', 'Income Tax Calculator', 'ULIP Calculator', 'NPS Calculator'],
    linksTo: ['/sip-calculator', '/calculators', '/calculators', '/calculators'],
  },
  {
    title: 'Health & Wellness calculators',
    icon: HeartPulse,
    theme: {
      bg: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white',
      iconBg: 'bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30',
      iconColor: 'text-white',
    },
    links: ['BMI Calculator', 'Ideal Weight Calculator', 'Calorie Calculator', 'Body Fat Calculator'],
  },
  {
    title: 'Term Insurance calculators',
    icon: ShieldCheck,
    theme: {
      bg: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
      iconBg: 'bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30',
      iconColor: 'text-white',
    },
    links: [
      'Life Insurance Calculator',
      'Term Insurance Calculator',
      'Human Life Value Calculator',
      'Home Loan Insurance Calculator',
    ],
  },
  {
    title: 'Policy premium calculators',
    icon: Stethoscope,
    theme: {
      bg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      iconBg: 'bg-white/20 backdrop-blur-md text-white ring-1 ring-white/30',
      iconColor: 'text-white',
    },
    links: [
      'Health Insurance Premium Calculator',
      'Car Insurance Calculator',
      'Bike Insurance Calculator',
      'Travel Insurance Calculator',
    ],
  },
]

export default function PopularCalculators({ onComingSoon }: { onComingSoon?: (featureName: string) => void }) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-pb">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
            <Calculator size={14} /> Smart Financial Planning
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">
            Popular Insurance Calculators
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            Discover our user-friendly calculators tailored to help you make informed financial decisions. Our diverse range ensures you find the exact plan for your goals.
          </p>
        </div>

        <div className="relative mt-10">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // @ts-expect-error swiper params typing
              swiper.params.navigation.prevEl = prevRef.current
              // @ts-expect-error swiper params typing
              swiper.params.navigation.nextEl = nextRef.current
            }}
            pagination={{
              type: 'progressbar',
              el: '.calc-progressbar',
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="calc-slider !pb-3"
          >
            {calculatorGroups.map((g) => {
              const Icon = g.icon
              return (
                <SwiperSlide key={g.title}>
                  <div className="h-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className={`flex items-center gap-3.5 p-5 ${g.theme.bg}`}>
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${g.theme.iconBg} shadow-md`}
                      >
                        <Icon size={22} className={g.theme.iconColor} />
                      </span>
                      <h3 className="text-base font-extrabold leading-snug text-white">
                        {g.title}
                      </h3>
                    </div>

                    <ul className="p-2">
                      {g.links.map((l, i) => (
                        <li key={l}>
                          <Link
                            to={g.linksTo?.[i] ?? '/calculators'}
                            onClick={(event) => {
                              if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                              event.preventDefault()
                              onComingSoon?.(l)
                            }}
                            className="group flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-blue-50/80 hover:text-brand"
                          >
                            <span>{l}</span>
                            <ArrowRight
                              size={14}
                              className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Prev / Next arrows */}
          <button
            ref={prevRef}
            aria-label="Previous"
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-lg transition-all hover:bg-brand hover:text-white md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-lg transition-all hover:bg-brand hover:text-white md:flex"
          >
            <ChevronRight size={20} />
          </button>

          {/* Line-style progress scroller */}
          <div className="calc-progressbar mx-auto mt-6 h-1 w-44 overflow-hidden rounded-full bg-slate-200" />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/calculators"
            onClick={(event) => {
              if (!SHOW_HOME_SECTIONS_COMING_SOON) return
              event.preventDefault()
              onComingSoon?.('All health calculators')
            }}
            className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-xs font-bold text-brand shadow-sm transition-all hover:border-brand hover:bg-blue-50"
          >
            View all health calculators →
          </Link>
          <Link
            to="/calculators"
            onClick={(event) => {
              if (!SHOW_HOME_SECTIONS_COMING_SOON) return
              event.preventDefault()
              onComingSoon?.('All financial calculators')
            }}
            className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-xs font-bold text-brand shadow-sm transition-all hover:border-brand hover:bg-blue-50"
          >
            View all financial calculators →
          </Link>
        </div>
      </div>
    </section>
  )
}
