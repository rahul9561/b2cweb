import { motion } from 'framer-motion'
import { FaUsers, FaSearch, FaSmile, FaHandsHelping } from 'react-icons/fa'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const cards = [
  {
    icon: FaUsers,
    title: 'Over 9 Million',
    desc: "customers trust us to secure their family's finances",
    theme: 'from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
    border: 'border-l-blue-600',
  },
  {
    icon: FaSearch,
    title: '51+ Insurers',
    desc: 'partner with us, ensuring choice, transparency & simplicity',
    theme: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    border: 'border-l-emerald-500',
  },
  {
    icon: FaSmile,
    title: 'Best Price',
    desc: 'for all types of insurance plans available in the market',
    theme: 'from-amber-500 to-orange-600 text-white shadow-amber-500/20',
    border: 'border-l-amber-500',
  },
  {
    icon: FaHandsHelping,
    title: 'Claims Support',
    desc: 'built-in with every policy; we are there for you at the last mile',
    theme: 'from-purple-500 to-violet-600 text-white shadow-purple-500/20',
    border: 'border-l-purple-500',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-b from-blue-50/60 via-slate-50 to-blue-50/40 py-12 lg:py-16">
      <div className="container-pb">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          {/* Left side */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand shadow-sm">
              <ShieldCheck size={16} /> India's Most Trusted Insurance Marketplace
            </div>

            <h2 className="mt-4 text-2xl font-extrabold leading-snug text-navy sm:text-3xl lg:text-4xl">
              What makes <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AV Management</span> one of India's favourite places to buy insurance?
            </h2>

            <p className="mt-4 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
              We empower millions of families with 100% transparent comparison, instant digital policy delivery, zero hidden charges, and dedicated claim assistance.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {['100% Unbiased Advice', 'Zero Spam Calls Guarantee', '24x7 Claim Assistance'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-sm">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — 2x2 cards */}
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`group relative overflow-hidden rounded-2xl border-l-4 ${c.border} border-t border-r border-b border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.theme} shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-navy transition-colors group-hover:text-brand">{c.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
