import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/av-logon.png'

export default function HealthInsuranceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black shadow-lg">
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="AV Management"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <button className="flex items-center gap-2 rounded-full border border-green-cta/40 bg-green-cta/15 px-4 py-2 text-xs font-semibold text-green-cta transition-colors hover:bg-green-cta/25">
          <Phone className="h-3.5 w-3.5" />
          Help
        </button>
      </div>
    </header>
  )
}
