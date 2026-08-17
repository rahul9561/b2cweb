import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Smartphone,
  Globe,
  Menu,
  X,
  Phone,
} from 'lucide-react'
import avLogo from '../../assets/images/av-logon.png'

interface NavItem {
  label: string
  items: { label: string; badge?: string }[]
}

const navItems: NavItem[] = [
  {
    label: 'Term Insurance',
    items: [
      { label: 'Term Insurance Plan' },
      { label: 'Term Insurance Terminology' },
      { label: 'What Is Term Insurance' },
      { label: 'Term Insurance FAQ' },
      { label: 'Term Insurance For NRI', badge: 'New' },
      { label: 'Term Insurance For Women', badge: 'New' },
      { label: 'Term Insurance For Housewife' },
      { label: 'Best Term Insurance Plan' },
      { label: 'Life Insurance' },
      { label: '1 Crore Term Insurance' },
      { label: 'Term Insurance Calculator' },
      { label: 'Term Insurance Return Of Premium' },
      { label: 'Home Loan Insurance', badge: 'New' },
      { label: 'Home Loan Insurance Calculator', badge: 'New' },
      { label: 'Dedicated Claim Assistance', badge: 'New' },
      { label: 'Term Insurance For HNI', badge: 'New' },
      { label: 'Term Insurance Quotes' },
    ],
  },
  {
    label: 'Investment Plans',
    items: [
      { label: 'Investment Plans for NRIs' },
      { label: 'Investment Plans with High Returns' },
      { label: 'ULIP Plans' },
      { label: 'Best SIP Plans' },
      { label: 'Capital Guarantee Plans' },
      { label: 'Child Plans' },
      { label: 'Pension Plans' },
      { label: 'Guaranteed Return Plans' },
      { label: 'Tax Saving Investments' },
      { label: 'SIP Calculator' },
      { label: 'Endowment Policy' },
      { label: 'Money Back Policy' },
      { label: 'Annuity Plans' },
      { label: 'Income Tax Calculator' },
    ],
  },
  {
    label: 'Health Insurance',
    items: [
      { label: 'Health Insurance Plans for Family' },
      { label: 'Health Insurance for NRI' },
      { label: 'Senior Citizens Health Insurance' },
      { label: 'Health Insurance for Parents' },
      { label: 'Maternity Insurance' },
      { label: 'Network Hospitals' },
      { label: 'Health Insurance Portability' },
      { label: 'OPD Insurance' },
      { label: 'Mediclaim Policy' },
      { label: 'Critical Illness Insurance' },
      { label: 'Health Insurance Calculator' },
    ],
  },
  {
    label: 'Motor Insurance',
    items: [
      { label: 'Car Insurance' },
      { label: 'Bike Insurance' },
      { label: 'Zero Depreciation Cover' },
      { label: 'Third Party Car Insurance' },
      { label: 'Comprehensive Car Insurance' },
      { label: 'Car Insurance Calculator' },
      { label: 'Electric Car Insurance' },
      { label: 'E-Bike Insurance' },
      { label: 'IDV Calculator' },
      { label: 'Pay As You Drive' },
    ],
  },
  {
    label: 'Other Insurance',
    items: [
      { label: 'Travel Insurance' },
      { label: 'International Travel Insurance' },
      { label: 'Schengen Travel Insurance' },
      { label: 'Home Insurance' },
      { label: 'Home Loan Insurance' },
      { label: 'Home Loan EMI Calculator' },
      { label: 'Hull Insurance' },
      { label: 'Drone Insurance' },
      { label: 'Cargo Insurance' },
      { label: 'Group Insurance' },
      { label: 'Labour Insurance' },
      { label: 'Personal Cyber Insurance' },
      { label: 'Cancer Insurance' },
      { label: 'Defence Personnel Insurance' },
      { label: 'Pet Insurance' },
      { label: 'General Insurance' },
    ],
  },
  {
    label: 'Business Insurance',
    items: [
      { label: 'Group Health Insurance' },
      { label: 'Workmen Compensation' },
      { label: 'Professional Indemnity' },
      { label: 'Directors & Officers Liability' },
      { label: 'Commercial Vehicle Insurance' },
      { label: 'Marine Insurance' },
      { label: 'Fire Insurance' },
      { label: 'Cyber Insurance' },
    ],
  },
  {
    label: 'Renewal',
    items: [
      { label: 'Term Life Renewal' },
      { label: 'Investment Renewal' },
      { label: 'Health Renewal' },
      { label: 'Motor Renewal' },
      { label: 'Two Wheeler Renewal' },
      { label: 'Home Insurance Renewal' },
    ],
  },
]

const utilityLinks = [
  { label: 'Claim' },
  { label: 'Get The App', icon: Smartphone },
  { label: 'Language', icon: Globe, dropdown: true },
  { label: 'Sales: 1800-208-8787', phone: true },
  { label: 'Service: 1800-258-5970', phone: true },
  { label: 'Claims: 1800-258-5881', phone: true },
  { label: 'Contact Us' },
]

export default function SipHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-black shadow-lg">
      {/* Top utility row */}
      <div className="hidden border-b border-white/10 lg:block">
        <div className="container-pb flex h-8 items-center justify-end gap-5">
          {utilityLinks.map((u, i) => {
            const Icon = u.icon
            return (
              <span
                key={i}
                className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-white"
              >
                {Icon && <Icon size={12} />}
                {u.label}
                {u.dropdown && <ChevronDown size={10} />}
              </span>
            )
          })}
        </div>
      </div>

      {/* Main nav row */}
      <div className="container-pb flex h-[60px] items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} className="text-white" />
          </button>

          <Link to="/" className="flex items-center rounded-lg bg-black px-2 py-1.5">
            <img src={avLogo} alt="AV Management" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0 xl:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-[22px] text-[13px] font-medium text-white transition-colors hover:text-brand">
                  {item.label}
                  <ChevronDown size={12} />
                </button>
                <div
                  className={`absolute left-0 top-full z-50 w-72 bg-white shadow-card transition-all duration-200 ease-out ${
                    openDropdown === item.label
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible -translate-y-1 opacity-0'
                  }`}
                >
                  <ul className="max-h-[420px] overflow-y-auto p-2">
                    {item.items.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to="/sip-calculator"
                          className="flex items-center justify-between px-3 py-2 text-[12px] text-slate2-secondary transition-colors hover:bg-blueBG hover:text-brand"
                        >
                          {sub.label}
                          {sub.badge && (
                            <span className="rounded-full bg-green-tag px-1.5 py-0.5 text-[8px] font-bold text-white">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-[12px] font-bold text-white transition-colors hover:border-brand hover:text-brand"
            aria-label="Account"
          >
            TD
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-bold text-brand">
                AV <span className="text-navy">Management</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} className="text-navy" />
              </button>
            </div>
            <nav className="space-y-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block font-medium text-navy">
                Home
              </Link>
              {navItems.map((item) => (
                <div key={item.label}>
                  <p className="mb-1 mt-3 text-[13px] font-semibold text-navy">{item.label}</p>
                  <div className="space-y-1 pl-3">
                    {item.items.slice(0, 6).map((sub) => (
                      <Link
                        key={sub.label}
                        to="/sip-calculator"
                        onClick={() => setMobileOpen(false)}
                        className="block text-[12px] text-slate2-secondary hover:text-brand"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-4 flex gap-3 border-t border-slate2-border pt-4">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-2.5 text-[13px] font-medium text-brand">
                  <Phone size={14} />
                  Talk to Expert
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-[13px] font-bold text-white">
                  <Smartphone size={14} />
                  Get App
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}