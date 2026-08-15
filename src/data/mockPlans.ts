export interface PlanBenefit {
  icon: string // lucide icon name
  title: string
  description: string
}

export interface BoundaryCondition {
  label: string
  icon: string
  min: string
  max: string
  details?: string
}

export interface PayForOption {
  icon: string
  title: string
  description: string
}

export interface MockPlan {
  id: string
  insurerName: string
  planName: string
  lifeCover: string
  coverTillAge: string
  claimSettled: number
  monthlyPremium: number
  yearlyPremium: number
  benefits: number
  fullRefund: boolean
  lowestPriceGuarantee: boolean
  priceRevisingDate?: string
  discountPercent: number
  onlineSaving: number
  planType: string[]
  payoutOption: string[]
  premiumPayType: string[]
  // Extended fields for Plan Detail
  basePremiumPerLakh: number // premium per 1 lakh cover per year
  benefitsList: PlanBenefit[]
  boundaryConditions: BoundaryCondition[]
  payForOptions: PayForOption[]
  partnerBadge?: string
}

export const mockPlans: MockPlan[] = [
  {
    id: '1',
    insurerName: 'Horizon Life',
    planName: 'SecurePlus Smart',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 99.3,
    monthlyPremium: 1299,
    yearlyPremium: 1299 * 12 * 0.95,
    benefits: 8,
    fullRefund: true,
    lowestPriceGuarantee: true,
    priceRevisingDate: '15 Aug 2026',
    discountPercent: 18,
    onlineSaving: 4200,
    planType: ['Level Cover'],
    payoutOption: ['Lump sum'],
    premiumPayType: ['Regular Pay'],
    basePremiumPerLakh: 610,
    partnerBadge: 'Platinum Partner',
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Shield', title: 'Accidental Death Benefit', description: 'Additional sum assured paid if death occurs due to an accident during the policy term' },
      { icon: 'Heart', title: 'Critical Illness Rider', description: 'Lump sum payout on diagnosis of any of the 36 critical illnesses covered under the rider' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹10 Lacs', max: '₹25 Lacs' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '42 Years (Policy Term 5 Years)', max: '70 Years (Policy Term 33 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹540', max: 'Yearly ₹6,100' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
      { icon: 'HandCoins', title: 'Limited Pay', description: 'Pay premiums for 5, 10 years and stay covered for the entire policy duration' },
      { icon: 'Wallet', title: 'Single Pay', description: 'You pay premium only once and stay covered for the entire policy duration' },
    ],
  },
  {
    id: '2',
    insurerName: 'Trustwell Life',
    planName: 'Guardian Supreme Plus',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 99.7,
    monthlyPremium: 1150,
    yearlyPremium: 1150 * 12 * 0.95,
    benefits: 6,
    fullRefund: false,
    lowestPriceGuarantee: false,
    discountPercent: 15,
    onlineSaving: 3800,
    planType: ['Level Cover', 'Increasing Cover'],
    payoutOption: ['Lump sum', 'Lump sum + Monthly Income'],
    premiumPayType: ['Regular Pay', 'Limited Pay'],
    basePremiumPerLakh: 530,
    partnerBadge: 'Gold Partner',
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Shield', title: 'Accidental Death Benefit', description: 'Additional sum assured paid if death occurs due to an accident during the policy term' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹25 Lacs', max: '₹50 Lacs' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '45 Years (Policy Term 8 Years)', max: '65 Years (Policy Term 28 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹480', max: 'Yearly ₹5,400' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
      { icon: 'HandCoins', title: 'Limited Pay', description: 'Pay premiums for 5, 10 years and stay covered for the entire policy duration' },
    ],
  },
  {
    id: '3',
    insurerName: 'NorthStar Life',
    planName: 'EliteTerm Pro',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 98.9,
    monthlyPremium: 1080,
    yearlyPremium: 1080 * 12 * 0.95,
    benefits: 5,
    fullRefund: true,
    lowestPriceGuarantee: false,
    discountPercent: 12,
    onlineSaving: 3200,
    planType: ['Level Cover'],
    payoutOption: ['Lump sum + Monthly Income'],
    premiumPayType: ['Regular Pay'],
    basePremiumPerLakh: 490,
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Heart', title: 'Critical Illness Rider', description: 'Lump sum payout on diagnosis of any of the 36 critical illnesses covered under the rider' },
      { icon: 'Shield', title: 'Terminal Illness Benefit', description: 'Early payout of sum assured if diagnosed with a terminal illness during the policy term' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹10 Lacs', max: '₹30 Lacs' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '40 Years (Policy Term 3 Years)', max: '65 Years (Policy Term 28 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹420', max: 'Yearly ₹4,800' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
    ],
  },
  {
    id: '4',
    insurerName: 'Bluepeak Life',
    planName: 'ValueTerm Elite',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 99.5,
    monthlyPremium: 1350,
    yearlyPremium: 1350 * 12 * 0.95,
    benefits: 10,
    fullRefund: true,
    lowestPriceGuarantee: true,
    priceRevisingDate: '20 Aug 2026',
    discountPercent: 20,
    onlineSaving: 5100,
    planType: ['Level Cover', 'Increasing Cover'],
    payoutOption: ['Lump sum', 'Monthly Income only'],
    premiumPayType: ['Regular Pay', 'Limited Pay', 'Single Pay'],
    basePremiumPerLakh: 680,
    partnerBadge: 'Platinum Partner',
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Shield', title: 'Accidental Death Benefit', description: 'Additional sum assured paid if death occurs due to an accident during the policy term' },
      { icon: 'Heart', title: 'Critical Illness Rider', description: 'Lump sum payout on diagnosis of any of the 36 critical illnesses covered under the rider' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹10 Lacs', max: '₹50 Lacs' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '42 Years (Policy Term 5 Years)', max: '70 Years (Policy Term 33 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹580', max: 'Yearly ₹6,600' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
      { icon: 'HandCoins', title: 'Limited Pay', description: 'Pay premiums for 5, 10 years and stay covered for the entire policy duration' },
      { icon: 'Wallet', title: 'Single Pay', description: 'You pay premium only once and stay covered for the entire policy duration' },
    ],
  },
  {
    id: '5',
    insurerName: 'Evershield Life',
    planName: 'ProtectPlus Max',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 99.1,
    monthlyPremium: 1199,
    yearlyPremium: 1199 * 12 * 0.95,
    benefits: 7,
    fullRefund: false,
    lowestPriceGuarantee: false,
    discountPercent: 14,
    onlineSaving: 3500,
    planType: ['Return of Premium'],
    payoutOption: ['Lump sum'],
    premiumPayType: ['Regular Pay'],
    basePremiumPerLakh: 560,
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Shield', title: 'Accidental Death Benefit', description: 'Additional sum assured paid if death occurs due to an accident during the policy term' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹15 Lacs', max: '₹35 Lacs' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '45 Years (Policy Term 8 Years)', max: '65 Years (Policy Term 28 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹500', max: 'Yearly ₹5,700' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
      { icon: 'HandCoins', title: 'Limited Pay', description: 'Pay premiums for 5, 10 years and stay covered for the entire policy duration' },
    ],
  },
  {
    id: '6',
    insurerName: 'ClearView Life',
    planName: 'Horizon Shield',
    lifeCover: '₹1 Cr',
    coverTillAge: '60 Yrs',
    claimSettled: 99.8,
    monthlyPremium: 1420,
    yearlyPremium: 1420 * 12 * 0.95,
    benefits: 9,
    fullRefund: true,
    lowestPriceGuarantee: true,
    priceRevisingDate: '10 Aug 2026',
    discountPercent: 22,
    onlineSaving: 5800,
    planType: ['Level Cover', 'Increasing Cover', 'Return of Premium'],
    payoutOption: ['Lump sum', 'Lump sum + Monthly Income', 'Monthly Income only'],
    premiumPayType: ['Regular Pay', 'Limited Pay', 'Single Pay'],
    basePremiumPerLakh: 720,
    partnerBadge: 'Platinum Partner',
    benefitsList: [
      { icon: 'TrendingUp', title: 'Tax benefit', description: 'Save tax upto ₹46,800 every year under Section 80C and get 100% tax free returns on maturity' },
      { icon: 'Shield', title: 'Accidental Death Benefit', description: 'Additional sum assured paid if death occurs due to an accident during the policy term' },
      { icon: 'Heart', title: 'Critical Illness Rider', description: 'Lump sum payout on diagnosis of any of the 36 critical illnesses covered under the rider' },
    ],
    boundaryConditions: [
      { label: 'Life Cover Amount', icon: 'Umbrella', min: '₹10 Lacs', max: '₹1 Crore' },
      { label: 'Cover yourself Till Age', icon: 'CalendarClock', min: '40 Years (Policy Term 3 Years)', max: '75 Years (Policy Term 38 Years)' },
      { label: 'Frequency of payment', icon: 'Layers', min: 'Monthly ₹620', max: 'Yearly ₹7,100' },
    ],
    payForOptions: [
      { icon: 'Calendar', title: 'Regular Pay', description: 'You pay premiums throughout the policy duration' },
      { icon: 'HandCoins', title: 'Limited Pay', description: 'Pay premiums for 5, 10 years and stay covered for the entire policy duration' },
      { icon: 'Wallet', title: 'Single Pay', description: 'You pay premium only once and stay covered for the entire policy duration' },
    ],
  },
]
