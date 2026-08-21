import { useState } from 'react'
import { ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react'

export type LeadFormKind = 'person' | 'vehicle' | 'business'

interface QuoteFormProps {
  kind?: LeadFormKind
  cta?: string
  title?: string
  showGender?: boolean
  requiresValidation?: boolean
  onSubmit?: (data: { name: string; dob: string; mobile: string; email: string; gender: 'male' | 'female' }) => void
}

/** Shared lead capture UI. Submission owned by host via onSubmit callback. */
export default function QuoteForm({
  kind = 'person',
  cta = 'View Plans',
  title,
  showGender = false,
  requiresValidation = false,
  onSubmit,
}: QuoteFormProps) {
  const vehicle = kind === 'vehicle'
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ name, dob, mobile, email, gender })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-cardlg bg-white p-5 shadow-card sm:p-7">
      {title && <h2 className="mb-5 text-[19px] font-bold leading-snug text-navy">{title}</h2>}
      {showGender && (
        <div className="mb-5 grid grid-cols-2 rounded-lg bg-blueBG p-1 text-[13px] font-medium">
          <button type="button" onClick={() => setGender('male')} className={`rounded-md py-2 transition ${gender === 'male' ? 'bg-brand text-white' : 'text-slate2-secondary'}`}>Male</button>
          <button type="button" onClick={() => setGender('female')} className={`rounded-md py-2 transition ${gender === 'female' ? 'bg-brand text-white' : 'text-slate2-secondary'}`}>Female</button>
        </div>
      )}
      <div className="space-y-4">
        {vehicle ? (
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-navy">Vehicle registration number</span>
            <input className="w-full rounded-lg border border-slate2-border px-3.5 py-3 text-[13px] outline-none focus:border-brand" placeholder="e.g. DL 01 AB 1234" />
          </label>
        ) : (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium text-navy">Your name</span>
              <input required={requiresValidation} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate2-border px-3.5 py-3 text-[13px] outline-none focus:border-brand" placeholder="Enter your name" />
            </label>
            {kind === 'person' && <label className="block"><span className="mb-1.5 block text-[12px] font-medium text-navy">Date of birth</span><input type="date" required={requiresValidation} value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-lg border border-slate2-border px-3.5 py-3 text-[13px] outline-none focus:border-brand" /></label>}
          </>
        )}
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-navy">Mobile number</span>
          <span className="flex items-center rounded-lg border border-slate2-border px-3.5 py-3 focus-within:border-brand">
            <span className="mr-3 flex items-center gap-1 border-r border-slate2-border pr-3 text-[12px] text-slate2-secondary">+91 <ChevronDown size={13} /></span>
            <input type="tel" required={requiresValidation} value={mobile} onChange={(e) => setMobile(e.target.value)} className="min-w-0 flex-1 text-[13px] outline-none" placeholder="10 digit mobile number" />
          </span>
        </label>
        {!vehicle && kind !== 'business' && <label className="block"><span className="mb-1.5 block text-[12px] font-medium text-navy">Email <em className="font-normal text-slate2-muted">(optional)</em></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate2-border px-3.5 py-3 text-[13px] outline-none focus:border-brand" placeholder="you@example.com" /></label>}
      </div>
      <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition hover:bg-brand-dark">{cta}</button>
      <div className="mt-4 space-y-2 text-center text-[11px] text-slate2-secondary">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-blueBG px-3 py-1"><ShieldCheck size={13} className="text-brand" /> An AV Management expert will assist you</p>
        <p className="flex items-center justify-center gap-1"><MessageCircle size={13} /> Get updates on WhatsApp <span className="h-3 w-6 rounded-full bg-brand"><span className="block h-3 w-3 translate-x-3 rounded-full bg-white shadow" /></span></p>
        <p className="text-[10px] text-slate2-muted">By continuing, you agree to AV Management's privacy policy and terms.</p>
      </div>
    </form>
  )
}
