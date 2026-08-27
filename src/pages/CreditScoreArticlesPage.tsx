import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { creditArticles } from '../components/credit-score/CreditScoreArticles'

export default function CreditScoreArticlesPage() {
  const [page, setPage] = useState(1)
  const perPage = 8
  const pages = Math.ceil(creditArticles.length / perPage)
  const articles = creditArticles.slice((page - 1) * perPage, page * perPage)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 py-12 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="container-pb relative z-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-300">
            <Link to="/" className="hover:text-white">Home</Link> / Credit Score / Page {page}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 backdrop-blur-md">
              <BookOpen size={24} />
            </span>
            <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Credit Score <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Articles</span>
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
            Explore expert articles on credit reports, credit scores and practical habits for a healthier financial profile.
          </p>
        </div>
      </div>

      <div className="container-pb py-10">
        <div className="mt-2 space-y-8">
          {articles.map((article) => (
            <Link
              to={`/category/credit-score/${article.slug}`}
              key={article.slug}
              className="group grid gap-5 border-b border-slate-100 pb-8 transition-all hover:border-blue-100 md:grid-cols-[330px_minmax(0,1fr)] md:items-center"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                <img src={article.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Credit Score</span>
                </div>
                <h2 className="mt-2 font-sans text-xl font-extrabold leading-tight text-navy transition group-hover:text-blue-700 md:text-2xl">{article.title}</h2>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">By {article.author}</span>
                  <span className="flex items-center gap-1"><CalendarDays size={13} /> {article.date}</span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{article.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-blue-600 transition group-hover:gap-2">
                  Read article <span className="transition-all group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {pages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Article pages">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-navy shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-40"
            >
              <ChevronLeft size={19} />
            </button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`h-10 w-10 rounded-full border text-sm font-extrabold shadow-sm transition ${
                  page === number
                    ? 'border-blue-700 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                    : 'border-slate-200 bg-white text-navy hover:border-blue-400'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setPage((current) => Math.min(pages, current + 1))}
              disabled={page === pages}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-navy shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-40"
            >
              <ChevronRight size={19} />
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}
