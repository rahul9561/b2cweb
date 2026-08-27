import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { Headphones, Clock, ShieldCheck, LifeBuoy } from 'lucide-react'

export default function HelpCenter() {
  return (
    <section className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 py-12 lg:py-16">
      <div className="container-pb">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center">
          {/* Left */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
              <LifeBuoy size={15} /> 24/7 Dedicated Support
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl lg:text-4xl">
              Have a question? <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Here to help.</span>
            </h2>
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
              Our friendly customer support team listens with undivided attention to resolve your queries, answer questions, or assist with instant policy claims.
            </p>

            <div className="mt-6 space-y-3.5 max-w-md">
              <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  <FaEnvelope size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">General Enquiries</p>
                  <a href="mailto:info@help.com" className="text-sm font-extrabold text-navy transition-colors group-hover:text-brand">
                    info@help.com
                  </a>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                  <FaPhoneAlt size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Customer Sales &amp; Claims Support</p>
                  <a href="tel:9917500023" className="text-sm font-extrabold text-navy transition-colors group-hover:text-brand">
                    9917500023
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — illustration banner card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl max-w-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 shadow-lg">
                <Headphones size={28} className="text-amber-300 animate-pulse" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-white">Instant Assistance</h3>
              <p className="mt-2 text-xs leading-relaxed text-blue-100">
                Get step-by-step guidance on policy comparison, claim filing, and instant renewal support.
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-white/15 pt-4 text-xs font-semibold text-blue-200">
                <div className="flex items-center gap-1.5">
                  <Clock size={15} className="text-emerald-400" />
                  <span>24x7 Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Zero Spam</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
