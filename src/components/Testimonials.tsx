import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials } from '../data/home'

export default function Testimonials() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-medium text-navy">
              What Our Customers Are Saying
            </h2>
            <span className="heading-accent mt-3 block" />
          </div>

          <div className="flex items-center gap-4">
            <button
              ref={prevRef}
              aria-label="Previous testimonial"
              className="text-slate2-muted transition-colors hover:text-slate2-secondary"
            >
              <ArrowLeft size={22} strokeWidth={1.75} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonial"
              className="text-brand transition-colors hover:text-brand/70"
            >
              <ArrowRight size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="mt-10">
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
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            loop
            className="pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm">
                  <FaQuoteLeft size={24} className="mb-3 text-brand/20" />
                  <p className="mb-0.5 text-[13px] font-bold text-navy">{t.name}</p>
                  <div className="mb-2.5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} size={12} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="flex-1 text-[12px] leading-5 text-slate2-secondary">
                    "{t.copy}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}