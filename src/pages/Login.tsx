import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Smartphone } from 'lucide-react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 10) setSent(true)
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
              <h1 className="text-2xl font-medium text-navy">Welcome to Policybazaar</h1>
              <p className="mt-2 text-[13px] text-slate2-secondary">
                {sent ? 'Enter the 4-digit OTP sent to your mobile' : 'Sign in to manage your policies'}
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">
                    Mobile Number
                  </label>
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
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={phone.length !== 10}
                  className="w-full rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  Get OTP
                </button>
                <p className="text-center text-[11px] text-slate2-muted">
                  By continuing, you agree to our T&amp;C and privacy policy.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate2-secondary">
                    Enter OTP
                  </label>
                  <div className="flex gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={otp[i] || ''}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '')
                          const next = otp.split('')
                          next[i] = v
                          setOtp(next.join(''))
                          if (v && i < 3) {
                            const el = document.getElementById(`otp-${i + 1}`)
                            el?.focus()
                          }
                        }}
                        id={`otp-${i}`}
                        className="h-14 w-14 rounded-lg border border-slate2-border text-center text-xl font-bold text-navy focus:border-brand focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSent(true)}
                  className="w-full rounded-lg bg-brand py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                >
                  Verify & Sign in
                </button>
                <button
                  onClick={() => setSent(false)}
                  className="w-full text-[13px] text-brand hover:underline"
                >
                  Change mobile number
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-slate2-border pt-5">
              <p className="mb-3 flex items-center justify-center gap-2 text-[13px] text-slate2-secondary">
                <Smartphone size={14} className="text-brand" /> Or continue with the app
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy hover:border-brand">
                  Google Play
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate2-border py-2.5 text-[13px] font-medium text-navy hover:border-brand">
                  App Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
