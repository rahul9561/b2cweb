import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
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

type PaymentMethod = 'netbanking' | 'upi' | 'debit' | 'credit'

const bankLogos = [
  { name: 'HDFC', logo: '/src/assets/images/hdfc-bank.png' },
  { name: 'ICICI', logo: '/src/assets/images/icici-bank.png' },
  { name: 'SBI', logo: '/src/assets/images/sbi-bank.png' },
  { name: 'Kotak', logo: '/src/assets/images/kotak-bank.png' },
  { name: 'PNB', logo: '/src/assets/images/pnb-bank.png' },
  { name: 'BoB', logo: '/src/assets/images/bob-bank.png' },
]

const upiProviders = [
  { name: 'Paytm', logo: '/src/assets/images/paytm.png' },
  { name: 'BHIM', logo: '/src/assets/images/bhim.png' },
  { name: 'PhonePe', logo: '/src/assets/images/phonepe.png' },
  { name: 'Google Pay', logo: '/src/assets/images/google-pay.png' },
]

const cardTypes = [
  { name: 'Visa', logo: '/src/assets/images/visa.png' },
  { name: 'Mastercard', logo: '/src/assets/images/mastercard.png' },
  { name: 'RuPay', logo: '/src/assets/images/rupay.png' },
  { name: 'AmEx', logo: '/src/assets/images/amex.png' },
]

export default function RetirementPlanPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan as RetirementPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('netbanking')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedUPI, setSelectedUPI] = useState('')
  const [selectedCard, setSelectedCard] = useState('')
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: '',
  })

  if (!plan || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">Payment details not found</p>
      </div>
    )
  }

  const handleCardNumberInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    setCardForm({ ...cardForm, cardNumber: formatted })
  }

  const handleExpiryInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4)
    const formatted = cleaned.length >= 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned
    setCardForm({ ...cardForm, expiry: formatted })
  }

  const handleCVVInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 3)
    setCardForm({ ...cardForm, cvv: cleaned })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Black Header with Session Timer */}
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
          <div className="text-sm font-bold text-yellow-400">
            Session expires in <span className="text-lg">14:58</span>
          </div>
        </div>
      </div>

      {/* Payment Status Bar */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
            <span className="text-xs font-semibold text-slate-600">Payment Mode</span>
            <span className="text-xs text-slate-600">→</span>
            <span className="text-xs font-semibold text-slate-600">Payment Complete</span>
            <span className="text-xs text-slate-600">→</span>
            <span className="text-xs font-semibold text-slate-500">Setup Autopay</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        {/* Payment Methods Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-3 bg-gradient-to-b from-blue-50 to-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-navy mb-3 text-sm">Payment Methods</h3>
            {(['netbanking', 'upi', 'debit', 'credit'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full py-3 px-3 rounded-lg font-bold text-sm transition-all text-center ${
                  paymentMethod === method
                    ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-400'
                }`}
              >
                {method === 'netbanking' && '🏦 NetBanking'}
                {method === 'upi' && '📱 UPI'}
                {method === 'debit' && '💳 Debit Card'}
                {method === 'credit' && '💳 Credit Card'}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* NetBanking */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-navy">Select your Bank</h3>
                <div className="grid grid-cols-2 gap-4">
                  {bankLogos.map((bank) => (
                    <button
                      key={bank.name}
                      onClick={() => setSelectedBank(bank.name)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedBank === bank.name
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={bank.logo} alt={bank.name} className="h-12 object-contain mx-auto" />
                    </button>
                  ))}
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  Pay Now
                </button>
              </div>
            )}

            {/* UPI */}
            {paymentMethod === 'upi' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-navy mb-4">QR Code Payment</h3>
                  <div className="flex flex-col items-center gap-4 p-6 bg-slate-100 rounded-lg">
                    <div className="w-48 h-48 bg-slate-300 rounded-lg flex items-center justify-center text-slate-600 font-semibold">
                      QR Code Placeholder (48x48)
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                      Generate QR Code
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-navy mb-4">Or select your UPI app</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {upiProviders.map((provider) => (
                      <button
                        key={provider.name}
                        onClick={() => setSelectedUPI(provider.name)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedUPI === provider.name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <img src={provider.logo} alt={provider.name} className="h-12 object-contain mx-auto" />
                      </button>
                    ))}
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500 mb-4">
                    <p className="text-xs text-yellow-900 font-semibold">
                      ⚠️ Enter your 10-digit mobile number registered with UPI to complete payment
                    </p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Pay & Register Autopay
                  </button>
                </div>
              </div>
            )}

            {/* Debit Card */}
            {(paymentMethod === 'debit' || paymentMethod === 'credit') && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-navy mb-4">
                  {paymentMethod === 'debit' ? 'Debit Card' : 'Credit Card'} Details
                </h3>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Card Number *</label>
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => handleCardNumberInput(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-medium"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      value={cardForm.expiry}
                      onChange={(e) => handleExpiryInput(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">CVV *</label>
                    <input
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => handleCVVInput(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-medium"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Cardholder Name *</label>
                  <input
                    type="text"
                    value={cardForm.holderName}
                    onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-medium"
                  />
                </div>

                {/* Card Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-3">Card Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {cardTypes.map((card) => (
                      <button
                        key={card.name}
                        onClick={() => setSelectedCard(card.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCard === card.name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <img src={card.logo} alt={card.name} className="h-8 object-contain mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-navy mb-4">Order Summary</h3>

              {/* Plan Details Card */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-4">
                <div className="text-center mb-3">
                  <img src={plan.insurerLogo} alt={plan.insurer} className="h-8 w-8 rounded bg-white/20 p-1 mx-auto mb-2" />
                  <p className="text-xs opacity-90">{plan.insurer}</p>
                  <p className="font-bold text-sm">{plan.planName}</p>
                </div>

                <div className="space-y-2 border-t border-white/30 pt-3">
                  <div className="flex justify-between text-xs">
                    <span>Premium:</span>
                    <span className="font-bold">₹{plan.investmentCriteria.minAmount / 100000}.00L</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Plan Type:</span>
                    <span className="font-bold text-xs">{plan.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Max Recurring:</span>
                    <span className="font-bold">₹{(plan.investmentCriteria.minAmount / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Pay Frequency:</span>
                    <span className="font-bold">MONTHLY</span>
                  </div>
                </div>
              </div>

              {/* Plan Details Section */}
              <div className="space-y-2 text-xs border-t pt-3 mb-4">
                <p className="font-bold text-slate-900">Plan Details</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Insurer:</span>
                  <span className="font-semibold text-slate-900">{plan.insurer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan:</span>
                  <span className="font-semibold text-slate-900">{plan.planName.slice(0, 15)}...</span>
                </div>
              </div>

              {/* Proposer Details Section */}
              <div className="space-y-2 text-xs border-t pt-3">
                <p className="font-bold text-slate-900">Proposer Details</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-semibold text-slate-900">{details.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-semibold text-slate-900 text-xs">{details.email.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mobile:</span>
                  <span className="font-semibold text-slate-900">****{details.mobile.slice(-4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
