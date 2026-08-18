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
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'          // ← add
import LogoutConfirmModal from './LogoutConfirmModal'    
import { insuranceMenu, renewMenu, claimMenu, creditScoreMenu, supportMenu } from '../data/navigation'
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
  const navigate = useNavigate()    
   const handleConfirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    setMobileOpen(false)
    navigate('/')
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black shadow-lg">
      <div className="container-pb flex h-[60px] items-center justify-between">
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
    className="flex items-center bg-black rounded-lg px-3 py-2"
>
    <img
        src={logo}
        alt="AV Management"
        className="h-10 w-auto object-contain"
    />
</Link>
          <nav className="hidden items-center gap-0 lg:flex">
            <div className="group relative">
              <button className="flex items-center gap-1 px-3 py-8 text-[14px] font-medium text-white hover:text-orange-400">
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
              <button className="flex items-center gap-1 px-3 py-8 text-[14px] font-medium text-white hover:text-orange-400">
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
              <button className="flex items-center gap-1 px-3 py-8 text-[14px] font-medium text-white hover:text-orange-400">
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
              <button className="flex items-center gap-1 px-3 py-8 text-[14px] font-medium text-white hover:text-orange-400">
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
              <button className="flex items-center gap-1 px-3 py-8 text-[14px] font-medium text-white hover:text-orange-400">
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

        <div className="flex items-center gap-3">
          <div className="group relative hidden xl:block">
            <button className="flex items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white">
              <Phone size={14} />
              Talk to Expert
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-80 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <ul className="p-3">
                {[
                  { t: 'Helpline for buying a new policy', n: '1800-208-8787' },
                  { t: 'Helpline for existing policy', n: '1800-266-6644' },
                  { t: 'Helpline for claim', n: '1800-208-8787' },
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
    className="hidden items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
  >
    <LogOut size={14} />
    Sign out
  </button>
) : (
  <Link
    to="/login"
    className="hidden items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
  >
    <User size={14} />
    Sign in
  </Link>
)}
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
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-bold text-brand">
                policy<span className="text-navy">bazaar</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} className="text-navy" />
              </button>
            </div>
            <nav className="space-y-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block font-medium text-navy">
                Home
              </Link>
              {[
                { label: 'Credit Score', to: '/credit-score', icon: TrendingUp },
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
