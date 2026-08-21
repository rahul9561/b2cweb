import React, { createContext, useContext, useReducer, type ReactNode } from 'react'

export type InvestmentFrequency = 'Monthly' | 'Yearly'
export type RetirementPlanType = 'Pension Plan' | 'Market Linked Annuity' | 'Annuity Plans' | 'Market linked'
export type GetPensionAs = 'Monthly' | 'Quarterly' | 'Yearly' | 'Lumpsum'
export type PointToPointYears = 10 | 8 | 7 | 6 | 5
export type IrdaiMandate = 4 | 8
export type RollingReturnYears = 3 | 5 | 7 | 10

export interface RetirementFilters {
  amount: number
  frequency: InvestmentFrequency
  investFor: number // years
  retireAt: number // age
  planType: RetirementPlanType
  pointToPoint: PointToPointYears
  irdaiMandate: IrdaiMandate
  rollingReturns: RollingReturnYears
  getPensionAs: GetPensionAs
}

type Action =
  | { type: 'SET_FILTERS'; payload: Partial<RetirementFilters> }
  | { type: 'RESET' }

export const currentYear = new Date().getFullYear()

export const defaultRetirementFilters: RetirementFilters = {
  amount: 5000,
  frequency: 'Monthly',
  investFor: 10,
  retireAt: 55,
  planType: 'Market linked',
  pointToPoint: 7,
  irdaiMandate: 8,
  rollingReturns: 5,
  getPensionAs: 'Monthly',
}

function reducer(state: RetirementFilters, action: Action): RetirementFilters {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload }
    case 'RESET':
      return defaultRetirementFilters
    default:
      return state
  }
}

interface Ctx {
  filters: RetirementFilters
  dispatch: React.Dispatch<Action>
}

const RetirementFiltersContext = createContext<Ctx>({
  filters: defaultRetirementFilters,
  dispatch: () => {},
})

export function RetirementFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(reducer, defaultRetirementFilters)
  return (
    <RetirementFiltersContext.Provider value={{ filters, dispatch }}>
      {children}
    </RetirementFiltersContext.Provider>
  )
}

export function useRetirementFilters() {
  return useContext(RetirementFiltersContext)
}