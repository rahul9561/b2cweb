import { createContext, useContext, useReducer, type ReactNode } from 'react'

/* ── Health Quotes filters ── */
export interface HealthFilters {
  cover: string
  sortBy: string
  roomRentType: string
  policyBenefits: string[]
  premiumRange: string
  portability: string
  maternityWaitingPeriod: string
  existingDiseaseWaitingPeriod: string
  policyPeriod: string
  importantFeatures: string[]
  isNewLaunches: boolean
  cashlessHospitalsMin: number | null
  selectedDiscounts: string[]
  selectedInsurers: string[]
  waitingPeriod: string
  coPay: string
}

type Action =
  | { type: 'SET_FIELD'; key: keyof HealthFilters; value: unknown }
  | { type: 'SET_FILTERS'; payload: Partial<HealthFilters> }
  | { type: 'TOGGLE_ARRAY_ITEM'; key: 'importantFeatures' | 'selectedDiscounts' | 'selectedInsurers' | 'policyBenefits'; value: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'RESET' }

const initialState: HealthFilters = {
  cover: 'Recommended',
  sortBy: 'By relevance',
  roomRentType: '',
  policyBenefits: [],
  premiumRange: 'No preference',
  portability: '',
  maternityWaitingPeriod: '',
  existingDiseaseWaitingPeriod: '',
  policyPeriod: '',
  importantFeatures: [],
  isNewLaunches: false,
  cashlessHospitalsMin: null,
  selectedDiscounts: [],
  selectedInsurers: [],
  waitingPeriod: 'No preference',
  coPay: 'No preference',
}

function reducer(state: HealthFilters, action: Action): HealthFilters {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value }
    case 'SET_FILTERS':
      return { ...state, ...action.payload }
    case 'TOGGLE_ARRAY_ITEM': {
      const arr = state[action.key] as string[]
      const next = arr.includes(action.value)
        ? arr.filter((v) => v !== action.value)
        : [...arr, action.value]
      return { ...state, [action.key]: next }
    }
    case 'CLEAR_ALL':
      return { ...initialState, cover: state.cover }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

/** Count how many filters are actively applied (for badge display) */
export function countActiveFilters(state: HealthFilters): number {
  let count = 0
  if (state.cover !== 'Recommended') count++
  if (state.sortBy !== 'By relevance') count++
  if (state.roomRentType) count++
  if (state.policyBenefits.length > 0) count++
  if (state.premiumRange !== 'No preference') count++
  if (state.portability) count++
  if (state.maternityWaitingPeriod) count++
  if (state.existingDiseaseWaitingPeriod) count++
  if (state.policyPeriod) count++
  if (state.importantFeatures.length > 0) count++
  if (state.isNewLaunches) count++
  if (state.cashlessHospitalsMin !== null) count++
  if (state.selectedDiscounts.length > 0) count++
  if (state.selectedInsurers.length > 0) count++
  if (state.waitingPeriod !== 'No preference') count++
  if (state.coPay !== 'No preference') count++
  return count
}

/** Build an array of human-readable active filter labels for the chips row */
export function getActiveFilterLabels(state: HealthFilters): { key: string; label: string; field: keyof HealthFilters }[] {
  const labels: { key: string; label: string; field: keyof HealthFilters }[] = []
  if (state.cover !== 'Recommended') labels.push({ key: `cover-${state.cover}`, label: `Cover: ${state.cover}`, field: 'cover' })
  if (state.sortBy !== 'By relevance') labels.push({ key: `sort-${state.sortBy}`, label: `Sort: ${state.sortBy}`, field: 'sortBy' })
  if (state.importantFeatures.length > 0) {
    for (const f of state.importantFeatures) {
      labels.push({ key: `feat-${f}`, label: f, field: 'importantFeatures' })
    }
  }
  if (state.isNewLaunches) labels.push({ key: 'new-launches', label: 'New launches only', field: 'isNewLaunches' })
  if (state.cashlessHospitalsMin !== null) labels.push({ key: `cashless-${state.cashlessHospitalsMin}`, label: `${state.cashlessHospitalsMin.toLocaleString()}+ hospitals`, field: 'cashlessHospitalsMin' })
  if (state.selectedDiscounts.length > 0) {
    for (const d of state.selectedDiscounts) {
      labels.push({ key: `disc-${d}`, label: d, field: 'selectedDiscounts' })
    }
  }
  if (state.selectedInsurers.length > 0) {
    for (const i of state.selectedInsurers) {
      labels.push({ key: `ins-${i}`, label: i, field: 'selectedInsurers' })
    }
  }
  if (state.waitingPeriod !== 'No preference') labels.push({ key: `wp-${state.waitingPeriod}`, label: `Waiting: ${state.waitingPeriod}`, field: 'waitingPeriod' })
  if (state.coPay !== 'No preference') labels.push({ key: `copay-${state.coPay}`, label: `Co-pay: ${state.coPay}`, field: 'coPay' })
  if (state.premiumRange !== 'No preference') labels.push({ key: `premium-${state.premiumRange}`, label: state.premiumRange, field: 'premiumRange' })
  if (state.roomRentType) labels.push({ key: `room-${state.roomRentType}`, label: state.roomRentType, field: 'roomRentType' })
  if (state.policyBenefits.length > 0) {
    for (const b of state.policyBenefits) {
      labels.push({ key: `ben-${b}`, label: b, field: 'policyBenefits' })
    }
  }
  if (state.portability) labels.push({ key: `port-${state.portability}`, label: `Portability: ${state.portability}`, field: 'portability' })
  if (state.maternityWaitingPeriod) labels.push({ key: `mat-${state.maternityWaitingPeriod}`, label: `Maternity: ${state.maternityWaitingPeriod}`, field: 'maternityWaitingPeriod' })
  if (state.existingDiseaseWaitingPeriod) labels.push({ key: `edwp-${state.existingDiseaseWaitingPeriod}`, label: `Existing disease: ${state.existingDiseaseWaitingPeriod}`, field: 'existingDiseaseWaitingPeriod' })
  if (state.policyPeriod) labels.push({ key: `pp-${state.policyPeriod}`, label: `Policy: ${state.policyPeriod}`, field: 'policyPeriod' })
  return labels
}

/* ── Context ── */
interface HealthFiltersCtx {
  state: HealthFilters
  dispatch: React.Dispatch<Action>
}

const HealthFiltersContext = createContext<HealthFiltersCtx | null>(null)

export function HealthFiltersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <HealthFiltersContext.Provider value={{ state, dispatch }}>
      {children}
    </HealthFiltersContext.Provider>
  )
}

export function useHealthFilters() {
  const ctx = useContext(HealthFiltersContext)
  if (!ctx) throw new Error('useHealthFilters must be used within HealthFiltersProvider')
  return ctx
}
