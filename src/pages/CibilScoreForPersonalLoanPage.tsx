import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'
import loanImage from '../assets/images/loan.png'

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

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
)

const Copy = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-7 text-slate-700 md:text-base">{children}</p>
)

const minimumScorePoints = [
  'A CIBIL score of 760 and above is generally considered good for personal-loan approval.',
  'Some lenders may approve applications below 760 at a higher interest rate or with stricter terms.',
  'New-to-credit borrowers may receive lesser offers while they build a credit history.',
  'You can rebuild your score with consistent repayments and reapply at a later stage.',
  'A higher score can support a higher loan amount, a lower interest rate and a longer tenure.',
]

const importancePoints = [
  'Determines how creditworthy you appear to lenders.',
  'Helps lenders decide the interest rate offered on your loan.',
  'Influences the loan limit you may be eligible for.',
]

const applicationPoints = [
  'Check your CIBIL score and credit report before applying, and raise a correction for any error early.',
  'Reduce your credit utilisation by keeping the use of your available credit limits low.',
  'Avoid reapplying for a loan immediately after a rejection — repeated enquiries can affect your score.',
  'Keep your EMI-to-income ratio low so that lenders see enough headroom in your monthly budget.',
]

const suggestedArticles = [
  'What is Credit Score in India',
  'How to Download CIBIL Report',
  'Check Free Credit Score by PAN Card',
  '5 Reasons for Having a Low CIBIL Score',
  'SBI Credit Score',
  'Credit Score Myths',
  'Credit Score Ranges',
  'What is Credit Utilisation Ratio?',
  'How to Improve CIBIL Score Fast',
  'CIBIL Score and Credit Report Explained',
]

const articleRows = Array.from({ length: Math.ceil(suggestedArticles.length / 2) }, (_, index) => suggestedArticles.slice(index * 2, index * 2 + 2))

const faqs = [
  {
    question: 'Can I apply without a CIBIL Score?',
    answer: 'It is possible to apply for a personal loan without a CIBIL score, though most lenders treat missing credit history as a higher risk. New-to-credit applicants may still receive smaller loan offers at a higher interest rate, often with a co-applicant or additional documentation.',
  },
  {
    question: 'How to get a loan with a low score?',
    answer: 'Start by reviewing your credit report and correcting any errors, then focus on repaying outstanding balances and avoiding fresh applications. Some lenders offer personal loans to applicants with lower scores at a higher interest rate, while others may require a co-applicant or a secured option.',
  },
  {
    question: 'How does a high score help?',
    answer: 'A higher score signals lower repayment risk, which can improve your approval chances and qualify you for more competitive interest rates. It may also unlock a higher loan amount, a longer repayment tenure and faster processing.',
  },
  {
    question: 'Will I get a loan if my score is 720?',
    answer: 'A score of 720 is within the acceptable range for many lenders, although each lender applies its own policy. You may receive approval at a slightly higher interest rate or with a lower loan amount compared to applicants with scores above 760.',
  },
  {
    question: 'What factors matter when applying and why?',
    answer: 'Lenders review your credit score, repayment history, current obligations, income stability and the ratio of monthly EMIs to income. Together these factors show how comfortably you can manage an additional loan along with your existing expenses.',
  },
]

export default function CibilScoreForPersonalLoanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-white text-slate-800">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container-pb py-3 text-xs text-slate-500">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <ChevronRight className="mx-1 inline" size={13} />
          <Link to="/category/credit-score" className="text-blue-600 hover:underline">Credit Score</Link>
          <ChevronRight className="mx-1 inline" size={13} />
          <span>Personal/Instant Loan</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 py-14 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="container-pb relative z-10 py-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-300 backdrop-blur-md">
            💳 Credit Score Guide
          </span>
          <h1 className="mt-4 max-w-4xl font-sans text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Personal / <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Instant Loan</span>
          </h1>
          <p className="mt-5 max-w-3xl text-xs font-medium leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Understand how your CIBIL score affects personal-loan approval, interest rates and loan limits — and how to strengthen your profile before applying.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['760+ Score recommended', 'No collateral needed', 'Instant decisions'].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                <Check size={12} className="text-emerald-300" /> {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container-pb py-12 md:py-16">
        <div className="max-w-4xl space-y-14">
          <Section title="Importance of Credit Score for Personal Loan Approval">
            <Copy>A personal loan is unsecured, so lenders do not have any collateral to recover their money if a borrower defaults. This makes your credit score a key factor in the approval process. There is no single guaranteed minimum score — each lender applies its own policy, and final approval also depends on your income, existing obligations and the information in your application.</Copy>
          </Section>

          <Section title="What is the Minimum CIBIL Score Required for a Personal Loan?">
            <Copy>While there is no official minimum, a CIBIL score of 760 and above is widely considered good for personal-loan approval. Many lenders treat the score as one of several signals when assessing creditworthiness, alongside income stability and repayment capacity.</Copy>
            <div className="mt-6 overflow-hidden rounded-xl">
              <img src={loanImage} alt="Personal loan and credit score illustration" className="w-full rounded-xl object-cover" />
            </div>
            <div className="mt-6">
              <BulletList items={minimumScorePoints} />
            </div>
          </Section>

          <Section title="Why is CIBIL Score Important?">
            <Copy>Because a personal loan is unsecured, lenders rely heavily on your CIBIL score to assess repayment risk. The score summarises your past credit behaviour and becomes the primary input in the lender's risk decision.</Copy>
            <div className="mt-5"><BulletList items={importancePoints} /></div>
            <p className="mt-3 text-xs italic text-slate-500">Note: A low score does not automatically mean rejection — it may only mean the loan comes at a higher interest rate or with stricter terms.</p>
          </Section>

          <Section title="Things to Keep in Mind when Applying">
            <BulletList items={applicationPoints} />
          </Section>
        </div>

        {/* FAQ */}
        <section className="mt-16 rounded-2xl bg-slate-50 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-navy">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="rounded-xl border border-slate-200 bg-white">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-5 p-4 text-left text-sm font-semibold text-navy">
                  {faq.question}
                  {openFaq === index ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
                </button>
                {openFaq === index && <p className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Articles You May Also Like */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">Articles You May Also Like</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <tbody>
                {articleRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-slate-200 first:border-t-0">
                    {row.map((article) => (
                      <td key={article} className={`w-1/2 border-r border-slate-200 p-4 last:border-r-0 ${rowIndex % 2 ? 'bg-white' : 'bg-slate-50'}`}>
                        <a href="#" className="text-blue-600 transition hover:text-blue-800">{article}</a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <CreditScoreArticles />
        <CreditScoreDisclaimer />
      </main>
    </div>
  )
}