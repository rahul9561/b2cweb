import { useState } from 'react'
import {
  CalendarCheck,
  ChevronDown,
  Home,
  MessageCircle,
  Phone,
  Search,
  Stethoscope,
  Video,
} from 'lucide-react'
import HealthQuoteSubpageLayout from '../components/health/HealthQuoteSubpageLayout'
import CallbackDrawer from '../components/health/CallbackDrawer'

const helpOptions = [
  {
    icon: MessageCircle,
    title: 'Talk to us',
    desc: 'Speak directly with a AV Management advisor over a call',
    action: 'Get a callback',
    tint: 'bg-[#e2fff9] text-[#00a98f]',
  },
  {
    icon: Video,
    title: 'Video call a doctor',
    desc: 'Discuss your existing medical conditions with a doctor before buying health insurance.',
    action: 'Book a video consultation',
    tint: 'bg-[#fff3d8] text-[#f59e0b]',
  },
  {
    icon: Home,
    title: 'Get consultation at home',
    desc: 'Prefer a face-to-face discussion? Request a licensed advisor to visit you at home.',
    action: 'Schedule a visit',
    tint: 'bg-[#fff0e9] text-[#ff6948]',
  },
  {
    icon: MessageCircle,
    title: 'Chat with us',
    desc: 'Got a quick question? Start a live chat and get instant answers.',
    action: 'Start chat',
    tint: 'bg-[#dff8ff] text-[#06b6d4]',
  },
]

const faqs = [
  ['How do I buy a health insurance plan?', 'Select members, city, compare plans, and our advisor helps with KYC and payment.'],
  ['How can I track my claim?', 'Use claim support or call the 24x7 helpline. We coordinate with the insurer and hospital.'],
  ['Can I change my city or insured members?', 'Yes. Use the Edit option in Family details and update your quote information.'],
]

export default function HelpPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <HealthQuoteSubpageLayout>
      <section className="rounded-[20px] bg-[#eef1f5]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black">Get Help</h1>
            <p className="mt-2 text-sm text-slate2-secondary">
              Choose how you'd like to connect with our experts - whatever suits you best.
            </p>
          </div>
          <label className="relative block sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate2-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search help"
              className="h-11 w-full rounded-full border border-white bg-white pl-11 pr-4 text-sm outline-none focus:border-green-cta"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {helpOptions
            .filter((item) => !search || item.title.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div key={item.title} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_6px_16px_rgba(23,43,77,0.13)]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-slate2-border/50" />
                <div className="flex gap-4">
                  <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${item.tint}`}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-base font-black">{item.title}</h2>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-slate2-secondary">{item.desc}</p>
                    <button
                      onClick={() => setCallbackOpen(true)}
                      className="mt-5 rounded border border-navy px-5 py-2 text-xs font-black text-navy transition-colors hover:bg-navy hover:text-white"
                    >
                      {item.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-[1fr_280px]">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-black">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index
                return (
                  <div key={question} className="rounded-lg border border-slate2-border">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-black"
                    >
                      {question}
                      <ChevronDown className={`h-4 w-4 text-slate2-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="px-4 pb-4 text-sm text-slate2-secondary">{answer}</p>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rounded-xl bg-[#dfeaff] p-6">
            <Stethoscope className="mb-4 h-9 w-9 text-brand" />
            <h2 className="text-base font-black">Need expert guidance?</h2>
            <p className="mt-2 text-sm text-slate2-secondary">Our health experts can help you choose and buy the right plan.</p>
            <button
              onClick={() => setCallbackOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-black text-white"
            >
              <Phone className="h-4 w-4" /> Talk now
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Track claim status', 'Download policy copy', 'Book home visit'].map((label, index) => (
            <button key={label} className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm hover:shadow-card">
              <CalendarCheck className={`h-5 w-5 ${index === 0 ? 'text-green-cta' : index === 1 ? 'text-brand' : 'text-orange-tag'}`} />
              <span className="text-sm font-black">{label}</span>
            </button>
          ))}
        </div>
      </section>
      <CallbackDrawer isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </HealthQuoteSubpageLayout>
  )
}
