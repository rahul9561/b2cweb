import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, MessageCircle, X } from 'lucide-react'
import avLogo from '../assets/images/av-logon.png'
import careLogo from '../assets/images/star.png'

type Step = 'proposer' | 'medical' | 'nominee'

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-sm">
      <div className="container-pb flex h-[74px] items-center justify-between">
        <Link to="/"><img src={avLogo} alt="AV Management" className="h-16 w-auto object-contain" /></Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#eaf3ff] px-4 py-2 text-sm font-black text-brand">
          <MessageCircle className="h-4 w-4" /> Talk to us
        </button>
      </div>
    </header>
  )
}

function Progress({ step }: { step: Step }) {
  const steps = ['Proposer', 'Medical', 'Nominee', 'Checkout']
  const active = step === 'proposer' ? 0 : step === 'medical' ? 1 : 2
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="grid grid-cols-4 items-center">
        {steps.map((item, index) => (
          <div key={item} className="relative flex flex-col items-center gap-2 text-xs font-bold text-[#8a97aa]">
            {index > 0 && <span className={`absolute right-1/2 top-[10px] h-px w-full ${index <= active ? 'bg-green-cta' : 'bg-[#b8c1cf]'}`} />}
            <span className={`relative z-10 grid h-5 w-5 place-items-center rounded-full border-2 bg-white ${index < active ? 'border-green-cta bg-green-cta text-white' : index === active ? 'border-green-cta text-green-cta' : 'border-[#b8c1cf]'}`}>
              {index < active ? <Check className="h-3 w-3" /> : ''}
            </span>
            <span className={index <= active ? 'text-navy' : ''}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value = '', select = false }: { label: string; value?: string; select?: boolean }) {
  return (
    <label className="block">
      <span className="ml-4 bg-white px-1 text-xs text-navy">{label}</span>
      <div className="-mt-2 flex h-14 items-center rounded-lg border border-[#53657e] bg-white px-4 text-base text-navy">
        <input defaultValue={value} placeholder={label} className="flex-1 bg-transparent outline-none" />
        {select && <span>⌄</span>}
      </div>
    </label>
  )
}

function Summary({ premium = 5945 }: { premium?: number }) {
  return (
    <aside className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(31,45,72,.12)]">
      <div className="border-b border-[#c7cfdb] p-4 text-xl font-black text-navy">Summary</div>
      <div className="space-y-5 p-4 text-sm text-navy">
        <p>Plan for: Self</p>
        <div className="flex gap-3">
          <img src={careLogo} alt="Care" className="h-11 w-20 rounded border object-contain" />
          <div><b>Care Health - Ultimate Care (Direct)</b><p className="text-slate2-secondary">Cover: Rs25 Lakh</p></div>
        </div>
        <div className="flex justify-between"><span>Premium - 1 Year</span><b>Rs{premium.toLocaleString('en-IN')}</b></div>
      </div>
      <div className="border-t bg-[#f6f7f9] p-4">
        <div className="flex justify-between text-base font-black text-navy"><span>Total premium</span><span>Rs{premium.toLocaleString('en-IN')}</span></div>
      </div>
    </aside>
  )
}

export default function HealthProposalPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('proposer')
  const [premiumDrawer, setPremiumDrawer] = useState(false)
  const [declaration, setDeclaration] = useState(false)

  const questions = [
    'Does any person(s) to be insured have any pre-existing diseases or is on any medication?',
    'Have you had any adverse finding to any diagnostic test or procedures, have symptoms or complaints needing doctors consultation, been advised or had been hospitalized for more than 5 days in total, or undergone any surgery in the last 12 months?',
    'Have you consulted a doctor or a health professional four or more times during the last six months or have any follow-up in the upcoming year?',
    'Do you smoke, consume alcohol, or chew tobacco, ghutka or paan?',
    'Has any of the person(s) to be insured ever filed a claim with their current / previous insurer?',
    'Has any proposal(s) for health insurance been declined cancelled or charged a higher premium?',
    'Is any of the person(s) proposed for insurance covered under any other health insurance policy with the Care Health Insurance?',
    'Does any of the insured members fall in the category of Politically Exposed Persons (PEPs)?',
    'Does any member fall under the category of Differently Abled Persons?',
  ]

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-navy">
      <Header />
      <main className="container-pb grid gap-5 py-7 lg:grid-cols-[1fr_370px]">
        <section className="space-y-4 rounded-2xl bg-white p-5">
          <button
            type="button"
            onClick={() => step === 'proposer' ? navigate('/health-insurance/product-detail') : setStep(step === 'medical' ? 'proposer' : 'medical')}
            className="inline-flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" /> Go back to {step === 'proposer' ? 'Product' : step === 'medical' ? 'Proposer' : 'Medical'}
          </button>
          <Progress step={step} />

          {step === 'proposer' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[26px] font-black">Great! Let's start with proposer details</h1>
                <p className="mt-2 text-slate2-secondary">Proposer is going to pay the premium and avail tax benefits</p>
              </div>
              <h2 className="text-xl font-black">Proposer's details</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Full Name as per your ID Card" value="Mohd Faisal" />
                <Field label="Marital Status" select />
                <Field label="Select Gender" value="Female" select />
                <Field label="PAN Card (required for KYC)" />
              </div>
              <h2 className="text-xl font-black">Personal Details</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="D.O.B (DD-MM-YYYY)" value="02-02-2003" />
                <Field label="Occupation" select />
                <Field label="Height (Feet)" select />
                <Field label="Weight (KG)" value="78" />
              </div>
              <h2 className="text-xl font-black">Communication Address</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Flat/House number, Apartment" value="vrvrw" />
                <Field label="Colony, Street, Sector" value="weffew" />
                <Field label="City" value="Kanpur Nagar(Uttar Pradesh)" />
                <Field label="Pin Code" value="208007" select />
              </div>
              <h2 className="text-xl font-black">Contact details</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Email Address" value="moh***********@gmail.com" />
                <Field label="Mobile" value="########006" />
                <Field label="Emergency Mobile No." value="7839309007" />
              </div>
              <div>
                <h2 className="text-xl font-black">Avail Exclusive Loyalty Discount on AV Management</h2>
                <p className="text-sm text-slate2-secondary">when buying insurance for your car or bike!</p>
                <div className="mt-5 max-w-sm"><Field label="Car/Bike number (optional)" /></div>
              </div>
              <button onClick={() => setPremiumDrawer(true)} className="mx-auto block h-12 w-full max-w-sm rounded-lg bg-[#ff4f34] font-black text-white">
                Proceed to medical questions
              </button>
            </div>
          )}

          {step === 'medical' && (
            <div className="space-y-7">
              <h1 className="text-[26px] font-black">Help us know the medical condition, if any</h1>
              <p className="text-slate2-secondary">We'll only ask for the details insurance companies need. <span className="font-bold text-green-cta">See what you should declare</span></p>
              <h2 className="text-xl font-black text-green-cta">Medical Questions for Mohd Faisal</h2>
              {questions.map((question) => (
                <div key={question} className="border-l-2 border-green-cta pl-4">
                  <p className="mb-4 font-black">{question}</p>
                  <div className="grid gap-6 md:grid-cols-2">
                    {['Yes', 'No'].map((answer) => (
                      <button key={answer} className="flex h-14 items-center gap-3 rounded-lg border border-[#53657e] px-4">
                        <span className="h-5 w-5 rounded border border-[#53657e]" /> {answer}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setStep('nominee')} className="mx-auto block h-12 w-full max-w-sm rounded-lg bg-[#ff4f34] font-black text-white">
                Proceed to nominee section
              </button>
            </div>
          )}

          {step === 'nominee' && (
            <div className="space-y-8">
              <h1 className="text-[26px] font-black">Tell us who you want to make nominee</h1>
              <p className="text-slate2-secondary">God forbid, in case of any mishappening to the proposer, nominee is the person who gets the benefits</p>
              <h2 className="font-black">Give us the details of nominee to be</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Relationship with proposer" value="Father" select />
                <Field label="Nominee Full Name" value="dgih ssw" />
                <Field label="D.O.B (DD-MM-YYYY)" value="02-02-1928" />
              </div>
              <button onClick={() => setDeclaration(true)} className="mx-auto block h-12 w-full max-w-sm rounded-lg bg-[#ff4f34] font-black text-white">
                Proceed to checkout
              </button>
            </div>
          )}
        </section>

        <Summary premium={step === 'proposer' ? 8744 : 5945} />
      </main>

      <AnimatePresence>
        {premiumDrawer && (
          <div className="fixed inset-0 z-50">
            <motion.div className="absolute inset-0 bg-[#173052]/82" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="absolute right-0 top-0 flex h-full w-full max-w-[448px] flex-col bg-white" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
              <div className="flex items-center justify-between bg-[#edf5ff] px-6 py-5"><h2 className="text-xl font-black">Premium revised</h2><button onClick={() => setPremiumDrawer(false)}><X /></button></div>
              <div className="flex-1 space-y-6 p-6">
                <h3 className="text-lg font-black">There has been an update to your premium.</h3>
                <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate2-secondary">
                  <li>It reflects a change in Mohd faisal's age from <b>24 years to 23 years</b> on your policy.</li>
                  <li>As per <b>Care Health Insurance</b> guidelines, the Premium is calculated based on the <b>Permanent address.</b></li>
                </ul>
                <div className="flex items-center gap-4">
                  <img src={careLogo} alt="Care" className="h-11 w-20 rounded border object-contain" />
                  <b>Ultimate Care (Direct)</b>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center text-sm">
                  <div><span>Old Premium</span><b className="block text-lg">Rs6090</b></div>
                  <span className="text-3xl text-[#c8d0db]">&gt;&gt;&gt;</span>
                  <div className="text-right"><span>Revised Premium</span><b className="block text-lg">Rs5945</b></div>
                </div>
              </div>
              <div className="border-t bg-[#f5f6f8] p-6">
                <div className="mb-5 flex justify-between text-lg font-black"><span>New Premium</span><span>Rs5945</span></div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-[#ff4f34] py-3 font-black text-[#ff4f34]">View other plans</button>
                  <button onClick={() => { setPremiumDrawer(false); setStep('medical'); window.scrollTo(0, 0) }} className="rounded-lg bg-[#ff4f34] py-3 font-black text-white">Accept & continue</button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}

        {declaration && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-[#173052]/82 p-4">
            <motion.div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white" initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .96, opacity: 0 }}>
              <div className="flex items-center justify-between bg-[#edf5ff] px-5 py-4"><h2 className="text-lg font-black">Declaration</h2><button onClick={() => setDeclaration(false)}><X /></button></div>
              <div className="space-y-5 p-5">
                {['I hereby declare that all information provided above is true, and I accept all Terms & conditions', 'I hereby consent to receive information from Central KYC Registry through SMS/email on the registered number/email address.'].map((text) => (
                  <label key={text} className="flex gap-3 text-sm leading-relaxed"><span className="mt-1 h-6 w-6 rounded border border-[#53657e]" /> {text}</label>
                ))}
                <button onClick={() => navigate('/health-insurance/checkout')} className="h-12 w-full rounded-lg bg-[#ff4f34] font-black text-white">Continue</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
