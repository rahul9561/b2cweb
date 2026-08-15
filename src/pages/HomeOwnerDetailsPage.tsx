import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Pencil } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'
import StepIndicator from '../components/home-insurance/StepIndicator'
import SummarySidebar from '../components/home-insurance/SummarySidebar'
import DisclaimerAccordion from '../components/common/DisclaimerAccordion'
import {
  defaultHomeOwner,
  defaultHomePlan,
  type HomeOwnerDetails,
  type HomePlanSelection,
} from '../data/homeInsurance'

const SALUTATIONS = ['Mr', 'Mrs', 'Ms', 'Dr']

export default function HomeOwnerDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = (location.state?.plan as HomePlanSelection | undefined) ?? defaultHomePlan
  const incomingOwner = location.state?.owner as HomeOwnerDetails | undefined

  const [owner, setOwner] = useState<HomeOwnerDetails>(incomingOwner ?? defaultHomeOwner)
  const [emailEditable, setEmailEditable] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof HomeOwnerDetails, string>>>({})

  const update = (key: keyof HomeOwnerDetails, value: string) => {
    setOwner((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof HomeOwnerDetails, string>> = {}
    if (!owner.salutation) next.salutation = 'Required'
    if (!owner.fullName.trim()) next.fullName = 'Required'
    if (!owner.dob) next.dob = 'Required'
    if (!owner.email.trim()) next.email = 'Required'
    if (!owner.pan.trim()) next.pan = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    navigate('/home-insurance/property-address', { state: { plan, owner } })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeInsuranceHeader />

      <main className="container-pb py-6">
        <button
          onClick={() => navigate('/home-insurance/plan-list')}
          className="mb-4 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Back to quotes
        </button>

        <StepIndicator currentStep={1} />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form column */}
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-navy">Home owner details</h1>
            <span className="mt-1 mb-6 block h-1 w-12 rounded bg-yellow" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Salutation */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Salutation</label>
                <select
                  value={owner.salutation}
                  onChange={(e) => update('salutation', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  <option value="">Select</option>
                  {SALUTATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.salutation && <p className="mt-1 text-[12px] text-orange-error">{errors.salutation}</p>}
              </div>

              {/* Full name */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">
                  Full name (as per PAN card for KYC)
                </label>
                <input
                  type="text"
                  value={owner.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[14px] text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                {errors.fullName && <p className="mt-1 text-[12px] text-orange-error">{errors.fullName}</p>}
              </div>

              {/* DOB — floating label */}
              <div className="relative">
                <label
                  className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                    owner.dob
                      ? '-top-2 bg-white px-1 text-[11px] font-medium text-brand'
                      : 'top-1/2 -translate-y-1/2 text-[13px] text-gray-400'
                  }`}
                >
                  Date of birth (as per PAN card for KYC)
                </label>
                <input
                  type="date"
                  value={owner.dob}
                  onChange={(e) => update('dob', e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-[14px] text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                    owner.dob ? 'border-brand' : 'border-gray-300'
                  }`}
                />
                {errors.dob && <p className="mt-1 text-[12px] text-orange-error">{errors.dob}</p>}
              </div>

              {/* Mobile — locked */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Mobile number</label>
                <input
                  type="text"
                  value={owner.mobile}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-[14px] text-slate-500"
                />
              </div>

              {/* Email — editable toggle */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-navy">Email ID</label>
                <div className="relative">
                  <input
                    type="email"
                    value={owner.email}
                    onChange={(e) => update('email', e.target.value)}
                    readOnly={!emailEditable}
                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-[14px] text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                      emailEditable ? 'border-brand bg-white' : 'border-gray-200 bg-gray-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEmailEditable((v) => !v)}
                    aria-label="Edit email"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
                {errors.email && <p className="mt-1 text-[12px] text-orange-error">{errors.email}</p>}
              </div>

              {/* PAN — floating label */}
              <div className="relative">
                <label
                  className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                    owner.pan
                      ? '-top-2 bg-white px-1 text-[11px] font-medium text-brand'
                      : 'top-1/2 -translate-y-1/2 text-[13px] text-gray-400'
                  }`}
                >
                  PAN Number
                </label>
                <input
                  type="text"
                  value={owner.pan}
                  onChange={(e) => update('pan', e.target.value.toUpperCase())}
                  maxLength={10}
                  className={`w-full rounded-lg border px-4 py-3 text-[14px] uppercase text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                    owner.pan ? 'border-brand' : 'border-gray-300'
                  }`}
                />
                {errors.pan && <p className="mt-1 text-[12px] text-orange-error">{errors.pan}</p>}
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
    </div>
  )
}
