import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HealthDisclaimer() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="w-full border-t border-gray-200 bg-gray-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <h4 className="text-sm font-bold text-navy">Disclaimer</h4>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 text-[11px] leading-relaxed text-gray-500">
                <p>
                  <strong className="text-gray-600">
                    Bajaj Allianz General Insurance Co. Ltd.
                  </strong>{' '}
                  IRDAI Reg. No. 110100114222 | CIN: U66010PN2000PLC015391 | Registered
                  & Corporate Office: Bajaj Allianz Bhavan, survey no. 61, Pune - 411001,
                  Maharashtra.
                </p>
                <p>
                  <strong className="text-gray-600">AV Management Insurance Broking
                    Services Pvt. Ltd.</strong> IRDAI Corporate Agent (Life) License No:
                  CA01234 | CIN: U66010MH2001PTC123456 | Registered Office: 15th Floor,
                    Building No. 5, Mindspace, Malad (W), Mumbai - 400064.
                </p>
                <p>
                  <strong className="text-gray-600">
                    Bajaj Allianz Life Insurance Co. Ltd.
                  </strong>{' '}
                  IRDAI Reg. No. 12345678 | CIN: U66010PN2000PLC015391 | Registered Office:
                  Bajaj Allianz Bhavan, survey no. 61, Pune - 411001, Maharashtra.
                </p>
                <p>
                  Insurance is the subject matter of solicitation. For more details on risk
                  factors, terms and conditions, and exclusions, please read the sales
                  brochure carefully before concluding a sale. The purchase of insurance
                  product is not at all mandatory and is purely voluntary.
                </p>
                <p>
                  Insurance cover is provided by the insurer and not by AV Management.
                  Claims and disputes, if any, shall be settled directly with the insurer
                  and not with AV Management.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
