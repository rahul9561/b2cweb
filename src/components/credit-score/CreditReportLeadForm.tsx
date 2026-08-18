import { useState } from 'react'
import { ArrowRight, Check, CircleAlert, FileText } from 'lucide-react'
import OTPModal from '../OTPModal'
import PDFViewer from '../PDFViewer'

type Data = { name: string; phone: string; pan: string; gender: string }

export default function CreditReportLeadForm() {
  const [data, setData] = useState<Data>({ name: '', phone: '', pan: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const update = (key: keyof Data, value: string) => setData((current) => ({ ...current, [key]: value }))
  const errors = { name: !data.name.trim(), phone: data.phone.length !== 10, pan: data.pan.length !== 10, gender: !data.gender }
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); if (!Object.values(errors).some(Boolean)) setShowOtp(true) }
  if (showPDFViewer) return <PDFViewer onClose={() => setShowPDFViewer(false)} reportName="Credit Report" />

  return <><form onSubmit={submit} noValidate className="rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-950/10"><div className="flex items-center gap-3"><span className="rounded-xl bg-blue-100 p-2.5 text-blue-600"><FileText size={21} /></span><div><h2 className="font-serif text-xl font-bold text-navy">Let's Get Started</h2><p className="text-xs text-slate-500">Check your credit score for free</p></div></div><div className="mt-5 space-y-3"><Field label="Full Name" error={submitted && errors.name}><input value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" /></Field><Field label="Phone Number" error={submitted && errors.phone}><input value={data.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Enter 10-digit number" /></Field><Field label="PAN Number" error={submitted && errors.pan}><input value={data.pan} onChange={(e) => update('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="ABCDE1234F" /></Field><div><p className="text-xs font-semibold text-slate-700">Gender</p><div className="mt-1.5 grid grid-cols-3 gap-2">{['Male', 'Female', 'Other'].map((item) => <button type="button" key={item} onClick={() => update('gender', item)} className={`rounded-lg border py-2 text-xs font-semibold ${data.gender === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}>{item}</button>)}</div>{submitted && errors.gender && <Error />}</div><p className="text-[11px] leading-4 text-slate-500">An OTP will be sent to your mobile number for verification.</p><button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Get Free Credit Score <ArrowRight size={16} /></button></div><div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-emerald-700"><Check size={13} />Secure and protected journey</div></form>{showOtp && <OTPModal phoneNumber={data.phone} onClose={() => setShowOtp(false)} onVerify={async () => { setShowOtp(false); setShowPDFViewer(true) }} />}</>
}

function Field({ label, error, children }: { label: string; error: boolean; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-slate-700">{label}<span className="mt-1 block [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-slate-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:font-normal [&>input]:outline-none [&>input]:focus:border-blue-600">{children}</span>{error && <Error />}</label> }
function Error() { return <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600"><CircleAlert size={12} />Please complete this field correctly.</span> }
