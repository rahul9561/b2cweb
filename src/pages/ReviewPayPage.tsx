import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import { cyberSecureAddon, formatINR, generateReferenceNumber } from '../data/homeInsurance'

export default function ReviewPayPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    plan?: any
    leadData?: any
    ownerDetails?: any
    propertyAddress?: any
  } | null

  const plan = state?.plan
  const leadData = state?.leadData
  const ownerDetails = state?.ownerDetails
  const propertyAddress = state?.propertyAddress

  const [expandedProposalDetails, setExpandedProposalDetails] = useState(false)
  const [expandedAdditionalDetails, setExpandedAdditionalDetails] = useState(false)
  const [cyberSecureAdded, setCyberSecureAdded] = useState(false)

  const referenceNumber = generateReferenceNumber()
  const policyStartDate = new Date().toISOString().split('T')[0]
  const policyEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + plan?.policyTermYears || 1))
    .toISOString()
    .split('T')[0]

  // Calculate premium
  const basePremium = plan?.basePremium || 0
  const gst = Math.round(basePremium * 0.18)
  const cyberSecureTotal = cyberSecureAdded ? cyberSecureAddon.premium + Math.round(cyberSecureAddon.premium * 0.18) : 0
  const totalPremium = basePremium + gst + cyberSecureTotal

  const handlePaySecurely = () => {
    alert('Payment flow would proceed here')
    navigate('/home-insurance/building-value')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Back link */}
        <button
          onClick={() =>
            navigate('/home-insurance/property-address', {
              state: {
                plan,
                leadData,
                ownerDetails,
              },
            })
          }
          className="mb-6 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Go back to proposal
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heading */}
            <h1 className="text-[28px] font-bold text-navy">Review and pay</h1>

            {/* Plan Details Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-[16px] font-bold text-navy border-b-2 border-slate-300 pb-3">
                Plan Details —
              </h2>

              {/* Reference Number Bar */}
              <div className="mb-4 rounded-lg bg-purple-50 border border-purple-200 p-4">
                <p className="text-[13px] font-semibold text-navy">
                  Reference Number: <span className="font-bold">{referenceNumber}</span>
                </p>
              </div>

              {/* Plan Summary Card */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-4">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={plan?.insurerLogo}
                    alt={plan?.insurerName}
                    className="h-12 w-12 rounded-full object-contain"
                  />
                  <div>
                    <h3 className="text-[15px] font-bold text-navy">{plan?.planName}</h3>
                    <p className="text-[13px] text-slate-600">{plan?.insurerName}</p>
                  </div>
                </div>

                {/* Plan Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-slate-600">Building Sum Insured</span>
                    <p className="font-bold text-navy">{formatINR(plan?.buildingSumInsured)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Household Items Sum Insured</span>
                    <p className="font-bold text-navy">{formatINR(plan?.householdSumInsured)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Policy Start Date</span>
                    <p className="font-bold text-navy">{policyStartDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Policy End Date</span>
                    <p className="font-bold text-navy">{policyEndDate}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">Policy Period</span>
                    <p className="font-bold text-navy">{plan?.policyTermYears} Years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhance Coverage Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-[16px] font-bold text-navy">Enhance your coverage with these add-ons —</h3>

              {/* Cyber Secure Add-on Card */}
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    🛡️
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-slate-700">{cyberSecureAddon.insurer}</p>
                    <h4 className="text-[14px] font-bold text-navy mb-2">{cyberSecureAddon.productTitle}</h4>
                    <a href="#" className="text-[12px] font-semibold text-brand hover:underline">
                      See what is covered ›
                    </a>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-[11px] text-slate-600">Cover</p>
                      <p className="text-[13px] font-bold text-navy">{formatINR(cyberSecureAddon.cover)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-600">Premium (1 year)</p>
                      <p className="text-[13px] font-bold text-navy">{formatINR(cyberSecureAddon.premium)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCyberSecureAdded(!cyberSecureAdded)}
                    className={`h-10 px-4 rounded-lg font-semibold text-[12px] transition-colors ${
                      cyberSecureAdded
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {cyberSecureAdded ? '✓ Added' : '+ Add'}
                  </button>
                </div>
                <p className="text-[12px] text-slate-600 mt-3">
                  Person Covered: {cyberSecureAddon.personCovered}
                </p>
              </div>
            </div>

            {/* Proposal Details Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={() => setExpandedProposalDetails(!expandedProposalDetails)}
                className="w-full flex items-center justify-between py-3 text-[15px] font-bold text-navy hover:bg-slate-50 rounded"
              >
                Proposal Details —
                {expandedProposalDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedProposalDetails && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <button className="w-full text-left p-3 hover:bg-slate-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-navy">
                        {ownerDetails?.salutation} {ownerDetails?.fullName}
                      </span>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-[12px]">
                    <div>
                      <p className="text-slate-600">Email</p>
                      <p className="font-semibold text-navy">{ownerDetails?.email?.substring(0, 5)}***</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Mobile Number</p>
                      <p className="font-semibold text-navy">{leadData?.mobile}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">DOB</p>
                      <p className="font-semibold text-navy">{ownerDetails?.dob}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Risk Address</p>
                      <p className="font-semibold text-navy">{propertyAddress?.addressLine1}, {propertyAddress?.city}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={() => setExpandedAdditionalDetails(!expandedAdditionalDetails)}
                className="w-full flex items-center justify-between py-3 text-[15px] font-bold text-navy hover:bg-slate-50 rounded"
              >
                Additional Details —
                {expandedAdditionalDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedAdditionalDetails && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="space-y-3 text-[13px] text-slate-700">
                    <p>Carpet Area: {propertyAddress?.carpetArea} sqft</p>
                    <p>Building Type: {propertyAddress?.buildingType}</p>
                    <p>Year of Construction: {propertyAddress?.yearOfConstruction}</p>
                    {propertyAddress?.hasLoan && (
                      <p>Loan Against Property: {propertyAddress?.lenderName}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Info Banner */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-[13px] text-slate-700">
                Your <span className="font-bold">{plan?.insurerShortCode}</span> policy will start after 3 days of
                successful payment and KYC verification.
              </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />
          </div>

          {/* Right Sidebar - Premium Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-[15px] font-bold text-navy">Premium Summary</h3>

              {/* Premium Row */}
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-600">Premium</span>
                <span className="font-semibold text-navy">{formatINR(basePremium)}</span>
              </div>

              {/* GST Row */}
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-600">GST</span>
                <span className="font-semibold text-navy">{formatINR(gst)}</span>
              </div>

              {/* Cyber Secure Row (if added) */}
              {cyberSecureAdded && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-600">
                    {cyberSecureAddon.insurer} {cyberSecureAddon.productTitle} (1 Year) (Incl. GST)
                  </span>
                  <span className="font-semibold text-navy">{formatINR(cyberSecureTotal)}</span>
                </div>
              )}

              <div className="border-t border-slate-200" />

              {/* Total Premium */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-navy">TOTAL PREMIUM</span>
                <div className="text-right">
                  <p className="text-[18px] font-bold text-navy">{formatINR(totalPremium)}/-</p>
                  <p className="text-[10px] text-slate-500">INCLUSIVE OF ALL TAXES</p>
                </div>
              </div>

              {/* Pay Securely Button */}
              <button
                onClick={handlePaySecurely}
                className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
              >
                <Lock size={18} />
                Pay securely
              </button>

              {/* Legal Text */}
              <p className="text-[11px] text-slate-600 text-center">
                By clicking on "Pay securely", I agree that my house is PUCCA (Brick and mortar), that I don't
                have any claim history and I have filled out the form personally.
              </p>

              {/* WhatsApp Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer mt-4 pt-4 border-t border-slate-200">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand" />
                <span className="text-[12px] text-slate-700">Get updates on</span>
                <span className="text-[12px] font-semibold text-green-600">💬 Whatsapp</span>
              </label>

              {/* Decorative House Illustration */}
              <div className="mt-6 h-32 flex items-center justify-center opacity-20">
                <div className="text-5xl">🏠</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-[13px] font-bold text-slate-800 hover:bg-slate-50"
      >
        Disclaimer*
        {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-4 text-[12px] text-slate-600 space-y-3">
          <p>
            <strong>AV Management Insurance Brokers Private Limited</strong> | CIN: U74999HR2014PTC053454 |
            Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001
          </p>
          <p>
            <a href="#" className="text-brand hover:underline">
              Contact Us
            </a>{' '}
            |{' '}
            <a href="#" className="text-brand hover:underline">
              Legal and Admin Policies
            </a>
          </p>
          <p>
            Policybazaar is a registered Insurance Broker | Registration No. 742, Registration Code No. IRDA/ DB
            797/ 19, Valid till 09/06/2027, License category- Composite Broker | Visitors are hereby informed that
            information submitted on the website may be shared with insurers and third-party administrators.
          </p>
          <p>
            <strong>*Disclaimer:</strong> We, at AV Management, are committed to offering unbiased product
            comparison and neutral editorial content. Our partnership with various insurers does not impact our
            editorial content or product comparisons.
          </p>
          <p>
            <strong>KYC:</strong> Know Your Customer norms are mandatory for all insurance transactions to prevent
            financial fraud.
          </p>
          <p className="italic text-slate-500">
            Sample premium rates (Annual): Single Coverage starting from ₹2,500 | With Add-ons starting from ₹3,500
          </p>
        </div>
      )}
    </div>
  )
}
