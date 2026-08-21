import type { ProductPageData } from '../components/ProductPage'

export const healthData: ProductPageData = {
  product: 'Health Insurance',
  tagline: 'Health Insurance Plans that cover your medical expenses',
  description:
    'Compare and buy the best health insurance plans in India with cashless treatment at 18,000+ network hospitals. Get coverage for yourself and your family with affordable premiums.',
  usps: [
    { icon: 'price', title: 'Upto 40% Discount', sub: 'On premiums for women & senior citizens' },
    { icon: 'reliable', title: 'IRDAI Regulated', sub: 'Buy with complete peace of mind' },
    { icon: 'claims', title: 'Claims Support', sub: '24x7 dedicated claims assistance' },
  ],
  features: [
    { title: 'Cashless Hospitalisation', desc: 'Get cashless treatment at 18,000+ network hospitals across India without paying a single rupee.' },
    { title: 'Coverage for Pre-existing Diseases', desc: 'Plans that cover pre-existing diseases after a short waiting period, with lifetime renewability.' },
    { title: 'Pre & Post Hospitalisation', desc: 'Coverage for medical expenses incurred 30 days before and 60 days after your hospitalisation.' },
    { title: 'Maternity Cover', desc: 'Add maternity benefit to cover delivery and new-born care expenses for growing families.' },
    { title: 'Day Care Procedures', desc: 'Coverage for day care treatments that do not require a 24-hour hospital stay.' },
    { title: 'Ayush Treatments', desc: 'Coverage for Ayurveda, Yoga, Unani, Siddha and Homeopathy treatments.' },
  ],
  plans: [
    { company: 'Star Health', plan: 'Star Comprehensive', cover: '₹5 Lakh', premium: '₹9,842', tag: 'Best Seller' },
    { company: 'Care Health', plan: 'Care Supreme', cover: '₹10 Lakh', premium: '₹18,500' },
    { company: 'HDFC ERGO', plan: 'Optima Restore', cover: '₹5 Lakh', premium: '₹10,200' },
    { company: 'Niva Bupa', plan: 'Health Companion', cover: '₹10 Lakh', premium: '₹19,000' },
    { company: 'Bajaj Allianz', plan: 'Silver Health', cover: '₹5 Lakh', premium: '₹9,450' },
  ],
  planNote: '*Premiums are indicative for a 30-year-old individual in a metro city. Final premium depends on age, city, cover and add-ons.',
  steps: ['Compare plans', 'Choose your cover', 'Buy online in 5 mins', 'Get instant policy'],
  faqs: [
    { q: 'What is the waiting period for pre-existing diseases?', a: 'Most health insurance plans have a waiting period of 2-4 years for pre-existing diseases. Some plans offer a reduced waiting period of 1 year at an additional premium.' },
    { q: 'Can I claim tax benefits on health insurance premium?', a: 'Yes, premiums paid for health insurance qualify for deduction under Section 80D of the Income Tax Act, up to ₹25,000 (₹50,000 for senior citizens) per year.' },
    { q: 'What is cashless health insurance?', a: 'Cashless health insurance allows you to get treated at network hospitals without paying the bill upfront. The insurer settles the bill directly with the hospital, subject to policy terms.' },
    { q: 'Can I add my parents to my health insurance policy?', a: 'Yes, most insurers allow you to add your parents to a family floater plan, subject to their age and health conditions. Separate plans for senior citizens are also available.' },
  ],
  cta: 'Ready to protect your family\'s health?',
}

export const termData: ProductPageData = {
  product: 'Term Insurance',
  tagline: 'Term Insurance Plans starting at just ₹436/month',
  description:
    'Secure your family\'s financial future with the best term insurance plans in India. Compare 51+ insurers and get high life cover at low premiums with 0% GST on all plans.',
  usps: [
    { icon: 'price', title: '0% GST on All Plans', sub: 'Pay only your base premium' },
    { icon: 'reliable', title: '₹2 Cr Cover from ₹436/mo', sub: 'High coverage at low cost' },
    { icon: 'claims', title: '99.88% Claims Settled', sub: 'Quick and transparent claim process' },
  ],
  features: [
    { title: 'High Life Cover', desc: 'Get life cover up to ₹10 Crore at premiums as low as ₹436 per month.' },
    { title: 'Return of Premium', desc: 'Opt for TROP plans to get all your premiums back at maturity if you survive the policy term.' },
    { title: 'Tax Benefits', desc: 'Save tax on premiums under Section 80C and on payouts under Section 10(10D).' },
    { title: 'Critical Illness Rider', desc: 'Add critical illness cover to receive a lump sum on diagnosis of 30+ critical illnesses.' },
    { title: 'Whole Life Cover', desc: 'Get coverage for your entire lifetime with guaranteed premium rates.' },
    { title: 'Income Replacement', desc: 'Monthly income benefit riders to replace your income in case of an unfortunate event.' },
  ],
  plans: [
    { company: 'HDFC Life', plan: 'Click 2 Protect Plus', cover: '₹1 Crore', premium: '₹752' },
    { company: 'ICICI Prudential', plan: 'iProtect Smart', cover: '₹1 Crore', premium: '₹780' },
    { company: 'Max Life', plan: 'Smart Secure Plus', cover: '₹1 Crore', premium: '₹805' },
    { company: 'SBI Life', plan: 'eShield', cover: '₹1 Crore', premium: '₹736', tag: 'Best Seller' },
    { company: 'Tata AIA', plan: 'Life Guard Supreme', cover: '₹1 Crore', premium: '₹820' },
  ],
  planNote: '*Premiums are indicative for a 30-year-old male non-smoker with a 30-year policy term. 0% GST applies on select plans.',
  steps: ['Enter your details', 'Compare quotes', 'Select a plan', 'Buy & get e-policy'],
  faqs: [
    { q: 'How much term insurance cover do I need?', a: 'A general rule is to buy cover worth 15-20 times your annual income. You can also use the Human Life Value calculator to arrive at the right cover amount.' },
    { q: 'What happens if I outlive my term plan?', a: 'In pure term plans, no maturity benefit is paid. However, in Return of Premium (TROP) plans, all premiums are refunded at maturity.' },
    { q: 'Can I buy term insurance online?', a: 'Yes, term insurance can be fully bought online. You get the policy document instantly in your email after paying the premium.' },
    { q: 'Is there a medical test required?', a: 'Medical tests depend on the cover amount and your age. Smaller covers may not need any medical test, while larger covers require a basic health check-up.' },
  ],
  cta: 'Secure your family\'s future today',
}

export const carData: ProductPageData = {
  product: 'Car Insurance',
  tagline: 'Car Insurance starting at just ₹2,000/year',
  description:
    'Protect your car against accidents, theft and third-party liabilities. Compare comprehensive car insurance plans from 20+ insurers and renew your policy online in minutes.',
  usps: [
    { icon: 'price', title: 'Upto 80% on IDV', sub: 'Market value protection' },
    { icon: 'reliable', title: 'Cashless Claims', sub: 'At 3,700+ garages' },
    { icon: 'claims', title: 'Instant Renewal', sub: 'Policy in under 2 minutes' },
  ],
  features: [
    { title: 'Zero Depreciation', desc: 'Get full claim value on car parts without depreciation deductions for 3-5 years.' },
    { title: 'Cashless Repair', desc: 'Cashless claim settlement at 3,700+ network garages across India.' },
    { title: 'Third Party Cover', desc: 'Mandatory legal cover for damage or injury caused to a third party by your car.' },
    { title: 'Engine Protection', desc: 'Add-on cover for engine damage due to water ingression, flooding or oil leakage.' },
    { title: 'Roadside Assistance', desc: '24x7 roadside assistance including flat tyre change, battery jump start and towing.' },
    { title: 'No Claim Bonus', desc: 'Earn up to 50% NCB discount on renewal for every claim-free year.' },
  ],
  plans: [
    { company: 'Acko', plan: 'Acko Comprehensive', cover: 'IDV ₹5 Lakh', premium: '₹4,200' },
    { company: 'Digit', plan: 'Digit Motor', cover: 'IDV ₹5 Lakh', premium: '₹4,500', tag: 'Best Seller' },
    { company: 'Bajaj Allianz', plan: 'Car Secure', cover: 'IDV ₹5 Lakh', premium: '₹4,350' },
    { company: 'IFFCO Tokio', plan: 'Comprehensive', cover: 'IDV ₹5 Lakh', premium: '₹4,100' },
    { company: 'HDFC ERGO', plan: 'MobiCare', cover: 'IDV ₹5 Lakh', premium: '₹4,650' },
  ],
  planNote: '*Premiums are indicative for a 5-year-old hatchback in Delhi NCR. Final premium depends on car model, city, IDV and add-ons.',
  steps: ['Enter your car details', 'Compare quotes', 'Select add-ons', 'Instant policy'],
  faqs: [
    { q: 'Is car insurance mandatory in India?', a: 'Yes, at least third-party car insurance is mandatory under the Motor Vehicles Act, 1988. Driving without valid insurance can lead to a fine of ₹2,000 or imprisonment.' },
    { q: 'What is IDV?', a: 'IDV (Insured Declared Value) is the current market value of your car. It is the maximum amount your insurer will pay in case of total loss or theft of the vehicle.' },
    { q: 'How does No Claim Bonus work?', a: 'For every claim-free year, your premium decreases by up to 20% NCB, capping at 50% after 5 consecutive years. The NCB is transferable between insurers.' },
    { q: 'Can I transfer my existing car insurance?', a: 'Yes, you can port your policy to another insurer. Your No Claim Bonus and remaining policy period are carried forward to the new insurer.' },
  ],
  cta: 'Drive safe with the right car insurance',
}

export const bikeData: ProductPageData = {
  product: 'Bike Insurance',
  tagline: 'Two Wheeler Insurance starting at just ₹600/year',
  description:
    'Get comprehensive bike insurance with theft cover, own damage protection and third-party liability. Compare quotes from 20+ insurers and renew instantly.',
  usps: [
    { icon: 'price', title: '₹600/year onwards', sub: 'For third party cover' },
    { icon: 'reliable', title: 'Comprehensive Cover', sub: 'Theft, damage & liability' },
    { icon: 'claims', title: '2-Minute Renewal', sub: 'Paperless & instant' },
  ],
  features: [
    { title: 'Own Damage Cover', desc: 'Compensation for damage to your bike from accidents, fire, theft or natural calamities.' },
    { title: 'Third Party Cover', desc: 'Mandatory protection against legal liability for injury or property damage to others.' },
    { title: 'Zero Depreciation', desc: 'Add-on to receive full claim amount on bike parts without depreciation deduction.' },
    { title: 'Personal Accident Cover', desc: 'Financial protection for the rider against accidental death or permanent disability.' },
    { title: 'NCB Benefits', desc: 'Save up to 50% on renewal premiums with a claim-free track record.' },
    { title: 'Cashless Repairs', desc: 'Get your bike repaired cashlessly at 5,700+ network garages.' },
  ],
  plans: [
    { company: 'Digit', plan: 'Digit Two Wheeler', cover: 'Comprehensive', premium: '₹1,350', tag: 'Best Seller' },
    { company: 'Acko', plan: 'Acko Bike', cover: 'Comprehensive', premium: '₹1,280' },
    { company: 'Bajaj Allianz', plan: 'Bike Secure', cover: 'Comprehensive', premium: '₹1,400' },
    { company: 'IFFCO Tokio', plan: '2-Wheeler Insurance', cover: 'Comprehensive', premium: '₹1,220' },
    { company: 'National Insurance', plan: 'Third Party Only', cover: 'Third Party', premium: '₹620' },
  ],
  planNote: '*Premiums are indicative for a 150cc bike in Delhi NCR. Final premium depends on bike model, city and add-ons.',
  steps: ['Enter bike details', 'Compare plans', 'Choose add-ons', 'Get instant policy'],
  faqs: [
    { q: 'Is bike insurance mandatory?', a: 'Yes, third-party bike insurance is mandatory by law for all two-wheelers plying on Indian roads.' },
    { q: 'What does comprehensive bike insurance cover?', a: 'It covers own damage (accidents, theft, fire, natural calamities) along with third-party liabilities and personal accident cover.' },
    { q: 'Can I buy bike insurance without a valid RC?', a: 'No, you need a valid Registration Certificate (RC) to purchase bike insurance. Your bike must be registered.' },
    { q: 'How is the premium calculated?', a: 'The premium is calculated based on your bike\'s cubic capacity (cc), age, IDV, location and the add-ons you choose.' },
  ],
  cta: 'Ride safe, ride insured',
}

export const travelData: ProductPageData = {
  product: 'Travel Insurance',
  tagline: 'Travel Insurance starting at just ₹99/day',
  description:
    'Get comprehensive travel insurance for domestic and international trips. Coverage includes medical emergencies, trip cancellation, lost baggage and personal accident.',
  usps: [
    { icon: 'price', title: '₹99/day onwards', sub: 'For international trips' },
    { icon: 'reliable', title: 'Global Coverage', sub: '180+ countries covered' },
    { icon: 'claims', title: '24x7 Assistance', sub: 'Emergency help worldwide' },
  ],
  features: [
    { title: 'Medical Emergencies', desc: 'Coverage for hospitalisation and medical expenses during your trip abroad.' },
    { title: 'Trip Cancellation', desc: 'Get reimbursement for non-refundable costs if your trip is cancelled due to covered reasons.' },
    { title: 'Lost Baggage', desc: 'Compensation for delayed, lost or damaged baggage during your journey.' },
    { title: 'Personal Accident', desc: 'Financial cover for accidental death or permanent disability while travelling.' },
    { title: 'Flight Delay', desc: 'Get compensated for covered flight delays and missed connections.' },
    { title: 'Passport Loss', desc: 'Assistance and coverage for loss of passport while travelling abroad.' },
  ],
  plans: [
    { company: 'ICICI Lombard', plan: 'Travel Insurance - Individual', cover: 'Schengen', premium: '₹750', tag: 'Best Seller' },
    { company: 'Bajaj Allianz', plan: 'Travel Elite', cover: 'Worldwide', premium: '₹1,200' },
    { company: 'HDFC ERGO', plan: 'Travel Secure', cover: 'USA', premium: '₹1,500' },
    { company: 'Tata AIG', plan: 'Travel Guard', cover: 'Worldwide', premium: '₹1,350' },
    { company: 'Digit', plan: 'Travel Insurance', cover: 'Asia', premium: '₹600' },
  ],
  planNote: '*Premiums are indicative for a 7-day trip by a 30-year-old individual. Final premium depends on destination, duration and age.',
  steps: ['Enter trip details', 'Compare plans', 'Choose coverage', 'Instant policy'],
  faqs: [
    { q: 'Is travel insurance mandatory?', a: 'Travel insurance is mandatory for Schengen visa applications. Many other countries also require proof of travel insurance with a minimum medical cover.' },
    { q: 'What is covered under medical expenses?', a: 'Medical cover includes hospitalisation, doctor fees, medicines and emergency medical evacuation, subject to the policy\'s sum insured and terms.' },
    { q: 'Can I buy travel insurance for domestic trips?', a: 'Yes, domestic travel insurance is available and covers trip cancellation, lost baggage and personal accident for trips within India.' },
    { q: 'When should I buy travel insurance?', a: 'Ideally, buy travel insurance immediately after booking your trip. This ensures trip cancellation coverage from the date of purchase.' },
  ],
  cta: 'Travel worry-free with the right insurance',
}

export const investmentData: ProductPageData = {
  product: 'Investment Plans',
  tagline: 'Investment Plans that grow your wealth, tax-free',
  description:
    'Compare the best investment plans in India — ULIPs, guaranteed return plans, child plans and pension plans. Build a corpus of ₹2 Crore with disciplined monthly investments.',
  usps: [
    { icon: 'price', title: 'Upto 6.9% Returns', sub: 'Guaranteed on select plans' },
    { icon: 'reliable', title: 'Tax-Free Payouts', sub: 'Under Section 10(10D)' },
    { icon: 'claims', title: 'Trusted by 50M+', sub: 'Users nationwide' },
  ],
  features: [
    { title: 'Guaranteed Returns', desc: 'Plans that guarantee returns of up to 6.9% per annum on your invested premium.' },
    { title: 'ULIP Plans', desc: 'Market-linked plans combining life cover with equity investments for wealth creation.' },
    { title: 'Child Plans', desc: 'Build a corpus for your child\'s higher education and marriage with waiver of premium benefit.' },
    { title: 'Pension Plans', desc: 'Create a regular income stream for your retirement years with annuity options.' },
    { title: 'Tax Saving', desc: 'Investments qualify for deduction under Section 80C with tax-free maturity benefits.' },
    { title: 'Flexible Tenure', desc: 'Choose policy terms from 5 to 30 years based on your financial goals.' },
  ],
  plans: [
    { company: 'HDFC Life', plan: 'Smart Fund Plus ULIP', cover: 'Growth', premium: '12% p.a.*', tag: 'Best Seller' },
    { company: 'ICICI Prudential', plan: 'iAssure', cover: 'Guaranteed', premium: '5.50% p.a.' },
    { company: 'Max Life', plan: 'Guaranteed Income Plan', cover: 'Guaranteed', premium: '6.40% p.a.' },
    { company: 'SBI Life', plan: 'Wealth Plus', cover: 'Market Linked', premium: 'Variable' },
    { company: 'LIC', plan: 'Jeevan Umang', cover: 'Guaranteed', premium: '5.00% p.a.' },
  ],
  planNote: '*Returns are indicative and depend on market performance for market-linked plans. Guaranteed plans offer fixed returns as per policy terms.',
  steps: ['Define your goal', 'Compare plans', 'Choose an option', 'Start investing'],
  faqs: [
    { q: 'What is the difference between ULIP and mutual funds?', a: 'ULIPs combine life insurance cover with market-linked investments. They offer tax benefits under 80C and 10(10D), while a portion of the premium goes towards life cover.' },
    { q: 'Are investment plan returns guaranteed?', a: 'Traditional plans offer guaranteed returns as per the policy. Market-linked plans like ULIPs offer returns based on fund performance, with a lock-in of 5 years.' },
    { q: 'What is the minimum investment amount?', a: 'Minimum premiums start from around ₹1,800 per month or ₹20,000 per year for most plans, depending on the insurer and plan chosen.' },
    { q: 'Can I withdraw my investment anytime?', a: 'ULIPs have a 5-year lock-in period. Traditional plans allow partial withdrawals after a certain policy term, with surrender charges applicable for early exit.' },
  ],
  cta: 'Start building your wealth today',
}
