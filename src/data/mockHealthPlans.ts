export interface HealthPlanFeature {
  type: 'highlight' | 'standard' | 'caveat'
  text: string
}

export interface MockHealthPlan {
  id: string
  insurerName: string
  planName: string
  coverAmount: string
  coverAmountLakh: number
  monthlyPremium: number
  originalPremium: number
  cashlessHospitals: number
  discountPercent: number
  ribbonBadge?: string
  isNew?: boolean
  features: HealthPlanFeature[]
  featureTags: string[]
  claimSettled: number
  discountTypes: string[]
  waitingPeriodYears: number
  hasCopay: boolean
}

export interface HealthInsurerGroup {
  insurerName: string
  plans: MockHealthPlan[]
}

export const coverAmountOptions = [
  'Rs3 Lakh', 'Rs5 Lakh', 'Rs10 Lakh', 'Rs15 Lakh', 'Rs25 Lakh', 'Rs50 Lakh', 'Rs1 Crore', 'Rs2 Crore',
]

export const allFeatureTags = [
  'Existing diseases covered from Day 1',
  'No room rent limit',
  'Free health check-ups',
  'Consumables coverage',
  'Restoration benefit',
  'No claim bonus',
  'Maternity cover',
  'OPD cover',
  'Unlimited restoration',
]

export const allDiscountTypes = [
  '5% online discount',
  'CIBIL discount',
  'Good Health discount',
  'Medical practitioner discount',
  'Long tenure discount',
  'Loyalty discount',
  'Salaried customer discount',
  'Young family discount',
]

export const allInsurers = [
  'CareShield Health',
  'TrustCare General',
  'Wellness Assure',
  'Guardian Health Plus',
  'PureLife Insurance',
  'NivaBupa Health',
  'HDFC Ergo Health',
  'Star Health Premier',
]

/** Mock cashless hospital data for search functionality */
export interface CashlessHospital {
  name: string
  address: string
  city: string
  state: string
  pincode: string
}

export const mockHospitals: CashlessHospital[] = [
  { name: 'A.S. Medicity Hospital And Trauma Center Pvt. Ltd', address: 'B-2/1 Vikrant Khand, Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010' },
  { name: 'Aakash Healthcare Multi Speciality Hospital', address: '43/497, Kakretha Mustkil, 672, Mathura Bypass Road, NH-19, Sikandra', city: 'Agra', state: 'Uttar Pradesh', pincode: '282007' },
  { name: 'Aashirwad Hospital', address: '13A/477/A 1 Malin Basti Shadra Chungi', city: 'Agra', state: 'Uttar Pradesh', pincode: '282010' },
  { name: 'Aashirwad Hospital', address: 'NH2, Samiti Mandi, Firozabad Road', city: 'Agra', state: 'Uttar Pradesh', pincode: '282001' },
  { name: 'Apollo Hospital', address: '169, Tulsiani Chambers, Free Press Journal Marg, Nariman Point', city: 'Mumbai', state: 'Maharashtra', pincode: '400021' },
  { name: 'Apollo Multi Speciality Hospital', address: '21, Greams Road, Thousand Lights', city: 'Chennai', state: 'Tamil Nadu', pincode: '600006' },
  { name: 'Artemis Hospital', address: 'Sector 51, Gurgaon', city: 'Gurugram', state: 'Haryana', pincode: '122003' },
  { name: 'Bajaj Allianz General Insurance Hospital', address: 'Survey No. 110/1, Baner Road', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
  { name: 'Batra Hospital & Medical Research Centre', address: '1 Tughlakabad Institutional Area, Mehrauli Badarpur Road', city: 'New Delhi', state: 'Delhi', pincode: '110062' },
  { name: 'BLK-Max Super Speciality Hospital', address: 'Pusa Road, Rajender Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110005' },
  { name: 'CARE Hospital', address: 'Plot No. 1-10, Survey No. 1, SP Road, Fatehdari', city: 'Hyderabad', state: 'Telangana', pincode: '500003' },
  { name: 'Columbia Asia Hospital', address: '26/4, Brigade Gateway, Malleshwaram', city: 'Bengaluru', state: 'Karnataka', pincode: '560055' },
  { name: 'Fortis Hospital', address: 'Sector 62, Tauru, Nuh', city: 'Gurugram', state: 'Haryana', pincode: '122105' },
  { name: 'Fortis Escorts Heart Institute', address: 'Okhla Road, Sukhdev Vihar', city: 'New Delhi', state: 'Delhi', pincode: '110025' },
  { name: 'Gleneagles Global Hospital', address: '459, 11th Block, HRBR Layout, Kalyan Nagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560043' },
  { name: 'HCG Cancer Hospital', address: 'No. 8, HCG Towers, Off Bannerghatta Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560076' },
  { name: 'Hinduja Hospital', address: 'Veer Savarkar Marg, Mahim', city: 'Mumbai', state: 'Maharashtra', pincode: '400016' },
  { name: 'Manipal Hospital', address: 'Old Airport Road, HAL Airport Area', city: 'Bengaluru', state: 'Karnataka', pincode: '560017' },
  { name: 'Max Super Speciality Hospital', address: 'Press Enclave Road, Saket', city: 'New Delhi', state: 'Delhi', pincode: '110017' },
  { name: 'Medanta - The Medicity', address: 'CH Baktawar Singh Road, Sector 38', city: 'Gurugram', state: 'Haryana', pincode: '122001' },
  { name: 'Narayana Health City', address: '258/A Bommasandra Industrial Area, Anekal Taluk', city: 'Bengaluru', state: 'Karnataka', pincode: '562106' },
  { name: 'Narayana Hrudayalaya', address: '184/1, Ambadipudi, NH 44', city: 'Hyderabad', state: 'Telangana', pincode: '500058' },
  { name: 'Narayana Institute of Cardiac Sciences', address: '258/A Bommasandra Industrial Area', city: 'Bengaluru', state: 'Karnataka', pincode: '562106' },
  { name: 'Noble Hospital', address: '153, Magarpatta City Road, Hadapsar', city: 'Pune', state: 'Maharashtra', pincode: '411013' },
  { name: 'PGIMER', address: 'Sector 12, Chandigarh', city: 'Chandigarh', state: 'Chandigarh', pincode: '160012' },
  { name: 'Ruby Hall Clinic', address: '40, Sassoon Road, Sangamvadi', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { name: 'Sai Baba Hospital', address: 'Shirdi, Rahata', city: 'Ahmednagar', state: 'Maharashtra', pincode: '412805' },
  { name: 'Sankara Nethralaya', address: '18, College Road, Nungambakkam', city: 'Chennai', state: 'Tamil Nadu', pincode: '600006' },
  { name: 'Sri Ramachandra Medical Centre', address: '1, Ramachandra Nagar, Porur', city: 'Chennai', state: 'Tamil Nadu', pincode: '600116' },
  { name: 'Tata Memorial Hospital', address: 'E Borges Road, Parel', city: 'Mumbai', state: 'Maharashtra', pincode: '400012' },
]

/** Group mock hospitals by city for filtering */
export function getHospitalsByCity(city: string): CashlessHospital[] {
  return mockHospitals.filter(
    (h) => h.city.toLowerCase() === city.toLowerCase(),
  )
}

/** Search hospitals by name */
export function searchHospitals(query: string): CashlessHospital[] {
  const q = query.toLowerCase()
  return mockHospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q),
  )
}

/** Simulated premium multipliers per cover tier (base = Rs10 Lakh) */
export const coverPremiumMultiplier: Record<string, number> = {
  'Rs3 Lakh': 0.4,
  'Rs5 Lakh': 0.55,
  'Rs10 Lakh': 1.0,
  'Rs15 Lakh': 1.4,
  'Rs25 Lakh': 2.1,
  'Rs50 Lakh': 3.5,
  'Rs1 Crore': 6.0,
  'Rs2 Crore': 10.0,
}

export const mockHealthPlans: MockHealthPlan[] = [
  // ── CareShield Health ──
  {
    id: 'h1',
    insurerName: 'CareShield Health',
    planName: 'Care Shield Companion',
    coverAmount: 'Rs10 Lakh',
    coverAmountLakh: 10,
    monthlyPremium: 748,
    originalPremium: 883,
    cashlessHospitals: 9200,
    discountPercent: 15,
    ribbonBadge: 'Faster Issuance',
    features: [
      { type: 'highlight', text: '2x coverage from Day 1, with 100% SI increase per year upto Unlimited' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Restoration of cover unlimited times in a year' },
    ],
    featureTags: [
      'Existing diseases covered from Day 1',
      'No room rent limit',
      'Restoration benefit',
      'Unlimited restoration',
    ],
    claimSettled: 99.2,
    discountTypes: ['5% online discount', 'CIBIL discount', 'Salaried customer discount'],
    waitingPeriodYears: 0,
    hasCopay: false,
  },
  {
    id: 'h2',
    insurerName: 'CareShield Health',
    planName: 'Care Shield Elite',
    coverAmount: 'Rs15 Lakh',
    coverAmountLakh: 15,
    monthlyPremium: 1120,
    originalPremium: 1340,
    cashlessHospitals: 9200,
    discountPercent: 16,
    features: [
      { type: 'highlight', text: 'Rs10 lakhs per year, increasing every year regardless of claims, with no maximum limit' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Free health check-ups every year' },
      { type: 'caveat', text: '20% Co-pay applies on treatment outside the Preferred Provider Network' },
    ],
    featureTags: [
      'No room rent limit',
      'Free health check-ups',
      'Restoration benefit',
    ],
    claimSettled: 99.2,
    discountTypes: ['5% online discount', 'Good Health discount', 'Long tenure discount'],
    waitingPeriodYears: 2,
    hasCopay: true,
  },
  // ── TrustCare General ──
  {
    id: 'h3',
    insurerName: 'TrustCare General',
    planName: 'TrustCare Protect',
    coverAmount: 'Rs10 Lakh',
    coverAmountLakh: 10,
    monthlyPremium: 680,
    originalPremium: 790,
    cashlessHospitals: 7800,
    discountPercent: 14,
    ribbonBadge: 'Guaranteed',
    features: [
      { type: 'highlight', text: 'Day 1 coverage for all pre-existing diseases with no waiting period' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Consumables coverage included' },
    ],
    featureTags: [
      'Existing diseases covered from Day 1',
      'No room rent limit',
      'Consumables coverage',
    ],
    claimSettled: 98.8,
    discountTypes: ['5% online discount', 'Loyalty discount', 'Young family discount'],
    waitingPeriodYears: 0,
    hasCopay: false,
  },
  {
    id: 'h4',
    insurerName: 'TrustCare General',
    planName: 'TrustCare Premium',
    coverAmount: 'Rs25 Lakh',
    coverAmountLakh: 25,
    monthlyPremium: 1850,
    originalPremium: 2200,
    cashlessHospitals: 7800,
    discountPercent: 16,
    isNew: true,
    features: [
      { type: 'highlight', text: 'Unlimited restore benefit with no sub-limit on sum insured' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Annual health check-up with wellness benefits' },
      { type: 'standard', text: 'No claim bonus of 50% per claim-free year' },
    ],
    featureTags: [
      'No room rent limit',
      'Free health check-ups',
      'Restoration benefit',
      'No claim bonus',
      'Unlimited restoration',
    ],
    claimSettled: 98.8,
    discountTypes: ['5% online discount', 'CIBIL discount', 'Salaried customer discount', 'Long tenure discount'],
    waitingPeriodYears: 1,
    hasCopay: false,
  },
  // ── Wellness Assure ──
  {
    id: 'h5',
    insurerName: 'Wellness Assure',
    planName: 'Wellness Complete Care',
    coverAmount: 'Rs10 Lakh',
    coverAmountLakh: 10,
    monthlyPremium: 620,
    originalPremium: 720,
    cashlessHospitals: 6500,
    discountPercent: 14,
    features: [
      { type: 'highlight', text: 'No co-pay, no room rent capping, no disease-wise sub-limits' },
      { type: 'standard', text: 'Pre & post hospitalization covered for 60 days each' },
      { type: 'standard', text: 'AYUSH treatment covered' },
    ],
    featureTags: [
      'No room rent limit',
      'Consumables coverage',
    ],
    claimSettled: 97.5,
    discountTypes: ['5% online discount', 'Good Health discount', 'Medical practitioner discount'],
    waitingPeriodYears: 2,
    hasCopay: false,
  },
  {
    id: 'h6',
    insurerName: 'Wellness Assure',
    planName: 'Wellness Super Top-up',
    coverAmount: 'Rs15 Lakh',
    coverAmountLakh: 15,
    monthlyPremium: 890,
    originalPremium: 1050,
    cashlessHospitals: 6500,
    discountPercent: 15,
    ribbonBadge: 'Salaried Discount of 7.5%',
    isNew: true,
    features: [
      { type: 'highlight', text: 'Automatic recharge of 100% sum insured on exhaustion' },
      { type: 'standard', text: 'Domiciliary hospitalization covered' },
      { type: 'caveat', text: '30-day waiting period for specific diseases' },
    ],
    featureTags: [
      'Restoration benefit',
      'Free health check-ups',
      'OPD cover',
    ],
    claimSettled: 97.5,
    discountTypes: ['5% online discount', 'Salaried customer discount', 'Loyalty discount'],
    waitingPeriodYears: 1,
    hasCopay: false,
  },
  // ── Guardian Health Plus ──
  {
    id: 'h7',
    insurerName: 'Guardian Health Plus',
    planName: 'Guardian Gold',
    coverAmount: 'Rs10 Lakh',
    coverAmountLakh: 10,
    monthlyPremium: 710,
    originalPremium: 830,
    cashlessHospitals: 8400,
    discountPercent: 14,
    features: [
      { type: 'highlight', text: 'Unlimited sum insured restoration from 1st claim' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Free annual health check-up' },
    ],
    featureTags: [
      'No room rent limit',
      'Free health check-ups',
      'Restoration benefit',
      'Unlimited restoration',
    ],
    claimSettled: 99.0,
    discountTypes: ['5% online discount', 'CIBIL discount', 'Young family discount'],
    waitingPeriodYears: 2,
    hasCopay: false,
  },
  // ── PureLife Insurance ──
  {
    id: 'h8',
    insurerName: 'PureLife Insurance',
    planName: 'PureLife Health Secure',
    coverAmount: 'Rs5 Lakh',
    coverAmountLakh: 5,
    monthlyPremium: 380,
    originalPremium: 440,
    cashlessHospitals: 5200,
    discountPercent: 14,
    ribbonBadge: 'New Launch',
    isNew: true,
    features: [
      { type: 'highlight', text: 'Entry age up to 65 years with lifelong renewability' },
      { type: 'standard', text: 'Pre-existing diseases covered after 2 years' },
      { type: 'standard', text: 'Day care procedures covered' },
    ],
    featureTags: [
      'Maternity cover',
      'OPD cover',
    ],
    claimSettled: 96.8,
    discountTypes: ['5% online discount', 'Long tenure discount'],
    waitingPeriodYears: 2,
    hasCopay: false,
  },
  // ── NivaBupa Health ──
  {
    id: 'h9',
    insurerName: 'NivaBupa Health',
    planName: 'NivaBupa ReAssure 2.0',
    coverAmount: 'Rs25 Lakh',
    coverAmountLakh: 25,
    monthlyPremium: 1650,
    originalPremium: 1950,
    cashlessHospitals: 10000,
    discountPercent: 15,
    features: [
      { type: 'highlight', text: 'Restore benefit unlimited times per year' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Maternity cover up to Rs50,000' },
      { type: 'standard', text: 'Free annual health check-up with preventive care' },
    ],
    featureTags: [
      'No room rent limit',
      'Free health check-ups',
      'Restoration benefit',
      'Maternity cover',
      'Unlimited restoration',
    ],
    claimSettled: 98.5,
    discountTypes: ['5% online discount', 'Good Health discount', 'Medical practitioner discount', 'Loyalty discount'],
    waitingPeriodYears: 1,
    hasCopay: false,
  },
  // ── HDFC Ergo Health ──
  {
    id: 'h10',
    insurerName: 'HDFC Ergo Health',
    planName: 'HDFC Health Suraksha',
    coverAmount: 'Rs50 Lakh',
    coverAmountLakh: 50,
    monthlyPremium: 2200,
    originalPremium: 2600,
    cashlessHospitals: 11000,
    discountPercent: 15,
    isNew: true,
    ribbonBadge: 'Bestseller',
    features: [
      { type: 'highlight', text: 'Unlimited restoration of sum insured from day 1' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Consumables coverage included' },
      { type: 'standard', text: 'OPD cover up to Rs10,000 per year' },
      { type: 'standard', text: 'No claim bonus of 50% cumulative' },
    ],
    featureTags: [
      'No room rent limit',
      'Consumables coverage',
      'Restoration benefit',
      'OPD cover',
      'No claim bonus',
      'Unlimited restoration',
    ],
    claimSettled: 99.1,
    discountTypes: ['5% online discount', 'CIBIL discount', 'Salaried customer discount', 'Long tenure discount', 'Young family discount'],
    waitingPeriodYears: 0,
    hasCopay: false,
  },
  // ── Star Health Premier ──
  {
    id: 'h11',
    insurerName: 'Star Health Premier',
    planName: 'Star Young Promise',
    coverAmount: 'Rs5 Lakh',
    coverAmountLakh: 5,
    monthlyPremium: 420,
    originalPremium: 490,
    cashlessHospitals: 9800,
    discountPercent: 14,
    features: [
      { type: 'highlight', text: 'Designed for members under 35 years of age' },
      { type: 'standard', text: 'Pre-existing diseases covered after 1 year' },
      { type: 'standard', text: 'Free health check-ups' },
    ],
    featureTags: [
      'Free health check-ups',
      'No claim bonus',
    ],
    claimSettled: 97.8,
    discountTypes: ['5% online discount', 'Young family discount', 'Good Health discount'],
    waitingPeriodYears: 1,
    hasCopay: false,
  },
  {
    id: 'h12',
    insurerName: 'Star Health Premier',
    planName: 'Star Platinum',
    coverAmount: 'Rs1 Crore',
    coverAmountLakh: 100,
    monthlyPremium: 3200,
    originalPremium: 3800,
    cashlessHospitals: 9800,
    discountPercent: 16,
    isNew: true,
    features: [
      { type: 'highlight', text: 'Rs1 Crore cover with unlimited restoration' },
      { type: 'standard', text: 'No Room Rent Limit' },
      { type: 'standard', text: 'Maternity cover up to Rs75,000' },
      { type: 'standard', text: 'Consumables & OPD coverage included' },
      { type: 'standard', text: 'Global emergency coverage' },
    ],
    featureTags: [
      'No room rent limit',
      'Consumables coverage',
      'Restoration benefit',
      'Maternity cover',
      'OPD cover',
      'Unlimited restoration',
      'Free health check-ups',
    ],
    claimSettled: 98.2,
    discountTypes: ['5% online discount', 'CIBIL discount', 'Good Health discount', 'Long tenure discount'],
    waitingPeriodYears: 0,
    hasCopay: false,
  },
]

/** Group plans by insurer for "View more plans from {Insurer}" expansion */
export function groupByInsurer(plans: MockHealthPlan[]): HealthInsurerGroup[] {
  const map = new Map<string, MockHealthPlan[]>()
  for (const p of plans) {
    const arr = map.get(p.insurerName) || []
    arr.push(p)
    map.set(p.insurerName, arr)
  }
  return Array.from(map.entries()).map(([insurerName, plans]) => ({ insurerName, plans }))
}

/** Filter + sort mock plans based on HealthFilters state */
export function filterHealthPlans(
  plans: MockHealthPlan[],
  filters: {
    cover: string
    sortBy: string
    premiumRange: string
    importantFeatures: string[]
    isNewLaunches: boolean
    cashlessHospitalsMin: number | null
    selectedDiscounts: string[]
    selectedInsurers: string[]
    waitingPeriod: string
    coPay: string
  },
): MockHealthPlan[] {
  let result = [...plans]

  // Cover filter
  if (filters.cover && filters.cover !== 'All' && filters.cover !== 'Recommended') {
    const coverMap: Record<string, [number, number]> = {
      'Below Rs5 Lakh': [0, 5],
      'Rs5-9 Lakh': [5, 10],
      'Rs10-24 Lakh': [10, 25],
      'Rs25-49 Lakh': [25, 50],
      'Rs50 Lakh+': [50, Infinity],
      'Rs3 Lakh': [0, 4],
      'Rs5 Lakh': [4, 6],
      'Rs10 Lakh': [9, 11],
      'Rs15 Lakh': [14, 16],
      'Rs25 Lakh': [24, 26],
      'Rs50 Lakh': [49, 51],
      'Rs1 Crore': [99, 101],
      'Rs2 Crore': [199, 201],
    }
    const range = coverMap[filters.cover]
    if (range) {
      result = result.filter((p) => p.coverAmountLakh >= range[0] && p.coverAmountLakh <= range[1])
    }
  }

  // Premium range filter
  if (filters.premiumRange && filters.premiumRange !== 'No preference') {
    const premiumMap: Record<string, [number, number]> = {
      'Less than Rs1,000': [0, 1000],
      'Rs1,000-1,500': [1000, 1500],
      'Rs1,500-2,000': [1500, 2000],
      'Rs2,000-3,000': [2000, 3000],
      'More than Rs3,000': [3000, Infinity],
    }
    const range = premiumMap[filters.premiumRange]
    if (range) {
      result = result.filter((p) => p.monthlyPremium >= range[0] && p.monthlyPremium < range[1])
    }
  }

  // Important features filter (AND logic — plan must have ALL selected features)
  if (filters.importantFeatures.length > 0) {
    result = result.filter((p) =>
      filters.importantFeatures.every((f) => p.featureTags.includes(f)),
    )
  }

  // New launches filter
  if (filters.isNewLaunches) {
    result = result.filter((p) => p.isNew)
  }

  // Cashless hospitals minimum filter
  if (filters.cashlessHospitalsMin !== null) {
    result = result.filter((p) => p.cashlessHospitals >= filters.cashlessHospitalsMin!)
  }

  // Discount types filter (plan must have at least one selected discount)
  if (filters.selectedDiscounts.length > 0) {
    result = result.filter((p) =>
      filters.selectedDiscounts.some((d) => p.discountTypes.includes(d)),
    )
  }

  // Insurer filter
  if (filters.selectedInsurers.length > 0) {
    result = result.filter((p) => filters.selectedInsurers.includes(p.insurerName))
  }

  // Waiting period filter
  if (filters.waitingPeriod && filters.waitingPeriod !== 'No preference') {
    const wpMap: Record<string, number> = {
      'No waiting period': 0,
      '1 Year': 1,
      '2 Years': 2,
      '3 Years': 3,
    }
    const maxWp = wpMap[filters.waitingPeriod]
    if (maxWp !== undefined) {
      result = result.filter((p) => p.waitingPeriodYears <= maxWp)
    }
  }

  // Co-pay filter
  if (filters.coPay === 'No') {
    result = result.filter((p) => !p.hasCopay)
  } else if (filters.coPay === 'Yes') {
    result = result.filter((p) => p.hasCopay)
  }

  // Sort
  switch (filters.sortBy) {
    case 'Premium low to high':
      result.sort((a, b) => a.monthlyPremium - b.monthlyPremium)
      break
    case 'Premium high to low':
      result.sort((a, b) => b.monthlyPremium - a.monthlyPremium)
      break
    case 'Cashless hospitals network':
      result.sort((a, b) => b.cashlessHospitals - a.cashlessHospitals)
      break
    case 'Claim Settlement Ratio':
      result.sort((a, b) => b.claimSettled - a.claimSettled)
      break
    case 'New launches first':
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    default:
      // By relevance — keep original order
      break
  }

  return result
}
