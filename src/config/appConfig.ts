export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://apib2c.avmanagementpvtltd.com/api'

export const AppEndpoints = {
  customerSendOtp: '/accounts/send-otp/',
  customerVerifyOtp: '/accounts/verify-otp/',
  resendOtp: '/auth/resend-otp/',
    // Credit bureau report generation (paid — deducts wallet balance).
  // Same endpoint is used for cibil / equifax / crif; the bureau is
  // selected by the `report_type` field in the request body.
  cibilGenerateReport: '/cibil/generate-report/',
  cibilSendOtp: '/cibil/send-otp/',
} as const

export const AppConstants = {
  appName: 'AV Management',
  companyName: 'AV Management Pvt Ltd',
  tokenKey: 'av_token',
  userDataKey: 'av_user_data',
} as const