import React, { createContext, useContext, useReducer, type ReactNode } from 'react'

export interface Filters {
  lifeCover: string
  coverTillAge: string
  premiumFrequency: 'monthly' | 'yearly'
  payFor: 'Regular Pay' | 'Limited Pay' | 'Single Pay'
  paymentMode: 'Monthly' | 'Half Yearly' | 'Yearly' | 'Single'
  sortBy: string
  planType: string[]
  payoutOption: string[]
  insurer: string[]
  premiumPayType: string[]
  lifetimeDiscount: boolean
}

type Action =
  | { type: 'SET_FIELD'; field: keyof Filters; value: any }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'CLEAR_ALL' }
  | { type: 'RESET' }

const defaultFilters: Filters = {
  lifeCover: '1 Crore',
  coverTillAge: '60 Yrs of age',
  premiumFrequency: 'monthly',
  payFor: 'Regular Pay',
  paymentMode: 'Yearly',
  sortBy: 'Popularity',
  planType: [],
  payoutOption: [],
  insurer: [],
  premiumPayType: [],
  lifetimeDiscount: false,
}

function reducer(state: Filters, action: Action): Filters {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_FILTERS':
      return { ...state, ...action.payload }
    case 'CLEAR_ALL':
      return { ...defaultFilters, lifeCover: state.lifeCover, coverTillAge: state.coverTillAge, premiumFrequency: state.premiumFrequency }
    case 'RESET':
      return defaultFilters
    default:
      return state
  }
}

interface Ctx {
  filters: Filters
  dispatch: React.Dispatch<Action>
}

const FiltersContext = createContext<Ctx>({
  filters: defaultFilters,
  dispatch: () => {},
})

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(reducer, defaultFilters)
  return (
    <FiltersContext.Provider value={{ filters, dispatch }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  return useContext(FiltersContext)
}
