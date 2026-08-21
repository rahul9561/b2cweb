import { useMemo, useState } from 'react'
import {
  Activity,
  BriefcaseMedical,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import HealthQuoteSubpageLayout from '../components/health/HealthQuoteSubpageLayout'
import CallbackDrawer from '../components/health/CallbackDrawer'
import ClaimHighlightModal from '../components/health/claimSupport/ClaimHighlightModal'
import { mockTestimonials, type Testimonial } from '../data/mockTestimonials'

type StoryTab = 'all' | 'social' | 'video' | 'events'

const tabs = ['Overview', 'Top hospitals', 'Top diseases', 'Age group', 'Claim support', 'Testimonials']
const hospitals = [
  { name: 'Apollo', amount: 155 },
  { name: 'Fortis', amount: 136 },
  { name: 'Max', amount: 121 },
  { name: 'Manipal', amount: 115 },
  { name: 'Medanta', amount: 77 },
  { name: 'Sir Ganga Ram', amount: 51 },
  { name: 'Indraprastha Apollo', amount: 32 },
]
const popularHospitals = [
  ['Kokilaben Hospital', 'Rs30 Cr'],
  ['Kims Hospitals', 'Rs21 Cr'],
  ['Dr B L Kapur Memorial Hospital', 'Rs21 Cr'],
  ['Yashoda Hospital', 'Rs17 Cr'],
  ['Deenanath Mangeshkar Hospital', 'Rs15 Cr'],
  ['Apollo Spectra Hospitals', 'Rs14 Cr'],
  ['Artemis Hospital', 'Rs13 Cr'],
  ['Narayana Health City', 'Rs12 Cr'],
  ['Ruby Hall Clinic', 'Rs11 Cr'],
]
const conditions = [
  { icon: Stethoscope, title: 'Cancer & Blood', amount: 'Rs468 Cr', avg: 'Rs4L', color: '#ff5757', bg: '#fff2f2', pct: 35 },
  { icon: Activity, title: 'Infections & Fever', amount: 'Rs442 Cr', avg: 'Rs73K', color: '#8b5cf6', bg: '#f6f1ff', pct: 33 },
  { icon: HeartPulse, title: 'Heart & BP', amount: 'Rs438 Cr', avg: 'Rs2L', color: '#f59e0b', bg: '#fff8e8', pct: 34 },
  { icon: BriefcaseMedical, title: 'Injuries & Accidents', amount: 'Rs390 Cr', avg: 'Rs1L', color: '#14b8a6', bg: '#ecfffb', pct: 30 },
]
const ageGroups = [
  ['Less than 25 Yrs', '2%', 'Rs56 Cr', 'Rs55K', '#8b5cf6', '#f2eaff'],
  ['26-35 Yrs', '19%', 'Rs723 Cr', 'Rs58K', '#06b6d4', '#ddf9ff'],
  ['36-45 Yrs', '26%', 'Rs1,023 Cr', 'Rs76K', '#f59e0b', '#fff2d6'],
  ['46-60 Yrs', '29%', 'Rs1,154 Cr', 'Rs1L', '#14b8a6', '#ddfbf6'],
  ['60+ Yrs', '24%', 'Rs956 Cr', 'Rs1.4L', '#ef4444', '#ffe8e8'],
]
const storyTabs: { key: StoryTab; label: string }[] = [
  { key: 'all', label: 'All stories' },
  { key: 'social', label: 'Social appreciation' },
  { key: 'video', label: 'Video testimonials' },
  { key: 'events', label: 'Events' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function ClaimSupportPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [hospitalSearch, setHospitalSearch] = useState('')
  const [showMoreHospitals, setShowMoreHospitals] = useState(false)
  const [showMoreConditions, setShowMoreConditions] = useState(false)
  const [storyTab, setStoryTab] = useState<StoryTab>('all')
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const visibleHospitals = popularHospitals
    .filter(([name]) => name.toLowerCase().includes(hospitalSearch.toLowerCase()))
    .slice(0, showMoreHospitals ? popularHospitals.length : 6)
  const filteredStories = useMemo(
    () => mockTestimonials.filter((story) => storyTab === 'all' || story.category === storyTab),
    [storyTab],
  )

  return (
    <HealthQuoteSubpageLayout>
      <div className="space-y-5">
        <div className="sticky top-[60px] z-20 -mx-1 flex gap-3 overflow-x-auto border-b border-slate2-border bg-[#eef1f5]/95 px-1 py-2 backdrop-blur scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => scrollTo(tab.toLowerCase().replace(/ /g, '-'))}
              className="h-10 flex-shrink-0 rounded-full border border-slate2-border bg-white px-5 text-sm font-bold text-slate2-secondary transition-colors hover:border-green-cta hover:text-green-cta focus:border-green-cta focus:text-green-cta"
            >
              {tab}
            </button>
          ))}
        </div>

        <section id="overview" className="rounded-[20px] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd6e9] text-sm">A</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8efff] text-sm">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy">
                <span className="text-[#d936f4]">6,54,50,000</span> families have trusted AV Management so far
              </h1>
              <p className="text-base text-slate2-secondary">The below data is from 2018</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { icon: MapPin, title: 'India', claims: '9L', settled: '4,008 Cr', gradient: 'from-[#4ea3ff] to-[#1f7dff]' },
              { icon: MapPin, title: 'Kanpur Nagar (Uttar Pradesh)', claims: '6K', settled: '24 Cr', gradient: 'from-[#7776ff] to-[#644cff]' },
            ].map((card) => (
              <div key={card.title} className={`rounded-[18px] bg-gradient-to-br ${card.gradient} p-7 text-white shadow-card`}>
                <div className="mb-8 flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                    <card.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-black">{card.title}</h2>
                </div>
                <div className="grid grid-cols-2 divide-x divide-white/30">
                  <div>
                    <p className="text-sm font-bold">No. of Claims Settled</p>
                    <p className="mt-3 text-2xl font-black">{card.claims}</p>
                  </div>
                  <div className="pl-7">
                    <p className="text-sm font-bold">Claim Amount Settled</p>
                    <p className="mt-3 text-2xl font-black">{card.settled}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="top-hospitals" className="rounded-[20px] bg-white p-6 shadow-sm">
          <h2 className="mb-9 text-xl font-black">Claim Amount Settled for Top Hospitals in India</h2>
          <div className="grid grid-cols-[64px_1fr] gap-4">
            <div className="flex flex-col justify-between pb-8 text-sm font-bold text-slate2-secondary">
              <span>Rs200 Cr</span><span>Rs160 Cr</span><span>Rs120 Cr</span><span>Rs80 Cr</span><span>Rs40 Cr</span><span>Rs0</span>
            </div>
            <div className="relative flex h-72 items-end justify-between gap-4 border-b border-purple-100 bg-[linear-gradient(to_bottom,transparent_19%,#eee5ff_20%,transparent_20%,transparent_39%,#eee5ff_40%,transparent_40%,transparent_59%,#eee5ff_60%,transparent_60%,transparent_79%,#eee5ff_80%,transparent_80%)] px-4">
              {hospitals.map((item) => (
                <div key={item.name} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center">
                  <span className="mb-2 text-xs font-bold text-navy">Rs{item.amount} Cr</span>
                  <div
                    className="mx-auto w-11 rounded-t-2xl bg-gradient-to-b from-[#aa55f8] to-[#f2a5f8]"
                    style={{ height: `${(item.amount / 200) * 100}%` }}
                  />
                  <p className="mt-4 truncate text-xs font-bold text-slate2-secondary">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-purple-100 pt-7">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-bold">Other Popular Hospitals</h3>
              <label className="relative block sm:w-80">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate2-muted" />
                <input
                  value={hospitalSearch}
                  onChange={(event) => setHospitalSearch(event.target.value)}
                  className="h-12 w-full rounded-full border border-transparent bg-white pl-14 pr-5 text-sm shadow-[0_5px_18px_rgba(23,43,77,0.08)] outline-none focus:border-green-cta"
                  placeholder="Search Hospital"
                />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {visibleHospitals.map(([name, amount]) => (
                <div key={name} className="flex min-h-16 items-center justify-between rounded-lg border-l-4 border-[#b450ff] bg-white px-5 py-4 shadow-[0_5px_18px_rgba(23,43,77,0.06)]">
                  <span className="text-sm font-bold">{name}</span>
                  <span className="text-sm font-black text-[#c533ff]">{amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowMoreHospitals((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-green-cta px-6 py-2 text-sm font-black text-[#007a54]"
              >
                {showMoreHospitals ? 'View fewer hospitals' : 'View more hospitals'} <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="top-diseases" className="rounded-[20px] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-black">Claims Amount Settled by Major Conditions</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {conditions.slice(0, showMoreConditions ? conditions.length : 4).map((item) => (
              <div key={item.title} className="rounded-xl border p-5" style={{ borderColor: item.color + '40', background: item.bg }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <item.icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-black">{item.title}</p>
                      <p className="text-xs font-bold text-slate2-secondary">Avg. claim {item.avg}</p>
                    </div>
                  </div>
                  <span className="font-black" style={{ color: item.color }}>{item.amount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={() => setShowMoreConditions((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-green-cta px-6 py-2 text-sm font-black text-[#007a54]"
            >
              View more conditions <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section id="age-group" className="rounded-[20px] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-black">Claims Settled by Age Group</h2>
          <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
            {ageGroups.map(([label, percent, total, avg, color, bg]) => (
              <div key={label} className="w-40 flex-shrink-0 rounded-lg p-5 text-center" style={{ background: bg }}>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-white" style={{ boxShadow: `inset 0 0 0 4px ${color}` }}>
                  <span className="font-black" style={{ color }}>{percent}</span>
                </div>
                <p className="mb-3 text-sm font-black">{label}</p>
                <div className="space-y-2 text-left text-xs text-slate2-secondary">
                  <p className="flex justify-between"><span>Total Claim Amount:</span><b className="text-navy">{total}</b></p>
                  <p className="flex justify-between"><span>Avg Claim:</span><b className="text-navy">{avg}</b></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="claim-support" className="rounded-[20px] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-base font-black">Claim Support by AV Management</h2>
          <div className="mb-8 grid gap-5 md:grid-cols-2">
            <div className="flex items-center gap-5 rounded-lg bg-[#dcfbf8] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00c8b8] text-white"><ShieldCheck className="h-6 w-6" /></span>
              <div><p className="text-xl font-black text-[#00b79f]">600+ Expert</p><p className="text-xs">Claim Advisors</p></div>
            </div>
            <div className="flex items-center gap-5 rounded-lg bg-[#f1e8ff] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#9b75ff] text-white"><MapPin className="h-6 w-6" /></span>
              <div><p className="text-xl font-black text-[#9b75ff]">150+ Cities</p><p className="text-xs">with on-ground support</p></div>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black text-[#d936f4]">Step 1</p>
              <h3 className="font-black">In case of emergency we are just a call away.</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate2-secondary">
                <li>Inform your Dedicated Relationship Manager</li>
                <li>Or, call us on the support helpline <b className="text-green-cta">9217010023</b></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-black text-[#d936f4]">Step 2</p>
              <h3 className="font-black">Take care of your family, we will do the rest.</h3>
              <p className="mt-3 text-sm text-slate2-secondary">
                Our claim specialists reach your location and complete formalities from filing the claim to coordinating with insurer, TPA and hospital.
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between rounded-xl bg-[#dfeaff] p-5">
            <div className="flex items-center gap-4">
              <MessageCircle className="h-10 w-10 text-brand" />
              <div>
                <h3 className="font-black">Know how we make your claim experience easy</h3>
                <p className="text-sm text-slate2-secondary">From hospitalisation to discharge we have you covered every step of the way</p>
              </div>
            </div>
            <button onClick={() => setCallbackOpen(true)} className="rounded-lg bg-white px-5 py-3 text-sm font-black text-brand shadow-sm">
              Talk to our advisor &gt;
            </button>
          </div>
        </section>

        <section id="testimonials" className="rounded-[20px] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-black">How We Helped Our Customers</h2>
          <div className="mb-6 flex flex-wrap gap-3">
            {storyTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStoryTab(tab.key)}
                className={`rounded-full border px-4 py-2 text-xs font-bold ${
                  storyTab === tab.key ? 'border-green-cta text-[#007a54]' : 'border-slate2-border text-slate2-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredStories.map((story) => (
              <article key={story.id} className="rounded-xl bg-white p-5 shadow-[0_5px_18px_rgba(23,43,77,0.12)]">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blueBG font-black">{story.ageMasked.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-black">{story.ageMasked} <span className="font-normal text-slate2-muted">({story.age} Yrs)</span></p>
                    <p className="text-xs text-slate2-secondary">Customer since {story.customerSince}</p>
                  </div>
                </div>
                <p className="min-h-14 text-sm leading-relaxed text-slate2-secondary">{story.excerpt}</p>
                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => setSelectedTestimonial(story)} className="inline-flex items-center gap-1 text-xs font-black text-[#00845e]">
                    See their story <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate2-muted"><CalendarDays className="h-3 w-3" /> {story.dateLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <CallbackDrawer isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
      <ClaimHighlightModal isOpen={!!selectedTestimonial} onClose={() => setSelectedTestimonial(null)} testimonial={selectedTestimonial} />
    </HealthQuoteSubpageLayout>
  )
}
