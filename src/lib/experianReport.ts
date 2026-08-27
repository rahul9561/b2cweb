import type { ExperianReportResponse } from './profileApi'

type JsonRecord = Record<string, unknown>

export type ExperianOverview = {
  score: number | null
  totalAccounts: number | null
  activeAccounts: number | null
  closedAccounts: number | null
  currentBalance: number | null
  overdueAccounts: number | null
  recentEnquiries: number | null
  creditMix: string
  reportDate: string
  reference: string
  nextUpdate: string
}

export type ReportDetail = {
  label: string
  value: string | number
}

export type ExperianAccount = {
  id: string
  lender: string
  accountNumber: string
  accountType: string
  status: string
  currentBalance: number | null
  amountPastDue: number | null
  originalAmount: number | null
  creditLimit: number | null
  openedOn: string
  closedOn: string
  reportedOn: string
  tenureMonths: number | null
  maxDaysPastDue: number | null
}

export type ParsedExperianReport = {
  overview: ExperianOverview
  creditSummary: ReportDetail[]
  accounts: ExperianAccount[]
  enquiries: ReportDetail[]
  personalDetails: ReportDetail[]
  reportDetails: ReportDetail[]
}

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : null

const asArray = (value: unknown): unknown[] => Array.isArray(value) ? value : value === undefined || value === null ? [] : [value]

const cleanText = (value: unknown): string => {
  if (value === undefined || value === null) return ''
  const text = String(value).trim()
  return ['', 'null', 'undefined', 'none', '?'].includes(text.toLowerCase()) ? '' : text
}

const numberValue = (value: unknown): number | null => {
  const text = cleanText(value).replace(/[₹,\s]/g, '')
  if (!text) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : null
}

const getRecord = (record: JsonRecord | null, key: string) => asRecord(record?.[key])

const parseJsonRecord = (value: unknown): JsonRecord | null => {
  if (typeof value !== 'string') return asRecord(value)
  try {
    return asRecord(JSON.parse(value) as unknown)
  } catch {
    return null
  }
}

const getProfile = (response: ExperianReportResponse): JsonRecord | null => {
  const levelOne = getRecord(response, 'data')
  const levelTwo = getRecord(levelOne, 'data')
  const result = getRecord(levelTwo, 'result')
  const resultJson = parseJsonRecord(result?.result_json)
  return getRecord(resultJson, 'INProfileResponse')
}

const titleCase = (value: string) => value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())

const maskedValue = (value: string, visibleCharacters = 4) => {
  if (!value) return ''
  if (value.length <= visibleCharacters) return value
  return `${'•'.repeat(Math.min(6, value.length - visibleCharacters))}${value.slice(-visibleCharacters)}`
}

const detail = (label: string, value: unknown): ReportDetail | null => {
  const cleaned = typeof value === 'number' ? value : cleanText(value)
  return cleaned === '' ? null : { label, value: cleaned }
}

const compactDetails = (items: Array<ReportDetail | null>) => items.filter(Boolean) as ReportDetail[]

const accountStatus = (code: string) => {
  if (code === '11') return 'Active'
  if (code === '13') return 'Closed'
  return code ? `Status code ${code}` : ''
}

const accountType = (code: string) => {
  return code ? `Account type code ${code}` : ''
}

const addressFrom = (account: JsonRecord | null) => {
  const addresses = asArray(account?.CAIS_Holder_Address_Details).map(asRecord).filter(Boolean) as JsonRecord[]
  const address = addresses.find((entry) => [
    entry.First_Line_Of_Address_non_normalized,
    entry.City_non_normalized,
    entry.ZIP_Postal_Code_non_normalized,
  ].some((value) => cleanText(value)))
  if (!address) return ''
  return [
    address.First_Line_Of_Address_non_normalized,
    address.Second_Line_Of_Address_non_normalized,
    address.Third_Line_Of_Address_non_normalized,
    address.City_non_normalized,
    address.ZIP_Postal_Code_non_normalized,
  ]
    .map(cleanText)
    .map((part) => part.replace(/\bNULL\b/gi, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(', ')
}

export const formatExperianCurrency = (value: number | null) => value === null
  ? ''
  : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const formatExperianDate = (value: string) => {
  if (!value) return ''
  const compactDate = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value
  const date = new Date(compactDate)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const parseExperianReport = (response: ExperianReportResponse): ParsedExperianReport => {
  const profile = getProfile(response)
  const header = getRecord(profile, 'Header')
  const creditHeader = getRecord(profile, 'CreditProfileHeader')
  const cais = getRecord(profile, 'CAIS_Account')
  const summary = getRecord(cais, 'CAIS_Summary')
  const creditAccounts = getRecord(summary, 'Credit_Account')
  const outstanding = getRecord(summary, 'Total_Outstanding_Balance')
  const score = getRecord(profile, 'SCORE')
  const totalCaps = getRecord(profile, 'TotalCAPS_Summary')
  const currentApplication = getRecord(getRecord(profile, 'Current_Application'), 'Current_Application_Details')
  const applicant = getRecord(currentApplication, 'Current_Applicant_Details')
  const accountRecords = asArray(cais?.CAIS_Account_DETAILS).map(asRecord).filter(Boolean) as JsonRecord[]

  const accounts = accountRecords.map((account, index): ExperianAccount => {
    const history = asArray(account.CAIS_Account_History).map(asRecord).filter(Boolean) as JsonRecord[]
    const daysPastDue = history.map((entry) => numberValue(entry.Days_Past_Due)).filter((value): value is number => value !== null)
    const accountNumber = cleanText(account.Account_Number)
    const identification = cleanText(account.Identification_Number)
    return {
      id: identification || accountNumber || String(index),
      lender: cleanText(account.Subscriber_Name),
      accountNumber,
      accountType: accountType(cleanText(account.Account_Type)),
      status: accountStatus(cleanText(account.Account_Status)),
      currentBalance: numberValue(account.Current_Balance),
      amountPastDue: numberValue(account.Amount_Past_Due),
      originalAmount: numberValue(account.Highest_Credit_or_Original_Loan_Amount),
      creditLimit: numberValue(account.Credit_Limit_Amount),
      openedOn: cleanText(account.Open_Date),
      closedOn: cleanText(account.Date_Closed),
      reportedOn: cleanText(account.Date_Reported),
      tenureMonths: numberValue(account.Repayment_Tenure ?? account.Terms_Duration),
      maxDaysPastDue: daysPastDue.length ? Math.max(...daysPastDue) : null,
    }
  }).filter((account) => Object.values(account).some((value) => value !== '' && value !== null))

  const securedBalance = numberValue(outstanding?.Outstanding_Balance_Secured)
  const unsecuredBalance = numberValue(outstanding?.Outstanding_Balance_UnSecured)
  const securedPercentage = numberValue(outstanding?.Outstanding_Balance_Secured_Percentage)
  const unsecuredPercentage = numberValue(outstanding?.Outstanding_Balance_UnSecured_Percentage)
  const creditMix = securedBalance !== null && unsecuredBalance !== null
    ? `Secured ${securedPercentage ?? 0}% · Unsecured ${unsecuredPercentage ?? 0}%`
    : securedBalance !== null ? 'Secured credit' : unsecuredBalance !== null ? 'Unsecured credit' : ''
  const reportDate = cleanText(header?.ReportDate ?? creditHeader?.ReportDate)
  const reference = cleanText(response.reference_number ?? getRecord(response, 'data')?.reference_number)
  const recentEnquiries = numberValue(totalCaps?.TotalCAPSLast180Days)
  const overdueAccounts = accounts.length
    ? accounts.filter((account) => (account.amountPastDue ?? 0) > 0).length
    : null

  const firstAccount = accountRecords[0] ?? null
  const holder = asRecord(asArray(firstAccount?.CAIS_Holder_Details)[0])
  const firstName = cleanText(applicant?.First_Name)
  const middleName = cleanText(applicant?.Middle_Name1)
  const lastName = cleanText(applicant?.Last_Name)
  const fullName = [firstName, middleName, lastName].filter(Boolean).map(titleCase).join(' ')
  const holderDob = cleanText(holder?.Date_of_birth)
  const pan = cleanText(applicant?.IncomeTaxPan)
  const mobile = cleanText(applicant?.MobilePhoneNumber)

  const overview: ExperianOverview = {
    score: numberValue(score?.BureauScore),
    totalAccounts: numberValue(creditAccounts?.CreditAccountTotal),
    activeAccounts: numberValue(creditAccounts?.CreditAccountActive),
    closedAccounts: numberValue(creditAccounts?.CreditAccountClosed),
    currentBalance: numberValue(outstanding?.Outstanding_Balance_All),
    overdueAccounts,
    recentEnquiries,
    creditMix,
    reportDate,
    reference,
    nextUpdate: '',
  }

  return {
    overview,
    creditSummary: compactDetails([
      detail('Total accounts', overview.totalAccounts),
      detail('Active accounts', overview.activeAccounts),
      detail('Closed accounts', overview.closedAccounts),
      detail('Default accounts', numberValue(creditAccounts?.CreditAccountDefault)),
      detail('Total outstanding balance', formatExperianCurrency(overview.currentBalance)),
      detail('Secured outstanding', formatExperianCurrency(securedBalance)),
      detail('Unsecured outstanding', formatExperianCurrency(unsecuredBalance)),
      detail('Credit mix', creditMix),
    ]),
    accounts,
    enquiries: compactDetails([
      detail('Last 7 days', numberValue(totalCaps?.TotalCAPSLast7Days)),
      detail('Last 30 days', numberValue(totalCaps?.TotalCAPSLast30Days)),
      detail('Last 90 days', numberValue(totalCaps?.TotalCAPSLast90Days)),
      detail('Last 180 days', recentEnquiries),
    ]),
    personalDetails: compactDetails([
      detail('Name', fullName),
      detail('Date of birth', formatExperianDate(cleanText(applicant?.Date_Of_Birth_Applicant) || holderDob)),
      detail('PAN', maskedValue(pan)),
      detail('Mobile number', maskedValue(mobile)),
      detail('Address', addressFrom(firstAccount)),
    ]),
    reportDetails: compactDetails([
      detail('Report date', formatExperianDate(reportDate)),
      detail('Reference number', reference),
      detail('Report number', cleanText(creditHeader?.ReportNumber)),
      detail('Request ID', cleanText(getRecord(response, 'data')?.request_id)),
      detail('Report version', cleanText(creditHeader?.Version)),
    ]),
  }
}
