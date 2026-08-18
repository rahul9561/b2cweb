import React, { useEffect, useRef, useState } from 'react'
import { Check, Loader2, MessageSquare, RefreshCw, ShieldCheck, X } from 'lucide-react'

interface OTPModalProps {
  phoneNumber: string
  onVerify: (otp: string) => Promise<void>
  onClose: () => void
  onResendOtp?: () => Promise<void>
}

const OTPModal: React.FC<OTPModalProps> = ({ phoneNumber, onVerify, onClose, onResendOtp }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(30)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const otp = digits.join('')

  useEffect(() => {
    if (resendTimer === 0) return
    const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendTimer])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  const setOTP = (value: string, startAt = 0) => {
    const next = [...digits]
    value.replace(/\D/g, '').slice(0, 6 - startAt).split('').forEach((digit, offset) => { next[startAt + offset] = digit })
    setDigits(next)
    const focusIndex = Math.min(startAt + value.replace(/\D/g, '').slice(0, 6 - startAt).length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const updateDigit = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length > 1) return setOTP(cleanValue, index)
    const next = [...digits]
    next[index] = cleanValue
    setDigits(next)
    if (cleanValue && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const resend = async () => {
    if (resendTimer || resending || !onResendOtp) return
    setResending(true)
    try {
      await onResendOtp()
      setDigits(['', '', '', '', '', ''])
      setResendTimer(30)
      inputRefs.current[0]?.focus()
    } catch {
      // error handled by parent
    } finally {
      setResending(false)
    }
  }

  const handleVerify = async () => {
    if (verifying || otp.length !== 6) return
    setVerifying(true)
    try {
      await onVerify(otp)
    } catch {
      // error handled by parent
    } finally {
      setVerifying(false)
    }
  }

  const maskedPhone = `+91-xxxxxx${phoneNumber.slice(-4)}`
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="otp-title">
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/30 transition-all duration-300 animate-[pulse_0.35s_ease-out_1]">
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600"><ShieldCheck size={14} /> Secure verification</p><h2 id="otp-title" className="text-2xl font-bold text-navy">Verify Mobile Number</h2></div><button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close verification"><X size={22} /></button></header>
      <div className="px-6 py-7 sm:px-8"><p className="text-center text-sm leading-6 text-slate-500">We sent a one-time password to<br /><strong className="font-semibold text-navy">{maskedPhone}</strong></p>
        <div className="mt-7"><label className="block text-center text-sm font-semibold text-navy">Enter 6-digit OTP</label><div className="mt-4 flex justify-center gap-2 sm:gap-3">{digits.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element }} value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus(); if (event.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus(); if (event.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus() }} onPaste={(event) => { event.preventDefault(); setOTP(event.clipboardData.getData('text'), index) }} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`OTP digit ${index + 1}`} maxLength={6} className={`h-12 w-11 rounded-xl border-2 text-center text-xl font-bold outline-none transition sm:h-14 sm:w-12 ${digit ? 'border-blue-500 bg-blue-50 text-navy' : 'border-slate-200 bg-white'} focus:border-blue-600 focus:ring-4 focus:ring-blue-100`} />)}</div></div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-center"><p className="text-sm text-slate-600">{resendTimer > 0 ? <>Resend OTP in <strong className="tabular-nums text-navy">{resendTimer}</strong> seconds</> : (resending ? 'Resending…' : "Didn't receive the OTP?")}</p><button onClick={resend} disabled={resendTimer > 0 || resending || !onResendOtp} className={`mx-auto mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${resendTimer > 0 || resending || !onResendOtp ? 'cursor-not-allowed bg-slate-200 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700'}`}><MessageSquare size={16} />{resendTimer > 0 ? 'SMS Resend' : <><RefreshCw size={15} className={resending ? 'animate-spin' : undefined} /> SMS Resend</>}</button></div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-blue-600" />Remember this device</label>
        <button onClick={handleVerify} disabled={verifying || otp.length !== 6} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition ${verifying || otp.length !== 6 ? 'cursor-not-allowed bg-slate-200' : 'bg-blue-600 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 hover:bg-blue-700'}`}>
          {verifying ? <><Loader2 size={18} className="animate-spin" /> Verifying…</> : <><Check size={18} />Verify OTP</>}
        </button>
      </div>
      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500">For your security, never share this OTP with anyone.</footer>
    </div>
  </div>
}

export default OTPModal
