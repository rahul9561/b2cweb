import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'
import { ApiClient, ApiError } from './apiClient'

export type CustomerProfile = {
  id?: string | number
  mobile?: string
  full_name?: string
  email?: string | null
  profile_image?: string | null
  role?: string
  wallet_balance?: number | string
  is_mobile_verified?: boolean
  date_joined?: string
  [key: string]: unknown
}

const asProfile = (value: unknown): CustomerProfile => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError('The server returned invalid profile information.', 200, value)
  }
  const record = value as Record<string, unknown>
  const nested = record.data
  return nested && typeof nested === 'object' && !Array.isArray(nested)
    ? nested as CustomerProfile
    : record as CustomerProfile
}

export const fetchCustomerProfile = async () =>
  asProfile(await ApiClient.get(AppEndpoints.customerProfile, { auth: true }))

const extractMessage = (data: unknown, fallback: string) => {
  if (typeof data === 'string') return /<\/?html\b/i.test(data) ? fallback : data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fallback
  const record = data as Record<string, unknown>
  for (const key of ['message', 'detail', 'error']) {
    if (typeof record[key] === 'string') return String(record[key])
  }
  const first = Object.values(record)[0]
  if (Array.isArray(first) && typeof first[0] === 'string') return first[0]
  return typeof first === 'string' ? first : fallback
}

export async function updateCustomerProfile(input: {
  fullName: string
  email: string
  profileImage?: File | null
}): Promise<CustomerProfile> {
  const token = localStorage.getItem(AppConstants.tokenKey)
  const body = new FormData()
  body.append('full_name', input.fullName.trim())
  body.append('email', input.email.trim())
  if (input.profileImage) body.append('profile_image', input.profileImage)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${AppEndpoints.updateCustomerProfile}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please check your connection.', 0)
  }

  const responseText = await response.text()
  let data: unknown = null
  if (responseText) {
    try { data = JSON.parse(responseText) as unknown } catch { data = responseText }
  }
  if (!response.ok) {
    throw new ApiError(extractMessage(data, 'We could not update your profile. Please try again.'), response.status, data)
  }
  return asProfile(data)
}

export const getProfileImageUrl = (path?: string | null) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  return `${apiOrigin}${path.startsWith('/') ? '' : '/'}${path}`
}
