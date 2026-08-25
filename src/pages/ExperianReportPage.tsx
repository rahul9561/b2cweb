import React from 'react'
import { Check, Landmark, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import CreditReportFlow from '../components/CreditReportFlow'
import { CreditScoreArticles, CreditScoreDisclaimer } from '../components/credit-score/CreditScoreArticles'

const scoreRows = [
  ['800 – 900', 'Excellent', 'Your profile shows strong credit behaviour.', 'You may be better placed for credit approval and favourable terms, subject to the lender’s policy.', 'bg-emerald-600'],
  ['750 – 799', 'Very Good', 'Experian generally considers a score above 750 to be good.', 'A healthy score can improve your chances of securing loans or credit cards.', 'bg-green-500'],
  ['700 – 749', 'Good', 'Your score is approaching the generally preferred range.', 'Continue making timely payments and managing credit exposure carefully.', 'bg-yellow-400'],
  ['650 – 699', 'Fair', 'Your credit profile may need improvement.', 'Lenders may review other parts of your financial profile more closely.', 'bg-orange-500'],
  ['300 – 649', 'Needs Attention', 'Review your report and repayment habits.', 'Improving payment history and credit utilisation may support your score over time.', 'bg-red-500'],
]

const BulletList = ({ items }: { items: string[] }) => <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 rounded-full bg-blue-600 p-0.5 text-white" />{item}</li>)}</ul>
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section><h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">{title}</h2><div className="mt-5">{children}</div></section>
const Copy = ({ children }: { children: React.ReactNode }) => <p className="text-sm leading-7 text-slate-700 md:text-base">{children}</p>

const ExperianReportPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-10 md:py-14">
        <div className="container-pb grid gap-9 lg:grid-cols-[1.35fr_.85fr]">
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck size={14} /> Experian credit profile
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold text-navy md:text-5xl">Experian Credit Score &amp; Report</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Understand how lenders may view your credit profile with a detailed Experian Credit Report and
              take informed steps toward stronger credit health.
            </p>

            <div className="mt-7 grid gap-3 sm:max-w-xl">
              {['View Your 3-Digit Experian Credit Score', 'Review Loans, Credit Cards and Payment History', 'Spot Errors or Unfamiliar Credit Enquiries'].map((text) => (
                <div key={text} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium shadow-sm">
                  <Check className="h-5 w-5 rounded-full bg-green-500 p-1 text-white" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 overflow-hidden rounded-xl border border-blue-200 bg-white sm:grid-cols-4">
              {[
                ['300–900', 'Score range'],
                ['750+', 'Generally good'],
                ['3 digits', 'Credit score'],
                ['1 report', 'Detailed profile'],
              ].map(([value, label]) => (
                <div key={label} className="border-b border-r border-blue-100 p-4 text-center last:border-r-0 sm:border-b-0">
                  <strong className="block text-xl text-navy">{value}</strong>
                  <span className="mt-1 block text-[11px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <CreditReportFlow reportType="experian" reportName="Experian Credit Report" bureauName="Experian Credit Information Company of India" />
        </div>
      </section>

      <main className="container-pb py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-14">
            <Section title="What is Experian India?">
              <Copy>
                Experian is a credit bureau that receives credit information from banks, financial institutions
                and other credit grantors and turns that information into consumer credit reports and scores.
              </Copy>
              <Copy>
                Banks and NBFCs can use an Experian Credit Report and score, along with other parts of your
                financial profile, when reviewing a loan or credit-card application.
              </Copy>
            </Section>

            <Section title="What is an Experian Credit Score and Credit Report?">
              <Copy>
                An Experian Credit Report is a detailed record of how you have handled loans and credit cards.
                Your Experian credit score is the three-digit summary calculated from the information in that report.
              </Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <BulletList items={[
                  'Experian credit scores range from 300 to 900, with 900 being the highest.',
                  'A score above 750 is generally considered good by Experian.',
                  'The report can include active and closed accounts, repayment history and outstanding balances.',
                  'Lenders can consider both the detailed report and score during a credit decision.',
                  'Checking your report regularly can help you identify errors or unfamiliar activity.',
                ]} />
              </div>
            </Section>

            <Section title="Experian Credit Score Range – What Does Your Score Mean?">
              <Copy>
                Experian credit scores range between 300 and 900. A higher score generally represents stronger
                credit behaviour, but every lender applies its own approval policy and eligibility checks.
              </Copy>
              <div className="my-7 flex overflow-hidden rounded-full text-center text-xs font-bold shadow-sm">
                {scoreRows.map(([score, range, , , color]) => (
                  <div key={range as string} className={`${color} flex min-h-11 flex-1 flex-col items-center justify-center px-1 ${range === 'Good' ? 'text-slate-900' : 'text-white'}`}>
                    <span>{score}</span>
                    <span className="hidden text-[10px] font-medium sm:block">{range}</span>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[#294b8d] text-white">
                    <tr><th className="p-4">Experian Score</th><th className="p-4">Score Range</th><th className="p-4">What It Means</th><th className="p-4">What It Signifies</th></tr>
                  </thead>
                  <tbody>
                    {scoreRows.map(([score, range, means, signifies], index) => (
                      <tr key={range as string} className={index % 2 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="border-t border-slate-200 p-4 font-medium">{score}</td>
                        <td className={`border-t border-slate-200 p-4 font-semibold ${range === 'Good' ? 'text-yellow-500' : 'text-slate-700'}`}>{range}</td>
                        <td className="border-t border-slate-200 p-4 leading-6">{means}</td>
                        <td className="border-t border-slate-200 p-4 leading-6">{signifies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs italic text-slate-500">Except for Experian’s published 300–900 scale and general 750+ guidance, the bands above are indicative; lender criteria vary.</p>
            </Section>

            <Section title="Steps to Check Your Experian Credit Report">
              <Copy>Follow these simple steps to view and download your Experian Credit Report.</Copy>
              <ol className="mt-5 space-y-4">
                {[
                  'Enter your full name, phone number, PAN number and gender, and authorize the live wallet-price deduction.',
                  'Verify your mobile number using the OTP sent via SMS.',
                  'Continue to your Experian Credit Report once verification is complete.',
                  'Review the report and download the PDF for your records.',
                ].map((text, i) => (
                  <li key={text} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
                    <p className="pt-0.5 text-sm leading-6 text-slate-700">{text}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Components of an Experian Credit Report">
              <Copy>The following are the main components you may find in an Experian Credit Report.</Copy>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-6">
                  {[
                    ['Experian Credit Score', 'A three-digit summary of your credit behaviour, calculated from the information in your report.'],
                    ['Personal Information', 'Your identifying details, such as name, PAN, date of birth and addresses linked to credit accounts.'],
                    ['Credit Accounts', 'A summary of active and closed loans and credit cards, including limits and outstanding balances.'],
                    ['Payment History', 'Details showing whether repayments were made on time, missed or paid late.'],
                    ['Credit Enquiries', 'A list of applications or enquiries made by banks and lending institutions when you applied for credit.'],
                    ['Adverse Account Status', 'Defaults, settlements or written-off accounts may appear when reported by a credit institution.'],
                  ].map(([title, text]) => (
                    <div key={title}><h3 className="font-semibold text-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Factors That Affect Your Experian Credit Score">
              <BulletList items={[
                'Payment history – regular, on-time payments support a healthier profile, while missed payments can lower the score.',
                'Credit exposure – using a large proportion of your available credit may negatively affect the score.',
                'Age of credit – a longer credit history helps lenders understand your repayment pattern over time.',
                'Types of accounts – a balanced mix of secured and unsecured credit can support your profile.',
                'Recent applications – multiple lender enquiries in a short period can affect how your credit profile is assessed.',
              ]} />
            </Section>

            <Section title="Understanding Experian’s V4 Credit Score">
              <Copy>
                Experian V4 is the latest version of its consumer credit scoring system. It uses more recent
                bureau data and enhanced behavioural variables to assess an individual’s creditworthiness.
              </Copy>
              <div className="mt-5">
                <BulletList items={[
                  'A V4 score may differ from an earlier Experian score because the scoring methodology has been updated.',
                  'Scores can differ across bureaus because each bureau may use a different calculation method.',
                  'A score of -1 generally means there is not enough credit information to generate a score.',
                  'A score of 0 can mean there has not been enough recent reported credit activity under the latest model.',
                ]} />
              </div>
            </Section>

            <Section title="Why is Your Experian Credit Report Important?">
              <BulletList items={[
                'Banks and lenders can review your report when assessing a loan or credit-card application.',
                'A higher score may improve your chances of approval and access to more favourable terms.',
                'Reviewing the report helps you check whether your personal and account information is accurate.',
                'Unfamiliar accounts or enquiries can be warning signs of possible identity fraud.',
                'If information is incorrect, you can raise a dispute with Experian and the relevant credit institution.',
              ]} />
            </Section>

            <Section title="Experian Customer Support">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm leading-6">
                <div className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><p><strong>Helpline:</strong> 022-68165681<br />Monday to Saturday, 9:30 am to 6:30 pm.</p></div>
                <div className="mt-4 flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><p><strong>Email:</strong> Consumer.Support@in.experian.com</p></div>
                <div className="mt-4 flex gap-3"><Landmark className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><p><strong>Walk-in address:</strong><br />Experian Credit Information Company of India, Floor 5, Tower 3, Equinox Business Park, Kurla, Mumbai – 400070.<br />Monday to Friday, 9:30 am to 6:30 pm.</p></div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-navy">How to Check Experian Credit Report with AV Management?</h2>
              <div className="mt-6 space-y-5">
                {['Enter your full name, phone number, PAN number and gender.', 'Verify your number using the OTP.', 'View your Experian Credit Report after verification.'].map((text, i) => (
                  <div key={text} className="flex gap-3 text-sm"><Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500 p-1 text-white" /><span><b>Step {i + 1}:</b> {text}</span></div>
                ))}
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-7 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">Check Experian Report</button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#0a3b8f] to-[#061f55] p-6 text-white">
              <Sparkles className="text-yellow-300" />
              <h3 className="mt-5 text-xl font-semibold">Take control of your credit health</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Monitor your report, make payments on time and keep your credit information accurate.</p>
            </div>
          </aside>
        </div>

        <Section title="Experian Credit Score Suggested Articles">
          <div className="grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
            {['How can I download my Experian Credit Report?', 'What is a Good Experian Credit Score?', 'How to Raise a Dispute for Experian Report Errors?', 'How Does Credit Utilisation Affect Your Score?', 'How Can You Spot Fraud in a Credit Report?', 'What is an Experian Credit Score?'].map((article, i) => (
              <a href="#top" key={article} className={`border-b border-r border-slate-200 p-4 text-sm text-blue-600 transition hover:bg-blue-50 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>{article}</a>
            ))}
          </div>
        </Section>

        <CreditScoreArticles />
        <CreditScoreDisclaimer />
      </main>
    </div>
  )
}

export default ExperianReportPage
