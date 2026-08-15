import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ChildSavingsDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChildSavingsDetailsModal({ isOpen, onClose }: ChildSavingsDetailsModalProps) {
  const navigate = useNavigate()
  const [childAge, setChildAge] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState(5000)
  const [investmentPeriod, setInvestmentPeriod] = useState(10)
  const [returnPreference, setReturnPreference] = useState('all')
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([])

  const handleViewPlans = () => {
    setErrors([])

    // Basic validation
    if (childAge < 0 || childAge > 25) {
      setErrors([{ field: 'childAge', message: 'Child age should be between 0 and 25' }])
      return
    }

    // Navigate to plans page with collected data
    navigate('/child-savings-plans/plans', {
      state: {
        childDetails: {
          childAge,
          investmentAmount,
          investmentPeriod,
          returnPreference,
        },
      },
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95] bg-black/40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-bold text-navy">Child Savings Plan Details</h2>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Child Age */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">
                    Child's Current Age (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-center text-lg font-bold text-navy focus:border-blue-600 focus:outline-none"
                  />
                  {errors.find((e) => e.field === 'childAge') && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.find((e) => e.field === 'childAge')?.message}
                    </p>
                  )}
                </div>

                {/* Investment Amount */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">
                    Monthly Investment Amount (₹)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 15000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setInvestmentAmount(amount)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                          investmentAmount === amount
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-navy hover:bg-slate-200'
                        }`}
                      >
                        ₹{amount / 1000}K
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Period */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">
                    Investment Period (Years)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((period) => (
                      <button
                        key={period}
                        onClick={() => setInvestmentPeriod(period)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                          investmentPeriod === period
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-navy hover:bg-slate-200'
                        }`}
                      >
                        {period}Y
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return Preference */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">
                    Return Type Preference
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Types' },
                      { value: 'guaranteed', label: 'Guaranteed Returns' },
                      { value: 'market-linked', label: 'Market Linked' },
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="return-preference"
                          value={value}
                          checked={returnPreference === value}
                          onChange={(e) => setReturnPreference(e.target.value)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-slate-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-navy font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleViewPlans}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Plans
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
