import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Shield, Car, HeartPulse, FileText, IndianRupee } from 'lucide-react'

const calculators = [
  { icon: TrendingUp, title: 'SIP Calculator', desc: 'Estimate returns on your monthly SIP investments', active: true, to: '/sip-calculator' },
  { icon: FileText, title: 'Income Tax Calculator', desc: 'Calculate your tax liability under old and new regime', active: false, to: '/income-tax-calculator' },
  { icon: Shield, title: 'Term Insurance Calculator', desc: 'Find out the right life cover for your family', active: false },
  { icon: Car, title: 'Car Loan EMI Calculator', desc: 'Plan your monthly EMI on a car loan', active: false },
  { icon: HeartPulse, title: 'Health Insurance Premium', desc: 'Estimate the premium for your health plan', active: false },
  { icon: IndianRupee, title: 'NPS Calculator', desc: 'Project your pension corpus and monthly annuity', active: false },
]

function formatINR(n: number) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState(0)
  const [monthly, setMonthly] = useState(10000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(12)

  const totalInvested = monthly * 12 * years
  const m = rate / 12 / 100
  const n = years * 12
  const futureValue = totalInvested > 0 ? Math.round((monthly * ((Math.pow(1 + m, n) - 1) / m) * (1 + m))) : 0
  const estReturns = futureValue - totalInvested

  return (
    <div>
      <section className="bg-blueBG py-12">
        <div className="container-pb">
          <nav className="mb-4 flex items-center gap-1 text-[12px] text-slate2-muted">
            <Link to="/" className="hover:text-brand">Home</Link>
            <span>/</span>
            <span className="text-slate2-secondary">Calculators</span>
          </nav>
          <h1 className="text-3xl font-medium text-navy">Financial Calculators</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate2-secondary">
            Plan your investments, insurance and loans with our free financial calculators. Make
            informed decisions in minutes.
          </p>
        </div>
      </section>

      <section className="container-pb grid gap-8 py-12 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-3">
          <p className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
            <Calculator size={18} className="text-brand" /> Choose a calculator
          </p>
          {calculators.map((c, i) => {
            const Icon = c.icon
            const active = activeCalc === i
            return (
              <button
                key={c.title}
                onClick={() => {
                  if (c.to) {
                    window.location.href = c.to
                    return
                  }
                  setActiveCalc(i)
                }}
                className={`flex w-full items-start gap-3 rounded-card p-4 text-left transition-colors ${
                  active ? 'bg-brand text-white shadow-card' : 'bg-blueBGMuted hover:bg-blueBG'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-brand'} />
                <div>
                  <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-navy'}`}>
                    {c.title}
                  </p>
                  <p className={`text-[12px] leading-4 ${active ? 'text-white/80' : 'text-slate2-secondary'}`}>
                    {c.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </aside>

        <div className="rounded-cardlg bg-white p-8 shadow-card">
          <h2 className="mb-6 text-xl font-medium text-navy">{calculators[activeCalc].title}</h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] font-medium text-slate2-secondary">
                    Monthly Investment
                  </label>
                  <span className="text-sm font-bold text-brand">₹{formatINR(monthly)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] font-medium text-slate2-secondary">
                    Investment Period
                  </label>
                  <span className="text-sm font-bold text-brand">{years} years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] font-medium text-slate2-secondary">
                    Expected Return Rate
                  </label>
                  <span className="text-sm font-bold text-brand">{rate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
            </div>

            <div className="rounded-card bg-blueBG p-6">
              <p className="mb-5 text-[13px] font-medium text-slate2-secondary">Projected Value</p>
              <div className="mb-5">
                <p className="text-4xl font-bold text-brand">₹{formatINR(futureValue)}</p>
                <p className="mt-1 text-[12px] text-slate2-muted">at the end of {years} years</p>
              </div>
              <div className="space-y-2 border-t border-slate2-border pt-4 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate2-secondary">Total Invested</span>
                  <span className="font-semibold text-navy">₹{formatINR(totalInvested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate2-secondary">Est. Returns</span>
                  <span className="font-semibold text-green-cta">+ ₹{formatINR(estReturns)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
