import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import avLogo from '../assets/images/av-logo.png'

/**
 * Reusable black header with AV Management logo.
 * Used from Part 2 onward (modals + plans page + thanks page) — NOT on /employee-group-health-insurance itself.
 */
export default function EmployeeFlowHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black shadow-lg">
      <div className="container-pb flex h-[60px] items-center justify-between">
        <Link to="/" className="flex items-center rounded-lg px-1 py-1">
          <img src={avLogo} alt="AV Management" className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = 'tel:9917500023')}
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:border-brand hover:text-brand"
          >
            <Phone size={14} className="text-brand" />
            Call us
          </button>
          <button className="rounded-full border border-white/20 px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:border-brand hover:text-brand">
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}



