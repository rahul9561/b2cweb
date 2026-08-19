export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://apib2c.avmanagementpvtltd.com/api'

export const AppEndpoints = {
  customerSendOtp: '/accounts/send-otp/',
  customerVerifyOtp: '/accounts/verify-otp/',
  resendOtp: '/auth/resend-otp/',
  // Credit bureau report generation (paid — deducts wallet balance).
  // The same endpoint serves all three bureaus; the bureau is selected
  // by the `report_type` field in the request body:
  //   report_type: 'cibil'   | 'equifax' | 'crif'
  cibilGenerateReport: '/cibil/generate-report/',
  cibilSendOtp: '/cibil/send-otp/',
  // Aliases for clarity — same URLs, bureau is chosen by `report_type`.
  equifaxGenerateReport: '/cibil/generate-report/',
  crifGenerateReport: '/cibil/generate-report/',
  equifaxSendOtp: '/cibil/send-otp/',
  crifSendOtp: '/cibil/send-otp/',
  // "How to Increase CIBIL Score" analysis flow.
  cibilAnalysisGenerateReport: '/analysis/credit-analysis/cibil/',
  cibilAnalysisUpload: '/analysis/credit-analysis/upload/',
  cibilAnalysisVerify: '/analysis/credit-analysis/verify/',
  // CIBIL score check by PAN (no OTP / report download — returns score directly).
  checkCibilScore: '/loans/score-check/',
} as const

export const AppConstants = {
  appName: 'AV Management',
  companyName: 'AV Management Pvt Ltd',
  tokenKey: 'av_token',
  userDataKey: 'av_user_data',
  // Key used to block repeat "Increase CIBIL Score" analysis requests until
  // the cooling-off window (30 working days) has passed.
  cibilAnalysisSessionKey: 'cibil_analysis_session',
} as const