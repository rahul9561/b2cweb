import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const banners = [
  {
    image: '/images/banners/claims-24x7.png',
    alt: '24x7 Claims',
    link: '#',
  },
  {
    image: '/images/banners/ask-expert.png',
    alt: 'Ask an Expert',
    link: '#',
  },
  {
    image: '/images/banners/beware-fraudsters.png',
    alt: 'Beware of Fraudsters',
    link: '#',
  },
]

export default function MiniBannerSlider() {
  return (
    <section className="bg-white py-8">
      <div className="container-pb">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          spaceBetween={18}
          slidesPerView={1}
          autoplay={{
            delay: 3500,
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
          {banners.map((banner) => (
            <SwiperSlide key={banner.alt}>
              <a
                href={banner.link}
                className="block overflow-hidden rounded-2xl"
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="h-auto w-full rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}