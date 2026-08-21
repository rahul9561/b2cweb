import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Landmark,
  MinusCircle,
  Smartphone,
  Wallet,
  BadgeIndianRupee,
} from 'lucide-react'
import paytmLogo from '../../assets/images/paytm.svg'
import avLogo from '../../assets/images/av-logon.png'
import zunoLogo from '../../assets/images/zuno.png'
import airtelLogo from '../../assets/images/payments/airtel.png'
import amazonPayLogo from '../../assets/images/payments/amazon-pay.svg'
import bobBankLogo from '../../assets/images/payments/bob-bank.png'
import freechargeLogo from '../../assets/images/payments/freecharge.png'
import hdfcBankLogo from '../../assets/images/payments/hdfc-bank.png'
import iciciBankLogo from '../../assets/images/payments/icici-bank.png'
import jioMoneyLogo from '../../assets/images/payments/jiomoney.png'
import kotakBankLogo from '../../assets/images/payments/kotak-bank.png'
import mobikwikLogo from '../../assets/images/payments/mobikwik.svg'
import olaMoneyLogo from '../../assets/images/payments/olamoney.png'
import oxigenLogo from '../../assets/images/payments/oxigen.png'
import payzappLogo from '../../assets/images/payments/payzapp.svg'
import phonepeLogo from '../../assets/images/payments/phonepe.png'
import pnbBankLogo from '../../assets/images/payments/pnb-bank.svg'
import sbiBankLogo from '../../assets/images/payments/sbi-bank.svg'
import shopseLogo from '../../assets/images/payments/shopse.svg'

export type PaymentProduct = 'car' | 'investment' | 'bike' | 'term'
type PayMethod = 'Wallet' | 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'EMI'

const methods: { label: PayMethod; icon: typeof Wallet }[] = [
  { label: 'Wallet', icon: Wallet },
  { label: 'UPI', icon: Smartphone },
  { label: 'Credit Card', icon: CreditCard },
  { label: 'Debit Card', icon: CreditCard },
  { label: 'NetBanking', icon: Landmark },
  { label: 'EMI', icon: BadgeIndianRupee },
]

const wallets = ['PhonePe', 'airtel', 'JioMoney', 'freecharge', 'PAYZAPP', 'OLAMONEY', 'Mobikwik', 'paytm', 'oxigen.', 'amazon pay']
const walletLogos: Record<string, string> = {
  PhonePe: phonepeLogo,
  airtel: airtelLogo,
  JioMoney: jioMoneyLogo,
  freecharge: freechargeLogo,
  PAYZAPP: payzappLogo,
  OLAMONEY: olaMoneyLogo,
  Mobikwik: mobikwikLogo,
  paytm: paytmLogo,
  'oxigen.': oxigenLogo,
  'amazon pay': amazonPayLogo,
}
const banks = [
  { name: 'HDFC', logo: hdfcBankLogo },
  { name: 'ICICI', logo: iciciBankLogo },
  { name: 'SBI', logo: sbiBankLogo },
  { name: 'Kotak Mahindra', logo: kotakBankLogo },
  { name: 'Punjab National Bank', logo: pnbBankLogo },
  { name: 'Bank of Baroda', logo: bobBankLogo },
]

export default function PaymentGateway({
  product = 'car',
  planOverride,
  premiumOverride,
}: {
  product?: PaymentProduct
  planOverride?: { insurerName: string; planName: string; id: string }
  premiumOverride?: number
}) {
  const [method, setMethod] = useState<PayMethod>(product === 'investment' ? 'NetBanking' : 'Wallet')
  const [selected, setSelected] = useState(product === 'investment' ? 'SBI' : 'PhonePe')
  const [paid, setPaid] = useState(false)
  const isMotor = product === 'car' || product === 'bike'

  return (
    <main className="min-h-screen bg-[#eaf4ff] text-navy">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link to="/" aria-label="Go to AV Management home"><img src={avLogo} alt="AV Management" className="h-12 w-auto" /></Link>
          {isMotor && <p className="text-sm text-white">Session expires in <span className="rounded bg-red-50 px-3 py-2 text-red-500">14:31</span></p>}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">

        <div className="mb-6 rounded-lg bg-white p-5 shadow-card">
          <div className="grid grid-cols-2 text-center text-sm">
            {['Payment Mode', 'Payment Complete'].map((step, index) => (
              <div key={step} className="relative">
                <span className={`mx-auto mb-2 grid h-5 w-5 place-items-center rounded-full ${index === 0 || paid ? 'bg-green-cta text-white' : 'border-2 border-green-cta bg-white'}`}>
                  {(index === 0 || paid) && <CheckCircle2 className="h-5 w-5" />}
                </span>
                <p className={index === 0 || paid ? 'text-green-cta' : 'text-slate2-secondary'}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_365px]">
          <section className="grid rounded-lg bg-white shadow-card md:grid-cols-[250px_1fr]">
            <aside className="border-r border-slate2-border bg-[#f5f7fb]">
              {methods.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setMethod(label)}
                  className={`flex w-full items-center gap-4 border-b border-slate2-border px-5 py-5 text-left text-lg ${
                    method === label ? 'border-r-2 border-r-brand bg-white font-black text-brand' : 'text-navy'
                  }`}
                >
                  <Icon className="h-6 w-6" /> {label}
                </button>
              ))}
            </aside>
            <PaymentBody method={method} selected={selected} setSelected={setSelected} onPay={() => setPaid(true)} />
          </section>

          <PaymentSummary product={product} planOverride={planOverride} premiumOverride={premiumOverride} />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-brand">
          <p>Privacy Policy | Terms & Conditions | FAQ</p>
          <div className="rounded bg-white px-4 py-2 font-black text-green-cta shadow-sm">PCI DSS Certified</div>
        </div>
      </div>
    </main>
  )
}

function PaymentBody({
  method,
  selected,
  setSelected,
  onPay,
}: {
  method: PayMethod
  selected: string
  setSelected: (value: string) => void
  onPay: () => void
}) {
  if (method === 'UPI') {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-lg font-black">Pay using UPI</h2>
        <div className="grid gap-8 rounded-lg bg-blueBG p-6 md:grid-cols-[170px_1fr]">
          <div className="text-center">
            <p className="mb-3 font-black">Scan and Pay</p>
            <div className="grid h-36 w-36 place-items-center rounded-lg bg-white text-center text-xs text-slate2-muted shadow-inner">QR<br />CODE</div>
            <button className="mt-3 rounded border border-brand bg-white px-8 py-2 font-black text-brand">View</button>
          </div>
          <div className="border-l border-slate2-border pl-8">
            <p className="mb-3 font-black">Enter UPI ID</p>
            <input className="mb-4 h-12 w-full rounded border border-slate2-border px-4 outline-none" placeholder="mobilenumber@upi" />
            <button onClick={onPay} className="h-12 w-full rounded bg-brand font-black text-white">Verify & Pay</button>
            {['Enter your registered VPA', 'Receive payment request on payment app', 'Authorize payment request'].map((step) => (
              <p key={step} className="mt-4 text-sm text-slate2-secondary">* {step}</p>
            ))}
          </div>
        </div>
        <p className="mt-4 rounded border border-yellow bg-yellow/20 p-3 text-xs">
          Transaction confirmation for UPI takes longer than other payment modes. Given the delay, we recommend you wait for some time before making another payment attempt using UPI.
        </p>
      </div>
    )
  }

  if (method === 'Credit Card' || method === 'Debit Card') {
    return (
      <div className="p-6">
        <p className="mb-4 rounded bg-[#fff1b8] px-4 py-3 text-xs">Canara Bank, Bank of India are currently facing some technical issues.</p>
        <h2 className="mb-4 text-lg font-black">Enter your {method} details</h2>
        <div className="space-y-4">
          <input className="h-12 w-full rounded border border-slate2-border px-4 outline-none" placeholder={`${method} Number`} />
          <input className="h-12 w-full rounded border border-slate2-border px-4 outline-none" placeholder="Enter Your Name" />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="h-12 rounded border border-slate2-border px-4 outline-none" placeholder="Expiry Month & Year" />
            <input className="h-12 rounded border border-slate2-border px-4 outline-none" placeholder="CVV" />
          </div>
          <button onClick={onPay} className="h-12 w-full rounded bg-brand font-black text-white">Pay Now</button>
        </div>
      </div>
    )
  }

  if (method === 'NetBanking') {
    return (
      <div className="p-6">
        <p className="mb-5 rounded bg-[#fff1b8] px-4 py-3 text-xs">Dhanlaxmi Bank is currently facing some technical issues.</p>
        <h2 className="mb-6 text-lg font-black">Select your Bank</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {banks.map((bank) => (
            <button
              key={bank.name}
              onClick={() => setSelected(bank.name)}
              className={`flex items-center gap-4 rounded-lg border px-5 py-4 text-left ${selected === bank.name ? 'border-brand bg-blueBG' : 'border-slate2-border'}`}
            >
              <span className="grid h-9 w-9 place-items-center rounded bg-white p-1 shadow-sm">
                <img src={bank.logo} alt={bank.name} className="max-h-7 max-w-7 object-contain" />
              </span>
              <span className="font-bold">{bank.name}</span>
            </button>
          ))}
        </div>
        <button className="mt-5 flex h-12 w-full items-center justify-between rounded border border-slate2-border px-4 text-slate2-secondary">Select Another Bank <ChevronDown className="h-5 w-5" /></button>
        <button onClick={onPay} className="mt-5 h-12 w-full rounded bg-brand font-black text-white">Pay Now</button>
      </div>
    )
  }

  if (method === 'EMI') {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-lg font-black">Select an option</h2>
        <div className="mb-5 grid grid-cols-3 rounded bg-blueBG p-2 text-center text-xs font-black text-brand">
          <button className="rounded bg-white py-3 shadow-sm">Cardless EMI</button>
          <button>Credit Card</button>
          <button>Debit Card</button>
        </div>
        <button className="mb-5 flex h-12 w-full items-center gap-3 rounded border border-slate2-border px-5 text-left font-black text-green-cta">
          <img src={shopseLogo} alt="ShopSe" className="h-8 w-auto" />
        </button>
        <button onClick={onPay} className="h-12 w-full rounded bg-brand font-black text-white">Continue</button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-lg font-black">Select Wallet app</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {wallets.map((wallet) => (
          <button
            key={wallet}
            onClick={() => setSelected(wallet)}
            className={`flex h-14 items-center gap-4 rounded-lg border bg-white px-5 text-left text-base font-bold ${
              selected === wallet ? 'border-brand bg-blueBG text-brand' : 'border-slate2-border'
            } ${wallet === 'PhonePe' ? 'text-purple2' : wallet === 'airtel' || wallet === 'freecharge' ? 'text-orange-tag' : wallet === 'paytm' ? 'text-brand' : ''}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded bg-white p-1 shadow-sm">
              <img src={walletLogos[wallet]} alt={wallet} className="max-h-7 max-w-7 object-contain" />
            </span>
            <span className="text-navy">{wallet}</span>
          </button>
        ))}
      </div>
      <button onClick={onPay} className="mt-6 h-12 w-full rounded bg-brand font-black text-white">Pay now</button>
      <div className="mt-6">
        <h3 className="font-black">Please note</h3>
        <p className="mt-2 text-sm text-slate2-secondary">As per government regulations, wallets cannot be used for transactions more than Rs. 1,00,000 per month</p>
      </div>
    </div>
  )
}

function PaymentSummary({
  product,
  planOverride,
  premiumOverride,
}: {
  product: PaymentProduct
  planOverride?: { insurerName: string; planName: string; id: string }
  premiumOverride?: number
}) {
  const isCar = product === 'car'
  const isBike = product === 'bike'
  const isTerm = product === 'term'
  const termAmount = premiumOverride ? `Rs ${premiumOverride.toLocaleString('en-IN')}` : 'Rs 5,000.00'
  const summary = isBike
    ? {
        logo: 'B',
        planName: 'Third party Plan 1 Yr',
        amount: 'Rs 842.00',
        total: 'Rs 842.00',
        insurer: 'Bajaj General',
        policyType: 'Twowheeler',
        proposal: '70062895139',
        order: 'PB177586183',
      }
    : isTerm
    ? {
        logo: 'AV',
        planName: planOverride?.planName || 'Term Plan',
        amount: termAmount,
        total: termAmount,
        insurer: planOverride?.insurerName || 'AV',
        policyType: 'Term Insurance',
        proposal: 'TP3075133',
        order: 'PB17755783',
      }
    : {
        logo: isCar ? 'zuno' : 'AV',
        logoUrl: isCar ? zunoLogo : undefined,
        planName: isCar ? 'ComprehensivePolicy' : 'Capital Guarantee Solution',
        amount: isCar ? 'Rs 3,526.00' : 'Rs 5,000.00',
        total: isCar ? 'Rs 3,904.00' : 'Rs 5,000.00',
        insurer: isCar ? 'Zuno' : 'iPru',
        policyType: isCar ? 'Car Insurance' : 'Investments',
        proposal: isCar ? 'PB79641PG0030298129' : 'OP3075133',
        order: 'PB17755783',
      }
  return (
    <aside className="space-y-4">
      <div className="rounded-lg bg-white shadow-card">
        <div className="flex justify-between rounded-t-lg bg-[#f0e6ff] px-5 py-4 text-sm text-purple2"><span>Order Number</span><b>{summary.order}</b></div>
        <div className="space-y-5 p-5">
          <PlanPremium logo={summary.logo} logoUrl={summary.logoUrl} name={summary.planName} amount={summary.amount} />
          {isCar && <PlanPremium logo="digit" name="Standalone Owner Driver Personal Accident cover" amount="Rs 378.00" />}
          <p className="flex justify-between border-t pt-4 text-lg"><span>Total Premium</span><b>{summary.total}</b></p>
        </div>
      </div>
      <div className="rounded-lg bg-white p-5 shadow-card">
        <h3 className="mb-5 flex items-center justify-between text-lg font-black">Plan Details <MinusCircle className="h-5 w-5 text-slate2-secondary" /></h3>
        {[
          ['Insurer', summary.insurer],
          ['Plan', summary.planName],
          ['Policy Type', summary.policyType],
          ['Proposal No.', summary.proposal],
          ['Order No.', summary.order],
        ].map(([label, value]) => (
          <p key={label} className="mb-5 grid grid-cols-[120px_1fr] text-base"><span className="text-slate2-secondary">{label}</span><b>{value}</b></p>
        ))}
      </div>
      <div className="rounded-lg bg-white p-5 shadow-card">
        <h3 className="mb-4 flex items-center justify-between font-black">Proposer Details <MinusCircle className="h-5 w-5 text-slate2-secondary" /></h3>
        <p className="grid grid-cols-[120px_1fr] text-sm"><span className="text-slate2-secondary">Name</span><b>Mohd Faisal</b></p>
        <p className="mt-3 grid grid-cols-[120px_1fr] text-sm"><span className="text-slate2-secondary">Mobile Number</span><b>94XXXXXX12</b></p>
      </div>
    </aside>
  )
}

function PlanPremium({ logo, logoUrl, name, amount }: { logo: string; logoUrl?: string; name: string; amount: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-3 border-b border-slate2-border pb-4 last:border-0">
      <span className={`grid h-10 place-items-center rounded px-2 text-sm font-black ${logo === 'digit' ? 'bg-black text-white' : 'bg-blueBG text-green-cta'}`}>
        {logoUrl ? <img src={logoUrl} alt={name} className="max-h-8 max-w-full object-contain" /> : logo}
      </span>
      <div>
        <p className="text-sm text-slate2-secondary">Plan Name:</p>
        <p className="font-black">{name}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate2-secondary">Premium</p>
        <p className="font-black">{amount}</p>
      </div>
    </div>
  )
}

