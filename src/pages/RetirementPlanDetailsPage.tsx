import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { RetirementPlan } from '../data/retirementPlans'

interface PurchaseDetails {
  name: string
  gender: 'male' | 'female'
  dateOfBirth: string
  mobile: string
  email: string
  pincode: string
  city: string
  nationality: string
}

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']

export default function RetirementPlanDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as RetirementPlan | undefined

  const [currentStep, setCurrentStep] = useState(1)
  const [details, setDetails] = useState<PurchaseDetails>({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    mobile: '',
    email: '',
    pincode: '',
    city: '',
    nationality: 'Resident Indian',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">Plan not found</p>
      </div>
    )
  }

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!details.name.trim()) newErrors.name = 'Name is required'
    if (!details.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!details.mobile.trim() || details.mobile.length !== 10 || !/^\d{10}$/.test(details.mobile)) {
      newErrors.mobile = 'Valid 10-digit mobile is required'
    }
    if (!details.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      newErrors.email = 'Valid email is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!details.pincode.trim() || details.pincode.length !== 6 || !/^\d{6}$/.test(details.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode is required'
    }
    if (!details.city) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
        setErrors({})
      }
    } else {
      if (validateStep2()) {
        navigate('/retirement-plans/review', { state: { plan, details } })
      }
    }
  }

  const handleMobileInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10)
    setDetails({ ...details, mobile: cleaned })
  }

  const handlePincodeInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6)
    setDetails({ ...details, pincode: cleaned })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Black Header */}
      <div className="sticky top-0 z-50 bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex-1 text-center">
            <img src="/av-logo.svg" alt="AV Management" className="h-6 mx-auto" />
          </div>
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Expert Help
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 items-center">
            {[1, 2].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-1 rounded-full transition-all ${step <= currentStep ? 'bg-blue-600' : 'bg-slate-300'}`} />
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-600 mt-2 font-semibold">
            Step {currentStep} of 2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            {currentStep === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy">Your Details</h2>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">Gender *</label>
                  <div className="flex gap-4">
                    {['male', 'female'].map((g) => (
                      <label key={g} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={details.gender === g}
                          onChange={() => setDetails({ ...details, gender: g as 'male' | 'female' })}
                          className="w-4 h-4"
                        />
                        <span className="font-semibold text-slate-700 capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={details.dateOfBirth}
                    onChange={(e) => setDetails({ ...details, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    value={details.mobile}
                    onChange={(e) => handleMobileInput(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.mobile ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy">Address Details</h2>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={details.pincode}
                    onChange={(e) => handlePincodeInput(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.pincode ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Please enter the pincode of your current residential address"
                  />
                  {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">City *</label>
                  <select
                    value={details.city}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium ${
                      errors.city ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Please select the city of your current residential address</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                </div>

                {/* Residential Status */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Residential Status</label>
                  <input
                    type="text"
                    value={details.nationality}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-medium bg-slate-100 text-slate-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Plan Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <img src={plan.insurerLogo} alt={plan.insurer} className="h-10 w-10 rounded mb-3 bg-slate-100 p-1" />
              <p className="text-xs text-slate-600 font-semibold mb-1">{plan.insurer}</p>
              <p className="font-bold text-navy mb-4">{plan.planName}</p>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-xs text-slate-600 font-semibold">7-Year Returns</p>
                  <p className="text-lg font-bold text-green-600">{plan.returns7yr}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Maturity Amount</p>
                  <p className="text-lg font-bold text-navy">₹{plan.maturityPayoutYou}L</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Life Cover</p>
                  <p className="text-lg font-bold text-blue-600">₹{plan.lifeCoverLac}L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => (currentStep === 1 ? navigate(-1) : setCurrentStep(1))}
            className="flex items-center gap-2 px-6 py-3 font-bold text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft size={20} />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            {currentStep === 1 ? 'Next' : 'Review Details'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
