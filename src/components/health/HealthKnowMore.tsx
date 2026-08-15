import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  {
    title: 'Health Insurance',
    content: `Health insurance takes care of your medical expenses and ensures that out-of-pocket expenses are curtailed up to the Sum insured.

A health insurance policy ensures that you can avail cashless treatment at a network hospital, typically covering 30 days and 60 days pre and post hospitalization, respectively, in most of the Health Insurance plans.

One can add value to the Base Health Insurance Plan by complementing them with additional benefits such as Personal Accident (PA) Cover, Critical Illness (CI) Cover, etc. These products are available at a very nominal cost adding benefits, which are not a part of the Base Health Insurance plan. For Example, A PA plan helps by providing coverage for disability, which is typically not covered under the basic health insurance plan. An individual needs not go through any waiting period and medical checkups for a PA cover.

One can also invest on one of the popular senior citizen health insurance policies and ensure comprehensive security for their elderly parents or secure their old age that often brings along several ailments that require expensive medical treatment.

Almost all the health insurance plans include Coronavirus treatment cover. As per the IRDAI guidelines, insurers have also launched COVID-19 specific best health insurance.

Two special COVID health insurance policies namely, Corona Rakshak policy and Corona Kavach policy also introduced that provide lump sum payment upon diagnosis and also pay for the cost of consumable items like PPE Kits, Masks, Gloves, etc.`,
  },
  {
    title: 'Benefits of Health Insurance Health Coverage',
    content: `Health Insurance plans have enhanced offerings to cover a wide spectrum of requirements, like a family health plan offers complete cover to all members of a family under a single umbrella.

• Medical Bills: Coverage against medicinal expenses incurred, including pre and post hospitalization.

• Pre-existing Diseases: Coverage for any pre-existing disease is provided to you after a certain waiting period.

• Claim Reimbursement: Coverage for expenses incurred for hospitalization due to a medical.

• Tax Rebate: Annual premium paid for health coverage are subject to tax exemption u/s 80D of ITA, 1961. Tax exemption ranges from Rs. 25,000 to Rs. 75,000. Tax benefits are subject to changes in tax laws.

• Other Benefits: As an innovative feature, OPD expenses are now covered under few Insurer plans and don't require hospitalization for minimum 24 hours for claim reimbursement. Standalone OPD plans are also available in the market.`,
  },
  {
    title: 'Key Points to Remember when Comparing Health Insurance',
    content: `• Sum Insured Amount: The maximum amount the insurer will pay for covered medical expenses during the policy term.

• Policy premium to be paid to avail the coverage benefits: The cost you pay定期 for the insurance coverage, which varies based on age, sum insured, and other factors.

• List of network hospitals and Claim Settlement Ratio: Check the hospitals near you that offer cashless treatment and how efficiently the insurer settles claims.

• Sub-limits (if any) and Waiting Period (for PEDs): Be aware of any caps on specific treatments and the waiting period for pre-existing diseases.

• Co-payment clause: Some policies require you to pay a percentage of the claim amount. Understand this before choosing a plan.`,
  },
]

export default function HealthKnowMore() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-lg font-bold text-navy">
          Know More about Health Insurance
        </h2>

        <div className="space-y-3">
          {SECTIONS.map((section, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left transition-colors hover:bg-gray-100"
              >
                <span className="text-sm font-semibold text-navy">
                  {section.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-3">
                      {section.content.split('\n\n').map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="mb-3 text-[13px] leading-relaxed text-gray-600 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
