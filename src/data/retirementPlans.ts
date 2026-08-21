export interface RetirementPlan {
  id: string
  insurer: string
  insurerLogo: string
  planName: string
  category: string
  badge?: 'nfo' | 'premium' | 'new'
  returns7yr: number
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
    year10: number
    year7: number
    year5: number
    year3: number
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
}

export const retirementPlans: RetirementPlan[] = [
  {
    id: 'icici-signature-retirement-1',
    insurer: 'ICICI Prudential',
    insurerLogo: '/src/assets/images/icici.png',
    planName: 'Signature Retirement',
    category: 'Market Linked + Guaranteed Plan',
    badge: 'nfo',
    returns7yr: 30.1,
    fundName: 'BSE 500 Momentum Value 50 Index Fund',
    maturityPayoutYou: 94.25,
    maturityPayoutNominee: 39.27,
    inCaseOfDeath: 'Life cover provided',
    lifeCoverLac: 10.0,
    tags: ['Inbuilt Life Cover', 'Save Tax Upto ₹7.67 Lac'],
    benefits: [
      { title: 'Regular Income', description: 'Monthly pension after retirement starts at 55 years', icon: '💰' },
      { title: 'Tax Savings', description: 'Invest up to ₹1.5 Lac under Section 80C and get tax benefits', icon: '💳' },
      { title: 'Life Cover', description: 'Inbuilt life cover of 10 Lac protects your family', icon: '🛡️' },
      { title: 'Flexible Options', description: 'Choose flexible pay periods (monthly, quarterly, yearly)', icon: '⚙️' },
    ],
    fundPerformance: {
      year10: 21.2,
      year7: 30.1,
      year5: 22.9,
      year3: 21.9,
      currentNav: '₹2,584',
      rating: 4.5,
    },
    investmentCriteria: {
      minAge: 18,
      maxAge: 60,
      minAmount: 50000,
      investmentTenure: 10,
    },
    faqsList: [
      {
        question: 'What is a Retirement Plan?',
        answer: 'A retirement plan is a long-term savings instrument designed to help you accumulate wealth during your earning years and provide regular income after retirement. These plans combine investment growth with guaranteed returns and life cover.',
      },
      {
        question: 'At what age can I retire?',
        answer: 'You can typically start receiving pension from age 55 years onwards. However, this depends on the specific plan you choose. Some plans offer flexibility in choosing your retirement age between 55-60 years.',
      },
      {
        question: 'Are there tax benefits?',
        answer: 'Yes! Contributions up to ₹1.5 Lac per financial year are eligible for tax deduction under Section 80C. Additionally, the maturity proceeds are usually tax-free in your hands, making it an efficient savings tool.',
      },
      {
        question: 'What happens if I die before retirement?',
        answer: "Most retirement plans come with inbuilt life cover. In case of death, your nominee will receive the sum assured along with accrued bonuses, ensuring your family's financial security.",
      },
    ],
  },
  {
    id: 'lic-jeevan-umang-retirement-1',
    insurer: 'LIC',
    insurerLogo: '/src/assets/images/lic.png',
    planName: 'Jeevan Umang Retirement',
    category: 'Guaranteed Income Plan',
    badge: 'premium',
    returns7yr: 23.8,
    fundName: 'LIC Balanced Fund',
    maturityPayoutYou: 85.5,
    maturityPayoutNominee: 35.8,
    inCaseOfDeath: 'Assured amount + bonuses',
    lifeCoverLac: 8.0,
    tags: ['Guaranteed Returns', 'Pension from Age 55'],
    benefits: [
      { title: 'Guaranteed Income', description: 'Assured pension benefits starting from retirement age', icon: '💵' },
      { title: 'Bonus Addition', description: 'Annual bonuses added throughout the policy term', icon: '🎁' },
      { title: 'Family Protection', description: '8 Lac life cover ensures family security', icon: '👨‍👩‍👧' },
      { title: 'Loan Facility', description: 'Take loans against your policy after 3 years', icon: '🏦' },
    ],
    fundPerformance: {
      year10: 19.5,
      year7: 23.8,
      year5: 20.3,
      year3: 18.9,
      currentNav: '₹2,156',
      rating: 4.3,
    },
    investmentCriteria: {
      minAge: 20,
      maxAge: 55,
      minAmount: 60000,
      investmentTenure: 10,
    },
    faqsList: [
      {
        question: 'Is the return guaranteed?',
        answer: 'Yes, LIC Jeevan Umang provides guaranteed returns. You receive a fixed guaranteed amount at maturity along with bonuses declared during the policy tenure.',
      },
      {
        question: 'Can I take a loan against this plan?',
        answer: 'Yes, after 3 years of policy commencement, you can take a loan against the surrender value of your policy, up to 90% of the guaranteed surrender value.',
      },
      {
        question: 'What is the maturity period?',
        answer: 'The policy matures at age 80 or after the specified policy term, whichever is later. You can choose tenure between 10-20 years based on your retirement goals.',
      },
      {
        question: 'Are dividends applicable?',
        answer: 'Yes, if the policy is participating, bonuses are declared annually based on the performance of the LIC portfolio. These bonuses are added to your maturity benefit.',
      },
    ],
  },
  {
    id: 'axis-retirement-plans-1',
    insurer: 'Axis Max',
    insurerLogo: '/src/assets/images/axis.png',
    planName: 'Axis Retirement Plus',
    category: 'Market Linked Plan with Guarantees',
    badge: 'new',
    returns7yr: 28.5,
    fundName: 'Axis Balanced Growth Fund',
    maturityPayoutYou: 92.3,
    maturityPayoutNominee: 38.7,
    inCaseOfDeath: 'Sum assured with accrued benefits',
    lifeCoverLac: 9.5,
    tags: ['Flexible Tenure', 'Market Linked with Guaranted Floor'],
    benefits: [
      { title: 'Market Upside', description: 'Participate in market growth with downside protection', icon: '📈' },
      { title: 'Guaranteed Floor', description: 'Minimum guaranteed return ensures principal protection', icon: '🔒' },
      { title: 'Pension Options', description: '10 different pension options to choose from at retirement', icon: '🎯' },
      { title: 'Rider Benefits', description: 'Add critical illness cover and accident benefit riders', icon: '⚕️' },
    ],
    fundPerformance: {
      year10: 20.8,
      year7: 28.5,
      year5: 21.6,
      year3: 20.5,
      currentNav: '₹2,345',
      rating: 4.4,
    },
    investmentCriteria: {
      minAge: 18,
      maxAge: 60,
      minAmount: 55000,
      investmentTenure: 10,
    },
    faqsList: [
      {
        question: 'What happens if markets fall sharply?',
        answer: 'Axis Retirement Plus has a guaranteed floor, which means your returns are protected even if markets perform poorly. You will receive at least the guaranteed minimum return.',
      },
      {
        question: 'Can I increase contributions later?',
        answer: 'Yes, most Axis Retirement plans allow top-up investments. You can increase your investment amount anytime during the policy term subject to plan rules.',
      },
      {
        question: 'What pension options are available?',
        answer: 'You can choose from 10 pension options including life pension, pension with return of capital, pension with limited term, etc., based on your retirement needs.',
      },
      {
        question: 'Can I withdraw before retirement?',
        answer: 'Limited partial withdrawals are allowed after specific policy years (typically from year 5). However, full surrender is possible with some tax implications.',
      },
    ],
  },
  {
    id: 'tata-aia-retirement-1',
    insurer: 'Tata AIA',
    insurerLogo: '/src/assets/images/tata-aia.png',
    planName: 'Retirement Secure Plus',
    category: 'Defined Benefit Plan',
    badge: 'premium',
    returns7yr: 26.3,
    fundName: 'Tata AIA Balanced Portfolio',
    maturityPayoutYou: 88.2,
    maturityPayoutNominee: 36.9,
    inCaseOfDeath: 'Nominee receives full sum assured',
    lifeCoverLac: 8.5,
    tags: ['100% Money Back', 'Assured Additions'],
    benefits: [
      { title: 'Money Back Benefit', description: 'Receive 100% of premiums back at maturity', icon: '💸' },
      { title: 'Assured Additions', description: 'Regular bonus additions enhance your retirement corpus', icon: '➕' },
      { title: 'Early Maturity', description: 'Receive benefits early if life expectancy allows', icon: '⏱️' },
      { title: 'Loan Against Policy', description: 'Borrow up to 80% of surrender value when needed', icon: '💳' },
    ],
    fundPerformance: {
      year10: 19.2,
      year7: 26.3,
      year5: 21.1,
      year3: 19.7,
      currentNav: '₹2,087',
      rating: 4.2,
    },
    investmentCriteria: {
      minAge: 20,
      maxAge: 58,
      minAmount: 65000,
      investmentTenure: 10,
    },
    faqsList: [
      {
        question: 'Do I get my money back?',
        answer: 'Yes! Tata AIA Retirement Secure Plus returns 100% of your premiums paid on maturity, along with bonuses and guaranteed additions, ensuring no capital loss.',
      },
      {
        question: 'How are bonuses declared?',
        answer: 'Bonuses are declared annually on a participating basis. These are added to your policy and become payable at maturity along with the guaranteed sum assured.',
      },
      {
        question: 'What are guaranteed additions?',
        answer: 'Guaranteed additions are fixed bonuses added to your policy every 5 years, in addition to annual bonuses. They enhance your maturity benefit',
      },
      {
        question: 'Can I switch funds?',
        answer: 'Depending on your plan variant, you may have the flexibility to switch between different fund options during the policy term, usually once a year or with some restrictions.',
      },
    ],
  },
]
