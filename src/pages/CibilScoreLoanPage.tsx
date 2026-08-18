import { useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'

type Details = { firstName: string; lastName: string; pan: string; phone: string; dob: string; pincode: string }

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
        <Check className="mt-1 h-4 w-4 shrink-0 rounded-full bg-blue-600 p-0.5 text-white" />
        {item}
      </li>
    ))}
  </ul>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
)

const Copy = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-7 text-slate-700 md:text-base">{children}</p>
)

const relatedArticles = [
  'What is Credit Score in India',
  'How to Download CIBIL Report',
  'Check Free Credit Score & CIBIL Report',
  'Check Your Free CIBIL Score by PAN Card',
  'How to Build and Improve Your Credit Score',
  '5 Reasons for Having a Low CIBIL Score',
  'SBI Credit Score',
  'Good CIBIL Score',
  'Credit Score Myths',
  'Credit Score Ranges',
]

const faqs = [
  {
    q: 'Can I apply for a personal loan without having a CIBIL Score?',
    a: 'Some lenders do consider applications from new-to-credit customers, though the offer, loan amount and interest rate will typically depend on other factors such as income, employment stability and existing obligations, since there is no credit history to assess.',
  },
  {
    q: 'How to get a personal loan with a low CIBIL score?',
    a: 'You may still find lenders willing to offer a personal loan with a lower score, though usually with a smaller loan amount, higher interest rate or a co-applicant/guarantor requirement. Improving your score before applying can help you access better terms.',
  },
  {
    q: 'How having a high CIBIL score will help me in getting a personal loan?',
    a: 'A higher score generally signals responsible credit behaviour to lenders, which can improve your chances of approval and may help you access a higher loan amount, a lower interest rate and a longer repayment tenure.',
  },
  {
    q: 'Will I get a personal loan if my CIBIL score is 720?',
    a: 'A score of 720 is generally considered reasonable and many lenders may consider your application, though final approval also depends on your income, existing liabilities and the specific lender\u2019s eligibility criteria.',
  },
  {
    q: 'What are the factors that you need to consider in applying for a personal loan? Why is it important to consider those factors?',
    a: 'Key factors include your credit score, income stability, existing EMI obligations, credit utilisation and recent loan enquiries. Reviewing these beforehand helps you apply to the right lender, avoid unnecessary rejections and secure more favourable terms.',
  },
]

export default function CibilScoreLoanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const incoming = (location.state ?? {}) as Partial<Details> | null

  const [details, setDetails] = useState<Details>({
    firstName: incoming?.firstName ?? '',
    lastName: incoming?.lastName ?? '',
    pan: incoming?.pan ?? '',
    phone: incoming?.phone ?? '',
    dob: incoming?.dob ?? '',
    pincode: incoming?.pincode ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const update = (key: keyof Details, value: string) => setDetails((current) => ({ ...current, [key]: value }))

  const validate = (): Partial<Record<keyof Details, string>> => {
    const newErrors: Partial<Record<keyof Details, string>> = {}
    if (!details.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!details.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!details.pan.trim()) newErrors.pan = 'PAN card number is required'
    else if (!/^[A-Z0-9]{10}$/.test(details.pan)) newErrors.pan = 'Enter a valid 10-character PAN'
    if (!details.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(details.phone)) newErrors.phone = 'Enter a valid 10-digit phone number'
    if (!details.dob) newErrors.dob = 'Date of birth is required'
    else {
      const d = new Date(details.dob)
      if (isNaN(d.getTime())) newErrors.dob = 'Enter a valid date of birth'
    }
    if (!details.pincode.trim()) newErrors.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(details.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode'
    return newErrors
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      navigate('/loan-offers', { state: { ...details } })
    }
  }

  return (
    <main className="bg-white">
      {/* ===== HERO + "Let's Get Started" FORM — UNTOUCHED ===== */}
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="container-pb grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="text-sm font-semibold text-blue-600">PERSONAL LOAN ELIGIBILITY</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-navy md:text-4xl">CIBIL Score for Personal Loan / Instant Loan</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              A stronger credit profile may help improve your personal-loan eligibility. Check your score and explore offers from leading lenders.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Check score from all 4 bureaus', 'Personalised loan offers', 'Secure, paperless journey'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white p-3 text-sm font-medium text-navy">
                  <CheckCircle2 className="shrink-0 text-emerald-500" size={18} />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
              <p className="font-semibold text-navy">Why your credit score matters</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Lenders may review your repayment history, credit use and recent applications along with income and other eligibility requirements.
              </p>
            </div>
          </div>
          <form onSubmit={submit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/10">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <ShieldCheck size={22} />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy">Let&apos;s Get Started</h2>
                <p className="text-xs text-slate-500">Complete your details to view offers</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { key: 'firstName', label: 'First Name', icon: UserRound, type: 'text' },
                  { key: 'lastName', label: 'Last Name', icon: UserRound, type: 'text' },
                  { key: 'pan', label: 'PAN Card Number', icon: CreditCard, type: 'text' },
                  { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
                  { key: 'dob', label: 'Date of Birth', icon: CalendarDays, type: 'date' },
                  { key: 'pincode', label: 'Pincode', icon: MapPin, type: 'text' },
                ] as const
              ).map(({ key, label, icon: Icon, type }) => (
                <label key={key} className="text-xs font-semibold text-slate-700">
                  {label}
                  <span className="relative mt-1 block">
                    <Icon size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={type}
                      value={details[key]}
                      onChange={(e) =>
                        update(
                          key,
                          key === 'pan'
                            ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
                            : key === 'phone' || key === 'pincode'
                            ? e.target.value.replace(/\D/g, '').slice(0, key === 'phone' ? 10 : 6)
                            : e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-600"
                      placeholder={label}
                    />
                  </span>
                  {submitted && errors[key] && <small className="text-xs text-red-600">{errors[key]}</small>}
                </label>
              ))}
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
              Get Free Credit Score <ArrowRight size={17} />
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-500">By continuing, you agree to the terms of use and privacy policy.</p>
          </form>
        </div>
      </section>
      {/* ===== END HERO + FORM ===== */}

      {/* ===== NEW CONTENT BELOW — main content + sticky sidebar ===== */}
      <div className="container-pb py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-14">
            <Section title="Importance of Credit Score for Personal Loan Approval">
              <Copy>
                As a personal loan is an unsecured credit product, lenders emphasise the credit score the most. A good credit score is very
                important for such credit applications to get approved. However, there is no fixed requirement for a minimum CIBIL score for
                personal loan approval.
              </Copy>
            </Section>

            <Section title="What is the Minimum CIBIL Score Required for a Personal Loan?">
              <Copy>Generally, a CIBIL score of 760 and above is considered good for getting a personal loan approved without many difficulties.</Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList
                  items={[
                    'Some lenders may also approve your personal loan application even if your score is below 760.',
                    'You may, however, have to adhere to stricter loan terms, higher interest rates, smaller tenure, etc.',
                    'In many cases, some lenders may approve the personal loan application of applicants who do not have a credit score or those who are new to credit.',
                    'New-to-credit applicants may not get the best personal loan offer.',
                    'Such applicants can start building their credit score and check their credit score from time to time to see if the credit score is generated.',
                    'They can apply for a personal loan when their score is good enough to secure a less costly loan offer.',
                    'A high credit score can also help you get a higher loan amount, and that too, at lower interest rates and with a longer repayment tenure.',
                  ]}
                />
              </div>
            </Section>

            <Section title="Why is CIBIL Score Important to Get a Personal Loan?">
              <Copy>
                Personal loan is termed as an unsecured loan, which means when a bank or NBFC lends you funds, they do not require any collateral
                or security to be submitted with them, unlike in the case of a home loan, car loan, gold loan, etc.
              </Copy>
              <Copy>
                As it is considered a risky investment for the lenders, they pay close attention to an applicant&apos;s behaviour through the credit
                score while evaluating their personal loan applications.
              </Copy>
              <p className="mt-5 text-sm font-semibold text-navy">Credit Score Helps the Lender in the Following Ways:</p>
              <div className="mt-3">
                <BulletList
                  items={[
                    'Determine your (borrower\u2019s) creditworthiness',
                    'Decide the rate of interest to sanction the loan',
                    'Decide your loan limit (i.e., how much you can borrow)',
                  ]}
                />
              </div>
              <p className="mt-5 text-xs italic text-slate-500">
                Please note that while having a low CIBIL score does not necessarily mean your personal loan application will be rejected, you
                may end up paying a higher overall cost of credit.
              </p>
            </Section>

            <Section title="Things to Keep in Mind when Applying for a Personal Loan">
              <p className="text-xs italic text-slate-500">Before applying for a personal loan, consider the following points:</p>
              <div className="mt-4">
                <BulletList
                  items={[
                    'Check your CIBIL score for a personal loan, and report if you find any errors in your report; get those corrected at the earliest',
                    'In case of a high credit utilisation ratio, clear your outstanding soon and reduce your CUR, as a high credit utilisation portrays you as overdependent on credit.',
                    'Refrain from applying for new personal loans if your similar applications were recently rejected.',
                    'Keep your EMI to NMI ratio low, as many banks may not approve your loan application in case this ratio is quite high, especially if the income is moderate.',
                  ]}
                />
              </div>

              <p className="mt-8 text-sm font-semibold text-navy underline decoration-slate-300">Articles You May Also Like:</p>
              <div className="mt-3 grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
                {relatedArticles.map((article, i) => (
                  <a
                    href="#top"
                    key={article}
                    className={`border-b border-r border-slate-200 p-4 text-sm text-blue-600 transition hover:bg-blue-50 last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 ${
                      i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    {article}
                  </a>
                ))}
              </div>
            </Section>
          </div>

          {/* Sticky sidebar */}
          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-navy">How to Check CIBIL Score for Free with AV Management?</h2>
              <div className="mt-6 space-y-5">
                {[
                  'Enter your mobile number',
                  'Verify your number using the OTP',
                  'Enter your PAN and basic details',
                  'View your free credit score and get detailed credit report',
                ].map((text, i) => (
                  <div key={text} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500 p-1 text-white" />
                    <span>
                      <b>Step {i + 1}:</b> {text}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-7 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
              >
                Check FREE Credit Score →
              </button>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#0a3b8f] to-[#061f55] p-6 text-white">
              <Sparkles className="text-yellow-300" />
              <h3 className="mt-5 text-xl font-semibold">Build a stronger credit profile</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Learn how responsible borrowing and timely repayments can support your credit journey.
              </p>
            </div>
          </aside>
        </div>

        {/* Breadcrumb */}
        <nav className="mt-14 flex items-center gap-1.5 text-sm">
          <Link to="/" className="font-medium text-blue-600 hover:underline">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to="/category/credit-score" className="font-medium text-blue-600 hover:underline">
            Credit Score
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500">Cibil Score For Personal Loan</span>
        </nav>

        {/* FAQs */}
        <section className="mt-6 rounded-2xl bg-slate-50 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-navy">FAQs</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-5 p-4 text-left text-sm font-semibold text-navy"
                >
                  {faq.q}
                  {openFaq === index ? <ChevronUp className="shrink-0 text-blue-600" size={18} /> : <ChevronDown className="shrink-0 text-blue-600" size={18} />}
                </button>
                {openFaq === index && <p className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Reused shared components */}
        <CreditScoreArticles />
        <CreditScoreDisclaimer />
      </div>
    </main>
  )
}

