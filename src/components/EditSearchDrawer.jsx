import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, X } from 'lucide-react'
import { SUM_INSURED_OPTIONS } from '../data/groupHealthPlans'

const POPULAR_CITIES = ['Delhi', 'Gurgaon', 'Mumbai', 'Pune', 'Bengaluru', 'Ahmedabad']

const AGE_BRACKETS = ['19-35 years', '36-45 years', '46-55 years', '56-65 years']

/* ── Floating label input ── */
function FloatingInput({ value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  const active = focused || String(value).length > 0

  return (
    <div className="relative rounded-lg border border-slate2-border bg-white transition-colors focus-within:border-brand">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? '' : placeholder}
        className="w-full rounded-lg px-3.5 pb-2.5 pt-5 text-[13px] font-semibold text-navy outline-none"
      />
      <span
        className={`pointer-events-none absolute left-3.5 transition-all ${
          active
            ? 'top-1.5 text-[10px] font-medium text-slate2-muted'
            : 'top-1/2 -translate-y-1/2 text-[13px] text-slate2-muted'
        }`}
      >
        {placeholder}
      </span>
    </div>
  )
}

/* ── Illustrated option card (reused from Part 1 Step 2) ── */
function InsureGroupCard({ type, selected, onClick }) {
  const isFamily = type === 'employeeSpouseKids'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer rounded-cardlg border-2 p-4 text-left transition-all ${
        selected ? 'border-brand bg-brand/5' : 'border-slate2-border bg-white hover:border-brand/50'
      }`}
    >
      <span
        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          selected ? 'bg-brand text-white' : 'border-2 border-slate2-border bg-white'
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
      {isFamily ? (
        <div className="flex h-16 items-end justify-center gap-1">
          <span className="flex h-9 w-7 items-end justify-center rounded-t-md bg-brand/20 pb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0065ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span className="flex h-12 w-7 items-end justify-center rounded-t-md bg-brand/30 pb-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0065ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span className="flex h-8 w-6 items-end justify-center rounded-t-md bg-brand/20 pb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0065ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
        </div>
      ) : (
        <div className="flex h-16 items-end justify-center">
          <span className="flex h-12 w-9 items-end justify-center rounded-t-md bg-orange-tag/20 pb-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff991f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
        </div>
      )}
      <p className="mt-3 text-center text-[13px] font-semibold leading-snug text-navy">
        {isFamily ? (
          <>
            Employee,<br />Spouse<br />& Kids
          </>
        ) : (
          <>
            Employee<br />only
          </>
        )}
      </p>
    </button>
  )
}

/* ── Drawer shell ── */
export default function EditSearchDrawer({
  isOpen,
  onClose,
  initial,
  onApply,
}) {
  // initial: { sumInsured, insureGroup, totalEmployees, ageBrackets, city }
  const [view, setView] = useState('summary') // 'summary' | 'sumInsured' | 'members' | 'city'
  const [pending, setPending] = useState(null)

  // Reset local state whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      setView('summary')
      setPending({
        sumInsured: initial.sumInsured,
        insureGroup: initial.insureGroup,
        totalEmployees: initial.totalEmployees,
        ageBrackets: [...initial.ageBrackets],
        city: initial.city,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Escape key closes drawer
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !pending) return null

  const hasChanges =
    pending.sumInsured !== initial.sumInsured ||
    pending.insureGroup !== initial.insureGroup ||
    pending.totalEmployees !== initial.totalEmployees ||
    pending.city !== initial.city ||
    pending.ageBrackets.some((v, i) => v !== initial.ageBrackets[i])

  const livesCount = pending.insureGroup === 'employeeSpouseKids' ? pending.totalEmployees * 3 : pending.totalEmployees
  const membersLabel =
    pending.insureGroup === 'employeeSpouseKids' ? 'Employee, Spouse & Kids' : 'Employee Only'

  const goBackToSummary = () => setView('summary')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90]"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate2-border px-5 py-4">
          {view !== 'summary' && (
            <button
              type="button"
              onClick={goBackToSummary}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate2-border text-[22px] leading-none text-navy transition-colors hover:border-brand hover:text-brand"
            >
              ‹
            </button>
          )}
          <h2 className="text-[18px] font-bold text-navy">Edit your search</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-blueBG text-navy transition-colors hover:bg-slate2-border"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">
            {/* ── Summary view ── */}
            {view === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Sum insured */}
                <SummaryRow
                  label="Sum insured"
                  value={`₹${pending.sumInsured}`}
                  onEdit={() => setView('sumInsured')}
                />

                {/* Covered members */}
                <SummaryRow
                  label="Covered members & total lives"
                  value={
                    <>
                      {membersLabel} (<span className="font-bold text-brand">{livesCount} lives</span>)
                    </>
                  }
                  onEdit={() => setView('members')}
                />

                {/* City */}
                <SummaryRow
                  label="City"
                  value={pending.city || '—'}
                  onEdit={() => setView('city')}
                />
              </motion.div>
            )}

            {/* ── Sum Insured sub-panel ── */}
            {view === 'sumInsured' && (
              <motion.div
                key="sumInsured"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SectionLabel text="Select covered amount" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {SUM_INSURED_OPTIONS.map((opt) => {
                    const active = pending.sumInsured === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPending((p) => ({ ...p, sumInsured: opt.value }))}
                        className={`relative rounded-lg border-2 px-3 py-3 text-[13px] font-bold transition-all ${
                          active
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-slate2-border bg-white text-navy hover:border-brand/50'
                        }`}
                      >
                        {opt.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-cta px-2 py-0.5 text-[8px] font-bold text-white">
                            Most Popular
                          </span>
                        )}
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Members sub-panel ── */}
            {view === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SectionLabel text="Whom do you want to insure?" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InsureGroupCard
                    type="employeeSpouseKids"
                    selected={pending.insureGroup === 'employeeSpouseKids'}
                    onClick={() => setPending((p) => ({ ...p, insureGroup: 'employeeSpouseKids' }))}
                  />
                  <InsureGroupCard
                    type="employeeOnly"
                    selected={pending.insureGroup === 'employeeOnly'}
                    onClick={() => setPending((p) => ({ ...p, insureGroup: 'employeeOnly' }))}
                  />
                </div>

                {/* Total employees */}
                <div className="mt-5">
                  <FloatingInput
                    value={pending.totalEmployees}
                    onChange={(v) => {
                      const num = v === '' ? 0 : Number(v)
                      setPending((p) => ({ ...p, totalEmployees: num }))
                    }}
                    placeholder="Total number of employees"
                    type="number"
                  />
                </div>

                {/* Age brackets */}
                <div className="mt-6">
                  <SectionLabel text="Edit Employee Count" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {AGE_BRACKETS.map((bracket, i) => (
                      <div key={bracket}>
                        <FloatingInput
                          value={pending.ageBrackets[i]}
                          onChange={(v) => {
                            const num = v === '' ? 0 : Number(v)
                            setPending((p) => {
                              const next = [...p.ageBrackets]
                              next[i] = num
                              return { ...p, ageBrackets: next, totalEmployees: next.reduce((a, b) => a + b, 0) }
                            })
                          }}
                          placeholder={bracket}
                          type="number"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── City sub-panel ── */}
            {view === 'city' && (
              <motion.div
                key="city"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SectionLabel text="Where is your company located?" />
                <div className="mt-4">
                  <FloatingInput
                    value={pending.city}
                    onChange={(v) => setPending((p) => ({ ...p, city: v }))}
                    placeholder="City"
                  />
                </div>

                <div className="mt-6">
                  <SectionLabel text="Popular cities" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((city) => {
                      const active = pending.city === city
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setPending((p) => ({ ...p, city }))}
                          className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors ${
                            active
                              ? 'border-brand bg-brand/5 text-brand'
                              : 'border-slate2-border bg-white text-navy hover:border-brand/50'
                          }`}
                        >
                          {city}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-slate2-border px-5 py-4">
          {view === 'summary' ? (
            <button
              type="button"
              disabled={!hasChanges}
              onClick={() => {
                onApply(pending)
                onClose()
              }}
              className={`w-full rounded-lg py-3.5 text-[14px] font-bold transition-colors ${
                hasChanges
                  ? 'bg-brand text-white hover:bg-brand-dark'
                  : 'cursor-not-allowed bg-slate2-border text-slate2-muted'
              }`}
            >
              View Updated Plans
            </button>
          ) : (
            <button
              type="button"
              disabled={!subPanelHasChanges(view, pending, initial)}
              onClick={goBackToSummary}
              className={`w-full rounded-lg py-3.5 text-[14px] font-bold transition-colors ${
                subPanelHasChanges(view, pending, initial)
                  ? 'bg-brand text-white hover:bg-brand-dark'
                  : 'cursor-not-allowed bg-slate2-border text-slate2-muted'
              }`}
            >
              Save & Continue
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Summary row ── */
function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between rounded-cardlg border border-slate2-border bg-white px-4 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate2-muted">{label}</p>
        <p className="mt-0.5 text-[14px] font-bold text-navy">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="text-[12px] font-semibold text-brand hover:underline">
        Edit ›
      </button>
    </div>
  )
}

/* ── Section label with divider ── */
function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[13px] font-bold text-navy">{text}</p>
      <span className="h-px flex-1 bg-slate2-border" />
    </div>
  )
}

/* ── Per-sub-panel change detection ── */
function subPanelHasChanges(view, pending, initial) {
  switch (view) {
    case 'sumInsured':
      return pending.sumInsured !== initial.sumInsured
    case 'members':
      return (
        pending.insureGroup !== initial.insureGroup ||
        pending.totalEmployees !== initial.totalEmployees ||
        pending.ageBrackets.some((v, i) => v !== initial.ageBrackets[i])
      )
    case 'city':
      return pending.city !== initial.city
    default:
      return false
  }
}