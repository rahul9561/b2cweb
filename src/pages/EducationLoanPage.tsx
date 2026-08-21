import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  Check,
  Clock3,
  FileText,
  FileCheck2,
  Globe2,
  GraduationCap,
  Headset,
  Landmark,
  LockKeyhole,
  MapPin,
  UserRound,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
  XCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OTPModal from '../components/OTPModal'
import educationLoanHero from '../assets/images/education-loan-hero.png'
import './EducationLoanPage.css'

type LoanType = 'domestic' | 'abroad'
type Step = 1 | 2 | 3 | 4 | 5

type BasicDetails = {
  applicantName: string
  mobile: string
  email: string
  pan: string
  qualification: string
  loanAmount: string
  course: string
  country: string
  gender: string
  maritalStatus: string
}

type StudentDetails = {
  offerLetterStatus: string
  fatherMobile: string
  fatherEmail: string
  motherMobile: string
  motherEmail: string
  grandmotherName: string
  grannyName: string
  reference1Name: string
  reference1Mobile: string
  reference1Email: string
  reference1Address: string
  reference2Name: string
  reference2Mobile: string
  reference2Email: string
  reference2Address: string
}

type PropertyDetails = {
  loanSecurity: 'secured' | 'unsecured' | ''
  ownerName: string
  ownerFatherName: string
  propertyType: string
  area: string
  valuation: string
  remark: string
  hasExistingLoan: boolean
  loanDetails: string
}

type FileKey =
  | 'tenthMarksheet'
  | 'twelfthMarksheet'
  | 'offerLetter'
  | 'studentPhoto'
  | 'aadhaarCard'
  | 'aadhaarBack'
  | 'panCardFront'
  | 'panCardBack'
  | 'passportFront'
  | 'addressProof'
  | 'fatherPhoto'
  | 'fatherAadhaar'
  | 'fatherPanFront'
  | 'fatherPanBack'
  | 'motherPhoto'
  | 'motherAadhaar'
  | 'motherPanFront'
  | 'motherPanBack'
  | 'propertyDocuments'
  | 'propertyPhotos'

type Uploads = Record<FileKey, File | null>
type Errors = Record<string, string>

const domesticSteps = ['Loan Type', 'Basic Details', 'Student', 'Review & Submit']
const abroadSteps = ['Loan Type', 'Basic Details', 'Student', 'Property', 'Review & Submit']

const initialBasic: BasicDetails = {
  applicantName: '',
  mobile: '',
  email: '',
  pan: '',
  qualification: '',
  loanAmount: '',
  course: '',
  country: '',
  gender: '',
  maritalStatus: '',
}

const initialStudent: StudentDetails = {
  offerLetterStatus: '',
  fatherMobile: '',
  fatherEmail: '',
  motherMobile: '',
  motherEmail: '',
  grandmotherName: '',
  grannyName: '',
  reference1Name: '',
  reference1Mobile: '',
  reference1Email: '',
  reference1Address: '',
  reference2Name: '',
  reference2Mobile: '',
  reference2Email: '',
  reference2Address: '',
}

const initialProperty: PropertyDetails = {
  loanSecurity: '',
  ownerName: '',
  ownerFatherName: '',
  propertyType: '',
  area: '',
  valuation: '',
  remark: '',
  hasExistingLoan: false,
  loanDetails: '',
}

const initialUploads: Uploads = {
  tenthMarksheet: null,
  twelfthMarksheet: null,
  offerLetter: null,
  studentPhoto: null,
  aadhaarCard: null,
  aadhaarBack: null,
  panCardFront: null,
  panCardBack: null,
  passportFront: null,
  addressProof: null,
  fatherPhoto: null,
  fatherAadhaar: null,
  fatherPanFront: null,
  fatherPanBack: null,
  motherPhoto: null,
  motherAadhaar: null,
  motherPanFront: null,
  motherPanBack: null,
  propertyDocuments: null,
  propertyPhotos: null,
}

const uploadLabels: Record<FileKey, string> = {
  tenthMarksheet: '10th Marksheet',
  twelfthMarksheet: '12th Marksheet',
  offerLetter: 'Offer Letter',
  studentPhoto: 'Photo (Passport Size)',
  aadhaarCard: 'Aadhaar Card Front',
  aadhaarBack: 'Aadhaar Card Back',
  panCardFront: 'PAN Card Front',
  panCardBack: 'PAN Card Back',
  passportFront: 'Passport Front',
  addressProof: 'Electricity Bill / Property Tax / Registry',
  fatherPhoto: 'Father Photo (Passport Size)',
  fatherAadhaar: 'Father Aadhaar Card',
  fatherPanFront: 'Father PAN Card Front',
  fatherPanBack: 'Father PAN Card Back',
  motherPhoto: 'Mother Photo (Passport Size)',
  motherAadhaar: 'Mother Aadhaar Card',
  motherPanFront: 'Mother PAN Card Front',
  motherPanBack: 'Mother PAN Card Back',
  propertyDocuments: 'Property Documents',
  propertyPhotos: 'Property Photos',
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{message}</motion.p>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
      {children} <span className="text-red-500">*</span>
    </label>
  )
}

function OptionalFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
      {children} <span className="normal-case tracking-normal text-slate-400">(Optional)</span>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  inputMode,
  optional = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  type?: string
  inputMode?: 'text' | 'email' | 'numeric' | 'decimal' | 'tel'
  optional?: boolean
}) {
  return (
    <div className="el-field">
      {optional ? <OptionalFieldLabel>{label}</OptionalFieldLabel> : <FieldLabel>{label}</FieldLabel>}
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`h-[54px] w-full rounded-2xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300 hover:border-indigo-200 focus:-translate-y-0.5 focus:border-indigo-500 focus:shadow-[0_10px_25px_rgba(79,70,229,0.10)] focus:ring-4 focus:ring-indigo-100/70 ${
          error ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
        }`}
      />
      <FieldError message={error} />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  error,
  placeholder,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <div className="el-field">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`h-[54px] w-full rounded-2xl border bg-white px-4 text-[15px] outline-none transition-all duration-200 hover:border-indigo-200 focus:-translate-y-0.5 focus:border-indigo-500 focus:shadow-[0_10px_25px_rgba(79,70,229,0.10)] focus:ring-4 focus:ring-indigo-100/70 ${
          error ? 'border-red-400' : 'border-slate-200'
        } ${value ? 'text-slate-900' : 'text-slate-400'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  )
}

function UploadField({
  field,
  file,
  error,
  onChange,
}: {
  field: FileKey
  file: File | null
  error?: string
  onChange: (field: FileKey, file: File | null) => void
}) {
  const id = `education-loan-${field}`
  return (
    <div className="el-upload-field">
      <FieldLabel>{uploadLabels[field]}</FieldLabel>
      <label
        htmlFor={id}
        className={`group flex min-h-[62px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50/60 hover:shadow-md ${
          error ? 'border-red-400 bg-red-50/30' : file ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-slate-50/60'
        }`}
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-indigo-500 shadow-sm'}`}>
          {file ? <FileCheck2 size={19} /> : <Upload size={18} />}
        </span>
        <span className={`min-w-0 flex-1 truncate text-sm ${file ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
          {file?.name || 'Click to upload'}
        </span>
        {file && (
          <button
            type="button"
            aria-label={`Remove ${uploadLabels[field]}`}
            className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-red-500"
            onClick={(event) => {
              event.preventDefault()
              onChange(field, null)
            }}
          >
            <XCircle size={18} />
          </button>
        )}
      </label>
      <input
        id={id}
        className="sr-only"
        type="file"
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(field, event.target.files?.[0] ?? null)}
      />
      <p className="mt-1 text-[11px] text-slate-400">All file types are supported.</p>
      <FieldError message={error} />
    </div>
  )
}

function JourneyNavigation({ current, labels, onNavigate }: { current: Step; labels: string[]; onNavigate: (step: Step) => void }) {
  return (
    <aside className="el-journey-nav" aria-label={`Step ${current} of ${labels.length}`}>
      <div className="el-journey-heading">
        <span>Your application</span>
        <strong>{Math.round(((current - 1) / (labels.length - 1)) * 100)}% complete</strong>
      </div>
      <div className="el-journey-list">
        {labels.map((label, index) => {
          const number = index + 1
          const complete = number < current
          const active = number === current
          return (
            <button key={label} type="button" disabled={!complete && !active} onClick={() => complete && onNavigate(number as Step)} className={`el-journey-item ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}>
              <motion.span layout className="el-journey-number">{complete ? <Check size={17} strokeWidth={3} /> : String(number).padStart(2, '0')}</motion.span>
              <span className="el-journey-copy"><strong>{label}</strong><small>{complete ? 'Completed' : active ? 'In progress' : 'Up next'}</small></span>
              {active && <ArrowRight size={17} className="el-journey-arrow" />}
            </button>
          )
        })}
      </div>
      <div className="el-journey-help"><ShieldCheck size={18} /><span><strong>Saved securely</strong>Your details stay protected.</span></div>
    </aside>
  )
}

function StepHeader({ step, title, total, previousLabel, onBack }: { step: Step; title: string; total: number; previousLabel?: string; onBack?: () => void }) {
  return (
    <div className="el-step-header">
      {onBack && (
        <button type="button" onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-600">
          <ArrowLeft size={14} /> Back to {previousLabel}
        </button>
      )}
      <div>
        <p className="el-step-eyebrow">Step {step} of {total}</p>
        <h2>{title}</h2>
        <p className="el-step-description">Complete the information below to continue your application.</p>
      </div>
    </div>
  )
}

function FooterActions({ onBack, nextLabel = 'Next Step', submit = false, disabled = false }: { onBack?: () => void; nextLabel?: string; submit?: boolean; disabled?: boolean }) {
  return (
    <div className="el-footer-actions flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-8">
      {onBack ? (
        <button type="button" onClick={onBack} className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-700 shadow-sm hover:border-slate-300">
          <ArrowLeft size={17} /> Back
        </button>
      ) : <span />}
      <button
        type="submit"
        disabled={disabled}
        className="group flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:from-indigo-300 disabled:to-blue-300"
      >
        {nextLabel} {submit ? <Check size={18} /> : <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
      </button>
    </div>
  )
}

export default function EducationLoanPage() {
  const [step, setStep] = useState<Step>(1)
  const [loanType, setLoanType] = useState<LoanType | ''>('')
  const [basic, setBasic] = useState<BasicDetails>(initialBasic)
  const [student, setStudent] = useState<StudentDetails>(initialStudent)
  const [property, setProperty] = useState<PropertyDetails>(initialProperty)
  const [uploads, setUploads] = useState<Uploads>(initialUploads)
  const [errors, setErrors] = useState<Errors>({})
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showOtp, setShowOtp] = useState(false)

  const isAbroad = loanType === 'abroad'
  const activeSteps = isAbroad ? abroadSteps : domesticSteps
  const totalSteps = activeSteps.length
  const reviewStep: Step = isAbroad ? 5 : 4

  const requiredUploadKeys = useMemo<FileKey[]>(() => {
    const domestic: FileKey[] = ['tenthMarksheet', 'twelfthMarksheet', 'studentPhoto', 'aadhaarCard', 'panCardFront', 'fatherPhoto', 'fatherAadhaar', 'fatherPanFront', 'fatherPanBack']
    const abroad: FileKey[] = [...domestic, 'aadhaarBack', 'panCardBack', 'passportFront', 'addressProof', 'motherPhoto', 'motherAadhaar', 'motherPanFront', 'motherPanBack']
    const keys = loanType === 'abroad' ? abroad : domestic
    return student.offerLetterStatus === 'received' ? [...keys.slice(0, 2), 'offerLetter', ...keys.slice(2)] : keys
  }, [loanType, student.offerLetterStatus])

  const goToStep = (next: Step) => {
    setErrors({})
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateBasic = (key: keyof BasicDetails, value: string) => {
    setBasic((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: '' }))
  }

  const updateStudent = (key: keyof StudentDetails, value: string) => {
    setStudent((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: '' }))
  }

  const updateProperty = (key: keyof PropertyDetails, value: string | boolean) => {
    setProperty((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: '' }))
  }

  const updateUpload = (key: FileKey, file: File | null) => {
    setUploads((previous) => ({ ...previous, [key]: file }))
    setErrors((previous) => ({ ...previous, [key]: '' }))
  }

  const validateBasic = () => {
    const next: Errors = {}
    if (!basic.applicantName.trim()) next.applicantName = 'Applicant name is required.'
    else if (!/^[a-zA-Z][a-zA-Z .'-]{1,79}$/.test(basic.applicantName.trim())) next.applicantName = 'Enter a valid full name.'
    if (!basic.mobile) next.mobile = 'Student mobile number is required.'
    else if (!/^[6-9]\d{9}$/.test(basic.mobile)) next.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (!basic.email.trim()) next.email = 'Student email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email)) next.email = 'Enter a valid email address.'
    if (isAbroad && !basic.pan) next.pan = 'Student PAN number is required.'
    else if (isAbroad && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(basic.pan)) next.pan = 'Enter a valid PAN number, for example ABCDE1234F.'
    if (!basic.qualification) next.qualification = 'Highest qualification is required.'
    if (!basic.loanAmount) next.loanAmount = 'Loan amount is required.'
    else if (Number(basic.loanAmount) < 10000) next.loanAmount = 'Loan amount must be at least ₹10,000.'
    if (!basic.course.trim()) next.course = 'Course is required.'
    if (isAbroad && !basic.country) next.country = 'Country of study is required.'
    if (!basic.gender) next.gender = 'Gender is required.'
    if (!basic.maritalStatus) next.maritalStatus = 'Marital status is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validateStudent = () => {
    const next: Errors = {}
    if (!student.offerLetterStatus) next.offerLetterStatus = 'Offer letter status is required.'
    if (!student.fatherMobile) next.fatherMobile = 'Father mobile number is required.'
    else if (!/^[6-9]\d{9}$/.test(student.fatherMobile)) next.fatherMobile = 'Enter a valid 10-digit Indian mobile number.'
    if (!student.fatherEmail.trim()) next.fatherEmail = 'Father email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.fatherEmail)) next.fatherEmail = 'Enter a valid email address.'
    if (isAbroad) {
      if (!/^[6-9]\d{9}$/.test(student.motherMobile)) next.motherMobile = 'Enter a valid 10-digit mother mobile number.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.motherEmail)) next.motherEmail = 'Enter a valid mother email address.'
      ;([1, 2] as const).forEach((number) => {
        const nameKey = `reference${number}Name` as keyof StudentDetails
        const mobileKey = `reference${number}Mobile` as keyof StudentDetails
        const emailKey = `reference${number}Email` as keyof StudentDetails
        const addressKey = `reference${number}Address` as keyof StudentDetails
        if (!student[nameKey].trim()) next[nameKey] = `Reference ${number} name is required.`
        if (!/^[6-9]\d{9}$/.test(student[mobileKey])) next[mobileKey] = `Enter a valid Reference ${number} mobile number.`
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student[emailKey])) next[emailKey] = `Enter a valid Reference ${number} email.`
        if (!student[addressKey].trim()) next[addressKey] = `Reference ${number} address is required.`
      })
    }
    requiredUploadKeys.forEach((key) => {
      if (!uploads[key]) next[key] = `${uploadLabels[key]} is required.`
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validateProperty = () => {
    const next: Errors = {}
    if (!property.loanSecurity) next.loanSecurity = 'Please select secured or unsecured loan.'
    if (property.loanSecurity === 'secured') {
      if (!uploads.propertyDocuments) next.propertyDocuments = 'Property documents are required.'
      if (!uploads.propertyPhotos) next.propertyPhotos = 'Property photos are required.'
      if (!property.ownerName.trim()) next.ownerName = 'Property owner name is required.'
      if (!property.ownerFatherName.trim()) next.ownerFatherName = "Owner's father name is required."
      if (!property.propertyType) next.propertyType = 'Property type is required.'
      if (!property.area || Number(property.area) <= 0) next.area = 'Enter a valid property area.'
      if (!property.valuation || Number(property.valuation) <= 0) next.valuation = 'Enter a valid property valuation.'
      if (!property.remark.trim()) next.remark = 'Property remark is required.'
      if (property.hasExistingLoan && !property.loanDetails.trim()) next.loanDetails = 'Existing loan details are required.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleLoanType = (event: FormEvent) => {
    event.preventDefault()
    if (!loanType) {
      setErrors({ loanType: 'Please select an education loan type.' })
      return
    }
    goToStep(2)
  }

  const handleBasic = (event: FormEvent) => {
    event.preventDefault()
    if (validateBasic()) goToStep(3)
  }

  const handleStudent = (event: FormEvent) => {
    event.preventDefault()
    if (validateStudent()) goToStep(4)
  }

  const handleProperty = (event: FormEvent) => {
    event.preventDefault()
    if (validateProperty()) goToStep(5)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!consent) {
      setErrors({ consent: 'Please accept the declaration and consent before submitting.' })
      return
    }
    setErrors({})
    setShowOtp(true)
  }

  const verifyOtp = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    setShowOtp(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatAmount = (value: string) => value ? `₹${Number(value).toLocaleString('en-IN')}` : '—'

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header />
      <main>
        <section className="relative isolate min-h-[460px] overflow-hidden bg-[#071b43]">
          <img src={educationLoanHero} alt="Graduate ready to begin her higher education journey" className="absolute inset-0 h-full w-full object-cover object-center lg:object-[center_46%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061a42] via-[#071b43]/90 to-[#071b43]/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071b43]/60 via-transparent to-transparent" />
          <motion.span animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[55%] top-16 hidden h-16 w-16 rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md lg:flex lg:items-center lg:justify-center"><GraduationCap className="text-cyan-200" size={30} /></motion.span>
          <motion.span animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} className="absolute bottom-16 left-[48%] hidden h-14 w-14 rounded-full border border-white/20 bg-indigo-500/20 shadow-2xl backdrop-blur-md lg:flex lg:items-center lg:justify-center"><BadgeIndianRupee className="text-white" size={26} /></motion.span>
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }} className="relative mx-auto flex min-h-[460px] max-w-6xl items-center px-5 py-16 sm:px-8">
            <div className="max-w-xl text-white">
              <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide shadow-lg backdrop-blur-md"><Sparkles size={15} className="text-cyan-300" /> INVEST IN YOUR FUTURE</motion.span>
              <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl">Your dream campus is closer than you think.</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-blue-100 sm:text-lg">A simple, secure education loan application for studies in India or abroad—with guidance at every step.</p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
                <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-cyan-300" /> Secure application</span>
                <span className="flex items-center gap-2"><Clock3 size={18} className="text-cyan-300" /> Quick digital process</span>
                <span className="flex items-center gap-2"><BadgeIndianRupee size={18} className="text-cyan-300" /> Flexible loan options</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:pt-16">
          <span className="pointer-events-none absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
          <span className="pointer-events-none absolute right-[-7rem] top-[32rem] h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="relative mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45 }} className="mb-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-indigo-100 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(30,41,59,0.09)] sm:flex-row">
              <div className="flex items-center gap-3">
                <motion.span whileHover={{ rotate: 8, scale: 1.06 }} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-200"><GraduationCap size={25} /></motion.span>
                <div><h2 className="text-base font-extrabold text-slate-950 sm:text-lg">Education Loan Application</h2><p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Complete all {totalSteps} steps to submit your {isAbroad ? 'abroad' : 'domestic'} application</p></div>
              </div>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700"><ShieldCheck size={15} className="mr-1 inline" /> Your data is protected</span>
            </motion.div>

            {!submitted && (
              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Zap, title: '100% digital', text: 'Apply from anywhere', color: 'from-amber-400 to-orange-500', glow: 'shadow-orange-100' },
                  { icon: LockKeyhole, title: 'Safe & private', text: 'Protected information', color: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-100' },
                  { icon: Headset, title: 'Expert support', text: 'Guidance when needed', color: 'from-red-500 to-pink-600', glow: 'shadow-cyan-100' },
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg ${feature.glow} transition-transform group-hover:scale-110`}><Icon size={20} /></span>
                      <div><p className="text-sm font-extrabold text-slate-900">{feature.title}</p><p className="mt-0.5 text-xs text-slate-500">{feature.text}</p></div>
                    </motion.div>
                  )
                })}
              </div>
            )}

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 150 }} className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-emerald-200 bg-white text-center shadow-[0_25px_70px_rgba(15,23,42,0.14)]">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-10 text-white">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 220 }} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/40 bg-white text-emerald-600 shadow-xl"><Check size={39} strokeWidth={3} /></motion.span>
              <h2 className="text-2xl font-black text-white sm:text-3xl">Application submitted successfully!</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-50">Your mobile number has been verified and your education loan application is now with our review team.</p>
            </div>
            <div className="grid gap-4 p-6 text-left sm:grid-cols-3 sm:p-8">
              {[
                { number: '01', label: 'Application review', icon: FileText },
                { number: '02', label: 'Eligibility check', icon: Landmark },
                { number: '03', label: 'Expert callback', icon: Headset },
              ].map((item) => {
                const Icon = item.icon
                return <motion.div whileHover={{ y: -4 }} key={item.number} className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-white hover:shadow-lg"><span className="flex items-center justify-between text-xs font-black text-indigo-500">{item.number}<Icon size={18} className="text-slate-300 transition group-hover:text-indigo-500" /></span><p className="mt-2 text-sm font-bold text-slate-800">{item.label}</p></motion.div>
              })}
            </div>
          </motion.div>
        ) : (
          <div className="el-application-workspace">
            <JourneyNavigation current={step} labels={activeSteps} onNavigate={goToStep} />
            <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }} className="el-step-content">
              {step === 1 && (
                <form onSubmit={handleLoanType} noValidate>
                  <StepHeader step={1} title="Loan Type" total={totalSteps} />
                  <div className="p-5 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Select loan type</p>
                    <p className="mt-1 text-sm text-slate-500">Choose the type of education loan you are applying for.</p>
                    <div className="el-loan-options mt-6 grid gap-5 md:grid-cols-2">
                      {([
                        { value: 'domestic' as const, title: 'Domestic Education Loan', subtitle: 'For studies within India', icon: Building2 },
                        { value: 'abroad' as const, title: 'Abroad Education Loan', subtitle: 'For studies outside India', icon: Globe2 },
                      ]).map((option) => {
                        const Icon = option.icon
                        const selected = loanType === option.value
                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => { setLoanType(option.value); setErrors({}); window.setTimeout(() => goToStep(2), 180) }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.985 }}
                            className={`el-loan-choice group relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-3xl border-2 p-6 text-center transition-all duration-300 ${selected ? 'is-selected border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 shadow-xl shadow-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60'}`}
                          >
                            <span className="absolute -bottom-14 -right-14 h-32 w-32 rounded-full bg-indigo-100/60 transition-transform duration-500 group-hover:scale-150" />
                            {selected && <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-white"><Check size={16} strokeWidth={3} /></span>}
                            <span className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 ${selected ? 'bg-indigo-100 text-indigo-600 shadow-inner' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}><Icon size={31} /></span>
                            <strong className="relative text-base sm:text-lg">{option.title}</strong>
                            <span className="relative mt-1 text-sm text-slate-400">{option.subtitle}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                    <FieldError message={errors.loanType} />
                  </div>
                  <FooterActions />
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleBasic} noValidate>
                  <StepHeader step={2} title="Basic Details" total={totalSteps} previousLabel="Loan Type" onBack={() => goToStep(1)} />
                  <div className="el-basic-grid grid gap-6 p-5 sm:grid-cols-2 sm:p-8">
                    <TextField label="Applicant Name/Student Name" value={basic.applicantName} onChange={(value) => updateBasic('applicantName', value)} error={errors.applicantName} placeholder="Full legal name" />
                    <TextField label="Student Mobile Number" value={basic.mobile} onChange={(value) => updateBasic('mobile', value.replace(/\D/g, '').slice(0, 10))} error={errors.mobile} placeholder="10-digit mobile number" inputMode="numeric" />
                    <TextField label="Student Email Address" value={basic.email} onChange={(value) => updateBasic('email', value)} error={errors.email} placeholder="e.g. john.doe@example.com" type="email" inputMode="email" />
                    {isAbroad && <TextField label="Student PAN Number" value={basic.pan} onChange={(value) => updateBasic('pan', value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} error={errors.pan} placeholder="e.g. ABCDE1234F" />}
                    <SelectField label="Highest Qualification" value={basic.qualification} onChange={(value) => updateBasic('qualification', value)} error={errors.qualification} placeholder="Select Highest Qualification" options={[
                      { value: '12th', label: '12th Pass' }, { value: 'graduation', label: "Graduation (Bachelor's)" }, { value: 'post-graduation', label: "Post Graduation (Master's)" }, { value: 'doctorate', label: 'Doctorate / PhD' },
                    ]} />
                    <TextField label="Loan Amount (₹)" value={basic.loanAmount} onChange={(value) => updateBasic('loanAmount', value.replace(/\D/g, '').slice(0, 10))} error={errors.loanAmount} placeholder="e.g. 1500000" inputMode="numeric" />
                    <TextField label="Course" value={basic.course} onChange={(value) => updateBasic('course', value)} error={errors.course} placeholder="e.g. MBA, MBBS" />
                    {isAbroad && <SelectField label="Country of Study" value={basic.country} onChange={(value) => updateBasic('country', value)} error={errors.country} placeholder="Select Country" options={[{ value: 'usa', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }, { value: 'germany', label: 'Germany' }, { value: 'ireland', label: 'Ireland' }, { value: 'new-zealand', label: 'New Zealand' }, { value: 'other', label: 'Other' }]} />}
                    <SelectField label="Gender" value={basic.gender} onChange={(value) => updateBasic('gender', value)} error={errors.gender} placeholder="Select Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
                    <SelectField label="Marital Status" value={basic.maritalStatus} onChange={(value) => updateBasic('maritalStatus', value)} error={errors.maritalStatus} placeholder="Select Marital Status" options={[{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }]} />
                  </div>
                  <FooterActions onBack={() => goToStep(1)} />
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleStudent} noValidate>
                  <StepHeader step={3} title="Student" total={totalSteps} previousLabel="Basic Details" onBack={() => goToStep(2)} />
                  <div className="space-y-7 p-5 sm:p-8">
                    <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5 shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-100/50">
                      <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"><GraduationCap size={17} /></span> Academic documents</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <UploadField field="tenthMarksheet" file={uploads.tenthMarksheet} error={errors.tenthMarksheet} onChange={updateUpload} />
                        <UploadField field="twelfthMarksheet" file={uploads.twelfthMarksheet} error={errors.twelfthMarksheet} onChange={updateUpload} />
                      </div>
                    </section>

                    <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 to-white p-5 shadow-sm transition-all hover:shadow-lg hover:shadow-cyan-100/50">
                      <SelectField label="Offer Letter Status" value={student.offerLetterStatus} onChange={(value) => updateStudent('offerLetterStatus', value)} error={errors.offerLetterStatus} placeholder="Select Offer Letter Status" options={[{ value: 'applied', label: 'Applied (offer letter not received yet)' }, { value: 'received', label: 'I have the offer letter' }]} />
                      {student.offerLetterStatus === 'received' && <div className="mt-5"><UploadField field="offerLetter" file={uploads.offerLetter} error={errors.offerLetter} onChange={updateUpload} /></div>}
                    </section>

                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                      <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><FileText size={17} /></span> Student documents</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <UploadField field="studentPhoto" file={uploads.studentPhoto} error={errors.studentPhoto} onChange={updateUpload} />
                        <UploadField field="aadhaarCard" file={uploads.aadhaarCard} error={errors.aadhaarCard} onChange={updateUpload} />
                        <UploadField field="panCardFront" file={uploads.panCardFront} error={errors.panCardFront} onChange={updateUpload} />
                        {isAbroad && <UploadField field="aadhaarBack" file={uploads.aadhaarBack} error={errors.aadhaarBack} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="panCardBack" file={uploads.panCardBack} error={errors.panCardBack} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="passportFront" file={uploads.passportFront} error={errors.passportFront} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="addressProof" file={uploads.addressProof} error={errors.addressProof} onChange={updateUpload} />}
                      </div>
                    </section>

                    <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-sm transition-all hover:shadow-lg hover:shadow-amber-100/50">
                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><ShieldCheck size={17} /></span> Family member documents</h3>
                      <p className="mb-5 mt-1 text-sm text-slate-500">Please upload the required documents for the student's father{isAbroad ? ' and mother' : ''}.</p>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <UploadField field="fatherPhoto" file={uploads.fatherPhoto} error={errors.fatherPhoto} onChange={updateUpload} />
                        <UploadField field="fatherAadhaar" file={uploads.fatherAadhaar} error={errors.fatherAadhaar} onChange={updateUpload} />
                        <UploadField field="fatherPanFront" file={uploads.fatherPanFront} error={errors.fatherPanFront} onChange={updateUpload} />
                        <UploadField field="fatherPanBack" file={uploads.fatherPanBack} error={errors.fatherPanBack} onChange={updateUpload} />
                        {isAbroad && <UploadField field="motherPhoto" file={uploads.motherPhoto} error={errors.motherPhoto} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="motherAadhaar" file={uploads.motherAadhaar} error={errors.motherAadhaar} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="motherPanFront" file={uploads.motherPanFront} error={errors.motherPanFront} onChange={updateUpload} />}
                        {isAbroad && <UploadField field="motherPanBack" file={uploads.motherPanBack} error={errors.motherPanBack} onChange={updateUpload} />}
                      </div>
                    </section>

                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                      <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><Headset size={17} /></span> Family details</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <TextField label="Father Mobile" value={student.fatherMobile} onChange={(value) => updateStudent('fatherMobile', value.replace(/\D/g, '').slice(0, 10))} error={errors.fatherMobile} placeholder="10-digit mobile number" inputMode="numeric" />
                        <TextField label="Father Email" value={student.fatherEmail} onChange={(value) => updateStudent('fatherEmail', value)} error={errors.fatherEmail} placeholder="father@example.com" type="email" inputMode="email" />
                        {isAbroad && <TextField label="Mother Mobile" value={student.motherMobile} onChange={(value) => updateStudent('motherMobile', value.replace(/\D/g, '').slice(0, 10))} error={errors.motherMobile} placeholder="10-digit mobile number" inputMode="numeric" />}
                        {isAbroad && <TextField label="Mother Email" value={student.motherEmail} onChange={(value) => updateStudent('motherEmail', value)} error={errors.motherEmail} placeholder="mother@example.com" type="email" inputMode="email" />}
                        {isAbroad && <TextField label="Grandmother Name" optional value={student.grandmotherName} onChange={(value) => updateStudent('grandmotherName', value)} error={errors.grandmotherName} placeholder="Grandmother's full name" />}
                        {isAbroad && <TextField label="Granny Name" optional value={student.grannyName} onChange={(value) => updateStudent('grannyName', value)} error={errors.grannyName} placeholder="Granny's full name" />}
                      </div>
                    </section>

                    {isAbroad && (
                      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-100/50">
                        <h3 className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><UserRound size={17} /></span> References</h3>
                        <p className="mb-6 text-sm text-slate-500">Provide two people we can contact to verify the application details.</p>
                        {[1, 2].map((number) => {
                          const prefix = `reference${number}` as 'reference1' | 'reference2'
                          return (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: number * 0.08 }} key={number} className="mb-5 rounded-2xl border border-white bg-white/90 p-5 shadow-sm last:mb-0">
                              <p className="mb-4 text-sm font-extrabold text-slate-800">Reference {number}</p>
                              <div className="grid gap-5 md:grid-cols-3">
                                <TextField label="Name" value={student[`${prefix}Name`]} onChange={(value) => updateStudent(`${prefix}Name`, value)} error={errors[`${prefix}Name`]} placeholder="Full name" />
                                <TextField label="Mobile Number" value={student[`${prefix}Mobile`]} onChange={(value) => updateStudent(`${prefix}Mobile`, value.replace(/\D/g, '').slice(0, 10))} error={errors[`${prefix}Mobile`]} placeholder="10-digit number" inputMode="numeric" />
                                <TextField label="Email" value={student[`${prefix}Email`]} onChange={(value) => updateStudent(`${prefix}Email`, value)} error={errors[`${prefix}Email`]} placeholder="email@example.com" type="email" inputMode="email" />
                                <div className="md:col-span-3"><TextField label="Address" value={student[`${prefix}Address`]} onChange={(value) => updateStudent(`${prefix}Address`, value)} error={errors[`${prefix}Address`]} placeholder="Complete residential address" /></div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </section>
                    )}
                  </div>
                  <FooterActions onBack={() => goToStep(2)} />
                </form>
              )}

              {isAbroad && step === 4 && (
                <form onSubmit={handleProperty} noValidate>
                  <StepHeader step={4} title="Property" total={totalSteps} previousLabel="Student" onBack={() => goToStep(3)} />
                  <div className="space-y-7 p-5 sm:p-8">
                    <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 shadow-sm">
                      <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><Landmark size={20} /></span><div><h3 className="text-sm font-extrabold text-slate-900">Loan security</h3><p className="text-xs text-slate-500">Choose how you want to secure this education loan.</p></div></div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {([
                          { value: 'secured' as const, title: 'Secured Loan', text: 'Backed by property collateral', icon: Building2 },
                          { value: 'unsecured' as const, title: 'Unsecured Loan', text: 'No property collateral', icon: ShieldCheck },
                        ]).map((option) => {
                          const Icon = option.icon
                          const selected = property.loanSecurity === option.value
                          return <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} type="button" key={option.value} onClick={() => updateProperty('loanSecurity', option.value)} className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${selected ? 'border-indigo-500 bg-white shadow-lg shadow-indigo-100' : 'border-white bg-white/60 hover:border-indigo-200'}`}><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Icon size={21} /></span><span><strong className="block text-sm text-slate-900">{option.title}</strong><small className="text-xs text-slate-500">{option.text}</small></span>{selected && <Check size={18} className="ml-auto text-indigo-600" />}</motion.button>
                        })}
                      </div>
                      <FieldError message={errors.loanSecurity} />
                    </section>

                    {property.loanSecurity === 'unsecured' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><ShieldCheck className="mt-0.5 shrink-0" size={19} /><span><strong className="block">Property details and documents are not required</strong>Your application will proceed as an unsecured education loan.</span></motion.div>
                    )}

                    {property.loanSecurity === 'secured' && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
                        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                          <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600"><MapPin size={17} /></span> Property details</h3>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <TextField label="Owner Name" value={property.ownerName} onChange={(value) => updateProperty('ownerName', value)} error={errors.ownerName} placeholder="Property owner's full name" />
                            <TextField label="Owner's Father Name" value={property.ownerFatherName} onChange={(value) => updateProperty('ownerFatherName', value)} error={errors.ownerFatherName} placeholder="Owner's father name" />
                            <SelectField label="Type of Property" value={property.propertyType} onChange={(value) => updateProperty('propertyType', value)} error={errors.propertyType} placeholder="Select Property Type" options={[{ value: 'vacant-plot', label: 'Vacant Plot' }, { value: 'commercial', label: 'Commercial' }, { value: 'residential', label: 'Residential' }]} />
                            <TextField label="Area (Sq Ft)" value={property.area} onChange={(value) => updateProperty('area', value.replace(/[^\d.]/g, ''))} error={errors.area} placeholder="e.g. 1200.00" inputMode="decimal" />
                            <TextField label="Valuation (₹)" value={property.valuation} onChange={(value) => updateProperty('valuation', value.replace(/\D/g, '').slice(0, 12))} error={errors.valuation} placeholder="Estimated market value" inputMode="numeric" />
                            <TextField label="Remark" value={property.remark} onChange={(value) => updateProperty('remark', value)} error={errors.remark} placeholder="Property remarks" />
                          </div>
                          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"><input type="checkbox" checked={property.hasExistingLoan} onChange={(event) => updateProperty('hasExistingLoan', event.target.checked)} className="h-4 w-4 accent-indigo-600" /> Existing loan on this property?</label>
                          {property.hasExistingLoan && <div className="mt-5"><TextField label="Loan Details" value={property.loanDetails} onChange={(value) => updateProperty('loanDetails', value)} error={errors.loanDetails} placeholder="Bank name, outstanding amount, etc." /></div>}
                        </section>
                        <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-sm transition-all hover:shadow-lg">
                          <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><FileCheck2 size={17} /></span> Property documents</h3>
                          <div className="grid gap-6 sm:grid-cols-2"><UploadField field="propertyDocuments" file={uploads.propertyDocuments} error={errors.propertyDocuments} onChange={updateUpload} /><UploadField field="propertyPhotos" file={uploads.propertyPhotos} error={errors.propertyPhotos} onChange={updateUpload} /></div>
                        </section>
                      </motion.div>
                    )}
                    {property.loanSecurity === 'unsecured' && (
                      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 opacity-70">
                        <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-400"><FileCheck2 size={17} /></span> Property documents — not required</h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {['Property Documents', 'Property Photos'].map((label) => <div key={label}><p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p><div className="flex min-h-[62px] cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4"><LockKeyhole size={18} className="text-slate-400" /><span className="text-sm text-slate-400">Disabled for unsecured loan</span></div></div>)}
                        </div>
                      </motion.section>
                    )}
                  </div>
                  <FooterActions onBack={() => goToStep(3)} />
                </form>
              )}

              {step === reviewStep && (
                <form onSubmit={handleSubmit} noValidate>
                  <StepHeader step={reviewStep} title="Review & Submit" total={totalSteps} previousLabel={isAbroad ? 'Property' : 'Student'} onBack={() => goToStep(isAbroad ? 4 : 3)} />
                  <div className="space-y-5 p-5 sm:p-8">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm font-medium text-emerald-700"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><Check size={17} strokeWidth={3} /></span> Please review your details before submitting.</motion.div>
                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"><FileText size={17} /></span> Basic details</h3>
                      {[
                        ['Name', basic.applicantName], ['Mobile', basic.mobile], ['Email', basic.email], ['Loan Amount', formatAmount(basic.loanAmount)], ['Course', basic.course], ['Loan Type', loanType === 'domestic' ? 'Domestic' : 'Abroad'], ['Qualification', basic.qualification.replace('-', ' ')], ['Gender', basic.gender], ['Marital Status', basic.maritalStatus],
                        ...(isAbroad ? [['PAN', basic.pan], ['Country of Study', basic.country.replace('-', ' ')]] : []),
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0"><span className="text-sm text-slate-400">{label}</span><span className="text-right text-sm font-semibold capitalize text-slate-900">{value}</span></div>
                      ))}
                    </section>
                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600"><GraduationCap size={17} /></span> Student</h3>
                      <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Father Mobile</span><span className="text-sm font-semibold">{student.fatherMobile}</span></div>
                      {isAbroad && <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Mother Mobile</span><span className="text-sm font-semibold">{student.motherMobile}</span></div>}
                      {isAbroad && <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Reference 1</span><span className="text-right text-sm font-semibold">{student.reference1Name} · {student.reference1Mobile}</span></div>}
                      {isAbroad && <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Reference 2</span><span className="text-right text-sm font-semibold">{student.reference2Name} · {student.reference2Mobile}</span></div>}
                      <div className="flex justify-between gap-4 py-2.5"><span className="text-sm text-slate-400">Offer Letter</span><span className="text-sm font-semibold">{student.offerLetterStatus === 'received' ? 'Have offer letter' : 'Applied, not received yet'}</span></div>
                    </section>
                    {isAbroad && (
                      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Landmark size={17} /></span> Property</h3>
                        <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Loan Security</span><span className="text-sm font-semibold capitalize">{property.loanSecurity}</span></div>
                        {property.loanSecurity === 'secured' && <>
                          <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Owner</span><span className="text-sm font-semibold">{property.ownerName}</span></div>
                          <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Property Type</span><span className="text-sm font-semibold capitalize">{property.propertyType.replace('-', ' ')}</span></div>
                          <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5"><span className="text-sm text-slate-400">Area</span><span className="text-sm font-semibold">{property.area} sq ft</span></div>
                          <div className="flex justify-between gap-4 py-2.5"><span className="text-sm text-slate-400">Valuation</span><span className="text-sm font-semibold">{formatAmount(property.valuation)}</span></div>
                        </>}
                      </section>
                    )}
                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><FileCheck2 size={17} /></span> Uploaded documents</h3>
                      {[...requiredUploadKeys, ...(isAbroad && property.loanSecurity === 'secured' ? ['propertyDocuments', 'propertyPhotos'] as FileKey[] : [])].map((key) => (
                        <div key={key} className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
                          <div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{uploadLabels[key]}</p><p className="truncate text-xs text-indigo-500">{uploads[key]?.name}</p></div>
                          <button type="button" onClick={() => uploads[key] && window.open(URL.createObjectURL(uploads[key] as File), '_blank')} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 transition-all hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-md">View</button>
                        </div>
                      ))}
                    </section>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-3xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${errors.consent ? 'border-red-400 bg-red-50/30' : 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50'}`}>
                      <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setErrors({}) }} className="mt-1 h-4 w-4 accent-indigo-600" />
                      <span>
                        <strong className="text-sm text-slate-900">Applicant Declaration & Consent</strong>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">I confirm that all information and documents submitted in this application are true, complete, and accurate to the best of my knowledge. I authorize the company to verify my identity, documents, credit history, banking information, and other details required for processing this education loan application.</span>
                        <span className="mt-2 block text-xs text-slate-500">By continuing, I agree to the <span className="text-indigo-600">Terms & Conditions</span> and <span className="text-indigo-600">Privacy Policy</span>.</span>
                        <FieldError message={errors.consent} />
                      </span>
                    </label>
                  </div>
                  <FooterActions onBack={() => goToStep(isAbroad ? 4 : 3)} nextLabel="Submit Application" submit disabled={!consent} />
                </form>
              )}
            </motion.div>
          </div>
        )}
          </div>
        </section>
      </main>
      <Footer />
      {showOtp && (
        <OTPModal
          phoneNumber={basic.mobile}
          onClose={() => setShowOtp(false)}
          onVerify={verifyOtp}
          onResendOtp={async () => { await new Promise((resolve) => window.setTimeout(resolve, 400)) }}
        />
      )}
    </div>
  )
}
