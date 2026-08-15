import licLogo from '../assets/images/lic.png'
import hdfcLogo from '../assets/images/hdfc_ergo.png'
import iciciLogo from '../assets/images/icici.png'
import tataAigLogo from '../assets/images/tata-aig.svg'

export type GuaranteedPlanVariant = 'multiplier' | 'guaranteed'
export type PerPeriodType = 'month' | 'year'

export interface GuaranteedPlan {
  id: string
  insurerName: string
  insurerLogo: string
  planName: string
  variant: GuaranteedPlanVariant
  youGive: number
  youGiveYears: number
  investYears: number
  startAge: number
  payEndAge: number
  waitYears: number
  incomeStartAge: number
  youGet: number
  multiplier?: number
  taxFree?: boolean
  perPeriodAmount: number
  incomePerPeriod: number
  perPeriodType: PerPeriodType
  incomeYears: number
  age66Amount: number
  maturityAge: number
  lifeCover: number
  taxSavingsMax: number
  guaranteedAmount?: number
  bonusAmount?: number
  bonusFrequency?: string
  maturityLumpsum: number
  tags: string[]
  premiumWaiver?: boolean
  fdComparison: {
    fdRate: number
    postTaxRates: Record<string, number>
  }
  investmentCriteria: {
    minStartAge: number
    maxStartAge: number
    minMaturityYears: number
    maxMaturityYears: number
    minMonthly: number
    minHalfYearly: number
    minYearly: number
    limitedPayOptions: string[]
  }
}

export const guaranteedPlans: GuaranteedPlan[] = [
  {
    id: 'lic-jeevan-anand-plus',
    insurerName: 'Life Insurance Corporation of India',
    insurerLogo: licLogo,
    planName: 'Jeevan Anand Plus',
    variant: 'multiplier',
    youGive: 5,
    youGiveYears: 10,
    investYears: 10,
    startAge: 30,
    payEndAge: 40,
    waitYears: 15,
    incomeStartAge: 55,
    youGet: 12.5,
    multiplier: 2.5,
    taxFree: true,
    perPeriodAmount: 4.17,
    incomePerPeriod: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 12.5,
    maturityAge: 66,
    lifeCover: 10,
    taxSavingsMax: 1.5,
    maturityLumpsum: 12.5,
    tags: ['100% Guaranteed Returns', 'Tax Free Maturity', 'Life Cover'],
    premiumWaiver: true,
    fdComparison: {
      fdRate: 6.5,
      postTaxRates: { '5': 4.5, '20': 6.0, '30': 7.5 },
    },
    investmentCriteria: {
      minStartAge: 18,
      maxStartAge: 60,
      minMaturityYears: 10,
      maxMaturityYears: 20,
      minMonthly: 500,
      minHalfYearly: 3000,
      minYearly: 6000,
      limitedPayOptions: ['5', '10'],
    },
  },
  {
    id: 'hdfc-ergo-income-plus',
    insurerName: 'HDFC ERGO General Insurance',
    insurerLogo: hdfcLogo,
    planName: 'Income Plus Guaranteed',
    variant: 'guaranteed',
    youGive: 10,
    youGiveYears: 5,
    investYears: 5,
    startAge: 35,
    payEndAge: 40,
    waitYears: 10,
    incomeStartAge: 50,
    youGet: 15,
    taxFree: true,
    perPeriodAmount: 8.33,
    incomePerPeriod: 8.33,
    perPeriodType: 'month',
    incomeYears: 15,
    age66Amount: 15,
    maturityAge: 65,
    lifeCover: 20,
    taxSavingsMax: 1.5,
    guaranteedAmount: 15,
    bonusAmount: 2.5,
    bonusFrequency: 'annual',
    maturityLumpsum: 15,
    tags: ['Guaranteed Returns', 'Bonus Options', 'Life Cover'],
    fdComparison: {
      fdRate: 7.0,
      postTaxRates: { '5': 4.5, '20': 6.0, '30': 7.0 },
    },
    investmentCriteria: {
      minStartAge: 21,
      maxStartAge: 55,
      minMaturityYears: 5,
      maxMaturityYears: 15,
      minMonthly: 1000,
      minHalfYearly: 6000,
      minYearly: 12000,
      limitedPayOptions: ['5'],
    },
  },
  {
    id: 'icici-pru-wealth-builder',
    insurerName: 'ICICI Prudential',
    insurerLogo: iciciLogo,
    planName: 'Wealth Builder Plus',
    variant: 'multiplier',
    youGive: 3,
    youGiveYears: 12,
    investYears: 12,
    startAge: 28,
    payEndAge: 40,
    waitYears: 8,
    incomeStartAge: 48,
    youGet: 9,
    multiplier: 3.0,
    perPeriodAmount: 2.5,
    incomePerPeriod: 2.5,
    perPeriodType: 'month',
    incomeYears: 12,
    age66Amount: 9,
    maturityAge: 66,
    lifeCover: 8,
    taxSavingsMax: 1.5,
    maturityLumpsum: 9,
    tags: ['Market Linked', 'Capital Guarantee', 'Life Cover'],
    fdComparison: {
      fdRate: 6.0,
      postTaxRates: { '5': 4.5, '20': 5.5, '30': 6.5 },
    },
    investmentCriteria: {
      minStartAge: 18,
      maxStartAge: 60,
      minMaturityYears: 10,
      maxMaturityYears: 20,
      minMonthly: 500,
      minHalfYearly: 3000,
      minYearly: 6000,
      limitedPayOptions: ['5', '10', '12'],
    },
  },
  {
    id: 'tata-aig-secure-returns',
    insurerName: 'Tata AIG General Insurance',
    insurerLogo: tataAigLogo,
    planName: 'Secure Returns Plus',
    variant: 'multiplier',
    youGive: 8,
    youGiveYears: 10,
    investYears: 10,
    startAge: 32,
    payEndAge: 42,
    waitYears: 12,
    incomeStartAge: 54,
    youGet: 20,
    multiplier: 2.5,
    taxFree: true,
    perPeriodAmount: 6.67,
    incomePerPeriod: 6.67,
    perPeriodType: 'month',
    incomeYears: 15,
    age66Amount: 20,
    maturityAge: 66,
    lifeCover: 12,
    taxSavingsMax: 1.5,
    maturityLumpsum: 20,
    tags: ['100% Money Back', 'Assured Additions', 'Life Cover'],
    premiumWaiver: true,
    fdComparison: {
      fdRate: 6.75,
      postTaxRates: { '5': 4.5, '20': 6.0, '30': 7.25 },
    },
    investmentCriteria: {
      minStartAge: 20,
      maxStartAge: 58,
      minMaturityYears: 10,
      maxMaturityYears: 20,
      minMonthly: 800,
      minHalfYearly: 4800,
      minYearly: 9600,
      limitedPayOptions: ['5', '10'],
    },
  },
]
