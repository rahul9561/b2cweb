import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints, AppConstants } from '../config/appConfig'

export interface AuthUser {
  id?: string | number
  name?: string
  username?: string
  mobile?: string
  email?: string
  roles?: string[]
  [key: string]: any
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  sendOtp: (mobile: string) => Promise<void>
  verifyOtp: (mobile: string, otp: string) => Promise<AuthUser>
  resendOtp: (mobile: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AppConstants.userDataKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AppConstants.tokenKey))
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem(AppConstants.tokenKey))
      setUser(readStoredUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persistSession = (accessToken: string, userData: AuthUser) => {
    localStorage.setItem(AppConstants.tokenKey, accessToken)
    localStorage.setItem(AppConstants.userDataKey, JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
  }

  const sendOtp = async (mobile: string) => {
    setLoading(true)
    try {
      await ApiClient.post(AppEndpoints.customerSendOtp, { mobile })
    } catch (err) {
      throw normalizeError(err, 'Could not send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (mobile: string, otp: string): Promise<AuthUser> => {
    setLoading(true)
    try {
      const data = await ApiClient.post<any>(AppEndpoints.customerVerifyOtp, { mobile, otp })

      const accessToken: string | undefined = data?.token ?? data?.access
      if (!accessToken) {
        throw new ApiError('Verification successful but no token received.', 200, data)
      }

      const userData: AuthUser = data?.user && typeof data.user === 'object' ? data.user : data
      persistSession(accessToken, userData)
      return userData
    } catch (err) {
      throw normalizeError(err, 'Invalid or expired OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async (mobile: string) => {
    setLoading(true)
    try {
      // NOTE: confirm with backend whether this endpoint expects
      // { mobile } (matches send-otp) or a different field name.
      await ApiClient.post(AppEndpoints.resendOtp, { mobile })
    } catch (err) {
      throw normalizeError(err, 'Could not resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(AppConstants.tokenKey)
    localStorage.removeItem(AppConstants.userDataKey)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, sendOtp, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function normalizeError(err: unknown, fallback: string): Error {
  if (err instanceof ApiError) return new Error(err.message || fallback)
  if (err instanceof Error) return err
  return new Error(fallback)
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}