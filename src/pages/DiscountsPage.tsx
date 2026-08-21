import { useState } from 'react'
import {
  Briefcase,
  HeartPulse,
  Phone,
  Percent,
  ShieldCheck,
  Stethoscope,
  TicketPercent,
  Users,
} from 'lucide-react'
import HealthQuoteSubpageLayout from '../components/health/HealthQuoteSubpageLayout'
import CallbackDrawer from '../components/health/CallbackDrawer'

const discounts = [
  ['5% online discount', 'Available for customers who purchase their policy online.'],
  ['CIBIL discount', 'Available for customers with a good credit score.'],
  ['Good Health discount', 'Available for customers with good health status.'],
  ['Medical practitioner discount', 'Available for medical professionals such as doctors, nurses, and specialists.'],
  ['Long tenure discount', 'Available for customers opting for multi-year policies.'],
  ['Loyalty discount', 'Available for customers who hold another policy with the same insurer.'],
  ['Salaried customer discount', 'Available for salaried working professionals.'],
  ['Young family discount', 'Available where all insured members are aged up to thirty three years.'],
]

const icons = [Percent, ShieldCheck, HeartPulse, Stethoscope, TicketPercent, Users, Briefcase, Users]

export default function DiscountsPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)

  return (
    <HealthQuoteSubpageLayout>
      <section className="rounded-[20px] bg-[#eef1f5]">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black">Discounts</h1>
            <p className="mt-2 text-sm text-slate2-secondary">
              Talk to our advisor to know about how you can avail the discounts
            </p>
          </div>
          <button
            onClick={() => setCallbackOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff5630] px-7 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#ed4b27]"
          >
            <Phone className="h-4 w-4" /> Talk to our advisor &gt;
          </button>
        </div>

        <div className="grid gap-x-7 gap-y-5 md:grid-cols-2">
          {discounts.map(([title, desc], index) => {
            const Icon = icons[index]
            return (
              <div key={title} className="relative min-h-[86px] rounded-xl bg-white px-8 py-5 shadow-[0_7px_18px_rgba(23,43,77,0.15)]">
                <span className="absolute -left-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#eef1f5]" />
                <span className="absolute -right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#eef1f5]" />
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#ff4d3d] text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black">{title}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate2-secondary">{desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-9 flex flex-col gap-5 rounded-xl bg-[#fff0c7] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <TicketPercent className="mt-1 h-8 w-8 flex-shrink-0 text-[#ff5630]" />
            <p className="text-sm font-bold text-navy">
              Every discount may not be applicable based on your profile and selected plan. Please talk to our advisors
              to know which discounts are applicable to you.
            </p>
          </div>
          <button
            onClick={() => setCallbackOpen(true)}
            className="flex-shrink-0 rounded-lg bg-[#ff5630] px-8 py-3 text-sm font-black text-white"
          >
            Talk to our advisor &gt;
          </button>
        </div>
      </section>
      <CallbackDrawer isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </HealthQuoteSubpageLayout>
  )
}
