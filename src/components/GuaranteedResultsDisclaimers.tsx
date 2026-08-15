import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DisclaimersProps {
  currentYear?: number
  startYear?: number
}

export default function GuaranteedResultsDisclaimers({ 
  currentYear = new Date().getFullYear(),
  startYear = 2016
}: DisclaimersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      {/* Header — collapsible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-100 transition-colors"
      >
        <h3 className="text-sm font-bold text-navy">Disclaimers</h3>
        <ChevronDown
          size={20}
          className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-4 bg-white">
          <div className="text-xs leading-relaxed text-slate-600 space-y-3">
            {/* Tax Benefits */}
            <p>
              <span className="font-semibold text-slate-700">Tax Benefits:</span> All tax benefits and savings are subject to changes in applicable tax laws and regulations. Please consult with a tax professional for your specific tax situation.
            </p>

            {/* Premium Tax */}
            <p>
              <span className="font-semibold text-slate-700">Premium Taxation:</span> Traditional investment plans with premiums exceeding ₹5 lakh are subject to taxation as per applicable tax slabs after the specified cutoff date. Refer to the policy documents for detailed information.
            </p>

            {/* Guaranteed Returns */}
            <p>
              <span className="font-semibold text-slate-700">Guaranteed Returns:</span> Guaranteed returns depend on the policy term, premium payment term, and other variable factors. All figures are illustrative and based on the example of an 18-year-old healthy male, with assumptions regarding policy term and annual premium. All plans are funded and backed by the respective insurance companies as per regulatory guidelines.
            </p>

            {/* Terms & Conditions */}
            <p>
              <span className="font-semibold text-slate-700">Terms & Conditions:</span> Standard terms and conditions apply to all plans. Please refer to the official sales brochure for complete details on risk factors, coverage limits, exclusions, and other important conditions before making a purchase decision.
            </p>

            {/* IRDAI Approval */}
            <p>
              <span className="font-semibold text-slate-700">Regulatory Approval:</span> All insurance plans offered are approved by the Insurance Regulatory and Development Authority of India (IRDAI). Standard terms and conditions as per regulatory norms apply.
            </p>

            {/* Plan Comparison */}
            <p>
              <span className="font-semibold text-slate-700">Plan Comparison:</span> For the same premium amount, benefits may differ across plans, or for the same benefit, premiums may vary based on plan structure, insurer pricing, and individual risk assessment.
            </p>

            {/* Company Details */}
            <p className="text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-700">AV Management Details:</span> CIN: U74999DL2014PTC278530 | Registered Office: 123 Business Park, New Delhi, India | License No: 121 | Your submitted information may be shared with insurance companies and service partners for processing and servicing your policy.
            </p>

            {/* Copyright */}
            <p className="text-[10px] text-slate-500 border-t border-slate-200 pt-3 mt-3">
              © {startYear}-{currentYear} AV Management. All Rights Reserved.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
