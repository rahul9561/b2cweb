import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Facebook,
  Linkedin,
  Youtube,
  Lock,
  ShieldCheck,
  Instagram,
  ArrowRight,
} from 'lucide-react'

import { FaXTwitter, FaPinterestP } from 'react-icons/fa6'
import { footerColumns } from '../data/navigation'
import rupayLogo from '../assets/images/rupay.png'
import paytmLogo from '../assets/images/paytm.svg'
import mastercardLogo from '../assets/images/mastercard.png'
import amexLogo from '../assets/images/american_express.svg'
import visaLogo from '../assets/images/visa.png'
import ComingSoonModal from './ComingSoonModal'
import { SHOW_HOME_SECTIONS_COMING_SOON } from '../config/featureFlags'

const importantLinks = ['IRDAI', 'IRDAI Customer Education Website', 'Bima Bharosa']
const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/avmanagement23',
  },
  {
    name: 'X',
    icon: FaXTwitter,
    url: 'https://x.com/anandvardh71092',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/anand-vardhan-3a6964134/',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@avmanagement8133/',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/av_management23',
  },
  {
    name: 'Pinterest',
    icon: FaPinterestP,
    url: 'https://pin.it/4p2MV2Cna',
  },
]
const paymentLogos = [
  { name: 'Amex', src: amexLogo },
  { name: 'Visa', src: visaLogo },
  { name: 'Paytm', src: paytmLogo },
  { name: 'RuPay', src: rupayLogo },
  { name: 'Mastercard', src: mastercardLogo },
]

const companyRoutes: Record<string, string> = {
  'About Us': '/about-us',
  Careers: '/careers',
  'Legal & Admin policies': '/legal-and-admin-policies',
  'Contact us': '/contact-us',
}

const resourceRoutes: Record<string, string> = {
  Articles: '/category/credit-score',
  'Customer reviews': '/#customer-reviews',
}

const insuranceRoutes: Record<string, string> = {
  'Health Insurance': '/health-insurance',
  'Bike Insurance': '/bike-insurance',
  'Travel Insurance': '/travel-insurance',
  'Term Life Insurance': '/term-insurance',
  'Term Insurance(Women)': '/term-insurance-women',
  'Investment Plans': '/investment-plans',
  'Home Insurance': '/home-insurance',
  'Family Health Insurance': '/family-health-insurance',
}

export default function Footer() {
  const [comingSoonFeature, setComingSoonFeature] = useState('')

  return (
    <footer className="bg-gradient-to-b from-navy via-slate-950 to-black text-white">
      <ComingSoonModal
        isOpen={Boolean(comingSoonFeature)}
        onClose={() => setComingSoonFeature('')}
        featureName={comingSoonFeature}
      />
      <div className="container-pb grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" /> {footerColumns.insurance.title}
          </h4>
          {footerColumns.insurance.groups.map((g) => (
            <div key={g.heading} className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{g.heading}</p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l}>
                    <Link
                      to={insuranceRoutes[l] ?? '/'}
                      onClick={(event) => {
                        if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                        event.preventDefault()
                        setComingSoonFeature(l)
                      }}
                      className="group inline-flex items-center gap-1 text-xs text-slate-300 transition-colors hover:text-brand"
                    >
                      <ArrowRight size={10} className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                      <span>{l}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" /> {footerColumns.calculators.title}
          </h4>
          <ul className="space-y-2.5">
            {footerColumns.calculators.links.map((l) => (
              <li key={l}>
                <Link
                  to="/calculators"
                  onClick={(event) => {
                    if (!SHOW_HOME_SECTIONS_COMING_SOON) return
                    event.preventDefault()
                    setComingSoonFeature(l)
                  }}
                  className="group inline-flex items-center gap-1 text-xs text-slate-300 transition-colors hover:text-brand"
                >
                  <ArrowRight size={10} className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  <span>{l}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" /> {footerColumns.resources.title}
          </h4>
          <ul className="space-y-2.5">
            {footerColumns.resources.links.map((l) => (
              <li key={l}>
                <Link to={resourceRoutes[l] ?? '/calculators'} className="group inline-flex items-center gap-1 text-xs text-slate-300 transition-colors hover:text-brand">
                  <ArrowRight size={10} className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  <span>{l}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" /> {footerColumns.company.title}
          </h4>
          <ul className="space-y-2.5">
            {footerColumns.company.links.map((l) => (
              <li key={l}>
                <Link to={companyRoutes[l] ?? '/'} className="group inline-flex items-center gap-1 text-xs text-slate-300 transition-colors hover:text-brand">
                  <ArrowRight size={10} className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  <span>{l}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-black/40">
        <div className="container-pb grid grid-cols-1 items-center gap-6 py-8 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">Accepted Payment Methods</p>
            <div className="flex flex-wrap gap-2">
              {paymentLogos.map((p) => (
                <span
                  key={p.name}
                  className="flex h-9 items-center justify-center rounded-lg border border-slate-700 bg-white/95 px-3 py-1 shadow-sm transition-all duration-200 hover:border-brand hover:scale-105"
                >
                  <img src={p.src} alt={p.name} className="h-4 w-auto object-contain" />
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-300 md:justify-self-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 px-3 py-1 text-emerald-400 ring-1 ring-emerald-500/30">
              <Lock size={14} /> PCI-DSS 256-bit Secure
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-950/60 px-3 py-1 text-blue-400 ring-1 ring-blue-500/30">
              <ShieldCheck size={14} /> IRDAI Regulated
            </span>
          </div>

          <div className="md:justify-self-end">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">Connect With Us</p>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow AV Management on ${name}`}
                  title={name}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition-all duration-300 hover:bg-brand hover:scale-110 hover:shadow-lg hover:shadow-brand/40"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-black/60">
        <div className="container-pb flex flex-wrap gap-x-8 gap-y-2 py-5 text-xs">
          {importantLinks.map((l) => (
            <Link key={l} to="/" className="font-semibold text-slate-400 underline transition-colors hover:text-white">
              {l}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-900 bg-black">
        <div className="container-pb py-8 text-xs leading-relaxed text-slate-400">
          <p className="font-semibold text-slate-300">
            Company: AV Management | Email: info@help.com | Sales: 9917500023 | Service &amp; Claims: 9217010023
          </p>
          <p className="mt-3 font-medium text-slate-400 leading-relaxed">
            BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS/FRAUDULENT OFFERS - IRDAI is not involved in activities like selling insurance policies, announcing bonus or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 text-slate-500 font-medium">
            <span>© Copyright 2026 AV Management. All Rights Reserved.</span>
            <span>|</span><Link to="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link>
            <span>|</span><Link to="/terms-and-conditions" className="hover:text-white hover:underline">Terms &amp; Conditions</Link>
            <span>|</span><Link to="/disclosure" className="hover:text-white hover:underline">Disclosure</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
