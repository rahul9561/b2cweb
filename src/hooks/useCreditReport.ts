import { useState } from 'react'
import { API_BASE_URL, AppConstants, AppEndpoints } from '../config/appConfig'
import { ApiClient, ApiError } from '../lib/apiClient'

export type ReportType = 'cibil' | 'experian' | 'equifax' | 'crif'

interface GenerateReportParams {
  name: string
  mobile: string
  pan: string
  gender: string
  reportType: ReportType
  consent: boolean
  dob?: string
  address?: string
  stateCode?: string
  pincode?: string
}

export type GeneratedCreditReport = {
  reportId?: string
  documentBytes: Uint8Array | null
  mimeType: string
  creditReportLink: string
  rawResponse: unknown
}

type JsonRecord = Record<string, unknown>

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : null

const normalizedKey = (key: string) => key.replace(/[^a-z0-9]/gi, '').toLowerCase()

const findDeepValue = (value: unknown, aliases: string[], depth = 0): unknown => {
  if (depth > 6 || value === null || value === undefined) return undefined
  const wanted = new Set(aliases.map(normalizedKey))
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDeepValue(item, aliases, depth + 1)
      if (found !== undefined && found !== null && found !== '') return found
    }
    return undefined
  }
  const record = asRecord(value)
  if (!record) return undefined
  for (const [key, entry] of Object.entries(record)) {
    if (wanted.has(normalizedKey(key)) && entry !== undefined && entry !== null && entry !== '') return entry
  }
  for (const entry of Object.values(record)) {
    const found = findDeepValue(entry, aliases, depth + 1)
    if (found !== undefined && found !== null && found !== '') return found
  }
  return undefined
}

const textValue = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
  return ''
}

const responseErrorMessage = (value: unknown, fallback: string) => {
  if (typeof value === 'string' && value.trim()) return value
  return textValue(findDeepValue(value, ['message', 'detail', 'error'])) || fallback
}

const reportIdFromHeaders = (headers: Headers) => {
  for (const [key, rawValue] of headers.entries()) {
    const normalizedHeader = normalizedKey(key)
    const isReportIdentifier =
      normalizedHeader === 'reportid' ||
      normalizedHeader === 'xreportid' ||
      normalizedHeader === 'reportuuid' ||
      normalizedHeader === 'xreportuuid' ||
      normalizedHeader === 'creditreportid' ||
      (normalizedHeader.includes('report') &&
        (normalizedHeader.endsWith('id') || normalizedHeader.endsWith('uuid')))

    if (isReportIdentifier && rawValue.trim()) {
      const uuid = rawValue.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i)
      return uuid?.[0] ?? rawValue.trim()
    }
  }

  const compactReportId = headers.get('reportid')?.trim()
  if (compactReportId) return compactReportId
  for (const key of ['report_id', 'report-id', 'x-report-id', 'x-report_id']) {
    const value = headers.get(key)?.trim()
    if (value) return value
  }
  return ''
}

const reportIdFromBytes = (bytes: Uint8Array) => {
  if (!bytes.length) return ''
  const searchable = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(bytes.length, 4_000_000)))
  const patterns = [
    /report[_\s-]?id[\s:="'(]+([A-Za-z0-9_-]+)/i,
    /\/ReportID\s*\(([^)]+)\)/i,
    /"report_id"\s*:\s*"?([A-Za-z0-9_-]+)/i,
  ]
  for (const pattern of patterns) {
    const match = searchable.match(pattern)
    if (match?.[1]) return match[1].trim()
  }
  return ''
}

const bytesFromBase64 = (value: string): Uint8Array | null => {
  const normalized = value.replace(/^data:[^;]+;base64,/i, '').replace(/\s/g, '')
  if (!normalized) return null
  try {
    const binary = window.atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
    return bytes
  } catch {
    return null
  }
}

const documentBytesFromValue = (value: unknown): Uint8Array | null => {
  if (typeof value === 'string') return bytesFromBase64(value)
  if (Array.isArray(value) && value.every((entry) => Number.isInteger(entry) && Number(entry) >= 0 && Number(entry) <= 255)) {
    return new Uint8Array(value.map(Number))
  }
  return null
}

const authorizedHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem(AppConstants.tokenKey)
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

const absoluteDocumentUrl = (value: string) => {
  try {
    return new URL(value, `${API_BASE_URL.replace(/\/$/, '')}/`).toString()
  } catch {
    return value
  }
}

const downloadDocument = async (url: string, authenticated = true) => {
  const headers = authenticated ? authorizedHeaders() : {}
  delete headers['Content-Type']
  const response = await fetch(absoluteDocumentUrl(url), {
    headers,
  })
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!response.ok) {
    const message = new TextDecoder().decode(bytes)
    throw new ApiError(responseErrorMessage(message, `Could not download report (${response.status}).`), response.status, message)
  }
  return {
    bytes,
    mimeType: response.headers.get('content-type')?.split(';')[0] || 'application/pdf',
    reportId: reportIdFromHeaders(response.headers) || reportIdFromBytes(bytes),
  }
}

const generationEndpoint = (reportType: ReportType) => ({
  cibil: AppEndpoints.cibilGenerateReport,
  crif: AppEndpoints.crifGenerateReport,
  equifax: AppEndpoints.equifaxGenerateReport,
  experian: AppEndpoints.experianGenerateReport,
})[reportType]

const sendOtpEndpoint = (reportType: ReportType) => ({
  cibil: AppEndpoints.cibilSendOtp,
  crif: AppEndpoints.crifSendOtp,
  equifax: AppEndpoints.equifaxSendOtp,
  experian: AppEndpoints.experianSendOtp,
})[reportType]

const verifyOtpEndpoint = (reportType: ReportType) => ({
  cibil: AppEndpoints.cibilVerifyOtp,
  crif: AppEndpoints.crifVerifyOtp,
  equifax: AppEndpoints.equifaxVerifyOtp,
  experian: AppEndpoints.experianVerifyOtp,
})[reportType]

export function useCreditReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateReport = async ({
    name,
    mobile,
    pan,
    gender,
    reportType,
    consent,
    dob,
    address,
    stateCode,
    pincode,
  }: GenerateReportParams): Promise<GeneratedCreditReport> => {
    setError('')
    if (!consent) {
      const message = 'Please authorize the wallet deduction to generate this report.'
      setError(message)
      throw new Error(message)
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = reportType === 'crif'
        ? {
            name: name.trim(),
            mobile: mobile.trim(),
            consent: true,
          }
        : {
            name: name.trim(),
            mobile: mobile.trim(),
            pan: pan.trim().toUpperCase(),
            gender,
            report_type: reportType,
            consent: true,
          }

      if (reportType === 'equifax') {
        payload.dob = dob
        payload.address = address
        payload.state = stateCode
        payload.pincode = pincode
      }

      const generationUrl = reportType === 'cibil' && import.meta.env.DEV
        ? '/b2c-cibil/generate-report/'
        : reportType === 'experian'
          ? 'https://apib2c.avmanagementpvtltd.com/cibil/generate-report/v2/'
        : `${API_BASE_URL}${generationEndpoint(reportType)}`
      const response = await fetch(generationUrl, {
        method: 'POST',
        headers: authorizedHeaders(),
        body: JSON.stringify(payload),
      })
      const contentType = response.headers.get('content-type')?.toLowerCase() || ''
      const headerReportId = reportIdFromHeaders(response.headers)
      const responseBytes = new Uint8Array(await response.arrayBuffer())
      const responsePrefix = new TextDecoder().decode(responseBytes.subarray(0, 512))
      const looksLikeJson = /^[\s\uFEFF]*[\[{]/.test(responsePrefix)

      if (contentType.includes('json') || looksLikeJson) {
        const responseText = new TextDecoder().decode(responseBytes)
        let json: unknown
        try {
          json = JSON.parse(responseText) as unknown
        } catch {
          throw new ApiError(`The report service returned invalid JSON (${response.status}).`, response.status, responseText)
        }
        if (!response.ok) throw new ApiError(responseErrorMessage(json, `Could not generate report (${response.status}).`), response.status, json)

        if (reportType === 'crif') {
          const rootResponse = asRecord(json)
          if (rootResponse?.success !== true) {
            throw new ApiError(responseErrorMessage(json, 'Could not generate CRIF report.'), response.status, json)
          }

          const responseReportLink = textValue(rootResponse.credit_report_link)
          if (!responseReportLink) {
            throw new ApiError('The CRIF report response did not include a PDF link.', response.status, json)
          }

          const creditReportLink = responseReportLink.replace(
            /^http:\/\/apib2c\.avmanagementpvtltd\.com/i,
            'https://apib2c.avmanagementpvtltd.com'
          )
          return {
            reportId: textValue(rootResponse.report_id) || undefined,
            documentBytes: null,
            mimeType: 'application/pdf',
            creditReportLink,
            rawResponse: json,
          }
        }

        const jsonReportId = textValue(findDeepValue(json, ['report_id', 'reportId', 'id']))
        const creditReportLink = textValue(findDeepValue(json, [
          'credit_report_link',
          'creditReportLink',
          'report_url',
          'pdf_url',
          'download_url',
        ]))
        const encodedDocument = findDeepValue(json, ['pdf_base64', 'pdf_data', 'file_content', 'document_bytes'])
        let documentBytes = documentBytesFromValue(encodedDocument)
        let mimeType = 'application/pdf'
        let downloadedReportId = ''

        if (!documentBytes && creditReportLink) {
          const downloaded = await downloadDocument(creditReportLink)
          documentBytes = downloaded.bytes
          mimeType = downloaded.mimeType
          downloadedReportId = downloaded.reportId
        }

        if (!documentBytes) {
          documentBytes = new TextEncoder().encode(JSON.stringify(json))
          mimeType = 'application/json'
        }
        const requiresHeaderReportId = reportType === 'cibil' || reportType === 'experian'
        const reportId = requiresHeaderReportId
          ? headerReportId
          : headerReportId || jsonReportId || downloadedReportId || reportIdFromBytes(documentBytes)
        return { reportId: reportId || undefined, documentBytes, mimeType, creditReportLink, rawResponse: json }
      }

      if (!response.ok) {
        const responseText = new TextDecoder().decode(responseBytes)
        throw new ApiError(responseErrorMessage(responseText, `Could not generate report (${response.status}).`), response.status, responseText)
      }
      const requiresHeaderReportId = reportType === 'cibil' || reportType === 'experian'
      const reportId = requiresHeaderReportId ? headerReportId : headerReportId || reportIdFromBytes(responseBytes)
      return {
        reportId: reportId || undefined,
        documentBytes: responseBytes,
        mimeType: contentType.split(';')[0] || 'application/pdf',
        creditReportLink: '',
        rawResponse: null,
      }
    } catch (caughtError) {
      const message = caughtError instanceof ApiError
        ? caughtError.message
        : caughtError instanceof Error
          ? caughtError.message
          : 'Could not generate report. Please try again.'
      setError(message)
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (reportType: ReportType, mobile: string, reportId: string) => {
    setError('')
    setLoading(true)
    try {
      const result = await ApiClient.post(sendOtpEndpoint(reportType), {
        mobile: mobile.trim(),
        report_id: reportId,
      }, { auth: true })
      const response = asRecord(result)
      if ((reportType === 'cibil' || reportType === 'experian') && (!response || response.success !== true)) {
        throw new ApiError(responseErrorMessage(result, 'Could not send OTP. Please try again.'), 200, result)
      }
      return result
    } catch (caughtError) {
      const message = caughtError instanceof ApiError ? caughtError.message : 'Could not send OTP. Please try again.'
      setError(message)
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (reportType: ReportType, reportId: string, otp: string) => {
    setError('')
    setLoading(true)
    try {
      const result = await ApiClient.post(verifyOtpEndpoint(reportType), { report_id: reportId, otp }, { auth: true })
      const response = asRecord(result)
      if ((reportType === 'cibil' || reportType === 'experian') && (!response || response.success !== true)) {
        throw new ApiError(responseErrorMessage(result, 'OTP verification failed. Please try again.'), 200, result)
      }
      return result
    } catch (caughtError) {
      const message = caughtError instanceof ApiError ? caughtError.message : 'OTP verification failed. Please try again.'
      setError(message)
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { generateReport, sendOtp, verifyOtp, loading, error, setError }
}
