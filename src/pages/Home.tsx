import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { useLocation } from 'react-router-dom'
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
import ExperianCreditOverview from '../components/credit-score/ExperianCreditOverview'
import { fetchLoanCategories } from '../lib/loanCategories'
// import GroupBrands from '../components/GroupBrands'
import ProductModal from '../components/ProductModal'
import ComingSoonModal from '../components/ComingSoonModal'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'
/* ── Hero banners with real image visuals ── */
const heroBanners = [
  {
    title: '₹1 Crore',
    subtitle: 'TERM LIFE INSURANCE',
    price: 'Starting at ₹410/month*',
    badge1: 'Get online discount upto 15%*',
    badge2: 'Now 0% GST**',
    image: '/images/products/term_life_hero_1787806044322.jpg',
    overlay: 'from-blue-950/90 via-blue-900/80 to-indigo-950/90',
    accentColor: 'from-blue-500 to-indigo-500',
    cta: 'View plans',
  },
  {
    title: '₹50 Lakh Cover',
    subtitle: 'HEALTH INSURANCE',
    price: 'Starting at ₹980/month*',
    badge1: 'Cashless claims at 18,000+ hospitals',
    badge2: 'No medical check-up below 45',
    image: '/images/products/health_insurance_card_1787806059389.jpg',
    overlay: 'from-emerald-950/90 via-teal-900/80 to-slate-950/90',
    accentColor: 'from-emerald-500 to-teal-500',
    cta: 'View plans',
  },
  {
    title: 'Upto 6.9%',
    subtitle: 'GUARANTEED RETURNS',
    price: 'Investment Plans',
    badge1: 'Tax-free maturity benefits',
    badge2: 'Flexible tenure options',
    image: '/images/products/investment_plans_card_1787806075608.jpg',
    overlay: 'from-slate-950/90 via-amber-950/80 to-violet-950/90',
    accentColor: 'from-amber-500 to-orange-500',
    cta: 'View plans',
  },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState('')
  const location = useLocation()
  useEffect(() => {
    void fetchLoanCategories(true).catch(() => undefined)
  }, [])

  useEffect(() => {
    if (location.hash !== '#customer-reviews') return
    window.requestAnimationFrame(() => document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' }))
  }, [location.hash])

  return (
    <div className="bg-slate-50/50">
      <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <ComingSoonModal
        isOpen={Boolean(comingSoonFeature)}
        onClose={() => setComingSoonFeature('')}
        featureName={comingSoonFeature}
      />
      <Hero />
      <ProductGrid onComingSoon={setComingSoonFeature} />
      <div className="mt-2 mb-10 text-center">
        <button
          onClick={() => {
            if (SHOW_HOME_SECTIONS_COMING_SOON) {
              setComingSoonFeature('All products')
              return
            }
            setModalOpen(true)
          }}
          className="group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-xs font-bold text-brand shadow-sm transition-all duration-300 hover:border-brand hover:bg-blue-50/50 hover:shadow-md"
        >
          View all products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <ExperianCreditOverview />
      <QuickBuy
        onViewAll={() => {
          if (SHOW_HOME_SECTIONS_COMING_SOON) {
            setComingSoonFeature('All Quick Buy products')
            return
          }
          setModalOpen(true)
        }}
        onComingSoon={setComingSoonFeature}
      />
      <PromoCards onComingSoon={setComingSoonFeature} />
      <WhyChooseUs />
      <MiniBannerSlider onComingSoon={setComingSoonFeature} />
      <PopularCalculators onComingSoon={setComingSoonFeature} />
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
    const timer = setInterval(nextBanner, 4500)
    return () => clearInterval(timer)
  }, [nextBanner])

  const banner = heroBanners[currentBanner]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 py-10 lg:py-14">
      {/* Background ambient lighting blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="container-pb relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:items-center">
        {/* Left side info */}
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-blue-900 uppercase">
              ⚡ India's #1 Insurance Marketplace
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl lg:leading-tight">
            Let's find you <br />
            the{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Best Insurance
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
            Compare quotes from 51+ leading insurers instantly. Get unbiased advice, lowest prices, and 100% paperless claim support.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <CheckCircle2 size={22} />
              </span>
              <div>
                <p className="text-xs font-bold text-navy">51+ Partner Insurers</p>
                <p className="text-[11px] text-slate-500">Guaranteed lowest prices</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <Zap size={22} />
              </span>
              <div>
                <p className="text-xs font-bold text-navy">Quick &amp; Hassle Free</p>
                <p className="text-[11px] text-slate-500">Instant policy issuing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - hero carousel card */}
        <div className="w-full max-w-[540px]">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-2xl transition-all duration-500">
            {/* Real background image with gradient overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={banner.image}
                alt={banner.subtitle}
                className="h-full w-full object-cover opacity-60 transition-all duration-700 scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.overlay}`} />
            </div>

            <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-5 text-white sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ring-1 ring-white/30">
                    {banner.subtitle}
                  </span>
                  <span className="text-[11px] font-medium text-slate-200">
                    {currentBanner + 1} / {heroBanners.length}
                  </span>
                </div>

                <p className="mt-4 text-3xl font-black tracking-tight sm:text-4xl text-white drop-shadow-md">
                  {banner.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-blue-200">
                  {banner.price}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md border border-white/15">
                    {banner.badge1}
                  </span>
                  <span className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md border border-white/15">
                    {banner.badge2}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-navy shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]">
                  {banner.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevBanner}
                    aria-label="Previous Banner"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-white hover:text-navy"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextBanner}
                    aria-label="Next Banner"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-white hover:text-navy"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentBanner ? 'w-8 bg-brand' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <p className="mt-2 text-center text-[10px] font-medium text-slate-400">
            *Standard T&C Apply | IRDAI Regd. Insurance Brokers | Reg. No. 442
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ PRODUCT GRID ═══════════════════════ */
function ProductGrid({ onComingSoon }: { onComingSoon: (featureName: string) => void }) {
  return (
    <section className="container-pb py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Insurance Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">Explore best plans tailored for you and your family</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {productTiles.map((p) => (
          <a
            key={p.name}
            href={p.to}
            onClick={(event) => {
              if (!SHOW_HOME_SECTIONS_COMING_SOON) return
              event.preventDefault()
              onComingSoon(p.name)
            }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl"
          >
            {/* Tag Badge */}
            {p.tag && (
              <span
                className="absolute top-2 left-2 z-20 rounded-md px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md backdrop-blur-sm"
                style={{ backgroundColor: p.tagColor || '#49cc76' }}
              >
                {p.tag}
              </span>
            )}

            {/* Real Photographic Card Image Banner */}
            <div className="relative h-28 w-full overflow-hidden bg-slate-100">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to solid background color if image link fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : null}
              {/* Subtle dark bottom gradient on image for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Product Icon Badge Overlaid */}
              <div
                className="absolute bottom-2 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur-md ring-2 ring-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: p.bgColor || '#ffffff' }}
              >
                <img
                  src={p.icon}
                  alt=""
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            </div>

            {/* Product Title */}
            <div className="flex flex-1 flex-col justify-between p-3.5 pt-3">
              <p className="text-[12px] font-bold leading-snug text-navy transition-colors group-hover:text-brand">
                {p.name}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View Plans</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
