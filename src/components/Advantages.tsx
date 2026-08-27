import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Heart,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const advantages = [
  {
    icon: Coins,
    heading: 'Best Price Guarantee',
    text: 'Guaranteed lowest rates on all plans',
    theme: 'from-amber-400 to-orange-500 text-white shadow-amber-500/25',
  },
  {
    icon: ShieldCheck,
    heading: '100% Unbiased Advice',
    text: 'Keeping customer interest first always',
    theme: 'from-blue-500 to-indigo-600 text-white shadow-blue-500/25',
  },
  {
    icon: BadgeCheck,
    heading: '100% Reliable & Safe',
    text: 'Fully regulated by IRDAI',
    theme: 'from-emerald-400 to-teal-600 text-white shadow-emerald-500/25',
  },
  {
    icon: Headphones,
    heading: '24x7 Claims Support',
    text: 'Dedicated stress-free claim assistance',
    theme: 'from-violet-500 to-purple-600 text-white shadow-violet-500/25',
  },
  {
    icon: Heart,
    heading: 'Happy to Help',
    text: 'Support team available every day',
    theme: 'from-rose-400 to-pink-600 text-white shadow-rose-500/25',
  },
]

export default function Advantages() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isModalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  return (
    <section className="bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 py-12 lg:py-16">
      <div className="container-pb">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
            <Sparkles size={14} /> The AV Management Guarantee
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">AV Management Advantage</h2>
          <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            When you buy insurance from us, you get more than financial safety. You get our promise of simplifying complex terms, instant paperless issuance, quick stress-free claims, and being present for you in tough times.
          </p>
          <div className="mt-3 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
            >
              Know More <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {advantages.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${a.theme} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} strokeWidth={2} />
                </div>
                <p className="text-xs font-extrabold leading-snug text-navy transition-colors group-hover:text-brand sm:text-sm">{a.heading}</p>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">{a.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Know More modal */}
    {/* Know More modal */}
<AnimatePresence>
  {isModalOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsModalOpen(false)}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[70vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 pr-6 shadow-2xl av-modal-scroll"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          aria-label="Close"
          className="sticky top-0 float-right -mt-2 -mr-2 text-slate2-secondary transition-colors hover:text-navy"
        >
          <X size={22} />
        </button>

        <h3 className="pr-8 text-xl font-semibold text-navy">
          Finance & Loans at AVmanagementpvtltd.com
        </h3>

        <div className="mt-5 space-y-4 text-[13px] leading-6 text-slate2-secondary">
          <p>
            AVmanagementpvtltd.com is a finance and loan advisory platform helping individuals
            and businesses find the right lending and investment solutions. We offer an
            online platform where borrowers can easily compare{' '}
            <a href="#" className="text-brand hover:underline">personal loans</a>,{' '}
            <a href="#" className="text-brand hover:underline">home loans</a>,{' '}
            <a href="#" className="text-brand hover:underline">business loans</a>,{' '}
            <a href="#" className="text-brand hover:underline">gold loans</a>, and{' '}
            <a href="#" className="text-brand hover:underline">loan against property</a>.
            Applicants can make an informed choice in a few clicks, right from the
            comfort of their home.
          </p>

          <p className="font-semibold text-navy">Our Partners</p>
          <p>
            Our lending partners span diverse categories —{' '}
            <a href="#" className="text-brand hover:underline">banks</a>, NBFCs,{' '}
            <a href="#" className="text-brand hover:underline">housing finance companies</a>,
            and digital lenders. We've partnered with them to be a one-stop solution for
            all your borrowing and financial planning needs.
          </p>

          <p className="font-semibold text-navy">
            Benefits of Applying Through AVmanagementpvtltd.com
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="font-semibold text-navy">Quick Decision Making:</span> Our
              platform helps you make an informed borrowing decision simply and
              conveniently. Compare interest rates, tenure, and processing fees across
              lenders in a matter of seconds, so you can shortlist the loan that suits
              your needs.
            </li>
            <li>
              <span className="font-semibold text-navy">Lowest Interest Rates:</span> As
              compared to walking into a branch, we help you access the most competitive
              interest rates available. Since there's no middleman commission baked in,
              you get access to real, transparent rates from multiple lenders — including{' '}
              <a href="#" className="text-brand hover:underline">
                home loan interest rates
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand hover:underline">
                personal loan EMI calculators
              </a>{' '}
              to make a smart, informed decision.
            </li>
            <li>
              <span className="font-semibold text-navy">Seamless Application:</span> We
              have a strong technological edge that makes the loan application process
              seamless. Our online forms adapt based on the applicant's income profile,
              credit history, and loan requirement.
            </li>
            <li>
              <span className="font-semibold text-navy">Error-Free Eligibility Checks:</span>{' '}
              Your loan eligibility and EMI are system-generated, which eliminates the
              scope of human error. This also considerably reduces the time taken to get
              a sanction.
            </li>
            <li>
              <span className="font-semibold text-navy">End-to-End Support:</span> From
              document collection to disbursal, our team assists you at every step —
              including post-disbursal support for foreclosure, part-payment, or
              refinancing queries.
            </li>
          </ul>

          <p>
            No matter what type of financial product you intend to apply for — personal,
            home, business, or gold loan among others, AVmanagementpvtltd.com offers an unbiased
            and data-driven platform to secure financing hassle-free.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  )
}