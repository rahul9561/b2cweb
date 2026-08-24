import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'
import { ApiClient, ApiError } from './apiClient'

// Credit Repair response bodies are not documented in the supplied collection.
// Keep normalization tolerant until the backend confirms its real field names, then
// trim the pick() key lists here without changing any consuming component.
type RawRecord = Record<string, unknown>
type JsonResult = RawRecord | unknown[] | string | number | boolean | null

export const DisputeType = {
  OWNERSHIP: 'OWNERSHIP',
  BALANCE: 'BALANCE',
  OVERDUE: 'OVERDUE',
  STATUS: 'STATUS',
  DATES: 'DATES',
  DPD: 'DPD',
  DUPLICATE: 'DUPLICATE',
  PERSONAL_INFO: 'PERSONAL_INFO',
  OTHER: 'OTHER',
} as const

export type DisputeTypeValue = typeof DisputeType[keyof typeof DisputeType]

export type LoanAccount = {
  id: string
  accountType: string
  typeLabel: string
  lenderName: string
  maskedNumber: string
  status: string
  currentBalance: number | null
  sanctionedAmount: number | null
  overdueAmount: number | null
  openDate: string
  reportId: string
  raw: RawRecord
}

export type CreditIssue = {
  id: string
  accountId: string
  reportId: string
  issueType: string
  typeLabel: string
  title: string
  description: string
  status: string
  severity: string
  createdAt: string
  raw: RawRecord
}

export type Dispute = {
  id: string
  issueId: string
  accountId: string
  disputeType: string
  description: string
  status: string
  generatedAt: string
  sentAt: string
  raw: RawRecord
}

export type CreditReport = {
  id: string
  createdAt: string
  accounts: LoanAccount[]
  raw: RawRecord
}

export type FetchCrifReportInput = {
  mobile: string
  first_name: string
  last_name: string
  name_lookup?: number
}

export type CreateDisputeInput = {
  dispute_type: DisputeTypeValue
  description: string
}

const base = AppEndpoints.creditRepairBase
const path = (suffix: string) => `${base}${suffix}`

const isRecord = (value: unknown): value is RawRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const normalizedKey = (key: string) => key.replace(/[^a-z0-9]/gi, '').toLowerCase()

function pick(object: unknown, keys: string[]): unknown {
  if (!isRecord(object)) return undefined
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) return object[key]
  }
  const wanted = new Set(keys.map(normalizedKey))
  for (const [key, value] of Object.entries(object)) {
    if (wanted.has(normalizedKey(key)) && value !== undefined && value !== null) return value
  }
  return undefined
}

function asObject(payload: unknown): RawRecord {
  if (!isRecord(payload)) return {}
  for (const key of ['data', 'result', 'response', 'payload']) {
    if (isRecord(payload[key])) return asObject(payload[key])
  }
  return payload
}

const nestedObject = (payload: unknown, keys: string[]): RawRecord => {
  const object = asObject(payload)
  const nested = pick(object, keys)
  return isRecord(nested) ? asObject(nested) : object
}

function asList(payload: unknown, listKeys: string[]): RawRecord[] {
  if (Array.isArray(payload)) return payload.filter(isRecord)
  if (!isRecord(payload)) return []

  const candidate = pick(payload, [...listKeys, 'results', 'items', 'records'])
  if (Array.isArray(candidate)) return candidate.filter(isRecord)
  if (isRecord(candidate)) {
    const nested = asList(candidate, listKeys)
    if (nested.length) return nested
  }

  for (const key of ['data', 'result', 'response', 'payload']) {
    const nested: unknown = payload[key]
    if (nested !== undefined && nested !== payload) {
      const list = asList(nested, listKeys)
      if (list.length) return list
    }
  }
  return []
}

const textValue = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

const numberValue = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[^0-9.-]/g, '')
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

const recordId = (record: RawRecord, keys: string[] = []) =>
  textValue(pick(record, [...keys, 'id', 'pk', 'uuid']))

const accountTypeLabel = (accountType: string): string => {
  const normalized = accountType.trim().toUpperCase().replace(/[\s-]+/g, '_')
  const labels: Record<string, string> = {
    CREDIT_CARD: 'Credit Card',
    PERSONAL_LOAN: 'Personal Loan',
    HOME_LOAN: 'Home Loan',
    HOUSING_LOAN: 'Home Loan',
    AUTO_LOAN: 'Auto Loan',
    VEHICLE_LOAN: 'Vehicle Loan',
    EDUCATION_LOAN: 'Education Loan',
    BUSINESS_LOAN: 'Business Loan',
    GOLD_LOAN: 'Gold Loan',
    CONSUMER_LOAN: 'Consumer Loan',
    LOAN_AGAINST_PROPERTY: 'Loan Against Property',
  }
  if (labels[normalized]) return labels[normalized]
  return normalized
    ? normalized.toLowerCase().split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    : 'Loan Account'
}

export function normalizeAccount(value: unknown, fallbackReportId = ''): LoanAccount {
  const raw = nestedObject(value, ['account', 'loan_account', 'loanAccount', 'tradeline'])
  const accountType = textValue(pick(raw, ['account_type', 'accountType', 'loan_type', 'loanType', 'type']))
  const accountNumber = textValue(pick(raw, [
   'account_number_masked'
  ]))
  return {
    id: recordId(raw, ['account_id', 'accountId']),
    accountType,
    typeLabel: accountTypeLabel(accountType),
    lenderName: textValue(pick(raw, ['lender_name', 'lenderName', 'bank_name', 'bankName', 'institution_name', 'member_name', 'creditor_name'])),
    maskedNumber: accountNumber,
    status: textValue(pick(raw, ['account_status', 'accountStatus', 'loan_status', 'loanStatus', 'status'])),
    currentBalance: numberValue(pick(raw, ['current_balance', 'currentBalance', 'balance', 'outstanding_balance', 'amount_outstanding'])),
    sanctionedAmount: numberValue(pick(raw, ['sanctioned_amount', 'sanctionedAmount', 'loan_amount', 'loanAmount', 'credit_limit', 'high_credit'])),
    overdueAmount: numberValue(pick(raw, ['overdue_amount', 'overdueAmount', 'amount_overdue', 'past_due_amount'])),
    openDate: textValue(pick(raw, ['created_at'])),
    reportId: textValue(pick(raw, ['report_id', 'reportId', 'credit_report_id'])) || fallbackReportId,
    raw,
  }
}

export function normalizeIssue(value: unknown): CreditIssue {
  const raw = nestedObject(value, ['issue', 'credit_issue', 'creditIssue'])
  const issueType = textValue(pick(raw, ['issue_type', 'issueType', 'error_type', 'category', 'type']))
  const account = pick(raw, ['account', 'loan_account', 'loanAccount'])
  const nestedAccountId = isRecord(account) ? recordId(account, ['account_id', 'accountId']) : textValue(account)
  return {
    id: recordId(raw, ['issue_id', 'issueId']),
    accountId: textValue(pick(raw, ['account_id', 'accountId', 'loan_account_id'])) || nestedAccountId,
    reportId: textValue(pick(raw, ['report_id', 'reportId', 'credit_report_id'])),
    issueType,
    typeLabel: accountTypeLabel(issueType),
    title: textValue(pick(raw, ['title', 'issue_title', 'name', 'label'])) || accountTypeLabel(issueType),
    description: textValue(pick(raw, ['description', 'details', 'message', 'notes'])),
    status: textValue(pick(raw, ['issue_status', 'issueStatus', 'status'])),
    severity: textValue(pick(raw, ['severity', 'priority', 'risk_level', 'riskLevel'])),
    createdAt: textValue(pick(raw, ['created_at', 'createdAt', 'date_created', 'reported_at'])),
    raw,
  }
}

export function normalizeDispute(value: unknown): Dispute {
  const raw = nestedObject(value, ['dispute', 'credit_dispute', 'creditDispute'])
  return {
    id: recordId(raw, ['dispute_id', 'disputeId']),
    issueId: textValue(pick(raw, ['issue_id', 'issueId', 'credit_issue_id'])),
    accountId: textValue(pick(raw, ['account_id', 'accountId', 'loan_account_id'])),
    disputeType: textValue(pick(raw, ['dispute_type', 'disputeType', 'type'])),
    description: textValue(pick(raw, ['description', 'details', 'message', 'notes'])),
    status: textValue(pick(raw, ['dispute_status', 'disputeStatus', 'status'])),
    generatedAt: textValue(pick(raw, ['generated_at', 'generatedAt', 'date_generated'])),
    sentAt: textValue(pick(raw, ['sent_at', 'sentAt', 'emailed_at', 'submitted_at'])),
    raw,
  }
}

const normalizeReport = (value: unknown): CreditReport => {
  const raw = nestedObject(value, ['report', 'credit_report', 'creditReport'])
  const id = recordId(raw, ['report_id', 'reportId', 'credit_report_id'])
  const accounts = asList(raw, ['accounts', 'loan_accounts', 'loanAccounts', 'tradelines', 'credit_accounts'])
    .map((account) => normalizeAccount(account, id))
  return {
    id,
    createdAt: textValue(pick(raw, ['created_at', 'createdAt', 'generated_at', 'generatedAt', 'report_date', 'reportDate'])),
    accounts,
    raw,
  }
}

export async function fetchCrifReport(input: FetchCrifReportInput): Promise<CreditReport> {
  const response = await ApiClient.post<JsonResult>(path('/report/fetch/'), {
    mobile: input.mobile,
    first_name: input.first_name,
    last_name: input.last_name,
    name_lookup: input.name_lookup ?? 0,
  }, { auth: true })
  return normalizeReport(response)
}

export async function getReportDetail(reportId: string | number): Promise<CreditReport> {
  return normalizeReport(await ApiClient.get<JsonResult>(path(`/reports/${reportId}/`), { auth: true }))
}

export async function reviewAccount(accountId: string | number, input: { decision: string; notes: string }): Promise<LoanAccount> {
  return normalizeAccount(await ApiClient.post<JsonResult>(path(`/accounts/${accountId}/review/`), input, { auth: true }))
}

export async function createDispute(issueId: string | number, input: CreateDisputeInput): Promise<Dispute> {
  return normalizeDispute(await ApiClient.post<JsonResult>(path(`/issues/${issueId}/dispute/`), input, { auth: true }))
}

export async function getDisputeDetail(disputeId: string | number): Promise<Dispute> {
  return normalizeDispute(await ApiClient.get<JsonResult>(path(`/disputes/${disputeId}/`), { auth: true }))
}

export async function generateDispute(disputeId: string | number): Promise<Dispute> {
  return normalizeDispute(await ApiClient.post<JsonResult>(path(`/disputes/${disputeId}/generate/`), undefined, { auth: true }))
}

export async function previewDispute(disputeId: string | number): Promise<JsonResult> {
  return ApiClient.get<JsonResult>(path(`/disputes/${disputeId}/preview/`), { auth: true })
}

export async function sendDisputeEmail(disputeId: string | number): Promise<Dispute> {
  return normalizeDispute(await ApiClient.post<JsonResult>(path(`/disputes/${disputeId}/send/`), {
    target: 'LENDER',
    confirm: true,
  }, { auth: true }))
}

export async function listReports(): Promise<CreditReport[]> {
  const response = await ApiClient.get<JsonResult>(path('/reports/'), { auth: true })
  return asList(response, ['reports', 'credit_reports', 'creditReports']).map(normalizeReport)
}

export async function refreshReport(reportId: string | number): Promise<CreditReport> {
  return normalizeReport(await ApiClient.post<JsonResult>(path(`/reports/${reportId}/refresh/`), undefined, { auth: true }))
}

export async function compareReport(reportId: string | number): Promise<JsonResult> {
  return ApiClient.post<JsonResult>(path(`/reports/${reportId}/compare/`), {}, { auth: true })
}

export async function getAccountDetail(accountId: string | number): Promise<LoanAccount> {
  return normalizeAccount(await ApiClient.get<JsonResult>(path(`/accounts/${accountId}/`), { auth: true }))
}

export async function listIssues(): Promise<CreditIssue[]> {
  const response = await ApiClient.get<JsonResult>(path('/issues/'), { auth: true })
  return asList(response, ['issues', 'credit_issues', 'creditIssues']).map(normalizeIssue)
}

export async function listDisputes(): Promise<Dispute[]> {
  const response = await ApiClient.get<JsonResult>(path('/disputes/'), { auth: true })
  return asList(response, ['disputes', 'credit_disputes', 'creditDisputes']).map(normalizeDispute)
}

const errorMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'string') return /<\/?html\b/i.test(data) ? fallback : data
  if (!isRecord(data)) return fallback
  const message = pick(data, ['message', 'detail', 'error'])
  return typeof message === 'string' ? message : fallback
}

export async function uploadDisputeDocument(
  disputeId: string | number,
  input: { document_type: string; document: File },
): Promise<JsonResult> {
  const token = localStorage.getItem(AppConstants.tokenKey)
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const body = new FormData()
  body.append('document_type', input.document_type)
  body.append('document', input.document)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path(`/disputes/${disputeId}/documents/`)}`, {
      method: 'POST',
      headers,
      body,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please check your connection.', 0)
  }

  const responseText = await response.text()
  let data: JsonResult = null
  if (responseText) {
    try { data = JSON.parse(responseText) as JsonResult } catch { data = responseText }
  }
  if (!response.ok) {
    throw new ApiError(errorMessage(data, 'We could not upload the dispute document.'), response.status, data)
  }
  return data
}

export async function agentAnalyze(reportId: string | number): Promise<JsonResult> {
  return ApiClient.post<JsonResult>(path('/agent/analyze/'), { report_id: reportId }, { auth: true })
}

export async function getImprovementPlan(): Promise<JsonResult> {
  return ApiClient.get<JsonResult>(path('/improvement-plan/'), { auth: true })
}

export async function submitIssueAndNotifyLender(issueId: string | number, input: CreateDisputeInput): Promise<Dispute> {
  const created = await createDispute(issueId, input)
  if (!created.id) throw new ApiError('The server did not return a dispute id.', 200, created.raw)
  await generateDispute(created.id)
  return sendDisputeEmail(created.id)
}

export async function fetchLoansForNewUser(
  input: Omit<FetchCrifReportInput, 'name_lookup'>,
): Promise<{ reportId: string; accounts: LoanAccount[] }> {
  const freshReport = await fetchCrifReport({ ...input, name_lookup: 0 })
  if (!freshReport.id) throw new ApiError('The server did not return a report id.', 200, freshReport.raw)
  const report = await getReportDetail(freshReport.id)
  return { reportId: report.id || freshReport.id, accounts: report.accounts }
}
