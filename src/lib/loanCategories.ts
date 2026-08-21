import { ApiClient } from './apiClient'
import { AppEndpoints, AppConstants } from '../config/appConfig'
import { getPincodeFromLocation, DEFAULT_PINCODE } from './location'

export interface LoanCategory {
  _id: string
  name: string
  shortCode: string
}

interface LoanCategoriesResponse {
  success?: boolean
  data?:
    | {
        success?: boolean
        data?: LoanCategory[]
      }
    | LoanCategory[]
}

/**
 * Resolve the pincode to use for loan APIs.
 *
 * Order of preference:
 *  1. A pincode the user entered during a previous flow (stored in localStorage).
 *  2. Pincode derived from the user's geolocation permission.
 *  3. Static fallback pincode "843123".
 */
export async function resolvePincode(): Promise<string> {
  const stored = localStorage.getItem(AppConstants.pincodeKey)
  if (stored && /^\d{6}$/.test(stored)) return stored

  const fromLocation = await getPincodeFromLocation()
  if (fromLocation && /^\d{6}$/.test(fromLocation)) {
    localStorage.setItem(AppConstants.pincodeKey, fromLocation)
    return fromLocation
  }

  localStorage.setItem(AppConstants.pincodeKey, DEFAULT_PINCODE)
  return DEFAULT_PINCODE
}

/**
 * Store the resolved pincode (used after the user grants/denies location,
 * and by the loan-banks flow).
 */
export function savePincode(pincode: string): void {
  if (pincode && /^\d{6}$/.test(pincode)) {
    localStorage.setItem(AppConstants.pincodeKey, pincode)
  }
}

/**
 * Return the currently saved pincode, or the static fallback if none is stored.
 */
export function getSavedPincode(): string {
  return localStorage.getItem(AppConstants.pincodeKey) || DEFAULT_PINCODE
}

/**
 * Fetch loan categories from `/loans/categories/?pincode=...` using the
 * Bearer token, then persist the whole response in localStorage.
 *
 * Safe to call right after OTP verification — the resolvePincode() helper
 * asks for location permission and falls back to "843123" on any failure.
 */
export async function fetchLoanCategories(): Promise<LoanCategory[]> {
  const pincode = await resolvePincode()
  const response = await ApiClient.get<LoanCategoriesResponse>(
    `${AppEndpoints.loanCategories}?pincode=${pincode}`,
    { auth: true }
  )

  // Persist the full raw response as requested.
  localStorage.setItem(AppConstants.loanCategoriesKey, JSON.stringify(response))

  const categories = Array.isArray(response?.data)
    ? (response.data as LoanCategory[])
    : (response?.data as { data?: LoanCategory[] } | undefined)?.data ?? []

  return categories
}

/**
 * Read the previously-saved categories (raw API response) from localStorage.
 */
export function getSavedLoanCategories(): LoanCategoriesResponse | null {
  try {
    const raw = localStorage.getItem(AppConstants.loanCategoriesKey)
    return raw ? (JSON.parse(raw) as LoanCategoriesResponse) : null
  } catch {
    return null
  }
}

/**
 * Extract a flat list of categories from the saved raw response.
 */
export function getSavedLoanCategoryList(): LoanCategory[] {
  const saved = getSavedLoanCategories()
  if (!saved) return []
  if (Array.isArray(saved?.data)) return saved.data as LoanCategory[]
  return (saved?.data as { data?: LoanCategory[] } | undefined)?.data ?? []
}