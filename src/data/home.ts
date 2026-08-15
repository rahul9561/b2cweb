/* ──────────────── Local PB icon images (extracted from PolicyBazaar CDN sprites) ──────────────── */
const ICON = '/images/icons'

/* ──────────────── Product tiles (main grid) with real PB icons ──────────────── */
export const productTiles = [
  {
    name: 'Term Life Insurance',
    to: '/term-insurance',
    icon: `${ICON}/icon_term-life.png`,
    tag: 'Upto 15% Discount',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Health Insurance',
    to: '/health-insurance',
    icon: `${ICON}/icon_health-insurance.png`,
    tag: 'Lowest Price Guarantee',
    tagColor: '#49cc76',
    bgColor: '#fce4ec',
  },
  {
    name: 'Investment Plans',
    to: '/investment-plans',
    icon: `${ICON}/icon_investment.png`,
    tag: 'In-Built Life Cover',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Car Insurance',
    to: '/car-insurance',
    icon: `${ICON}/icon_car-insurance.png`,
    tag: 'Lowest Price Guarantee',
    tagColor: '#49cc76',
    bgColor: '#e3f2fd',
  },
  {
    name: '2 Wheeler Insurance',
    to: '/bike-insurance',
    icon: `${ICON}/icon_two-wheeler-insurance.png`,
    tag: 'Upto 85% Discount',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Family Health Insurance',
    to: '/family-health-insurance',
    icon: `${ICON}/icon_family-health-insurance.png`,
    tag: 'Upto 25% Discount',
    tagColor: '#49cc76',
    bgColor: '#fff3e0',
  },
  {
    name: 'Travel Insurance',
    to: '/travel-insurance',
    icon: `${ICON}/icon_travel-insurance.png`,
    tag: '',
    tagColor: '',
    bgColor: '#e3f2fd',
  },
  {
    name: 'Term Insurance (Women)',
    to: '/term-insurance-women',
    icon: `${ICON}/icon-term-insurance-women.png`,
    tag: 'Upto 20% Cheaper',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Term Plans with Return of Premium',
    to: '/term-return-of-premium',
    icon: `${ICON}/icon_return-of-premium.png`,
    tag: '',
    tagColor: '',
    bgColor: '#ede7f6',
  },
  {
    name: 'Guaranteed Return Plans',
    to: '/guaranteed-return-plans',
    icon: `${ICON}/icon_guaranteed-return-plan.png`,
    tag: 'Upto 7.4% Returns',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Child Savings Plans',
    to: '/child-savings-plans',
    icon: `${ICON}/icon_child-saving-plan.png`,
    tag: 'Premium Waiver',
    tagColor: '#fa6541',
    bgColor: '#fce4ec',
  },
  {
    name: 'Retirement Plans',
    to: '/retirement-plans',
    icon: `${ICON}/icon_retirement-plan.png`,
    tag: '',
    tagColor: '',
    bgColor: '#e3f2fd',
  },
  {
    name: 'Employee Group Health Insurance',
    to: '/employee-group-health-insurance',
    icon: `${ICON}/icon-group-health-insurance.png`,
    tag: 'Upto 65% Discount',
    tagColor: '#49cc76',
    bgColor: '#e8f5e9',
  },
  {
    name: 'Home Insurance',
    to: '/home-insurance',
    icon: `${ICON}/icon_home-insurance.png`,
    tag: 'Upto 25% Discount',
    tagColor: '#49cc76',
    bgColor: '#e3f2fd',
  },
]

/* ──────────────── Quick Buy chips ──────────────── */
export const quickBuyItems = [
  { label: 'LIC Plans', iconUrl: `${ICON}/icon_investment.png` },
  { label: 'Return of Premium', iconUrl: `${ICON}/icon_return-of-premium.png` },
  { label: 'Life Insurance for Housewife', iconUrl: `${ICON}/icon-term-insurance-women.png` },
  { label: 'Dip i Savings', iconUrl: `${ICON}/icon_investment.png` },
  { label: '1 Cr Health Insurance', iconUrl: `${ICON}/icon_health-insurance.png` },
  { label: 'Personal Loans', iconUrl: `${ICON}/icon_home-insurance.png` },
  { label: 'Commercial Vehicles', iconUrl: `${ICON}/icon_car-insurance.png` },
  { label: 'Home Insurance', iconUrl: `${ICON}/icon_home-insurance.png` },
  { label: 'Professional Indemnity for Doctors', iconUrl: `${ICON}/icon_health-insurance.png` },
  { label: "Directors & Officers Liability", iconUrl: `${ICON}/icon-group-health-insurance.png` },
  { label: 'Workmen Compensation', iconUrl: `${ICON}/icon-group-health-insurance.png` },
  { label: 'Renters Insurance', iconUrl: `${ICON}/icon_home-insurance.png` },
  { label: 'Personal Cyber Insurance', iconUrl: `${ICON}/icon_health-insurance.png` },
]

/* ──────────────── Stats (What makes PB the best place) ──────────────── */
export const stats = [
  {
    title: 'Over 9 million',
    sub: 'customers trust us to secure their family\'s finances',
    iconType: 'users',
    highlight: true,
  },
  {
    title: '51 Insurers',
    sub: 'partner with us, ensuring choice, transparency & simplicity',
    iconType: 'building',
    highlight: false,
  },
  {
    title: 'Best Price',
    sub: 'for all types of insurance plans available in the market',
    iconType: 'rupee',
    highlight: false,
  },
  {
    title: 'Claims',
    sub: 'support built-in with every policy; you will never need it till the last mile',
    iconType: 'shield',
    highlight: false,
  },
]

/* ──────────────── Calculator groups ──────────────── */
export const calculatorGroups = [
  {
    title: 'Investment calculators',
    iconType: 'trending',
    links: ['SIP Calculator', 'Income Tax Calculator', 'ULIP Calculator', 'NPS Calculator'],
  },
  {
    title: 'Health & Wellness calculators',
    iconType: 'heart',
    links: ['BMI Calculator', 'Ideal Weight Calculator', 'Calorie Calculator', 'Body Fat Calculator'],
  },
  {
    title: 'Term Insurance calculators',
    iconType: 'shield',
    links: ['Life Insurance Calculator', 'Term Insurance Calculator', 'Human Life Value Calculator', 'Home Loan Insurance Calculator'],
  },
]

/* ──────────────── PB Advantage ──────────────── */
export const pbAdvantages = [
  {
    iconType: 'rupee',
    heading: 'One of the best Prices',
    text: 'Guaranteed',
  },
  {
    iconType: 'badge',
    heading: 'Unbiased Advice',
    text: 'keeping customers first',
  },
  {
    iconType: 'shieldCheck',
    heading: '100% Reliable',
    text: 'Regulated by IRDAI',
  },
  {
    iconType: 'headphones',
    heading: 'Claims Support',
    text: 'Made stress-free',
  },
  {
    iconType: 'heart',
    heading: 'Happy to Help',
    text: 'Every day of the week',
  },
]

/* ──────────────── Testimonials ──────────────── */
export const testimonials = [
  { name: 'Bhaaskar Lokhande', copy: 'Thanks for constant push in time and really appreciate your help. Thanks to PolicyBazaar, it is life with you guys.' },
  { name: 'Shraddha Sharma', copy: 'Very apt to use, friendly website.' },
  { name: 'Ananth Narayan', copy: 'Thank you for followup, following up on the policy. It has been a very pleasant experience with you folks at Policybazaar.' },
  { name: 'Urvashi Solanki', copy: 'My mother is 64 and we finally found an affordable senior citizen health plan. Great support.' },
  { name: 'Neha Jain', copy: 'Bought a family health policy with maternity cover. The process was completely online.' },
  { name: 'Prabhat Yadav', copy: 'Claims support was excellent. My bike claim was settled in record time.' },
]

/* ──────────────── Partners ──────────────── */
export const partners = [
  'Future Generali', 'LIC', 'ICICI Prudential', 'SBI Life', 'Max Life',
  'Tata AIA', 'Bajaj Allianz', 'Star Health', 'Care Health', 'Digit',
  'HDFC ERGO', 'Acko', 'IFFCO Tokio', 'Kotak Life', 'PNB MetLife',
  'Canara HSBC', 'Exide Life', 'Aegon Life', 'Aviva Life', 'Tata AIG',
  'Royal Sundaram', 'Cholamandalam MS', 'Shriram General', 'SBI General',
  'Bajaj Allianz General', 'Liberty General', 'Raheja QBE', 'Magma HDI',
  'Go Digit', 'United India', 'New India Assurance', 'Oriental Insurance',
  'Reliance General', 'Aditya Birla Sun Life', 'HDFC Life', 'IDBI Federal',
  'IndiaFirst Life', 'Star Union Dai-ichi', 'DHFL Pramerica', 'Edelweiss Tokio',
]

/* ──────────────── Education steps (app promo) ──────────────── */
export const educationSteps = [
  { iconType: 'graduation', title: 'Compare', desc: 'Browse quotes from all leading insurers in one place' },
  { iconType: 'shield', title: 'Choose', desc: 'Select the plan that fits your needs and budget' },
  { iconType: 'file', title: 'Buy Online', desc: 'Paperless purchase with instant policy issuance' },
  { iconType: 'heart', title: 'Get Covered', desc: 'Dedicated claim support whenever you need it' },
]

/* ──────────────── Group Brands ──────────────── */
export const groupBrands = [
  { name: 'PB', label: 'PB' },
  { name: 'policybazaar', label: 'policybazaar' },
  { name: 'investopolicy', label: 'investopolicy' },
  { name: 'planbazaar', label: 'planbazaar' },
  { name: 'policybazaar insurance brokers', label: 'policybazaar insurance brokers' },
]
