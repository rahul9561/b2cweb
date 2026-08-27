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
  Smartphone,
} from 'lucide-react'

const checklistItems = [
  'Compare loan and finance offers instantly from 51+ partners',
  'Apply and track applications online with zero paperwork',
  'Instant loan eligibility check & status notifications',
  'Download your policy & loan documents with a single tap',
]

const featureSteps = [
  {
    icon: ScanSearch,
    title: '1. Compare',
    desc: 'Browse offers from leading lenders in one place',
  },
  {
    icon: ListChecks,
    title: '2. Choose',
    desc: 'Select the plan that fits your exact budget',
  },
  {
    icon: FileCheck2,
    title: '3. Apply Online',
    desc: '100% paperless application with fast processing',
  },
  {
    icon: ShieldCheck,
    title: '4. Get Funded',
    desc: 'Dedicated claim & loan support whenever you need',
  },
]

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.agent_portal&hl=en_IN'

export default function DownloadApp() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-pb flex flex-col items-center gap-12 lg:flex-row lg:items-center">
        {/* Left */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
            <Smartphone size={15} /> Mobile Application
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl lg:text-4xl">
            Get the AV Management App
          </h2>
          <p className="mt-3 max-w-lg text-xs leading-relaxed text-slate-500 sm:text-sm">
            Take full control of all your insurance policies, loans, and financial planning anywhere, anytime — right from your smartphone.
          </p>
          <ul className="mt-5 space-y-3 text-xs font-medium text-slate-600 sm:text-sm">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Download Official Mobile App
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-xl"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="text-emerald-400">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l10.75 9.85-10.75 9.85c-.5-.24-.84-.76-.84-1.35zM16.81 12l2.6-2.6 3.13 1.8c.82.47.82 1.13 0 1.6l-3.13 1.8-2.6-2.6zM5.94 2.13L15.09 11.28 5.94 2.13c.03 0 .06 0 .09-.01a1.31 1.31 0 011.07.19l9.7 5.6-16.4 9.47.09-.05a1.3 1.3 0 01-.03-.02l6.48-6.48-9.75-9.75c.06-.03.13-.05.19-.06L5.94 2.13z" />
                </svg>
                <div className="text-left">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">GET IT ON</p>
                  <p className="text-sm font-extrabold leading-none text-white">Google Play</p>
                </div>
              </a>
              <button
                onClick={() => setShowComingSoon(true)}
                className="group flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-xl"
              >
                <Apple size={24} className="text-white" />
                <div className="text-left">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Download on the</p>
                  <p className="text-sm font-extrabold leading-none text-white">App Store</p>
                </div>
              </button>
            </div>
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
                className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white hover:shadow-md"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand shadow-md ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <p className="text-xs font-extrabold text-navy transition-colors group-hover:text-brand sm:text-sm">{s.title}</p>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">{s.desc}</p>
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
              className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowComingSoon(false)}
                aria-label="Close"
                className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-navy"
              >
                <X size={20} />
              </button>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-brand shadow-inner">
                <Apple size={26} />
              </div>
              <h3 className="text-lg font-extrabold text-navy">Coming Soon</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Our iOS app is currently in final review! In the meantime, you can download the AV Management app on Google Play.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="mt-5 w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-brand-dark"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}