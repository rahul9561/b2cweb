import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import BrandMark from '../components/common/BrandMark'

export default function TermCheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { plan, formData, riderCovers, addedRiders, premium } = (location.state ?? {}) as any

  const [agreed, setAgreed] = useState(true)
  const [showAdditional, setShowAdditional] = useState(false)
  const [showDeclaration, setShowDeclaration] = useState(false)

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-navy">
          No plan selected. <Link to="/quotes" className="text-brand underline">Go back</Link>
        </p>
      </div>
    )
  }

  const maskedEmail = formData?.email ? formData.email.replace(/(.{2}).+(@.+)/, '$1**********$2') : ''
  const maskedMobile = formData?.mobile
    ? `${formData.mobile.slice(0, 2)}${'*'.repeat(Math.max(formData.mobile.length - 4, 0))}${formData.mobile.slice(-2)}`
    : ''

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <BrandMark name={plan.insurerName} />
            <div>
              <p className="text-xs text-gray-400">{plan.insurerName}</p>
              <p className="text-base font-extrabold text-navy">{plan.planName}</p>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-bold text-navy">Review below details before proceeding</h2>
          <p className="text-[12px] italic text-amber-600">These details cannot be changed at a later stage</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ReadonlyField label="Name" value={formData?.name || '—'} />
            <ReadonlyField label="Date of Birth" value={formData?.dob || '—'} />
            <ReadonlyField label="Email" value={maskedEmail || '—'} />
            <ReadonlyField label="Mobile Number" value={maskedMobile || '—'} />
          </div>

          <CollapsibleSection title="Additional Details" open={showAdditional} onToggle={() => setShowAdditional((v) => !v)}>
            <div className="grid gap-3 text-[13px] text-navy md:grid-cols-2">
              <p><span className="text-gray-400">Occupation: </span>{formData?.occupation || '—'}</p>
              <p><span className="text-gray-400">Annual Income: </span>₹{Number(formData?.annualIncome || 0).toLocaleString('en-IN')}</p>
              <p><span className="text-gray-400">Education: </span>{formData?.education || '—'}</p>
              <p><span className="text-gray-400">City: </span>{formData?.city || '—'}</p>
              <p><span className="text-gray-400">Pincode: </span>{formData?.pincode || '—'}</p>
              <p><span className="text-gray-400">Marital Status: </span>{formData?.maritalStatus || '—'}</p>
              {addedRiders &&
                Object.entries(addedRiders as Record<string, boolean>)
                  .filter(([, on]) => on)
                  .map(([id]) => (
                    <p key={id} className="md:col-span-2"><span className="text-gray-400">Rider added: </span>{id} {riderCovers?.[id] ? `(${riderCovers[id]})` : ''}</p>
                  ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Declaration" open={showDeclaration} onToggle={() => setShowDeclaration((v) => !v)}>
            <p className="text-[12px] leading-6 text-gray-500">
              I hereby declare that the information provided above is true and correct to the best of my knowledge. I
              understand that any misrepresentation may lead to rejection of the claim or cancellation of the policy.
            </p>
          </CollapsibleSection>

          <label className="mt-5 flex items-center gap-2 text-[13px] text-navy">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 accent-brand" />
            I Agree to the <a href="#" className="text-brand underline">terms and conditions</a>
          </label>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row">
            <div>
              <p className="text-2xl font-extrabold text-navy">
                ₹{Number(premium || 0).toLocaleString('en-IN')} <span className="text-sm font-medium text-gray-400">Monthly</span>
              </p>
              <p className="text-[11px] text-gray-400">Total Premium</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(-1)} className="rounded-xl border border-brand px-6 py-3 text-sm font-bold text-brand">
                Edit Details
              </button>
              <button
                disabled={!agreed}
                onClick={() =>
                  navigate(`/quotes/plan/${plan.id}/payment`, {
                    state: { plan, formData, premium },
                  })
                }
                className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-navy">{value}</p>
    </div>
  )
}

function CollapsibleSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-gray-200">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-navy">
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-4 py-3">{children}</div>}
    </div>
  )
}