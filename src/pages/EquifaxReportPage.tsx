import React from 'react'
import { Check, Landmark, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import CreditReportFlow from '../components/CreditReportFlow'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'

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

const EquifaxReportPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* ── Hero section ── */}
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-10 md:py-14">
        <div className="container-pb grid gap-9 lg:grid-cols-[1.35fr_.85fr]">
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck size={14} /> Equifax credit profile
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-5xl">
              Check Equifax Credit Score & Report
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Your credit score helps lenders understand your credit behaviour. Review your Equifax report
              to better understand the information used in credit decisions.
            </p>

            <div className="mt-7 grid gap-3 sm:max-w-xl">
              {[
                'Check Credit Score from All 4 Bureaus',
                'Track Credit Score Seamlessly Every Month',
                'Read Credit Report in Multiple Languages',
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium shadow-sm"
                >
                  <Check className="h-5 w-5 shrink-0 rounded-full bg-green-500 p-1 text-white" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 overflow-hidden rounded-xl border border-blue-200 bg-white sm:grid-cols-4">
              {[
                ['4.5/5', 'Customer rating'],
                ['6Cr+', 'Satisfied customers'],
                ['4', 'Bureau coverage'],
                ['800+', 'Cities across India'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-b border-r border-blue-100 p-4 text-center last:border-r-0 sm:border-b-0"
                >
                  <strong className="block text-xl text-navy">{value}</strong>
                  <span className="mt-1 block text-[11px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form + API flow (consent, generate → send-otp → verify-otp → PDF) ── */}
          <CreditReportFlow reportType="equifax" reportName="Equifax Report" bureauName="Equifax India" />
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="container-pb py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-14">
            <Section title="What is Equifax India?">
              <Copy>
                Equifax Inc. is a global credit reporting agency that collects, maintains and analyses credit
                information on consumers and commercial entities. Equifax began its operations in India to
                provide credit scores, credit reports and risk management services to lenders and financial
                institutions.
              </Copy>
              <Copy>
                The Equifax credit score is calculated using a proprietary algorithm based on the information
                available in your credit profile. Lenders use this score along with the detailed report to
                assess your creditworthiness at the time of loan or credit-card application.
              </Copy>
            </Section>

            <Section title="Equifax Credit Score Range">
              <Copy>
                Equifax credit scores typically range from 100 to 900, although the exact scale may vary
                depending on the scoring model used. A higher score indicates a stronger credit profile.
              </Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  '800 – 900 : Excellent – Very low credit risk, easiest to get approved.',
                  '700 – 799 : Good – Strong credit profile with minimal risk.',
                  '600 – 699 : Fair – Credit is acceptable, but terms may be less favorable.',
                  '500 – 599 : Poor – High credit risk; immediate improvement needed.',
                  '100 – 499 : Very Poor – Significant risk; focus on rebuilding credit.',
                ]} />
              </div>
            </Section>

            <Section title="5 Steps to Check Your Equifax Credit Report">
              <Copy>
                Follow these simple steps to view and download your Equifax credit report after OTP verification.
              </Copy>
              <ol className="mt-5 space-y-4">
                {['Enter your full name, phone number, PAN number, gender and authorize the live wallet-price deduction.', 'We generate your Equifax report and send an OTP to the mobile number provided.', 'Enter the 6-digit OTP in the verification modal to confirm your identity.', 'View your Equifax credit score and detailed report on the screen.', 'Download the PDF copy for your records or to share with lenders.'].map(
                  (text, i) => (
                    <li key={text} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-6 text-slate-700">{text}</p>
                    </li>
                  )
                )}
              </ol>
            </Section>

            <Section title="5 Factors That Affect Your Equifax Credit Score">
              <Copy>
                These credit habits can influence the Equifax score shown in your report and overall credit health.
              </Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  'Payment history: Paying loan EMIs and credit-card bills on time is the most important factor.',
                  'Credit utilisation: Keep your credit-card spending well below the available limit.',
                  'Credit mix: A healthy mix of secured and unsecured credit can support a better score.',
                  'New credit applications: Too many applications in a short period can lower your score.',
                  'Length of credit history: A longer track record of responsible credit helps your score.',
                ]} />
              </div>
            </Section>

            <Section title="Components of Equifax Credit Report">
              <Copy>The following are the main components of an Equifax credit report.</Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  'Equifax Score – The three-digit number summarising your creditworthiness.',
                  'Personal Information – Name, gender, date of birth, PAN, Aadhaar and voter ID.',
                  'Contact Information – Registered addresses, mobile number and email address.',
                  'Account Information – Current and past loans/credit cards, balances, limits and repayment history.',
                  'Enquiry Information – Record of credit applications where a lender checked your report.',
                ]} />
              </div>
            </Section>

            <Section title="Equifax Customer Care">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm leading-6">
                <div className="flex gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  <p>
                    <strong>Helpline:</strong> 1800-102-2233
                    <br />
                    Operational from 9:00 am to 6:00 pm, Monday to Saturday.
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Landmark className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  <p>
                    <strong>Registered address:</strong>
                    <br />
                    Equifax Ltd, Unit No. 601, 6th Floor, Kohinoor Square, Plot No. 149/1,
                    Senapati Bapat Marg, Lower Parel, Mumbai – 400 013.
                  </p>
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-navy">How to Check Equifax Report with AV Management?</h2>
              <div className="mt-6 space-y-5">
                {[
                  'Enter your full name, phone number, PAN number and gender.',
                  'Authorize the live wallet-price deduction and verify your number using the OTP.',
                  'View and download your Equifax report after verification.',
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
                className="mt-7 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                Check Equifax Report
              </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#0a3b8f] to-[#061f55] p-6 text-white">
              <Sparkles className="text-yellow-300" />
              <h3 className="mt-5 text-xl font-semibold">Build a stronger credit profile</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Learn how responsible borrowing and timely repayments can support your credit journey across
                all credit bureaus.
              </p>
            </div>
          </aside>
        </div>

        <Section title="Equifax Score Suggested Articles">
          <div className="grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
            {[
              'How can I download my Equifax credit report?',
              'Check Equifax Score by PAN Card Number',
              'How to Raise a Dispute for Equifax Report Errors?',
              'How to Plan Your Repayments to Improve Credit Score?',
              'Can I Get a Loan After Settlement?',
              'What is Equifax Credit Score?',
            ].map((article, i) => (
              <a
                href="#top"
                key={article}
                className={`border-b border-r border-slate-200 p-4 text-sm text-blue-600 transition hover:bg-blue-50 ${
                  i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                {article}
              </a>
            ))}
          </div>
        </Section>

        <CreditScoreArticles />
        <CreditScoreDisclaimer />
      </main>
    </div>
  )
}

export default EquifaxReportPage
