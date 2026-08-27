// TEMPORARILY SHOW "COMING SOON" FOR HOME PRODUCT SECTIONS:
// Change this value to `false` to restore all existing product and calculator navigation.
export const SHOW_HOME_SECTIONS_COMING_SOON = true
//const SHOW_INSURANCE_HEADER_ITEMS = false
//const MAX_INELIGIBLE_DPD = 30
//const INELIGIBLE_SCORE_MIN = 399
//const INELIGIBLE_SCORE_MAX = 699

//The same eligibility condition is currently used for Personal Loan, Business Loan, and Credit Card in [CibilScoreLoanPage.tsx (line 35)](D:/Development/workspace/workspace/src/pages/CibilScoreLoanPage.tsx:35).
// A user is treated as ineligible when either:
// - DPD is not null and is <= 30
// - Credit score is between 399 and 699, inclusive
// Therefore, the current code treats the user as eligible only when both are false:
// (dpd === null || dpd > 30) &&
// (score === null || score < 399 || score > 699)
// When eligible, the user is sent to the relevant offers page. When ineligible, they are sent to the page displaying “You are currently not eligible.”
// Important: the DPD condition appears inverted—normally, a higher DPD is worse, but the current code rejects DPD <= 30 and permits DPD > 30. It also treats missing score/DPD values as eligible. I did not modify any code.

