import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AppConstants } from '../config/appConfig'
import { useAuth } from './AuthContext'
import {
  getReportDetail,
  listReports,
  type LoanAccount,
} from '../lib/creditRepairApi'

type LoansContextValue = {
  loans: LoanAccount[]
  reportId: string
  loading: boolean
  loaded: boolean
  error: string
  refreshLoans: () => Promise<void>
  getLoanById: (id: string | number) => LoanAccount | undefined
}

const LoansContext = createContext<LoansContextValue | undefined>(undefined)

const messageFrom = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong while loading your active loans.'

const mostRecentReport = <T extends { id: string; createdAt: string }>(reports: T[]): T | undefined =>
  [...reports].sort((left, right) => {
    const leftDate = Date.parse(left.createdAt)
    const rightDate = Date.parse(right.createdAt)
    if (Number.isFinite(leftDate) && Number.isFinite(rightDate) && leftDate !== rightDate) return rightDate - leftDate
    const leftId = Number(left.id)
    const rightId = Number(right.id)
    return Number.isFinite(leftId) && Number.isFinite(rightId) ? rightId - leftId : 0
  })[0]

export function LoansProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [loans, setLoans] = useState<LoanAccount[]>([])
  const [reportId, setReportId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const didAutoLoad = useRef(false)
  const authenticated = useRef(isAuthenticated)
  authenticated.current = isAuthenticated

  const applyReport = useCallback((id: string, accounts: LoanAccount[]) => {
    if (!authenticated.current) return
    setReportId(id)
    setLoans(accounts)
    if (id) localStorage.setItem(AppConstants.creditRepairReportIdKey, id)
  }, [])

  const refreshLoans = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const reports = await listReports()
      const latest = mostRecentReport(reports)
      if (!latest?.id) {
        if (authenticated.current) {
          setLoans([])
          setReportId('')
          setLoaded(true)
        }
        return
      }
      const report = await getReportDetail(latest.id)
      applyReport(report.id || latest.id, report.accounts)
      if (authenticated.current) setLoaded(true)
    } catch (requestError) {
      if (authenticated.current) {
        setError(messageFrom(requestError))
        setLoaded(true)
      }
      throw requestError
    } finally {
      if (authenticated.current) setLoading(false)
    }
  }, [applyReport])

  const getLoanById = useCallback(
    (id: string | number) => loans.find((loan) => loan.id === String(id)),
    [loans],
  )

  useEffect(() => {
    if (!isAuthenticated) {
      didAutoLoad.current = false
      setLoans([])
      setReportId('')
      setLoading(false)
      setLoaded(false)
      setError('')
      return
    }
    if (didAutoLoad.current) return
    didAutoLoad.current = true
    void refreshLoans().catch(() => {
      // The context exposes the request error; consumers decide how to display it.
    })
  }, [isAuthenticated, refreshLoans])

  return (
    <LoansContext.Provider value={{
      loans,
      reportId,
      loading,
      loaded,
      error,
      refreshLoans,
      getLoanById,
    }}>
      {children}
    </LoansContext.Provider>
  )
}

export function useLoans() {
  const context = useContext(LoansContext)
  if (!context) throw new Error('useLoans must be used within a LoansProvider')
  return context
}
