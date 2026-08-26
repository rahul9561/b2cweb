import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  User,
  Shield,
  HeartPulse,
  Car,
  Bike,
  Plane,
  TrendingUp,
  FileText,
  Smartphone,
  RefreshCcw,
  Briefcase,
  Home,
  Wallet,
  Ship,
  BookOpen,
  Headphones,
  LockKeyhole,
  LifeBuoy,
  Gauge,
  FileSearch,
  BarChart3,
  ArrowUpRight,
  CreditCard,
  Building2,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'          // ← add
import { useWallet } from '../context/WalletContext'
import { getTotalBalance } from '../lib/walletApi'
import { insuranceMenu, renewMenu, claimMenu, creditScoreMenu, supportMenu, loansMenu } from '../data/navigation'
import type { MenuCategory } from '../data/navigation'
import logo from "../assets/images/av-logon.png";

// TEMPORARILY HIDDEN HEADER ITEMS:
// Change this value to `true` to show Insurance Products, Renew Your Policy, and Claim again.
const SHOW_INSURANCE_HEADER_ITEMS = false

const categoryMeta: { key: MenuCategory; label: string; icon: typeof Shield }[] = [
  { key: 'termInsurance', label: 'Term Insurance', icon: Shield },
  { key: 'investmentPlans', label: 'Investment Plans', icon: TrendingUp },
  { key: 'healthInsurance', label: 'Health Insurance', icon: HeartPulse },
  { key: 'carInsurance', label: 'Car Insurance', icon: Car },
]

const renewIcons: Record<string, typeof Shield> = {
  life: Shield,
  investment: TrendingUp,
  health: HeartPulse,
  motor: Car,
  twoWheeler: Bike,
  home: Home,
}

const insuranceLinks = [
  {
    label: 'Marine Insurance',
    href: 'https://www.policyboss.com/marine-insurance',
    icon: Ship,
  },
  {
    label: 'Health Insurance',
    href: 'https://www.policyboss.com/health-insurance',
    icon: HeartPulse,
  },
  {
    label: 'Two-Wheeler Insurance',
    href: 'https://www.policyboss.com/two-wheeler-insurance',
    icon: Bike,
  },
]

const supportIcons: Record<string, typeof Shield> = {
  Articles: BookOpen,
  'Contact Us': Headphones,
  'Terms & Conditions': FileText,
  'Privacy Policy': LockKeyhole,
}

const creditReportIcons: Record<string, typeof Shield> = {
  'Cibil Report': Gauge,
  'Experian Report': FileSearch,
  'Equifax Report': BarChart3,
  'CRIF Report': Shield,
  'CIBIL Score': TrendingUp,
  'How to increase CIBIL Score': ArrowUpRight,
}

const loanIcons: Record<string, typeof Shield> = {
  'Personal/Instant Loan': Wallet,
  'Apply for Credit Card': CreditCard,
  'Business Loan': Building2,
  'Education Loan': GraduationCap,
}

const desktopNavButtonClass = 'group/nav flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:bg-white/[0.08] hover:text-white'
const desktopDropdownClass = 'invisible absolute left-0 top-[calc(100%-1px)] z-50 w-72 origin-top-left translate-y-2 scale-[0.98] overflow-hidden rounded-2xl border border-slate-200/90 bg-white opacity-0 shadow-[0_24px_65px_rgba(15,23,42,0.22)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100'
const dropdownHeaderClass = 'border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-4 py-3.5'
const dropdownLinkClass = 'group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-blue-50 hover:text-blue-700'
const dropdownIconClass = 'grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-200 group-hover/item:border-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:shadow-md'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, refreshProfile } = useAuth()
  const { wallet } = useWallet()
  const navigate = useNavigate()    
  const walletTotal = wallet ? getTotalBalance(wallet) : 0
  const formattedWalletTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(walletTotal)
  const openProfile = async () => {
    await refreshProfile().catch(() => undefined)
    setMobileOpen(false)
    navigate('/profile', { state: { profileRefreshed: true } })
  }
  const openWallet = async () => {
    await refreshProfile().catch(() => undefined)
    setMobileOpen(false)
    navigate('/wallet')
  }
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070b]/95 shadow-[0_12px_35px_rgba(2,6,23,0.24)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />
      <div className="mx-auto flex h-[60px] w-full max-w-[1920px] items-center justify-between px-3 sm:h-[74px] sm:px-5 lg:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-7 xl:gap-10">
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/80 shadow-sm transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>
<Link
    to="/"
   className="group/logo flex min-w-0 shrink items-center rounded-xl py-1 transition-opacity duration-300 hover:opacity-90 sm:ml-1 sm:shrink-0 sm:py-2"
>
    <img
        src={logo}
        alt="AV Management"
        className="h-10 max-w-[210px] object-contain transition-transform duration-300 group-hover/logo:scale-[1.015] sm:h-[58px] sm:max-w-none"
    />
</Link>
           <nav className="hidden items-center gap-1 lg:flex">
            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Credit Report
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className={desktopDropdownClass}>
                <div className={dropdownHeaderClass}>
                  <h3 className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-sm">
                      <TrendingUp size={17} />
                    </span>
                    Credit Report Services
                  </h3>
                </div>
                <ul className="space-y-0.5 p-2">
                  {creditScoreMenu.map((item) => {
                    const Icon = creditReportIcons[item.label] ?? TrendingUp
                    return (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className={dropdownLinkClass}
                        >
                          <span className={dropdownIconClass}>
                            <Icon size={15} />
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
<div className="group relative">
  <button className={desktopNavButtonClass}>
    Loans
    <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
  </button>

  <div className={desktopDropdownClass}>
    <div className={dropdownHeaderClass}>
      <h3 className="flex items-center gap-2 text-[13px] font-semibold text-navy">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-sm">
          <Briefcase size={17} />
        </span>
        Loan Services
      </h3>
    </div>
    <ul className="space-y-0.5 p-2">
      {loansMenu.map((item) => {
        const Icon = loanIcons[item.label] ?? Briefcase
        return (
          <li key={item.label}>
            <Link
              to={item.to}
              className={dropdownLinkClass}
            >
              <span className={dropdownIconClass}>
                <Icon size={15} />
              </span>
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  </div>
</div>
            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Insurance
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className={desktopDropdownClass}>
                <div className={dropdownHeaderClass}>
                  <h3 className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-sm">
                      <Shield size={17} />
                    </span>
                    Insurance Services
                  </h3>
                </div>
                <ul className="space-y-0.5 p-2">
                  {insuranceLinks.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={dropdownLinkClass}
                        >
                          <span className={dropdownIconClass}>
                            <Icon size={15} />
                          </span>
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            {SHOW_INSURANCE_HEADER_ITEMS && <>
            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Insurance Products
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-[calc(100%-1px)] z-50 w-[880px] origin-top-left translate-y-2 scale-[0.98] overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-0 shadow-[0_24px_65px_rgba(15,23,42,0.22)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                <div className="grid grid-cols-4 gap-6 p-6">
                  {categoryMeta.map((cat) => {
                    const data = insuranceMenu[cat.key]
                    const Icon = cat.icon
                    return (
                      <div key={cat.key}>
                        <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-brand">
                          <Icon size={16} />
                          <Link to={data.links[0].to} className="hover:underline">
                            {cat.label}
                          </Link>
                        </h3>
                        <ul className="space-y-1.5">
                          {data.links.slice(0, 10).map((l) => (
                            <li key={l.label}>
                              <Link
                                to={l.to}
                                className="text-[12px] text-slate2-secondary hover:text-brand"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Renew Your Policy
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className={`${desktopDropdownClass} w-60`}>
                <ul className="p-2">
                  {renewMenu.map((item) => {
                    const Icon = renewIcons[item.icon]
                    return (
                      <li key={item.label}>
                        <Link
                          to="/health-insurance"
                          className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate2-secondary hover:bg-blueBG hover:text-brand"
                        >
                          <Icon size={16} className="text-brand" />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Claim
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className={desktopDropdownClass}>
                <ul className="p-2">
                  {claimMenu.map((item) => (
                    <li key={item}>
                      <Link
                        to="/health-insurance"
                        className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate2-secondary hover:bg-blueBG hover:text-brand"
                      >
                        <FileText size={16} className="text-brand" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </>}

            <div className="group relative">
              <button className={desktopNavButtonClass}>
                Support
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>
              <div className={`${desktopDropdownClass} w-80`}>
                <div className={dropdownHeaderClass}>
                  <h3 className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-sm">
                      <LifeBuoy size={17} />
                    </span>
                    Account &amp; Service Help
                  </h3>
                </div>
                <ul className="space-y-0.5 p-2">
                  {supportMenu.accountService.map((l) => {
                    const Icon = supportIcons[l.label] ?? LifeBuoy
                    return (
                      <li key={l.label}>
                        <Link
                          to={l.to}
                          className={dropdownLinkClass}
                        >
                          <span className={dropdownIconClass}>
                            <Icon size={15} />
                          </span>
                          {l.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <div className="group relative hidden xl:block">
            <button className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-blue-500/50 bg-blue-500/10 px-4 py-2.5 text-[13px] font-semibold text-blue-300 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-950/30">
              <Phone size={15} />
              Talk to Expert
            </button>
            <div className="invisible absolute right-0 top-[calc(100%-1px)] z-50 w-80 origin-top-right translate-y-2 scale-[0.98] overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-0 shadow-[0_24px_65px_rgba(15,23,42,0.22)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <div className={dropdownHeaderClass}>
                <p className="flex items-center gap-2 text-[13px] font-bold text-navy"><Headphones size={16} className="text-blue-600" /> Speak with our experts</p>
              </div>
              <ul className="p-3">
                {[
                  { t: 'Helpline for buying a new policy', n: '9917500023' },
                  { t: 'Helpline for existing policy', n: '9217010023' },
                  { t: 'Helpline for claim', n: '9217010023' },
                ].map((p) => (
                  <li key={p.t}>
                    <a
                      href={`tel:${p.n.replace(/-/g, '')}`}
                      className="group/call flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-blue-50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 transition group-hover/call:bg-blue-600 group-hover/call:text-white"><Phone size={16} /></span>
                      <div>
                        <p className="text-[10px] text-slate2-muted">{p.t}</p>
                        <p className="text-[13px] font-semibold text-navy">{p.n}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
{isAuthenticated ? (
  <button
    onClick={openProfile}
    className="hidden items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-white/[0.11] hover:text-white sm:flex"
  >
    <User size={14} />
    Profile
  </button>
) : (
  <Link
    to="/login"
    className="hidden items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-white/[0.11] hover:text-white sm:flex"
  >
    <User size={14} />
    Sign in
  </Link>
)}
          {isAuthenticated && (
            <button
              onClick={openWallet}
              className="hidden items-center gap-2 whitespace-nowrap rounded-xl border border-blue-500/60 bg-gradient-to-r from-blue-600/25 to-indigo-600/20 px-4 py-2.5 text-[13px] font-bold text-blue-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-lg hover:shadow-blue-950/30 sm:flex"
              aria-label={`Wallet balance ${formattedWalletTotal}`}
            >
              <Wallet size={14} />
              {formattedWalletTotal}
            </button>
          )}
          <a
            href="https://play.google.com/store/search?q=av%20management&c=apps&hl=en_IN"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download AV Management App from Google Play"
            className="ml-1 flex max-w-[78px] shrink-0 flex-col items-center gap-1 rounded-xl border border-transparent px-2 py-1.5 text-center text-slate-200 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:ml-1 sm:max-w-[112px]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden="true"
            >
              <path d="M3 2.25v19.5L13.2 12 3 2.25Z" fill="#00D7FE" />
              <path d="m3 2.25 12.7 7.35-2.5 2.4L3 2.25Z" fill="#00F076" />
              <path d="m3 21.75 12.7-7.35-2.5-2.4L3 21.75Z" fill="#FFCE00" />
              <path d="m15.7 9.6 4.15 2.4-4.15 2.4-2.5-2.4 2.5-2.4Z" fill="#FF3A44" />
            </svg>
            <span className="text-[8px] font-medium leading-[9px] sm:text-[10px] sm:leading-[11px]">
              Download AV Management App
            </span>
          </a>
          {/* <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
          >
            <User size={14} />
            Sign in
          </Link> */}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[min(88vw,360px)] overflow-y-auto border-r border-white/10 bg-slate-50 p-5 shadow-[24px_0_70px_rgba(2,6,23,0.35)]">
                   <div className="-mx-5 -mt-5 mb-5 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#05070b] to-[#0c1630] px-5 py-4 shadow-lg">
  <Link to="/" onClick={() => setMobileOpen(false)}>
    <img
      src={logo}
      alt="AV Management"
      className="h-12 w-auto object-contain transition-transform hover:scale-[1.02]"
    />
  </Link>

  <button
    onClick={() => setMobileOpen(false)}
    aria-label="Close menu"
    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.07] transition hover:bg-white/[0.14]"
  >
    <X size={22} className="text-white" />
  </button>
</div>
            <nav className="space-y-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[13px] font-bold text-navy shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><Home size={16} /></span>
                Home
              </Link>
              {[
                { label: 'Credit Report', to: '/cibil-score', icon: TrendingUp },
                { label: 'Loans', to: '/cibil-score-loan', icon: Briefcase },
                ...(SHOW_INSURANCE_HEADER_ITEMS ? [
                  { label: 'Health Insurance', to: '/health-insurance', icon: HeartPulse },
                  { label: 'Term Insurance', to: '/term-insurance', icon: Shield },
                  { label: 'Car Insurance', to: '/car-insurance', icon: Car },
                  { label: 'Bike Insurance', to: '/bike-insurance', icon: Bike },
                  { label: 'Travel Insurance', to: '/travel-insurance', icon: Plane },
                  { label: 'Investment Plans', to: '/investment-plans', icon: TrendingUp },
                ] : []),
                { label: 'Calculators', to: '/calculators', icon: Briefcase },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[13px] font-semibold text-navy transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Icon size={16} className="text-brand" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <TrendingUp size={14} className="text-brand" />
                  Credit Report
                </p>
                <div className="space-y-1.5 pl-5">
                  {creditScoreMenu.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate2-secondary transition hover:bg-blue-50 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <Briefcase size={14} className="text-brand" />
                  Loans
                </p>
                <div className="space-y-1.5 pl-5">
                  {loansMenu.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate2-secondary transition hover:bg-blue-50 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <Shield size={14} className="text-brand" />
                  Insurance
                </p>
                <div className="space-y-1.5 pl-5">
                  {insuranceLinks.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate2-secondary transition hover:bg-blue-50 hover:text-brand"
                      >
                        <Icon size={14} className="text-brand" />
                        {item.label}
                      </a>
                    )
                  })}
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <LifeBuoy size={14} className="text-brand" />
                  Support
                </p>
                <div className="space-y-1">
                  {supportMenu.accountService.map((item) => {
                    const Icon = supportIcons[item.label] ?? LifeBuoy
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate2-secondary transition hover:bg-blue-50 hover:text-brand"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blueBG text-brand">
                          <Icon size={15} />
                        </span>
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
              {SHOW_INSURANCE_HEADER_ITEMS && <div className="mt-3 border-t border-slate2-border pt-3">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <RefreshCcw size={14} className="text-brand" />
                  Renew a Policy
                </p>
                <div className="space-y-1.5 pl-5">
                  {renewMenu.map((item) => (
                    <Link
                      key={item.label}
                      to="/health-insurance"
                      onClick={() => setMobileOpen(false)}
                      className="block text-[12px] text-slate2-secondary hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={openWallet}
                  className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3 text-[13px] font-bold text-blue-700 shadow-sm transition hover:border-blue-400"
                >
                  <span className="flex items-center gap-2"><Wallet size={16} /> Wallet</span>
                  <span>{formattedWalletTotal}</span>
                </button>
              )}
              <div className="flex gap-3 pt-2">
                {isAuthenticated ? (
  <button
    onClick={openProfile}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 text-[13px] font-bold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
  >
    <User size={14} />
    Profile
  </button>
) : (
  <Link
    to="/login"
    onClick={() => setMobileOpen(false)}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 text-[13px] font-bold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
  >
    <User size={14} />
    Sign in
  </Link>
)}
                {/* <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-2.5 text-[13px] font-medium text-brand"
                >
                  <User size={14} />
                  Sign in
                </Link> */}
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 py-3 text-[13px] font-bold text-white shadow-md shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600">
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
