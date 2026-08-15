export interface PremiumInput {
  basePremiumPerLakh: number
  lifeCover: string
  coverTillAge: string
  payFor: string
  paymentMode: string
}

export function calculatePremium({
  basePremiumPerLakh,
  lifeCover,
  coverTillAge,
  payFor,
  paymentMode,
}: PremiumInput): number {
  const coverAmount = parseIndianAmount(lifeCover)
  const age = parseAge(coverTillAge)
  const coverInLakh = coverAmount / 100000

  const ageFactor = Math.max(0.9, 1 + (age - 40) / 220)
  const payFactor = payFor === 'Limited Pay' ? 0.94 : payFor === 'Single Pay' ? 0.9 : 1
  const annualPremium = basePremiumPerLakh * coverInLakh * 0.1 * ageFactor * payFactor

  switch (paymentMode) {
    case 'Half Yearly':
      return Math.round(annualPremium / 2)
    case 'Monthly':
      return Math.round(annualPremium / 12)
    case 'Single':
      return Math.round(annualPremium)
    case 'Yearly':
    default:
      return Math.round(annualPremium)
  }
}

function parseIndianAmount(value: string): number {
  if (!value) return 1000000

  const normalized = value.toLowerCase().replace(/₹/g, '').replace(/,/g, '').trim()

  if (normalized.includes('lacs')) {
    const n = Number.parseFloat(normalized.replace(/lacs/g, ''))
    return Number.isFinite(n) ? n * 100000 : 1000000
  }

  if (normalized.includes('crore')) {
    const n = Number.parseFloat(normalized.replace(/crore/g, ''))
    return Number.isFinite(n) ? n * 10000000 : 10000000
  }

  if (normalized.includes('lac')) {
    const n = Number.parseFloat(normalized.replace(/lac/g, ''))
    return Number.isFinite(n) ? n * 100000 : 1000000
  }

  const n = Number.parseFloat(normalized)
  return Number.isFinite(n) ? n : 1000000
}

function parseAge(value: string): number {
  if (!value) return 60
  const match = value.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 60
}
