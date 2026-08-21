import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import StepIndicator from '../components/home-insurance/StepIndicator'
import SummarySidebar from '../components/home-insurance/SummarySidebar'
import { defaultPropertyAddress } from '../data/homeInsurance'

export default function PropertyAddressPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    plan?: any
    leadData?: any
    ownerDetails?: any
  } | null

  const plan = state?.plan
  const leadData = state?.leadData
  const ownerDetails = state?.ownerDetails

  const [addressLine1, setAddressLine1] = useState(defaultPropertyAddress.addressLine1)
  const [addressLine2, setAddressLine2] = useState(defaultPropertyAddress.addressLine2)
  const [city, setCity] = useState(leadData?.city || defaultPropertyAddress.city)
  const [pincode, setPincode] = useState(defaultPropertyAddress.pincode)
  const [carpetArea, setCarpetArea] = useState(defaultPropertyAddress.carpetArea)
  const [buildingType, setBuildingType] = useState(defaultPropertyAddress.buildingType)
  const [yearOfConstruction, setYearOfConstruction] = useState(defaultPropertyAddress.yearOfConstruction)
  const [sameAsCommunication, setSameAsCommunication] = useState(true)
  const [hasLoan, setHasLoan] = useState(false)
  const [lenderName, setLenderName] = useState('')

  const handleContinue = () => {
    if (!addressLine1 || !city || !pincode || !carpetArea || !buildingType || !yearOfConstruction) {
      alert('Please fill all required fields')
      return
    }

    navigate('/home-insurance/review-pay', {
      state: {
        plan,
        leadData,
        ownerDetails,
        propertyAddress: {
          addressLine1,
          addressLine2,
          city,
          pincode,
          carpetArea,
          buildingType,
          yearOfConstruction,
          sameAsCommunication,
          hasLoan,
          lenderName,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Back link */}
        <button
          onClick={() =>
            navigate('/home-insurance/owner-details', {
              state: {
                plan,
                leadData,
              },
            })
          }
          className="mb-6 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Back to step 1
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Form Column */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <StepIndicator currentStep={2} />

            {/* Heading */}
            <h1 className="mb-6 text-[24px] font-bold text-navy border-b-4 border-yellow-400 pb-3 inline-block">
              Property address
            </h1>

            {/* Form */}
            <form className="space-y-5">
              {/* Address Lines */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Address line 1
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    placeholder="Enter address line 1"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Address line 2
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    placeholder="Enter address line 2"
                  />
                </div>
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Carpet Area and Building Type */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Carpet Area(sqft)
                  </label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-600">
                    <span>🧮</span>
                    <span>Not sure about carpet area?</span>
                    <button type="button" className="text-brand font-semibold hover:underline">
                      Calculate here
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">
                    Building type
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="">Select building type</option>
                    <option>Apartment/Flat</option>
                    <option>Independent House</option>
                    <option>Villa</option>
                    <option>Bungalow</option>
                  </select>
                </div>
              </div>

              {/* Year of Construction */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Year of construction
                </label>
                <input
                  type="number"
                  value={yearOfConstruction}
                  onChange={(e) => setYearOfConstruction(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="e.g., 2021"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsCommunication}
                    onChange={(e) => setSameAsCommunication(e.target.checked)}
                    className="w-5 h-5 accent-brand"
                  />
                  <span className="text-[13px] text-slate-700">
                    My communication address is same as property address.
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLoan}
                    onChange={(e) => setHasLoan(e.target.checked)}
                    className="w-5 h-5 accent-brand"
                  />
                  <span className="text-[13px] text-slate-700">
                    I have a loan against my property (Bank Hypothecation)
                  </span>
                </label>
                {hasLoan && (
                  <div className="ml-8">
                    <input
                      type="text"
                      value={lenderName}
                      onChange={(e) => setLenderName(e.target.value)}
                      placeholder="Enter lender name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-lg bg-brand py-3 text-[14px] font-bold text-white hover:bg-brand-dark transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </form>

            {/* Disclaimer */}
            <Disclaimer />
          </div>

          {/* Right: Summary Sidebar */}
          {plan && <SummarySidebar plan={plan} />}
        </div>
      </main>
    </div>
  )
}

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
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
            <strong>AV Management Insurance Brokers Private Limited</strong> | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001
          </p>
          <p>
            <a href="#" className="text-brand hover:underline">Contact Us</a> | <a href="#" className="text-brand hover:underline">Legal and Admin Policies</a>
          </p>
          <p>
            AV Management is an insurance services platform. Visitors are hereby informed that information submitted on the website may be shared with insurers and third-party administrators for service fulfilment.
          </p>
          <p>
            <strong>*Disclaimer:</strong> We, at AV Management, are committed to offering unbiased product comparison and neutral editorial content. Our partnership with various insurers does not impact our editorial content or product comparisons.
          </p>
          <p>
            <strong>KYC:</strong> Know Your Customer norms are mandatory for all insurance transactions to prevent financial fraud.
          </p>
          <p className="italic text-slate-500">
            Sample premium rates (Annual): Single Coverage starting from ₹2,500 | With Add-ons starting from ₹3,500
          </p>
        </div>
      )}
    </div>
  )
}
