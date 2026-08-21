import { useState } from 'react'

export default function DisclaimerAccordion() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-4">
      <div 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span>
          <strong className="text-sm text-navy">Disclaimer*</strong>
        </span>
        <svg 
          width={16} 
          height={16} 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={`transition-transform ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`} 
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-blue-600">AV Management Insurance Brokers Private Limited | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001</p>
            <p className="text-gray-500 mt-2">
              Registered as Insurance Broker with IRDAI. Visit www.irdai.gov.in for verified information. Visitor information shared with insurers for quote purposes. Product information sourced from insurers. Insurance is the subject matter of solicitation.
            </p>
            <p className="text-bold mt-3">
              <strong>Disclaimer:</strong> STANDARD TERMS AND CONDITIONS APPLY. For more details on risk factors, terms and conditions, please read the sales brochure carefully before concluding a sale.
            </p>
            <p className="text-gray-500 mt-2">
              As per New IRDAI Guidelines, KYC Verification is now Mandatory for Buying Policy.
            </p>
            <p className="mt-4 text-sm">
              <strong>The premium of Rs 500/month is for a pucca building with sum insured of Rs 75 lakh structure at selected locations, for property age less than 30 years and policy term of 20 years. Additional premium is payable for the optional covers including contents opted.</strong>
            </p>
            <p className="mt-2 text-sm">
              <strong>The premium of Rs 850/month is for a pucca building with sum insured of Rs 1 crore structure at selected locations, for property age less than 25 years and policy term of 15 years. Additional premium is payable for the optional covers including contents opted.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}