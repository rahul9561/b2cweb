import { API_BASE_URL, AppConstants } from '../config/appConfig'

export class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function extractErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.message) return data.message
  if (data.detail) return data.detail
  if (data.error) return typeof data.error === 'string' ? data.error : fallback

  const firstKey = Object.keys(data)[0]
  if (firstKey) {
    const val = data[firstKey]
    if (Array.isArray(val) && val.length) return val[0]
    if (typeof val === 'string') return val
  }
  return fallback
}

async function request<T = any>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, auth = false } = options

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem(AppConstants.tokenKey)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please check your connection.', 0)
  }

  let data: any = null
  const text = await response.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data, `Request failed (${response.status})`), response.status, data)
  }

  return data as T
}

export const ApiClient = {
  get: <T = any>(path: string, opts: { auth?: boolean } = {}) =>
    request<T>(path, { method: 'GET', auth: opts.auth }),
  post: <T = any>(path: string, body?: unknown, opts: { auth?: boolean } = {}) =>
    request<T>(path, { method: 'POST', body, auth: opts.auth }),
}