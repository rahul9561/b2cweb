import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'

export default function HelpCenter() {
  return (
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          {/* Left */}
          <div className="flex-1">
            <h2 className="mb-1 text-[22px] font-medium text-navy">Have a question?</h2>
<p className="mb-5 text-[22px] font-medium text-navy">Here to help.</p>
<span className="heading-accent mx-0 mb-5 block h-1 w-12 rounded-full bg-brand" />
            <p className="max-w-md text-[12px] leading-6 text-slate2-secondary">
              Our friendly customer support team is your go-to when you need help. They listen with
              undivided attention to resolve your queries, answer your questions, bring clarity or
              drop us an email, we're here to help.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate2-border bg-white px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blueBG text-brand">
                  <FaEnvelope size={14} />
                </span>
                <div>
                  <p className="text-[10px] text-slate2-muted">General Enquiries</p>
                  <p className="text-[12px] font-medium text-brand">care@policybazaar.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate2-border bg-white px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blueBG text-brand">
                  <FaPhoneAlt size={14} />
                </span>
                <div>
                  <p className="text-[10px] text-slate2-muted">Customer Sales Enquiries</p>
                  <p className="text-[12px] font-medium text-brand">1800-208-8787</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            {/* <div className="flex h-44 w-44 items-center justify-center rounded-full bg-blueBG">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand/10">
                <FaHeadphones size={40} className="text-brand" />
              </div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
