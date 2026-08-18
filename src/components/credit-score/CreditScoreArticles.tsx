import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import article1 from '../../assets/images/article1.png'
import article2 from '../../assets/images/article2.png'
import article3 from '../../assets/images/article3.png'
import article4 from '../../assets/images/article4.png'
import article5 from '../../assets/images/article5.png'
import article6 from '../../assets/images/article6.png'
import article7 from '../../assets/images/article7.png'
import article8 from '../../assets/images/article8.png'
import article9 from '../../assets/images/article9.png'

export type CreditArticle = { slug: string; title: string; author: string; date: string; image: string; excerpt: string }

export const creditArticles: CreditArticle[] = [
  { slug: 'delayed-credit-score-correction', title: "Delayed Credit Score Correction? RBI's Compensation Framework Explained", author: 'Sumit Kumar', date: '12 Jun 2026', image: article1, excerpt: 'Know your rights when a credit-report correction takes longer than expected.' },
  { slug: 'credit-history-affect-credit-score', title: 'Does the Length of Your Credit History Affect Your Credit Score?', author: 'Vandana Punj', date: '27 May 2026', image: article2, excerpt: 'Understand why older, well-managed accounts can strengthen your profile.' },
  { slug: 'maximize-credit-score-with-loans', title: 'I Have 4 Credit Cards and 2 Loans: How to Maximize My Credit Score?', author: 'Lepakshi Phogat', date: '26 May 2026', image: article3, excerpt: 'Practical ways to balance several accounts without overextending credit.' },
  { slug: 'manage-multiple-loans', title: 'How to Manage Multiple Loans Without Hurting Your Credit Score', author: 'Neha Singh', date: '18 May 2026', image: article4, excerpt: 'Create a repayment plan that keeps every due date in view.' },
  { slug: 'students-build-credit-score', title: 'How Can Students Build Their Credit Scores Without Income Proof?', author: 'Bharti', date: '18 May 2026', image: article5, excerpt: 'Start building a healthy credit history with responsible first steps.' },
  { slug: 'self-employed-build-credit-score', title: 'How Self-Employed Can Build Credit Score and Creditworthiness', author: 'Rupanshi Thapa', date: '12 May 2026', image: article6, excerpt: 'Build a reliable record when income patterns vary month to month.' },
  { slug: 'minimum-due-payments-credit-score', title: 'Why Minimum Due Payments Hurt Your Credit Score', author: 'Arvind Kumar', date: '06 May 2026', image: article7, excerpt: 'See how revolving balances can affect your long-term credit health.' },
  { slug: 'accounts-that-impact-credit-score', title: 'Not All Accounts Count: What Impacts Your Credit Score?', author: 'Arvind Kumar', date: '05 May 2026', image: article8, excerpt: 'Learn which credit activities are reflected in your score.' },
  { slug: 'does-refinancing-hurt-credit-score', title: 'Does Refinancing a Loan Hurt Your Credit Score?', author: 'Arvind Kumar', date: '05 May 2026', image: article9, excerpt: 'Consider the credit-score factors before refinancing an existing loan.' },
  { slug: 'remove-credit-enquiries', title: 'How to Remove Credit Enquiries from Your CIBIL Report', author: 'Arvind Kumar', date: '04 May 2026', image: article8, excerpt: 'Understand enquiries and the appropriate route to dispute an incorrect record.' },
  { slug: 'fix-credit-score-drop', title: 'How to Fix a Credit Score Drop of 100+ Points', author: 'Sourabh Kumar', date: '28 Apr 2026', image: article7, excerpt: 'A practical checklist for investigating a sharp, unexpected score change.' },
  { slug: 'improve-credit-score-30-days', title: 'How to Improve Credit Score in 30 Days', author: 'Neha Singh', date: '27 Apr 2026', image: article6, excerpt: 'Actions that may support a healthier profile over the next billing cycle.' },
  { slug: 'credit-utilisation-ratio', title: 'What Is Credit Utilisation Ratio and Why Does It Matter?', author: 'Bharti', date: '20 Apr 2026', image: article3, excerpt: 'Learn how the amount you use against your limit can affect credit health.' },
  { slug: 'credit-score-for-personal-loan', title: 'What Credit Score Is Good for a Personal Loan?', author: 'Rupanshi Thapa', date: '17 Apr 2026', image: article4, excerpt: 'Know the score range lenders may consider alongside income and repayment capacity.' },
  { slug: 'settled-account-credit-report', title: 'How Does a Settled Account Affect Your Credit Report?', author: 'Vandana Punj', date: '12 Apr 2026', image: article2, excerpt: 'See why settlement status matters and steps to take before a future application.' },
  { slug: 'build-credit-history', title: 'How to Build Credit History from Scratch', author: 'Sumit Kumar', date: '09 Apr 2026', image: article5, excerpt: 'Responsible ways to establish a credit record when you are new to borrowing.' },
]

export function CreditScoreArticles({ limit }: { limit?: number }) {
  const [page, setPage] = useState(0)
  const cardsPerPage = 3
  const pages = Math.ceil(creditArticles.length / cardsPerPage)
  const articles = limit ? creditArticles.slice(0, limit) : creditArticles.slice(page * cardsPerPage, page * cardsPerPage + cardsPerPage)

  return <section className="mt-14" aria-labelledby="credit-score-articles">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Learn & grow</p><h2 id="credit-score-articles" className="mt-1 font-serif text-2xl font-bold text-navy md:text-3xl">Credit Score Articles</h2></div>
      <Link to="/category/credit-score" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Browse all articles</Link>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-3">
      {articles.map((article) => <Link to={`/category/credit-score/${article.slug}`} key={article.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
        <div className="aspect-[16/9] overflow-hidden bg-slate-100"><img src={article.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>
        <div className="p-5"><h3 className="min-h-12 font-semibold leading-6 text-navy group-hover:text-blue-700">{article.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{article.excerpt}</p><div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{article.author.charAt(0)}</span><span className="font-medium text-slate-700">{article.author}</span><span className="h-4 border-l border-slate-300" /><span className="text-slate-500">{article.date}</span></div></div>
      </Link>)}
    </div>
    {!limit && <div className="mt-7 flex items-center justify-center gap-4"><button type="button" aria-label="Previous articles" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="rounded-full border border-slate-200 p-2 text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300"><ChevronLeft size={20} /></button><span className="text-sm text-slate-500">{page + 1} / {pages}</span><button type="button" aria-label="Next articles" onClick={() => setPage((current) => Math.min(pages - 1, current + 1))} disabled={page === pages - 1} className="rounded-full border border-slate-200 p-2 text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300"><ChevronRight size={20} /></button></div>}
    <Link to="/category/credit-score" className="mx-auto mt-7 block w-fit rounded-lg border border-blue-600 px-7 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">View All Articles</Link>
  </section>
}

export function CreditScoreDisclaimer() {
  const [open, setOpen] = useState(false)
  return <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 md:px-7" aria-label="Disclaimer"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 text-left font-semibold text-navy">Disclaimer {open ? <ChevronUp className="text-blue-600" size={19} /> : <ChevronDown className="text-blue-600" size={19} />}</button>{open && <p className="max-w-5xl pt-4 text-sm leading-6 text-slate-600">AV Management is a loan aggregator and is authorised to provide services on behalf of its partners. The information on this page is for general guidance only; credit decisions, score calculations and report contents are determined by the relevant credit bureau and lending institutions. <span className="block pt-1 text-xs">*Applicable for selected customers.</span></p>}</section>
}
