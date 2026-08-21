import { motion } from 'framer-motion'
import { FaUsers, FaSearch, FaSmile, FaHandsHelping } from 'react-icons/fa'

const cards = [
  {
    icon: FaUsers,
    title: 'Over 9 million',
    desc: 'customers trust us to secure their family\'s finances',
    color: 'bg-brand/10',
    iconColor: 'text-brand',
    border: 'border-l-brand',
  },
  {
    icon: FaSearch,
    title: '51+ Insurers',
    desc: 'partner with us, ensuring choice, transparency & simplicity',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    border: 'border-l-green-500',
  },
  {
    icon: FaSmile,
    title: 'Best Price',
    desc: 'for all types of insurance plans available in the market',
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-l-orange-400',
  },
  {
    icon: FaHandsHelping,
    title: 'Claims Support',
    desc: 'built-in with every policy; we are there for you at the last mile',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-l-purple-500',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Left side */}
          <div className="flex-1 pt-4">
            <h2 className="text-[26px] font-medium leading-snug text-navy lg:text-[30px]">
              What makes{' '}
              <span className="font-bold">AV Management</span> one of India's
              favourite places
              <br />
              to buy insurance?
            </h2>
            <div className="relative mt-8">
              <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-brand/5" />
              <div className="absolute -bottom-2 right-10 h-14 w-14 rounded-full bg-green-50" />
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
                  className={`rounded-xl border-l-4 ${c.border} bg-white p-5 shadow-sm transition-shadow hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.color}`}
                    >
                      <Icon size={20} className={c.iconColor} />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-navy">{c.title}</p>
                      <p className="mt-0.5 text-[12px] leading-5 text-slate2-secondary">
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
