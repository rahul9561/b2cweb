import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronDown, ShieldCheck, Star, X } from 'lucide-react'
import { useHealthProfile } from '../context/HealthProfileContext'
import HealthKnowMore from '../components/health/HealthKnowMore'
import HealthDisclaimer from '../components/health/HealthDisclaimer'
import PersonalizedPlansModal from '../components/health/PersonalizedPlansModal'
import PlanOptionModal from '../components/health/PlanOptionModal'
import MedicalHistoryModal from '../components/health/MedicalHistoryModal'

const extraMembers = [
  'grandfather',
  'grandmother',
  'father-in-law',
  'mother-in-law',
  'brother',
  'sister',
  'uncle',
  'aunt',
  'live-in partner (male)',
  'live-in partner (female)',
]

const newMembers = new Set(['brother', 'sister', 'uncle', 'aunt', 'live-in partner (male)', 'live-in partner (female)'])

const topHealthPlans = [
  {
    insurer: 'star',
    logoText: 'STAR',
    plan: 'Super Star Value',
    hospitals: 146,
    cover: 'Rs5 Lakh',
    premium: 'Rs369/month',
    annual: 'Rs4,417 annually',
    more: 'View 8 more plans',
    features: [
      '15% co-payment applicable on treatment outside the network of Valued Provider-Pan India Hospitals',
      'Single Private AC Room',
      'Rs2.5 lakh No Claim Bonus',
      'Restoration of cover unlimited times in a year',
    ],
  },
  {
    insurer: 'care',
    logoText: 'care',
    plan: 'Ultimate Joy - Bronze',
    hospitals: 159,
    cover: 'Rs5 Lakh',
    premium: 'Rs444/month',
    annual: 'Rs5,319 annually',
    more: 'View 9 more plans',
    features: [
      'No Room Rent Limit',
      'Get Rs2.5 lakh yearly bonus up to Rs25 lakh; Infinity Bonus removes the maximum cap.',
      'Unlimited Restoration of Cover',
    ],
  },
  {
    insurer: 'niva',
    logoText: 'niva',
    plan: 'Reassure 3.0 Elite Value',
    hospitals: 173,
    cover: 'Rs5 Lakh',
    premium: 'Rs423/month',
    annual: 'Rs5,076 annually',
    more: 'View 26 more plans',
    discount: 'Inclusive of 5% online discount *',
    features: [
      'Get unlimited health coverage at an affordable price',
      'All room covered except Deluxe/Suite',
      'Unutilized SI carries forward, growing to Rs50 Lakh',
      'Unlimited Restoration of Cover, Forever',
    ],
  },
  {
    insurer: 'hdfc',
    logoText: 'HDFC ERGO',
    plan: 'Optima Secure',
    hospitals: 218,
    cover: 'Rs5 Lakh',
    premium: 'Rs718/month',
    annual: 'Rs8,616 annually',
    more: 'View 26 more plans',
    discount: 'Inclusive of 5% online discount *',
    features: [
      '2x coverage from Day 1 with 4x increase in coverage after 2 renewals.',
      'No Room Rent Limit',
      'Rs2.5 lakh Renewal Bonus',
      'Restoration of cover once a year',
    ],
  },
]

function titleCase(value: string) {
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function HealthPlanLogo({ insurer, text }: { insurer: string; text: string }) {
  const styles: Record<string, string> = {
    star: 'border-blue-100 bg-white text-[#3179c7]',
    care: 'border-yellow-100 bg-[#ffeb00] text-[#138c8e]',
    niva: 'border-blue-100 bg-white text-[#22a5d7]',
    hdfc: 'border-red-100 bg-white text-[#e42528]',
  }

  return (
    <div className={`grid h-12 w-[100px] place-items-center rounded-md border text-center text-lg font-black ${styles[insurer]}`}>
      {text}
    </div>
  )
}

type DrawerStep = 'members' | 'age' | 'city'
type WizardStep = 'personal' | 'planOption' | 'medical'

function PremiumJourneyDrawer({
  isOpen,
  step,
  planName,
  gender,
  members,
  age,
  city,
  onClose,
  onBack,
  onGender,
  onToggleMember,
  onAge,
  onCity,
  onContinue,
}: {
  isOpen: boolean
  step: DrawerStep
  planName: string
  gender: 'male' | 'female'
  members: string[]
  age: number
  city: string
  onClose: () => void
  onBack: () => void
  onGender: (value: 'male' | 'female') => void
  onToggleMember: (value: string) => void
  onAge: (value: number) => void
  onCity: (value: string) => void
  onContinue: () => void
}) {
  const memberOptions = gender === 'male'
    ? ['self', 'wife', 'son', 'daughter', 'father', 'mother']
    : ['self', 'husband', 'son', 'daughter', 'father', 'mother']
  const cities = ['Gautam Buddha Nagar', 'Lucknow', 'Kanpur Nagar', 'Agra', 'Meerut', 'Allahabad', 'Varanasi', 'Mathura', 'Bareilly', 'Moradabad']

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close premium drawer"
            className="absolute inset-0 bg-[#173052]/82"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[448px] flex-col bg-white shadow-2xl"
          >
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <button
                type="button"
                onClick={step === 'members' ? onClose : onBack}
                className="mb-7 grid h-9 w-9 place-items-center rounded-lg bg-[#eaf3ff] text-navy transition hover:bg-[#dcecff]"
              >
                {step === 'members' ? <ArrowLeft className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </button>

              {step === 'members' && (
                <>
                  <h2 className="text-[26px] font-black leading-tight text-navy">
                    Few details needed to calculate <span className="text-[#e1006f]">{planName}</span> premium
                  </h2>
                  <div className="mt-7 inline-flex overflow-hidden rounded-lg bg-[#eef4ff]">
                    {(['male', 'female'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onGender(item)}
                        className={`h-10 w-[89px] text-sm font-black transition ${gender === item ? 'bg-green-cta text-white' : 'text-navy'}`}
                      >
                        {titleCase(item)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-7 text-sm font-black text-navy">Select members you want to insure</p>
                  <div className="mt-4 grid grid-cols-2 gap-5">
                    {memberOptions.map((member) => {
                      const selected = members.includes(member)
                      return (
                        <button
                          key={member}
                          type="button"
                          onClick={() => onToggleMember(member)}
                          className={`flex h-[58px] items-center gap-3 rounded-lg border px-3 text-left text-base transition ${
                            selected ? 'border-green-cta bg-white text-green-cta shadow-[0_0_0_1px_rgba(45,181,125,.18)]' : 'border-[#b6c2d2] text-navy'
                          }`}
                        >
                          <span className={`grid h-5 w-5 place-items-center rounded border ${selected ? 'border-green-cta bg-green-cta text-white' : 'border-[#7d8ca4]'}`}>
                            {selected && <Check className="h-3.5 w-3.5" strokeWidth={4} />}
                          </span>
                          {titleCase(member)}
                        </button>
                      )
                    })}
                  </div>
                  <button type="button" className="mx-auto mt-5 flex items-center gap-1 text-sm font-black text-green-cta">
                    <span className="h-2 w-2 rounded-full bg-green-cta" /> More members <ChevronDown className="h-4 w-4" />
                  </button>
                </>
              )}

              {step === 'age' && (
                <>
                  <h2 className="text-[26px] font-black text-navy">Select your age</h2>
                  <div className="mt-5 flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffed9e] text-center text-[10px] font-black text-[#e1006f]">BEST<br />PRICE</span>
                    <p className="text-base leading-relaxed text-navy">This will help us in calculating your premium & discounts</p>
                  </div>
                  <label className="mt-7 block">
                    <span className="ml-4 bg-white px-1 text-xs text-navy">Your age</span>
                    <select
                      value={age}
                      onChange={(event) => onAge(Number(event.target.value))}
                      className="-mt-2 h-14 w-full rounded-lg border border-[#53657e] bg-white px-4 text-base text-navy outline-none"
                    >
                      {Array.from({ length: 43 }, (_, index) => 18 + index).map((item) => (
                        <option key={item} value={item}>{item} yr</option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {step === 'city' && (
                <>
                  <h2 className="text-[26px] font-black text-navy">Select your city</h2>
                  <label className="mt-7 block">
                    <span className="ml-4 bg-white px-1 text-xs text-navy">Search your city</span>
                    <div className="-mt-2 flex h-14 items-center rounded-lg border border-[#53657e] bg-white px-4">
                      <input
                        value={city}
                        onChange={(event) => onCity(event.target.value)}
                        className="flex-1 bg-transparent text-base text-navy outline-none"
                      />
                      <X className="h-5 w-5 text-navy" />
                    </div>
                  </label>
                  <p className="mt-5 text-sm font-black text-navy">Popular cities</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cities.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onCity(item)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${city === item ? 'border-green-cta bg-green-cta/10 text-green-cta' : 'border-[#d7dde7] bg-white text-navy'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-gray-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={onContinue}
                className="h-12 w-full rounded-lg bg-[#ff4f34] text-base font-black text-white shadow-[0_10px_24px_rgba(255,79,52,0.25)] transition hover:bg-[#f3442a]"
              >
                Continue &rsaquo;
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function FamilyHealthInsurancePage() {
  const navigate = useNavigate()
  const { dispatch } = useHealthProfile()
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [showMore, setShowMore] = useState(false)
  const [members, setMembers] = useState<string[]>(['self'])
  const [drawerStep, setDrawerStep] = useState<DrawerStep>('members')
  const [drawerPlan, setDrawerPlan] = useState<string | null>(null)
  const [drawerGender, setDrawerGender] = useState<'male' | 'female'>('female')
  const [drawerMembers, setDrawerMembers] = useState<string[]>(['self'])
  const [drawerAge, setDrawerAge] = useState(27)
  const [drawerCity, setDrawerCity] = useState('Kanpur Nagar')
  const [wizardStep, setWizardStep] = useState<WizardStep | null>(null)

  const baseMembers = gender === 'male'
    ? ['self', 'wife', 'son', 'daughter', 'father', 'mother']
    : ['self', 'husband', 'son', 'daughter', 'father', 'mother']
  const visibleMembers = showMore ? [...baseMembers, ...extraMembers] : baseMembers

  const toggleMember = (member: string) => {
    setMembers((current) => {
      if (member === 'self') return current.includes('self') ? current : ['self', ...current]
      return current.includes(member)
        ? current.filter((item) => item !== member)
        : [...current, member]
    })
  }

  const continueToAge = () => {
    dispatch({ type: 'SET_PROFILE', payload: { gender, members } })
    navigate('/health-insurance/age')
  }

  const toggleDrawerMember = (member: string) => {
    setDrawerMembers((current) => {
      if (member === 'self') return current.includes('self') ? current : ['self', ...current]
      return current.includes(member)
        ? current.filter((item) => item !== member)
        : [...current, member]
    })
  }

  const openPremiumDrawer = (plan: string) => {
    setDrawerPlan(plan)
    setDrawerStep('members')
  }

  const continuePremiumDrawer = () => {
    if (drawerStep === 'members') {
      dispatch({ type: 'SET_PROFILE', payload: { gender: drawerGender, members: drawerMembers } })
      setDrawerStep('age')
      return
    }
    if (drawerStep === 'age') {
      dispatch({ type: 'SET_PROFILE', payload: { age: drawerAge, memberAges: { self: drawerAge } } })
      setDrawerStep('city')
      return
    }
    dispatch({ type: 'SET_PROFILE', payload: { city: drawerCity } })
    setDrawerPlan(null)
    setWizardStep('personal')
  }

  const backPremiumDrawer = () => {
    setDrawerStep((current) => current === 'city' ? 'age' : 'members')
  }

  const closeWizard = () => setWizardStep(null)

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#fff0e8]" />
        <div className="container-pb relative py-12 lg:py-14">
          <h1 className="mb-10 text-center text-[32px] font-black leading-tight text-navy sm:text-[42px]">
            <span className="text-[#e1006f]">Get 0% GST now</span> with upto 25% extra discount**
          </h1>

          <div className="mb-7 flex justify-center">
            <div className="inline-flex overflow-hidden rounded-lg bg-[#eef4ff]">
              {(['male', 'female'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGender(item)}
                  className={`h-10 w-28 text-sm font-bold transition ${
                    gender === item ? 'bg-green-cta text-white' : 'text-navy'
                  }`}
                >
                  {titleCase(item)}
                </button>
              ))}
            </div>
          </div>

          <h2 className="mb-5 text-center text-base font-black text-navy">
            Select members you want to insure
          </h2>

          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleMembers.map((member) => {
              const selected = members.includes(member)
              return (
                <button
                  key={member}
                  type="button"
                  onClick={() => toggleMember(member)}
                  className={`relative flex min-h-[58px] items-center gap-3 rounded-lg border px-4 text-left text-base transition ${
                    selected
                      ? 'border-green-cta bg-white text-green-cta shadow-[0_0_0_1px_rgba(45,181,125,0.18)]'
                      : 'border-[#b6c2d2] bg-white text-navy hover:border-green-cta hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded border ${
                      selected ? 'border-green-cta bg-green-cta text-white' : 'border-[#7d8ca4] bg-white'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" strokeWidth={4} />}
                  </span>
                  <span>{titleCase(member)}</span>
                  {newMembers.has(member) && (
                    <span className="absolute right-2 top-0 -translate-y-1/2 rounded bg-[#eadfff] px-2 py-0.5 text-[10px] font-black text-[#6d3fc7]">
                      * NEW
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowMore((value) => !value)}
            className="mx-auto mt-8 flex items-center gap-2 text-base font-black text-green-cta"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-cta/70" />
            {showMore ? 'Less members' : 'More members'}
            <ChevronDown className={`h-4 w-4 transition ${showMore ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={continueToAge}
            className="mx-auto mt-12 block h-14 w-full max-w-[380px] rounded-lg bg-[#ff4f34] text-base font-black text-white shadow-[0_10px_24px_rgba(255,79,52,0.28)] transition hover:bg-[#f3442a] active:scale-[0.99]"
          >
            Continue &rsaquo;
          </button>

          <p className="mt-5 text-center text-xs text-slate2-secondary">
            By clicking on "Continue", you agree to our <span className="text-brand">Privacy Policy</span>,{' '}
            <span className="text-brand">Terms of Use</span> &amp; <span className="text-brand">*Disclaimer</span>
          </p>
        </div>
      </section>

      <section className="rounded-t-[60px] bg-[#f1f6ff] px-4 py-9">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <p className="text-lg text-navy">AV Management is <b>one of India's leading</b><br />digital insurance platforms</p>
          <div className="flex text-4xl text-[#ffad00]">
            <Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current opacity-50" />
          </div>
          <div><b className="text-2xl text-brand">13.2 crore</b><p className="text-xs text-slate2-secondary">Registered Consumers</p></div>
          <div><b className="text-2xl text-brand">53</b><p className="text-xs text-slate2-secondary">Insurance Partners</p></div>
        </div>
      </section>

      <section className="bg-[#f7f3ff] px-4 pb-10 pt-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-navy">Top Health Insurance plans</h2>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {['Individual', 'Family Plan', 'Senior Citizen'].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`rounded-full border px-6 py-3 text-base transition ${
                  index === 0
                    ? 'border-[#4f3bc9] bg-white font-semibold text-[#4f3bc9]'
                    : 'border-gray-200 bg-white text-navy shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-base text-navy">
              <span className="text-slate2-secondary">Insurer</span>
              <span className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-green-cta">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-cta" />
                </span>
                Private
              </span>
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border border-[#7d8ca4]" />
                Public
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-9">
            {topHealthPlans.map((plan) => (
              <div key={plan.plan} className="relative">
                <div className="overflow-hidden rounded-2xl border border-[#e2e7ef] bg-white shadow-[0_10px_26px_rgba(31,45,72,0.08)]">
                  <div className="grid gap-5 p-4 sm:grid-cols-[100px_1fr_120px_150px] sm:p-5">
                    <HealthPlanLogo insurer={plan.insurer} text={plan.logoText} />

                    <div>
                      <h3 className="text-lg font-black text-navy">{plan.plan}</h3>
                      <p className="mt-2 flex items-center gap-1 text-sm text-navy">
                        <span className="grid h-4 w-4 place-items-center rounded bg-green-cta text-[10px] font-black text-white">+</span>
                        {plan.hospitals} Cashless hospitals. <span className="font-semibold text-green-cta">View list &rsaquo;</span>
                      </p>
                      <div className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <p key={feature} className="flex items-start gap-2 text-sm leading-relaxed text-slate2-secondary">
                            <span className={index === 0 && feature.includes('co-payment') ? 'mt-1 text-[#ffb300]' : 'mt-1 text-green-cta'}>
                              {index === 0 && feature.includes('co-payment') ? '!' : '✓'}
                            </span>
                            <span>{feature}</span>
                          </p>
                        ))}
                      </div>
                      <button type="button" className="mt-5 text-sm font-semibold text-green-cta">
                        View all features &rsaquo;
                      </button>
                    </div>

                    <div className="sm:pt-8">
                      <p className="text-sm text-slate2-secondary">Cover amount</p>
                      <p className="text-lg font-black text-navy">{plan.cover}</p>
                    </div>

                    <div className="sm:pt-8">
                      <p className="text-sm text-slate2-secondary">Starting from</p>
                      <p className="text-lg font-black text-navy">{plan.premium}</p>
                      <p className="text-xs text-slate2-secondary">{plan.annual}</p>
                      <button
                        type="button"
                        onClick={() => openPremiumDrawer(plan.plan)}
                        className="mt-4 h-11 w-full rounded-lg bg-[#ff4f34] text-sm font-black text-white shadow-[0_10px_20px_rgba(255,79,52,0.22)] transition hover:bg-[#f3442a]"
                      >
                        Check Premium &rsaquo;
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end bg-gradient-to-r from-white via-white to-[#eafbf2] px-4 py-3">
                    {plan.discount && (
                      <span className="mr-auto text-xs font-bold text-[#00a9bd]">✽ {plan.discount}</span>
                    )}
                    <button type="button" className="flex items-center gap-2 text-sm text-navy">
                      <span className="h-5 w-5 rounded-full border border-[#7d8ca4] bg-white shadow-[0_0_0_4px_rgba(45,181,125,0.14)]" />
                      Add to compare
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute left-1/2 top-full -translate-x-1/2 rounded-b-lg bg-white px-12 py-2 text-sm font-semibold text-green-cta shadow-sm"
                >
                  {plan.more} <ChevronDown className="inline h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ff] px-4 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-2xl text-[#5740c3]">Why AV Management is the preferred choice for</p>
            <h2 className="mt-2 text-3xl font-black text-[#5740c3]">55 Lakh+ people like you</h2>
          </div>
          {[
            ['Affordable options', 'We help you find health insurance plans with affordable premiums, uncover discounts and monthly payment options provided by our Insurance partners'],
            ['Platinum insurance partner', 'Our dedicated claims team works with insurance companies to help you answer insurer queries and track your claim settlement.'],
            ['30 minute claim support*', 'A dedicated specialist will reach your hospital or home in 30 minutes to help you start the claim process by organizing your documents.'],
          ].map(([title, text], index) => (
            <div key={title} className={`rounded-[28px] bg-white p-8 shadow-[0_16px_36px_rgba(31,45,72,0.08)] ${index === 1 ? 'lg:ml-28' : ''}`}>
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e9fbf8] text-green-cta">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-navy">{title}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate2-secondary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <HealthKnowMore />
      <HealthDisclaimer />

      <PremiumJourneyDrawer
        isOpen={drawerPlan !== null}
        step={drawerStep}
        planName={drawerPlan || 'Optima Secure'}
        gender={drawerGender}
        members={drawerMembers}
        age={drawerAge}
        city={drawerCity}
        onClose={() => setDrawerPlan(null)}
        onBack={backPremiumDrawer}
        onGender={setDrawerGender}
        onToggleMember={toggleDrawerMember}
        onAge={setDrawerAge}
        onCity={setDrawerCity}
        onContinue={continuePremiumDrawer}
      />
      <PersonalizedPlansModal
        isOpen={wizardStep === 'personal'}
        onClose={closeWizard}
        onBack={closeWizard}
        onContinue={() => setWizardStep('planOption')}
      />
      <PlanOptionModal
        isOpen={wizardStep === 'planOption'}
        onClose={closeWizard}
        onBack={() => setWizardStep('personal')}
        onContinue={() => setWizardStep('medical')}
      />
      <MedicalHistoryModal
        isOpen={wizardStep === 'medical'}
        onClose={closeWizard}
        onBack={() => setWizardStep('planOption')}
        onContinue={() => {
          closeWizard()
          navigate('/health-insurance/quotes')
        }}
      />
    </div>
  )
}
