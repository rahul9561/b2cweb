import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { ShieldCheck, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'

import 'swiper/css'
import 'swiper/css/pagination'

const miniBanners = [
  {
    badge: '24x7 Support',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    title: 'Our Claim Assistance',
    subtitle: 'Hassle-free 3-step claim settlement with dedicated manager support',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    overlay: 'from-blue-950/95 via-indigo-950/85 to-slate-950/95',
    btnClass: 'hover:bg-blue-600 hover:text-white',
    icon: ShieldCheck,
    btnText: 'File a Claim',
    link: '/health-insurance',
  },
  {
    badge: 'Expert Advisory',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    title: 'Got a Question?',
    subtitle: 'Speak directly with our certified insurance experts for 100% unbiased advice',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    overlay: 'from-emerald-950/95 via-teal-950/85 to-slate-950/95',
    btnClass: 'hover:bg-emerald-600 hover:text-white',
    icon: HelpCircle,
    btnText: 'Ask an Expert',
    link: '#customer-reviews',
  },
  {
    badge: 'Security Warning',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    title: 'Beware of Fraudsters',
    subtitle: 'IRDAI & AV Management never ask for policy bonus fees or secret OTPs',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    overlay: 'from-amber-950/95 via-rose-950/85 to-slate-950/95',
    btnClass: 'hover:bg-amber-500 hover:text-slate-950',
    icon: AlertTriangle,
    btnText: 'Learn Safety Tips',
    link: '/privacy-policy',
  },
]

export default function MiniBannerSlider({ onComingSoon }: { onComingSoon?: (featureName: string) => void }) {
  return (
    <section className="bg-white py-8">
      <div className="container-pb">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          className="mini-banner-slider"
        >
          {miniBanners.map((banner) => {
            const Icon = banner.icon
            return (
              <SwiperSlide key={banner.title}>
                <a
                  href={banner.link}
                  onClick={(event) => {
                    if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                    event.preventDefault()
                    onComingSoon?.(banner.btnText)
                  }}
                  className="group relative block min-h-[220px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  {/* Background photographic image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${banner.overlay}`} />
                  </div>

                  <div className="relative z-10 flex min-h-[175px] flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 shadow-md">
                          <Icon size={20} className="text-white" />
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${banner.badgeClass}`}>
                          {banner.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">{banner.title}</h3>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-200">{banner.subtitle}</p>
                    </div>

                    <div className="mt-4">
                      <span className={`inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-navy shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-105 ${banner.btnClass}`}>
                        <span>{banner.btnText}</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}