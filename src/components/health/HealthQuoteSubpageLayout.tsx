import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Boxes,
  HelpCircle,
  MapPin,
  MessageCircle,
  Percent,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useHealthProfile } from '../../context/HealthProfileContext'
import HealthQuotesHeader from './HealthQuotesHeader'
import EditSearchDrawer from './EditSearchDrawer'

interface Props {
  children: ReactNode
}

interface SidebarProps {
  onEdit: () => void
}

const navItems = [
  { icon: Boxes, label: 'All plans', to: '/health-insurance/quotes' },
  { icon: ShieldCheck, label: 'Claim support', to: '/health-insurance/claim-support', badge: 'NEW' },
  { icon: HelpCircle, label: 'Help', to: '/health-insurance/help' },
  { icon: Percent, label: 'Discounts', to: '/health-insurance/discounts' },
]

function formatMembers(members: string[], ages: Record<string, number>) {
  if (!members.length) return 'Self (27)'
  return members
    .map((member) => {
      const age = ages[member.toLowerCase()]
      const label = member.charAt(0).toUpperCase() + member.slice(1)
      return `${label} (${age || (member.toLowerCase() === 'self' ? 27 : 30)})`
    })
    .join(', ')
}

export function HealthQuoteSidebar({ onEdit }: SidebarProps) {
  const { state: profile } = useHealthProfile()
  const { pathname } = useLocation()

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 rounded-[28px] bg-white p-4 shadow-[0_6px_18px_rgba(23,43,77,0.12)]">
        <div className="rounded-[18px] border border-slate2-border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-navy">Family details</h2>
            <button
              onClick={onEdit}
              className="text-xs font-bold text-green-cta hover:text-green-ctaDark"
            >
              Edit &gt;
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#fde4d8]">
                <Users className="h-5 w-5 text-[#9b4f35]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate2-secondary">Members to be insured</p>
                <p className="truncate text-sm font-bold text-navy">
                  {formatMembers(profile.members, profile.memberAges)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1c9]">
                <MapPin className="h-5 w-5 fill-yellow text-yellow" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate2-secondary">City</p>
                <p className="truncate text-sm font-bold text-navy">{profile.city || 'Kanpur Nagar'}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-6 space-y-3">
          {navItems.map((item) => {
            const active = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold transition-colors ${
                  active ? 'bg-[#ddf7e9] text-[#007a54]' : 'text-slate2-secondary hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? 'bg-white/60' : 'bg-transparent'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-[#007a54]' : 'text-gray-400'}`} />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded bg-[#ec0f80] px-1.5 py-0.5 text-[10px] font-black text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

function LegalFooter() {
  return (
    <footer className="mt-4 bg-white px-2 pb-7 pt-4 text-[10px] leading-relaxed text-slate2-muted">
      <div className="mx-auto max-w-6xl space-y-2">
        <p>* Discounts are provided by the insurance company as filed in the products.</p>
        <p>* Age analysis of number of claims paid as per IRDAI Annual Report 2021-22.</p>
        <p>
          AV Management claim support is provided for reasonable assistance in pursuance of the claim. For details,
          our 24x7 support can be reached at 1800-258-581. Settlement of the claim remains the responsibility of the
          insurance company in accordance with policy terms and conditions.
        </p>
        <p className="text-center">
          AV Management Insurance Brokers Private Limited | CIN: U74999HR2024PTC054544 | Registered Office:
          Plot No. 119, Sector - 44, Gurugram, Haryana - 122001
        </p>
        <p className="text-center">Contact Us | Legal and Admin Policies</p>
        <p className="text-center">Copyright 2026 AV Management. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default function HealthQuoteSubpageLayout({ children }: Props) {
  const [editSearchOpen, setEditSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#eef1f5] text-navy">
      <HealthQuotesHeader />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <HealthQuoteSidebar onEdit={() => setEditSearchOpen(true)} />

        <main className="min-w-0">{children}</main>
      </div>

      <button className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#5238ff] text-white shadow-soft transition-transform hover:scale-105">
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -right-1 top-2 rounded-full bg-green-cta px-1.5 py-0.5 text-[9px] font-black">
          AI
        </span>
      </button>

      <LegalFooter />
      <EditSearchDrawer isOpen={editSearchOpen} onClose={() => setEditSearchOpen(false)} />
    </div>
  )
}
