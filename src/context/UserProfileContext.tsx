import React, { createContext, useContext, useReducer, type ReactNode } from 'react'

export interface UserProfile {
  gender: 'male' | 'female'
  name: string
  dob: string // dd-mm-yyyy
  mobile: string
  email?: string
  smoker: 'yes' | 'no' | null
  annualIncome: string | null
  education: string | null
  occupation: 'salaried' | 'self-employed' | null
  city: string
  pincode: string
}

type Action =
  | { type: 'SET_FIELD'; field: keyof UserProfile; value: any }
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'RESET' }

const defaultProfile: UserProfile = {
  gender: 'male',
  name: '',
  dob: '',
  mobile: '',
  email: '',
  smoker: null,
  annualIncome: null,
  education: null,
  occupation: null,
  city: 'Lucknow',
  pincode: '',
}

function reducer(state: UserProfile, action: Action): UserProfile {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_PROFILE':
      return { ...state, ...action.payload }
    case 'RESET':
      return defaultProfile
    default:
      return state
  }
}

interface Ctx {
  profile: UserProfile
  dispatch: React.Dispatch<Action>
}

const UserProfileContext = createContext<Ctx>({
  profile: defaultProfile,
  dispatch: () => {},
})

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, dispatch] = useReducer(reducer, defaultProfile)
  return (
    <UserProfileContext.Provider value={{ profile, dispatch }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  return useContext(UserProfileContext)
}
