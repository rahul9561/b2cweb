import { AppConstants } from '../config/appConfig'

export interface CibilAnalysisSession {
  timestamp: string
  blockedUntil: string
}

const SESSION_KEY = AppConstants.cibilAnalysisSessionKey

const identityFields = [
  'mobile',
  'phone',
  'mobile_number',
  'phone_number',
  'id',
  'user_id',
  'username',
  'email',
] as const

function identityFromRecord(record: Record<string, unknown>): string | null {
  for (const field of identityFields) {
    const value = record[field]
    if ((typeof value === 'string' || typeof value === 'number') && String(value).trim()) {
      return `${field}:${String(value).trim().toLowerCase()}`
    }
  }
  return null
}

function readTokenIdentity(): string | null {
  try {
    const token = localStorage.getItem(AppConstants.tokenKey)
    const payloadPart = token?.split('.')[1]
    if (!payloadPart) return null
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>
    return identityFromRecord(payload)
  } catch {
    return null
  }
}

function getCurrentUserSessionKey(): string | null {
  try {
    const rawUser = localStorage.getItem(AppConstants.userDataKey)
    const user = rawUser ? JSON.parse(rawUser) as Record<string, unknown> : null
    const identity = user ? identityFromRecord(user) : null
    const currentIdentity = identity ?? readTokenIdentity()
    return currentIdentity ? `${SESSION_KEY}:${encodeURIComponent(currentIdentity)}` : null
  } catch {
    return null
  }
}

/**
 * Adds `count` working days (skipping Sundays) to the given date.
 * Used to compute the cooling-off window for repeat CIBIL analysis reports.
 */
function addWorkingDays(start: Date, count: number): Date {
  const result = new Date(start)
  let remaining = count
  while (remaining > 0) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0) remaining -= 1
  }
  return result
}

/**
 * Returns the blocked-until Date if the current user is inside the
 * 30-working-day cool-down window, otherwise returns null.
 */
export function getCibilAnalysisBlockedUntil(): Date | null {
  try {
    const userSessionKey = getCurrentUserSessionKey()
    if (!userSessionKey) return null
    const raw = localStorage.getItem(userSessionKey) ?? sessionStorage.getItem(userSessionKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CibilAnalysisSession
    const blockedUntil = new Date(parsed.blockedUntil)
    if (Number.isNaN(blockedUntil.getTime())) return null
    return blockedUntil > new Date() ? blockedUntil : null
  } catch {
    return null
  }
}

/**
 * Stores the CIBIL analysis session for the currently authenticated user so
 * each account has its own 30-working-day cooling-off window.
 */
export function saveCibilAnalysisSession(): CibilAnalysisSession {
  const session: CibilAnalysisSession = {
    timestamp: new Date().toISOString(),
    blockedUntil: addWorkingDays(new Date(), 30).toISOString(),
  }
  const userSessionKey = getCurrentUserSessionKey()
  if (userSessionKey) localStorage.setItem(userSessionKey, JSON.stringify(session))
  return session
}

export function clearCibilAnalysisSession(): void {
  const userSessionKey = getCurrentUserSessionKey()
  if (!userSessionKey) return
  localStorage.removeItem(userSessionKey)
  sessionStorage.removeItem(userSessionKey)
}

/** Formats a Date for display, e.g. "18 Aug 2026". */
export function formatBlockedDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Number of full working-days remaining until `until`. */
export function getRemainingDays(until: Date): number {
  return Math.max(0, Math.ceil((until.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}
