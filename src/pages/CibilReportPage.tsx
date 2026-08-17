import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Gauge,
  CheckCircle2,
  Star,
  CreditCard,
  Wallet,
  Ticket,
  QrCode,
  ArrowRight,
  Pencil,
} from 'lucide-react'

const fullIntro =
  "TransUnion CIBIL Limited (formerly, Credit Information Bureau (India) Limited) is the India's leading credit bureau or Credit Information Company (CIC) that collects and maintains records of individuals' payments pertaining to loans and credit cards. These records are submitted to CIBIL by its members, i.e. banks and other lending institutions, on a monthly basis. This information is then used to create Credit Information Reports (CIR) and credit scores, which are provided to credit institutions in order to help evaluate and approve loan applications."

const trustStats = [
  { value: '4.5/5', label: 'Google Play Store Rating', sub: '15.6L Reviews' },
  { value: '6Cr+', label: 'Satisfied Customers' },
  { value: '4', label: 'Bureau Coverage' },
  { value: '800+', label: 'Cities across India' },
]

const bureauLogos = ['CIBIL', 'Experian', 'Equifax', 'Crif']

export default function CibilReportPage() {
  const [expanded, setExpanded] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pan, setPan] = useState('')
  const [gender, setGender] = useState('')

  const handlePanChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    setPan(upper)
  }

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    setPhone(digits)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="bg-blueBG py-10 md:py-14">
        <div className="container-pb">
          <nav className="mb-4 flex items-center gap-1 text-[12px] text-slate2-muted">
            <Link to="/" className="hover:text-brand">Home</Link>
            <span>/</span>
            <span>Credit Score</span>
            <span>/</span>
            <span className="text-slate2-secondary">CIBIL Report</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Left column */}
            <div>
              <h1 className="text-3xl font-medium text-navy md:text-4xl">
                TransUnion CIBIL Score & Report
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate2-secondary">
                {expanded ? fullIntro : `${fullIntro.slice(0, 180)}...`}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 font-medium text-brand hover:underline"
                >
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              </p>

              {/* Why Check Credit Score */}
              <h2 className="mt-8 text-lg font-semibold text-navy">
                Why Check Credit Score on AV Management?
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  'Check Credit Score from All 4 Bureaus',
                  'Track Credit Score Seamlessly Every Month',
                  'Read Credit Report in Multiple Languages',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-full border border-slate2-border bg-white px-4 py-2.5"
                  >
                    <CheckCircle2 size={18} className="shrink-0 text-green-cta" />
                    <span className="text-[13px] font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>

              {/* Illustration */}
              <div className="mt-8 flex items-center gap-6">
                <div className="flex h-24 w-40 items-center justify-center rounded-cardlg bg-white shadow-card">
                  <CreditCard size={48} className="text-brand" />
                </div>
                <div className="flex h-24 w-40 items-center justify-center rounded-cardlg bg-white shadow-card">
                  <Wallet size={48} className="text-green-cta" />
                </div>
              </div>

              {/* Trust bar */}
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-card bg-white p-4 text-center shadow-card">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow text-yellow" />
                    ))}
                  </div>
                  <p className="mt-2 text-lg font-bold text-navy">4.5/5</p>
                  <p className="text-[11px] text-slate2-muted">Google Play Store</p>
                  <p className="text-[11px] font-medium text-slate2-secondary">15.6L Reviews</p>
                </div>
                {trustStats.slice(1).map((s) => (
                  <div key={s.label} className="rounded-card bg-white p-4 text-center shadow-card">
                    <p className="text-lg font-bold text-navy">{s.value}</p>
                    <p className="text-[11px] text-slate2-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card — Let's Get Started */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-cardlg bg-white shadow-card">
                {/* Top banner strip */}
                <div className="flex items-center gap-3 bg-brand px-5 py-4 text-white">
                  <Gauge size={28} className="shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      Check CIBIL Score & Report worth ₹1,200
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/85">
                      Chance to get Accidental Cover up to ₹1Lakh & more
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-navy">Let's Get Started</h2>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-slate2-secondary">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-brand"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-slate2-secondary">
                        Phone Number
                      </label>
                      <div className="flex items-center overflow-hidden rounded-lg border border-slate2-border focus-within:border-brand">
                        <span className="flex items-center gap-1.5 border-r border-slate2-border bg-blueBGMuted px-3 py-2.5">
                          <span className="text-base leading-none">🇮🇳</span>
                          <span className="text-sm font-medium text-navy">+91</span>
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full px-3.5 py-2.5 text-sm text-navy outline-none"
                          required
                        />
                        {phone.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setPhone('')}
                            className="px-3 text-slate2-muted hover:text-brand"
                            aria-label="Edit phone number"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PAN Number */}
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-slate2-secondary">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        value={pan}
                        onChange={(e) => handlePanChange(e.target.value)}
                        placeholder="Enter PAN Number"
                        className="w-full rounded-lg border border-slate2-border px-3.5 py-2.5 text-sm uppercase text-navy outline-none transition-colors focus:border-brand"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-slate2-secondary">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Male', 'Female', 'Other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors ${
                              gender === g
                                ? 'border-brand bg-blueBG text-brand'
                                : 'border-slate2-border text-slate2-secondary hover:border-brand/40'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate2-muted">
                      You will receive an OTP on mentioned number
                    </p>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                    >
                      Get CIBIL Report
                      <ArrowRight size={16} />
                    </button>

                    <p className="text-[10px] leading-4 text-slate2-muted">
                      By logging in, you agree to the following{' '}
                      <span className="text-brand">Credit Report Terms of Use</span>,{' '}
                      <span className="text-brand">Terms of Use</span> and{' '}
                      <span className="text-brand">Privacy Policy</span>{' '}
                      <button type="button" className="font-medium text-brand hover:underline">
                        More
                      </button>
                    </p>
                  </form>

                  {/* Powered by divider */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-1">
                      <span className="h-1 w-1 rotate-45 bg-slate2-border" />
                      <span className="h-px flex-1 bg-slate2-border" />
                      <span className="h-1 w-1 rotate-45 bg-slate2-border" />
                    </div>
                    <span className="text-[11px] italic uppercase tracking-wider text-slate2-muted">
                      Powered by
                    </span>
                    <div className="flex flex-1 items-center gap-1">
                      <span className="h-1 w-1 rotate-45 bg-slate2-border" />
                      <span className="h-px flex-1 bg-slate2-border" />
                      <span className="h-1 w-1 rotate-45 bg-slate2-border" />
                    </div>
                  </div>

                  {/* Bureau logos */}
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {bureauLogos.map((b) => (
                      <div
                        key={b}
                        className="flex items-center justify-center rounded-lg border border-slate2-border bg-white px-2 py-2.5"
                      >
                        <span className="text-[11px] font-bold tracking-wide text-navy">{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reports checked */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-green-cta" />
                    <span className="text-[12px] font-medium text-slate2-secondary">
                      6.1 Crore reports checked so far
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Referral Banner ── */}
      <section className="bg-navy py-6">
        <div className="container-pb flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Ticket size={32} className="shrink-0 text-yellow" />
            <div>
              <p className="text-sm font-semibold text-white">
                ₹2500 AV Wallet Cashback waiting for you!
              </p>
              <p className="mt-0.5 text-[12px] text-white/70">
                <span className="font-semibold underline">Invite your</span> loved ones with your
                unique Referral Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden h-16 w-16 items-center justify-center rounded-lg bg-white p-1.5 sm:flex">
              <QrCode size={48} className="text-navy" />
            </div>
            <button className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-blueBG">
              Refer Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}