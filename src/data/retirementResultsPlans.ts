import type { RetirementPlanType } from '../context/RetirementFiltersContext'

export interface RetirementResultsPlan {
  id: string
  insurer: string
  insurerLogo: string
  planName: string
  planType: RetirementPlanType
  baseReturns: Record<number, number>
  irdaiReturns: Record<number, number>
  rollingReturns: Record<number, number>
  pensionPerMonth: number
  taxFree: boolean
  pensionLabel: string
  infoPill?: string
  tags: string[]
  newFundLaunched?: string
  instantTaxReceipt?: boolean
  zeroGst?: boolean
  inbuiltLifeCover?: boolean
  saveTaxUpto?: number
  nav?: string
}

export const retirementResultsPlans: RetirementResultsPlan[] = [
  {
    id: 'icici-signature-retirement',
    insurer: 'ICICI Prudential',
    insurerLogo: '/src/assets/images/icici.png',
    planName: 'Signature',
    planType: 'Market linked',
    baseReturns: { 10: 32.4, 8: 31.2, 7: 30.1, 6: 28.9, 5: 27.4 },
    irdaiReturns: { 4: 24.2, 8: 30.1 },
    rollingReturns: { 3: 22.1, 5: 25.8, 7: 30.1, 10: 32.4 },
    pensionPerMonth: 1.25,
    taxFree: true,
    pensionLabel: 'Pension',
    infoPill: 'Avail units at ₹10 NAV',
    tags: ['Inbuilt Life Cover', '⭐ Plan with Zero GST', 'Save Tax Upto ₹7.67 Cr'],
    inbuiltLifeCover: true,
    zeroGst: true,
    saveTaxUpto: 7.67,
    newFundLaunched: '12 Aug 2026',
    instantTaxReceipt: true,
    nav: '₹10',
  },
  {
    id: 'axis-flexi-wealth-advantage',
    insurer: 'Axis Max',
    insurerLogo: '/src/assets/images/axis.png',
    planName: 'Flexi Wealth Advantage Plan',
    planType: 'Market linked',
    baseReturns: { 10: 29.8, 8: 28.9, 7: 28.5, 6: 27.2, 5: 25.9 },
    irdaiReturns: { 4: 22.8, 8: 28.5 },
    rollingReturns: { 3: 20.8, 5: 24.6, 7: 28.5, 10: 29.8 },
    pensionPerMonth: 1.05,
    taxFree: true,
    pensionLabel: 'Pension',
    infoPill: 'Avail units at ₹10 NAV',
    tags: ['Inbuilt Life Cover', 'Save Tax Upto ₹6.2 Cr', 'Instant Tax Receipt'],
    inbuiltLifeCover: true,
    saveTaxUpto: 6.2,
    instantTaxReceipt: true,
    nav: '₹10',
  },
  {
    id: 'bajaj-life-retirement',
    insurer: 'Bajaj Life',
    insurerLogo: '/src/assets/images/bajaj-general.svg',
    planName: 'Bajaj Life Retirement Plan',
    planType: 'Market linked',
    baseReturns: { 10: 27.6, 8: 26.8, 7: 26.3, 6: 25.1, 5: 23.8 },
    irdaiReturns: { 4: 21.4, 8: 26.3 },
    rollingReturns: { 3: 19.6, 5: 23.2, 7: 26.3, 10: 27.6 },
    pensionPerMonth: 0.85,
    taxFree: true,
    pensionLabel: 'Pension',
    tags: ['⭐ Plan with Zero GST', 'Save Tax Upto ₹5.4 Cr'],
    zeroGst: true,
    saveTaxUpto: 5.4,
    nav: '₹10',
  },
]