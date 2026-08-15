import { createContext, useContext, useReducer, type ReactNode } from 'react'

/* ── State shape ── */
export interface EmployeeCoverProfile {
  name: string
  mobile: string
  insureGroup: 'employeeSpouseKids' | 'employeeOnly'
  totalEmployees: number | null
  requirementType: 'medicalForEmployees' | 'healthForMyself'
  areaOfOperation: string
  email: string
  whatsappUpdates: boolean
  /* Part 2 — transition modals */
  firstTimeBuyer: boolean
  companyName: string
  exitSurveyReasons: string[]
  city: string
}

type Action =
  | { type: 'SET_FIELD'; key: keyof EmployeeCoverProfile; value: unknown }
  | { type: 'SET_PROFILE'; payload: Partial<EmployeeCoverProfile> }
  | { type: 'RESET' }

const initialState: EmployeeCoverProfile = {
  name: '',
  mobile: '',
  insureGroup: 'employeeSpouseKids',
  totalEmployees: null,
  requirementType: 'medicalForEmployees',
  areaOfOperation: '',
  email: '',
  whatsappUpdates: true,
  firstTimeBuyer: true,
  companyName: '',
  exitSurveyReasons: [],
  city: '',
}

function reducer(state: EmployeeCoverProfile, action: Action): EmployeeCoverProfile {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value }
    case 'SET_PROFILE':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

/* ── Context ── */
interface EmployeeCoverCtx {
  state: EmployeeCoverProfile
  dispatch: React.Dispatch<Action>
}

const EmployeeCoverContext = createContext<EmployeeCoverCtx | null>(null)

export function EmployeeCoverProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <EmployeeCoverContext.Provider value={{ state, dispatch }}>
      {children}
    </EmployeeCoverContext.Provider>
  )
}

export function useEmployeeCover() {
  const ctx = useContext(EmployeeCoverContext)
  if (!ctx) throw new Error('useEmployeeCover must be used within EmployeeCoverProvider')
  return ctx
}