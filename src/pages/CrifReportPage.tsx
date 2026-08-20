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

const CrifReportPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* ── Hero section ── */}
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-10 md:py-14">
        <div className="container-pb grid gap-9 lg:grid-cols-[1.35fr_.85fr]">
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck size={14} /> CRIF credit profile
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-5xl">
              CRIF High Mark Credit Report & Score
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              CRIF High Mark is a credit bureau that records credit information used by lenders. Use your
              report to understand your current credit profile and related score indicators.
            </p>

            <div className="mt-7 grid gap-3 sm:max-w-xl">
              {['Check Credit Score from All 4 Bureaus', 'Track Credit Score Seamlessly Every Month', 'Read Credit Report in Multiple Languages'].map(
                (text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium shadow-sm"
                  >
                    <Check className="h-5 w-5 shrink-0 rounded-full bg-green-500 p-1 text-white" />
                    {text}
                  </div>
                )
              )}
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
          <CreditReportFlow reportType="crif" reportName="CRIF Report" bureauName="CRIF High Mark" />
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="container-pb py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-14">
            <Section title="What is CRIF High Mark?">
              <Copy>
                CRIF High Mark Information (CRIF High Mark) is one of India’s four credit bureaus, providing
                credit information services for borrowers, lenders, businesses and institutions. It collects
                and maintains credit information from various lenders across the country.
              </Copy>
              <Copy>
                CRIF High Mark assigns a three-digit credit score that ranges from 300 to 900. Lenders use
                this score along with the detailed report to assess your creditworthiness at the time of
                loan or credit-card application.
              </Copy>
            </Section>

            <Section title="CRIF High Mark Credit Score Range & Meaning">
              <Copy>
                These broad indicators help you understand the score range displayed in a CRIF High Mark
                report. A score closer to 900 is generally considered more favourable for loan or credit
                card approval.
              </Copy>
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-blue-50 text-left text-navy">
                    <tr>
                      <th className="p-3">CRIF Score</th>
                      <th className="p-3">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['900', 'Highest possible CRIF credit score.'],
                      ['800 – 899', 'Very good credit standing.'],
                      ['650 – 799', 'Good for credit approval with scope for improvement.'],
                      ['580 – 649', 'Average score that may need improvement.'],
                      ['Below 580', 'Poor score; improve credit behaviour before applying for new credit.'],
                    ].map(([score, meaning]) => (
                      <tr key={score} className="border-t border-slate-200">
                        <td className="p-3 font-semibold text-navy">{score}</td>
                        <td className="p-3 text-slate-600">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="5 Steps to Check Your CRIF High Mark Credit Report">
              <Copy>
                Follow these simple steps to view and download your CRIF High Mark credit report after OTP
                verification.
              </Copy>
              <ol className="mt-5 space-y-4">
                {[
                  'Enter your full name, phone number, PAN number, gender and authorize the live wallet-price deduction.',
                  'We generate your CRIF report and send an OTP to the mobile number provided.',
                  'Enter the 6-digit OTP in the verification modal to confirm your identity.',
                  'View your CRIF High Mark credit score and detailed report on the screen.',
                  'Download the PDF copy for your records or to share with lenders.',
                ].map((text, i) => (
                  <li key={text} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-6 text-slate-700">{text}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="5 Factors Affecting the CRIF High Mark Credit Score">
              <Copy>
                The CRIF High Mark report reflects information reported by credit institutions. These factors
                influence the score shown in your credit profile.
              </Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  'Payment history and timely settlements – the most important factor for your score.',
                  'Length of credit history and account age – older, well-managed accounts help.',
                  'Recent credit applications and enquiries – too many in a short period may hurt.',
                  'Credit utilisation across active accounts – keep it low relative to your limits.',
                  'Accuracy of personal and loan information reported to the bureau.',
                ]} />
              </div>
            </Section>

            <Section title="Components of CRIF High Mark Report">
              <Copy>The following are the main components of a CRIF High Mark credit report.</Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  'CRIF Score – The three-digit number summarising your creditworthiness (300–900).',
                  'Personal Information – Name, gender, date of birth, PAN, Aadhaar and voter ID.',
                  'Contact Information – Registered addresses, mobile number and email address.',
                  'Account Information – Current and past loans/credit cards, balances, limits and repayment history.',
                  'Enquiry Information – Record of credit applications where a lender checked your report.',
                ]} />
              </div>
            </Section>

            <Section title="CRIF High Mark Customer Care">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm leading-6">
                <div className="flex gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  <p>
                    <strong>Helpline:</strong> 1800-123-2233
                    <br />
                    Operational from 9:00 am to 6:00 pm, Monday to Saturday.
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Landmark className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  <p>
                    <strong>Registered address:</strong>
                    <br />
                    CRIF High Mark, 201, Surya Mahal, 4th Floor, Plot No. 191,
                    Dr. E. Moses Road, Mahal Colony, Dadar, Mumbai – 400 014.
                  </p>
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-navy">How to Check CRIF Report with AV Management?</h2>
              <div className="mt-6 space-y-5">
                {[
                  'Enter your full name, phone number, PAN number and gender.',
                  'Authorize the live wallet-price deduction and verify your number using the OTP.',
                  'View and download your CRIF High Mark report after verification.',
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
                Check CRIF Report
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

        <Section title="CRIF Score Suggested Articles">
          <div className="grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
            {[
              'How can I download my CRIF credit report?',
              'Check CRIF Score by PAN Card Number',
              'How to Raise a Dispute for CRIF Report Errors?',
              'How to Plan Your Repayments to Improve Credit Score?',
              'Can I Get a Loan After Settlement?',
              'What is CRIF Credit Score?',
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

export default CrifReportPage
