import { motion } from 'framer-motion'
import { FaCoins, FaUserMd, FaCalculator } from 'react-icons/fa'

const promos = [
  {
    title: 'Investment Plans',
    subtitle: 'Grow your wealth tax-free',
    gradient: 'from-emerald-500 to-emerald-700',
    icon: FaCoins,
  },
  {
    title: 'Health Insurance',
    subtitle: 'Cashless claims at 18,000+ hospitals',
    gradient: 'from-blue-500 to-blue-700',
    icon: FaUserMd,
  },
  {
    title: 'SIP Calculator',
    subtitle: 'Plan your investments smartly',
    gradient: 'from-purple-500 to-purple-700',
    icon: FaCalculator,
  },
]

export default function PromoCards() {
  return (
    <section className="bg-white pb-10">
      <div className="container-pb grid gap-5 md:grid-cols-3">
        {promos.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.gradient} p-6 text-white shadow-lg transition-transform hover:scale-[1.02]`}
            >
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Icon size={22} />
                </div>
                <h3 className="text-[16px] font-bold">{p.title}</h3>
                <p className="mt-1 text-[12px] text-white/80">{p.subtitle}</p>
                <button className="mt-4 rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-gray-800 shadow transition-colors hover:bg-white/90">
                  Explore Now
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
