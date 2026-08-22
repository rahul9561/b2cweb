import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'
import { ApiClient, ApiError } from './apiClient'

export type CustomerProfile = {
  id?: string | number
  mobile?: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string | null
  profile_image?: string | null
  role?: string
  wallet_balance?: number | string
  is_mobile_verified?: boolean
  date_joined?: string
  [key: string]: unknown
}

const splitFullName = (fullName: string) => {
  const [firstName = '', ...lastNameParts] = fullName.trim().split(/\s+/).filter(Boolean)
  return { firstName, lastName: lastNameParts.join(' ') }
}

const asProfile = (value: unknown): CustomerProfile => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError('The server returned invalid profile information.', 200, value)
  }
  const record = value as Record<string, unknown>
  const nested = record.data
  const profile = nested && typeof nested === 'object' && !Array.isArray(nested)
    ? nested as CustomerProfile
    : record as CustomerProfile
  if (profile.full_name) {
    const names = splitFullName(profile.full_name)
    return { ...profile, first_name: names.firstName, last_name: names.lastName }
  }
  return profile
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
  id?: string | number
  mobile?: string
  firstName: string
  lastName: string
  email: string
  profileImage?: File | null
}): Promise<CustomerProfile> {
  const token = localStorage.getItem(AppConstants.tokenKey)
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders.Authorization = `Bearer ${token}`

  const sendUpdate = async (body: BodyInit, contentType?: string) => {
    let response: Response
    try {
      const headers: Record<string, string> = { ...authHeaders }
      if (contentType) headers['Content-Type'] = contentType
      response = await fetch(`${API_BASE_URL}${AppEndpoints.updateCustomerProfile}`, {
        method: 'PUT',
        headers,
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

  const jsonPayload: Record<string, string | number> = {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim(),
  }
  if (input.id !== undefined) jsonPayload.id = input.id
  if (input.mobile) jsonPayload.mobile = input.mobile

  const updatedProfile = await sendUpdate(JSON.stringify(jsonPayload), 'application/json')
  if (!input.profileImage) return updatedProfile

  const imagePayload = new FormData()
  if (input.id !== undefined) imagePayload.append('id', String(input.id))
  if (input.mobile) imagePayload.append('mobile', input.mobile)
  imagePayload.append('first_name', input.firstName.trim())
  imagePayload.append('last_name', input.lastName.trim())
  imagePayload.append('email', input.email.trim())
  imagePayload.append('profile_image', input.profileImage)
  return sendUpdate(imagePayload)
}

export const getProfileImageUrl = (path?: string | null) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  return `${apiOrigin}${path.startsWith('/') ? '' : '/'}${path}`
}
