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
  LogOut,
  Wallet,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'          // ← add
import { useWallet } from '../context/WalletContext'
import { getTotalBalance } from '../lib/walletApi'
import LogoutConfirmModal from './LogoutConfirmModal'    
import { insuranceMenu, renewMenu, claimMenu, creditScoreMenu, supportMenu, loansMenu } from '../data/navigation'
import type { MenuCategory } from '../data/navigation'
import logo from "../assets/images/av-logon.png";
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)   // ← add
  const { isAuthenticated, logout } = useAuth()                       // ← add
  const { wallet } = useWallet()
  const navigate = useNavigate()    
  const walletTotal = wallet ? getTotalBalance(wallet) : 0
  const formattedWalletTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(walletTotal)
   const handleConfirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    setMobileOpen(false)
    navigate('/')
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black shadow-lg">
     <div className="flex h-[70px] w-full items-center justify-between px-1 lg:px-4">
        <div className="flex items-center gap-8">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} className="text-navy" />
          </button>
<Link
    to="/"
   className="ml-1 flex shrink-0 items-center rounded-lg bg-black py-2 pr-3"
>
    <img
        src={logo}
        alt="AV Management"
        className="h-14 w-auto object-contain"
    />
</Link>
          <nav className="hidden items-center gap-0 lg:flex">
            <div className="group relative">
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
                Credit Score
                <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-72 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <ul className="p-2">
                  {creditScoreMenu.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate2-secondary hover:bg-blueBG hover:text-brand"
                      >
                        <TrendingUp size={16} className="text-brand" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
<div className="group relative">
  <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
    Loans
    <ChevronDown size={14} />
  </button>

  <div className="invisible absolute left-0 top-full z-50 w-80 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
    <ul className="p-2">
      {loansMenu.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate2-secondary hover:bg-blueBG hover:text-brand"
          >
            <Briefcase size={16} className="text-brand" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
</div>
            <div className="group relative">
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
                Insurance Products
                <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-[880px] bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
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
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
                Renew Your Policy
                <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-60 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
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
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
                Claim
                <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-72 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
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

            <div className="group relative">
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-5 text-[14px] font-medium text-white hover:text-orange-400">
                Support
                <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-[520px] bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-6 p-6">
                  <div>
                    <h3 className="mb-3 text-[14px] font-semibold text-navy">
                      Account & Service Help
                    </h3>
                    <ul className="space-y-1.5">
                      {supportMenu.accountService.map((l) => (
                        <li key={l}>
                          <Link
                            to="/login"
                            className="text-[12px] text-slate2-secondary hover:text-brand"
                          >
                            {l}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-[14px] font-semibold text-navy">More</h3>
                    <ul className="space-y-1.5">
                      {supportMenu.more.map((l) => (
                        <li key={l}>
                          <Link
                            to="/login"
                            className="text-[12px] text-slate2-secondary hover:text-brand"
                          >
                            {l}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="group relative hidden xl:block">
            <button className="flex items-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white">
              <Phone size={14} />
              Talk to Expert
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-80 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <ul className="p-3">
                {[
                  { t: 'Helpline for buying a new policy', n: '9917500023' },
                  { t: 'Helpline for existing policy', n: '9217010023' },
                  { t: 'Helpline for claim', n: '9217010023' },
                ].map((p) => (
                  <li key={p.t}>
                    <a
                      href={`tel:${p.n.replace(/-/g, '')}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-blueBG"
                    >
                      <Phone size={16} className="text-brand" />
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
    onClick={() => setShowLogoutConfirm(true)}
    className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
  >
    <LogOut size={14} />
    Sign out
  </button>
) : (
  <Link
    to="/login"
    className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
  >
    <User size={14} />
    Sign in
  </Link>
)}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/wallet')}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
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
            className="ml-3 mr-1 flex max-w-[104px] shrink-0 flex-col items-center gap-0.5 text-center text-white transition-colors hover:text-orange-400"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M3 2.25v19.5L13.2 12 3 2.25Z" fill="#00D7FE" />
              <path d="m3 2.25 12.7 7.35-2.5 2.4L3 2.25Z" fill="#00F076" />
              <path d="m3 21.75 12.7-7.35-2.5-2.4L3 21.75Z" fill="#FFCE00" />
              <path d="m15.7 9.6 4.15 2.4-4.15 2.4-2.5-2.4 2.5-2.4Z" fill="#FF3A44" />
            </svg>
            <span className="text-[10px] font-medium leading-[11px]">
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-5">
                   <div className="-mx-5 -mt-5 mb-6 flex items-center justify-between bg-black px-5 py-4">
  <Link to="/" onClick={() => setMobileOpen(false)}>
    <img
      src={logo}
      alt="AV Management"
      className="h-12 w-auto object-contain"
    />
  </Link>

  <button
    onClick={() => setMobileOpen(false)}
    aria-label="Close menu"
  >
    <X size={22} className="text-white" />
  </button>
</div>
            <nav className="space-y-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block font-medium text-navy">
                Home
              </Link>
              {[
                { label: 'Credit Score', to: '/cibil-score', icon: TrendingUp },
                { label: 'Loans', to: '/cibil-score-loan', icon: Briefcase },
                { label: 'Health Insurance', to: '/health-insurance', icon: HeartPulse },
                { label: 'Term Insurance', to: '/term-insurance', icon: Shield },
                { label: 'Car Insurance', to: '/car-insurance', icon: Car },
                { label: 'Bike Insurance', to: '/bike-insurance', icon: Bike },
                { label: 'Travel Insurance', to: '/travel-insurance', icon: Plane },
                { label: 'Investment Plans', to: '/investment-plans', icon: TrendingUp },
                { label: 'Calculators', to: '/calculators', icon: Briefcase },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-navy hover:bg-blueBG"
                  >
                    <Icon size={16} className="text-brand" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="mt-3 border-t border-slate2-border pt-3">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <TrendingUp size={14} className="text-brand" />
                  Credit Score
                </p>
                <div className="space-y-1.5 pl-5">
                  {creditScoreMenu.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block text-[12px] text-slate2-secondary hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 border-t border-slate2-border pt-3">
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
                      className="block text-[12px] text-slate2-secondary hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 border-t border-slate2-border pt-3">
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
              </div>
              {isAuthenticated && (
                <Link
                  to="/wallet"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg border border-brand px-3 py-2.5 text-[13px] font-medium text-brand"
                >
                  <span className="flex items-center gap-2"><Wallet size={16} /> Wallet</span>
                  <span>{formattedWalletTotal}</span>
                </Link>
              )}
              <div className="flex gap-3 pt-2">
                {isAuthenticated ? (
  <button
    onClick={() => setShowLogoutConfirm(true)}
    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-2.5 text-[13px] font-medium text-brand"
  >
    <LogOut size={14} />
    Sign out
  </button>
) : (
  <Link
    to="/login"
    onClick={() => setMobileOpen(false)}
    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-2.5 text-[13px] font-medium text-brand"
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
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-cta bg-green-cta py-2.5 text-[13px] font-bold text-white">
                  <Smartphone size={14} />
                  Get App
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
            <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  )
}
