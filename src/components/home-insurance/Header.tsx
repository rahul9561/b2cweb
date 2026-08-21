import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import avLogo from '../../assets/images/av-logo.png'

const logo = avLogo

export default function HomeInsuranceHeader() {
  const [talkToExpertOpen, setTalkToExpertOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black shadow-lg">
      <div className="container-pb flex h-[60px] items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-8">
          <Link
            to="/home-insurance"
            className="flex items-center rounded-lg bg-black px-3 py-2"
          >
            <img
              src={logo}
              alt="AV Management"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setTalkToExpertOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-white">☰</span>
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-0 lg:flex">
          {/* Main navigation can be added here */}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Talk to Expert */}
          <div className="group relative hidden xl:block">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white"
              onClick={() => setTalkToExpertOpen(true)}
            >
              <Phone size={14} />
              Talk to Expert
            </button>

            {/* Desktop tooltip */}
            <div className="invisible absolute right-0 top-full z-50 mt-2 w-80 bg-white opacity-0 shadow-card transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <ul className="p-3">
                <li className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <Phone size={14} className="text-brand" />
                  Helpline for buying a new policy: 9917500023
                </li>

                <li className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <Phone size={14} className="text-brand" />
                  Helpline for existing policy: 9217010023
                </li>

                <li className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                  <Phone size={14} className="text-brand" />
                  Helpline for claim: 9217010023
                </li>
              </ul>
            </div>
          </div>

          {/* Sign in */}
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-full border border-brand px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-navy"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Sign in
          </Link>
        </div>
      </div>

      {/* Mobile Talk to Expert menu */}
      {talkToExpertOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setTalkToExpertOpen(false)}
          />

          {/* Mobile drawer */}
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6">
            {/* Drawer header */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-bold text-brand">
                AV Management
              </span>

              <button
                type="button"
                onClick={() => setTalkToExpertOpen(false)}
                aria-label="Close menu"
                className="text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-navy"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contact options */}
            <div className="space-y-4">
              <button
                type="button"
                className="flex w-full items-center justify-start text-left text-[14px] font-medium text-brand hover:underline"
              >
                <Phone size={20} className="mr-2 text-brand" />
                Talk to Expert
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-start text-left text-[13px] text-slate-600 transition-colors hover:text-brand"
              >
                <Phone size={20} className="mr-2 text-brand" />
                Helpline for buying a new policy: 9917500023
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-start text-left text-[13px] text-slate-600 transition-colors hover:text-brand"
              >
                <Phone size={20} className="mr-2 text-brand" />
                Helpline for existing policy: 9217010023
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-start text-left text-[13px] text-slate-600 transition-colors hover:text-brand"
              >
                <Phone size={20} className="mr-2 text-brand" />
                Helpline for claim: 9217010023
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
