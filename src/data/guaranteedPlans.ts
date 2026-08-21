export interface GuaranteedPlan {
  id: string
  insurerLogo: string
  insurerName: string
  planName: string
  youGive: number
  youGiveYears: number
  youGet: number
  variant: 'multiplier' | 'guaranteedBonus'
  multiplier?: number
  taxFree?: boolean
  perPeriodAmount: number
  perPeriodType: string
  incomeYears: number
  age66Amount: number
  maturityAge: number
  tags: string[]
  premiumWaiver?: boolean
  guaranteedAmount?: number
  bonusAmount?: number
  bonusFrequency?: string
  lifeCover: number
  taxSavingsMax: number
  investYears: number
  incomeStartAge: number
  incomePerPeriod: number
  maturityLumpsum: number
  startAge: number
  payEndAge: number
  waitYears: number
  investmentCriteria: {
    minStartAge: number
    maxStartAge: number
    minMaturityYears: number
    maxMaturityYears: number
    minMonthly: number
    minHalfYearly: number
    minYearly: number
    limitedPayOptions: number[]
  }
  fdComparison: {
    fdRate: number
    postTaxRates: Record<string, number>
  }
}

const baseCriteria = {
  minStartAge: 18,
  maxStartAge: 55,
  minMaturityYears: 10,
  maxMaturityYears: 35,
  minMonthly: 1000,
  minHalfYearly: 6000,
  minYearly: 12000,
  limitedPayOptions: [5, 10, 15, 20],
}

const baseFd = {
  fdRate: 6.5,
  postTaxRates: { '10': 5.85, '20': 5.2, '30': 4.55 },
}

export const guaranteedPlans: GuaranteedPlan[] = [
  {
    id: 'lic-jeevan-umang',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'LIC',
    planName: 'Jeevan Umang',
    youGive: 5,
    youGiveYears: 10,
    youGet: 8.5,
    variant: 'multiplier',
    multiplier: 1.7,
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5,
    maturityAge: 66,
    tags: ['Guaranteed Returns', 'Tax Free', 'Premium Calculator'],
    premiumWaiver: true,
    lifeCover: 10,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
  {
    id: 'hdfc-sanchay-advantage',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'HDFC Life',
    planName: 'Sanchay Advantage',
    youGive: 5,
    youGiveYears: 10,
    youGet: 9.2,
    variant: 'multiplier',
    multiplier: 1.84,
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5.5,
    maturityAge: 66,
    tags: ['Guaranteed Returns', 'Tax Free', 'Inbuilt Life Cover'],
    premiumWaiver: true,
    lifeCover: 12,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5.5,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
  {
    id: 'sbi-smart-wealth',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'SBI Life',
    planName: 'Smart Wealth Builder',
    youGive: 5,
    youGiveYears: 10,
    youGet: 8.8,
    variant: 'multiplier',
    multiplier: 1.76,
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5.2,
    maturityAge: 66,
    tags: ['Guaranteed Returns', 'Tax Free', 'Save Tax'],
    premiumWaiver: true,
    lifeCover: 11,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5.2,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
  {
    id: 'icici-guaranteed-income',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'ICICI Prudential',
    planName: 'Guaranteed Income Plan',
    youGive: 5,
    youGiveYears: 10,
    youGet: 9.5,
    variant: 'guaranteedBonus',
    guaranteedAmount: 9.5,
    bonusAmount: 1.2,
    bonusFrequency: 'at maturity',
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5.8,
    maturityAge: 66,
    tags: ['100% Guaranteed', 'Tax Free', 'Bonus'],
    premiumWaiver: true,
    lifeCover: 13,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5.8,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
  {
    id: 'tata-aiag-guaranteed',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'Tata AIA',
    planName: 'Guaranteed Future Plan',
    youGive: 5,
    youGiveYears: 10,
    youGet: 9.0,
    variant: 'guaranteedBonus',
    guaranteedAmount: 9.0,
    bonusAmount: 1.0,
    bonusFrequency: 'at maturity',
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5.4,
    maturityAge: 66,
    tags: ['100% Guaranteed', 'Tax Free', 'Inbuilt Life Cover'],
    premiumWaiver: true,
    lifeCover: 12,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5.4,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
  {
    id: 'bajaj-guaranteed-return',
    insurerLogo: '/src/assets/images/av-logon.png',
    insurerName: 'Bajaj Allianz',
    planName: 'Guaranteed Return Plan',
    youGive: 5,
    youGiveYears: 10,
    youGet: 8.6,
    variant: 'multiplier',
    multiplier: 1.72,
    taxFree: true,
    perPeriodAmount: 4.17,
    perPeriodType: 'month',
    incomeYears: 10,
    age66Amount: 5.1,
    maturityAge: 66,
    tags: ['Guaranteed Returns', 'Tax Free', 'Save Tax'],
    premiumWaiver: true,
    lifeCover: 10,
    taxSavingsMax: 1.5,
    investYears: 10,
    incomeStartAge: 56,
    incomePerPeriod: 4.17,
    maturityLumpsum: 5.1,
    startAge: 30,
    payEndAge: 40,
    waitYears: 16,
    investmentCriteria: baseCriteria,
    fdComparison: baseFd,
  },
]