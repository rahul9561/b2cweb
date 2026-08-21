export type MenuCategory =
  | 'termInsurance'
  | 'investmentPlans'
  | 'healthInsurance'
  | 'carInsurance'
  | 'creditScore'

export const insuranceMenu: Record<MenuCategory, { title: string; links: { label: string; to: string }[] }> & { otherInsurance: { title: string; links: { label: string; to: string }[] } } = {  termInsurance: {
    title: 'Term Insurance',
    links: [
      { label: 'Life Insurance', to: '/term-insurance' },
      { label: 'Best Term Insurance Plan', to: '/term-insurance' },
      { label: 'Term Insurance for NRI', to: '/term-insurance' },
      { label: 'What is Term Insurance', to: '/term-insurance' },
      { label: '1 Crore Term Insurance', to: '/term-insurance' },
      { label: 'Term Insurance Calculator', to: '/calculators' },
      { label: 'Term Insurance for Women', to: '/term-insurance' },
      { label: 'Home Loan Insurance', to: '/term-insurance' },
      { label: 'Term Insurance for HNI', to: '/term-insurance' },
      { label: 'Term Insurance Quotes', to: '/term-insurance' },
      { label: 'Term Insurance Return of Premium', to: '/term-insurance' },
    ],
  },
  investmentPlans: {
    title: 'Investment Plans',
    links: [
      { label: 'Investment Plans for NRIs', to: '/investment-plans' },
      { label: 'Investment Plans with High Returns', to: '/investment-plans' },
      { label: 'ULIP Plans', to: '/investment-plans' },
      { label: 'Best SIP Plans', to: '/investment-plans' },
      { label: 'Capital Guarantee Plans', to: '/investment-plans' },
      { label: 'Child Plans', to: '/investment-plans' },
      { label: 'Pension Plans', to: '/investment-plans' },
      { label: 'Guaranteed Return Plans', to: '/investment-plans' },
      { label: 'Tax Saving Investments', to: '/investment-plans' },
      { label: 'SIP Calculator', to: '/calculators' },
      { label: 'Endowment Policy', to: '/investment-plans' },
      { label: 'Money Back Policy', to: '/investment-plans' },
      { label: 'Annuity Plans', to: '/investment-plans' },
      { label: 'Income Tax Calculator', to: '/calculators' },
    ],
  },
  healthInsurance: {
    title: 'Health Insurance',
    links: [
      { label: 'Health Insurance Plans for Family', to: '/health-insurance' },
      { label: 'Health Insurance for NRI', to: '/health-insurance' },
      { label: 'Senior Citizens Health Insurance', to: '/health-insurance' },
      { label: 'Health Insurance for Parents', to: '/health-insurance' },
      { label: 'Maternity Insurance', to: '/health-insurance' },
      { label: 'Network Hospitals', to: '/health-insurance' },
      { label: 'Health Insurance Portability', to: '/health-insurance' },
      { label: 'OPD Insurance', to: '/health-insurance' },
      { label: 'Mediclaim Policy', to: '/health-insurance' },
      { label: 'Critical Illness Insurance', to: '/health-insurance' },
      { label: 'Health Insurance Calculator', to: '/calculators' },
    ],
  },
  carInsurance: {
    title: 'Car Insurance',
    links: [
      { label: 'Car Insurance', to: '/car-insurance' },
      { label: 'Bike Insurance', to: '/bike-insurance' },
      { label: 'Zero Depreciation Cover', to: '/car-insurance' },
      { label: 'Third Party Car Insurance', to: '/car-insurance' },
      { label: 'Comprehensive Car Insurance', to: '/car-insurance' },
      { label: 'Car Insurance Calculator', to: '/calculators' },
      { label: 'Electric Car Insurance', to: '/car-insurance' },
      { label: 'E-Bike Insurance', to: '/bike-insurance' },
      { label: 'IDV Calculator', to: '/calculators' },
      { label: 'Pay As You Drive', to: '/car-insurance' },
    ],
  },
  creditScore: {
    title: 'Credit Score',
    links: [
      // { label: 'Credit Report', to: '/credit-score' },
      { label: 'Cibil Report', to: '/cibil-report' },
      { label: 'Equifax Report', to: '/equifax-report' },
      { label: 'CRIF Report', to: '/crif-report' },
      { label: 'CIBIL Score', to: '/cibil-score' },
      { label: 'How to increase CIBIL Score', to: '/increase-cibil-score' },
      { label: 'CIBIL Score for Personal Loan/Instant Loan', to: '/cibil-score-loan' },
    ],
  },
  otherInsurance: {
    title: 'Other Insurance',
    links: [
      { label: 'Travel Insurance', to: '/travel-insurance' },
      { label: 'International Travel Insurance', to: '/travel-insurance' },
      { label: 'Schengen Travel Insurance', to: '/travel-insurance' },
      { label: 'Group Health Insurance', to: '/health-insurance' },
      { label: 'Home Insurance', to: '/health-insurance' },
      { label: 'Pet Insurance', to: '/health-insurance' },
      { label: 'Cancer Insurance', to: '/health-insurance' },
      { label: 'General Insurance', to: '/health-insurance' },
    ],
  },
}

export const renewMenu = [
  { label: 'Term Life Renewal', icon: 'life' },
  { label: 'Investment Renewal', icon: 'investment' },
  { label: 'Health Renewal', icon: 'health' },
  { label: 'Motor Renewal', icon: 'motor' },
  { label: 'Two Wheeler Renewal', icon: 'twoWheeler' },
  { label: 'Home Insurance Renewal', icon: 'home' },
]

export const claimMenu = [
  'File a new claim',
  'Claim is already filed with the Insurer',
  'Know more about filing claim',
  'Track existing claim',
  'Cashless network',
]

export const creditScoreMenu = [
  // { label: 'Credit Report', to: '/credit-report' },
  { label: 'Cibil Report', to: '/cibil-report' },
  { label: 'Equifax Report', to: '/equifax-report' },
  { label: 'CRIF Report', to: '/crif-report' },
  { label: 'CIBIL Score', to: '/cibil-score' },
  { label: 'How to increase CIBIL Score', to: '/increase-cibil-score' },
  // { label: 'CIBIL Score for Personal Loan/Instant Loan', to: '/cibil-score-loan' },
]
export const loansMenu = [
  {
    label: 'CIBIL Score for Personal Loan/Instant Loan',
    to: '/cibil-score-loan',
  },
  {
    label: 'Education Loan',
    to: '/education-loan',
  },
]
export const supportMenu = {
  accountService: [
    'Login with mobile number',
    'Track payments / policy status',
    'View / manage policies',
    'Claims',
    'Communication preferences',
    'Get help/Report an issue',
  ],
  more: ['Verify advisor', 'Advisor Feedback', 'Get a call back', 'Chat With Us', 'View more'],
}

export const footerColumns = {
  insurance: {
    title: 'Insurance',
    groups: [
      {
        heading: 'General Insurance',
        links: [
          'Car Insurance',
          'Bike Insurance',
          'Motor Insurance',
          'Third Party Car Insurance',
          'Third Party Bike Insurance',
          'Travel Insurance',
        ],
      },
      {
        heading: 'Life Insurance',
        links: ['Life Insurance', 'Term Insurance', 'Investment', 'Health Insurance'],
      },
    ],
  },
  calculators: {
    title: 'Calculators',
    links: [
      'Investment Calculators',
      'Fitness Calculators',
      'Income Tax Calculator',
      'Term Insurance Calculator',
      'EMI Calculator',
      'Car Insurance Calculator',
      'Bike Insurance Calculator',
      'Health Insurance Calculator',
      'SIP Calculator',
    ],
  },
  resources: {
    title: 'Resources',
    links: ['Articles', 'Customer reviews', 'Insurance companies', 'Awards', 'Consumer Insights'],
  },
  company: {
    title: 'Company',
    links: [
      'About Us',
      'Sitemap',
      'Careers',
      'Legal & Admin policies',
      'ISNP',
      'Contact us',
      'Verify your advisor',
      'Investor Relations',
    ],
  },
}
