import nationalInsuranceLogo from '../assets/images/new_india.png'
import zurichKotakLogo from '../assets/images/zurich_kotak.png'
import iciciLogo from '../assets/images/icici.png'
import hdfcErgoLogo from '../assets/images/hdfc_ergo.png'

export interface HomeAddon {
  id: string
  insurer: string
  name: string
  premium: number
  cover?: number
  isFree?: boolean
}

export interface AddOnConfig {
  id: string
  label: string
  category: 'addon' | 'coverage'
  enabledForTerms?: number[]
  note?: string
}

export interface HomePlanSelection {
  insurerName: string
  insurerShortCode: string
  insurerLogo: string
  planName: string
  buildingSumInsured: number
  householdSumInsured: number
  policyTermYears: number
  basePremium: number
  addons: HomeAddon[]
  isCustomersChoice?: boolean
  constructionYearRange?: string
}

export interface HomeLeadState {
  fullName: string
  mobile: string
  buildingValue: number
  householdItems: number
  city: string
  flatOrIndependent?: 'flat' | 'independent'
}

export interface HomeOwnerDetails {
  salutation: string
  fullName: string
  dob: string
  mobile: string
  email: string
  pan: string
}

export interface HomePropertyAddress {
  addressLine1: string
  addressLine2: string
  city: string
  pincode: string
  carpetArea: string
  buildingType: string
  yearOfConstruction: string
  sameAsCommunication: boolean
  hasLoan: boolean
  lenderName: string
}

// Add-on configuration
export const ADDONS_CONFIG: AddOnConfig[] = [
  { id: 'burglary', label: 'Burglary', category: 'addon' },
  { id: 'terrorism', label: 'Terrorism', category: 'addon' },
  { id: 'rent-alternate', label: 'Rent for Alternate Accommodation', category: 'addon' },
  { id: 'loss-rent', label: 'Loss of Rent', category: 'addon' },
  { id: 'personal-accident-self', label: 'Personal Accident Self', category: 'addon' },
  { id: 'personal-accident-spouse', label: 'Personal Accident Spouse', category: 'addon' },
  { id: 'utility-expense', label: 'Utility Expense Cover', category: 'addon', enabledForTerms: [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], note: 'Available in 1-5yr and 11-20yr Policy Term' },
  { id: 'jewellery', label: 'Jewellery and Valuables', category: 'coverage' },
  { id: 'additional-structures', label: 'Additional Structures (Water tanks, boundary walls, etc.)', category: 'coverage' },
  { id: 'solar-panel', label: 'Solar Panel', category: 'coverage', enabledForTerms: [1, 2, 3, 4, 5], note: 'Available in 1-5yr Policy Term' },
]

// Construction year ranges
export const CONSTRUCTION_YEAR_RANGES = [
  { value: '2021-26', label: '2021-26' },
  { value: '2016-20', label: '2016-20' },
  { value: '2011-15', label: '2011-15' },
  { value: '2006-10', label: '2006-10' },
  { value: '2001-05', label: '2001-05' },
  { value: '1996-00', label: '1996-00' },
  { value: '1991-95', label: '1991-95' },
  { value: '<1991', label: '< 1991' },
]

// Policy terms
export const POLICY_TERMS = [1, 2, 3, 4, 5, 10, 11, 15, 20]

export const defaultHomePlan: HomePlanSelection = {
  insurerName: 'National Insurance Company Ltd',
  insurerShortCode: 'NIC',
  insurerLogo: nationalInsuranceLogo,
  planName: 'Bharat Griha Raksha',
  buildingSumInsured: 75000000,
  householdSumInsured: 10000000,
  policyTermYears: 10,
  basePremium: 205482,
  addons: [
    { id: 'burglary', insurer: 'IndusInd General', name: 'Burglary (1 Year)', premium: 500, cover: 500000 },
  ],
  isCustomersChoice: true,
  constructionYearRange: '2021-26',
}

export const homePlans: HomePlanSelection[] = [
  defaultHomePlan,
  {
    insurerName: 'ICICI Lombard General Insurance',
    insurerShortCode: 'ICICIGI',
    insurerLogo: iciciLogo,
    planName: 'HomeGuard Plus',
    buildingSumInsured: 75000000,
    householdSumInsured: 10000000,
    policyTermYears: 10,
    basePremium: 210000,
    addons: [
      { id: 'earthquake', insurer: 'ICICI Lombard', name: 'Earthquake (1 Year)', premium: 1200, cover: 500000 },
    ],
    constructionYearRange: '2016-20',
  },
  {
    insurerName: 'HDFC ERGO General Insurance',
    insurerShortCode: 'HDFCE',
    insurerLogo: hdfcErgoLogo,
    planName: 'Dream Home Secure',
    buildingSumInsured: 75000000,
    householdSumInsured: 10000000,
    policyTermYears: 10,
    basePremium: 195000,
    addons: [
      { id: 'burglary', insurer: 'HDFC ERGO', name: 'Burglary (1 Year)', premium: 450, cover: 500000 },
    ],
    constructionYearRange: '2011-15',
  },
  // Plans for 20-year term
  {
    insurerName: 'National Insurance Company Ltd',
    insurerShortCode: 'NIC',
    insurerLogo: nationalInsuranceLogo,
    planName: 'Bharat Griha Raksha 20Y',
    buildingSumInsured: 75000000,
    householdSumInsured: 10000000,
    policyTermYears: 20,
    basePremium: 320000,
    addons: [],
    constructionYearRange: '2021-26',
  },
  {
    insurerName: 'ICICI Lombard General Insurance',
    insurerShortCode: 'ICICIGI',
    insurerLogo: iciciLogo,
    planName: 'HomeGuard Plus 20Y',
    buildingSumInsured: 75000000,
    householdSumInsured: 10000000,
    policyTermYears: 20,
    basePremium: 330000,
    addons: [],
    constructionYearRange: '2016-20',
  },
  // Plans for 5-year term
  {
    insurerName: 'National Insurance Company Ltd',
    insurerShortCode: 'NIC',
    insurerLogo: nationalInsuranceLogo,
    planName: 'Bharat Griha Raksha 5Y',
    buildingSumInsured: 75000000,
    householdSumInsured: 10000000,
    policyTermYears: 5,
    basePremium: 120000,
    addons: [],
    constructionYearRange: '2021-26',
  },
]

export const cyberSecureAddon = {
  id: 'cyber-secure',
  insurer: 'Zurich Kotak General Insurance',
  insurerLogo: zurichKotakLogo,
  productTitle: 'Cyber Secure',
  cover: 200000,
  premium: 543,
  personCovered: 'Primary Owner',
}

export const otherAddons = [
  {
    id: 'burglary-addon',
    insurer: 'IndusInd General Insurance Company Ltd',
    productTitle: 'Burglary',
    cover: 500000,
    premium: 500,
    personCovered: 'Primary Owner',
    badge: '★ Must have',
  },
]

export const defaultHomeOwner: HomeOwnerDetails = {
  salutation: 'Mr',
  fullName: 'The Developer',
  dob: '',
  mobile: 'XXXXXX9007',
  email: 't************9@gmail.com',
  pan: '',
}

export const defaultPropertyAddress: HomePropertyAddress = {
  addressLine1: '',
  addressLine2: '',
  city: 'Lucknow',
  pincode: '226102',
  carpetArea: '',
  buildingType: '',
  yearOfConstruction: '',
  sameAsCommunication: true,
  hasLoan: false,
  lenderName: '',
}

// Utility functions
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function generateReferenceNumber(): string {
  return String(Math.floor(1000000000 + Math.random() * 9000000000))
}

// Number to words conversion for Indian numbering
export function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  if (num === 0) return 'Zero'

  function convertBelowThousand(n: number): string {
    if (n === 0) return ''
    else if (n < 10) return ones[n]
    else if (n < 20) return teens[n - 10]
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    else return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertBelowThousand(n % 100) : '')
  }

  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const remainder = num % 1000

  let result = ''
  if (crore > 0) result += convertBelowThousand(crore) + ' Crore '
  if (lakh > 0) result += convertBelowThousand(lakh) + ' Lakh '
  if (thousand > 0) result += convertBelowThousand(thousand) + ' Thousand '
  if (remainder > 0) result += convertBelowThousand(remainder)

  return result.trim() + ' only'
}
