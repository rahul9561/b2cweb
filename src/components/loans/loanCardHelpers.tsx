import {
  Banknote,
  Car,
  CreditCard,
  GraduationCap,
  House,
  Landmark,
  type LucideIcon,
} from 'lucide-react'

export const loanTypeIcon = (accountType: string, className = 'h-5 w-5') => {
  const type = accountType.toLowerCase()
  let Icon: LucideIcon = Landmark
  if (type.includes('credit') || type.includes('debit') || type.includes('card')) Icon = CreditCard
  else if (type.includes('home') || type.includes('housing') || type.includes('property')) Icon = House
  else if (type.includes('car') || type.includes('auto') || type.includes('vehicle')) Icon = Car
  else if (type.includes('education') || type.includes('student')) Icon = GraduationCap
  else if (type.includes('loan') || type.includes('finance')) Icon = Banknote
  return <Icon className={className} aria-hidden="true" />
}

export const loanStatus = (status: string) => {
  const normalized = status.trim().toLowerCase()
  if (normalized.includes('overdue') || normalized.includes('past due') || normalized.includes('delinquent')) {
    return { label: status || 'Overdue', className: 'border-red-200 bg-red-50 text-red-700' }
  }
  if (normalized.includes('active') || normalized.includes('open') || normalized.includes('current')) {
    return { label: status || 'Active', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
  }
  return { label: status || 'Closed', className: 'border-slate-200 bg-slate-100 text-slate-600' }
}

export const formatLoanAmount = (value: number | null) =>
  value === null
    ? '—'
    : new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

export const formatLoanDate = (value: string) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed)
}
export const displayAccountNumber = (value: string) =>
  value ? `Account number ${value}` : 'Account number unavailable'