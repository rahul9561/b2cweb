import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Lightbulb,
  ChevronDown,
  ArrowUp,
  MessageCircle,
  User,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import SipHeader from '../components/sip/SipHeader'
import Footer from '../components/Footer'
import {
  BestMutualFunds,
  IncreaseSipWealth,
  WhatIsSipCalculator,
  HowSipCalculatorWorks,
  BeatInflation,
  SipVsLumpsum,
  TypesOfSipCalculators,
} from '../components/sip/SipContentSections'
import {
  SipArticles,
  SipReviews,
  SipDisclaimer,
} from '../components/sip/SipPart3Sections'
import {
  calculateSip,
  formatIndianCurrency,
  formatIndianNumber,
  type InvestmentMode,
} from '../lib/sipCalculator'

/* ── Constants ── */
const BLUE = '#1163D0'
const GREEN = '#1FAD6B'
const ORANGE = '#FF6A00'

interface ModeConfig {
  label: string
  inputLabel: string
  min: number
  max: number
  step: number
  chips: number[]
  suffix: string
}

const modeConfigs: Record<InvestmentMode, ModeConfig> = {
  monthly: {
    label: 'Monthly SIP',
    inputLabel: 'Monthly Investment Amount',
    min: 500,
    max: 200000,
    step: 500,
    chips: [5000, 10000, 15000, 50000, 100000],
    suffix: '',
  },
  yearly: {
    label: 'Yearly SIP',
    inputLabel: 'Yearly Investment Amount',
    min: 1000,
    max: 3000000,
    step: 1000,
    chips: [12000, 20000, 50000, 150000, 500000],
    suffix: '',
  },
  lumpsum: {
    label: 'Lumpsum',
    inputLabel: 'Lumpsum Amount',
    min: 10000,
    max: 50000000,
    step: 10000,
    chips: [150000, 500000, 1000000, 5000000, 10000000],
    suffix: '',
  },
}

const tabs: InvestmentMode[] = ['monthly', 'yearly', 'lumpsum']

/* ── Slider component with filled track ── */
interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}

function Slider({ min, max, step, value, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="sip-range-fill" style={{ ['--fill' as string]: `${pct}%` }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sip-range"
        style={{
          background: `linear-gradient(to right, ${BLUE} 0%, ${BLUE} ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
        }}
      />
    </div>
  )
}

/* ── Pro Tip pill ── */
function ProTip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-tagBg px-2 py-0.5 text-[10px] font-medium text-orange-tag">
      <Lightbulb size={10} />
      Pro Tip
    </span>
  )
}

/* ── Toggle switch ── */
interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        checked ? 'bg-green-cta' : 'bg-gray-300'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

/* ── Donut chart card ── */
interface DonutCardProps {
  invested: number
  returns: number
  stepUpBonus: number
  stepUpEnabled: boolean
  totalWealth: number
}

function DonutCard({ invested, returns, stepUpBonus, stepUpEnabled, totalWealth }: DonutCardProps) {
  const data = useMemo(() => {
    const items = [
      { name: 'Amount Invested', value: invested, color: BLUE },
      { name: 'Est. Returns', value: returns, color: GREEN },
    ]
    if (stepUpEnabled && stepUpBonus > 0) {
      items.push({ name: 'Step-Up Bonus', value: stepUpBonus, color: ORANGE })
    }
    return items
  }, [invested, returns, stepUpBonus, stepUpEnabled])

  const total = invested + returns + (stepUpEnabled ? stepUpBonus : 0)
  const investedPct = total > 0 ? Math.round((invested / total) * 100) : 0
  const returnsPct = total > 0 ? Math.round((returns / total) * 100) : 0
  const bonusPct = total > 0 ? Math.round((stepUpBonus / total) * 100) : 0

  return (
    <div className="rounded-xl border border-slate2-border bg-white p-5 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Donut */}
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
                animationDuration={400}
                animationEasing="ease"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} className="donut-segment" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatIndianCurrency(Number(value))}
                contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate2-muted">Total Wealth</span>
            <span className="count-up text-[20px] font-bold text-navy">
              {formatIndianCurrency(totalWealth)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1 rounded-full" style={{ backgroundColor: BLUE }} />
            <div className="flex-1">
              <p className="text-[11px] text-slate2-secondary">Amount Invested</p>
              <p className="count-up text-[15px] font-bold text-navy">
                {formatIndianCurrency(invested)}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate2-secondary">
              {investedPct}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-8 w-1 rounded-full" style={{ backgroundColor: GREEN }} />
            <div className="flex-1">
              <p className="text-[11px] text-slate2-secondary">Est. Returns</p>
              <p className="count-up text-[15px] font-bold text-navy">
                {formatIndianCurrency(returns)}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate2-secondary">
              {returnsPct}%
            </span>
          </div>

          {stepUpEnabled && stepUpBonus > 0 && (
            <div className="flex items-center gap-2">
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: ORANGE }} />
              <div className="flex-1">
                <p className="text-[11px] text-slate2-secondary">Step-Up Bonus</p>
                <p className="count-up text-[15px] font-bold text-navy">
                  {formatIndianCurrency(stepUpBonus)}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate2-secondary">
                {bonusPct}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Comparison card ── */
interface ComparisonCardProps {
  label: string
  value: string
  subText: string
  highlighted?: boolean
  multiplier?: string
}

function ComparisonCard({ label, value, subText, highlighted, multiplier }: ComparisonCardProps) {
  return (
    <div
      className={`flex-1 rounded-xl border p-4 ${
        highlighted
          ? 'border-green-cta bg-green-cta/5'
          : 'border-slate2-border bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate2-secondary">{label}</span>
        {multiplier && (
          <span className="rounded-full bg-green-cta px-2 py-0.5 text-[10px] font-bold text-white">
            {multiplier}
          </span>
        )}
      </div>
      <p className={`count-up mt-1 text-[20px] font-bold ${highlighted ? 'text-green-cta' : 'text-navy'}`}>
        {value}
      </p>
      <p className="text-[10px] text-slate2-muted">{subText}</p>
    </div>
  )
}

/* ── Main Page ── */
export default function SipCalculatorPage() {
  const [mode, setMode] = useState<InvestmentMode>('monthly')
  const [amount, setAmount] = useState(10000)
  const [years, setYears] = useState(17)
  const [rate, setRate] = useState(17)
  const [stepUpEnabled, setStepUpEnabled] = useState(false)
  const [stepUpPct, setStepUpPct] = useState(10)
  const [inputMode, setInputMode] = useState<'investment' | 'goal'>('investment')
  const [name, setName] = useState('The Developer')
  const [mobile, setMobile] = useState('78xxxxx007')
  const [whatsappOn, setWhatsappOn] = useState(true)
  const [debouncedAmount, setDebouncedAmount] = useState(amount)
  const [debouncedYears, setDebouncedYears] = useState(years)
  const [debouncedRate, setDebouncedRate] = useState(rate)
  const [debouncedStepUpPct, setDebouncedStepUpPct] = useState(stepUpPct)

  const cfg = modeConfigs[mode]

  /* Debounce inputs ~150ms */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedAmount(amount), 150)
    return () => clearTimeout(t)
  }, [amount])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedYears(years), 150)
    return () => clearTimeout(t)
  }, [years])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedRate(rate), 150)
    return () => clearTimeout(t)
  }, [rate])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedStepUpPct(stepUpPct), 150)
    return () => clearTimeout(t)
  }, [stepUpPct])

  /* Calculation */
  const result = useMemo(
    () =>
      calculateSip({
        mode,
        amount: debouncedAmount,
        years: debouncedYears,
        annualRate: debouncedRate,
        stepUpPct: debouncedStepUpPct,
        stepUpEnabled,
      }),
    [mode, debouncedAmount, debouncedYears, debouncedRate, debouncedStepUpPct, stepUpEnabled]
  )

  const displayTotal = stepUpEnabled ? result.stepUpTotalWealth : result.totalWealth
  const displayInvested = stepUpEnabled ? result.stepUpAmountInvested : result.amountInvested
  const displayReturns = stepUpEnabled ? result.stepUpEstReturns : result.estReturns

  const extraEarnings = stepUpEnabled ? result.stepUpBonus : 0

  /* Handle mode change — reset amount to a sensible default */
  const handleModeChange = (m: InvestmentMode) => {
    setMode(m)
    if (m === 'monthly') setAmount(10000)
    else if (m === 'yearly') setAmount(120000)
    else setAmount(500000)
  }

  const handleChip = (v: number) => {
    setAmount(v)
  }

  const handleAmountInput = (raw: string) => {
    const num = Number(raw.replace(/[^0-9]/g, ''))
    if (!isNaN(num)) {
      const clamped = Math.min(Math.max(num, cfg.min), cfg.max)
      setAmount(clamped)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SipHeader />

      {/* Page Title Row */}
      <section className="border-b border-slate2-border bg-white">
        <div className="container-pb flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-bold text-[#1A2233]">SIP Calculator</h1>
          <div className="flex rounded-lg border border-slate2-border p-1">
            <button
              onClick={() => setInputMode('investment')}
              className={`rounded-md px-4 py-2 text-[12px] font-medium transition-colors ${
                inputMode === 'investment'
                  ? 'bg-[#1A2233] text-white'
                  : 'bg-white text-slate2-secondary hover:text-navy'
              }`}
            >
              I know my investment amount
            </button>
            <button
              onClick={() => setInputMode('goal')}
              className={`rounded-md px-4 py-2 text-[12px] font-medium transition-colors ${
                inputMode === 'goal'
                  ? 'bg-[#1A2233] text-white'
                  : 'bg-white text-slate2-secondary hover:text-navy'
              }`}
            >
              I know my goal amount
            </button>
          </div>
        </div>
      </section>

      {/* Calculator Card */}
      <section className="container-pb py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT — Inputs */}
          <div className="rounded-xl border border-slate2-border bg-white p-6 shadow-sm">
            {/* Tab bar */}
            <div className="mb-6 flex gap-1 border-b border-slate2-border">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => handleModeChange(t)}
                  className={`border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    mode === t
                      ? 'border-brand text-brand'
                      : 'border-transparent text-slate2-secondary hover:text-navy'
                  }`}
                >
                  {modeConfigs[t].label}
                </button>
              ))}
            </div>

            {/* Input 1 — Amount */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] font-medium text-navy">
                  {cfg.inputLabel}
                  <ProTip />
                </label>
                <div className="flex items-center gap-1 rounded-lg border border-slate2-border px-3 py-1.5">
                  <span className="text-[13px] font-semibold text-slate2-secondary">₹</span>
                  <input
                    type="text"
                    value={formatIndianNumber(amount)}
                    onChange={(e) => handleAmountInput(e.target.value)}
                    className="w-24 text-right text-[14px] font-bold text-navy outline-none"
                  />
                </div>
              </div>
              <Slider
                min={cfg.min}
                max={cfg.max}
                step={cfg.step}
                value={amount}
                onChange={setAmount}
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate2-muted">
                <span>₹{formatIndianNumber(cfg.min)}</span>
                <span>₹{formatIndianNumber(cfg.max)}</span>
              </div>

              {/* Quick-pick chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {cfg.chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleChip(c)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      amount === c
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-slate2-border bg-gray-50 text-slate2-secondary hover:border-brand hover:text-brand'
                    }`}
                  >
                    ₹{formatIndianNumber(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2 — Years */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] font-medium text-navy">
                  Investment Period (Years)
                  <ProTip />
                </label>
                <div className="flex items-center gap-1 rounded-lg border border-slate2-border px-3 py-1.5">
                  <input
                    type="text"
                    value={years}
                    onChange={(e) => {
                      const v = Number(e.target.value.replace(/[^0-9]/g, ''))
                      if (!isNaN(v)) setYears(Math.min(Math.max(v, 1), 40))
                    }}
                    className="w-12 text-right text-[14px] font-bold text-navy outline-none"
                  />
                  <span className="text-[11px] text-slate2-muted">Yrs</span>
                </div>
              </div>
              <Slider min={1} max={40} step={1} value={years} onChange={setYears} />
              <div className="mt-1 flex justify-between text-[10px] text-slate2-muted">
                <span>1</span>
                <span>40</span>
              </div>
            </div>

            {/* Input 3 — Rate */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] font-medium text-navy">
                  Expected Annual Return
                  <ProTip />
                </label>
                <div className="flex items-center gap-1 rounded-lg border border-slate2-border px-3 py-1.5">
                  <input
                    type="text"
                    value={rate}
                    onChange={(e) => {
                      const v = Number(e.target.value.replace(/[^0-9.]/g, ''))
                      if (!isNaN(v)) setRate(Math.min(Math.max(v, 1), 30))
                    }}
                    className="w-10 text-right text-[14px] font-bold text-navy outline-none"
                  />
                  <span className="text-[11px] text-slate2-muted">% p.a.</span>
                </div>
              </div>
              <Slider min={1} max={30} step={0.5} value={rate} onChange={setRate} />
              <div className="mt-1 flex justify-between text-[10px] text-slate2-muted">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Input 4 — Step-Up */}
            <div className="rounded-xl border border-slate2-border bg-gray-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                    <ArrowUp size={16} className="text-brand" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-navy">Annual Step-Up</p>
                    <p className="text-[11px] text-slate2-secondary">
                      Increase SIP every year to grow wealth faster
                    </p>
                  </div>
                </div>
                <Toggle checked={stepUpEnabled} onChange={setStepUpEnabled} />
              </div>

              {/* Step-up percentage (expandable) */}
              <div className={`step-up-expand ${stepUpEnabled ? 'open' : ''}`}>
                <div className="mt-4 border-t border-slate2-border pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[12px] font-medium text-navy">Step-Up Percentage</label>
                    <span className="text-[13px] font-bold text-brand">{stepUpPct}%</span>
                  </div>
                  <Slider min={1} max={50} step={1} value={stepUpPct} onChange={setStepUpPct} />
                  <div className="mt-1 flex justify-between text-[10px] text-slate2-muted">
                    <span>1%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="space-y-4">
            <DonutCard
              invested={displayInvested}
              returns={displayReturns}
              stepUpBonus={result.stepUpBonus}
              stepUpEnabled={stepUpEnabled}
              totalWealth={displayTotal}
            />

            {/* Comparison card */}
            {!stepUpEnabled ? (
              <div className="rounded-xl border border-slate2-border bg-white p-5 shadow-sm">
                <span className="text-[11px] text-slate2-secondary">Without Step-Up</span>
                <p className="count-up mt-1 text-[24px] font-bold text-navy">
                  {formatIndianCurrency(displayTotal)}
                </p>
                <p className="text-[11px] text-slate2-muted">
                  Regular SIP • {rate}% p.a.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <ComparisonCard
                  label="Without Step-Up"
                  value={formatIndianCurrency(result.totalWealth)}
                  subText={`Regular SIP • ${rate}% p.a.`}
                />
                <ComparisonCard
                  label="Step-Up"
                  value={formatIndianCurrency(result.stepUpTotalWealth)}
                  subText={`${stepUpPct}% annual step-up`}
                  highlighted
                  multiplier="1.0x"
                />
              </div>
            )}

            {/* Callout banner */}
            <div className="flex items-start gap-3 rounded-xl bg-orange-tagBg p-4">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-orange-tag" />
              <p className="text-[12px] leading-5 text-navy">
                {stepUpEnabled ? (
                  <>
                    With <strong>{stepUpPct}% step-up</strong>, you earn{' '}
                    <strong>{formatIndianCurrency(extraEarnings)}</strong> extra vs regular SIP over{' '}
                    <strong>{years} years</strong>
                  </>
                ) : (
                  <>
                    You can earn <strong>{formatIndianCurrency(extraEarnings)}</strong> extra vs
                    regular SIP over <strong>{years} years</strong> with{' '}
                    <strong>{stepUpPct}% step-up</strong>
                  </>
                )}
              </p>
            </div>

            {/* Mobile-only buttons */}
            <div className="flex gap-3 lg:hidden">
              <button className="flex-1 rounded-lg border border-brand py-2.5 text-[13px] font-medium text-brand">
                View breakdown
              </button>
              <button className="flex-1 rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white">
                View plans
              </button>
            </div>

            {/* Desktop View plans */}
            <div className="hidden justify-end lg:flex">
              <button className="rounded-lg bg-brand px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark">
                View plans
              </button>
            </div>
          </div>
        </div>

        {/* Lead capture strip */}
        <div className="mt-8 rounded-xl border border-slate2-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-[16px] font-semibold text-navy">Top Performing Funds SIP</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-medium text-slate2-secondary">
                Your Name
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3 py-2.5">
                <User size={14} className="text-slate2-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-[13px] text-navy outline-none"
                  placeholder="Your Name"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-medium text-slate2-secondary">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate2-border px-3 py-2.5">
                <span className="flex items-center gap-1 text-[12px] font-medium text-navy">
                  India <ChevronDown size={12} />
                </span>
                <span className="text-[12px] text-slate2-muted">+91</span>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-[13px] text-navy outline-none"
                  placeholder="Mobile Number"
                />
              </div>
            </div>
            <button className="rounded-lg bg-brand px-8 py-3 text-[13px] font-bold text-white transition-colors hover:bg-brand-dark">
              View Plans
            </button>
          </div>
          <p className="mt-3 text-[10px] text-slate2-muted">
            By clicking on "View Plans" you agreed to our{' '}
            <a href="#" className="text-brand underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-brand underline">Terms of use</a>
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate2-border pt-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-green-cta" />
              <span className="text-[12px] font-medium text-navy">Get Updates on WhatsApp</span>
            </div>
            <Toggle checked={whatsappOn} onChange={setWhatsappOn} />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="mt-6 flex items-center gap-1 text-[11px] text-slate2-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to="/calculators" className="hover:text-brand">SIP Investment</Link>
          <span>/</span>
          <span className="text-slate2-secondary">SIP Calculator</span>
        </nav>

        {/* Disclaimer */}
        {/* <div className="mt-8">
          <DisclaimerAccordion />
        </div> */}
      </section>

      {/* ── Part 2: Content Sections ── */}
      <BestMutualFunds />
      <IncreaseSipWealth />
      <WhatIsSipCalculator />
      <HowSipCalculatorWorks />
      <BeatInflation />
      <SipVsLumpsum />
      <TypesOfSipCalculators />

      {/* ── Part 3: Articles, Reviews, Disclaimer ── */}
      <SipArticles />
      <SipReviews />
      <SipDisclaimer />

      <Footer />
    </div>
  )
}
