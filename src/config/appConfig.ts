export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://apib2c.avmanagementpvtltd.com/api'

export const AppEndpoints = {
  creditRepairBase: '/credit-repair',
  customerSendOtp: '/accounts/send-otp/',
  customerVerifyOtp: '/accounts/verify-otp/',
  customerProfile: '/accounts/profile/',
  updateCustomerProfile: '/accounts/update-profile/',
  resendOtp: '/auth/resend-otp/',


  //Fetch CRIF Report
  fetchCrifReport: '/credit-repair/report/fetch/',
  // Credit bureau report generation (paid — deducts wallet balance).
  cibilGenerateReport: '/cibil/generate-report/',
  
  experianGenerateReport: '/cibil/generate-report/v2/',
  cibilOnlyScoreReport: '/cibil/only-score/',
  cibilAdvancedReport: '/cibil/generate-report/v2/',
  cibilSendOtp: '/cibil/send-otp/',
  cibilVerifyOtp: '/cibil/verify-otp/',
  // Bureau-specific generation routes and their OTP endpoint aliases.
  equifaxGenerateReport:  '/cibil/generate-report/v2/',
  crifGenerateReport: '/cibil/generate-report/crif/',
  experianSendOtp: '/cibil/send-otp/',
  experianVerifyOtp: '/cibil/verify-otp/',
  equifaxSendOtp: '/cibil/send-otp/',
  equifaxVerifyOtp: '/cibil/verify-otp/',
  crifSendOtp: '/cibil/send-otp/',
  crifVerifyOtp: '/cibil/verify-otp/',
  // "How to Increase CIBIL Score" analysis flow.
  cibilAnalysisGenerateReport: '/analysis/credit-analysis/cibil/',
  cibilAnalysisUpload: '/analysis/credit-analysis/upload/',
  cibilAnalysisVerify: '/analysis/credit-analysis/verify/',
  experianProfileReport: '/analysis/experian-report/',
  // CIBIL score check by PAN (no OTP / report download — returns score directly).
  checkCibilScore: '/loans/score-check/',
  experianLoanReport: '/loans/experian/',
  loanBanks: '/loans/banks/',
  loanCategories: '/loans/categories/',
  loanApply: '/loans/sav/apply/',
  educationLoanLead: '/loans/b2c-website-lead/',
  walletBalance: '/dashboard/all/balace/summary/',
  walletTransactions: '/wallet/transactions/',
  razorpayCreateOrder: '/razorpay/create-order/',
  customerRechargePlans: '/cibil/customer-recharge-plans/',
} as const

export const AppConstants = {
  appName: 'AV Management',
  companyName: 'AV Management Pvt Ltd',
  tokenKey: 'av_token',
  userDataKey: 'av_user_data',
  creditRepairReportIdKey: 'av_credit_repair_report_id',
  // Key used to block repeat "Increase CIBIL Score" analysis requests until
  // the cooling-off window (30 working days) has passed.
  cibilAnalysisSessionKey: 'cibil_analysis_session',
  // Pincode + loan categories fetched after OTP verification.
  pincodeKey: 'av_pincode',
  loanCategoriesKey: 'av_loan_categories',
} as const
