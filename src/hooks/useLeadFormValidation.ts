import { useMemo, useRef, useState } from 'react'

export type CountryCode = '+91' | '+1' | '+971' | '+44'

export interface LeadFormValues {
  name: string
  country: CountryCode
  mobile: string
  email: string
  whatsapp: boolean
}

export type LeadErrors = Partial<Record<keyof Pick<LeadFormValues, 'name' | 'mobile' | 'email'>, string>>

const namePattern = /^[A-Za-z][A-Za-z\s'-]{1,}[A-Za-z]$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialValues: LeadFormValues = {
  name: '',
  country: '+91',
  mobile: '',
  email: '',
  whatsapp: true,
}

export function validateLeadForm(values: LeadFormValues): LeadErrors {
  const errors: LeadErrors = {}
  const name = values.name.trim()

  if (!name) errors.name = 'Please enter your name'
  else if (name.length < 3 || !namePattern.test(name)) errors.name = 'Please enter a valid name'

  if (!values.mobile) errors.mobile = 'Please enter your mobile number'
  else if (values.country === '+91' && !/^[6-9]\d{9}$/.test(values.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number'
  } else if (values.country !== '+91' && values.mobile.length < 6) {
    errors.mobile = 'Please enter a valid mobile number'
  }

  if (values.email.trim() && !emailPattern.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  return errors
}

export function useLeadFormValidation(defaults: Partial<LeadFormValues> = {}) {
  const [values, setValues] = useState<LeadFormValues>({ ...initialValues, ...defaults })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFormValues, boolean>>>({})
  const [isSubmitting, setSubmitting] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const mobileRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const refs = useMemo(() => ({ name: nameRef, mobile: mobileRef, email: emailRef }), [])

  const setField = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    const next = { ...values, [key]: value }
    setValues(next)
    if (touched[key] || errors[key as keyof LeadErrors]) {
      setErrors(validateLeadForm(next))
    }
  }

  const blurField = (key: keyof LeadFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors(validateLeadForm(values))
  }

  const validate = () => {
    const next = validateLeadForm(values)
    setErrors(next)
    setTouched({ name: true, mobile: true, email: true })
    if (next.name) nameRef.current?.focus()
    else if (next.mobile) mobileRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    return Object.keys(next).length === 0
  }

  return { values, errors, touched, refs, isSubmitting, setSubmitting, setValues, setField, blurField, validate }
}
