import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { numberToWords } from '../../data/homeInsurance'

interface SearchDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    fullName: string
    mobile: string
    city: string
    buildingValue: number
    householdItems: number
  }
  onSave: (data: {
    fullName: string
    mobile: string
    city: string
    buildingValue: number
    householdItems: number
  }) => void
}

export default function SearchDetailsDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: SearchDetailsDrawerProps) {
  const [fullName, setFullName] = useState(initialData.fullName)
  const [mobile, setMobile] = useState(initialData.mobile)
  const [city, setCity] = useState(initialData.city)
  const [buildingValue, setBuildingValue] = useState(
    initialData.buildingValue.toLocaleString('en-IN')
  )
  const [householdItems, setHouseholdItems] = useState(
    initialData.householdItems.toLocaleString('en-IN')
  )
  const [mobileEditable, setMobileEditable] = useState(false)

  // Update state when initialData changes
  useEffect(() => {
    setFullName(initialData.fullName)
    setMobile(initialData.mobile)
    setCity(initialData.city)
    setBuildingValue(initialData.buildingValue.toLocaleString('en-IN'))
    setHouseholdItems(initialData.householdItems.toLocaleString('en-IN'))
    setMobileEditable(false)
  }, [initialData, isOpen])

  const handleSave = () => {
    const buildingNum = parseInt(buildingValue.replace(/,/g, '')) || 0
    const householdNum = parseInt(householdItems.replace(/,/g, '')) || 0

    onSave({
      fullName,
      mobile,
      city,
      buildingValue: buildingNum,
      householdItems: householdNum,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-xl transition-transform sm:max-w-sm overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <h2 className="text-[18px] font-bold text-navy">Search Details</h2>
          <button
            onClick={onClose}
            className="rounded-full hover:bg-slate-100 p-2 transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 px-6 py-5">
          {/* Full Name */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="Enter your full name"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Mobile Number
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={!mobileEditable}
                className={`flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand ${
                  !mobileEditable ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''
                }`}
              />
              <button
                onClick={() => setMobileEditable(!mobileEditable)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit mobile number"
              >
                ✏️
              </button>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="Enter city"
            />
          </div>

          {/* Section Header */}
          <div className="pt-3">
            <h3 className="text-[13px] font-bold text-navy">Sum Insured values</h3>
          </div>

          {/* Building Value */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2 flex items-center gap-1">
              Tell us your approximate building value (excluding land)
              <span
                className="text-blue-500 cursor-help"
                title="Enter the estimated cost to rebuild your building excluding the land value"
              >
                ⓘ
              </span>
            </label>
            <input
              type="text"
              value={buildingValue}
              onChange={(e) => setBuildingValue(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand mb-1"
              placeholder="Enter building value"
            />
            <p className="text-[12px] text-slate-600">
              Rs.{' '}
              {buildingValue
                ? numberToWords(parseInt(buildingValue.replace(/,/g, '')) || 0)
                : 'Enter amount'}
            </p>
          </div>

          {/* Household Items */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2 flex items-center gap-1">
              Value of household items (₹)
              <span
                className="text-blue-500 cursor-help"
                title="Enter the estimated value of your household contents like furniture, electronics, etc."
              >
                ⓘ
              </span>
            </label>
            <input
              type="text"
              value={householdItems}
              onChange={(e) => setHouseholdItems(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand mb-1"
              placeholder="Enter household items value"
            />
            <p className="text-[12px] text-slate-600">
              Rs.{' '}
              {householdItems
                ? numberToWords(parseInt(householdItems.replace(/,/g, '')) || 0)
                : 'Enter amount'}
            </p>
          </div>
        </div>

        {/* Sticky Bottom Button */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-brand py-3 text-[14px] font-bold text-white hover:bg-brand-dark transition-colors"
          >
            Save &amp; Continue ›
          </button>
        </div>
      </div>
    </>
  )
}
