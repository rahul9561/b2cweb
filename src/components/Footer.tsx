import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Youtube, Lock, ShieldCheck, Instagram } from 'lucide-react'
import { footerColumns } from '../data/navigation'
import rupayLogo from '../assets/images/rupay.png'
import paytmLogo from '../assets/images/paytm.svg'
import mastercardLogo from '../assets/images/mastercard.png'
import amexLogo from '../assets/images/american_express.svg'
import visaLogo from '../assets/images/visa.png'

const importantLinks = ['IRDAI', 'IRDAI Customer Education Website', 'Bima Bharosa']

const paymentLogos = [
  { name: 'Amex', src: amexLogo },
  { name: 'Visa', src: visaLogo },
  { name: 'Paytm', src: paytmLogo },
  { name: 'RuPay', src: rupayLogo },
  { name: 'Mastercard', src: mastercardLogo },
]

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
                <Link to="/calculators" className="text-[13px] text-white/60 hover:text-white">
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
                <Link to="/" className="text-[13px] text-white/60 hover:text-white">
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
      <div className="flex gap-3">
        {[Facebook, Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
          <span
            key={i}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 hover:bg-brand"
          >
            <Icon size={16} />
          </span>
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
            Company: Policybazaar Insurance Brokers Private Limited | CIN: U74999HR2014PTC053454 |
            Registered office: Plot No. 119, Sector - 44, Gurugram, Haryana - 122003 | Composite
            Broker reg. no. 742 | Regd. ID: IRDA/DB 797/19 | Motilal Oswal &amp; PB Fintech Ltd -
            policybazaar.com
          </p>
          <p className="mt-3 font-medium text-white/70">
            BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS/FRAUDULENT OFFERS - IRDAI is not involved
            in activities like selling insurance policies, announcing bonus or investment of
            premiums. Public receiving such phone calls are requested to lodge a police complaint.
          </p>
          <p className="mt-4">
            © Copyright 2008-2026 policybazaar.com. All Rights Reserved. | Privacy Policy | Terms
            &amp; Conditions | Disclosure
          </p>
        </div>
      </div>
    </footer>
  )
}