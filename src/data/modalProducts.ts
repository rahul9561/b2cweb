export interface ModalProduct {
  id: string
  title: string
  icon: string
  url: string
  badge?: string
}

export interface ModalSection {
  section: string
  items: ModalProduct[]
}

export const personalInsurance: ModalSection[] = [
  {
    section: 'Term Life Insurance',
    items: [
      { id: 'free-term', title: 'Free of Cost Term Life Insurance', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
      { id: 'term-self', title: 'Term Insurance for Self', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
      { id: 'term-women', title: 'Term Insurance for Women', icon: '/images/icons/icon-term-insurance-women.png', url: '/term-insurance', badge: 'Upto 20% Cheaper' },
      { id: 'term-nri', title: 'Term Insurance for NRI', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
      { id: 'term-50', title: 'Term Insurance Above 50 Years', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
      { id: 'term-rop', title: 'Term Insurance with Return of Premium', icon: '/images/icons/icon_return-of-premium.png', url: '/term-insurance' },
      { id: 'term-1cr', title: '₹1 Crore Term Insurance', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
      { id: 'term-self-employed', title: 'Term Insurance for Self Employed', icon: '/images/icons/icon_term-life.png', url: '/term-insurance' },
    ],
  },
  {
    section: 'Health Insurance',
    items: [
      { id: 'health-self', title: 'Health Insurance for Self', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-family', title: 'Family Health Insurance', icon: '/images/icons/icon_family-health-insurance.png', url: '/health-insurance', badge: 'Upto 25% Discount' },
      { id: 'health-parents', title: 'Health Insurance for Parents', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-senior', title: 'Senior Citizen Health Insurance', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-1cr', title: '₹1 Crore Health Insurance', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-women', title: 'Health Insurance for Women', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-ayush', title: 'Ayush Health Insurance', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'health-pre-existing', title: 'Health Insurance for Pre-Existing Diseases', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
    ],
  },
  {
    section: 'Investment Plans',
    items: [
      { id: 'inv-guaranteed', title: 'Guaranteed Return Plans', icon: '/images/icons/icon_guaranteed-return-plan.png', url: '/investment-plans', badge: 'Upto 7.4% Returns' },
      { id: 'inv-ulp', title: 'ULIP Plans', icon: '/images/icons/icon_investment.png', url: '/investment-plans' },
      { id: 'inv-sip', title: 'SIP Plans', icon: '/images/icons/icon_investment.png', url: '/investment-plans' },
      { id: 'inv-child', title: 'Child Savings Plans', icon: '/images/icons/icon_child-saving-plan.png', url: '/investment-plans', badge: 'Premium Waiver' },
      { id: 'inv-retirement', title: 'Retirement / Pension Plans', icon: '/images/icons/icon_retirement-plan.png', url: '/investment-plans' },
      { id: 'inv-endowment', title: 'Endowment Plans', icon: '/images/icons/icon_investment.png', url: '/investment-plans' },
      { id: 'inv-moneyback', title: 'Money Back Plans', icon: '/images/icons/icon_investment.png', url: '/investment-plans' },
    ],
  },
  {
    section: 'Other Plans',
    items: [
      { id: 'other-travel', title: 'Travel Insurance', icon: '/images/icons/icon_travel-insurance.png', url: '/travel-insurance' },
      { id: 'other-car', title: 'Car Insurance', icon: '/images/icons/icon_car-insurance.png', url: '/car-insurance' },
      { id: 'other-bike', title: '2 Wheeler Insurance', icon: '/images/icons/icon_two-wheeler-insurance.png', url: '/bike-insurance' },
      { id: 'other-home', title: 'Home Insurance', icon: '/images/icons/icon_home-insurance.png', url: '/health-insurance' },
    ],
  },
]

export const businessInsurance: ModalSection[] = [
  {
    section: 'Marine & Property Insurance',
    items: [
      { id: 'marine-cargo', title: 'Marine Cargo Insurance', icon: '/images/icons/icon_car-insurance.png', url: '/health-insurance' },
      { id: 'marine-fire', title: 'Fire Insurance', icon: '/images/icons/icon_home-insurance.png', url: '/health-insurance' },
      { id: 'marine-household', title: 'Householder\'s Insurance', icon: '/images/icons/icon_home-insurance.png', url: '/health-insurance' },
    ],
  },
  {
    section: 'Employee Benefits',
    items: [
      { id: 'emp-ghi', title: 'Group Health Insurance', icon: '/images/icons/icon-group-health-insurance.png', url: '/health-insurance', badge: 'Upto 65% Discount' },
      { id: 'emp-group-term', title: 'Group Term Life Insurance', icon: '/images/icons/icon-group-health-insurance.png', url: '/health-insurance' },
      { id: 'emp-group-accident', title: 'Group Personal Accident', icon: '/images/icons/icon-group-health-insurance.png', url: '/health-insurance' },
    ],
  },
  {
    section: 'Liability',
    items: [
      { id: 'liab-do', title: 'Directors & Officers Liability', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'liab-professional', title: 'Professional Indemnity', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
      { id: 'liab-workmen', title: 'Workmen Compensation', icon: '/images/icons/icon_health-insurance.png', url: '/health-insurance' },
    ],
  },
  {
    section: 'Engineering',
    items: [
      { id: 'eng-equipment', title: 'Equipment Insurance', icon: '/images/icons/icon_car-insurance.png', url: '/health-insurance' },
      { id: 'eng-errection', title: 'Erection All Risk', icon: '/images/icons/icon_car-insurance.png', url: '/health-insurance' },
    ],
  },
]
