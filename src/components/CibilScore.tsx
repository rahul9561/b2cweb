import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaHeadphones } from 'react-icons/fa'

export default function CibilScore() {
  return (
    <section className="bg-white py-14">
      <div className="container-pb">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT SECTION: What is TransUnion CIBIL? */}
          <div className="flex-1">
            <h2 className="text-[22px] font-medium text-navy mb-4">What is TransUnion CIBIL?</h2>
            <p className="text-[22px] font-medium text-navy mb-4">
              TransUnion CIBIL is India's leading and most trusted credit bureau that collects and manages consumer information, as provided by the lenders every month.
            </p>
            <p className="text-[22px] font-medium text-navy mb-6">
              At the time of credit application approval, lenders consider the CIBIL report, as the primary determinant to analyse the creditworthiness or the risk involved in lending money to the borrower. Therefore, it becomes highly important for financial institutions to check the CIBIL report in their loan approval process.
            </p>
            <p className="text-[12px] leading-6 text-slate2-secondary">
              In the following sections, we will discuss key details about India's leading Credit Information Company (link) (CIC), TransUnion CIBIL and its role in the borrowing or lending process.
            </p>
          </div>

          {/* RIGHT STICKY CARD */}
          <div className="sticky top-14 lg:top-0 lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate2-border p-6 shadow-sm">
              <h3 className="text-[18px] font-medium text-navy mb-6">How to Check CIBIL Score with AV Management?</h3>
              
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                  <span>Enter your mobile number</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l5 5-1.4 1.4L12 10l-3.3 3.3L3 21l5-5 1.4-1.4L12 6l3.3-3.3L21 3z" />
                  </svg>
                  <span>Verify your number using the OTP</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16l4-1 1 4h14l4-1-1 4v-16a2 2 0 0 0-2-2zm4 16H8l-2-2h10l-2 2zM6 6h12v2H6V6zm7 7V5l3 3h-3zM3 15h6v2H3v-2zm7-8V3h2v4h-2zm4 5h2v4h-2v-4zm-5 6h2v2h-2v-2zm3-7V5l-3 3h3z" />
                  </svg>
                  <span>Enter your PAN and basic details</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                  <span>View your credit score and get detailed credit report</span>
                </li>
              </ol>
              
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium mt-6 transition-colors hover:bg-green-700">
                Check Credit Score
              </button>
              
              <div className="mt-8 text-center text-[10px] text-slate2-secondary">
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-green-500"></span>
                  <span>₹2500 AV Wallet Cashback waiting for you!</span>
                </span>
                <div className="flex gap-2 mt-3">
                  <div className="px-3 py-2 flex border h-7 max-w-[77px] justify-center items-center border-[#E4E4E3] bg-white rounded-sm">
                    <img alt="Cibil" loading="lazy" width="45" height="15" decoding="async" className="w-full h-[15px]" src="/_next/image/?url=%2Fblog-assets%2Fimages%2Fen%2FCibil.svg&w=48&q=75" />
                  </div>
                  <div className="px-3 py-2 flex border h-7 max-w-[77px] justify-center items-center border-[#E4E4E3] bg-white rounded-sm">
                    <img alt="Experian" loading="lazy" width="45" height="15" decoding="async" className="w-full h-[15px]" src="/_next/image/?url=%2Fblog-assets%2Fimages%2FExperian_logo.svg&w=48&q=75" />
                  </div>
                  <div className="px-3 py-2 flex border h-7 max-w-[77px] justify-center items-center border-[#E4E4E3] bg-white rounded-sm">
                    <img alt="Equifax" loading="lazy" width="45" height="15" decoding="async" className="w-full h-[15px]" src="/_next/image/?url=%2Fblog-assets%2Fimages%2FEquifax_logo.svg&w=48&q=75" />
                  </div>
                  <div className="px-3 py-2 flex border h-7 max-w-[77px] justify-center items-center border-[#E4E4E3] bg-white rounded-sm">
                    <img alt="Crif" loading="lazy" width="45" height="15" decoding="async" className="w-full h-[15px]" src="/_next/image/?url=%2Fblog-assets%2Fimages%2FCrif_logo.svg&w=48&q=75" />
                  </div>
                </div>
                <p className="mt-4 text-[10px] lg:text-xs font-medium text-text-tertiary italic">Powered by</p>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT IS CIBIL SCORE AND CIBIL REPORT? */}
        <div className="mt-16 bg-gray-50 rounded-xl border p-6 mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">Q</span>
            What is CIBIL Score and CIBIL Report?
          </h3>
          <p className="text-[12px] leading-5 text-slate2-secondary mb-6">
            Credit score generated by TransUnion is known as CIBIL score. The detailed credit information report containing your CIBIL score is known as CIBIL report.
          </p>
          <div className="space-y-3 text-[12px] leading-5">
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">CIBIL score and report is one of the most preferred credit scores for lenders.</p>
                <p className="text-slate2-muted">CIBIL utilises the credit information provided by lenders to calculate your credit score.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">Your CIBIL score is refreshed every 15 days.</p>
                <p className="text-slate2-muted">You can download a CIBIL report from the website once every year.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">To get CIBIL reports regularly, you may have to subscribe to paid plans.</p>
                <p className="text-slate2-muted">At AV Management, you get the latest updated CIBIL score and full credit report every month.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">A good CIBIL score will help you get loans and credit cards relatively easily.</p>
                <p className="text-slate2-muted">Check your CIBIL score regularly to stay updated with your credit health.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0 rounded-full" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-medium text-navy">In case of errors, your CIBIL score may fall significantly.</p>
                <p className="text-slate2-muted">Resolve all such complaints at the earliest by raising a grievance with CIBIL.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CIBIL SCORE RANGE – WHAT DOES YOUR SCORE MEAN? */}
        <div className="mb-8">
          <h3 className="text-[18px] font-medium text-navy mb-6">CIBIL Score Range – What Does Your Score Mean?</h3>
          <p className="text-[12px] leading-5 text-slate2-secondary mb-6">
            CIBIL score ranges between 300 and 900. Closer the score to 900, more is it considered favourable for loan or credit card approval. Let us understand the CIBIL score range and its significance in detail.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate2-border">
                  <th className="text-left p-2">CIBIL Score</th>
                  <th className="text-left p-2">Score Range</th>
                  <th className="text-left p-2">What It Means</th>
                  <th className="text-left p-2">What It Signifies</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate2-border">
                  <td className="p-2 font-medium">801 - 900</td>
                  <td className="p-2">Excellent</td>
                  <td className="p-2">You have a superb credit history</td>
                  <td className="p-2">You would meet the eligibility criteria of most banks and NBFCs, and are likely to get best offers at this score.</td>
                </tr>
                <tr className="border-b border-slate2-border">
                  <td className="p-2 font-medium">761 - 800</td>
                  <td className="p-2">Very Good</td>
                  <td className="p-2">You have been responsible with credit and have displayed very good credit behaviour.</td>
                  <td className="p-2">Most banks and NBFCs would be willing to offer you credit.</td>
                </tr>
                <tr className="border-b border-slate2-border">
                  <td className="p-2 font-medium">701 - 760</td>
                  <td className="p-2">Good</td>
                  <td className="p-2">You have a good credit score, and your credit application may get approved by some lenders.</td>
                  <td className="p-2">You may still be ineligible for most loan and credit card offers. You should work on improving your score to increase your creditworthiness.</td>
                </tr>
                <tr className="border-b border-slate2-border">
                  <td className="p-2 font-medium">300 - 600</td>
                  <td className="p-2">Poor</td>
                  <td className="p-2">Immediate attention required. Your credit history is damaged and you will have to rebuild your credit score.</td>
                  <td className="p-2">Very less chances of new loan approval. Check your credit report to determine why your score is low and take action quickly.</td>
                </tr>
                <tr className="border-b border-slate2-border">
                  <td className="p-2 font-medium">NS/NH/0</td>
                  <td className="p-2">New to Credit</td>
                  <td className="p-2">It means you have never taken a loan or a credit card and have no credit history.</td>
                  <td className="p-2">To be eligible for the best offers on loans and credit cards in the future, you need to build your credit score.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex items-center gap-2">
            <div className="flex-1">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 9-11h-9l-1 8z" />
              </svg>
              <span className="text-[10px] text-slate2-secondary">*These credit score ranges (i.e. Excellent, Good, etc.) are based on AV Management's own criteria and are generally accepted in the industry.</span>
            </div>
          </div>
        </div>

        {/* GRADIENT TEAL BANNER WITH GAUGE */}
        <div className="mt-16 rounded-xl border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div>
              <h3 className="text-[20px] font-medium text-navy mb-2">CIBIL Score Range – What It Means for You?</h3>
              <p className="text-[12px] leading-relaxed text-slate2-secondary">
                Your CIBIL score tells lenders how trustworthy you are with credit. Each range affects your chances of getting a loan or credit card. Here's how it may impact your chances of loan or credit card approval.
              </p>
            </div>
            <div className="relative lg:w-[300px]">
              <div className="h-8 w-full rounded-lg bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 mb-4">
                <div className="h-full rounded-lg" style={{ background: 'conic-gradient(from 0deg, #ef4444 0%, #ef4444 33.33%, #f59e0b 33.33%, #f59e0b 66.67%, #10b981 66.67%, #10b981 100%)' }}>
                  <div className="absolute h-full w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-lg" style={{ left: '50%' }}></div>
                </div>
              </div>
              <div className="text-center">
                <svg className="h-6 w-6 mx-auto mb-2 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 7l8 5-5 8-11-7 11-7z" />
                </svg>
                <p className="text-[11px] text-slate2-secondary">Sample Score Position</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-[10px] text-slate2-secondary">
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full bg-gray-200"></span>
              <span>*These credit score ranges (i.e. Excellent, Good, etc.) are based on AV Management's own criteria and are generally accepted in the industry.</span>
            </span>
          </div>
        </div>

        {/* 6 DETAIL CARDS - 2 COL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-green-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">801 – 900 – Excellent CIBIL Score</h4>
                <p className="text-[11px] text-slate2-secondary">Reflects strong repayment history, low utilisation, and responsible credit behaviour.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Best chances of approval with the lowest interest rates and higher loan amounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Eligible for loans/cards, but not necessarily the best terms.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-green-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">761 - 800 – Very Good CIBIL Score</h4>
                <p className="text-[11px] text-slate2-secondary">Shows responsible credit behaviour with some scope for improvement.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Eligible for loans/cards, but not necessarily the best terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Eligible for loans/cards, but not necessarily the best terms.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-orange-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">701 – 760 – Good CIBIL Score</h4>
                <p className="text-[11px] text-slate2-secondary">Indicates past repayment issues or high credit utilisation.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>May get limited credit access at high interest rates and stricter terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>May get limited credit access at high interest rates and stricter terms.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-orange-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">601 – 700 – Average CIBIL Score</h4>
                <p className="text-[11px] text-slate2-secondary">Demonstrates regular defaults, very high utilisation, and frequent enquiries.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Most lenders may not approve the credit application; immediate attention is required.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Most lenders may not approve the credit application; immediate attention is required.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-red-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">300 – 600 – Poor CIBIL Score</h4>
                <p className="text-[11px] text-slate2-secondary">Represents irregular repayment history, defaults, or high DPD.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Most lenders reject applications in this range. Rebuild credit with responsible usage.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Most lenders reject applications in this range. Rebuild credit with responsible usage.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-[4px] bg-gray-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-navy">NA/NH – No History (New to Credit)</h4>
                <p className="text-[11px] text-slate2-secondary">You have no credit history, or lenders don't have a track record of your credit behaviour.</p>
              </div>
            </div>
            <ul className="text-[11px] leading-relaxed space-y-1">
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1zm2 1c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Apply for a secured credit card or small-ticket loan to start your credit journey.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18h6v2H9v-2zM9 12h6v2H9v-2zM9 6h6v2H9V6zm3-3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2zm6 10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h-2c0 1.1-.9 2-2 2h-2v-2c0-1.1-.9-2-2-2h-2v2z" />
                  </svg>
                <span>Apply for a secured credit card or small-ticket loan to start your credit journey.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}