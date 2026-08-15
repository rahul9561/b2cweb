import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import { useLeadFormValidation, type CountryCode } from '../hooks/useLeadFormValidation'
import logo from '../assets/images/av-logon.png'

const countries: { code: CountryCode; label: string }[] = [
  { code: '+91', label: 'India' },
  { code: '+1', label: 'USA' },
  { code: '+971', label: 'UAE' },
  { code: '+44', label: 'UK' },
]

export default function InvestmentLeadPage() {
  const navigate = useNavigate()
  const form = useLeadFormValidation()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.validate()) return
    form.setSubmitting(true)
    window.setTimeout(() => {
      const params = new URLSearchParams({
        name: form.values.name.trim(),
        mobile: `${form.values.country}${form.values.mobile}`,
        city: 'Lucknow',
        age: '23',
      })
      navigate(`/investment-plans/quotes?${params.toString()}`, { state: form.values })
    }, 450)
  }

  return (
    <main className="min-h-screen bg-[#f2f6ff]">
      <header className="border-b border-gray-800 bg-black shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <a href="/" className="flex items-center">
          <img src={logo} alt="AV Management" className="h-12 w-auto object-contain" />
        </a>
        <a href="tel:18002088787" className="rounded-lg bg-green-cta px-5 py-3 text-sm font-black text-white">
          Talk to Expert
        </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-2 lg:grid-cols-[1fr_430px] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand">AV Management Investment Plans</p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight text-navy md:text-5xl">
            Grow wealth with market-linked and guaranteed investment plans
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate2-secondary">
            Compare capital guarantee, ULIP, pension and high life-cover plans with expert guidance and transparent benefits.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [TrendingUp, '7 year performance view'],
              [ShieldCheck, 'Goal protection options'],
              [Wallet, 'Tax-saving plan tags'],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof TrendingUp
              return (
                <div key={label as string} className="rounded-xl bg-white p-4 shadow-card">
                  <ItemIcon className="mb-3 h-7 w-7 text-brand" />
                  <p className="text-sm font-bold text-navy">{label as string}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[22px] bg-white p-6 shadow-[0_16px_42px_rgba(23,43,77,0.16)]"
        >
          <h2 className="text-2xl font-black text-navy">View Investment Plans</h2>
          <p className="mt-2 text-sm text-slate2-secondary">Enter your details to see personalised quotes.</p>

          <Field label="Your Name" error={form.errors.name}>
            <input
              ref={form.refs.name}
              value={form.values.name}
              onBlur={() => form.blurField('name')}
              onChange={(event) => form.setField('name', event.target.value)}
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none ${form.errors.name ? 'border-red-500' : 'border-slate2-border focus:border-brand'}`}
              placeholder="Enter full name"
            />
          </Field>

          <Field label="Mobile Number" error={form.errors.mobile}>
            <div className={`flex h-12 overflow-hidden rounded-lg border ${form.errors.mobile ? 'border-red-500' : 'border-slate2-border focus-within:border-brand'}`}>
              <select
                value={form.values.country}
                onChange={(event) => form.setField('country', event.target.value as CountryCode)}
                className="w-28 border-r border-slate2-border bg-white px-3 text-sm font-bold outline-none"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.code} {country.label}</option>
                ))}
              </select>
              <input
                ref={form.refs.mobile}
                value={form.values.mobile}
                onBlur={() => form.blurField('mobile')}
                onChange={(event) => form.setField('mobile', event.target.value.replace(/\D/g, '').slice(0, 12))}
                className="min-w-0 flex-1 px-4 text-sm outline-none"
                placeholder="10-digit number"
                inputMode="numeric"
              />
            </div>
          </Field>

          <Field label="Your Email (Optional)" error={form.errors.email}>
            <input
              ref={form.refs.email}
              value={form.values.email}
              onBlur={() => form.blurField('email')}
              onChange={(event) => form.setField('email', event.target.value)}
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none ${form.errors.email ? 'border-red-500' : 'border-slate2-border focus:border-brand'}`}
              placeholder="name@example.com"
            />
          </Field>

          <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-navy">
            <input
              type="checkbox"
              checked={form.values.whatsapp}
              onChange={(event) => form.setField('whatsapp', event.target.checked)}
              className="h-4 w-4 accent-green-cta"
            />
            Get updates on WhatsApp
          </label>

          <p className="mt-4 text-xs leading-5 text-slate2-secondary">
            By clicking View Investment Plans, you agree to AV Management's <a className="text-brand">Privacy Policy</a> and <a className="text-brand">Terms</a>.
          </p>

          <button
            disabled={form.isSubmitting}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {form.isSubmitting ? 'Loading plans...' : 'View Investment Plans'} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-cta">
            <CheckCircle2 className="h-4 w-4" /> Secure quote journey with expert support
          </p>
        </motion.form>
      </section>
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block text-sm font-bold text-navy">{label}</span>
      {children}
      {error && (
        <span className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-500">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {error}
        </span>
      )}
    </label>
  )
}
