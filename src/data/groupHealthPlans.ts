import sbiLogo from '../assets/images/sbigeneral.png'
import newIndiaLogo from '../assets/images/new_india.png'
import nivaLogo from '../assets/images/niva.png'

export interface GroupHealthPlan {
  id: string
  insurerName: string
  logo: string
  sumInsured: string
  sumInsuredLakh: number
  cashlessHospitals: number | null
  claimSettlementRatio: number
  maternityBenefits: string
  roomRentLimit: string
  coverPreExisting: string
  ribbons: string[]
  premiumOnRequest: boolean
}

export const SUM_INSURED_OPTIONS = [
  { label: '₹1 Lac', value: '1 Lac', lakh: 1, popular: false },
  { label: '₹2 Lacs', value: '2 Lacs', lakh: 2, popular: false },
  { label: '₹3 Lacs', value: '3 Lacs', lakh: 3, popular: false },
  { label: '₹4 Lacs', value: '4 Lacs', lakh: 4, popular: false },
  { label: '₹5 Lacs', value: '5 Lacs', lakh: 5, popular: true },
]

export const MATERNITY_OPTIONS = [
  'No Maternity Benefits',
  '₹25,000 for Normal & ₹35,000 for C-Section',
  '₹35,000 for Normal & ₹50,000 for C-Section',
  '₹50,000 for both Normal & C-Section',
]

export const ROOM_RENT_OPTIONS = [
  '1% of Sum Insured',
  '2% of Sum Insured',
  'Single Private AC Room',
  'No Limit',
]

export const PRE_EXISTING_OPTIONS = ['Do not cover', 'Cover from Day 1']

export const SORT_OPTIONS = [
  'Price - Low to High',
  'Price - High to Low',
  'Network Hospitals - High to Low',
  'Claim Settlement Ratio - High to Low',
]

export const groupHealthPlans: GroupHealthPlan[] = [
  {
    id: 'gh1',
    insurerName: 'SBI General',
    logo: sbiLogo,
    sumInsured: '5 Lacs',
    sumInsuredLakh: 5,
    cashlessHospitals: null,
    claimSettlementRatio: 96.5,
    maternityBenefits: 'No Maternity Benefits',
    roomRentLimit: '1% of Sum Insured',
    coverPreExisting: 'Do not cover',
    ribbons: [],
    premiumOnRequest: true,
  },
  {
    id: 'gh2',
    insurerName: 'New India Assurance',
    logo: newIndiaLogo,
    sumInsured: '5 Lacs',
    sumInsuredLakh: 5,
    cashlessHospitals: null,
    claimSettlementRatio: 97.2,
    maternityBenefits: '₹25,000 for Normal & ₹35,000 for C-Section',
    roomRentLimit: '1% of Sum Insured',
    coverPreExisting: 'Do not cover',
    ribbons: [],
    premiumOnRequest: true,
  },
  {
    id: 'gh3',
    insurerName: 'Niva Bupa',
    logo: nivaLogo,
    sumInsured: '5 Lacs',
    sumInsuredLakh: 5,
    cashlessHospitals: 10000,
    claimSettlementRatio: 98.5,
    maternityBenefits: '₹35,000 for Normal & ₹50,000 for C-Section',
    roomRentLimit: '2% of Sum Insured',
    coverPreExisting: 'Cover from Day 1',
    ribbons: [],
    premiumOnRequest: true,
  },
]

export interface GroupHealthFilters {
  sortBy: string
  sumInsured: string
  maternityBenefits: string
  roomRentLimit: string
  coverPreExisting: string
}

export const defaultGroupHealthFilters: GroupHealthFilters = {
  sortBy: 'Price - Low to High',
  sumInsured: '5 Lacs',
  maternityBenefits: 'No Maternity Benefits',
  roomRentLimit: '1% of Sum Insured',
  coverPreExisting: 'Do not cover',
}

export function filterAndSortPlans(
  plans: GroupHealthPlan[],
  filters: GroupHealthFilters,
): GroupHealthPlan[] {
  let result = [...plans]

  // Sum Insured filter
  const siOption = SUM_INSURED_OPTIONS.find((o) => o.value === filters.sumInsured)
  if (siOption) {
    result = result.filter((p) => p.sumInsuredLakh === siOption.lakh)
  }

  // Maternity Benefits filter
  if (filters.maternityBenefits !== 'No Maternity Benefits') {
    result = result.filter((p) => p.maternityBenefits !== 'No Maternity Benefits')
  }

  // Room Rent Limit filter
  if (filters.roomRentLimit !== '1% of Sum Insured') {
    result = result.filter((p) => p.roomRentLimit !== '1% of Sum Insured')
  }

  // Cover Pre-Existing Diseases filter
  if (filters.coverPreExisting === 'Cover from Day 1') {
    result = result.filter((p) => p.coverPreExisting === 'Cover from Day 1')
  }

  // Sort
  switch (filters.sortBy) {
    case 'Price - Low to High':
      result.sort((a, b) => a.sumInsuredLakh - b.sumInsuredLakh)
      break
    case 'Price - High to Low':
      result.sort((a, b) => b.sumInsuredLakh - a.sumInsuredLakh)
      break
    case 'Network Hospitals - High to Low':
      result.sort((a, b) => (b.cashlessHospitals ?? 0) - (a.cashlessHospitals ?? 0))
      break
    case 'Claim Settlement Ratio - High to Low':
      result.sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio)
      break
    default:
      break
  }

  return result
}