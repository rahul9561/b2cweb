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
} from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
    },
    links: ['SIP Calculator', 'Income Tax Calculator', 'ULIP Calculator', 'NPS Calculator'],
    linksTo: ['/sip-calculator', '/calculators', '/calculators', '/calculators'],
  },
  {
    title: 'Health & Wellness calculators',
    icon: HeartPulse,
    theme: {
      bg: 'bg-gradient-to-br from-sky-50 to-sky-100',
      iconBg: 'bg-sky-500',
      iconColor: 'text-white',
    },
    links: ['BMI Calculator', 'Ideal Weight Calculator', 'Calorie Calculator', 'Body Fat Calculator'],
  },
  {
    title: 'Term Insurance calculators',
    icon: ShieldCheck,
    theme: {
      bg: 'bg-gradient-to-br from-violet-50 to-violet-100',
      iconBg: 'bg-violet-500',
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
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
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

export default function PopularCalculators() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <h2 className="text-center text-[22px] font-semibold text-navy">
          Popular calculators
        </h2>
        <span className="heading-accent mx-auto mt-2 block h-1 w-12 rounded-full bg-brand" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-6 text-slate2-secondary">
          Discover our user-friendly calculators tailored to help you make informed
          financial decisions. Our diverse range of insurance calculators ensures you
          find the perfect fit for your needs.
        </p>

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
            className="calc-slider !pb-2"
          >
            {calculatorGroups.map((g) => {
              const Icon = g.icon
              return (
                <SwiperSlide key={g.title}>
                  <div className="h-full overflow-hidden rounded-2xl border border-slate2-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                    <div className={`flex items-center gap-3 p-5 ${g.theme.bg}`}>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${g.theme.iconBg} shadow-sm`}
                      >
                        <Icon size={20} className={g.theme.iconColor} />
                      </span>
                      <h3 className="text-[15px] font-semibold leading-snug text-navy">
                        {g.title}
                      </h3>
                    </div>

                    <ul>
                      {g.links.map((l, i) => (
                        <li key={l} className="border-b border-slate2-border/60 last:border-0">
                          <Link
                            to={g.linksTo?.[i] ?? '/calculators'}
                            className="group flex items-center justify-between px-5 py-3.5 text-[13px] text-slate2-secondary transition-colors hover:bg-blueBG/60 hover:text-brand"
                          >
                            {l}
                            <ArrowRight
                              size={14}
                              className="text-slate2-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
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
            className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary shadow-md transition-colors hover:border-brand hover:text-brand md:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary shadow-md transition-colors hover:border-brand hover:text-brand md:flex"
          >
            <ChevronRight size={18} />
          </button>

          {/* Line-style progress scroller (replaces dots) */}
          <div className="calc-progressbar mx-auto mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-slate2-border" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/calculators"
            className="rounded-lg border border-brand px-5 py-2 text-[12px] font-medium text-brand transition-colors hover:bg-brand hover:text-white"
          >
            View all health calculators
          </Link>
          <Link
            to="/calculators"
            className="rounded-lg border border-brand px-5 py-2 text-[12px] font-medium text-brand transition-colors hover:bg-brand hover:text-white"
          >
            View all financial calculators
          </Link>
        </div>
      </div>
    </section>
  )
}