import { AppConstants } from '../config/appConfig'

export interface CibilAnalysisSession {
  timestamp: string
  blockedUntil: string
}

const SESSION_KEY = AppConstants.cibilAnalysisSessionKey

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
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY)
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
 * Stores the CIBIL analysis session in sessionStorage so the user can
 * generate the next report only after 30 working days.
 */
export function saveCibilAnalysisSession(): CibilAnalysisSession {
  const session: CibilAnalysisSession = {
    timestamp: new Date().toISOString(),
    blockedUntil: addWorkingDays(new Date(), 30).toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearCibilAnalysisSession(): void {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
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
