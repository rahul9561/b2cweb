import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'

export type WalletBalance = {
  main: number
  aeps: number
  cibil: number
}

export type WalletTransaction = Record<string, unknown>

export type WalletTransactionsPage = {
  count: number | null
  next: string | null
  previous: string | null
  results: WalletTransaction[]
}

export type RechargePlan = {
  id?: string | number
  title?: string
  amount?: number | string
  prefill_price?: number | string
  cibil_price?: number | string
  crif_price?: number | string
  equifax_price?: number | string
  experian_price?: number | string
  cibil_advanced_price?: number | string
  only_score_price?: number | string
  cibil_commercial?: number | string
  is_active?: boolean
  [key: string]: unknown
}

export class WalletApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'WalletApiError'
    this.status = status
    this.data = data
  }
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const errorMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'string' && data.trim()) return data
  const record = asRecord(data)
  if (!record) return fallback

  for (const key of ['message', 'detail', 'error']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
  }

  const firstValue = Object.values(record)[0]
  if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') return firstValue[0]
  return typeof firstValue === 'string' ? firstValue : fallback
}

async function walletRequest(path: string, init: RequestInit = {}): Promise<unknown> {
  const token = localStorage.getItem(AppConstants.tokenKey)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  } catch {
    throw new WalletApiError('Unable to reach the server. Please check your connection.', 0)
  }

  const responseText = await response.text()
  let data: unknown = null
  if (responseText) {
    try {
      data = JSON.parse(responseText) as unknown
    } catch {
      data = responseText
    }
  }

  if (!response.ok) {
    throw new WalletApiError(
      errorMessage(data, `Wallet request failed (${response.status})`),
      response.status,
      data
    )
  }
  return data
}

const numberValue = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const getTotalBalance = (wallet: WalletBalance): number =>
  wallet.main + wallet.aeps + wallet.cibil

export async function getWalletBalance(): Promise<WalletBalance> {
  const response = asRecord(await walletRequest(AppEndpoints.walletBalance))
  const wallet = asRecord(response?.wallet)
  if (!wallet) throw new WalletApiError('The server returned an invalid wallet balance.', 200, response)

  return {
    main: numberValue(wallet.main),
    aeps: numberValue(wallet.aeps),
    cibil: numberValue(wallet.cibil),
  }
}

export async function getWalletTransactions(page = 1): Promise<WalletTransactionsPage> {
  const data = await walletRequest(`${AppEndpoints.walletTransactions}?page=${encodeURIComponent(page)}`)
  const response = asRecord(data)
  const nestedData = asRecord(response?.data)
  const resultsCandidate = response?.results ?? nestedData?.results ?? response?.data ?? data
  const results = Array.isArray(resultsCandidate)
    ? resultsCandidate.filter((item): item is WalletTransaction => asRecord(item) !== null)
    : []

  return {
    count: typeof response?.count === 'number' ? response.count : results.length,
    next: typeof response?.next === 'string' ? response.next : null,
    previous: typeof response?.previous === 'string' ? response.previous : null,
    results,
  }
}

export async function createRazorpayOrder(amount: number): Promise<{ order_id: string }> {
  if (!Number.isFinite(amount) || amount < 299) {
    throw new WalletApiError('The minimum wallet top-up amount is ₹299.', 0)
  }

  const response = asRecord(
    await walletRequest(AppEndpoints.razorpayCreateOrder, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  )
  const orderId = response?.order_id
  if (typeof orderId !== 'string' || !orderId) {
    throw new WalletApiError('The server did not return a Razorpay order ID.', 200, response)
  }
  return { order_id: orderId }
}

export async function getRechargePlans(): Promise<RechargePlan> {
  const data = await walletRequest(AppEndpoints.customerRechargePlans)
  const response = asRecord(data)
  const nestedData = response?.data
  const plan = asRecord(Array.isArray(data) ? data[0] : Array.isArray(nestedData) ? nestedData[0] : nestedData) ?? response
  if (!plan) throw new WalletApiError('The server returned invalid recharge plan data.', 200, data)
  return plan as RechargePlan
}
