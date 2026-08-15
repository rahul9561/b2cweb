export const occupationOptions = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self-employed', label: 'Self Employed' },
]

export const incomeOptions = [
  '25 Lac +',
  '15 Lac to 24.9 Lac',
  '10 Lac to 14.9 Lac',
  '8 Lac to 9.9 Lac',
  '5 Lac to 7.9 Lac',
  '3 Lac to 4.9 Lac',
  '2 Lac to 2.9 Lac',
  'Less than 2 Lac',
]

export const educationOptions = [
  'College graduate & above',
  '12th Pass',
  '10th Pass',
  'Below 10th',
]

export const smokerOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const sortOptions = [
  'Popularity',
  'Premium in 1st year : Low to High',
  'Premium in 1st year : High to Low',
  'Premium from 2nd year onwards : Low to High',
  'Premium from 2nd year onwards : High to Low',
  'Claim Settlement Ratio : High to Low',
]

export const planTypeOptions = [
  'Level Cover',
  'Increasing Cover',
  'Return of Premium',
]

export const payoutOptions = [
  'Lump sum',
  'Lump sum + Monthly Income',
  'Monthly Income only',
]

export const insurerOptions = [
  'Horizon Life',
  'Trustwell Life',
  'NorthStar Life',
  'Bluepeak Life',
  'Evershield Life',
  'ClearView Life',
]

export const premiumPayTypeOptions = [
  'Regular Pay',
  'Limited Pay',
  'Single Pay',
]

/* ── Life Cover amounts for filter popover ── */
export const lifeCoverPopoverOptions = [
  '20 Lacs', '25 Lacs', '30 Lacs', '35 Lacs', '40 Lacs', '45 Lacs',
  '50 Lacs', '75 Lacs', '1 Crore', '1.5 Crore', '2 Crore', '3 Crore', '5 Crore',
]

/* ── Cover Till ages for filter popover ── */
export const coverTillPopoverOptions = [
  '52 Years', '53 Years', '54 Years', '55 Years', '56 Years', '57 Years',
  '58 Years', '59 Years', '60 Years', '61 Years', '62 Years', '63 Years',
  '64 Years', '65 Years', '70 Years',
]

/* ── Legacy list-style options (kept for QuotesPage filter bar) ── */
export const lifeCoverOptions = [
  '25 Lakh', '50 Lakh', '75 Lakh', '1 Crore', '1.5 Crore', '2 Crore', '3 Crore', '5 Crore',
]

export const coverTillOptions = [
  '40 Yrs of age', '50 Yrs of age', '55 Yrs of age', '60 Yrs of age', '65 Yrs of age', '70 Yrs of age',
]

/* ── Pay For years (Plan Detail) ── */
export const payForOptions = [
  '5 Years', '10 Years', '12 Years', '14 Years', '15 Years', '20 Years', '25 Years', '30 Years',
]

/* ── Premium payment modes ── */
export const premiumModeOptions = ['Monthly', 'Half Yearly', 'Yearly', 'Single']

export const questionSteps = [
  {
    key: 'occupation' as const,
    type: 'cards' as const,
    title: 'Please choose your occupation type',
    options: occupationOptions,
    banner: 'FREE Dedicated Claim Support for Family',
  },
  {
    key: 'annualIncome' as const,
    type: 'radio-list' as const,
    title: 'Select your annual income',
    options: incomeOptions,
    banner: 'Get an online discount of upto 15%',
  },
  {
    key: 'education' as const,
    type: 'boxed-radio-list' as const,
    title: 'Select Educational Qualification',
    options: educationOptions,
    banner: 'Only certified expert will call you on 100% recorded line',
  },
  {
    key: 'smoker' as const,
    type: 'yes-no' as const,
    title: 'Do you Smoke or Chew tobacco?',
    options: smokerOptions,
    banner: "We Offer Lowest Price Guarantee",
  },
]
