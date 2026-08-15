import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Heart,
  X,
} from 'lucide-react'

const advantages = [
  {
    icon: Coins,
    heading: 'One of the best Prices',
    text: 'Guaranteed',
    theme: 'from-amber-50 to-amber-100 text-amber-600',
  },
  {
    icon: ShieldCheck,
    heading: 'Unbiased Advice',
    text: 'Keeping customers first',
    theme: 'from-blue-50 to-blue-100 text-blue-600',
  },
  {
    icon: BadgeCheck,
    heading: '100% Reliable',
    text: 'Regulated by IRDAI',
    theme: 'from-emerald-50 to-emerald-100 text-emerald-600',
  },
  {
    icon: Headphones,
    heading: 'Claims Support',
    text: 'Made stress-free',
    theme: 'from-violet-50 to-violet-100 text-violet-600',
  },
  {
    icon: Heart,
    heading: 'Happy to Help',
    text: 'Every day of the week',
    theme: 'from-rose-50 to-rose-100 text-rose-600',
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
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <h2 className="text-center text-[22px] font-medium text-navy">PB Advantage</h2>
        <span className="heading-accent mx-auto mt-2 block h-1 w-12 rounded-full bg-brand" />
        <p className="mx-auto mt-4 max-w-3xl text-center text-[13px] leading-6 text-slate2-secondary">
          When you buy insurance from us, you get more than just financial safety. You also get our
          promise of simplifying complex insurance terms and conditions, quick stress-free claims,
          instant policies from top insurers and being present for you in the toughest of times.
        </p>
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[13px] font-medium text-brand hover:underline"
          >
            Know More
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-5">
          {advantages.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-slate2-border bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${a.theme}`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <p className="text-[13px] font-semibold leading-5 text-navy">{a.heading}</p>
                <p className="mt-1 text-[11px] text-slate2-secondary">{a.text}</p>
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
          Finance & Loans at AVManagement.in
        </h3>

        <div className="mt-5 space-y-4 text-[13px] leading-6 text-slate2-secondary">
          <p>
            AVManagement.in is a finance and loan advisory platform helping individuals
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
            Benefits of Applying Through AVManagement.in
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
            home, business, or gold loan among others, AVManagement.in offers an unbiased
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