export const coverOptions = [
  'Recommended',
  'Below Rs5 Lakh',
  'Rs5-9 Lakh',
  'Rs10-24 Lakh',
  'Rs25-49 Lakh',
  'Rs50 Lakh+',
]

export const sortByOptions = [
  'By relevance',
  'Premium low to high',
  'Premium high to low',
  'Cashless hospitals network',
  'Claim Settlement Ratio',
  'New launches first',
]

export const roomRentOptions = [
  'No preference',
  'Single Private AC Room',
  'Twin Sharing Room',
  'Any room',
]

export const premiumRangeOptions = [
  'No preference',
  'Less than Rs1,000',
  'Rs1,000-1,500',
  'Rs1,500-2,000',
  'Rs2,000-3,000',
  'More than Rs3,000',
]

export const policyPeriodOptions = [
  'No preference',
  '1 Year',
  '2 Years',
  '3 Years',
]

export const portabilityOptions = [
  'No preference',
  'Yes',
  'No',
]

export const policyBenefitsOptions = [
  'No Room Rent Limit',
  'Pre & Post Hospitalization',
  'AYUSH Treatment',
  'Day Care Procedures',
  'Domiciliary Hospitalization',
  'Consumables Coverage',
]

export const maternityWaitingPeriodOptions = [
  'No preference',
  'No maternity cover',
  '2 Years',
  '3 Years',
  '4 Years',
]

export const existingDiseaseWaitingPeriodOptions = [
  'No preference',
  'No waiting period',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
]

/** Sub-categorized important features with descriptions (for the pill dropdown) */
export interface FeatureCategory {
  category: string
  description: string
  options: { label: string; value: string }[]
}

export const importantFeatureCategories: FeatureCategory[] = [
  {
    category: 'Room rent type',
    description: 'It is the type of room you are eligible for in case of hospitalization',
    options: [
      { label: 'No room rent limit', value: 'No room rent limit' },
      { label: 'Single Private Room', value: 'Single Private Room' },
      { label: 'Shared room', value: 'Shared room' },
    ],
  },
  {
    category: 'Existing disease waiting period',
    description: 'It is a time span before a select list of ailments get covered in your policy',
    options: [
      { label: 'No waiting period', value: 'No waiting period' },
      { label: '1 year', value: '1 year' },
      { label: '2 years', value: '2 years' },
      { label: '3 years', value: '3 years' },
    ],
  },
  {
    category: 'Free Health Checkup',
    description: 'Helps track your health & identify any underlying conditions early',
    options: [
      { label: 'Free health check-ups', value: 'Free health check-ups' },
    ],
  },
  {
    category: 'Other benefits',
    description: 'Additional benefits that enhance your health insurance coverage',
    options: [
      { label: 'Existing diseases covered from Day 1', value: 'Existing diseases covered from Day 1' },
      { label: 'Consumables coverage', value: 'Consumables coverage' },
      { label: 'Restoration benefit', value: 'Restoration benefit' },
      { label: 'No claim bonus', value: 'No claim bonus' },
      { label: 'Maternity cover', value: 'Maternity cover' },
      { label: 'OPD cover', value: 'OPD cover' },
      { label: 'Unlimited restoration', value: 'Unlimited restoration' },
    ],
  },
]

/** Flat list for backward compatibility */
export const importantFeatureOptions = importantFeatureCategories.flatMap((c) => c.options.map((o) => o.value))

export const cashlessHospitalOptions = [
  { label: 'Any', value: null },
  { label: '5,000+', value: 5000 },
  { label: '7,000+', value: 7000 },
  { label: '8,000+', value: 8000 },
  { label: '10,000+', value: 10000 },
]

export const discountTypeOptions = [
  '5% online discount',
  'CIBIL discount',
  'Good Health discount',
  'Medical practitioner discount',
  'Long tenure discount',
  'Loyalty discount',
  'Salaried customer discount',
  'Young family discount',
]

export const insurerOptions = [
  'CareShield Health',
  'TrustCare General',
  'Wellness Assure',
  'Guardian Health Plus',
  'PureLife Insurance',
  'NivaBupa Health',
  'HDFC Ergo Health',
  'Star Health Premier',
]

export const waitingPeriodOptions = [
  'No preference',
  'No waiting period',
  '1 Year',
  '2 Years',
  '3 Years',
]

export const coPayOptions = ['No preference', 'Yes', 'No']

export const filterTabs = [
  'Sort by',
  'Cover',
  'Room rent type',
  'Policy Benefits',
  'Premium (per month)',
  'Important Features',
  'Cashless Hospitals',
  'Insurer',
  'Waiting period',
  'Co-pay',
  'Portability',
  'Maternity cover waiting period',
  'Existing disease waiting period',
  'Policy Period',
] as const

export type FilterTab = (typeof filterTabs)[number]
