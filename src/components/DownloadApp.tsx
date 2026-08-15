import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ScanSearch,
  ListChecks,
  FileCheck2,
  ShieldCheck,
  Apple,
  X,
} from 'lucide-react'

const checklistItems = [
  'Compare loan and finance offers instantly',
  'Apply and track applications online',
  'File and track your loan status',
  'Download your documents with a single tap',
]

const featureSteps = [
  {
    icon: ScanSearch,
    title: 'Compare',
    desc: 'Browse offers from all leading lenders in one place',
  },
  {
    icon: ListChecks,
    title: 'Choose',
    desc: 'Select the plan that fits your needs and budget',
  },
  {
    icon: FileCheck2,
    title: 'Apply Online',
    desc: 'Paperless application with instant processing',
  },
  {
    icon: ShieldCheck,
    title: 'Get Funded',
    desc: 'Dedicated support whenever you need it',
  },
]

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.agent_portal&hl=en_IN'

export default function DownloadApp() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  return (
    <section className="bg-white py-14">
      <div className="container-pb flex flex-col items-center gap-10 lg:flex-row">
        {/* Left */}
        <div className="flex-1">
          <h2 className="mb-2 text-[22px] font-medium text-navy">
            Get the AV Management app
          </h2>
          <span className="mb-4 block h-1 w-12 rounded-full bg-brand" />
          <p className="mb-5 max-w-md text-[13px] leading-6 text-slate2-secondary">
            Get control of all your loans and finances anywhere, anytime
          </p>
          <ul className="mb-5 space-y-2.5 text-[12px] text-slate2-secondary">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate2-muted">
            Download our app from
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white transition-colors hover:bg-gray-800"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l10.75 9.85-10.75 9.85c-.5-.24-.84-.76-.84-1.35zM16.81 12l2.6-2.6 3.13 1.8c.82.47.82 1.13 0 1.6l-3.13 1.8-2.6-2.6zM5.94 2.13L15.09 11.28 5.94 2.13c.03 0 .06 0 .09-.01a1.31 1.31 0 011.07.19l9.7 5.6-16.4 9.47.09-.05a1.3 1.3 0 01-.03-.02l6.48-6.48-9.75-9.75c.06-.03.13-.05.19-.06L5.94 2.13z" />
              </svg>
              <div className="text-left">
                <p className="text-[7px] leading-tight text-white/70">GET IT ON</p>
                <p className="text-[12px] font-medium leading-tight">Google Play</p>
              </div>
            </a>
            <button
              onClick={() => setShowComingSoon(true)}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white transition-colors hover:bg-gray-800"
            >
              <Apple size={18} />
              <div className="text-left">
                <p className="text-[7px] leading-tight text-white/70">Download on the</p>
                <p className="text-[12px] font-medium leading-tight">App Store</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right — feature cards */}
        <div className="grid flex-1 grid-cols-2 gap-4">
          {featureSteps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-xl bg-blueBGMuted p-4 shadow-sm"
              >
                <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Icon size={18} className="text-brand" />
                </div>
                <p className="mb-0.5 text-[13px] font-semibold text-navy">{s.title}</p>
                <p className="text-[11px] leading-4 text-slate2-secondary">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* App Store — Coming Soon popup */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowComingSoon(false)}
                aria-label="Close"
                className="absolute right-4 top-4 text-slate2-secondary transition-colors hover:text-navy"
              >
                <X size={20} />
              </button>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blueBG">
                <Apple size={22} className="text-brand" />
              </div>
              <h3 className="text-[16px] font-semibold text-navy">Coming Soon</h3>
              <p className="mt-2 text-[13px] leading-6 text-slate2-secondary">
                Our iOS app is on its way! In the meantime, get the AV Management app
                on Google Play.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}