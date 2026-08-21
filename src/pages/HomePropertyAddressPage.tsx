import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calculator, ChevronLeft, X } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import StepIndicator from '../components/home-insurance/StepIndicator'
import SummarySidebar from '../components/home-insurance/SummarySidebar'
import DisclaimerAccordion from '../components/common/DisclaimerAccordion'
import {
  defaultHomePlan,
  defaultPropertyAddress,
  type HomeOwnerDetails,
  type HomePlanSelection,
  type HomePropertyAddress,
} from '../data/homeInsurance'

const BUILDING_TYPES = ['Apartment/Flat', 'Independent House', 'Villa', 'Bungalow']

export default function HomePropertyAddressPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = (location.state?.plan as HomePlanSelection | undefined) ?? defaultHomePlan
  const owner = location.state?.owner as HomeOwnerDetails | undefined
  const incomingAddress = location.state?.address as HomePropertyAddress | undefined

  const [address, setAddress] = useState<HomePropertyAddress>(incomingAddress ?? defaultPropertyAddress)
  const [errors, setErrors] = useState<Partial<Record<keyof HomePropertyAddress, string>>>({})
  const [calcOpen, setCalcOpen] = useState(false)

  const update = <K extends keyof HomePropertyAddress>(key: K, value: HomePropertyAddress[K]) => {
    setAddress((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof HomePropertyAddress, string>> = {}
    if (!address.addressLine1.trim()) next.addressLine1 = 'Required'
    if (!address.city.trim()) next.city = 'Required'
    if (!address.pincode.trim()) next.pincode = 'Required'
    if (!address.carpetArea.trim()) next.carpetArea = 'Required'
    if (!address.buildingType) next.buildingType = 'Required'
    if (!address.yearOfConstruction.trim()) next.yearOfConstruction = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    navigate('/home-insurance/review-pay', { state: { plan, owner, address } })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="container-pb py-6">
        <button
          onClick={() => navigate('/home-insurance/owner-details', { state: { plan, owner } })}
          className="mb-4 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Back to step 1
        </button>

        <StepIndicator currentStep={2} />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form column */}
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-navy">Property address</h1>
            <span className="mt-1 mb-6 block h-1 w-12 rounded bg-yellow" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Address line 1 */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Address line 1</label>
                <input
                  type="text"
                  value={address.addressLine1}
                  onChange={(e) => update('addressLine1', e.target.value)}
                  placeholder="Flat / House no., Building"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.addressLine1 && <p className="mt-1 text-[12px] text-orange-error">{errors.addressLine1}</p>}
              </div>

              {/* Address line 2 */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Address line 2</label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => update('addressLine2', e.target.value)}
                  placeholder="Street, Locality, Landmark"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.city && <p className="mt-1 text-[12px] text-orange-error">{errors.city}</p>}
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit pincode"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.pincode && <p className="mt-1 text-[12px] text-orange-error">{errors.pincode}</p>}
              </div>

              {/* Carpet area */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Carpet Area(sqft)</label>
                <input
                  type="number"
                  value={address.carpetArea}
                  onChange={(e) => update('carpetArea', e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.carpetArea && <p className="mt-1 text-[12px] text-orange-error">{errors.carpetArea}</p>}
              </div>

              {/* Building type */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Building type</label>
                <select
                  value={address.buildingType}
                  onChange={(e) => update('buildingType', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  <option value="">Select building type</option>
                  {BUILDING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.buildingType && <p className="mt-1 text-[12px] text-orange-error">{errors.buildingType}</p>}
              </div>
            </div>

            {/* Carpet area helper */}
            <div className="mt-3 flex items-center gap-2">
              <Calculator size={16} className="text-orange-tag" />
              <span className="text-[13px] text-slate-600">Not sure about carpet area?</span>
              <button
                type="button"
                onClick={() => setCalcOpen(true)}
                className="text-[13px] font-semibold text-brand hover:underline"
              >
                Calculate here
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Year of construction */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Year of construction</label>
                <input
                  type="number"
                  value={address.yearOfConstruction}
                  onChange={(e) => update('yearOfConstruction', e.target.value)}
                  placeholder="e.g. 2015"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.yearOfConstruction && (
                  <p className="mt-1 text-[12px] text-orange-error">{errors.yearOfConstruction}</p>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={address.sameAsCommunication}
                  onChange={(e) => update('sameAsCommunication', e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand"
                />
                <span className="text-[13px] text-slate-700">
                  My communication address is same as property address.
                </span>
              </label>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={address.hasLoan}
                    onChange={(e) => update('hasLoan', e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <span className="text-[13px] text-slate-700">
                    I have a loan against my property (Bank Hypothecation)
                  </span>
                </label>
                {address.hasLoan && (
                  <div className="ml-7 mt-3 max-w-sm">
                    <input
                      type="text"
                      value={address.lenderName}
                      onChange={(e) => update('lenderName', e.target.value)}
                      placeholder="Lender / Bank name (optional)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-[13px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-8 w-full rounded-lg bg-brand py-3.5 text-[15px] font-bold tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              CONTINUE
            </button>

            <div className="mt-6">
              <DisclaimerAccordion />
            </div>
          </div>

          {/* Summary sidebar */}
          <SummarySidebar plan={plan} />
        </div>
      </main>

      {/* Carpet area calculator stub modal */}
      {calcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCalcOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-navy">Carpet Area Calculator</h3>
              <button onClick={() => setCalcOpen(false)} aria-label="Close" className="text-slate-400 hover:text-navy">
                <X size={18} />
              </button>
            </div>
            <p className="text-[13px] text-slate-600">
              Carpet area calculator coming soon. As a rule of thumb, carpet area is roughly 70% of the built-up
              area of your home.
            </p>
            <button
              onClick={() => setCalcOpen(false)}
              className="mt-5 w-full rounded-lg bg-brand py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
