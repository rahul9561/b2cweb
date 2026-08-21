// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { ArrowLeft, Shield, Smartphone } from 'lucide-react'

// export default function Login() {
//   const [phone, setPhone] = useState('')
//   const [sent, setSent] = useState(false)
//   const [otp, setOtp] = useState('')

//   const handleSend = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (phone.length === 10) setSent(true)
//   }

//   return (
//     <section className="bg-blueBG py-16">
//       <div className="container-pb flex justify-center">
//         <div className="w-full max-w-md">
//           <Link to="/" className="mb-6 inline-flex items-center gap-1 text-[13px] text-slate2-secondary hover:text-brand">
//             <ArrowLeft size={14} /> Back to Home
//           </Link>
//           <div className="rounded-cardlg bg-white p-8 shadow-card">
//             <div className="mb-6 text-center">
//               <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blueBG">
//                 <Shield size={28} className="text-brand" />
//               </span>
//               <h1 className="text-2xl font-medium text-navy">Welcome to AV Management</h1>
//               <p className="mt-2 text-[13px] text-slate2-secondary">
//                 {sent ? 'Enter the 4-digit OTP sent to your mobile' : 'Sign in to manage your policies'}
//               </p>
//             </div>

//             {!sent ? (
//               <form onSubmit={handleSend} className="space-y-4">
//                 <div>
//                   <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">
//                     Mobile Number
//                   </label>
//                   <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3.5 py-3 focus-within:border-brand">
//                     <span className="flex items-center gap-1 text-sm text-navy">
//                       <span className="rounded-[3px] border border-slate2-border px-1 py-0.5 text-[10px] font-bold text-brand">IN</span> +91
//                     </span>
//                     <span className="h-5 w-px bg-slate2-border" />
//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
//                       placeholder="Enter 10 digit mobile number"
//                       className="w-full text-sm text-navy placeholder:text-slate2-muted focus:outline-none"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={phone.length !== 10}
//                   className="w-full rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
//                 >
//                   Get OTP
//                 </button>
//                 <p className="text-center text-[11px] text-slate2-muted">
//                   By continuing, you agree to our T&amp;C and privacy policy.
//                 </p>
//               </form>
//             ) : (
//             <div className="space-y-4">
//   <div>
//     <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">
//       Enter OTP
//     </label>

//     <div className="flex justify-between gap-2">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <input
//           key={i}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={otp[i] || ''}
//           onChange={(e) => {
//             const v = e.target.value.replace(/\D/g, '')

//             const next = otp.split('')
//             next[i] = v
//             setOtp(next.join(''))

//             // Move to next box automatically
//             if (v && i < 5) {
//               const el = document.getElementById(`otp-${i + 1}`)
//               el?.focus()
//             }
//           }}
//           onKeyDown={(e) => {
//             // Move to previous box when Backspace is pressed
//             if (e.key === 'Backspace' && !otp[i] && i > 0) {
//               const el = document.getElementById(`otp-${i - 1}`)
//               el?.focus()
//             }
//           }}
//           id={`otp-${i}`}
//           className="h-14 w-12 rounded-lg border border-slate2-border text-center text-xl font-bold text-navy focus:border-brand focus:outline-none"
//         />
//       ))}
//     </div>
//   </div>

//   <button
//     onClick={() => {
//       if (otp.length === 6) {
//         setSent(true)
//         console.log('OTP:', otp)
//       }
//     }}
//     disabled={otp.length !== 6}
//     className="w-full rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
//   >
//     Verify & Sign in
//   </button>

//   <button
//     onClick={() => {
//       setSent(false)
//       setOtp('')
//     }}
//     className="w-full text-[13px] text-brand hover:underline"
//   >
//     Change mobile number
//   </button>
// </div>
//             )}

//             <div className="mt-6 border-t border-slate2-border pt-5">
//               <p className="mb-3 flex items-center justify-center gap-2 text-[13px] text-slate2-secondary">
//                 <Smartphone size={14} className="text-brand" /> Or continue with the app
//               </p>
//               <div className="grid grid-cols-2 gap-3">
//                 <button className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy hover:border-brand">
//                   Google Play
//                 </button>
//                 <button className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy hover:border-brand">
//                   App Store
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Shield, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const RESEND_COOLDOWN_SECONDS = 30

export default function Login() {
  const navigate = useNavigate()
  const { sendOtp, verifyOtp, resendOtp } = useAuth()

  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
const [showAppStorePopup, setShowAppStorePopup] = useState(false)

  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length !== 10 || sendingOtp) return
    setErrorMsg('')
    setSendingOtp(true)
    try {
      await sendOtp(phone)
      setSent(true)
      startCooldown()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerify = async () => {
    if (otp.length !== 6 || verifying) return
    setErrorMsg('')
    setVerifying(true)
    try {
      await verifyOtp(phone, otp)
      navigate('/')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid or expired OTP. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setErrorMsg('')
    setResending(true)
    try {
      await resendOtp(phone)
      setOtp('')
      startCooldown()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not resend OTP. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const handleChangeNumber = () => {
    setSent(false)
    setOtp('')
    setErrorMsg('')
    if (timerRef.current) clearInterval(timerRef.current)
    setCooldown(0)
  }

  return (
    <section className="bg-blueBG py-16">
      <div className="container-pb flex justify-center">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-[13px] text-slate2-secondary hover:text-brand">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="rounded-cardlg bg-white p-8 shadow-card">
            <div className="mb-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blueBG">
                <Shield size={28} className="text-brand" />
              </span>
              <h1 className="text-2xl font-medium text-navy">Welcome to AV Management</h1>
              <p className="mt-2 text-[13px] text-slate2-secondary">
                {sent ? `Enter the 6-digit OTP sent to +91 ${phone}` : 'Sign in to manage your policies'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
                {errorMsg}
              </div>
            )}

            {!sent ? (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">Mobile Number</label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3.5 py-3 focus-within:border-brand">
                    <span className="flex items-center gap-1 text-sm text-navy">
                      <span className="rounded-[3px] border border-slate2-border px-1 py-0.5 text-[10px] font-bold text-brand">IN</span> +91
                    </span>
                    <span className="h-5 w-px bg-slate2-border" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10 digit mobile number"
                      className="w-full text-sm text-navy placeholder:text-slate2-muted focus:outline-none"
                      disabled={sendingOtp}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={phone.length !== 10 || sendingOtp}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {sendingOtp && <Loader2 size={16} className="animate-spin" />}
                  {sendingOtp ? 'Sending OTP...' : 'Get OTP'}
                </button>
                <p className="text-center text-[11px] text-slate2-muted">
                  By continuing, you agree to our T&amp;C and privacy policy.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">Enter OTP</label>
                  <div className="flex justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[i] || ''}
                        disabled={verifying}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '')
                          const next = otp.split('')
                          next[i] = v
                          setOtp(next.join(''))
                          if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
                        }}
                        id={`otp-${i}`}
                        className="h-14 w-12 rounded-lg border border-slate2-border text-center text-xl font-bold text-navy focus:border-brand focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={otp.length !== 6 || verifying}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {verifying && <Loader2 size={16} className="animate-spin" />}
                  {verifying ? 'Verifying...' : 'Verify & Sign in'}
                </button>

                <div className="flex items-center justify-between">
                  <button onClick={handleChangeNumber} disabled={verifying} className="text-[13px] text-brand hover:underline disabled:opacity-50">
                    Change mobile number
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending || verifying}
                    className="text-[13px] font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:text-slate2-muted disabled:no-underline"
                  >
                    {resending ? 'Resending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-slate2-border pt-5">
              <p className="mb-3 flex items-center justify-center gap-2 text-[13px] text-slate2-secondary">
                <Smartphone size={14} className="text-brand" /> Or continue with the app
              </p>
             <div className="grid grid-cols-2 gap-3">
  {/* Google Play */}
  <a
    href="https://play.google.com/store/search?q=av%20management&c=apps&hl=en_IN"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy transition-all hover:border-brand hover:bg-blueBG"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 2.25v19.5L13.2 12 3 2.25Z" fill="#00D7FE" />
      <path d="m3 2.25 12.7 7.35-2.5 2.4L3 2.25Z" fill="#00F076" />
      <path d="m3 21.75 12.7-7.35-2.5-2.4L3 21.75Z" fill="#FFCE00" />
      <path d="m15.7 9.6 4.15 2.4-4.15 2.4-2.5-2.4 2.5-2.4Z" fill="#FF3A44" />
    </svg>

    Google Play
  </a>

  {/* App Store */}
  <button
    type="button"
    onClick={() => setShowAppStorePopup(true)}
    className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy transition-all hover:border-brand hover:bg-blueBG"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>

    App Store
  </button>
</div>
            </div>
          </div>
        </div>
      </div>
      {showAppStorePopup && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    onClick={() => setShowAppStorePopup(false)}
  >
    <div
      className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        type="button"
        onClick={() => setShowAppStorePopup(false)}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-navy"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Apple icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
        </svg>
      </div>

      <span className="mb-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-500">
        Coming Soon
      </span>

      <h2 className="mt-2 text-xl font-bold text-navy">
        AV Management for iOS
      </h2>

      <p className="mx-auto mt-3 max-w-[280px] text-[13px] leading-6 text-slate2-secondary">
        We're working on bringing the AV Management app to the App Store.
        Stay tuned — it's coming soon!
      </p>

      <button
        type="button"
        onClick={() => setShowAppStorePopup(false)}
        className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark"
      >
        Got it
      </button>
    </div>
  </div>
)}
    </section>
  )
}
