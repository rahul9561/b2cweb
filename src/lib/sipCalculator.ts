export type InvestmentMode = 'monthly' | 'yearly' | 'lumpsum'

export interface SipInput {
  mode: InvestmentMode
  amount: number
  years: number
  annualRate: number
  stepUpPct: number
  stepUpEnabled: boolean
}

export interface SipResult {
  totalWealth: number
  amountInvested: number
  estReturns: number
  stepUpBonus: number
  stepUpTotalWealth: number
  stepUpAmountInvested: number
  stepUpEstReturns: number
}

/**
 * Standard SIP future value
 * FV = P * (((1 + i) ** n - 1) / i) * (1 + i)
 * P = monthly investment, i = monthly rate (annualRate/12/100), n = months (years*12)
 */
export function standardSipFV(monthlyP: number, annualRate: number, years: number): number {
  if (annualRate <= 0) return monthlyP * 12 * years
  const i = annualRate / 12 / 100
  const n = years * 12
  return monthlyP * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
}

/**
 * Step-up SIP future value
 * For each year y (0-indexed), monthly installment = P * (1 + stepUpPct/100) ** y
 * Sum FV of each year's 12 monthly installments compounded for remaining months to maturity
 */
export function stepUpSipFV(
  monthlyP: number,
  annualRate: number,
  years: number,
  stepUpPct: number
): number {
  if (stepUpPct <= 0) return standardSipFV(monthlyP, annualRate, years)
  const i = annualRate / 12 / 100
  let total = 0
  for (let y = 0; y < years; y++) {
    const installment = monthlyP * Math.pow(1 + stepUpPct / 100, y)
    const remainingMonths = (years - y) * 12
    // FV of 12 monthly installments of `installment` at monthly rate i, compounded for remainingMonths
    const yearFV = installment * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i)
    total += yearFV * Math.pow(1 + i, remainingMonths - 12)
  }
  return total
}

/**
 * Lumpsum future value
 * FV = P * (1 + annualRate/100) ** years
 */
export function lumpsumFV(principal: number, annualRate: number, years: number): number {
  if (annualRate <= 0) return principal
  return principal * Math.pow(1 + annualRate / 100, years)
}

/**
 * Amount invested for SIP (sum of all installments)
 */
export function sipAmountInvested(monthlyP: number, years: number, stepUpPct = 0): number {
  if (stepUpPct <= 0) return monthlyP * 12 * years
  let total = 0
  for (let y = 0; y < years; y++) {
    total += monthlyP * Math.pow(1 + stepUpPct / 100, y) * 12
  }
  return total
}

/**
 * Main calculation engine — returns all derived values for the UI
 */
export function calculateSip(input: SipInput): SipResult {
  const { mode, amount, years, annualRate, stepUpPct, stepUpEnabled } = input

  // Base (without step-up) calculation
  let totalWealth: number
  let amountInvested: number

  if (mode === 'lumpsum') {
    totalWealth = lumpsumFV(amount, annualRate, years)
    amountInvested = amount
  } else if (mode === 'yearly') {
    // Yearly SIP: convert yearly amount to monthly equivalent for the formula
    const monthlyEquivalent = amount / 12
    totalWealth = standardSipFV(monthlyEquivalent, annualRate, years)
    amountInvested = amount * years
  } else {
    // Monthly SIP
    totalWealth = standardSipFV(amount, annualRate, years)
    amountInvested = amount * 12 * years
  }

  const estReturns = totalWealth - amountInvested

  // Step-up calculation
  let stepUpTotalWealth = totalWealth
  let stepUpAmountInvested = amountInvested
  let stepUpEstReturns = estReturns
  let stepUpBonus = 0

  if (stepUpEnabled && stepUpPct > 0 && mode !== 'lumpsum') {
    if (mode === 'yearly') {
      const monthlyEquivalent = amount / 12
      stepUpTotalWealth = stepUpSipFV(monthlyEquivalent, annualRate, years, stepUpPct)
      stepUpAmountInvested = sipAmountInvested(monthlyEquivalent, years, stepUpPct)
    } else {
      stepUpTotalWealth = stepUpSipFV(amount, annualRate, years, stepUpPct)
      stepUpAmountInvested = sipAmountInvested(amount, years, stepUpPct)
    }
    stepUpEstReturns = stepUpTotalWealth - stepUpAmountInvested
    stepUpBonus = stepUpTotalWealth - totalWealth
  }

  return {
    totalWealth: Math.round(totalWealth),
    amountInvested: Math.round(amountInvested),
    estReturns: Math.round(estReturns),
    stepUpBonus: Math.round(stepUpBonus),
    stepUpTotalWealth: Math.round(stepUpTotalWealth),
    stepUpAmountInvested: Math.round(stepUpAmountInvested),
    stepUpEstReturns: Math.round(stepUpEstReturns),
  }
}

/**
 * Format a number in Indian numbering system (L = Lakh, Cr = Crore)
 * e.g. ₹15.7 L, ₹1.03 Cr, ₹94.1 L
 */
export function formatIndianCurrency(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`
  }
  if (abs >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`
  }
  if (abs >= 1000) {
    return `₹${(value / 1000).toFixed(1)} K`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

/**
 * Format a number with Indian grouping (e.g. 1,50,000)
 */
export function formatIndianNumber(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`
}