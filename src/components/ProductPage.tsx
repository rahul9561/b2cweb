import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, BadgeCheck, Shield, Headphones, ArrowRight, Check } from 'lucide-react'
import QuoteForm from './QuoteForm'

export interface PlanRow {
  company: string
  plan: string
  cover: string
  premium: string
  tag?: string
}

export interface ProductPageData {
  product: string
  tagline: string
  description: string
  usps: { icon: 'price' | 'reliable' | 'claims'; title: string; sub: string }[]
  features: { title: string; desc: string }[]
  plans: PlanRow[]
  planNote: string
  steps: string[]
  faqs: { q: string; a: string }[]
  cta: string
}

const uspIcons = {
  price: BadgeCheck,
  reliable: Shield,
  claims: Headphones,
}

export default function ProductPage({ data }: { data: ProductPageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div>
      <Hero data={data} />
      <UspStrip usps={data.usps} />
      <Features features={data.features} />
      <PlansSection data={data} />
      <Steps steps={data.steps} />
      <FaqSection faqs={data.faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CtaBanner data={data} />
    </div>
  )
}

function Hero({ data }: { data: ProductPageData }) {
  return (
    <section className="bg-blueBG">
      <div className="container-pb py-10">
        <nav className="mb-5 flex items-center gap-1 text-[12px] text-slate2-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <span className="text-slate2-secondary">{data.product}</span>
        </nav>
        <div className="flex flex-col-reverse items-center gap-10 lg:flex-row">
          <div className="flex-1">
            <h1 className="text-3xl font-medium leading-tight text-navy lg:text-4xl">
              {data.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate2-secondary">
              {data.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary">Get Free Quotes</button>
              <Link to="/calculators" className="btn-outline">Calculate Premium</Link>
            </div>
          </div>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}

function UspStrip({ usps }: { usps: ProductPageData['usps'] }) {
  return (
    <section className="border-b border-slate2-border bg-white">
      <div className="container-pb grid gap-6 py-8 md:grid-cols-3">
        {usps.map((u) => {
          const Icon = uspIcons[u.icon]
          return (
            <div key={u.title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blueBG">
                <Icon size={24} className="text-brand" />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-navy">{u.title}</p>
                <p className="text-[13px] text-slate2-secondary">{u.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Features({ features }: { features: ProductPageData['features'] }) {
  return (
    <section className="container-pb py-14">
      <h2 className="section-title">Why buy {features[0] && 'it'} from Policybazaar?</h2>
      <span className="heading-accent" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-card bg-blueBGMuted p-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-card">
              <Check size={22} className="text-green-cta" />
            </div>
            <p className="mb-1.5 text-[15px] font-semibold text-navy">{f.title}</p>
            <p className="text-[13px] leading-5 text-slate2-secondary">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PlansSection({ data }: { data: ProductPageData }) {
  return (
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <h2 className="section-title">Best {data.product} plans</h2>
        <span className="heading-accent" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate2-secondary">
          Compare plans from leading insurers and choose the one that fits you best.
        </p>
        <div className="mt-10 overflow-x-auto rounded-card bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate2-border bg-blueBG">
                <th className="px-6 py-4 font-semibold text-navy">Insurer</th>
                <th className="px-6 py-4 font-semibold text-navy">Plan</th>
                <th className="px-6 py-4 font-semibold text-navy">Cover</th>
                <th className="px-6 py-4 font-semibold text-navy">Premium</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {data.plans.map((p) => (
                <tr key={p.plan} className="border-b border-slate2-border last:border-0 hover:bg-blueBG/50">
                  <td className="px-6 py-5 font-semibold text-navy">{p.company}</td>
                  <td className="px-6 py-5 text-slate2-secondary">
                    {p.plan}
                    {p.tag && <span className="ml-2 chip-green">{p.tag}</span>}
                  </td>
                  <td className="px-6 py-5 text-slate2-secondary">{p.cover}</td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-brand">{p.premium}</span>
                    <span className="text-[12px] text-slate2-muted">/year*</span>
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      to="/health-insurance"
                      className="rounded-lg bg-brand px-5 py-2.5 text-[13px] font-medium text-white hover:bg-brand-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-[12px] text-slate2-muted">{data.planNote}</p>
      </div>
    </section>
  )
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <section className="container-pb py-14">
      <h2 className="section-title">How to buy online</h2>
      <span className="heading-accent" />
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s} className="relative rounded-card bg-blueBG p-6">
            <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm font-medium text-navy">{s}</p>
            {i < steps.length - 1 && (
              <ArrowRight
                size={18}
                className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-slate2-muted md:block"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function FaqSection({
  faqs,
  openFaq,
  setOpenFaq,
}: {
  faqs: ProductPageData['faqs']
  openFaq: number | null
  setOpenFaq: (i: number | null) => void
}) {
  return (
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <span className="heading-accent" />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-card bg-white shadow-card">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-[15px] font-medium text-navy">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate2-secondary transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <p className="border-t border-slate2-border px-6 py-4 text-[13px] leading-6 text-slate2-secondary">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner({ data }: { data: ProductPageData }) {
  return (
    <section className="container-pb py-14">
      <div className="flex flex-col items-center justify-between gap-6 rounded-cardlg bg-navy p-10 text-white md:flex-row">
        <div>
          <h2 className="mb-2 text-2xl font-medium">{data.cta}</h2>
          <p className="text-sm text-white/70">Compare quotes from 51+ insurers in under 2 minutes.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary bg-brand">Get Started</button>
          <a href="tel:18002088787" className="btn-green">Call 1800-208-8787</a>
        </div>
      </div>
    </section>
  )
}
