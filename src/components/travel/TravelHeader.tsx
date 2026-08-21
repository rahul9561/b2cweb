import { Link, useLocation, useNavigate } from 'react-router-dom'
import avLogo from '../../assets/images/av-logon.png'

export default function TravelHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  const showPill = location.pathname.startsWith('/travel-insurance/quotes')
  const state = (location.state ?? {}) as any

  const members = (state.travellers ?? [{ id: 'g1' }]).reduce((s:any,g:any)=> s + 1 + (g.spouse?1:0) + (g.children?g.children.length:0),0)

  return (
    <header className="bg-black">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" aria-label="Go to AV Management home" className="flex items-center gap-4">
            <img src={avLogo} alt="AV Management" className="h-12 w-auto" />
          </Link>

          <nav className="flex items-center gap-6">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white">Talk to Expert</button>
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white">Sign in</button>
          </nav>
        </div>

        {showPill && (
          <div className="-mt-6 mb-4 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
              <div className="h-9 w-9 rounded-full border border-orange-300 grid place-items-center text-orange-500 font-semibold">AV</div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <span>—</span>
                <span className="opacity-60">|</span>
                <span>{members} members</span>
                <span className="opacity-60">|</span>
                <span>— - —</span>
              </div>
              <button onClick={() => navigate(location.pathname, { state: { ...(location.state ?? {}), editTravellers: true } })} className="ml-3 text-blue-600 font-semibold">Edit ▾</button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
