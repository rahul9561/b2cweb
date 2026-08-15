// import { useEffect, useRef, useState } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   ArrowLeft, Shield, Heart, TrendingUp, Umbrella, CalendarClock,
//   Layers, Calendar, HandCoins, Wallet, ChevronDown, Info, AlertCircle, Download, Headphones,
//   Star, CheckCircle
// } from 'lucide-react'
// import { useUserProfile } from '../context/UserProfileContext'
// import { useFilters } from '../context/FiltersContext'
// import { mockPlans, type MockPlan } from '../data/mockPlans'
// import BrandMark from '../components/common/BrandMark'
// import FilterPickerPopover from '../components/common/FilterPickerPopover'
// import SiteFooter from '../components/common/SiteFooter'
// import EditProfileDrawer from '../components/drawers/EditProfileDrawer'
// import { calculatePremium } from '../lib/premium'

// /* ────────────────────────────────────────────
//    Icon resolver
//    ──────────────────────────────────────────── */
// const iconMap: Record<string, React.ElementType> = {
//   TrendingUp: TrendingUp,
//   Shield: Shield,
//   Heart: Heart,
//   Umbrella: Umbrella,
//   CalendarClock: CalendarClock,
//   Layers: Layers,
//   Calendar: Calendar,
//   HandCoins: HandCoins,
//   Wallet: Wallet,
//   Star: Star,
//   CheckCircle: CheckCircle,
//   Info: Info,
//   AlertCircle: AlertCircle,
// }

// function resolveIcon(name: string) {
//   return iconMap[name] || Shield
// }

// /* ────────────────────────────────────────────
//    Plan Config Card
//    ──────────────────────────────────────────── */
// function PlanConfigCard({ plan }: { plan: MockPlan }) {
//   const { filters, dispatch } = useFilters()
//   const [expandBenefits, setExpandBenefits] = useState(false)
//   const [lifeCoverOpen, setLifeCoverOpen] = useState(false)
//   const [coverTillOpen, setCoverTillOpen] = useState(false)
//   const [payForOpen, setPayForOpen] = useState(false)
//   const [paymentModeOpen, setPaymentModeOpen] = useState(false)
//   const [customLifeCover, setCustomLifeCover] = useState(filters.lifeCover)
//   const lifeCoverRef = useRef<HTMLDivElement>(null)
//   const coverTillRef = useRef<HTMLDivElement>(null)
//   const payForRef = useRef<HTMLDivElement>(null)
//   const paymentModeRef = useRef<HTMLDivElement>(null)

//   const displayedBenefits = expandBenefits ? plan.benefitsList : plan.benefitsList.slice(0, 3)

//   const lifeCoverOptions = ['10 Lacs', '15 Lacs', '20 Lacs', '25 Lacs', '30 Lacs', '40 Lacs', '50 Lacs', '75 Lacs', '1 Crore']
//   const coverTillOptions = Array.from({ length: 29 }, (_, i) => `${42 + i} Years`)
//   const payForOptions = ['One Time', '5 Years', '10 Years', '15 Years', '20 Years', '25 Years', '30 Years']
//   const paymentModeOptions = filters.payFor === 'Single Pay' ? ['Single', 'Yearly', 'Half Yearly', 'Monthly'] : ['Yearly', 'Half Yearly', 'Monthly']

//   const normalizePayFor = (value: string) => {
//     if (value === 'One Time') return 'Single Pay'
//     if (value === '5 Years' || value === '10 Years' || value === '15 Years' || value === '20 Years' || value === '25 Years' || value === '30 Years') return 'Limited Pay'
//     return 'Regular Pay'
//   }

//   const handleLifeCoverSelect = (val: string) => {
//     dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: val })
//     setLifeCoverOpen(false)
//   }

//   const handleCustomLifeCoverApply = () => {
//     const formatted = customLifeCover.trim()
//     if (formatted) {
//       dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: formatted })
//       setLifeCoverOpen(false)
//     }
//   }

//   const handleCoverTillSelect = (val: string) => {
//     dispatch({ type: 'SET_FIELD', field: 'coverTillAge', value: val })
//     setCoverTillOpen(false)
//   }

//   const handlePayForSelect = (val: string) => {
//     const normalized = normalizePayFor(val)
//     dispatch({ type: 'SET_FIELD', field: 'payFor', value: normalized })
//     if (normalized === 'Single Pay') dispatch({ type: 'SET_FIELD', field: 'paymentMode', value: 'Single' })
//     setPayForOpen(false)
//   }

//   const handlePaymentModeSelect = (val: string) => {
//     dispatch({ type: 'SET_FIELD', field: 'paymentMode', value: val as any })
//     setPaymentModeOpen(false)
//   }

//   useEffect(() => {
//     setCustomLifeCover(filters.lifeCover)
//   }, [filters.lifeCover])

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//       {/* Plan header */}
//       <div className="flex items-center gap-3 mb-5">
//         <BrandMark name={plan.insurerName} />
//         <div>
//           <p className="text-xs text-gray-400">{plan.insurerName}</p>
//           <p className="text-base font-extrabold text-navy">{plan.planName}</p>
//         </div>
//         {plan.partnerBadge && (
//           <span className="ml-auto rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold text-brand">
//             {plan.partnerBadge}
//           </span>
//         )}
//       </div>

//       <div className="mb-5 space-y-3">
//         <div className="relative" ref={lifeCoverRef}>
//           <p className="text-xs font-bold text-navy mb-2">Life Cover</p>
//           <button onClick={() => setLifeCoverOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
//             <span>Life Cover {filters.lifeCover}</span>
//             <ChevronDown className={`h-4 w-4 transition-transform ${lifeCoverOpen ? 'rotate-180' : ''}`} />
//           </button>
//           <FilterPickerPopover
//             isOpen={lifeCoverOpen}
//             onClose={() => setLifeCoverOpen(false)}
//             title="Select life cover"
//             leftList={lifeCoverOptions}
//             currentValue={filters.lifeCover}
//             onSelectLeft={handleLifeCoverSelect}
//             rightPanel={
//               <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Recommended Life Cover</p>
//                 <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
//                   <p className="text-[11px] text-gray-500">Based on your profile</p>
//                   <p className="mt-1 text-2xl font-bold text-navy">{filters.lifeCover}</p>
//                 </div>
//                 <div className="mt-3 rounded-xl border border-brand/10 bg-brand/5 p-3 text-[12px] text-brand">
//                   A higher life cover can better support your family’s long-term obligations.
//                 </div>
//                 <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
//                   <span className="text-[11px] font-semibold text-gray-500">Enter Desired</span>
//                   <input value={customLifeCover} onChange={(e) => setCustomLifeCover(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-semibold text-navy outline-none" placeholder="₹ 20,00,000" />
//                   <button onClick={handleCustomLifeCoverApply} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">→</button>
//                 </div>
//               </div>
//             }
//           />
//         </div>

//         <div className="relative" ref={coverTillRef}>
//           <p className="text-xs font-bold text-navy mb-2">Cover Till Age</p>
//           <button onClick={() => setCoverTillOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
//             <span>Cover Till Age {filters.coverTillAge}</span>
//             <ChevronDown className={`h-4 w-4 transition-transform ${coverTillOpen ? 'rotate-180' : ''}`} />
//           </button>
//           <FilterPickerPopover
//             isOpen={coverTillOpen}
//             onClose={() => setCoverTillOpen(false)}
//             title="Select cover till age"
//             leftList={coverTillOptions}
//             currentValue={filters.coverTillAge}
//             onSelectLeft={handleCoverTillSelect}
//             variant="dropdown"
//           />
//         </div>

//         <div className="relative" ref={payForRef}>
//           <p className="text-xs font-bold text-navy mb-2">Pay For</p>
//           <button onClick={() => setPayForOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
//             <span>Pay For {filters.payFor === 'Single Pay' ? 'One Time' : filters.payFor}</span>
//             <ChevronDown className={`h-4 w-4 transition-transform ${payForOpen ? 'rotate-180' : ''}`} />
//           </button>
//           <FilterPickerPopover
//             isOpen={payForOpen}
//             onClose={() => setPayForOpen(false)}
//             title="Select pay for"
//             leftList={payForOptions}
//             currentValue={filters.payFor === 'Single Pay' ? 'One Time' : filters.payFor}
//             onSelectLeft={handlePayForSelect}
//             variant="dropdown"
//           />
//         </div>

//         <div className="relative" ref={paymentModeRef}>
//           <p className="text-xs font-bold text-navy mb-2">Premium Payment Mode</p>
//           <button onClick={() => setPaymentModeOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
//             <span>Mode {filters.paymentMode}</span>
//             <ChevronDown className={`h-4 w-4 transition-transform ${paymentModeOpen ? 'rotate-180' : ''}`} />
//           </button>
//           <FilterPickerPopover
//             isOpen={paymentModeOpen}
//             onClose={() => setPaymentModeOpen(false)}
//             title="Select payment mode"
//             leftList={paymentModeOptions}
//             currentValue={filters.paymentMode}
//             onSelectLeft={handlePaymentModeSelect}
//             variant="dropdown"
//           />
//         </div>
//       </div>

//       {/* Key Benefits */}
//       <div>
//         <p className="text-xs font-bold text-navy mb-3">Key Benefits</p>
//         <div className="space-y-2.5">
//           {displayedBenefits.map((b, i) => {
//             const Icon = resolveIcon(b.icon)
//             return (
//               <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
//                   <Icon className="h-4 w-4 text-brand" />
//                 </div>
//                 <div>
//                   <p className="text-[12px] font-bold text-navy">{b.title}</p>
//                   <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{b.description}</p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//         {plan.benefitsList.length > 3 && (
//           <button
//             onClick={() => setExpandBenefits(!expandBenefits)}
//             className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline"
//           >
//             {expandBenefits ? 'Show less' : `View all ${plan.benefitsList.length} benefits`}
//             <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandBenefits ? 'rotate-180' : ''}`} />
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// /* ────────────────────────────────────────────
//    Your Details Form
//    ──────────────────────────────────────────── */
// function YourDetailsForm() {
//   const { profile } = useUserProfile()
//   const [formData, setFormData] = useState({
//     name: profile.name || '',
//     dob: profile.dob || '',
//     mobile: profile.mobile || '',
//     email: profile.email || '',
//     smoker: profile.smoker === 'yes' ? 'yes' : 'no',
//   })

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//       <h3 className="text-sm font-bold text-navy mb-4">Your Details</h3>
//       <div className="space-y-3">
//         <div>
//           <label className="text-[11px] font-medium text-gray-500 mb-1 block">Full Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] text-navy focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
//             placeholder="Enter your full name"
//           />
//         </div>
//         <div>
//           <label className="text-[11px] font-medium text-gray-500 mb-1 block">Date of Birth</label>
//           <input
//             type="date"
//             value={formData.dob}
//             onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
//             className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] text-navy focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
//           />
//         </div>
//         <div>
//           <label className="text-[11px] font-medium text-gray-500 mb-1 block">Mobile Number</label>
//           <input
//             type="tel"
//             value={formData.mobile}
//             onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//             className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] text-navy focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
//             placeholder="Enter mobile number"
//           />
//         </div>
//         <div>
//           <label className="text-[11px] font-medium text-gray-500 mb-1 block">Email</label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] text-navy focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
//             placeholder="Enter email address"
//           />
//         </div>
//         <div>
//           <label className="text-[11px] font-medium text-gray-500 mb-1 block">Do you smoke?</label>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setFormData({ ...formData, smoker: 'no' })}
//               className={`flex-1 rounded-lg border py-2.5 text-[12px] font-medium transition-all ${
//                 formData.smoker === 'no'
//                   ? 'border-brand bg-brand/5 text-brand'
//                   : 'border-gray-200 text-navy hover:border-gray-300'
//               }`}
//             >
//               No
//             </button>
//             <button
//               onClick={() => setFormData({ ...formData, smoker: 'yes' })}
//               className={`flex-1 rounded-lg border py-2.5 text-[12px] font-medium transition-all ${
//                 formData.smoker === 'yes'
//                   ? 'border-brand bg-brand/5 text-brand'
//                   : 'border-gray-200 text-navy hover:border-gray-300'
//               }`}
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ────────────────────────────────────────────
//    Boundary Condition Card
//    ──────────────────────────────────────────── */
// function BoundaryConditionCard({ plan }: { plan: MockPlan }) {
//   const { filters } = useFilters()
//   const monthly = calculatePremium({
//     basePremiumPerLakh: plan.basePremiumPerLakh,
//     lifeCover: filters.lifeCover,
//     coverTillAge: filters.coverTillAge,
//     payFor: filters.payFor,
//     paymentMode: 'Monthly',
//   })
//   const halfYearly = calculatePremium({
//     basePremiumPerLakh: plan.basePremiumPerLakh,
//     lifeCover: filters.lifeCover,
//     coverTillAge: filters.coverTillAge,
//     payFor: filters.payFor,
//     paymentMode: 'Half Yearly',
//   })
//   const yearly = calculatePremium({
//     basePremiumPerLakh: plan.basePremiumPerLakh,
//     lifeCover: filters.lifeCover,
//     coverTillAge: filters.coverTillAge,
//     payFor: filters.payFor,
//     paymentMode: 'Yearly',
//   })

//   const cards = [
//     { label: 'Life Cover Amount', icon: Umbrella, min: `Minimum: ${plan.boundaryConditions[0]?.min || '₹10 Lacs'}`, max: `Maximum: ${plan.boundaryConditions[0]?.max || '₹25 Lacs'}` },
//     { label: 'Cover yourself Till Age', icon: CalendarClock, min: `Minimum: 42 Years (Policy Term 5 Years)`, max: `Maximum: 70 Years (Policy Term 33 Years)` },
//     { label: 'Frequency of payment', icon: Layers, min: `Monthly ₹${monthly.toLocaleString('en-IN')}`, max: `Half Yearly ₹${halfYearly.toLocaleString('en-IN')}`, extra: `Yearly ₹${yearly.toLocaleString('en-IN')}` },
//   ]

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//       <h3 className="text-sm font-bold text-navy mb-4">Boundary Conditions</h3>
//       <div className="grid gap-3 md:grid-cols-3">
//         {cards.map((card) => {
//           const Icon = card.icon
//           return (
//             <div key={card.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
//               <div className="flex items-center gap-2">
//                 <div className="rounded-full bg-brand/10 p-2 text-brand"><Icon className="h-4 w-4" /></div>
//                 <p className="text-[12px] font-bold text-navy">{card.label}</p>
//               </div>
//               <div className="mt-4 space-y-2 text-[12px] text-gray-600">
//                 <p>{card.min}</p>
//                 <p>{card.max}</p>
//                 {card.extra && <p>{card.extra}</p>}
//               </div>
//             </div>
//           )
//         })}
//       </div>
//       <p className="mt-4 text-[11px] text-gray-500">{plan.fullRefund ? 'Easy Refund Policy' : 'Flexible refund policy'} <span className="font-semibold text-brand">*</span></p>
//     </div>
//   )
// }

// /* ────────────────────────────────────────────
//    Sticky Premium Footer
//    ──────────────────────────────────────────── */
// function StickyPremiumFooter({ plan }: { plan: MockPlan }) {
//   const { filters } = useFilters()
//   const premium = calculatePremium({
//     basePremiumPerLakh: plan.basePremiumPerLakh,
//     lifeCover: filters.lifeCover,
//     coverTillAge: filters.coverTillAge,
//     payFor: filters.payFor,
//     paymentMode: filters.paymentMode,
//   })
//   const period = filters.paymentMode === 'Monthly' ? '/month' : filters.paymentMode === 'Half Yearly' ? '/half year' : '/year'

//   return (
//     <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-4">
//           <BrandMark name={plan.insurerName} />
//           <div>
//             <p className="text-xs text-gray-400">{plan.insurerName}</p>
//             <p className="text-sm font-bold text-navy">{plan.planName}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="text-right">
//             <div className="flex items-center gap-1">
//               <p className="text-2xl font-extrabold text-brand">₹{premium.toLocaleString('en-IN')}</p>
//               <Info className="h-4 w-4 text-gray-400" />
//             </div>
//             <p className="text-[11px] text-gray-400">{period}</p>
//           </div>
//           <button className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 transition-colors">
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// /* ────────────────────────────────────────────
//    Main Plan Detail Page
//    ──────────────────────────────────────────── */
// export default function PlanDetailPage() {
//   const { planId } = useParams<{ planId: string }>()
//   const { profile } = useUserProfile()
//   const { dispatch } = useFilters()
//   const [showEditDrawer, setShowEditDrawer] = useState(false)
//   const [showCallbackModal, setShowCallbackModal] = useState(false)
//   const [toast, setToast] = useState<string | null>(null)
//   const refundRef = useRef<HTMLParagraphElement>(null)
//   const plan = mockPlans.find((p) => p.id === planId)

//   useEffect(() => {
//     if (!toast) return
//     const timer = window.setTimeout(() => setToast(null), 3000)
//     return () => window.clearTimeout(timer)
//   }, [toast])

//   if (!plan) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg font-bold text-navy mb-2">Plan not found</p>
//           <Link to="/quotes" className="text-sm font-semibold text-brand hover:underline">
//             ← Back to quotes
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">
//       {/* Header */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
//         <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
//           <Link
//             to="/quotes"
//             className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5 text-navy" />
//           </Link>
//           <div className="flex items-center gap-3">
//             <BrandMark name={plan.insurerName} />
//             <div>
//               <p className="text-xs text-gray-400">{plan.insurerName}</p>
//               <p className="text-sm font-bold text-navy">{plan.planName}</p>
//             </div>
//           </div>
//           {plan.partnerBadge && (
//             <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold text-brand">
//               {plan.partnerBadge}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="border-b border-gray-200 bg-white">
//         <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
//           <div className="flex flex-wrap items-center gap-3 text-[12px] text-navy">
//             <span className="rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand">Male</span>
//             <span className="text-gray-500">DOB: {profile.dob || '12/08/1988'}</span>
//             <span className="text-gray-500">Non Smoker</span>
//             <span className="text-gray-500">******9007</span>
//             <button onClick={() => setShowEditDrawer(true)} className="font-semibold text-brand">EDIT</button>
//           </div>
//           <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-brand">
//             <button onClick={() => setToast('Brochure download coming soon')} className="flex items-center gap-1 hover:underline"><Download className="h-3.5 w-3.5" /> Download Brochure</button>
//             <button onClick={() => setShowCallbackModal(true)} className="flex items-center gap-1 hover:underline"><Headphones className="h-3.5 w-3.5" /> Talk to an Expert</button>
//             <button className="rounded-full border border-brand px-3 py-1.5 hover:bg-brand/5">📋 Know Your Plan in 2 mins</button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="mx-auto max-w-7xl px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
//           {/* Left Column — Config + Benefits */}
//           <div className="space-y-4">
//             <PlanConfigCard plan={plan} />
//             <BoundaryConditionCard plan={plan} />
//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <h3 className="text-sm font-bold text-navy">Number of years you can pay for</h3>
//               <div className="mt-4 grid gap-3 md:grid-cols-3">
//                 {plan.payForOptions.map((opt) => {
//                   const mappedValue = opt.title === 'Single Pay' ? 'Single Pay' : opt.title === 'Regular Pay' ? 'Regular Pay' : 'Limited Pay'
//                   return (
//                     <button key={opt.title} onClick={() => dispatch({ type: 'SET_FIELD', field: 'payFor', value: mappedValue })} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
//                       <p className="text-[12px] font-bold text-navy">{opt.title}</p>
//                       <p className="mt-2 text-[11px] text-gray-500">{opt.description}</p>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>
//             <p ref={refundRef} id="refund-policy" className="text-[11px] leading-6 text-gray-500">
//               Refunds are governed by insurer terms. If your case is eligible, a refund request can be initiated within the cooling-off period and subject to applicable deductions.
//             </p>
//           </div>

//           {/* Right Column — Your Details */}
//           <div>
//             <div className="sticky top-[120px]">
//               <YourDetailsForm />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sticky Footer */}
//       <StickyPremiumFooter plan={plan} />

//       <EditProfileDrawer isOpen={showEditDrawer} onClose={() => setShowEditDrawer(false)} />

//       <AnimatePresence>
//         {showCallbackModal && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
//             <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-bold text-navy">Request a callback</h3>
//                 <button onClick={() => setShowCallbackModal(false)} className="text-gray-500">✕</button>
//               </div>
//               <p className="mt-3 text-sm text-gray-500">An expert will contact you shortly to explain the plan and help with your purchase.</p>
//               <button onClick={() => { setShowCallbackModal(false); setToast('Callback request received') }} className="mt-5 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white">Request callback</button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {toast && (
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-4 z-[70] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
//             <p className="text-sm font-semibold text-navy">{toast}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <SiteFooter />
//     </div>
//   )
// }
import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Shield, Heart, TrendingUp, Umbrella, CalendarClock,
  Layers, Calendar, HandCoins, Wallet, ChevronDown, Info, AlertCircle, Download, Headphones,
  Star, CheckCircle, ThumbsUp
} from 'lucide-react'
import { useUserProfile } from '../context/UserProfileContext'
import { useFilters } from '../context/FiltersContext'
import { mockPlans, type MockPlan } from '../data/mockPlans'
import BrandMark from '../components/common/BrandMark'
import FilterPickerPopover from '../components/common/FilterPickerPopover'
import SiteFooter from '../components/common/SiteFooter'
import EditProfileDrawer from '../components/drawers/EditProfileDrawer'
import { calculatePremium } from '../lib/premium'

/* ────────────────────────────────────────────
   Icon resolver
   ──────────────────────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  TrendingUp: TrendingUp,
  Shield: Shield,
  Heart: Heart,
  Umbrella: Umbrella,
  CalendarClock: CalendarClock,
  Layers: Layers,
  Calendar: Calendar,
  HandCoins: HandCoins,
  Wallet: Wallet,
  Star: Star,
  CheckCircle: CheckCircle,
  Info: Info,
  AlertCircle: AlertCircle,
}

function resolveIcon(name: string) {
  return iconMap[name] || Shield
}

/* ────────────────────────────────────────────
   Shared small helpers
   ──────────────────────────────────────────── */
const inputClass =
  'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13px] text-navy focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */
type Stage = 'personal' | 'address' | 'upgrade' | 'addons'
type RiderId = 'accidental' | 'waiver' | 'critical'
const stageOrder: Stage[] = ['personal', 'address', 'upgrade', 'addons']

interface FormDataShape {
  name: string
  email: string
  occupation: string
  annualIncome: string
  education: string
  discountChoice: 'lifetime' | 'firstYear' | ''
  pincode: string
  city: string
  nationality: string
  maritalStatus: string
  existingCustomer: 'yes' | 'no' | ''
  hdfcGroup: string
  dob?: string
  mobile?: string
}

const riderDefaults: Record<
  RiderId,
  {
    title: string
    description: string
    listLink?: string
    additionalPremium: number
    policyTerm: string
    payFor?: string
    coverOptions?: string[]
    recommended: string
    badge?: string
  }
> = {
  accidental: {
    title: 'Accidental Death Benefit',
    description: 'In case of accidental death, this cover value will be paid in addition to the life cover.',
    additionalPremium: 178,
    policyTerm: '26 Years',
    coverOptions: ['5 Lacs', '10 Lacs', '15 Lacs', '20 Lacs', '25 Lacs', '30 Lacs'],
    recommended: 'Recommended for people who travel regularly',
  },
  waiver: {
    title: 'Waiver of Premium on Critical Illness',
    description:
      'In case of diagnosis of any of the critical illnesses listed, future premiums will be waived off & life cover will continue as usual.',
    listLink: 'List of 60 critical illnesses',
    additionalPremium: 15,
    policyTerm: '26 Years',
    payFor: '26 Years',
    recommended: "Recommended for people who don't have a health insurance",
    badge: '37% People Choose this option',
  },
  critical: {
    title: 'Critical Illness Benefit',
    description: 'Pays you an additional lumpsum amount if you are diagnosed with a Critical Illness.',
    listLink: 'List of 60 critical illnesses',
    additionalPremium: 51,
    policyTerm: '26 Years',
    coverOptions: ['3 Lacs', '5 Lacs', '10 Lacs', '15 Lacs', '25 Lacs'],
    recommended: '',
  },
}

/* ────────────────────────────────────────────
   Stage breadcrumb
   ──────────────────────────────────────────── */
function StageBreadcrumb({ stage }: { stage: Stage }) {
  const steps: { key: Stage[]; label: string }[] = [
    { key: ['personal', 'address'], label: 'Your Details' },
    { key: ['upgrade'], label: 'Upgrade Your Plan' },
    { key: ['addons'], label: 'Add-On Riders' },
  ]
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 text-[13px]">
        {steps.map((s, i) => {
          const active = s.key.includes(stage)
          return (
            <div key={s.label} className="flex items-center gap-3">
              {i > 0 && <span className="h-px w-10 bg-gray-200" />}
              <span className={active ? 'font-bold text-navy' : 'text-gray-400'}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Plan Config Card (unchanged)
   ──────────────────────────────────────────── */
function PlanConfigCard({ plan }: { plan: MockPlan }) {
  const { filters, dispatch } = useFilters()
  const [expandBenefits, setExpandBenefits] = useState(false)
  const [lifeCoverOpen, setLifeCoverOpen] = useState(false)
  const [coverTillOpen, setCoverTillOpen] = useState(false)
  const [payForOpen, setPayForOpen] = useState(false)
  const [paymentModeOpen, setPaymentModeOpen] = useState(false)
  const [customLifeCover, setCustomLifeCover] = useState(filters.lifeCover)
  const lifeCoverRef = useRef<HTMLDivElement>(null)
  const coverTillRef = useRef<HTMLDivElement>(null)
  const payForRef = useRef<HTMLDivElement>(null)
  const paymentModeRef = useRef<HTMLDivElement>(null)

  const displayedBenefits = expandBenefits ? plan.benefitsList : plan.benefitsList.slice(0, 3)

  const lifeCoverOptions = ['10 Lacs', '15 Lacs', '20 Lacs', '25 Lacs', '30 Lacs', '40 Lacs', '50 Lacs', '75 Lacs', '1 Crore']
  const coverTillOptions = Array.from({ length: 29 }, (_, i) => `${42 + i} Years`)
  const payForOptions = ['One Time', '5 Years', '10 Years', '15 Years', '20 Years', '25 Years', '30 Years']
  const paymentModeOptions = filters.payFor === 'Single Pay' ? ['Single', 'Yearly', 'Half Yearly', 'Monthly'] : ['Yearly', 'Half Yearly', 'Monthly']

  const normalizePayFor = (value: string) => {
    if (value === 'One Time') return 'Single Pay'
    if (value === '5 Years' || value === '10 Years' || value === '15 Years' || value === '20 Years' || value === '25 Years' || value === '30 Years') return 'Limited Pay'
    return 'Regular Pay'
  }

  const handleLifeCoverSelect = (val: string) => {
    dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: val })
    setLifeCoverOpen(false)
  }

  const handleCustomLifeCoverApply = () => {
    const formatted = customLifeCover.trim()
    if (formatted) {
      dispatch({ type: 'SET_FIELD', field: 'lifeCover', value: formatted })
      setLifeCoverOpen(false)
    }
  }

  const handleCoverTillSelect = (val: string) => {
    dispatch({ type: 'SET_FIELD', field: 'coverTillAge', value: val })
    setCoverTillOpen(false)
  }

  const handlePayForSelect = (val: string) => {
    const normalized = normalizePayFor(val)
    dispatch({ type: 'SET_FIELD', field: 'payFor', value: normalized })
    if (normalized === 'Single Pay') dispatch({ type: 'SET_FIELD', field: 'paymentMode', value: 'Single' })
    setPayForOpen(false)
  }

  const handlePaymentModeSelect = (val: string) => {
    dispatch({ type: 'SET_FIELD', field: 'paymentMode', value: val as any })
    setPaymentModeOpen(false)
  }

  useEffect(() => {
    setCustomLifeCover(filters.lifeCover)
  }, [filters.lifeCover])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <BrandMark name={plan.insurerName} />
        <div>
          <p className="text-xs text-gray-400">{plan.insurerName}</p>
          <p className="text-base font-extrabold text-navy">{plan.planName}</p>
        </div>
        {plan.partnerBadge && (
          <span className="ml-auto rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold text-brand">
            {plan.partnerBadge}
          </span>
        )}
      </div>

      <div className="mb-5 space-y-3">
        <div className="relative" ref={lifeCoverRef}>
          <p className="text-xs font-bold text-navy mb-2">Life Cover</p>
          <button onClick={() => setLifeCoverOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
            <span>Life Cover {filters.lifeCover}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${lifeCoverOpen ? 'rotate-180' : ''}`} />
          </button>
          <FilterPickerPopover
            isOpen={lifeCoverOpen}
            onClose={() => setLifeCoverOpen(false)}
            title="Select life cover"
            leftList={lifeCoverOptions}
            currentValue={filters.lifeCover}
            onSelectLeft={handleLifeCoverSelect}
            rightPanel={
              <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Recommended Life Cover</p>
                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-500">Based on your profile</p>
                  <p className="mt-1 text-2xl font-bold text-navy">{filters.lifeCover}</p>
                </div>
                <div className="mt-3 rounded-xl border border-brand/10 bg-brand/5 p-3 text-[12px] text-brand">
                  A higher life cover can better support your family’s long-term obligations.
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                  <span className="text-[11px] font-semibold text-gray-500">Enter Desired</span>
                  <input value={customLifeCover} onChange={(e) => setCustomLifeCover(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-semibold text-navy outline-none" placeholder="₹ 20,00,000" />
                  <button onClick={handleCustomLifeCoverApply} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">→</button>
                </div>
              </div>
            }
          />
        </div>

        <div className="relative" ref={coverTillRef}>
          <p className="text-xs font-bold text-navy mb-2">Cover Till Age</p>
          <button onClick={() => setCoverTillOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
            <span>Cover Till Age {filters.coverTillAge}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${coverTillOpen ? 'rotate-180' : ''}`} />
          </button>
          <FilterPickerPopover
            isOpen={coverTillOpen}
            onClose={() => setCoverTillOpen(false)}
            title="Select cover till age"
            leftList={coverTillOptions}
            currentValue={filters.coverTillAge}
            onSelectLeft={handleCoverTillSelect}
            variant="dropdown"
          />
        </div>

        <div className="relative" ref={payForRef}>
          <p className="text-xs font-bold text-navy mb-2">Pay For</p>
          <button onClick={() => setPayForOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
            <span>Pay For {filters.payFor === 'Single Pay' ? 'One Time' : filters.payFor}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${payForOpen ? 'rotate-180' : ''}`} />
          </button>
          <FilterPickerPopover
            isOpen={payForOpen}
            onClose={() => setPayForOpen(false)}
            title="Select pay for"
            leftList={payForOptions}
            currentValue={filters.payFor === 'Single Pay' ? 'One Time' : filters.payFor}
            onSelectLeft={handlePayForSelect}
            variant="dropdown"
          />
        </div>

        <div className="relative" ref={paymentModeRef}>
          <p className="text-xs font-bold text-navy mb-2">Premium Payment Mode</p>
          <button onClick={() => setPaymentModeOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-navy">
            <span>Mode {filters.paymentMode}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${paymentModeOpen ? 'rotate-180' : ''}`} />
          </button>
          <FilterPickerPopover
            isOpen={paymentModeOpen}
            onClose={() => setPaymentModeOpen(false)}
            title="Select payment mode"
            leftList={paymentModeOptions}
            currentValue={filters.paymentMode}
            onSelectLeft={handlePaymentModeSelect}
            variant="dropdown"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-navy mb-3">Key Benefits</p>
        <div className="space-y-2.5">
          {displayedBenefits.map((b, i) => {
            const Icon = resolveIcon(b.icon)
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-navy">{b.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{b.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        {plan.benefitsList.length > 3 && (
          <button
            onClick={() => setExpandBenefits(!expandBenefits)}
            className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline"
          >
            {expandBenefits ? 'Show less' : `View all ${plan.benefitsList.length} benefits`}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandBenefits ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   STEP 1a — Personal Details
   ──────────────────────────────────────────── */
function PersonalDetailsStep({ formData, onChange }: { formData: FormDataShape; onChange: (patch: Partial<FormDataShape>) => void }) {
  const incomeInCrores = formData.annualIncome ? (Number(formData.annualIncome) / 10000000).toFixed(2) : '0.00'

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-navy mb-4">Your Details</h3>
      <div className="space-y-4">
        <Field label="Full Name as per your ID Proof">
          <input value={formData.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClass} placeholder="Enter your full name" />
        </Field>

        <Field label="Email Address">
          <input type="email" value={formData.email} onChange={(e) => onChange({ email: e.target.value })} className={inputClass} placeholder="Enter your email" />
        </Field>

        <Field label="Occupation">
          <select value={formData.occupation} onChange={(e) => onChange({ occupation: e.target.value })} className={inputClass}>
            <option value="">Select occupation</option>
            <option>Armed Forces</option>
            <option>Salaried</option>
            <option>Self Employed / Business</option>
            <option>Agriculture</option>
          </select>
          <p className="mt-1.5 text-[11px] text-gray-400">6 months bank statement showing salary credit will be required for issuance of the policy</p>
        </Field>

        <Field label="Annual Income">
          <div className="flex items-center gap-3">
            <input type="number" value={formData.annualIncome} onChange={(e) => onChange({ annualIncome: e.target.value })} className={inputClass} placeholder="₹ Enter annual income" />
            <span className="whitespace-nowrap text-[12px] font-semibold text-gray-400">{incomeInCrores} Crores</span>
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">Please do not include Rental property income/income received from interest from bank deposits/dividends/any other investments</p>
        </Field>

        <Field label="Education">
          <select value={formData.education} onChange={(e) => onChange({ education: e.target.value })} className={inputClass}>
            <option value="">Select education</option>
            <option>SSC(10th Pass)</option>
            <option>HSC(12th Pass)</option>
            <option>Diploma</option>
            <option>Graduate</option>
            <option>Post Graduate & above</option>
          </select>
        </Field>

        <div>
          <p className="text-[12px] font-semibold text-navy mb-2">Switch from 15% 1st yr discount to 1.50% lifetime discount for 26 years?</p>
          <div className="space-y-2">
            <label className={`flex items-center gap-2 rounded-lg border p-3 text-[12px] ${formData.discountChoice === 'lifetime' ? 'border-brand bg-brand/5' : 'border-gray-200'}`}>
              <input type="radio" name="discount" checked={formData.discountChoice === 'lifetime'} onChange={() => onChange({ discountChoice: 'lifetime' })} className="h-4 w-4 accent-brand" />
              Yes, Proceed with Lifetime Discount
            </label>
            <label className={`flex items-center gap-2 rounded-lg border p-3 text-[12px] ${formData.discountChoice === 'firstYear' ? 'border-brand bg-brand/5' : 'border-gray-200'}`}>
              <input type="radio" name="discount" checked={formData.discountChoice === 'firstYear'} onChange={() => onChange({ discountChoice: 'firstYear' })} className="h-4 w-4 accent-brand" />
              No, I want to opt for 1st yr discount
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   STEP 1b — Address & Other Details
   ──────────────────────────────────────────── */
function AddressDetailsStep({
  formData,
  onChange,
  insurerName,
}: {
  formData: FormDataShape
  onChange: (patch: Partial<FormDataShape>) => void
  insurerName: string
}) {
  const [groupOpen, setGroupOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-navy mb-4">Address & Other Details</h3>
      <div className="space-y-4">
        <Field label="Pincode">
          <input value={formData.pincode} onChange={(e) => onChange({ pincode: e.target.value })} className={inputClass} placeholder="Enter pincode" />
          <p className="mt-1.5 text-[11px] text-gray-400">Please enter the pincode of your current residential address</p>
        </Field>

        <Field label="City">
          <input value={formData.city} onChange={(e) => onChange({ city: e.target.value })} className={inputClass} placeholder="Enter city" />
          <p className="mt-1.5 text-[11px] text-gray-400">Please enter the city of your current residential address</p>
        </Field>

        <Field label="Nationality">
          <select value={formData.nationality} onChange={(e) => onChange({ nationality: e.target.value })} className={inputClass}>
            <option>Resident Indian</option>
            <option>NRI</option>
            <option>Foreign National</option>
          </select>
        </Field>

        <Field label="Marital Status">
          <select value={formData.maritalStatus} onChange={(e) => onChange({ maritalStatus: e.target.value })} className={inputClass}>
            <option value="">Select status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </Field>

        <div>
          <p className="text-[11px] font-medium text-gray-500 mb-1.5">Are you an existing {insurerName} customer?</p>
          <div className="flex gap-2">
            {(['yes', 'no'] as const).map((val) => (
              <button
                key={val}
                onClick={() => onChange({ existingCustomer: val })}
                className={`flex-1 rounded-lg border py-2.5 text-[12px] font-medium transition-all ${
                  formData.existingCustomer === val ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 text-navy hover:border-gray-300'
                }`}
              >
                {val === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-[11px] font-medium text-gray-500 mb-1.5">Are you part of {insurerName} Group?</p>
          <button onClick={() => setGroupOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3.5 py-2.5 text-left text-[13px] font-semibold text-navy">
            <span>{formData.hdfcGroup || `No, I am not associated with ${insurerName} Group`}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${groupOpen ? 'rotate-180' : ''}`} />
          </button>
          {groupOpen && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {[`I'm an ${insurerName} Group Employee`, `No, I am not associated with ${insurerName} Group`].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange({ hdfcGroup: opt })
                    setGroupOpen(false)
                  }}
                  className={`block w-full px-4 py-3 text-left text-[13px] ${formData.hdfcGroup === opt ? 'bg-brand text-white font-semibold' : 'text-navy hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   STEP 2 — Upgrade Your Plan (Benefit Payout)
   ──────────────────────────────────────────── */
function UpgradePlanStep({ premium }: { premium: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-navy">Benefit Payout to Nominee</p>
      <p className="mt-1 text-[12px] text-gray-500">In my absence my family will get</p>
      <label className="mt-4 flex items-center justify-between rounded-xl border border-brand bg-brand/5 p-4">
        <span className="flex items-center gap-3 text-[13px] font-semibold text-navy">
          <input type="radio" checked readOnly className="h-4 w-4 accent-brand" />
          ₹30 Lacs in single installment
          <Info className="h-3.5 w-3.5 text-gray-400" />
        </span>
      </label>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-[13px]">
        <span className="text-gray-500">Price</span>
        <span className="font-bold text-navy">
          ₹{premium.toLocaleString('en-IN')} <span className="font-normal text-gray-400">Monthly</span>
        </span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   STEP 3 — Add-On Riders
   ──────────────────────────────────────────── */
function RiderCard({
  id,
  def,
  added,
  onToggleAdd,
  cover,
  onCoverChange,
  boosterEnabled,
  onToggleBooster,
}: {
  id: RiderId
  def: (typeof riderDefaults)[RiderId]
  added: boolean
  onToggleAdd: () => void
  cover?: string
  onCoverChange?: (val: string) => void
  boosterEnabled?: boolean
  onToggleBooster?: () => void
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {id === 'accidental' && (
        <span className="mb-3 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white">
          Unlock Wellness Benefits!
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-navy">{def.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{def.description}</p>
          {def.listLink && (
            <a href="#" className="mt-1 inline-block text-[12px] font-semibold text-brand hover:underline">
              {def.listLink}
            </a>
          )}
        </div>
        <button
          onClick={onToggleAdd}
          className={`shrink-0 rounded-lg border px-4 py-2 text-[12px] font-bold ${added ? 'border-red-300 text-red-500' : 'border-brand text-brand'}`}
        >
          {added ? '− Remove' : '+ Add'}
        </button>
      </div>

      {added && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {def.coverOptions && (
              <div>
                <p className="text-[11px] text-gray-400">Cover Value</p>
                <select value={cover} onChange={(e) => onCoverChange?.(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-semibold text-navy outline-none">
                  {def.coverOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <p className="text-[11px] text-gray-400">Additional Premium</p>
              <p className="mt-1 text-sm font-bold text-navy">₹{def.additionalPremium} Monthly</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Policy Term</p>
              <p className="mt-1 text-sm font-bold text-navy">{def.policyTerm}</p>
            </div>
            {def.payFor && (
              <div>
                <p className="text-[11px] text-gray-400">Pay For</p>
                <p className="mt-1 text-sm font-bold text-navy">{def.payFor}</p>
              </div>
            )}
          </div>

          {id === 'accidental' && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-[12px] text-amber-800">
                <span className="mr-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Coverage Booster</span>
                Get additional <b>10 Lacs</b> cover in case of Accidents in select public transport
              </p>
              <button onClick={onToggleBooster} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${boosterEnabled ? 'bg-brand' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${boosterEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          )}
        </>
      )}

      {def.recommended && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[12px] text-blue-700">
          <ThumbsUp className="h-3.5 w-3.5 shrink-0" />
          {def.recommended}
          {def.badge && <span className="ml-auto rounded-full bg-white px-2 py-1 text-[10px] font-bold text-green-600 shadow-sm">{def.badge}</span>}
        </div>
      )}
    </div>
  )
}

function AddOnRidersStep({
  addedRiders,
  onToggleRider,
  riderCovers,
  onCoverChange,
  coverageBooster,
  onToggleBooster,
}: {
  addedRiders: Record<RiderId, boolean>
  onToggleRider: (id: RiderId) => void
  riderCovers: Record<RiderId, string>
  onCoverChange: (id: RiderId, val: string) => void
  coverageBooster: boolean
  onToggleBooster: () => void
}) {
  return (
    <div className="space-y-4">
      {(Object.keys(riderDefaults) as RiderId[]).map((id) => (
        <RiderCard
          key={id}
          id={id}
          def={riderDefaults[id]}
          added={addedRiders[id]}
          onToggleAdd={() => onToggleRider(id)}
          cover={riderCovers[id]}
          onCoverChange={(val) => onCoverChange(id, val)}
          boosterEnabled={coverageBooster}
          onToggleBooster={onToggleBooster}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   Boundary Condition Card (unchanged)
   ──────────────────────────────────────────── */
function BoundaryConditionCard({ plan }: { plan: MockPlan }) {
  const { filters } = useFilters()
  const monthly = calculatePremium({
    basePremiumPerLakh: plan.basePremiumPerLakh,
    lifeCover: filters.lifeCover,
    coverTillAge: filters.coverTillAge,
    payFor: filters.payFor,
    paymentMode: 'Monthly',
  })
  const halfYearly = calculatePremium({
    basePremiumPerLakh: plan.basePremiumPerLakh,
    lifeCover: filters.lifeCover,
    coverTillAge: filters.coverTillAge,
    payFor: filters.payFor,
    paymentMode: 'Half Yearly',
  })
  const yearly = calculatePremium({
    basePremiumPerLakh: plan.basePremiumPerLakh,
    lifeCover: filters.lifeCover,
    coverTillAge: filters.coverTillAge,
    payFor: filters.payFor,
    paymentMode: 'Yearly',
  })

  const cards = [
    { label: 'Life Cover Amount', icon: Umbrella, min: `Minimum: ${plan.boundaryConditions[0]?.min || '₹10 Lacs'}`, max: `Maximum: ${plan.boundaryConditions[0]?.max || '₹25 Lacs'}` },
    { label: 'Cover yourself Till Age', icon: CalendarClock, min: `Minimum: 42 Years (Policy Term 5 Years)`, max: `Maximum: 70 Years (Policy Term 33 Years)` },
    { label: 'Frequency of payment', icon: Layers, min: `Monthly ₹${monthly.toLocaleString('en-IN')}`, max: `Half Yearly ₹${halfYearly.toLocaleString('en-IN')}`, extra: `Yearly ₹${yearly.toLocaleString('en-IN')}` },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-navy mb-4">Boundary Conditions</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-brand/10 p-2 text-brand"><Icon className="h-4 w-4" /></div>
                <p className="text-[12px] font-bold text-navy">{card.label}</p>
              </div>
              <div className="mt-4 space-y-2 text-[12px] text-gray-600">
                <p>{card.min}</p>
                <p>{card.max}</p>
                {card.extra && <p>{card.extra}</p>}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-[11px] text-gray-500">{plan.fullRefund ? 'Easy Refund Policy' : 'Flexible refund policy'} <span className="font-semibold text-brand">*</span></p>
    </div>
  )
}

/* ────────────────────────────────────────────
   Sticky Premium Footer
   ──────────────────────────────────────────── */
function StickyPremiumFooter({
  plan,
  extra = 0,
  label,
  onClick,
  disabled,
}: {
  plan: MockPlan
  extra?: number
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  const { filters } = useFilters()
  const basePremium = calculatePremium({
    basePremiumPerLakh: plan.basePremiumPerLakh,
    lifeCover: filters.lifeCover,
    coverTillAge: filters.coverTillAge,
    payFor: filters.payFor,
    paymentMode: filters.paymentMode,
  })
  const premium = basePremium + extra
  const period = filters.paymentMode === 'Monthly' ? '/month' : filters.paymentMode === 'Half Yearly' ? '/half year' : '/year'

  return (
    <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <BrandMark name={plan.insurerName} />
          <div>
            <p className="text-xs text-gray-400">{plan.insurerName}</p>
            <p className="text-sm font-bold text-navy">{plan.planName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-brand">₹{premium.toLocaleString('en-IN')}</p>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400">{period}</p>
          </div>
          <button
            onClick={onClick}
            disabled={disabled}
            className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {label}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Main Plan Detail Page
   ──────────────────────────────────────────── */
export default function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>()
  const { profile } = useUserProfile()
  const { filters } = useFilters()
  const navigate = useNavigate()
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [showCallbackModal, setShowCallbackModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const refundRef = useRef<HTMLParagraphElement>(null)
  const plan = mockPlans.find((p) => p.id === planId)

  const [stage, setStage] = useState<Stage>('personal')
  const [formData, setFormData] = useState<FormDataShape>({
    name: profile.name || '',
    email: profile.email || '',
    occupation: '',
    annualIncome: '',
    education: '',
    discountChoice: '',
    pincode: '',
    city: '',
    nationality: 'Resident Indian',
    maritalStatus: '',
    existingCustomer: '',
    hdfcGroup: '',
    dob: profile.dob || '',
    mobile: profile.mobile || '',
  })
  const [addedRiders, setAddedRiders] = useState<Record<RiderId, boolean>>({ accidental: false, waiver: false, critical: false })
  const [riderCovers, setRiderCovers] = useState<Record<RiderId, string>>({ accidental: '10 Lacs', waiver: '', critical: '5 Lacs' })
  const [coverageBooster, setCoverageBooster] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-navy mb-2">Plan not found</p>
          <Link to="/quotes" className="text-sm font-semibold text-brand hover:underline">
            ← Back to quotes
          </Link>
        </div>
      </div>
    )
  }

  const ridersTotal = (Object.keys(addedRiders) as RiderId[]).reduce(
    (sum, id) => (addedRiders[id] ? sum + riderDefaults[id].additionalPremium : sum),
    0
  )
  const basePremium = calculatePremium({
    basePremiumPerLakh: plan.basePremiumPerLakh,
    lifeCover: filters.lifeCover,
    coverTillAge: filters.coverTillAge,
    payFor: filters.payFor,
    paymentMode: filters.paymentMode,
  })
  const totalPremium = basePremium + ridersTotal

  const canProceed =
    stage === 'personal'
      ? formData.name.trim() !== '' && formData.email.trim() !== ''
      : stage === 'address'
      ? formData.pincode.trim() !== '' && formData.city.trim() !== ''
      : true

  const handleFormChange = (patch: Partial<FormDataShape>) => setFormData((prev) => ({ ...prev, ...patch }))
  const handleToggleRider = (id: RiderId) => setAddedRiders((prev) => ({ ...prev, [id]: !prev[id] }))
  const handleCoverChange = (id: RiderId, val: string) => setRiderCovers((prev) => ({ ...prev, [id]: val }))

  const handleFooterClick = () => {
    if (!canProceed) return
    if (stage === 'addons') {
      navigate(`/quotes/plan/${plan.id}/checkout`, {
        state: { plan, formData, addedRiders, riderCovers, coverageBooster, premium: totalPremium },
      })
      return
    }
    const idx = stageOrder.indexOf(stage)
    setStage(stageOrder[idx + 1])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link
            to="/quotes"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-navy" />
          </Link>
          <div className="flex items-center gap-3">
            <BrandMark name={plan.insurerName} />
            <div>
              <p className="text-xs text-gray-400">{plan.insurerName}</p>
              <p className="text-sm font-bold text-navy">{plan.planName}</p>
            </div>
          </div>
          {plan.partnerBadge && (
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold text-brand">
              {plan.partnerBadge}
            </span>
          )}
        </div>
      </div>

      <StageBreadcrumb stage={stage} />

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-navy">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand">Male</span>
            <span className="text-gray-500">DOB: {profile.dob || '12/08/1988'}</span>
            <span className="text-gray-500">Non Smoker</span>
            <span className="text-gray-500">******9007</span>
            <button onClick={() => setShowEditDrawer(true)} className="font-semibold text-brand">EDIT</button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-brand">
            <button onClick={() => setToast('Brochure download coming soon')} className="flex items-center gap-1 hover:underline"><Download className="h-3.5 w-3.5" /> Download Brochure</button>
            <button onClick={() => setShowCallbackModal(true)} className="flex items-center gap-1 hover:underline"><Headphones className="h-3.5 w-3.5" /> Talk to an Expert</button>
            <button className="rounded-full border border-brand px-3 py-1.5 hover:bg-brand/5">📋 Know Your Plan in 2 mins</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <PlanConfigCard plan={plan} />
            <BoundaryConditionCard plan={plan} />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-navy">Number of years you can pay for</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {plan.payForOptions.map((opt) => {
                  return (
                    <div key={opt.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
                      <p className="text-[12px] font-bold text-navy">{opt.title}</p>
                      <p className="mt-2 text-[11px] text-gray-500">{opt.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <p ref={refundRef} id="refund-policy" className="text-[11px] leading-6 text-gray-500">
              Refunds are governed by insurer terms. If your case is eligible, a refund request can be initiated within the cooling-off period and subject to applicable deductions.
            </p>
          </div>

          {/* Right Column — Stage content */}
          <div>
            <div className="space-y-4">
              {stage === 'personal' && <PersonalDetailsStep formData={formData} onChange={handleFormChange} />}
              {stage === 'address' && <AddressDetailsStep formData={formData} onChange={handleFormChange} insurerName={plan.insurerName} />}
              {stage === 'upgrade' && <UpgradePlanStep premium={totalPremium} />}
              {stage === 'addons' && (
                <AddOnRidersStep
                  addedRiders={addedRiders}
                  onToggleRider={handleToggleRider}
                  riderCovers={riderCovers}
                  onCoverChange={handleCoverChange}
                  coverageBooster={coverageBooster}
                  onToggleBooster={() => setCoverageBooster((v) => !v)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <StickyPremiumFooter
        plan={plan}
        extra={ridersTotal}
        label={stage === 'addons' ? 'Review Details' : 'Proceed'}
        onClick={handleFooterClick}
        disabled={!canProceed}
      />

      <EditProfileDrawer isOpen={showEditDrawer} onClose={() => setShowEditDrawer(false)} />

      <AnimatePresence>
        {showCallbackModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-navy">Request a callback</h3>
                <button onClick={() => setShowCallbackModal(false)} className="text-gray-500">✕</button>
              </div>
              <p className="mt-3 text-sm text-gray-500">An expert will contact you shortly to explain the plan and help with your purchase.</p>
              <button onClick={() => { setShowCallbackModal(false); setToast('Callback request received') }} className="mt-5 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white">Request callback</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-4 z-[70] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-navy">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  )
}