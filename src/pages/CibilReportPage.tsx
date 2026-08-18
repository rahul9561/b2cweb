import React, { useState } from 'react'
import { ArrowRight, Check, FileText, Landmark, Loader2, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import OTPModal from '../components/OTPModal'
import PDFViewer from '../components/PDFViewer'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'
import { useCreditReport } from '../hooks/useCreditReport'
const scoreRows = [
  ['801 – 900', 'Excellent', 'You have a superb credit history.', 'You would meet the eligibility criteria of most banks and NBFCs, and are likely to get the best offers at this score.', 'bg-emerald-600'],
  ['761 – 800', 'Very Good', 'You have been responsible with credit and have displayed very good credit behaviour.', 'Most banks and NBFCs would be willing to offer you credit.', 'bg-green-500'],
  ['701 – 760', 'Good', 'You have a good credit score, and your credit application may get approved by some lenders.', 'You may still be ineligible for some loan and credit-card offers. Continue improving your score.', 'bg-yellow-400'],
  ['601 – 700', 'Average', 'Your credit score needs improvement.', 'Only a few lenders are likely to approve your application, often with stricter terms.', 'bg-orange-500'],
  ['300 – 600', 'Poor', 'Immediate attention is required. Your credit history is damaged and needs rebuilding.', 'There are very few chances of new loan approval. Review your report and take corrective action.', 'bg-red-500'],
]
const BulletList = ({ items }: { items: string[] }) => <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 rounded-full bg-blue-600 p-0.5 text-white" />{item}</li>)}</ul>
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section><h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">{title}</h2><div className="mt-5">{children}</div></section>
const Copy = ({ children }: { children: React.ReactNode }) => <p className="text-sm leading-7 text-slate-700 md:text-base">{children}</p>

const CibilReportPage: React.FC = () => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pan, setPan] = useState('')
  const [gender, setGender] = useState('')
  const [consent, setConsent] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const { generateReport, sendOtp, verifyOtp, loading: generating, error: reportError } = useCreditReport()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (!(fullName && phone.length === 10 && pan.length === 10 && gender && consent)) return
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // Step 1: Hit /cibil/generate-report/ → get report_id
      const reportData = await generateReport({
        name: fullName,
        mobile: phone,
        pan,
        gender,
        reportType: 'cibil',
        consent,
      })

      const id = reportData?.report_id ?? reportData?.reportId ?? reportData?.id ?? null
      setReportId(id)

      // Step 2: Hit /cibil/send-otp/ → sends OTP to mobile
      if (id) {
        await sendOtp(phone, id)
      }

      // Step 3: Show OTP modal for user to enter & verify OTP
      setShowOTPModal(true)
    } catch {
      // reportError already holds the message; shown in the form below.
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    if (!reportId) return
    try {
      // Hit /accounts/verify-otp/ to verify the OTP
      await verifyOtp(phone, reportId, otp)
      setShowOTPModal(false)
      setShowPDFViewer(true)
    } catch {
      // reportError already holds the message; shown in the form below.
    }
  }

  const handleResendOtp = async () => {
    if (!reportId) return
    await sendOtp(phone, reportId)
  }

  if (showPDFViewer) return <PDFViewer onClose={() => setShowPDFViewer(false)} />

  return <div className="bg-white text-slate-800">
    <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-10 md:py-14">
      <div className="container-pb grid gap-9 lg:grid-cols-[1.35fr_.85fr]">
        <div className="pt-2"><span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"><ShieldCheck size={14} /> Credit profile insights</span><h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-5xl">TransUnion CIBIL Score & Report</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Understand your credit standing with a detailed TransUnion CIBIL report and take informed steps toward your financial goals.</p>
          <div className="mt-7 grid gap-3 sm:max-w-xl">{['Check Credit Score from All 4 Bureaus', 'Track Credit Score Seamlessly Every Month', 'Read Credit Report in Multiple Languages'].map((text) => <div key={text} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium shadow-sm"><Check className="h-5 w-5 rounded-full bg-green-500 p-1 text-white" />{text}</div>)}</div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 overflow-hidden rounded-xl border border-blue-200 bg-white sm:grid-cols-4">{[['4.5/5', 'Customer rating'], ['6Cr+', 'Satisfied customers'], ['4', 'Bureau coverage'], ['800+', 'Cities across India']].map(([value, label]) => <div key={label} className="border-b border-r border-blue-100 p-4 text-center last:border-r-0 sm:border-b-0"><strong className="block text-xl text-navy">{value}</strong><span className="mt-1 block text-[11px] text-slate-500">{label}</span></div>)}</div>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-900/5 md:p-7"><div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-blue-100 p-3 text-blue-600"><FileText size={22} /></span><div><h2 className="text-2xl font-bold text-navy">Let’s Get Started</h2><p className="text-xs text-slate-500">Complete your details to continue</p></div></div><div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Full Name<input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Phone Number<div className="relative mt-1.5"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" className="w-full rounded-lg border border-slate-300 py-3 pl-9 pr-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></div></label>
          <label className="block text-sm font-medium text-slate-700">PAN Number<input required value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="Enter PAN number" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 font-mono outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
          <fieldset><legend className="text-sm font-medium text-slate-700">Gender</legend><div className="mt-2 grid grid-cols-3 gap-2">{['male', 'female', 'Other'].map((option) => <button type="button" onClick={() => setGender(option)} key={option} className={`rounded-lg border py-2.5 text-sm font-medium transition ${gender === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600 hover:border-blue-400'}`}>{option}</button>)}</div></fieldset>
          <p className="text-xs text-slate-500">An OTP will be sent to the mobile number provided.</p>

<label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
  <input
    type="checkbox"
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
  />
  I authorize the deduction of ₹299 from my wallet balance to generate this report.
</label>
{attempted && !consent && (
  <p className="text-xs font-medium text-red-600">Please provide your consent to continue.</p>
)}
{reportError && (
  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
    {reportError}
  </p>
)}

<button
  disabled={isSubmitting || generating}
  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
>
  {isSubmitting || generating ? (
    <><Loader2 size={17} className="animate-spin" /> Generating report...</>
  ) : (
    <>Get CIBIL Report <ArrowRight size={17} /></>
  )}
</button>
          <p className="text-center text-[11px] leading-4 text-slate-500">By continuing, you agree to the Terms of Use and Privacy Policy.</p></div></form>
      </div>
    </section>
    <main className="container-pb py-12 md:py-16"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]"><div className="space-y-14">
      <Section title="What is TransUnion CIBIL?"><Copy>TransUnion CIBIL is India’s leading credit bureau that collects and manages consumer credit information provided by lenders every month.</Copy><Copy>At the time of credit approval, lenders consider the CIBIL report to assess creditworthiness and lending risk. It therefore plays an important role in a loan approval process.</Copy></Section>
      <Section title="What is CIBIL Score and CIBIL Report?"><Copy>The credit score generated by TransUnion is known as a CIBIL score. The detailed credit information report containing your score is known as a CIBIL report.</Copy><div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5"><BulletList items={['CIBIL score and report are widely used by lenders.', 'CIBIL uses credit information reported by lenders to calculate your score.', 'Your CIBIL score is refreshed every 15 days.', 'A good score can help you access loans and credit cards more easily.', 'Review your report regularly and resolve any errors promptly.']} /></div></Section>
      <Section title="CIBIL Score Range – What Does Your Score Mean?"><Copy>CIBIL scores range between 300 and 900. A score closer to 900 is generally considered more favourable for loan or credit card approval.</Copy><div className="my-7 flex overflow-hidden rounded-full text-center text-xs font-bold shadow-sm">{scoreRows.map(([score, range, , , color]) => <div key={range as string} className={`${color} flex min-h-11 flex-1 flex-col items-center justify-center px-1 ${range === 'Good' ? 'text-slate-900' : 'text-white'}`}><span>{score}</span><span className="hidden text-[10px] font-medium sm:block">{range}</span></div>)}</div><div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#294b8d] text-white"><tr><th className="p-4">CIBIL Score</th><th className="p-4">Score Range</th><th className="p-4">What It Means</th><th className="p-4">What It Signifies</th></tr></thead><tbody>{scoreRows.map(([score, range, means, signifies], index) => <tr key={range as string} className={index % 2 ? 'bg-slate-50' : 'bg-white'}><td className="border-t border-slate-200 p-4 font-medium">{score}</td><td className={`border-t border-slate-200 p-4 font-semibold ${range === 'Good' ? 'text-yellow-500' : 'text-slate-700'}`}>{range}</td><td className="border-t border-slate-200 p-4 leading-6">{means}</td><td className="border-t border-slate-200 p-4 leading-6">{signifies}</td></tr>)}</tbody></table></div><p className="mt-3 text-xs italic text-slate-500">Score ranges are indicative and may vary according to bureau criteria.</p></Section>
      <Section title="Steps to Check Your TransUnion CIBIL Report"><Copy>Follow these simple steps to view and download your TransUnion CIBIL report.</Copy><ol className="mt-5 space-y-4">{['Enter your full name, phone number, PAN number and gender.', 'Verify your mobile number using the OTP sent via SMS.', 'Continue to your CIBIL report once verification is complete.', 'Download the report PDF for your records.'].map((text, i) => <li key={text} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span><p className="pt-0.5 text-sm leading-6 text-slate-700">{text}</p></li>)}</ol></Section>
      <Section title="Components of CIBIL Report"><Copy>The following are the main components of a CIBIL report.</Copy><div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5"><div className="space-y-6">{[['CIBIL Score', 'The score is displayed in the first section and sums up your credit history and creditworthiness.'], ['Personal Information', 'Contains your name, gender, date of birth and identification details such as Aadhaar, voter ID and PAN.'], ['Contact Information', 'Includes registered addresses, mobile number, email address and telephone numbers.'], ['Account Information', 'Lists current and previous loans or credit cards, balances, limits and repayment history.'], ['Enquiry Information', 'Shows credit applications for which a lender requested a copy of your Credit Information Report.']].map(([title, text]) => <div key={title}><h3 className="font-semibold text-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></Section>
      <Section title="What is CIBIL Rank?"><Copy>CIBIL Rank is a numeric summary used for businesses, MSMEs, enterprises and organisations in their Company Credit Report.</Copy><div className="mt-5"><BulletList items={['CIBIL Rank varies on a scale from Rank 1 to 10.', 'Rank 1 represents businesses considered least risky to lenders.', 'Rank 10 represents businesses with the highest risk or possible default.', 'A rank closer to 1 can improve the chances of obtaining fresh credit.']} /></div></Section>
      <Section title="Role of TransUnion CIBIL in the Borrowing Process"><Copy>CIBIL reports play a crucial role in approving or declining credit applications for loans and credit cards.</Copy><div className="mt-5"><BulletList items={['Banks and NBFCs submit consumer and business credit data to TransUnion CIBIL.', 'The report contains account details, outstanding amounts, repayment history, enquiries and Days Past Due (DPD).', 'CIBIL processes this information to generate Credit Information Reports and CIBIL scores.', 'Lenders use the report and score to assess risk and decide on an application.']} /></div></Section>
      <Section title="Why is the CIBIL Score Important?"><BulletList items={['CIBIL score is a key component lenders use to assess an applicant’s credit behaviour.', 'It helps lenders decide the creditworthiness of an applicant and approve or decline credit.', 'Applicants with scores closer to 900 are often considered first for loan and credit-card approvals.', 'A good CIBIL score can help you obtain credit at lower interest rates and with added benefits.']} /></Section>
      <Section title="CIBIL Customer Care"><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm leading-6"><div className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><p><strong>Helpline:</strong> (+91) 22-614-043-00<br />Operational from 10:00 am to 06:00 pm, Monday to Friday.</p></div><div className="mt-4 flex gap-3"><Landmark className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><p><strong>Registered address:</strong><br />TransUnion CIBIL Limited, One World Centre, Tower 2A, 19th Floor, Senapati Bapat Marg, Elphinstone Road, Mumbai – 400 013.</p></div></div></Section>
    </div>
    <aside className="space-y-6 lg:pt-2"><div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24"><h2 className="font-serif text-xl font-bold text-navy">How to Check CIBIL Score with AV Management?</h2><div className="mt-6 space-y-5">{['Enter your full name, phone number, PAN number and gender.', 'Verify your number using the OTP.', 'View your CIBIL report after verification.'].map((text, i) => <div key={text} className="flex gap-3 text-sm"><Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500 p-1 text-white" /><span><b>Step {i + 1}:</b> {text}</span></div>)}</div><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-7 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">Check CIBIL Report</button></div><div className="rounded-2xl bg-gradient-to-br from-[#0a3b8f] to-[#061f55] p-6 text-white"><Sparkles className="text-yellow-300" /><h3 className="mt-5 text-xl font-semibold">Build a stronger credit profile</h3><p className="mt-2 text-sm leading-6 text-blue-100">Learn how responsible borrowing and timely repayments can support your credit journey.</p></div></aside></div>
      <Section title="CIBIL Score Suggested Articles"><div className="grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">{['How can I download my CIBIL credit report?', 'Check CIBIL Score by PAN Card Number', 'How to Raise a Dispute for CIBIL Report Errors?', 'How to Plan Your Repayments to Improve Credit Score?', 'Can I Get a Loan After Settlement?', 'What is CIBIL Score?'].map((article, i) => <a href="#top" key={article} className={`border-b border-r border-slate-200 p-4 text-sm text-blue-600 transition hover:bg-blue-50 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>{article}</a>)}</div></Section>
      <CreditScoreArticles />
      <CreditScoreDisclaimer />
    </main>
    {showOTPModal && <OTPModal phoneNumber={phone} onVerify={handleVerifyOtp} onResendOtp={handleResendOtp} onClose={() => setShowOTPModal(false)} />}
    </div>
}

export default CibilReportPage
