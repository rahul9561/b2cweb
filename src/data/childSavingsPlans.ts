export interface ChildSavingsPlan {
  id: string
  insurer: string
  insurerLogo: string
  planName: string
  category: string
  badge?: 'nfo' | 'premium' | 'new'
  returns6yr: number
  fundName: string
  maturityPayoutYou: number
  maturityPayoutNominee: number
  inCaseOfDeath: string
  lifeCoverLac: number
  tags: string[]
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  fundPerformance: {
    year6: number
    year7: number
    year8: number
    currentNav: string
    rating: number
  }
  investmentCriteria: {
    minAge: number
    maxAge: number
    minAmount: number
    investmentTenure: number
  }
  faqsList: {
    question: string
    answer: string
  }[]
  children?: ChildSavingsPlan[]
}

export const childSavingsPlans: ChildSavingsPlan[] = [
  {
    id: 'icici-cgs-child-1',
    insurer: 'ICICI Prudential',
    insurerLogo: '/src/assets/images/icici.png',
    planName: 'Capital Guarantee Solution',
    category: 'Market Linked + Guaranteed Plan',
    badge: 'nfo',
    returns6yr: 30.7,
    fundName: 'BSE 500 Momentum Value 50 Index Fund',
    maturityPayoutYou: 5.03,
    maturityPayoutNominee: 5.29,
    inCaseOfDeath: 'in case of death',
    lifeCoverLac: 104,
    tags: ['Triple Benefit', 'Inbuilt Life Cover', 'Plan with Zero GST', 'Save Tax Upto ₹63.8 Lac'],
    benefits: [
      {
        title: 'Life Cover',
        description: 'Life cover of ₹104 lac throughout the policy period',
        icon: '🛡️',
      },
      {
        title: 'Guaranteed Returns',
        description: 'Get guaranteed maturity benefits at 100%',
        icon: '✓',
      },
      {
        title: 'Tax Benefits',
        description: 'Save tax upto ₹63.8 lac under Section 80C',
        icon: '💰',
      },
    ],
    fundPerformance: {
      year6: 30.7,
      year7: 28.4,
      year8: 26.1,
      currentNav: '₹12.5',
      rating: 5,
    },
    investmentCriteria: {
      minAge: 0,
      maxAge: 18,
      minAmount: 5000,
      investmentTenure: 10,
    },
    faqsList: [
      {
        question: 'What is Capital Guarantee Solution Plan?',
        answer: 'Capital Guarantee Solution is a market-linked investment plan that guarantees your capital and provides market-linked returns.',
      },
      {
        question: 'What is the minimum investment required?',
        answer: 'You can start with an investment of ₹5,000 per month or ₹50,000 annually.',
      },
      {
        question: 'Are there tax benefits?',
        answer: 'Yes, you can save up to ₹63.8 lac in tax under Section 80C and Section 80CCC combined.',
      },
    ],
    children: [
      {
        id: 'icici-cgs-child-2',
        insurer: 'Axis Max',
        insurerLogo: '/src/assets/images/kotak.png',
        planName: 'Capital Guarantee Select',
        category: 'Market Linked + Guaranteed Plan',
        returns6yr: 28.5,
        fundName: 'High Growth Fund',
        maturityPayoutYou: 4.85,
        maturityPayoutNominee: 5.12,
        inCaseOfDeath: 'in case of death',
        lifeCoverLac: 98,
        tags: ['2X Premium Funding', 'Inbuilt Life Cover', 'New Fund Launched | 9th Aug'],
        benefits: [],
        fundPerformance: {
          year6: 28.5,
          year7: 26.2,
          year8: 24.1,
          currentNav: '₹11.8',
          rating: 4,
        },
        investmentCriteria: {
          minAge: 0,
          maxAge: 18,
          minAmount: 5000,
          investmentTenure: 10,
        },
        faqsList: [],
      },
    ],
  },
  {
    id: 'axis-max-child',
    insurer: 'Axis Max',
    insurerLogo: '/src/assets/images/kotak.png',
    planName: 'Capital Guarantee Plus',
    category: 'Market Linked + Guaranteed Plan',
    returns6yr: 23.3,
    fundName: 'High Growth Fund',
    maturityPayoutYou: 1.85,
    maturityPayoutNominee: 3.41,
    inCaseOfDeath: 'in case of death',
    lifeCoverLac: 89,
    tags: ['Triple Benefit', '2X Premium Funding', 'Inbuilt Life Cover', 'Plan with Zero GST'],
    benefits: [],
    fundPerformance: {
      year6: 23.3,
      year7: 21.5,
      year8: 19.8,
      currentNav: '₹10.2',
      rating: 4,
    },
    investmentCriteria: {
      minAge: 0,
      maxAge: 18,
      minAmount: 5000,
      investmentTenure: 10,
    },
    faqsList: [],
  },
  {
    id: 'sbi-child',
    insurer: 'SBI Life',
    insurerLogo: '/src/assets/images/lic.png',
    planName: 'Smart Scholar Plus',
    category: 'Child Savings Plan',
    returns6yr: 13.7,
    fundName: 'Equity Fund',
    maturityPayoutYou: 40,
    maturityPayoutNominee: 52.5,
    inCaseOfDeath: 'in case of death',
    lifeCoverLac: 75,
    tags: ['Premium Waiver', 'Inbuilt Life Cover', 'Plan with Zero GST', 'Minimum Premium: ₹5.5 K'],
    benefits: [],
    fundPerformance: {
      year6: 13.7,
      year7: 12.9,
      year8: 12.1,
      currentNav: '₹8.5',
      rating: 4,
    },
    investmentCriteria: {
      minAge: 0,
      maxAge: 16,
      minAmount: 5500,
      investmentTenure: 15,
    },
    faqsList: [],
  },
]
