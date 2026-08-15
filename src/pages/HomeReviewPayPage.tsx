import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, ChevronLeft, Home, Lock, MessageCircle } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import DisclaimerAccordion from '../components/common/DisclaimerAccordion'
import {
  cyberSecureAddon,
  defaultHomeOwner,
  defaultHomePlan,
  defaultPropertyAddress,
  formatINR,
  generateReferenceNumber,
  type HomeOwnerDetails,
  type HomePlanSelection,
  type HomePropertyAddress,
} from '../data/homeInsurance'

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function HomeReviewPayPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = (location.state?.plan as HomePlanSelection | undefined) ?? defaultHomePlan
  const owner = (location.state?.owner as HomeOwnerDetails | undefined) ?? defaultHomeOwner
  const address = (location.state?.address as HomePropertyAddress | undefined) ?? defaultPropertyAddress

  const referenceNumber = useMemo(() => generateReferenceNumber(), [])
  const [cyberAdded, setCyberAdded] = useState(false)
  const [proposalOpen, setProposalOpen] = useState(true)
  const [additionalOpen, setAdditionalOpen] = useState(false)
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)
  const [totalFlash, setTotalFlash] = useState(false)
  const [paid, setPaid] = useState(false)

  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + plan.policyTermYears)

  // Premium summary math
  const basePremium = Math.round(plan.basePremium / 1.18)
  const gst = plan.basePremium - basePremium
  const addonsTotal = plan.addons.reduce((s, a) => s + a.premium, 0)
  const total = plan.basePremium + addonsTotal + (cyberAdded ? cyberSecureAddon.premium : 0)

  const toggleCyber = () => {
    setCyberAdded((v) => !v)
    setTotalFlash(true)
    window.setTimeout(() => setTotalFlash(false), 900)
  }

  const handlePay = () => {
    setPaid(true)
  }

  const riskAddress = [address.addressLine1, address.addressLine2, address.city, address.pincode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="container-pb py-6">
        <button
          onClick={() => navigate('/home-insurance/property-address', { state: { plan, owner, address } })}
          className="mb-4 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Go back to proposal
        </button>

        <h1 className="text-[22px] font-bold text-navy">Review and pay</h1>
        <span className="mt-1 mb-6 block h-1 w-12 rounded bg-yellow" />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main column */}
          <div className="flex-1 space-y-6">
            {/* Plan Details */}
            <section>
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-navy">
                Plan Details <span className="inline-block h-0.5 w-8 rounded bg-yellow" />
              </h2>

              <div className="mt-3 rounded-lg bg-purple-50 px-4 py-2.5">
                <p className="text-[13px] font-semibold text-navy">
                  Reference Number: <span className="font-bold">{referenceNumber}</span>
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-5 flex items-center gap-3">
                  <img
                    src={plan.insurerLogo}
                    alt={plan.insurerName}
                    className="h-12 w-12 rounded-full border border-gray-100 bg-slate-50 object-contain"
                  />
                  <div>
                    <p className="text-[15px] font-bold text-navy">{plan.planName}</p>
                    <p className="text-[12px] text-slate-500">{plan.insurerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <DetailItem label="Building Sum Insured" value={formatINR(plan.buildingSumInsured)} />
                  <DetailItem label="Household Items Sum Insured" value={formatINR(plan.householdSumInsured)} />
                  <DetailItem label="Policy Start Date" value={formatDate(startDate)} />
                  <DetailItem label="Policy End Date" value={formatDate(endDate)} />
                  <DetailItem label="Policy Period" value={`${plan.policyTermYears} Years`} />
                </div>
              </div>
            </section>

            {/* Add-ons */}
            <section>
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-navy">
                Enhance your coverage with these add-ons <span className="inline-block h-0.5 w-8 rounded bg-yellow" />
              </h2>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={cyberSecureAddon.insurerLogo}
                    alt={cyberSecureAddon.insurer}
                    className="h-14 w-14 rounded-full border border-gray-100 bg-slate-50 object-contain"
                  />
                  <div className="min-w-[180px] flex-1">
                    <p className="text-[12px] text-slate-500">{cyberSecureAddon.insurer}</p>
                    <p className="text-[15px] font-bold text-navy">{cyberSecureAddon.productTitle}</p>
                    <button type="button" className="mt-0.5 text-[12px] font-semibold text-brand hover:underline">
                      See what is covered ›
                    </button>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Cover</p>
                    <p className="text-[14px] font-bold text-navy">{formatINR(cyberSecureAddon.cover)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Premium (1 year)</p>
                    <p className="text-[14px] font-bold text-navy">{formatINR(cyberSecureAddon.premium)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleCyber}
                    className={`flex items-center gap-1.5 rounded-lg border px-5 py-2 text-[13px] font-bold transition-all duration-300 ${
                      cyberAdded
                        ? 'border-green-cta bg-green-cta text-white'
                        : 'border-brand text-brand hover:bg-brand hover:text-white'
                    }`}
                  >
                    {cyberAdded ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Added
                      </>
                    ) : (
                      '+ Add'
                    )}
                  </button>
                </div>
                <p className="mt-4 border-t border-gray-100 pt-3 text-[12px] text-slate-500">
                  Person Covered: Primary Owner ({owner.fullName})
                </p>
              </div>
            </section>

            {/* Proposal Details */}
            <section>
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-navy">
                Proposal Details <span className="inline-block h-0.5 w-8 rounded bg-yellow" />
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setProposalOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-bold text-navy">
                    {owner.salutation} {owner.fullName}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${proposalOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    proposalOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 px-5 py-4 sm:grid-cols-4">
                      <DetailItem label="Email" value={owner.email} />
                      <DetailItem label="Mobile Number" value={owner.mobile} />
                      <DetailItem label="DOB" value={owner.dob || '-'} />
                      <DetailItem label="Risk Address" value={riskAddress || '-'} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Details */}
            <section>
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-navy">
                Additional Details <span className="inline-block h-0.5 w-8 rounded bg-yellow" />
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setAdditionalOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-bold text-navy">Additional Details</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${additionalOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    additionalOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 px-5 py-4 sm:grid-cols-3">
                      <DetailItem label="PAN Number" value={owner.pan || '-'} />
                      <DetailItem label="Carpet Area" value={address.carpetArea ? `${address.carpetArea} sqft` : '-'} />
                      <DetailItem label="Building Type" value={address.buildingType || '-'} />
                      <DetailItem label="Year of Construction" value={address.yearOfConstruction || '-'} />
                      <DetailItem
                        label="Bank Hypothecation"
                        value={address.hasLoan ? address.lenderName || 'Yes' : 'No'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Info banner */}
            <div className="rounded-lg border border-blue-200 bg-blueBG px-4 py-3">
              <p className="text-[13px] text-navy">
                Your <strong>{plan.insurerShortCode}</strong> policy will start after 3 days of successful payment and
                KYC verification.
              </p>
            </div>

            <DisclaimerAccordion />
          </div>

          {/* Premium Summary sidebar */}
          <div className="w-full lg:w-[340px]">
            <aside className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-card">
              <h3 className="mb-4 text-[16px] font-bold text-navy">Premium Summary</h3>

              <div className="flex items-center justify-between py-1">
                <span className="text-[13px] text-slate-600">Premium</span>
                <span className="text-[13px] font-semibold text-navy">{formatINR(basePremium)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[13px] text-slate-600">GST</span>
                <span className="text-[13px] font-semibold text-navy">{formatINR(gst)}</span>
              </div>

              <div className="my-3 border-t border-dashed border-gray-300" />

              {plan.addons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between py-1">
                  <span className="text-[13px] text-slate-600">
                    {addon.insurer} {addon.name} (Incl. GST)
                  </span>
                  <span className="text-[13px] font-semibold text-navy">{formatINR(addon.premium)}</span>
                </div>
              ))}
              {cyberAdded && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-[13px] text-slate-600">Zurich Kotak Cyber Secure (1 Year)</span>
                  <span className="text-[13px] font-semibold text-navy">{formatINR(cyberSecureAddon.premium)}</span>
                </div>
              )}

              <div className="my-3 border-t border-dashed border-gray-300" />

              <div
                className={`rounded-lg px-2 py-2 transition-colors duration-500 ${
                  totalFlash ? 'bg-yellow/30' : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-navy">TOTAL PREMIUM</span>
                  <span className="text-[18px] font-bold text-navy">{formatINR(total)}/-</span>
                </div>
                <p className="mt-0.5 text-right text-[10px] font-medium tracking-wide text-slate-400">
                  INCLUSIVE OF ALL TAXES
                </p>
              </div>

              <button
                onClick={handlePay}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
              >
                <Lock size={15} /> Pay securely
              </button>

              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                By clicking on "Pay securely", I agree that my house is PUCCA (Brick and mortar), that I don't have
                any claim history and I have filled out the form personally.
              </p>

              <label className="mt-4 flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="h-4 w-4 accent-green-cta"
                />
                <span className="text-[13px] text-slate-600">Get updates on</span>
                <span className="flex items-center gap-1 font-semibold text-green-cta">
                  <MessageCircle size={14} /> Whatsapp
                </span>
              </label>

              {/* Decorative house outline */}
              <div className="pointer-events-none mt-4 flex justify-center opacity-10">
                <Home size={120} strokeWidth={0.8} className="text-navy" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Payment confirmation stub */}
      {paid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPaid(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Check size={28} className="text-green-cta" strokeWidth={3} />
            </div>
            <h3 className="text-[18px] font-bold text-navy">Payment Initiated</h3>
            <p className="mt-2 text-[13px] text-slate-600">
              Reference Number: <strong>{referenceNumber}</strong>
            </p>
            <p className="mt-1 text-[13px] text-slate-600">
              This is a stub payment flow. Your {plan.insurerShortCode} policy will start after 3 days of successful
              payment and KYC verification.
            </p>
            <button
              onClick={() => setPaid(false)}
              className="mt-6 w-full rounded-lg bg-brand py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 break-words text-[13px] font-bold text-navy">{value}</p>
    </div>
  )
}
