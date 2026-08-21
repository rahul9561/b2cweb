import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { productTiles } from '../data/home'

/* ── AV Management home sections ── */
import QuickBuy from '../components/QuickBuy'
import PromoCards from '../components/PromoCards'
import WhyChooseUs from '../components/WhyChooseUs'
import MiniBannerSlider from '../components/MiniBannerSlider'
import PopularCalculators from '../components/PopularCalculators'
import Advantages from '../components/Advantages'
import DownloadApp from '../components/DownloadApp'
import Testimonials from '../components/Testimonials'
import Partners from '../components/Partners'
import HelpCenter from '../components/HelpCenter'
// import GroupBrands from '../components/GroupBrands'
import ProductModal from '../components/ProductModal'
/* ── Hero banners ── */
const heroBanners = [
  {
    title: '₹1 Crore',
    subtitle: 'TERM LIFE INSURANCE',
    price: 'Starting at ₹410/month*',
    badge1: 'Get online discount upto 15%*',
    badge2: 'Now 0% GST**',
    bg: 'from-[#1a1a5e] via-[#2d2d8e] to-[#4a3fb5]',
    cta: 'View plans',
  },
  {
    title: '₹50 Lakh Cover',
    subtitle: 'HEALTH INSURANCE',
    price: 'Starting at ₹980/month*',
    badge1: 'Cashless claims at 18,000+ hospitals',
    badge2: 'No medical check-up below 45',
    bg: 'from-[#0d3b2e] via-[#1a5c47] to-[#2d8b6a]',
    cta: 'View plans',
  },
  {
    title: 'Upto 6.9%',
    subtitle: 'GUARANTEED RETURNS',
    price: 'Investment Plans',
    badge1: 'Tax-free maturity benefits',
    badge2: 'Flexible tenure options',
    bg: 'from-[#5c1a1a] via-[#8b3a2d] to-[#b55a3f]',
    cta: 'View plans',
  },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Hero />
      <ProductGrid />
       <div className="mt-5 text-center">
          <button
  onClick={() => setModalOpen(true)}
  className="inline-flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
>
  View all products <ArrowRight size={13} />
</button>
        </div>
      <QuickBuy onViewAll={() => setModalOpen(true)} />
      <PromoCards />
      <WhyChooseUs />
      <MiniBannerSlider />
      <PopularCalculators />
      <Advantages />
      <DownloadApp />
      <Testimonials />
      <Partners />
      <HelpCenter />
      {/* <GroupBrands /> */}
    </div>
  )
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  const [currentBanner, setCurrentBanner] = useState(0)

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
  }, [])

  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextBanner, 4000)
    return () => clearInterval(timer)
  }, [nextBanner])

  const banner = heroBanners[currentBanner]

  return (
    <section className="bg-blueBG">
      <div className="container-pb flex flex-col items-center gap-8 py-10 lg:flex-row lg:items-start lg:py-14">
        {/* Left side */}
        <div className="flex-1 pt-4">
          <h1 className="text-[32px] font-light leading-snug text-navy lg:text-[40px]">
            Let's find you
            <br />
            the <span className="font-bold">Best Insurance</span>
          </h1>
          <div className="mt-8 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand/30">
                <CheckCircle2 size={20} className="text-brand" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-navy">51 insurers offering</p>
                <p className="text-[12px] text-slate2-secondary">lowest prices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-cta/30">
                <Zap size={20} className="text-green-cta" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-navy">Quick, easy &amp;</p>
                <p className="text-[12px] text-slate2-secondary">hassle free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - banner carousel */}
        <div className="w-full max-w-[520px]">
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.bg} p-8 text-white transition-all duration-500`}
            style={{ minHeight: '280px' }}
          >
            <div className="relative z-10">
              <p className="text-[36px] font-bold leading-tight">{banner.title}</p>
              <p className="mt-1 text-[16px] font-semibold tracking-wide">{banner.subtitle}</p>
              <p className="mt-3 text-[15px]">{banner.price}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
                  {banner.badge1}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
                  {banner.badge2}
                </span>
              </div>
              <button className="mt-5 flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-white/90">
                {banner.cta} <ArrowRight size={14} />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={prevBanner}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary hover:border-brand hover:text-brand"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i === currentBanner ? 'bg-brand' : 'bg-slate2-border'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextBanner}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate2-border bg-white text-slate2-secondary hover:border-brand hover:text-brand"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate2-muted">
            *Standard T&C Apply | IRDAI Regd. PB Insurance Brokers | IRDAI Reg. No. 442
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ PRODUCT GRID ═══════════════════════ */
function ProductGrid() {
  return (
    <section className="container-pb py-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {productTiles.map((p) => (
          <a
            key={p.name}
            href={p.to}
            className="group relative flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          >
            {p.tag && (
              <span
                className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[9px] font-bold text-white"
                style={{ backgroundColor: p.tagColor }}
              >
                {p.tag}
              </span>
            )}
            <div
              className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: p.bgColor }}
            >
              <img
                src={p.icon}
                alt={p.name}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            <p className="text-[11px] font-medium leading-tight text-navy group-hover:text-brand">
              {p.name}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
