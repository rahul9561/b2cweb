import { motion } from 'framer-motion'
import { FaCoins, FaUserMd, FaCalculator } from 'react-icons/fa'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'

const promos = [
  {
    title: 'Investment Plans',
    subtitle: 'Grow your wealth tax-free with high returns & life cover',
    image: '/images/products/investment_plans_card_1787806075608.jpg',
    overlay: 'from-emerald-950/95 via-emerald-900/85 to-teal-950/95',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    btnHover: 'hover:bg-emerald-500 hover:text-white',
    icon: FaCoins,
    to: '/investment-plans',
  },
  {
    title: 'Health Insurance',
    subtitle: 'Cashless claims at 18,000+ top hospitals nationwide',
    image: '/images/products/health_insurance_card_1787806059389.jpg',
    overlay: 'from-blue-950/95 via-indigo-900/85 to-blue-950/95',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    btnHover: 'hover:bg-blue-600 hover:text-white',
    icon: FaUserMd,
    to: '/health-insurance',
  },
  {
    title: 'SIP Calculator',
    subtitle: 'Plan your mutual fund & wealth investments smartly',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    overlay: 'from-purple-950/95 via-violet-900/85 to-slate-950/95',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    btnHover: 'hover:bg-purple-600 hover:text-white',
    icon: FaCalculator,
    to: '/sip-calculator',
  },
]

export default function PromoCards({ onComingSoon }: { onComingSoon?: (featureName: string) => void }) {
  return (
    <section className="bg-white py-8">
      <div className="container-pb grid gap-6 md:grid-cols-3">
        {promos.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900 p-7 text-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              {/* Real Photographic Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${p.overlay}`} />
              </div>

              <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 shadow-lg">
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${p.badgeBg}`}>
                      Popular Choice
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">{p.title}</h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-200">{p.subtitle}</p>
                </div>

                <div className="mt-6">
                  <Link
                    to={p.to}
                    onClick={(event) => {
                      if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                      event.preventDefault()
                      onComingSoon?.(p.title)
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-navy shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 ${p.btnHover}`}
                  >
                    <span>Explore Now</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
