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
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CircleAlert, Loader2, Shield, Smartphone, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isRequiredProfileComplete } from '../lib/profileApi'

const RESEND_COOLDOWN_SECONDS = 30

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sendOtp, verifyOtp, resendOtp, refreshProfile } = useAuth()
  const loginRouteState = location.state as { authToast?: string } | null

  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [authToast, setAuthToast] = useState(loginRouteState?.authToast ?? '')
  const [showAppStorePopup, setShowAppStorePopup] = useState(false)

  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (!authToast) return
    const timeoutId = window.setTimeout(() => setAuthToast(''), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [authToast])

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
      const verifiedUser = await verifyOtp(phone, otp)
      const currentUser = await refreshProfile().catch(() => verifiedUser)
      const profileComplete = isRequiredProfileComplete(currentUser)
      navigate(profileComplete ? '/' : '/profile', profileComplete ? undefined : { state: { firstLogin: true } })
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
    <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#080e1e] via-[#0d1b3e] to-[#060a16] px-4 py-12 text-white sm:py-16">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[120px]" />

      {authToast && (
        <div role="alert" aria-live="assertive" className="fixed right-4 top-24 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-red-500/30 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:right-6">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <CircleAlert size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white">Login required</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-300">{authToast}</p>
          </div>
          <button type="button" aria-label="Dismiss login message" onClick={() => setAuthToast('')} className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 hover:text-white">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="rounded-3xl border border-white/20 bg-slate-900/60 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl ring-1 ring-white/10 sm:p-9">
          <div className="mb-7 text-center">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 shadow-inner">
              <Shield size={30} className="text-blue-400" />
            </span>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Welcome to AV Management</h1>
            <p className="mt-2 text-xs text-slate-300 sm:text-sm">
              {sent ? `Enter the 6-digit OTP sent to +91 ${phone}` : 'Sign in to manage your policies and credit reports'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300">
              {errorMsg}
            </div>
          )}

          {!sent ? (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-200">Mobile Number</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 transition focus-within:border-blue-400 focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-blue-400/25">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <span className="rounded-md border border-blue-400/30 bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">IN</span> +91
                  </span>
                  <span className="h-5 w-px bg-white/20" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10 digit mobile number"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                    disabled={sendingOtp}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={phone.length !== 10 || sendingOtp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                {sendingOtp && <Loader2 size={16} className="animate-spin" />}
                {sendingOtp ? 'Sending OTP...' : 'Get OTP'}
              </button>
              <p className="text-center text-[11px] text-slate-400">
                By continuing, you agree to our Terms &amp; Conditions and Privacy Policy.
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-200">Enter OTP</label>
                <div className="flex justify-between gap-2 sm:gap-2.5">
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
                      className="h-13 w-10 sm:h-14 sm:w-12 rounded-xl border border-white/20 bg-white/[0.07] text-center text-xl sm:text-2xl font-bold text-white shadow-inner transition focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-400/30 focus:outline-none disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || verifying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-blue-600/50 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                {verifying && <Loader2 size={16} className="animate-spin" />}
                {verifying ? 'Verifying...' : 'Verify & Sign in'}
              </button>

              <div className="flex items-center justify-between text-xs sm:text-[13px]">
                <button onClick={handleChangeNumber} disabled={verifying} className="font-medium text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50">
                  Change mobile number
                </button>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending || verifying}
                  className="font-medium text-blue-400 hover:text-blue-300 hover:underline disabled:cursor-not-allowed disabled:text-slate-500 disabled:no-underline"
                >
                  {resending ? 'Resending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="mb-3.5 flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
              <Smartphone size={15} className="text-blue-400" /> Or continue with the app
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Google Play */}
              <a
                href="https://play.google.com/store/search?q=av%20management&c=apps&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
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
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
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

      {showAppStorePopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          onClick={() => setShowAppStorePopup(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 p-7 text-center text-white shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowAppStorePopup(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-white/20 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Apple icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md">
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
              </svg>
            </div>

            <span className="mb-2 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Coming Soon
            </span>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
              AV Management for iOS
            </h2>

            <p className="mx-auto mt-3 max-w-[280px] text-xs leading-6 text-slate-300">
              We're working on bringing the AV Management app to the App Store.
              Stay tuned — it's coming soon!
            </p>

            <button
              type="button"
              onClick={() => setShowAppStorePopup(false)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:brightness-110 active:scale-[0.99]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
