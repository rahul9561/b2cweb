import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaHeadphones } from 'react-icons/fa'

export default function CibilPrompt3() {
  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT SECTION: How to Maintain a High Credit Score */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-xl border p-8 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div>
                  <h3 className="text-[20px] font-medium text-navy mb-2">How to Maintain a High Credit Score</h3>
                  <p className="text-[12px] leading-relaxed text-slate2-secondary">
                    Hand with clipboard illustration would go here
                  </p>
                </div>
                <div className="relative lg:w-[200px]">
                  <div className="h-64 w-full rounded-lg bg-gradient-to-b from-teal-500 via-cyan-500 to-teal-500 flex items-center justify-center mb-4">
                    <svg className="h-24 w-24 text-white" viewBox="0 0 24 24" fill="none" />
                  </div>
                </div>
              </div>
              <ul className="space-y-3 text-[12px] leading-relaxed">
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Repay all dues on time</p>
                    <p className="text-slate2-muted">Ensure all credit card bills and loan EMIs are paid by the due date.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Use credit smartly & keep utilisation low</p>
                    <p className="text-slate2-muted">Keep your credit utilisation ratio below 30% of your available limit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Minimise frequent credit enquiries</p>
                    <p className="text-slate2-muted">Avoid applying for multiple credits in a short period as each enquiry impacts your score.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Increase your age of credit history</p>
                    <p className="text-slate2-muted">Older credit accounts in good standing positively impact your score.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Refrain from closing the oldest active account</p>
                    <p className="text-slate2-muted">Keeping your oldest credit account open maintains your credit history length.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-green-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-navy">Rectify errors in your credit report immediately</p>
                    <p className="text-slate2-muted">Dispute any inaccuracies with CIBIL to prevent negative impacts on your score.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* PRO TIP CARD */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-navy">PRO TIP</h4>
                  <p className="text-[12px] text-blue-800">Lenders usually consider a CIBIL score above 760 ideal for pre-approved offers and favourable credit terms.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative">
                  <svg className="h-6 w-6 text-blue-500 opacity-50 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 7l8 5-5 8-11-7 11-7z" />
                  </svg>
                  <img alt="QR Code" loading="lazy" className="h-12 w-12 rounded-lg bg-white p-2" src="/_next/image/?url=%2Fblog-assets%2Fimages%2Fqr-code.png&w=128&q=75" />
                  <p className="text-[10px] text-blue-600 mt-3 ml-4">Scan the QR code to check your latest score & monitor it monthly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Steps to Check Your CIBIL Report */}
          <div className="sticky top-14 lg:top-0 lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate2-border p-6 shadow-sm">
              <h3 className="text-[18px] font-medium text-navy mb-6">Steps to Check Your TransUnion CIBIL Report</h3>
              <p className="text-[12px] leading-relaxed text-slate2-secondary mb-6">
                Follow these simple steps to check and download your TransUnion CIBIL Score and receive monthly updates:
              </p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                  <span>Click here to check your CIBIL score</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l5 5-1.4 1.4L12 10l-3.3 3.3L3 21l5-5 1.4-1.4L12 6l3.3-3.3L21 3z" />
                  </svg>
                  <span>Enter your basic details, such as name, mobile number, and email address and verify it by using OTP authentication</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16l4-1 1 4h14l4-1-1 4v-16a2 2 0 0 0-2-2zm4 16H8l-2-2h10l-2 2zM6 6h12v2H6V6zm7 7V5l3 3h-3zM3 15h6v2H3v-2zm7-8V3h2v4h-2zm4 5h2v4h-2v-4zm-5 6h2v2h-2v-2zm3-7V5l-3 3h3z" />
                  </svg>
                  <span>Click on the Get CIBIL Report button to know your credit score</span>
                </li>
              </ol>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-[11px] text-slate2-secondary">
                  You have to follow these steps only for the first time. From next, you can simply login to your AV Management account and check your latest updated CIBIL score.
                </p>
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-[11px] text-slate2-secondary">
                  Your CIBIL report is secured and you will have to enter a password to view report. Your Date of Birth (DDMMYYYY format) is the password of your downloaded CIBIL report pdf.
                </p>
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-[11px] text-slate2-secondary italic">
                  If you find any discrepancy in your credit report, you can raise a dispute with CIBIL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENTS OF CIBIL REPORT */}
        <div className="mt-16 bg-gray-50 rounded-xl border p-6 mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">C</span>
            Components of CIBIL Report
          </h3>
          <p className="text-[12px] leading-5 text-slate2-secondary mb-6">
            The following are the various components of the CIBIL report:
          </p>
          <div className="space-y-4 text-[12px]">
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <h4 className="font-medium text-navy text-[12px]">CIBIL Score</h4>
                <p className="text-slate2-muted text-[11px]">The CIBIL score is reflected in the first section of the CIBIL report. / It sums up your credit history and depicts your creditworthiness. / It is considered the most important component of your CIBIL report.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="4" rx="1" ry="1" />
                <rect x="14" y="3" width="7" height="4" rx="1" ry="1" />
                <rect x="14" y="13" width="7" height="4" rx="1" ry="1" />
                <rect x="3" y="13" width="7" height="4" rx="1" ry="1" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div>
                <h4 className="font-medium text-navy text-[12px]">Personal Information</h4>
                <p className="text-slate2-muted text-[11px]">This section contains your name, gender, date of birth, etc. It also covers your identification numbers such as Aadhaar, PAN, etc.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="4" rx="1" ry="1" />
                <rect x="14" y="3" width="7" height="4" rx="1" ry="1" />
                <rect x="14" y="13" width="7" height="4" rx="1" ry="1" />
                <rect x="3" y="13" width="7" height="4" rx="1" ry="1" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div>
                <h4 className="font-medium text-navy text-[12px]">Contact Information</h4>
                <p className="text-slate2-muted text-[11px]">Your address(es), mobile number, email ID, and telephone numbers are provided in this section.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <h4 className="font-medium text-navy text-[12px]">Account Information</h4>
                <p className="text-slate2-muted text-[11px]">This part of the CIBIL credit report contains information about your current as well as previous loans and credit cards. / Details, such as your outstanding balance, overdue amount, loan amount, credit card limit, etc., are also mentioned. / DPD section is also present here that shows your repayment history.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <h4 className="font-medium text-navy text-[12px]">Enquiry Information</h4>
                <p className="text-slate2-muted text-[11px]">Whenever you apply for a personal loan / credit card, the lender requests CIBIL for a copy of your Credit Information Report (CIR). / Such a request made by the lender is called a hard enquiry. / This section contains details of the credit application, amount and dates when such enquiries were made along with the name of the financial institution that enquired.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] lg:text-xs text-slate2-secondary italic">
            CIBIL credit report provides a detailed historical record of how an individual has handled debt in the past. Please note that the credit report does not include details of an individual's investment or savings.
          </p>
          <p className="mt-3 text-[11px]">
            <a href="#" className="text-blue-600 hover:underline">Also Read: How to Improve your Credit Score Online</a>
          </p>
        </div>

        {/* WHAT IS CIBIL RANK? */}
        <div className="mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6">What is CIBIL Rank?</h3>
          <p className="text-[12px] leading-relaxed text-slate2-secondary mb-6">
            TransUnion CIBIL calculates and generates a commercial Company Credit Report and CIBIL Rank for individuals, as well as for companies, enterprises and organizations.
          </p>
          <div className="space-y-3 text-[12px]">
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">TransUnion CIBIL calculates and generates CIBIL Ranks for businesses, MSMEs, enterprises and organizations.</p>
                <p className="text-slate2-muted">CIBIL rank serves as a numeric summary of the details included in CIBIL's Company Credit Report (CCR).</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL Rank varies on a scale of Rank 1 to 10</p>
                <p className="text-slate2-muted">CIBIL Rank 1 is considered the best rank with companies at least risk for lenders.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL Rank 10 is considered the worst rank showing companies at maximum risk or even at default or insolvency.</p>
                <p className="text-slate2-muted">As CIBIL rank indicates a company's past handling of credit, it can significantly affect the chances of getting a new loan sanctioned.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">The closer a company's CIBIL Rank is to 1, the higher the chances of getting approved for fresh credit at lower interest rates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROLE OF CIBIL IN BORROWING PROCESS */}
        <div className="mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6">Role of TransUnion CIBIL in the Borrowing Process</h3>
          <p className="text-[12px] leading-relaxed text-slate2-secondary mb-6">
            CIBIL credit reports play a crucial role in approving or denying credit applications for new credit, such as loans and credit cards. The details of this process are as follows:
          </p>
          <div className="space-y-4 text-[12px]">
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">Financial institutions, such as Banks/NBFCs submit the consumer's and business's credit data or consumer information to TransUnion CIBIL.</p>
                <p className="text-slate2-muted">It contains details of the past credit behaviour, including account details, outstanding loan amount, repayment history, existing loan/credit card information, enquiries, Days Past Due (DPD) and collateral/security, if any.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL collates this data and uses its unique statistical algorithm to calculate and generate Credit Information Reports (CIRs) for individuals that include CIBIL Score.</p>
                <p className="text-slate2-muted">It generates Company Credit Reports (CCRs) for companies that contain CIBIL Rank.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">Lenders can check the CIBIL report and CIBIL Score/CIBIL Rank to evaluate the risk of lending to applicants and accordingly approve or reject new loan/credit card applications.</p>
                <p className="text-slate2-muted">Applicants with good CIBIL scores are preferred by lenders and are eligible to avail loans at low interest rates, as well as instant credit card approvals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">New-to-credit individuals do not have credit history (NA)/(NH) and thus, can find it difficult to get preferential loans and cards.</p>
                <p className="text-slate2-muted">Applicants with not so good CIBIL scores may be able to avail fresh credit but at stricter loan terms.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] lg:text-xs">
            <a href="#" className="text-blue-600 hover:underline">Reasons for Rejection of Your Credit Card Application</a>
          </p>
        </div>

        {/* WHY CIBIL SCORE IS IMPORTANT */}
        <div className="mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6">Why is CIBIL Score Important?</h3>
          <div className="space-y-3 text-[12px]">
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL score is one of the primary components that lenders check to assess an applicant's credit behaviour.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL score holds major importance in deciding the creditworthiness of the applicant to decide on loan approval or denial.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">Applicants with CIBIL score of 760+ and as close to 900 are considered first by lenders in their loan or credit card approvals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">A good CIBIL helps in getting credit at low interest rates, along with added benefits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CIBIL CUSTOMER CARE */}
        <div className="bg-gray-50 rounded-xl border p-8 mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6">CIBIL Customer Care</h3>
          <div className="space-y-3 text-[12px]">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3l5 5-1.4 1.4L12 10l-3.3 3.3L3 21l5-5 1.4-1.4L12 6l3.3-3.3L21 3z" />
              </svg>
              <span>CIBIL Helpline Number for consumers is (+91) 22-614-043-00. (Operational from 10:00 am to 06:00 pm (Monday- Friday))</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3l5 5-1.4 1.4L12 10l-3.3 3.3L3 21l5-5 1.4-1.4L12 6l3.3-3.3L21 3z" />
              </svg>
              <span>Fax: (+91) 22-66384666</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">You can also write to CIBIL at its registered address.</p>
                <p className="text-slate2-muted">The address is:</p>
                <p className="text-[11px] font-medium text-navy break-all">TransUnion CIBIL Limited — One World Centre, Tower 2A, 19th Floor, Senapati Bapat Marg, Elphinstone Road, Mumbai – 400 013</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] lg:text-xs">
            <a href="#" className="text-blue-600 hover:underline">CIBIL Customer Care</a>
          </p>
        </div>
      </div>
    </section>
  )
}