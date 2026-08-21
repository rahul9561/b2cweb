import { Link } from 'react-router-dom'
import {
  Facebook,
  Linkedin,
  Youtube,
  Lock,
  ShieldCheck,
  Instagram,
} from 'lucide-react'

import { FaXTwitter, FaPinterestP } from 'react-icons/fa6'
import { footerColumns } from '../data/navigation'
import rupayLogo from '../assets/images/rupay.png'
import paytmLogo from '../assets/images/paytm.svg'
import mastercardLogo from '../assets/images/mastercard.png'
import amexLogo from '../assets/images/american_express.svg'
import visaLogo from '../assets/images/visa.png'

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

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-pb grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-5 text-base font-semibold">{footerColumns.insurance.title}</h4>
          {footerColumns.insurance.groups.map((g) => (
            <div key={g.heading} className="mb-4">
              <p className="mb-2 text-[13px] font-medium text-white/80">{g.heading}</p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l}>
                    <Link to="/health-insurance" className="text-[13px] text-white/60 hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold">{footerColumns.calculators.title}</h4>
          <ul className="space-y-2.5">
            {footerColumns.calculators.links.map((l) => (
              <li key={l}>
                <Link to="/calculators" className="text-[13px] text-white/60 hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold">{footerColumns.resources.title}</h4>
          <ul className="space-y-2.5">
            {footerColumns.resources.links.map((l) => (
              <li key={l}>
                <Link to={resourceRoutes[l] ?? '/calculators'} className="text-[13px] text-white/60 hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold">{footerColumns.company.title}</h4>
          <ul className="space-y-2.5">
            {footerColumns.company.links.map((l) => (
              <li key={l}>
                <Link to={companyRoutes[l] ?? '/'} className="text-[13px] text-white/60 hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    <div className="border-t border-white/10">
  <div className="container-pb grid grid-cols-1 items-center gap-6 py-8 md:grid-cols-3">
    <div>
      <p className="mb-3 text-sm font-semibold">Payment Methods</p>
      <div className="flex flex-wrap gap-2">
        {paymentLogos.map((p) => (
          <span
            key={p.name}
            className="flex h-9 items-center justify-center rounded-[4px] border border-white/20 bg-white px-2.5 py-1 transition-colors duration-200 hover:border-white/40"
          >
            <img src={p.src} alt={p.name} className="h-4 w-auto object-contain" />
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-center gap-2 text-[13px] text-white/60 md:justify-self-center">
      <Lock size={16} className="text-green-tag" />
      Secured with PCI-DSS
      <ShieldCheck size={16} className="ml-4 text-green-tag" />
      Regulated by IRDAI
    </div>

 <div className="md:justify-self-end">
  <p className="mb-3 text-sm font-semibold">Follow us on</p>

  <div className="flex flex-wrap gap-3">
    {socialLinks.map(({ name, icon: Icon, url }) => (
      <a
        key={name}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Follow AV Management on ${name}`}
        title={name}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-brand"
      >
        <Icon size={16} />
      </a>
    ))}
  </div>
</div>
  </div>
</div>
      <div className="border-t border-white/10">
        <div className="container-pb flex flex-wrap gap-x-8 gap-y-2 py-6">
          {importantLinks.map((l) => (
            <Link key={l} to="/" className="text-[13px] text-white/60 underline hover:text-white">
              {l}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pb py-8 text-[12px] leading-6 text-white/50">
          <p>
            Company: AV Management | Email: info@help.com | Sales: 9917500023 | Service &amp;
            Claims: 9217010023
          </p>
          <p className="mt-3 font-medium text-white/70">
            BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS/FRAUDULENT OFFERS - IRDAI is not involved
            in activities like selling insurance policies, announcing bonus or investment of
            premiums. Public receiving such phone calls are requested to lodge a police complaint.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2">
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
