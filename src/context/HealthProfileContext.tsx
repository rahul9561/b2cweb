import { createContext, useContext, useReducer, type ReactNode } from 'react'

/* ── State shape ── */
export interface HealthProfile {
  gender: 'male' | 'female'
  members: string[]
  memberAges: Record<string, number>
  age: number | null
  city: string
  name: string
  mobile: string
  policyChoice: 'new' | 'port' | null
  existingIllness: string[]
  whatsappUpdates: boolean
  homeVisit: 'yes' | 'no' | 'later' | null
  homeVisitSlot: { date: string; time: string } | null
}

type Action =
  | { type: 'SET_FIELD'; key: keyof HealthProfile; value: unknown }
  | { type: 'SET_PROFILE'; payload: Partial<HealthProfile> }
  | { type: 'RESET' }

const initialState: HealthProfile = {
  gender: 'male',
  members: ['self'],
  memberAges: {},
  age: null,
  city: '',
  name: '',
  mobile: '',
  policyChoice: null,
  existingIllness: [],
  whatsappUpdates: true,
  homeVisit: null,
  homeVisitSlot: null,
}

function reducer(state: HealthProfile, action: Action): HealthProfile {
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
interface HealthProfileCtx {
  state: HealthProfile
  dispatch: React.Dispatch<Action>
}

const HealthProfileContext = createContext<HealthProfileCtx | null>(null)

export function HealthProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <HealthProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </HealthProfileContext.Provider>
  )
}

export function useHealthProfile() {
  const ctx = useContext(HealthProfileContext)
  if (!ctx) throw new Error('useHealthProfile must be used within HealthProfileProvider')
  return ctx
}
