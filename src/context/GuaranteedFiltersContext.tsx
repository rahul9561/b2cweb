import React, { createContext, useContext, useReducer, type ReactNode } from 'react'

export type InvestmentFrequency = 'Monthly' | 'Yearly'
export type PlanType = 'Market linked' | '100% Guaranteed returns'
export type MarketSub = 'All Plans' | 'With Capital Guarantee' | 'Market Linked' | 'With High Life Cover'
export type GuaranteedSub = 'With Return of Premium' | 'Without Return of Premium'
export type GetMoneyAs = 'Lumpsum' | 'Income for Short Term' | 'Income for Long Term' | 'Immediate Income'

export interface GuaranteedFilters {
  amount: number
  frequency: InvestmentFrequency
  investFor: number // 0 = One Time
  planType: PlanType
  marketSub: MarketSub
  guaranteedSub: GuaranteedSub
  getMoneyAs: GetMoneyAs
}

type Action =
  | { type: 'SET_FILTERS'; payload: Partial<GuaranteedFilters> }
  | { type: 'RESET' }

export const currentYear = new Date().getFullYear()

export const investForOptions = [0, 5, 6, 7, 10, 12] as const

export const defaultGuaranteedFilters: GuaranteedFilters = {
  amount: 5000,
  frequency: 'Monthly',
  investFor: 10,
  planType: '100% Guaranteed returns',
  marketSub: 'All Plans',
  guaranteedSub: 'With Return of Premium',
  getMoneyAs: 'Income for Long Term',
}

function reducer(state: GuaranteedFilters, action: Action): GuaranteedFilters {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload }
    case 'RESET':
      return defaultGuaranteedFilters
    default:
      return state
  }
}

interface Ctx {
  filters: GuaranteedFilters
  dispatch: React.Dispatch<Action>
}

const GuaranteedFiltersContext = createContext<Ctx>({
  filters: defaultGuaranteedFilters,
  dispatch: () => {},
})

export function GuaranteedFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(reducer, defaultGuaranteedFilters)
  return (
    <GuaranteedFiltersContext.Provider value={{ filters, dispatch }}>
      {children}
    </GuaranteedFiltersContext.Provider>
  )
}

export function useGuaranteedFilters() {
  return useContext(GuaranteedFiltersContext)
}