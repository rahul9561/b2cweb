import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, Building2, Check, CheckCircle2, ChevronDown, Clock, HeartPulse, Home, Info, Landmark, ShieldCheck, Star, Users, Wallet, Zap } from 'lucide-react'
import QuoteForm, { type LeadFormKind } from './QuoteForm'
import QuestionFlowModal from './modals/QuestionFlowModal'
import ChildSavingsDetailsModal from './modals/ChildSavingsDetailsModal'
import { useUserProfile } from '../context/UserProfileContext'
import defaultHeroImage from '../assets/images/loan.png'
import TravelLandingView from './travel/TravelLanding'

export type LandingSlug =
  | 'term' | 'health' | 'investment' | 'car' | 'bike' | 'family-health' | 'travel' | 'term-women'
  | 'term-rop' | 'guaranteed-return' | 'child-savings' | 'retirement' | 'group-health' | 'home'

type LandingConfig = { name: string; lead: string; accent: string; support: string; kind: LeadFormKind; cta: string; image?: string; benefits?: string[] }

const configs: Record<LandingSlug, LandingConfig> = {
  term: { name: 'Term Life Insurance', lead: 'Protect your family with a', accent: 'term cover that fits your goals', support: 'Personalised plans from trusted insurers, explained simply.', kind: 'person', cta: 'View Term Plans' },
  health: { name: 'Health Insurance', lead: 'Find health cover built for', accent: 'every stage of life', support: 'Compare features, networks and premiums in one place.', kind: 'person', cta: 'Explore Health Plans' },
  investment: { name: 'Investment Plans', lead: 'Start investing with a plan for', accent: 'your future goals', support: 'Explore market-linked and guaranteed options with expert support.', kind: 'person', cta: 'View Investment Plans' },
  car: { name: 'Car Insurance', lead: 'Compare car insurance and', accent: 'save on your renewal', support: 'Get a quick quote using your vehicle registration number.', kind: 'vehicle', cta: 'View Car Prices' },
  bike: { name: 'Two Wheeler Insurance', lead: 'Two-wheeler cover made', accent: 'quick and easy', support: 'Share your bike number to see relevant policy options.', kind: 'vehicle', cta: 'View Bike Prices' },
  'family-health': { name: 'Family Health Insurance', lead: 'One health plan for', accent: 'the people you love', support: 'Select your family members and start comparing.', kind: 'person', cta: 'Continue' },
  travel: { name: 'Travel Insurance', lead: 'Travel with cover from', accent: 'the moment you leave', support: 'Build an overseas travel cover that suits your journey.', kind: 'person', cta: 'Explore Plans' },
  'term-women': { name: 'Term Insurance for Women', lead: 'Financial protection designed for', accent: 'your independent future', support: 'Explore flexible term cover options with expert guidance.', kind: 'person', cta: 'View Plans' },
  'term-rop': { name: 'Term Plans with Return of Premium', lead: 'Term protection with', accent: 'return of premium options', support: 'Understand eligible plans, benefits and coverage choices.', kind: 'person', cta: 'View Plans' },
  'guaranteed-return': { name: 'Guaranteed Return Plans', lead: 'Build future savings with', accent: 'predictable milestones', support: 'Compare plans designed around your time horizon and goals.', kind: 'person', cta: 'View Plans', benefits: ['Goal-focused savings', 'Tax planning support', 'Life cover options', 'Expert assistance'] },
  'child-savings': { name: 'Child Savings Plan', lead: 'Give your child’s goals', accent: 'a confident start', support: 'Plan for education and other future milestones on your terms.', kind: 'person', cta: 'View Plans' },
  retirement: { name: 'Retirement Plans', lead: 'Plan the retirement', accent: 'you look forward to', support: 'Explore long-term solutions tailored to your future income goals.', kind: 'person', cta: 'View Plans', benefits: ['Long-term planning', 'Tax planning support', 'Life cover options', 'Flexible contributions'] },
  'group-health': { name: 'Employee Group Health Insurance', lead: 'Group health cover for', accent: 'growing teams', support: 'Give your employees meaningful health benefits with practical administration.', kind: 'business', cta: 'View Plan Instantly' },
  home: { name: 'Home Insurance', lead: 'Secure the place you call', accent: 'home', support: 'Explore cover for your home, belongings and home-loan needs.', kind: 'person', cta: 'View Home Plans' },
}

const iconBenefits = [ShieldCheck, Clock, Wallet, Award]

export default function LeadLanding({ slug, heroImageUrl }: { slug: LandingSlug; heroImageUrl?: string }) {
  const config = configs[slug]
  if (slug === 'travel') return <TravelLanding config={config} heroImageUrl={heroImageUrl} />
  if (slug === 'family-health' || slug === 'health') return <HealthLanding config={config} heroImageUrl={heroImageUrl} />
  if (slug === 'group-health') return <GroupLanding config={config} heroImageUrl={heroImageUrl} />
  if (slug === 'home') return <HomeLanding config={config} heroImageUrl={heroImageUrl} />
  return <StandardLanding slug={slug} config={config} heroImageUrl={heroImageUrl} />
}

function StandardLanding({ config, heroImageUrl, slug }: { config: LandingConfig; heroImageUrl?: string; slug: LandingSlug }) {
  const [showChildSavingsModal, setShowChildSavingsModal] = useState(false)
  const navigate = useNavigate()
  const { profile, dispatch } = useUserProfile()
  const isTermFlow = config.name.includes('Term')
  const isGuaranteedReturnFlow = slug === 'guaranteed-return'
  const isRetirementFlow = slug === 'retirement'
  const isChildSavingsFlow = slug === 'child-savings'

  const handleFormSubmit = (data: { name: string; dob: string; mobile: string; email: string; gender: 'male' | 'female' }) => {
    dispatch({ type: 'SET_PROFILE', payload: { name: data.name, dob: data.dob, mobile: data.mobile, email: data.email, gender: data.gender } })
    if (isGuaranteedReturnFlow) {
      navigate('/guaranteed-return-plans/plans', {
        state: { name: data.name, dob: data.dob, mobile: data.mobile, email: data.email, city: profile.city },
      })
      return
    }
    if (isRetirementFlow) {
      navigate('/retirement-plans/plans', {
        state: { name: data.name, dob: data.dob, mobile: data.mobile, email: data.email, city: profile.city },
      })
      return
    }
    if (isChildSavingsFlow) {
      setShowChildSavingsModal(true)
      return
    }
    if (isTermFlow) {
      setShowModal(true)
    }
  }

  return (
    <>
      <section className="bg-blueBG">
        <div className="container-pb grid gap-8 py-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-16">
          <HeroCopy config={config} heroImageUrl={heroImageUrl} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge icon={Zap} text="Quick online journey" />
              <Badge icon={ShieldCheck} text="Expert assistance" />
            </div>
            <QuoteForm 
              kind={config.kind} 
              cta={config.cta} 
              title={config.name} 
              showGender={config.kind === 'person' && (config.name.includes('Term') || config.name.includes('Health'))} 
              requiresValidation={isGuaranteedReturnFlow || isRetirementFlow || isChildSavingsFlow} 
              onSubmit={isTermFlow || isGuaranteedReturnFlow || isRetirementFlow || isChildSavingsFlow ? handleFormSubmit : undefined} 
            />
          </motion.div>
        </div>
      </section>
      <TrustBar />
      <>{config.benefits && <SmallBenefits items={config.benefits} />}</>
      <Benefits />
      <InfoSection name={config.name} />
      {isTermFlow && <QuestionFlowModal isOpen={showModal} onClose={() => setShowModal(false)} />}
      {isChildSavingsFlow && <ChildSavingsDetailsModal isOpen={showChildSavingsModal} onClose={() => setShowChildSavingsModal(false)} />}
    </>
  )
}

function HeroCopy({ config, heroImageUrl }: { config: LandingConfig; heroImageUrl?: string }) {
  return <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}><p className="mb-3 text-[12px] font-semibold uppercase tracking-[.12em] text-brand">AV Management · {config.name}</p><h1 className="max-w-xl text-[31px] font-medium leading-[1.16] text-navy sm:text-[43px]">{config.lead} <span className="font-bold text-brand">{config.accent}</span></h1><p className="mt-4 max-w-lg text-[13px] leading-6 text-slate2-secondary">{config.support}</p>{config.kind === 'vehicle' && <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-green-cta/40 bg-white px-3 py-1.5 text-[12px] font-semibold text-green-cta"><Zap size={14} /> Get a quote in minutes</span>}<HeroVisual name={config.name} image={heroImageUrl} /></motion.div>
}

function HeroVisual({ name, image }: { name: string; image?: string }) {
  const src = image ?? defaultHeroImage
  return (
    <div className="relative mt-7 flex h-48 items-end justify-center overflow-hidden rounded-cardlg border border-white bg-white/60 sm:h-60">
      <img src={src} alt={name} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
      <span className="absolute bottom-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate2-secondary shadow-card">
        {name}
      </span>
    </div>
  )
}

function Badge({ icon: Icon, text }: { icon: typeof Zap; text: string }) { return <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-navy shadow-card"><Icon size={14} className="text-brand" />{text}</span> }

function TrustBar() {
  const stats = [
    { number: '13.2 Cr', label: 'Registered Consumers' },
    { number: '53', label: 'Insurance Partners' },
    { number: '6.29 Cr', label: 'Policies Sold' },
    { number: '1.2 Cr', label: 'Bikes Insured' },
  ]

  return (
    <section className="border-y border-slate2-border bg-white">
      <div className="container-pb grid gap-5 py-6 text-center lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:text-left">
        <p className="text-[13px] leading-5 text-navy lg:col-span-1">
          AV Management helps make financial protection easier to compare and understand.
        </p>
        <div className="flex justify-center gap-1 text-yellow lg:justify-start">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} fill="currentColor" size={20} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:col-span-3">
          {stats.map((stat) => (
            <Stat key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
function Stat({ number, label }: { number: string; label: string }) { return <div className="px-2 text-center"><p className="text-[18px] font-bold text-brand">{number}</p><p className="text-[10px] text-slate2-secondary">{label}</p></div> }

function SmallBenefits({ items }: { items: string[] }) { return <section className="container-pb py-10"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map((item, i) => { const Icon = iconBenefits[i]; return <div key={item} className="flex items-center gap-3 rounded-card border border-slate2-border bg-white p-4"><span className="rounded-xl bg-blueBG p-2 text-brand"><Icon size={20}/></span><span className="text-[12px] font-semibold text-navy">{item}</span></div> })}</div></section> }
function Benefits() { return <section className="bg-blueBGMuted py-12"><div className="container-pb"><h2 className="section-title">Why choose AV Management</h2><span className="heading-accent"/><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Transparent choices', 'Guided support', 'Secure experience', 'Built around your goals'].map((title, i) => { const Icon = iconBenefits[i]; return <motion.article whileHover={{ y: -4 }} key={title} className="relative rounded-cardlg bg-white p-5 shadow-card"><span className="absolute right-4 top-4 rounded-full bg-blueBG p-2 text-brand"><Icon size={18}/></span><h3 className="max-w-[150px] text-[15px] font-bold text-navy">{title}</h3><p className="mt-3 text-[12px] leading-5 text-slate2-secondary">Clear details and helpful support at every step of your decision.</p></motion.article>})}</div></div></section> }
function InfoSection({ name, content }: { name: string; content?: React.ReactNode }) {
  const [isDisclaimerOpen, setDisclaimerOpen] = useState(false)

  return (
    <section className="container-pb py-12">
      <h2 className="text-[22px] font-bold text-navy">Know more about {name}</h2>

      {content ?? (
        <>
          <p className="mt-3 max-w-4xl text-[13px] leading-6 text-slate2-secondary">
            Review the important plan features, eligibility details and exclusions before purchasing. An AV Management expert can help you compare suitable options.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[13px] text-slate2-secondary">
            <li>Compare benefits and policy wording carefully.</li>
            <li>Choose coverage that matches your needs and budget.</li>
            <li>Read insurer-provided terms before completing a purchase.</li>
          </ul>
        </>
      )}

      <div className="mt-8 rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
        <button
          onClick={() => setDisclaimerOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg bg-blueBG px-4 py-3 text-left text-sm font-semibold text-navy"
        >
          <span>Disclaimer</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isDisclaimerOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isDisclaimerOpen && (
          <div className="mt-4 space-y-3 text-[13px] leading-6 text-slate2-secondary">
            <p>
              *All savings and online discounts are indicative and subject to insurer approval. Final premium depends on your profile, policy term and selected add-ons.
            </p>
            <p>
              *Policy issuance is subject to underwriting and the insurer's final terms and conditions. AV Management facilitates the purchase and is not the insurer.
            </p>
            <p>
              *Read the full policy brochure before buying. Benefits, exclusions, sub-limits, waiting periods and claim processes vary by plan and insurer.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function HealthLanding({ config, heroImageUrl }: { config: LandingConfig; heroImageUrl?: string }) {
  const [members, setMembers] = useState<string[]>(['Self', 'Spouse'])
  const people = ['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother']

  return (
    <>
      <section className="bg-blueBG">
        <div className="container-pb grid gap-8 py-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-14">
          <div className="space-y-6">
            <p className="text-[12px] font-semibold uppercase tracking-[.18em] text-brand">AV Management · {config.name}</p>
            <h1 className="max-w-2xl text-[34px] font-bold leading-tight text-navy sm:text-[42px]">
              {config.lead} <span className="text-brand">{config.accent}</span>
            </h1>
            <p className="max-w-xl text-[14px] leading-7 text-slate2-secondary">{config.support}</p>

            <div className="grid gap-4 rounded-cardlg bg-white p-6 shadow-card sm:grid-cols-[1fr_1fr]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-cta/10 px-3 py-1 text-[11px] font-semibold text-green-cta">Family health</span>
                  <span className="rounded-full bg-blueBG px-3 py-1 text-[11px] font-semibold text-navy">Trusted insurers</span>
                </div>
                <p className="text-[13px] font-semibold text-navy">Select who you want to cover</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {people.map((person) => {
                    const selected = members.includes(person)
                    return (
                      <button
                        key={person}
                        type="button"
                        onClick={() =>
                          setMembers(selected ? members.filter((x) => x !== person) : [...members, person])
                        }
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[13px] font-medium transition ${
                          selected
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-slate2-border bg-white text-navy hover:border-brand'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? 'border-brand bg-brand text-white' : 'border-slate2-border bg-white'
                          }`}
                        >
                          {selected ? <Check size={12} /> : null}
                        </span>
                        {person}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate2-border bg-blueBG p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[.16em] text-slate2-secondary">Family snapshot</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span className="text-[13px] font-semibold text-navy">Members selected</span>
                    <span className="text-[13px] font-bold text-brand">{members.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span className="text-[13px] text-slate2-secondary">Estimated premium</span>
                    <span className="text-[13px] font-bold text-navy">₹6,199</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span className="text-[13px] text-slate2-secondary">Cashless hospitals</span>
                    <span className="text-[13px] font-bold text-navy">6,500+</span>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-full bg-brand px-4 py-3 text-[13px] font-semibold text-white">{config.cta}</button>
                <p className="mt-3 text-[11px] text-slate2-secondary">
                  By continuing, you accept AV Management’s privacy policy and terms.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <HeroVisual name={config.name} image={heroImageUrl} />
            <div className="rounded-cardlg border border-slate2-border bg-white p-5 shadow-card">
              {[
                'Cashless cover for your family',
                '24/7 claims support from trusted partners',
                'Flexible sum insured options',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-blueBG p-2 text-brand">
                    <Check size={16} />
                  </span>
                  <p className="text-[13px] leading-6 text-navy">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <Plans />
      <Benefits />
      <InfoSection name={config.name} content={<HealthInfoContent />} />
    </>
  )
}
function HealthInfoContent() {
  return (
    <>
      {/* existing short content - kept as-is */}
      <p className="mt-3 max-w-4xl text-[13px] leading-6 text-slate2-secondary">
        Review the important plan features, eligibility details and exclusions before purchasing. An AV Management expert can help you compare suitable options.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[13px] text-slate2-secondary">
        <li>Compare benefits and policy wording carefully.</li>
        <li>Choose coverage that matches your needs and budget.</li>
        <li>Read insurer-provided terms before completing a purchase.</li>
      </ul>

      {/* new detailed content - added below */}
      <h3 className="mt-8 text-[17px] font-bold text-navy">Health Insurance</h3>
      <ul className="mt-3 max-w-4xl list-disc space-y-3 pl-5 text-[13px] leading-6 text-slate2-secondary">
        <li>
          Health insurance takes care of your medical expenses and ensures that out-of-pocket expenses are curtailed up to the sum insured.
        </li>
        <li>
          A health insurance policy ensures that you can avail cashless treatment at a network hospital, typically covering 30 days and 60 days pre and post hospitalization, respectively, in most{' '}
          <a href="https://www.policybazaar.com/health-insurance/health-insurance-india/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            Health Insurance plans
          </a>.
        </li>
        <li>
          You can add value to a base health plan with additional benefits such as Personal Accident (PA) Cover or{' '}
          <a href="https://www.policybazaar.com/health-insurance/critical-illness-insurance/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            Critical Illness (CI) Cover
          </a>, available at a nominal added cost for benefits not part of the base plan — for example, a PA plan covers disability without any waiting period or medical checkups.
        </li>
        <li>
          You can also invest in a{' '}
          <a href="https://www.policybazaar.com/health-insurance/senior-citizen-health-insurance/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            senior citizen health insurance
          </a>{' '}
          policy for comprehensive security for elderly parents or your own old age.
        </li>
        <li>
          Almost all health insurance plans include Coronavirus treatment cover, and insurers have launched COVID-19 specific{' '}
          <a href="https://www.policybazaar.com/health-insurance/individual-health-insurance/articles/best-health-insurance-plans-in-india/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            best health insurance
          </a>{' '}
          options as per IRDAI guidelines.
        </li>
        <li>
          Two special COVID health policies —{' '}
          <a href="https://www.policybazaar.com/health-insurance/corona-rakshak-policy/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            Corona Rakshak
          </a>{' '}
          and{' '}
          <a href="https://www.policybazaar.com/health-insurance/corona-kavach-policy/" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            Corona Kavach
          </a>{' '}
          — provide a lump sum payment on diagnosis and cover consumables like PPE kits, masks and gloves.
        </li>
      </ul>

      <h3 className="mt-8 text-[17px] font-bold text-navy">Benefits of Health Insurance Coverage</h3>
      <p className="mt-2 max-w-4xl text-[13px] leading-6 text-slate2-secondary">
        Health insurance plans have enhanced offerings to cover a wide spectrum of requirements — a family health plan offers complete cover to all members of a family under a single umbrella.
      </p>
      <ul className="mt-3 max-w-4xl list-disc space-y-2 pl-5 text-[13px] leading-6 text-slate2-secondary">
        <li><strong>Medical Bills:</strong> Coverage against medicinal expenses incurred, including pre and post hospitalization.</li>
        <li><strong>Pre-existing Diseases:</strong> Coverage for any pre-existing disease is provided after a certain waiting period.</li>
        <li><strong>Claim Reimbursement:</strong> Coverage for expenses incurred for hospitalization due to a medical event.</li>
        <li><strong>Tax Rebate:</strong> Annual premium paid for health coverage is subject to tax exemption under section 80D of ITA, 1961, ranging from ₹25,000 to ₹75,000.</li>
        <li>Tax benefits are subject to changes in tax laws.</li>
        <li><strong>Other Benefits:</strong> OPD expenses are now covered under some insurer plans and don't require minimum 24-hour hospitalization for claim reimbursement. Standalone OPD plans are also available.</li>
      </ul>

      <h3 className="mt-8 text-[17px] font-bold text-navy">Key Points to Remember when Comparing Health Insurance</h3>
      <ul className="mt-3 max-w-4xl list-disc space-y-2 pl-5 text-[13px] leading-6 text-slate2-secondary">
        <li>Sum Insured Amount</li>
        <li>Policy premium to be paid to avail the coverage benefits</li>
        <li>List of network hospitals and Claim Settlement Ratio</li>
        <li>Sub-limits (if any) and Waiting Period (for PEDs)</li>
        <li>Co-payment clause</li>
      </ul>
    </>
  )
}
function Plans() { return <section className="bg-blueBGMuted py-12"><div className="container-pb max-w-5xl"><h2 className="section-title">Compare available plans</h2><div className="mt-6 flex flex-wrap justify-center gap-2"><button className="rounded-full border border-brand bg-white px-4 py-2 text-[12px] font-semibold text-brand">Individual</button><button className="rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] text-navy">Family</button><button className="rounded-full border border-slate2-border bg-white px-4 py-2 text-[12px] text-navy">Senior citizen</button></div><div className="mt-6 space-y-4">{['Essential Care', 'Complete Health', 'Family Protect'].map((plan) => <article key={plan} className="grid gap-4 rounded-cardlg bg-white p-5 shadow-card md:grid-cols-[80px_1fr_auto] md:items-center"><div className="grid h-14 w-14 place-items-center rounded-lg border border-slate2-border text-[10px] font-bold text-brand">INSURER</div><div><h3 className="text-[15px] font-bold text-navy">{plan}</h3><p className="mt-1 flex items-center gap-1 text-[12px] text-slate2-secondary"><Building2 size={14} className="text-green-cta"/> Network details available on quote</p><ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate2-secondary"><li className="flex gap-1"><Check size={13} className="text-green-cta"/> Cashless options</li><li className="flex gap-1"><Check size={13} className="text-green-cta"/> Digital policy copy</li></ul></div><div className="md:text-right"><p className="text-[11px] text-slate2-muted">Starting from</p><p className="text-[17px] font-bold text-navy">₹— / month</p><button className="mt-2 rounded-lg bg-brand px-5 py-2 text-[12px] font-bold text-white">Check Premium</button></div><label className="md:col-start-3 text-[11px] text-slate2-secondary"><input type="radio" name="compare" className="mr-1"/> Add to compare</label></article>)}<button className="mx-auto block text-[12px] font-semibold text-brand">View more plans <ChevronDown className="inline" size={14}/></button></div></div></section> }

function TravelLanding({ config, heroImageUrl }: { config: LandingConfig; heroImageUrl?: string }) {
  return <TravelLandingView config={config} heroImageUrl={heroImageUrl} />
}

function GroupLanding({ config, heroImageUrl }: { config: LandingConfig; heroImageUrl?: string }) { return <><section className="bg-blueBG"><div className="container-pb grid gap-8 py-12 lg:grid-cols-[1.2fr_.8fr]"><div><p className="text-[12px] font-semibold text-brand">AV Management <span className="text-slate2-secondary">for Business</span></p><h1 className="mt-4 text-[38px] font-medium text-navy">Compare and save <span className="font-bold text-brand">on group health cover</span></h1><div className="mt-6 space-y-3">{['Straightforward claims support','Plans for varied team sizes','Practical administration tools'].map(x=><p key={x} className="flex items-center gap-2 text-[13px] text-navy"><CheckCircle2 size={18} className="text-brand"/>{x}</p>)}</div><HeroVisual name={config.name} image={heroImageUrl}/></div><div><Badge icon={Users} text="Step 1 of 2"/><div className="mt-3"><QuoteForm kind="business" cta={config.cta} title="Request employee cover quotes"/></div></div></div></section><TrustBar/><section className="container-pb py-12"><h2 className="text-[24px] font-bold text-navy">Exclusive business benefits</h2><div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{['Policy management dashboard','Dedicated relationship manager','Wellness benefit options','Support for employee claims'].map((x,i)=>{const Icon=[Landmark,Users,HeartPulse,ShieldCheck][i];return <div className="rounded-cardlg border border-slate2-border p-5"><span className="inline-block rounded-xl bg-blueBG p-3 text-brand"><Icon size={22}/></span><p className="mt-4 text-[14px] font-bold text-navy">{x}</p></div>})}</div><button className="mt-7 flex w-full items-center justify-between rounded-lg bg-brand px-5 py-4 text-[13px] font-bold text-white">Know more about Group Health Insurance <ChevronDown size={17}/></button></section><InfoSection name={config.name} /></> }

function HomeLanding({ config, heroImageUrl }: { config: LandingConfig; heroImageUrl?: string }) { 
  const navigate = useNavigate()
  const handleHomeFormSubmit = () => {
    navigate('/home-insurance/building-value')
  }
  return <><section className="bg-blueBG py-11 text-center"><div className="container-pb"><p className="text-[13px] text-slate2-secondary">Your home deserves thoughtful protection.</p><h1 className="mt-2 text-[36px] font-bold text-navy">Compare cover and <span className="text-green-cta">save on home insurance</span></h1><div className="mt-4 flex flex-wrap justify-center gap-2"><Badge icon={CheckCircle2} text="Bank-ready options"/><Badge icon={CheckCircle2} text="Flexible cover"/><Badge icon={CheckCircle2} text="Helpful guidance"/></div><div className="mt-9 grid items-center gap-6 lg:grid-cols-[.65fr_1fr_.65fr]"><HeroVisual name="Home visual" image={heroImageUrl}/><div className="text-left"><div onClick={handleHomeFormSubmit} className="cursor-pointer"><button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[14px] font-bold text-white transition hover:bg-brand-dark">{config.cta}</button></div><div className="mt-4 text-left"><p className="text-[13px] font-semibold text-navy">What do you need insurance for? <Info className="inline" size={14}/></p>{['Home & belongings','A home-loan requirement','Family financial protection'].map(x=><label key={x} className="mt-2 flex gap-2 text-[12px] text-slate2-secondary"><input type="checkbox"/>{x}</label>)}</div></div><div className="hidden lg:grid place-items-center"><Home size={150} strokeWidth={1} className="text-brand/25"/></div></div></div></section><TrustBar/><Benefits/><InfoSection name={config.name} /></> 
}
