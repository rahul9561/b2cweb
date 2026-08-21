export type TaxRegime = 'old' | 'new'

export interface Slab {
  upto: number
  rate: number
}

export interface TaxBreakup {
  slabTax: number
  surcharge: number
  cess: number
  rebate: number
}

export interface TaxResult {
  taxPayable: number
  effectiveRatePct: number
  breakup: TaxBreakup
}

/* FY 2025-26 Old Regime slabs */
const OLD_SLABS: Slab[] = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
]

/* FY 2026-27 New Regime slabs */
const NEW_SLABS: Slab[] = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.1 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.2 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.3 },
]

/**
 * Pure income tax calculation engine.
 *
 * Steps:
 *  1. Compute taxable income = annualIncome − deductions (− standard deduction if opted)
 *  2. Apply slab rates progressively per regime
 *  3. Apply Section 87A rebate
 *  4. Apply Health & Education Cess: 4% of (tax after rebate + surcharge)
 *  5. Apply Surcharge when total income crosses ₹50L / ₹1Cr / ₹2Cr / ₹5Cr bands
 *     (old regime uncapped up to 37%; new regime capped at 25%)
 */
export function calculateTax(
  annualIncome: number,
  deductions: number,
  applyStandardDeduction: boolean,
  regime: TaxRegime
): TaxResult {
  // 1. Compute taxable income
  let taxableIncome = annualIncome - deductions
  if (applyStandardDeduction) {
    taxableIncome -= regime === 'old' ? 50000 : 75000
  }
  taxableIncome = Math.max(taxableIncome, 0)

  const slabs = regime === 'old' ? OLD_SLABS : NEW_SLABS

  // 2. Apply slab rates progressively
  let slabTax = 0
  let prevLimit = 0
  for (const slab of slabs) {
    if (taxableIncome > prevLimit) {
      const taxableInSlab = Math.min(taxableIncome, slab.upto) - prevLimit
      slabTax += taxableInSlab * slab.rate
    }
    prevLimit = slab.upto
  }

  // 3. Section 87A rebate
  let rebate = 0
  if (regime === 'old') {
    // Old regime: income ≤ ₹5,00,000 → rebate up to ₹12,500
    if (taxableIncome <= 500000) {
      rebate = Math.min(slabTax, 12500)
    }
  } else {
    // New regime: income ≤ ₹12,00,000 → rebate = min(taxPayable, ₹25,000)
    if (taxableIncome <= 1200000) {
      rebate = Math.min(slabTax, 25000)
    }
  }
  const taxAfterRebate = Math.max(slabTax - rebate, 0)

  // 5. Surcharge based on total income bands
  let surcharge = 0
  if (taxableIncome > 50000000) {
    surcharge = taxAfterRebate * (regime === 'old' ? 0.37 : 0.25)
  } else if (taxableIncome > 20000000) {
    surcharge = taxAfterRebate * (regime === 'old' ? 0.25 : 0.25)
  } else if (taxableIncome > 10000000) {
    surcharge = taxAfterRebate * 0.15
  } else if (taxableIncome > 5000000) {
    surcharge = taxAfterRebate * 0.1
  }

  // 4. Health & Education Cess: 4% of (tax after rebate + surcharge)
  const cess = (taxAfterRebate + surcharge) * 0.04

  const taxPayable = Math.round(taxAfterRebate + surcharge + cess)
  const effectiveRatePct = annualIncome > 0 ? (taxPayable / annualIncome) * 100 : 0

  return {
    taxPayable,
    effectiveRatePct,
    breakup: {
      slabTax: Math.round(slabTax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      rebate: Math.round(rebate),
    },
  }
}