import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'

export type EducationLoanLeadResponse = {
  success: boolean
  message: string
  data?: {
    lead_id?: string
    application_id?: string
    id?: number
    status?: string
    lead_source?: string
  }
}

export class EducationLoanApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'EducationLoanApiError'
    this.status = status
    this.data = data
  }
}

const responseMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'string' && data.trim()) return data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fallback

  const record = data as Record<string, unknown>
  for (const key of ['message', 'detail', 'error']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
  }

  const findFirstMessage = (value: unknown): string => {
    if (typeof value === 'string' && value.trim()) return value
    if (Array.isArray(value)) {
      for (const item of value) {
        const message = findFirstMessage(item)
        if (message) return message
      }
    } else if (value && typeof value === 'object') {
      for (const item of Object.values(value as Record<string, unknown>)) {
        const message = findFirstMessage(item)
        if (message) return message
      }
    }
    return ''
  }

  return findFirstMessage(record) || fallback
}

export async function submitEducationLoanLead(formData: FormData): Promise<EducationLoanLeadResponse> {
  const token = localStorage.getItem(AppConstants.tokenKey)
  if (!token) throw new EducationLoanApiError('Please sign in before submitting your education loan application.', 401)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${AppEndpoints.educationLoanLead}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
  } catch {
    throw new EducationLoanApiError('Unable to reach the server. Please check your connection.', 0)
  }

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    if (response.status === 404 && typeof data === 'string' && /page not found|<!doctype html/i.test(data)) {
      throw new EducationLoanApiError(
        'The Education Loan lead API is not available on the production server yet. Please contact support.',
        response.status,
        data
      )
    }
    throw new EducationLoanApiError(
      responseMessage(data, `Education loan submission failed (${response.status}).`),
      response.status,
      data
    )
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new EducationLoanApiError('The server returned an invalid education loan response.', response.status, data)
  }

  const result = data as EducationLoanLeadResponse
  if (result.success === false) {
    throw new EducationLoanApiError(responseMessage(data, 'Education loan submission failed.'), response.status, data)
  }
  return result
}
