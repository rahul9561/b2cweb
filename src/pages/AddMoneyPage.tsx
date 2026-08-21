import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, ShieldCheck, X } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { useToast } from '../context/ToastContext'
import { getTotalBalance } from '../lib/walletApi'

type RazorpaySuccessResponse = { razorpay_payment_id: string }
type RazorpayFailureResponse = { error?: { description?: string } }
type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { name?: string; email?: string; contact?: string }
  theme: { color: string }
  modal: { confirm_close: boolean; ondismiss: () => void }
  handler: (response: RazorpaySuccessResponse) => void
}
type RazorpayInstance = {
  open: () => void
  close: () => void
  on: (event: 'payment.failed', handler: (response: RazorpayFailureResponse) => void) => void
}
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

let razorpayScriptPromise: Promise<void> | null = null
const loadRazorpay = (): Promise<void> => {
  if (window.Razorpay) return Promise.resolve()
  if (razorpayScriptPromise) return razorpayScriptPromise

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-av-razorpay]')
    const script = existing ?? document.createElement('script')
    const loaded = () => window.Razorpay ? resolve() : reject(new Error('Razorpay checkout could not be loaded.'))
    script.addEventListener('load', loaded, { once: true })
    script.addEventListener('error', () => reject(new Error('Razorpay checkout could not be loaded.')), { once: true })
    if (!existing) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.dataset.avRazorpay = 'true'
      document.body.appendChild(script)
    }
  }).catch((error) => {
    razorpayScriptPromise = null
    throw error
  })
  return razorpayScriptPromise
}

const quickAmounts = [299, 500, 1000, 2000, 5000]
const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))
const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function AddMoneyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const { wallet, createTopup, refreshBalance } = useWallet()
  const { showToast } = useToast()
  const [amountInput, setAmountInput] = useState(() => {
    const queryAmount = searchParams.get('amount') ?? ''
    return /^\d+(?:\.\d{0,2})?$/.test(queryAmount) ? queryAmount : ''
  })
  const [processing, setProcessing] = useState(false)
  const [pageError, setPageError] = useState('')
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const razorpay = useRef<RazorpayInstance | null>(null)
  const paymentSettled = useRef(false)

  useEffect(() => {
    void loadRazorpay().catch(() => undefined)
  }, [])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const amount = Number(amountInput)
  const validAmount = Number.isFinite(amount) && amount >= 299
  const total = wallet ? getTotalBalance(wallet) : 0

  const pollForUpdatedBalance = async (startingBalance: number) => {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await delay(1500)
      try {
        const updatedWallet = await refreshBalance()
        if (getTotalBalance(updatedWallet) !== startingBalance) return
      } catch {
        // The webhook may still be pending; the Wallet page will refresh it later.
      }
    }
  }

  const proceedToPay = async () => {
    if (!validAmount || processing) return
    setProcessing(true)
    setPageError('')
    paymentSettled.current = false

    try {
      await loadRazorpay()
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined
      if (!key) throw new Error('Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID to the environment.')
      if (!window.Razorpay) throw new Error('Razorpay checkout could not be loaded.')

      const { order_id } = await createTopup(amount)
      const startingBalance = total
      const options: RazorpayOptions = {
        key,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'AV Management Private Limited',
        description: 'Wallet Topup',
        order_id,
        prefill: { name: user?.name, email: user?.email, contact: user?.mobile },
        theme: { color: '#2563eb' },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setProcessing(false)
            if (!paymentSettled.current) {
              showToast('Payment was cancelled.')
              navigate('/wallet/payment-status', {
                state: { success: false, amount, message: 'Payment was cancelled.' },
              })
            }
          },
        },
        handler: (response) => {
          paymentSettled.current = true
          setProcessing(false)
          showToast('Wallet top-up successful.')
          navigate('/wallet/payment-status', {
            state: { success: true, amount, transactionId: response.razorpay_payment_id },
          })
          void pollForUpdatedBalance(startingBalance)
        },
      }

      const checkout = new window.Razorpay(options)
      razorpay.current = checkout
      checkout.on('payment.failed', (response) => {
        paymentSettled.current = true
        setProcessing(false)
        const failureMessage = response.error?.description || 'Payment failed. Please try again.'
        showToast(failureMessage)
        navigate('/wallet/payment-status', {
          state: {
            success: false,
            amount,
            message: failureMessage,
          },
        })
      })
      checkout.open()
    } catch (error) {
      setProcessing(false)
      const message = error instanceof Error ? error.message : 'Payment could not be started. Please try again.'
      setPageError(message)
      showToast(message)
    }
  }

  const handleBack = () => {
    if (processing) setShowExitConfirm(true)
    else navigate('/wallet')
  }

  const exitPayment = () => {
    paymentSettled.current = true
    razorpay.current?.close()
    setProcessing(false)
    setShowExitConfirm(false)
    navigate('/wallet')
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <div className="container-pb max-w-3xl py-7 md:py-10">
        <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-navy md:text-3xl">Add Money to Wallet</h1>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm text-slate-500">Current Wallet Balance</span>
            <span className="font-bold text-navy">{formatMoney(total)}</span>
          </div>
        </div>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="font-bold text-navy">Enter Amount</h2>
          <div className="mt-4 flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="text-3xl font-semibold text-slate-500">₹</span>
            <input
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value.replace(/[^\d.]/g, '').replace(/(\.\d{2}).+$/, '$1'))}
              inputMode="decimal"
              placeholder="0"
              aria-label="Wallet top-up amount"
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-5 text-4xl font-bold text-navy outline-none"
            />
          </div>
          {amountInput && !validAmount && <p className="mt-2 text-sm font-medium text-red-600">Minimum amount is ₹299.</p>}

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmountInput(String(quickAmount))}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${amount === quickAmount ? 'border-black bg-black text-white' : 'border-slate-300 text-slate-600 hover:border-black'}`}
              >
                +₹{quickAmount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="font-bold text-navy">Payment Method</h2>
          <div className="mt-4 flex items-center gap-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><CreditCard size={22} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">Razorpay</p>
              <p className="text-sm text-slate-500">UPI, Cards, Net Banking</p>
            </div>
            <CheckCircle2 className="text-blue-600" size={22} />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-emerald-600" /> Payments are securely processed by Razorpay.</p>
        </section>

        {pageError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="container-pb max-w-3xl">
          <button
            type="button"
            disabled={!validAmount || processing}
            onClick={proceedToPay}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {processing && <Loader2 size={18} className="animate-spin" />}
            {processing ? 'Processing…' : `Proceed To Pay ${formatMoney(validAmount ? amount : 0)}`}
          </button>
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 px-4" role="dialog" aria-modal="true" aria-labelledby="exit-payment-title">
          <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h2 id="exit-payment-title" className="text-xl font-bold text-navy">Are you sure you want to exit?</h2>
              <button type="button" onClick={() => setShowExitConfirm(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">You will be taken back to AV MANAGEMENT PRIVATE LIMITED app</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setShowExitConfirm(false)} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">Continue to payment</button>
              <button type="button" onClick={exitPayment} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-navy">Yes, exit</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
