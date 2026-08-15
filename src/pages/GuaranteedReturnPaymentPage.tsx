import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CreditCard, Landmark, Smartphone, Copy, CheckCircle2 } from 'lucide-react'
import logo from '../assets/images/av-logon.png'
import type { GuaranteedPlan } from '../data/guaranteedPlans'

interface PurchaseDetails {
  name: string
  gender: 'male' | 'female'
  dob: string
  mobile: string
  email: string
  returnOfPremium: boolean
  premiumAfter: string
  lumpSumBenefit: string
  pincode: string
  city: string
  residentialStatus: string
}

type PaymentMethod = 'netbanking' | 'upi' | 'creditcard' | 'debitcard'

export default function GuaranteedReturnPaymentPage() {
  const location = useLocation()
  const plan = location.state?.plan as GuaranteedPlan | undefined
  const details = location.state?.details as PurchaseDetails | undefined
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('netbanking')
  const [showQR, setShowQR] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  if (!plan || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold text-red-600">Invalid state. Redirecting...</p>
      </div>
    )
  }

  const orderNumber = `PB${Math.random().toString().slice(2, 11)}`
  const premiumAmount = plan.youGive * 1000

  const paymentMethods = [
    {
      id: 'netbanking' as const,
      name: 'NetBanking',
      icon: Landmark,
      banks: ['HDFC', 'ICICI', 'SBI', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda'],
      note: 'Dhanalaxmi Bank is currently facing some technical issues.',
    },
    {
      id: 'upi' as const,
      name: 'UPI Emandate',
      icon: Smartphone,
      description: 'Pay & Register Autopay using QR Code',
      providers: ['Paytm', 'BHIM', 'PhonePe', 'Google Pay'],
    },
    {
      id: 'creditcard' as const,
      name: 'Credit Card',
      icon: CreditCard,
      description: 'All major credit cards accepted',
    },
    {
      id: 'debitcard' as const,
      name: 'Debit Card',
      icon: CreditCard,
      description: 'All major debit cards accepted',
    },
  ]

  return (
    <main className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <img src={logo} alt="AV Management" className="h-10 w-auto object-contain" />
          <div className="text-right">
            <p className="text-xs text-slate-300">Session expires in</p>
            <p className="text-lg font-bold text-yellow-400">14:58</p>
          </div>
        </div>
      </header>

      {/* Payment Status */}
      <div className="mx-auto max-w-6xl px-5 py-4">
        <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 px-6 py-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle2 size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-green-900 text-sm">Payment Setup</p>
            <p className="text-sm text-green-700 font-medium">Ready for payment processing</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
            Setup Autopay
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-5 py-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Payment Methods */}
        <div className="rounded-xl bg-white border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-bold text-slate-900">💳 Select Payment Method</h1>
            <p className="text-sm text-slate-600 mt-1">Choose your preferred way to pay</p>
          </div>

          <div className="grid lg:grid-cols-[200px_1fr] min-h-[600px]">
            {/* Method List */}
            <div className="border-r-2 border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-3 space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedMethod === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id)
                      setShowQR(false)
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium text-sm text-left ${
                      isSelected
                        ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-md'
                        : 'border-2 border-transparent hover:bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{method.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Method Content */}
            <div className="p-8 bg-white">
              {selectedMethod === 'netbanking' && (
                <NetBankingContent />
              )}
              {selectedMethod === 'upi' && (
                <UPIContent showQR={showQR} setShowQR={setShowQR} />
              )}
              {selectedMethod === 'creditcard' && (
                <CardContent type="credit" />
              )}
              {selectedMethod === 'debitcard' && (
                <CardContent type="debit" />
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Order Details Card */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md p-6">
            <p className="text-xs text-blue-700 font-bold mb-1 uppercase tracking-wide">Order Number</p>
            <p className="font-bold text-blue-900 text-xl mb-4 font-mono">{orderNumber}</p>

            <p className="text-xs text-blue-700 font-bold mb-1 uppercase tracking-wide">Premium Amount</p>
            <p className="font-bold text-blue-900 text-2xl mb-4">₹ {(premiumAmount / 1000).toFixed(0)},00</p>

            <div className="border-t-2 border-blue-200 pt-4">
              <p className="text-xs text-blue-700 font-bold mb-1 uppercase tracking-wide">Plan Name</p>
              <p className="font-bold text-blue-900 text-sm">{plan.planName}</p>
            </div>
          </div>

          {/* Plan Details Card */}
          <div className="rounded-xl bg-white border-2 border-slate-200 shadow-md p-6">
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              <span>📋</span> Plan Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Insurer</span>
                <span className="font-bold text-slate-900">{plan.insurerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Plan</span>
                <span className="font-bold text-slate-900 text-right">{plan.planName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Policy Type</span>
                <span className="font-bold text-slate-900">Investment</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Proposal No.</span>
                <span className="font-bold text-slate-900 font-mono">OP{Math.random().toString().slice(2, 10)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 font-bold">
                <span className="text-slate-600">Order No.</span>
                <span className="text-blue-600 font-mono">{orderNumber}</span>
              </div>
            </div>
          </div>

          {/* Proposer Details Card */}
          <div className="rounded-xl bg-white border-2 border-slate-200 shadow-md p-6">
            <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide flex items-center justify-between cursor-pointer group">
              <span className="flex items-center gap-2">
                <span>👤</span> Proposer
              </span>
              <span className="text-slate-400 group-hover:text-blue-600 transition-colors">+</span>
            </h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs text-slate-600">
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            {' | '}
            <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
            {' | '}
            <a href="#" className="text-blue-600 hover:underline">FAQ</a>
          </p>
          <div className="mt-3 text-center text-xs text-slate-600">
            <p>Policybazaar is registered as a composite broker</p>
            <p>Registration No. 742, Registration Code No. IRDA / DB 797 / 19, Valid till 09/08/2027, License category - Composite Broker</p>
            <p>CIN: U74999HK2014PTC053454 | Registered Office - Plot No.19, Sector - 44, Gurgaon, Haryana — 122001</p>
            <p>Visitors are hereby informed that their information submitted on the website may be shared with insurers.</p>
            <p>Product information is authentic and solely based on the information received from the insurers.</p>
            <p>© Copyright 2008-2026 policybazaar.com. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function NetBankingContent() {
  const banks = [
    { name: 'HDFC Bank', logo: '/src/assets/images/payments/hdfc-bank.png' },
    { name: 'ICICI Bank', logo: '/src/assets/images/payments/icici-bank.png' },
    { name: 'SBI Bank', logo: '/src/assets/images/payments/sbi-bank.svg' },
    { name: 'Kotak Bank', logo: '/src/assets/images/payments/kotak-bank.png' },
    { name: 'PNB Bank', logo: '/src/assets/images/payments/pnb-bank.svg' },
    { name: 'Bank of Baroda', logo: '/src/assets/images/payments/bob-bank.png' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-navy mb-4">Select your Bank</h2>
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-900 flex items-start gap-3">
        <span className="text-xl mt-1">⚠️</span>
        <div>
          <strong>Note:</strong> Dhanalaxmi Bank is currently facing some technical issues.
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {banks.map((bank) => (
          <button
            key={bank.name}
            className="p-5 rounded-lg border-2 border-slate-200 hover:border-brand bg-white hover:bg-blue-50 transition-all text-center font-medium text-navy text-sm flex flex-col items-center justify-center gap-3 min-h-[100px] shadow-sm hover:shadow-md"
          >
            <img src={bank.logo} alt={bank.name} className="h-12 w-auto object-contain" />
            <span className="text-xs font-semibold">{bank.name}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 w-full py-3 bg-slate-100 text-navy rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors border border-slate-300"
      >
        Select Another Bank
      </button>
      <button
        type="button"
        className="mt-3 w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
      >
        Pay Now
      </button>
    </div>
  )
}

function UPIContent({ showQR, setShowQR }: { showQR: boolean; setShowQR: (v: boolean) => void }) {
  const providers = [
    { name: 'Paytm', logo: '/src/assets/images/paytm.svg' },
    { name: 'BHIM', logo: '/src/assets/images/payments/airtel.png' },
    { name: 'PhonePe', logo: '/src/assets/images/payments/phonepe.png' },
    { name: 'Google Pay', logo: '/src/assets/images/payments/amazon-pay.svg' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-navy mb-1">Pay & Register Autopay</h2>
      <p className="text-sm text-slate-600 mb-6">Using UPI ID / Scan QR Code</p>

      {!showQR ? (
        <>
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-8 mb-6 text-center">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg mx-auto mb-4 flex items-center justify-center text-blue-600 font-bold text-sm">
              📱 QR Code
            </div>
            <p className="text-sm text-slate-700 font-medium">Click to view & scan the QR code with your UPI app</p>
          </div>
          <button
            onClick={() => setShowQR(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors mb-6"
          >
            Generate QR Code
          </button>

          <h3 className="font-bold text-navy mb-3 text-sm">OR Pay using your UPI App</h3>
          <p className="text-xs text-slate-600 mb-4 flex items-center gap-1">
            <span>ℹ️</span>
            <a href="#" className="text-blue-600 hover:underline">What is e-Mandate?</a>
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {providers.map((provider) => (
              <button
                key={provider.name}
                className="p-4 rounded-lg border-2 border-slate-200 hover:border-brand bg-white hover:bg-blue-50 transition-all text-center font-medium text-navy text-sm flex flex-col items-center justify-center gap-2 min-h-[90px] shadow-sm hover:shadow-md"
              >
                <img src={provider.logo} alt={provider.name} className="h-10 w-auto object-contain" />
                <span className="text-xs font-semibold">{provider.name}</span>
              </button>
            ))}
          </div>
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-xs text-blue-900">
            <p className="font-semibold mb-2">💡 How e-Mandate works?</p>
            <p className="leading-relaxed">After successful registration, your recurring payments will be charged automatically. You can manage or cancel anytime.</p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-8 mb-6 text-center">
            <div className="w-40 h-40 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg mx-auto mb-4 flex items-center justify-center text-slate-600 font-bold text-sm">
              🔲 QR Code
            </div>
            <p className="text-sm text-slate-700 font-medium">Scan this QR code with your UPI app</p>
          </div>
          <button
            onClick={() => setShowQR(false)}
            className="w-full py-2 text-blue-600 font-bold text-sm hover:text-blue-700 mb-3 underline"
          >
            ← Hide QR Code
          </button>
        </>
      )}
    </div>
  )
}

function CardContent({ type }: { type: 'credit' | 'debit' }) {
  const cardLogos = [
    { name: 'Visa', logo: '/src/assets/images/visa.png' },
    { name: 'Mastercard', logo: '/src/assets/images/mastercard.png' },
    { name: 'RuPay', logo: '/src/assets/images/rupay.png' },
    { name: 'Amex', logo: '/src/assets/images/american_express.svg' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-navy mb-2">Enter {type === 'credit' ? 'Credit' : 'Debit'} Card Details</h2>
      <p className="text-sm text-slate-600 mb-6">Secure and encrypted transaction</p>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white flex items-center justify-between">
        <div>
          <p className="text-xs opacity-90">Card Number</p>
          <p className="text-lg font-mono">•••• •••• •••• ••••</p>
        </div>
        <div className="text-3xl">💳</div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors text-sm"
            maxLength={19}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors text-sm"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
            <input
              type="password"
              placeholder="123"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors text-sm"
              maxLength={4}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            placeholder="Name on card"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors text-sm"
          />
        </div>

        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mt-6">
          <p className="text-xs font-semibold text-green-900 mb-2">✓ Accepted Card Types</p>
          <div className="flex gap-2 flex-wrap">
            {cardLogos.map((card) => (
              <img
                key={card.name}
                src={card.logo}
                alt={card.name}
                className="h-8 object-contain bg-white px-2 py-1 rounded border border-green-200"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors mt-6 shadow-md hover:shadow-lg"
        >
          Pay Now
        </button>
      </form>
    </div>
  )
}
