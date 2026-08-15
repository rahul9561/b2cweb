import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import HomeInsuranceHeader from '../components/home-insurance/Header'

// Quick select pill values
const QUICK_SELECT_VALUES = [
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹75 L', value: 7500000 },
  { label: '₹50 L', value: 5000000 },
  { label: '₹40 L', value: 4000000 },
]

// Utility to format numbers with Indian numbering system
const formatIndianNumber = (num: number): string => {
  return num.toLocaleString('en-IN')
}

// Utility to parse formatted number back to integer
const parseIndianNumber = (str: string): number => {
  return parseInt(str.replace(/,/g, ''), 10) || 0
}

// Utility to convert number to crore/lakh label
const formatToCreoresOrLakhs = (num: number): string => {
  const inCrores = num / 10000000 // 1 crore = 1,00,00,000
  if (inCrores >= 1) {
    const formatted = inCrores.toFixed(1)
    return `${formatted} crore${inCrores.toFixed(1) !== '1.0' ? 's' : ''}`
  }
  
  const inLakhs = num / 100000 // 1 lakh = 1,00,000
  const formatted = inLakhs.toFixed(1)
  return `${formatted} lakhs`
}

export default function BuildingValuePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const leadData = (location.state ?? {}) as {
    fullName?: string
    mobile?: string
    protectHome?: boolean
    protectFamily?: boolean
    forBankLoan?: boolean
    whatsappUpdates?: boolean
  }

  // State for building value
  const [buildingValue, setBuildingValue] = useState<string>('')

  // State for household items
  const [householdItems, setHouseholdItems] = useState<string>('')
  const [hasManuallyEditedHouseholdItems, setHasManuallyEditedHouseholdItems] = useState(false)

  // State for property location
  const [propertyLocation, setPropertyLocation] = useState<string>('')

  // State for disclaimer
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  const getSuggestedHouseholdValue = (buildingValueNumber: number): string => {
    if (!buildingValueNumber) return ''
    const suggestedValue = Math.round(buildingValueNumber * 0.1)
    return formatIndianNumber(suggestedValue)
  }

  // Format building value input - keeps only numbers
  const handleBuildingValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Remove all non-digits
    value = value.replace(/\D/g, '')
    // Format with Indian number system
    if (value) {
      const formattedValue = formatIndianNumber(parseInt(value, 10))
      setBuildingValue(formattedValue)
      if (!hasManuallyEditedHouseholdItems) {
        setHouseholdItems(getSuggestedHouseholdValue(parseInt(value, 10)))
      }
    } else {
      setBuildingValue('')
      if (!hasManuallyEditedHouseholdItems) {
        setHouseholdItems('')
      }
    }
  }

  // Format household items input
  const handleHouseholdItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasManuallyEditedHouseholdItems(true)
    let value = e.target.value
    // Remove all non-digits
    value = value.replace(/\D/g, '')
    // Format with Indian number system
    if (value) {
      setHouseholdItems(formatIndianNumber(parseInt(value, 10)))
    } else {
      setHouseholdItems('')
    }
  }

  // Quick select handler
  const handleQuickSelect = (value: number) => {
    const formattedValue = formatIndianNumber(value)
    setBuildingValue(formattedValue)
    if (!hasManuallyEditedHouseholdItems) {
      setHouseholdItems(getSuggestedHouseholdValue(value))
    }
  }

  // Get pill label for building value
  const getBuildingValuePill = (): string | null => {
    if (!buildingValue) return null
    const num = parseIndianNumber(buildingValue)
    return formatToCreoresOrLakhs(num)
  }

  // Get pill label for household items
  const getHouseholdItemsPill = (): string | null => {
    if (!householdItems) return null
    const num = parseIndianNumber(householdItems)
    return formatToCreoresOrLakhs(num)
  }

  // Validate and navigate to plans page
  const handleNavigateToPlans = () => {
    if (!buildingValue || !householdItems) {
      alert('Please fill in both building value and household items value')
      return
    }

    // Navigate to plan list page with the lead metadata preserved for later steps
    navigate('/home-insurance/plan-list', {
      state: {
        ...leadData,
        fullName: leadData.fullName ?? '',
        mobile: leadData.mobile ?? '',
        protectHome: leadData.protectHome ?? true,
        protectFamily: leadData.protectFamily ?? true,
        forBankLoan: leadData.forBankLoan ?? false,
        whatsappUpdates: leadData.whatsappUpdates ?? true,
        buildingValue: parseIndianNumber(buildingValue),
        householdItems: parseIndianNumber(householdItems),
        propertyLocation: propertyLocation,
      },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HomeInsuranceHeader />
      
      <main className="pt-8 pb-16">
        <div className="container-pb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left column - Illustration (hidden on mobile) */}
            <div className="hidden lg:flex lg:col-span-1 items-start justify-center">
              <div className="relative w-full h-96">
                {/* Decorative purple blob background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 opacity-40 blur-2xl"></div>
                
                {/* Dotted grid pattern background */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="currentColor" className="text-gray-400" />
                    </pattern>
                  </defs>
                  <rect width="200" height="200" fill="url(#grid)" />
                </svg>

                {/* Person illustration (using SVG) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 300"
                    className="w-40 h-56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Head */}
                    <circle cx="100" cy="60" r="25" fill="#f5deb3" stroke="#8b7355" strokeWidth="2" />
                    
                    {/* Glasses */}
                    <circle cx="90" cy="55" r="8" fill="none" stroke="#333" strokeWidth="2" />
                    <circle cx="110" cy="55" r="8" fill="none" stroke="#333" strokeWidth="2" />
                    <line x1="98" y1="55" x2="102" y2="55" stroke="#333" strokeWidth="2" />
                    <line x1="75" y1="55" x2="82" y2="55" stroke="#333" strokeWidth="2" />
                    <line x1="118" y1="55" x2="125" y2="55" stroke="#333" strokeWidth="2" />
                    
                    {/* Hair */}
                    <path d="M 75 50 Q 100 30 125 50" fill="#333" />
                    
                    {/* Smile */}
                    <path d="M 90 65 Q 100 70 110 65" stroke="#333" strokeWidth="1.5" fill="none" />
                    
                    {/* Body */}
                    <rect x="85" y="85" width="30" height="40" rx="5" fill="#f5f5f5" stroke="#8b7355" strokeWidth="2" />
                    
                    {/* Shirt */}
                    <rect x="80" y="125" width="40" height="50" rx="3" fill="#1e3a8a" stroke="#8b7355" strokeWidth="2" />
                    
                    {/* Pointing arm */}
                    <g>
                      <line x1="80" y1="135" x2="50" y2="110" stroke="#f5deb3" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="50" cy="108" r="6" fill="#f5deb3" />
                    </g>
                    
                    {/* Other arm */}
                    <line x1="120" y1="135" x2="140" y2="135" stroke="#f5deb3" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Legs */}
                    <line x1="90" y1="175" x2="90" y2="220" stroke="#333" strokeWidth="5" strokeLinecap="round" />
                    <line x1="110" y1="175" x2="110" y2="220" stroke="#333" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Shoes */}
                    <ellipse cx="90" cy="225" rx="8" ry="6" fill="#333" />
                    <ellipse cx="110" cy="225" rx="8" ry="6" fill="#333" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Center column - Form */}
            <div className="lg:col-span-1">
              {/* 2.1 Heading */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-navy">
                    Tell us your approximate building value (excluding land)
                  </h1>
                  <Info
                    size={18}
                    className="text-blue-500 flex-shrink-0 cursor-help"
                    aria-label="Enter the estimated cost to rebuild your building excluding the land value"
                  />
                </div>
              </div>

              {/* Form section */}
              <div className="space-y-6">
                
                {/* Building value input */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-3">
                    Select or Enter a Value
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={buildingValue}
                      onChange={handleBuildingValueChange}
                      placeholder="₹10,00,000 - ₹100,00,00,000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-navy"
                    />
                    {buildingValue && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded whitespace-nowrap">
                        {getBuildingValuePill()}
                      </div>
                    )}
                  </div>
                  
                  {/* Quick select pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUICK_SELECT_VALUES.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleQuickSelect(item.value)}
                        className={`py-2 px-3 rounded-lg border transition-all active:scale-95 ${
                          buildingValue === formatIndianNumber(item.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                            : 'border-gray-300 text-navy hover:border-blue-500 hover:text-blue-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Household items input */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-medium text-navy">
                      Value of household items
                    </label>
                    <Info
                      size={16}
                      className="text-blue-500 cursor-help"
                      aria-label="Enter the estimated value of your household contents like furniture, electronics, etc."
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={householdItems}
                      onChange={handleHouseholdItemsChange}
                      placeholder="₹1,00,000 - ₹50,00,00,000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-navy"
                    />
                    {householdItems && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded whitespace-nowrap">
                        {getHouseholdItemsPill()}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Suggested amount based on your house value (Editable)
                  </p>
                </div>

                {/* Property location (optional) */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-3">
                    Where is your property located? <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    placeholder="City Name or Pincode"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-navy"
                  />
                </div>

                {/* Button row */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => navigate('/home-insurance')}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium text-navy hover:bg-gray-50 transition-colors"
                  >
                    ‹ Previous
                  </button>
                  <button
                    onClick={handleNavigateToPlans}
                    className="flex-1 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium transition-colors hover:bg-blue-700 active:scale-95"
                  >
                    View Discounted Plans
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 py-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Housing society link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Need insurance for entire housing society?{' '}
                    <a href="#" className="text-blue-600 font-medium hover:underline">
                      Click here
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Promo cards */}
            <div className="hidden lg:flex lg:col-span-1 flex-col gap-6">
              
              {/* Home Loan promo card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm">
                      Don't let your Home Loan become a debt for your family.
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Home Loan Insurance helps settle your outstanding loan during unforeseen events.
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View Loan Protection Plans ›
                </a>
              </div>

              {/* Renewal promo card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">
                      Renew your existing home insurance in 2 easy steps.
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Renew now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2.5 Trust bar - full width */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-200 py-8">
          <div className="container-pb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* Brand statement */}
              <div>
                <p className="text-sm sm:text-base">
                  <span className="font-bold text-navy">AV Management is </span>
                  <span className="font-bold text-blue-600">one of India's leading</span>
                  <span className="font-bold text-navy"> digital insurance platform</span>
                </p>
              </div>

              {/* Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    i < 4 ? (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ) : (
                      <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" strokeWidth="0.5" />
                      </svg>
                    )
                  ))}
                </div>
                <p className="text-sm font-semibold text-navy">We are rated <span className="text-blue-600">4.5</span></p>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <svg className="w-5 h-5 text-green-600 mx-auto sm:mx-0 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <p className="text-sm font-semibold text-navy"><span className="text-blue-600">650+ cities</span></p>
                  <p className="text-xs text-gray-600">Secured Properties</p>
                </div>
                <div className="text-center sm:text-left">
                  <svg className="w-5 h-5 text-green-600 mx-auto sm:mx-0 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold text-navy"><span className="text-blue-600">₹23,900+ crores</span></p>
                  <p className="text-xs text-gray-600">Total Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2.6 Exclusive benefits section */}
        <div className="mt-16 bg-white py-12">
          <div className="container-pb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center">
                Exclusive benefits of AV Management
              </h2>
              
              {/* Decorative plus signs */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <text x="10" y="30" fontSize="24" fill="currentColor" className="text-blue-500">+</text>
                  <text x="60" y="70" fontSize="24" fill="currentColor" className="text-blue-500">+</text>
                </svg>
              </div>
            </div>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Zero Documentation */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-navy mb-2">Zero<br />Documentation</h3>
                <p className="text-xs text-gray-600">Instant policy issuance</p>
              </div>

              {/* Instant Policy Copy */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-navy mb-2">Instant<br />Policy Copy</h3>
                <p className="text-xs text-gray-600">Download anytime</p>
              </div>

              {/* Claims Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-navy mb-2">Claims<br />Support</h3>
                <p className="text-xs text-gray-600">24/7 assistance</p>
              </div>

              {/* Affordable Premium */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.16 2.75a.75.75 0 00-1.08.6v.75h-.504a1.75 1.75 0 00-1.7 2.214l.704 3.52a.75.75 0 001.464-.292l-.704-3.52a.25.25 0 01.243-.317h.504v7.5h-.75a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-.75v-7.5h.504a.25.25 0 01.243.317l-.704 3.52a.75.75 0 101.464.292l.704-3.52A1.75 1.75 0 0013.344 3.75h-.504v-.75a.75.75 0 00-1.08-.6.75.75 0 11-1.08-.6.75.75 0 00-1.08.6v.75h-.504v-.75a.75.75 0 00-.752-.75zm0 0a.75.75 0 00-.752.75v.75h3.504v-.75a.75.75 0 00-.752-.75h-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-navy mb-2">Affordable<br />Premium</h3>
                <p className="text-xs text-gray-600">Starting from ₹410</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2.7 Disclaimer section */}
        <div className="mt-16 pb-8">
          <div className="container-pb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setDisclaimerOpen(!disclaimerOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-bold text-navy">Disclaimer*</h3>
                {disclaimerOpen ? (
                  <ChevronUp size={20} className="text-navy" />
                ) : (
                  <ChevronDown size={20} className="text-navy" />
                )}
              </button>

              {/* Disclaimer content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  disclaimerOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-6 bg-white space-y-4 text-sm text-gray-700">
                  
                  {/* Company info */}
                  <div>
                    <p className="text-xs">
                      <strong>AV Management Insurance Brokers Private Limited</strong> | CIN: U74999HR2014PTC053454 | Registered Office - Plot No.119, Sector - 44, Gurgaon, Haryana - 122001
                    </p>
                    <p className="text-xs mt-2">
                      <a href="#" className="text-blue-600 hover:underline">Contact Us</a> | <a href="#" className="text-blue-600 hover:underline">Legal and Admin Policies</a>
                    </p>
                  </div>

                  {/* Registration paragraph */}
                  <div className="text-xs">
                    <p>
                      AV Management is a registered Insurance Broker | Registration No. 742, Registration Code No. IRDA/ DB 797/ 19, Valid till 09/06/2027, License category- Composite Broker | Visitors are hereby informed that their information submitted on the website may be shared with insurers. Product information is authentic and solely based on the information received from the insurers.
                    </p>
                  </div>

                  {/* Disclaimer line */}
                  <div className="text-xs pt-2 border-t border-gray-200">
                    <p>
                      <strong>*Disclaimer:</strong> STANDARD TERMS AND CONDITIONS APPLY. For more details on risk factors, terms and conditions, please read the sales brochure carefully before concluding a sale.
                    </p>
                  </div>

                  {/* KYC note */}
                  <div className="text-xs">
                    <p>
                      As per New IRDAI Guidelines (IRDAI/ILD/GDL/MISC/160/8/2022) KYC Verification is now Mandatory for Buying Policy.
                    </p>
                  </div>

                  {/* Sample premium disclaimers */}
                  <div className="text-xs space-y-2 pt-2 border-t border-gray-200">
                    <p>
                      *The premium of Rs. 15/month is for a pucca building with sum insured of Rs. 1 lakh structure at selected locations, for property age less than 40 years and policy term of 10 years. Additional premium is payable for the optional covers including contents opted.
                    </p>
                    <p>
                      *The premium of Rs. 18/month is for a pucca building with sum insured of Rs. 10 lakh structure at selected locations, for property age less than 35 years and policy term of 5 years. Additional premium is payable for the optional covers including contents opted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}