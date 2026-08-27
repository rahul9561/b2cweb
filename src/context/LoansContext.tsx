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
  const { isAuthenticated, token } = useAuth()
  const [loans, setLoans] = useState<LoanAccount[]>([])
  const [reportId, setReportId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [dataSessionToken, setDataSessionToken] = useState('')
  const autoLoadedToken = useRef<string | null>(null)
  const authenticated = useRef(isAuthenticated)
  const activeToken = useRef(token)
  authenticated.current = isAuthenticated
  activeToken.current = token

  const applyReport = useCallback((id: string, accounts: LoanAccount[], requestToken: string) => {
    if (!authenticated.current || activeToken.current !== requestToken) return
    setDataSessionToken(requestToken)
    setReportId(id)
    setLoans(accounts)
    if (id) localStorage.setItem(AppConstants.creditRepairReportIdKey, id)
  }, [])

  const refreshLoans = useCallback(async () => {
    const requestToken = activeToken.current
    if (!requestToken) return
    setLoading(true)
    setError('')
    try {
      const reports = await listReports()
      if (activeToken.current !== requestToken) return
      const latest = mostRecentReport(reports)
      if (!latest?.id) {
        if (authenticated.current && activeToken.current === requestToken) {
          setDataSessionToken(requestToken)
          setLoans([])
          setReportId('')
          setLoaded(true)
        }
        return
      }
      const report = await getReportDetail(latest.id)
      if (activeToken.current !== requestToken) return
      applyReport(report.id || latest.id, report.accounts, requestToken)
      if (authenticated.current && activeToken.current === requestToken) setLoaded(true)
    } catch (requestError) {
      if (authenticated.current && activeToken.current === requestToken) {
        setDataSessionToken(requestToken)
        setLoans([])
        setReportId('')
        setError(messageFrom(requestError))
        setLoaded(true)
      }
      throw requestError
    } finally {
      if (authenticated.current && activeToken.current === requestToken) setLoading(false)
    }
  }, [applyReport])

  const sessionMatches = Boolean(token) && dataSessionToken === token
  const visibleLoans = sessionMatches ? loans : []
  const visibleReportId = sessionMatches ? reportId : ''

  const getLoanById = useCallback(
    (id: string | number) => visibleLoans.find((loan) => loan.id === String(id)),
    [visibleLoans],
  )

  useEffect(() => {
    if (autoLoadedToken.current === token) return
    autoLoadedToken.current = token
    setDataSessionToken('')
    setLoans([])
    setReportId('')
    setLoading(false)
    setLoaded(false)
    setError('')
    localStorage.removeItem(AppConstants.creditRepairReportIdKey)
    if (!token) return
    void refreshLoans().catch(() => {
      // The context exposes the request error; consumers decide how to display it.
    })
  }, [token, refreshLoans])

  return (
    <LoansContext.Provider value={{
      loans: visibleLoans,
      reportId: visibleReportId,
      loading: Boolean(token) && loading,
      loaded: sessionMatches && loaded,
      error: sessionMatches ? error : '',
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
