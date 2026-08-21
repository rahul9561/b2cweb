import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Landmark, Smartphone, CreditCard, Headphones } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import { ChildSavingsPlan } from '../data/childSavingsPlans'

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

const bankLogos = [
  { name: 'HDFC', logo: '/src/assets/images/hdfc-bank.png' },
  { name: 'ICICI', logo: '/src/assets/images/icici-bank.png' },
  { name: 'SBI', logo: '/src/assets/images/sbi-bank.svg' },
  { name: 'Kotak', logo: '/src/assets/images/kotak-bank.png' },
  { name: 'PNB', logo: '/src/assets/images/pnb-bank.svg' },
  { name: 'BoB', logo: '/src/assets/images/bob-bank.png' },
]

const upiProviders = [
  { name: 'Paytm', logo: '/src/assets/images/paytm.svg' },
  { name: 'BHIM', logo: '/src/assets/images/bhim.png' },
  { name: 'PhonePe', logo: '/src/assets/images/phonepe.png' },
  { name: 'Google Pay', logo: '/src/assets/images/googlepay.png' },
]

const cardTypes = [
  { name: 'Visa', logo: '/src/assets/images/visa.png' },
  { name: 'Mastercard', logo: '/src/assets/images/mastercard.png' },
  { name: 'RuPay', logo: '/src/assets/images/rupay.png' },
  { name: 'American Express', logo: '/src/assets/images/american_express.svg' },
]

export default function ChildSavingsPaymentPage() {
  const location = useLocation()
  const plan = location.state?.plan as ChildSavingsPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined

  const [paymentMethod, setPaymentMethod] = useState('netbanking')
  const [selectedBank, setSelectedBank] = useState('HDFC')

  if (!plan || !details) return null

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <div className="flex items-center gap-6">
            <span className="text-sm text-yellow-400 font-bold">Session expires in <span className="text-lg">14:58</span></span>
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm">
              <Headphones size={16} />
              Talk to an Expert
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Left: Payment Methods Sidebar */}
          <div className="col-span-1">
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-4 sticky top-24">
              <h3 className="font-bold text-navy mb-4">Payment Methods</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-navy hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Landmark size={18} className="inline mr-2" />
                  NetBanking
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-navy hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Smartphone size={18} className="inline mr-2" />
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('debit')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'debit'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-navy hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <CreditCard size={18} className="inline mr-2" />
                  Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'credit'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-navy hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <CreditCard size={18} className="inline mr-2" />
                  Credit Card
                </button>
              </div>
            </div>
          </div>

          {/* Right: Payment Form & Summary */}
          <div className="col-span-3 space-y-8">
            {/* Payment Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                  <span className="font-bold text-green-900">Payment Mode</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center">2</div>
                  <span className="font-bold text-slate-600">Payment Complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center">3</div>
                  <span className="font-bold text-slate-600">Setup Autopay</span>
                </div>
              </div>
            </div>

            {/* Payment Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
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
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <img src={bank.logo} alt={bank.name} className="h-12 object-contain mx-auto" />
                        <p className="text-sm font-bold text-navy mt-2">{bank.name}</p>
                      </button>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Pay Now
                  </button>
                </div>
              )}

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-navy">Pay & Register Autopay using UPI ID</h3>
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-slate-300 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-slate-500">[QR Code]</span>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                      Generate QR code
                    </button>
                  </div>

                  <div>
                    <p className="font-bold text-navy mb-3">Or select your UPI app:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {upiProviders.map((provider) => (
                        <button
                          key={provider.name}
                          className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                        >
                          <img src={provider.logo} alt={provider.name} className="h-12 object-contain mx-auto" />
                          <p className="text-sm font-bold text-navy mt-2">{provider.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
                    <p className="font-semibold">Disclaimer</p>
                    <p className="mt-2">Amount authorised under e-mandate registration is Rs 2 higher than your premium amount. This is for registration purpose only.</p>
                  </div>
                </div>
              )}

              {/* Debit Card */}
              {paymentMethod === 'debit' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-navy">Debit Card Details</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                      <input type="text" placeholder="CVV" className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                    </div>
                    <input type="text" placeholder="Cardholder Name" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                  </div>

                  <div>
                    <p className="font-bold text-navy mb-3">Select your card type:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {cardTypes.map((card) => (
                        <button key={card.name} className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all">
                          <img src={card.logo} alt={card.name} className="h-10 object-contain mx-auto" />
                          <p className="text-sm font-bold text-navy mt-2">{card.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Pay Now
                  </button>
                </div>
              )}

              {/* Credit Card */}
              {paymentMethod === 'credit' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-navy">Credit Card Details</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                      <input type="text" placeholder="CVV" className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                    </div>
                    <input type="text" placeholder="Cardholder Name" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none" />
                  </div>

                  <div>
                    <p className="font-bold text-navy mb-3">Select your card type:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {cardTypes.map((card) => (
                        <button key={card.name} className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all">
                          <img src={card.logo} alt={card.name} className="h-10 object-contain mx-auto" />
                          <p className="text-sm font-bold text-navy mt-2">{card.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary (Sticky) */}
        <div className="fixed right-8 bottom-8 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="font-bold text-navy mb-6 pb-4 border-b border-slate-200">Order Summary</h3>

          {/* Plan Details Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-xs text-slate-600 font-medium mb-2">Plan Details</p>
            <p className="font-bold text-navy">{plan.planName}</p>
            <p className="text-xs text-slate-600 mt-1">{plan.insurer}</p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-600">Plan Name</span>
              <span className="font-bold text-navy">{plan.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">6 Year Returns</span>
              <span className="font-bold text-green-600">{plan.returns6yr}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Investment Tenure</span>
              <span className="font-bold text-navy">{plan.investmentCriteria.investmentTenure} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Maturity Payout</span>
              <span className="font-bold text-navy">₹{(plan.maturityPayoutYou / 1000000).toFixed(1)} Cr</span>
            </div>
          </div>

          {/* Proposer Details */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium mb-2">Proposer Details</p>
            <p className="font-bold text-navy text-sm">{details.name}</p>
            <p className="text-xs text-slate-600 mt-1">{details.email}</p>
            <p className="text-xs text-slate-600">{details.mobile}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
