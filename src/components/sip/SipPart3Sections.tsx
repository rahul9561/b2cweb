import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Star, UserCircle, Quote, ChevronDown } from 'lucide-react'
import Reveal from '../../hooks/useReveal.tsx'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

/* ── Section heading helper (mirrors Part 2) ── */
function SectionHeading({ title, align = 'left' }: { title: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <h2 className="text-[22px] font-bold text-navy md:text-[24px]">{title}</h2>
      <span
        className={`mt-2 block h-1 w-12 rounded-full bg-orange-tag ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  )
}

/* ═══════════════ 3.1 SIP Articles ═══════════════ */
interface Article {
  image: string
  title: string
  date: string
  excerpt: string
}

const articles: Article[] = [
  {
    image:
      'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=640&q=60',
    title: 'Systematic Transfer Plan Taxation',
    date: '04 Aug 2026',
    excerpt:
      'Before setting up a Systematic Transfer Plan, it is essential to',
  },
  {
    image:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=640&q=60',
    title: 'Goal-Based SIP Calculator',
    date: '04 Aug 2026',
    excerpt:
      'A goal-based SIP calculator is a financial tool that can help',
  },
  {
    image:
      'https://images.unsplash.com/photo-1621579171006-2b6d735e9a5c?w=640&q=60',
    title: 'SWP vs Dividend',
    date: '03 Aug 2026',
    excerpt:
      'Many investors want steady cash from their mutual funds after',
  },
]

export function SipArticles() {
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent')
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="bg-gray-50 py-14">
      <div className="container-pb">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <SectionHeading title="SIP Articles" />
              <div className="flex gap-1 border-b border-slate2-border">
                {(
                  [
                    { key: 'recent', label: 'Recent Articles' },
                    { key: 'popular', label: 'Popular Articles' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    aria-selected={activeTab === t.key}
                    className={`border-b-2 px-3 py-2 text-[12px] font-medium transition-colors ${
                      activeTab === t.key
                        ? 'border-brand text-brand'
                        : 'border-transparent text-slate2-secondary hover:text-navy'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                ref={prevRef}
                aria-label="Previous articles"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary transition-colors hover:border-brand hover:text-brand"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                ref={nextRef}
                aria-label="Next articles"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary transition-colors hover:border-brand hover:text-brand"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                // @ts-expect-error swiper params typing
                swiper.params.navigation.prevEl = prevRef.current
                // @ts-expect-error swiper params typing
                swiper.params.navigation.nextEl = nextRef.current
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-10"
            >
              {articles.map((a) => (
                <SwiperSlide key={a.title}>
                  <article className="group h-full overflow-hidden rounded-xl border border-slate2-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div className="overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="h-40 w-full object-cover transition-transform duration-250 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] text-slate2-muted">{a.date}</p>
                      <h3 className="mt-1 text-[14px] font-semibold text-navy">{a.title}</h3>
                      <p className="mt-2 text-[12px] leading-5 text-slate2-secondary">
                        {a.excerpt}
                        <span className="text-brand">…</span>
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline"
                      >
                        Read more <span aria-hidden>›</span>
                      </a>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════ 3.2 Reviews & Ratings ═══════════════ */
interface Review {
  name: string
  location: string
  date: string
  plan: string
  body: string
}

const reviews: Review[] = [
  {
    name: 'Sanya',
    location: 'Delhi',
    date: 'February 04, 2025',
    plan: 'Aviva i Growth',
    body: 'I was hesitant about investing but after using the SIP calculator I understood how even small SIPs could accumulate into a solid corpus. Aviva i Growth seemed like the perfect fit for my goals',
  },
  {
    name: 'Neeraj',
    location: 'Pune',
    date: 'February 04, 2025',
    plan: 'Bajaj Allianz Smart Wealth Goal',
    body: "Investing felt overwhelming until I tried the SIP calculator. It showed me how Bajaj Allianz Smart Wealth Goal III could help me build wealth systematically. Highly recommend",
  },
  {
    name: 'Sneha',
    location: 'Chennai',
    date: 'February 04, 2025',
    plan: 'Bharti AXA Wealth Maximizer',
    body: 'I wanted a plan that aligned with my future needs. The SIP calculator showed me the potential growth and Bharti AXA Wealth Maximizer checked all the right boxes for me',
  },
]

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate2-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <UserCircle size={36} className="shrink-0 text-slate2-muted" />
        <div>
          <p className="text-[14px] font-bold text-navy">{review.name}</p>
          <p className="text-[10px] text-slate2-muted">
            {review.location} • {review.date}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-orange-tag text-orange-tag" />
        ))}
      </div>

      <div className="mt-3">
        <Quote size={16} className="text-slate2-muted" />
        <p className="mt-1 text-[12px] font-bold text-navy">{review.plan}</p>
        <p className="mt-2 text-[12px] leading-5 text-slate2-secondary">{review.body}</p>
      </div>
    </div>
  )
}

export function SipReviews() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <Reveal>
          <SectionHeading title="SIP Calculator Reviews & Ratings" />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-orange-tag text-orange-tag" />
                ))}
              </div>
              <span className="text-[14px] font-bold text-navy">4.6 / 5</span>
              <span className="text-[11px] text-slate2-muted">(Based on 10 Reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-slate2-muted">(Showing Newest 10 Reviews)</span>
              <div className="flex gap-2">
                <button
                  ref={prevRef}
                  aria-label="Previous reviews"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary transition-colors hover:border-brand hover:text-brand"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  ref={nextRef}
                  aria-label="Next reviews"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary transition-colors hover:border-brand hover:text-brand"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-6">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                // @ts-expect-error swiper params typing
                swiper.params.navigation.prevEl = prevRef.current
                // @ts-expect-error swiper params typing
                swiper.params.navigation.nextEl = nextRef.current
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-10"
            >
              {reviews.map((r) => (
                <SwiperSlide key={r.name}>
                  <ReviewCard review={r} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-6 text-center">
            <button className="rounded-full border border-brand px-8 py-2.5 text-[12px] font-medium text-brand transition-colors duration-200 hover:bg-brand hover:text-white active:scale-[0.98]">
              WRITE A REVIEW
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════ 3.3 Disclaimer Accordion ═══════════════ */
interface DisclaimerItem {
  title: string
  body: string
}

const disclaimerItems: DisclaimerItem[] = [
  {
    title: 'Risk Disclosure',
    body: 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The calculations/graphs are provided for illustration purposes only and are not guaranteed. Past performance is not indicative of future returns.',
  },
  {
    title: 'Calculation Assumptions',
    body: 'The SIP calculator assumes a constant rate of return throughout the investment tenure for simplicity. Actual returns may vary depending on market conditions, fund performance, and other external factors. Step-up SIP calculations assume the step-up percentage is applied at the start of each investment year.',
  },
  {
    title: 'Data Source',
    body: 'Fund data (AUM, expense ratio, NAV, returns) displayed on this page is indicative and sourced from publicly available fund information. It may not reflect the latest real-time values. Please verify current data with the respective Asset Management Company (AMC) before making investment decisions.',
  },
  {
    title: 'Regulatory Note',
    body: 'This page is for informational purposes only and does not constitute investment advice, an offer, or a solicitation to buy or sell any mutual fund units. Please consult a SEBI-registered investment advisor before investing. Investors should understand that all investments carry risk.',
  },
]

function DisclaimerTile({ item }: { item: DisclaimerItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate2-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-1 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="text-[13px] font-semibold text-navy">{item.title}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate2-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pl-1 pr-8 text-[12px] leading-5 text-slate2-secondary">{item.body}</p>
        </div>
      </div>
    </div>
  )
}

export function SipDisclaimer() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="container-pb max-w-3xl">
        <Reveal>
          <SectionHeading title="Disclaimer" />
          <p className="mt-3 text-[12px] leading-5 text-slate2-muted">
            Please read the following disclaimers carefully before using the SIP Calculator.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-6 rounded-xl border border-slate2-border bg-white p-6 shadow-sm">
            {disclaimerItems.map((item) => (
              <DisclaimerTile key={item.title} item={item} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}