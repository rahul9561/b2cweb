import { useEffect } from 'react'
import { ArrowDownLeft, ArrowUpRight, Plus, ShieldCheck, WalletCards } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { getTotalBalance, type WalletTransaction } from '../lib/walletApi'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)

const transactionValue = (transaction: WalletTransaction, keys: string[]): unknown => {
  const entry = Object.entries(transaction).find(([key]) => keys.includes(key.toLowerCase()))
  return entry?.[1]
}

const transactionAmount = (transaction: WalletTransaction): number => {
  const value = transactionValue(transaction, ['amount', 'transaction_amount', 'value'])
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

const isCreditTransaction = (transaction: WalletTransaction): boolean => {
  const type = String(transactionValue(transaction, ['type', 'transaction_type', 'txn_type']) ?? '').toLowerCase()
  if (['debit', 'withdrawal', 'purchase', 'deduction'].some((word) => type.includes(word))) return false
  if (['credit', 'deposit', 'recharge', 'topup', 'top-up'].some((word) => type.includes(word))) return true
  return transactionAmount(transaction) > 0
}

export default function WalletPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { wallet, transactions, loading, error, refreshTransactions } = useWallet()

  useEffect(() => {
    if (isAuthenticated) void refreshTransactions().catch(() => undefined)
  }, [isAuthenticated, refreshTransactions])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const total = wallet ? getTotalBalance(wallet) : 0
  const balances = [
    { label: 'Main', value: wallet?.main ?? 0 },
    { label: 'AEPS', value: wallet?.aeps ?? 0 },
    { label: 'CIBIL', value: wallet?.cibil ?? 0 },
  ]

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="container-pb max-w-5xl py-8 md:py-12">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-950/15 md:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-blue-100">Current Wallet Balance</p>
              <p className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{formatMoney(total)}</p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
              <ShieldCheck size={16} /> Secure Wallet
            </span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {balances.map((balance) => (
              <div key={balance.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-100">{balance.label}</p>
                <p className="mt-1 font-semibold">{formatMoney(balance.value)}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/wallet/add-money')}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            <Plus size={18} /> Add Money
          </button>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-navy">Recent Transactions</h1>
              <p className="mt-1 text-sm text-slate-500">Your latest wallet activity</p>
            </div>
            <WalletCards className="text-blue-600" size={24} />
          </div>

          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-5 divide-y divide-slate-100">
            {transactions.map((transaction, index) => {
              const credit = isCreditTransaction(transaction)
              const title = String(transactionValue(transaction, ['title', 'description', 'type', 'transaction_type']) ?? 'Wallet transaction')
              const rawDate = transactionValue(transaction, ['created_at', 'createdat', 'date', 'transaction_date'])
              const date = rawDate ? new Date(String(rawDate)) : null
              return (
                <article key={String(transaction.id ?? transaction.transaction_id ?? index)} className="flex items-center gap-4 py-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${credit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {credit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {date && !Number.isNaN(date.getTime()) ? date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Transaction date unavailable'}
                    </p>
                  </div>
                  <p className={`text-sm font-bold ${credit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {credit ? '+' : '−'}{formatMoney(Math.abs(transactionAmount(transaction)))}
                  </p>
                </article>
              )
            })}

            {!loading && transactions.length === 0 && (
              <div className="py-12 text-center">
                <WalletCards className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 text-sm font-medium text-slate-600">No wallet transactions yet</p>
              </div>
            )}

            {loading && transactions.length === 0 && <p className="py-12 text-center text-sm text-slate-500">Loading transactions…</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
