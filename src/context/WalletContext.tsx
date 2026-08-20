import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  createRazorpayOrder,
  getRechargePlans,
  getWalletBalance,
  getWalletTransactions,
  type RechargePlan,
  type WalletBalance,
  type WalletTransaction,
} from '../lib/walletApi'

type WalletContextValue = {
  wallet: WalletBalance | null
  transactions: WalletTransaction[]
  plans: RechargePlan | null
  loading: boolean
  error: string
  refreshBalance: () => Promise<WalletBalance>
  refreshTransactions: (page?: number) => Promise<void>
  refreshPlans: () => Promise<RechargePlan>
  createTopup: (amount: number) => Promise<{ order_id: string }>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

const messageFrom = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong while loading wallet data.'

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [wallet, setWallet] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [plans, setPlans] = useState<RechargePlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pendingRequests = useRef(0)
  const authenticated = useRef(isAuthenticated)
  authenticated.current = isAuthenticated

  const startLoading = useCallback(() => {
    pendingRequests.current += 1
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    pendingRequests.current = Math.max(0, pendingRequests.current - 1)
    if (pendingRequests.current === 0) setLoading(false)
  }, [])

  const refreshBalance = useCallback(async () => {
    startLoading()
    setError('')
    try {
      const balance = await getWalletBalance()
      if (authenticated.current) setWallet(balance)
      return balance
    } catch (requestError) {
      if (authenticated.current) setError(messageFrom(requestError))
      throw requestError
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const refreshTransactions = useCallback(async (page = 1) => {
    startLoading()
    setError('')
    try {
      const response = await getWalletTransactions(page)
      if (authenticated.current) setTransactions(response.results)
    } catch (requestError) {
      if (authenticated.current) setError(messageFrom(requestError))
      throw requestError
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const refreshPlans = useCallback(async () => {
    startLoading()
    setError('')
    try {
      const rechargePlans = await getRechargePlans()
      if (authenticated.current) setPlans(rechargePlans)
      return rechargePlans
    } catch (requestError) {
      if (authenticated.current) setError(messageFrom(requestError))
      throw requestError
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const createTopup = useCallback(async (amount: number) => {
    startLoading()
    setError('')
    try {
      return await createRazorpayOrder(amount)
    } catch (requestError) {
      setError(messageFrom(requestError))
      throw requestError
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  useEffect(() => {
    if (!isAuthenticated) {
      pendingRequests.current = 0
      setWallet(null)
      setTransactions([])
      setPlans(null)
      setLoading(false)
      setError('')
      return
    }

    void Promise.allSettled([refreshBalance(), refreshPlans()])
  }, [isAuthenticated, refreshBalance, refreshPlans])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        plans,
        loading,
        error,
        refreshBalance,
        refreshTransactions,
        refreshPlans,
        createTopup,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within a WalletProvider')
  return context
}
