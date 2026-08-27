import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { ArrowLeft, ArrowRight, MessageSquareQuote } from 'lucide-react'
import { testimonials } from '../data/home'

export default function Testimonials() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section id="customer-reviews" className="scroll-mt-24 bg-gradient-to-b from-blue-50/40 via-slate-50 to-blue-50/60 py-12 lg:py-16">
      <div className="container-pb">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
              <MessageSquareQuote size={15} /> Real Feedback
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">
              What Our Customers Are Saying
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Over 9 million satisfied policyholders trust AV Management</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-md transition-all hover:bg-brand hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-md transition-all hover:bg-brand hover:text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
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
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            loop
            className="pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-black text-sm">
                        {t.name.slice(0, 1)}
                      </div>
                      <FaQuoteLeft size={22} className="text-blue-200 transition-colors group-hover:text-brand/40" />
                    </div>

                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} size={14} className="text-amber-400" />
                      ))}
                      <span className="ml-1 text-[10px] font-extrabold text-slate-400">5.0</span>
                    </div>

                    <p className="text-xs font-medium leading-relaxed text-slate-600 italic">
                      "{t.copy}"
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <p className="text-xs font-extrabold text-navy transition-colors group-hover:text-brand">{t.name}</p>
                    <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <span>✓ Verified Customer</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
