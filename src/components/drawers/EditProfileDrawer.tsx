import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { useUserProfile } from '../../context/UserProfileContext'
import { incomeOptions, educationOptions } from '../../data/options'
import Button from '../common/Button'

interface EditProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileDrawer({ isOpen, onClose }: EditProfileDrawerProps) {
  const { profile, dispatch } = useUserProfile()
  const [localProfile, setLocalProfile] = useState({ ...profile })

  useEffect(() => {
    setLocalProfile({ ...profile })
  }, [profile, isOpen])

  const handleSave = () => {
    dispatch({ type: 'SET_PROFILE', payload: localProfile })
    onClose()
  }

  const calculateAge = (dob: string): number => {
    if (!dob) return 0
    const parts = dob.split('-')
    if (parts.length !== 3) return 0
    const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(localProfile.dob)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 px-5 py-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-navy">Edit Profile</h2>
              <div className="w-16" />
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Gender</label>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setLocalProfile({ ...localProfile, gender: g })}
                      className={`relative flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
                        localProfile.gender === g
                          ? 'bg-brand text-white'
                          : 'border border-gray-200 text-gray-500 hover:border-brand/50'
                      }`}
                    >
                      {g === 'male' ? 'Male' : 'Female'}
                      {localProfile.gender === g && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-brand">
                          <Check className="h-3 w-3 text-brand" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Date of Birth</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={localProfile.dob}
                    onChange={(e) => setLocalProfile({ ...localProfile, dob: e.target.value })}
                    placeholder="dd-mm-yyyy"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                  />
                  {age > 0 && (
                    <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
                      {age} years
                    </span>
                  )}
                </div>
              </div>

              {/* Smoker */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Do you smoke or chew tobacco?</label>
                <div className="flex gap-2">
                  {(['yes', 'no'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setLocalProfile({ ...localProfile, smoker: s })}
                      className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
                        localProfile.smoker === s
                          ? 'bg-brand text-white'
                          : 'border border-gray-200 text-gray-500 hover:border-brand/50'
                      }`}
                    >
                      {s === 'yes' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Annual Income</label>
                <select
                  value={localProfile.annualIncome || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, annualIncome: e.target.value || null })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white"
                >
                  <option value="">Select income</option>
                  {incomeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Educational Qualification</label>
                <select
                  value={localProfile.education || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, education: e.target.value || null })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white"
                >
                  <option value="">Select education</option>
                  {educationOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Occupation Type</label>
                <div className="flex gap-2">
                  {(['salaried', 'self-employed'] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setLocalProfile({ ...localProfile, occupation: o })}
                      className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
                        localProfile.occupation === o
                          ? 'bg-brand text-white'
                          : 'border border-gray-200 text-gray-500 hover:border-brand/50'
                      }`}
                    >
                      {o === 'salaried' ? 'Salaried' : 'Self Employed'}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Your City</label>
                <input
                  type="text"
                  value={localProfile.city}
                  onChange={(e) => setLocalProfile({ ...localProfile, city: e.target.value })}
                  placeholder="Enter your city"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Pin Code</label>
                <input
                  type="text"
                  value={localProfile.pincode}
                  onChange={(e) => setLocalProfile({ ...localProfile, pincode: e.target.value })}
                  placeholder="Please Enter Pin Code"
                  maxLength={6}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-gray-200 px-5 py-4">
              <Button onClick={handleSave} fullWidth size="lg" variant="orange">
                Save
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
