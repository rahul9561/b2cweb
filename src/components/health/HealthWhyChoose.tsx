import { Award, Wallet, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerList } from '../../lib/motion'

const BENEFITS = [
  {
    icon: Award,
    title: 'Platinum insurance partner',
    description:
      'We are India\'s largest digital insurance platform with 51 insurance partners.',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Wallet,
    title: 'Affordable options',
    description:
      'Compare 200+ plans, 45 lakh+ customers trust us for the best price.',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Headphones,
    title: '30 minute claim support',
    description:
      'Our dedicated claims support team is available 24/7 to assist you with your health insurance claims.',
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
]

export default function HealthWhyChoose() {
  return (
    <section className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-xl font-bold text-navy sm:text-left">
          Why AV Management is the preferred choice for 55 Lakh+ people like
          you
        </h2>

        <motion.div
          variants={staggerList}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
                style={{ marginTop: i === 1 ? '1.5rem' : undefined }}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${b.color}`}
                >
                  <Icon className={`h-6 w-6 ${b.iconColor}`} />
                </div>
                <h4 className="mt-4 text-sm font-bold text-navy">{b.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {b.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
