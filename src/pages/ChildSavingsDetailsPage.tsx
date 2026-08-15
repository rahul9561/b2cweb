import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Headphones } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import { ChildSavingsPlan } from '../data/childSavingsPlans'

interface PurchaseDetails {
  // Step 1
  name: string
  gender: 'male' | 'female'
  dateOfBirth: string
  mobile: string
  email: string
  
  // Step 2
  pincode: string
  city: string
  nationality: string
}

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']

export default function ChildSavingsDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as ChildSavingsPlan | undefined

  const [step, setStep] = useState(1)
  const [details, setDetails] = useState<PurchaseDetails>({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    mobile: '',
    email: '',
    pincode: '',
    city: '',
    nationality: 'Indian',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  if (!plan) return null

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!details.name.trim()) newErrors.name = 'Name is required'
    if (!details.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!details.mobile.trim() || details.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit mobile is required'
    if (!details.email.trim() || !details.email.includes('@')) newErrors.email = 'Valid email is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!details.pincode.trim() || details.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit pincode is required'
    if (!details.city) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      setErrors({})
    } else if (step === 2 && validateStep2()) {
      navigate('/child-savings-plans/review', {
        state: { plan, details },
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    } else {
      navigate(-1)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm">
            <Headphones size={16} />
            Expert Help
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {/* Progress Indicator */}
              <div className="flex gap-4 mb-8">
                <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`} />
              </div>

              {/* Step Indicator */}
              <h2 className="text-2xl font-bold text-navy mb-8">
                {step === 1 ? 'Your Details' : 'Address Details'}
              </h2>

              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.name ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-3">Gender</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={details.gender === 'male'}
                          onChange={(e) => setDetails({ ...details, gender: e.target.value as 'male' | 'female' })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={details.gender === 'female'}
                          onChange={(e) => setDetails({ ...details, gender: e.target.value as 'male' | 'female' })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">Female</span>
                      </label>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={details.dateOfBirth}
                      onChange={(e) => setDetails({ ...details, dateOfBirth: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.dateOfBirth ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      value={details.mobile}
                      onChange={(e) => setDetails({ ...details, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.mobile ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.email ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Address Details */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={details.pincode}
                      onChange={(e) => setDetails({ ...details, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="Enter 6-digit pincode"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.pincode ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">City *</label>
                    <select
                      value={details.city}
                      onChange={(e) => setDetails({ ...details, city: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.city ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-600'
                      }`}
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Nationality</label>
                    <input
                      type="text"
                      value={details.nationality}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                    <p className="text-xs text-slate-600 mt-1">Resident Indian</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                <button
                  onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-navy font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {step > 1 ? 'Back' : 'Cancel'}
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {step === 1 ? 'Continue' : 'Review Details'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Plan Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-navy mb-4">Plan Summary</h3>
              <div className="space-y-4">
                {/* Plan Info */}
                <div className="flex gap-3 pb-4 border-b border-slate-200">
                  <img
                    src={plan.insurerLogo}
                    alt={plan.insurer}
                    className="h-12 w-12 object-contain rounded-lg bg-slate-50"
                  />
                  <div>
                    <p className="text-xs text-slate-600">{plan.insurer}</p>
                    <p className="font-bold text-navy text-sm">{plan.planName}</p>
                  </div>
                </div>

                {/* Key Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">6 Year Returns</span>
                    <span className="font-bold text-green-600">{plan.returns6yr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maturity Payout</span>
                    <span className="font-bold text-navy">₹{(plan.maturityPayoutYou / 1000000).toFixed(1)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Life Cover</span>
                    <span className="font-bold text-navy">₹{plan.lifeCoverLac} Lac</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
