import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, Star } from 'lucide-react'
import logo from '../assets/images/av-logon.png'

export default function BikeLoadingPage({ redirecting = false }: { redirecting?: boolean }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const reg = params.get('reg') || 'UP32FJ6317'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(redirecting ? '/bike-insurance/payment' : `/bike-insurance/quotes?reg=${reg}`)
    }, redirecting ? 1500 : 1300)
    return () => window.clearTimeout(timer)
  }, [navigate, redirecting, reg])

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-r from-[#eaf8ff] via-white to-[#f3f6ff] text-navy">
      <section className="w-full max-w-2xl px-4 text-center">
        <Link to="/" aria-label="Go to AV Management home"><img src={logo} alt="AV Management" className="mx-auto mb-12 h-14 w-auto" /></Link>
        <p className="mb-3 text-base">Please wait <LoadingDots /></p>
        <h1 className="text-2xl font-medium">{redirecting ? 'Redirecting you to payment gateway...' : 'Finding the best plans for you'}</h1>

        <div className="relative mx-auto my-24 h-16 max-w-lg border-b border-white">
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
          <motion.div animate={{ x: [-170, 170] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} className="absolute bottom-0 left-1/2">
            <Bike className="h-12 w-12 text-navy" />
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-4">
          <TrustCard title="We are rated" sub={<span className="text-yellow"><StarLine /></span>} />
          <TrustCard title="1.2 crore" sub="Bikes insured" />
          <TrustCard title="1.7 crore" sub="Policies sold" />
          <TrustCard title="20" sub="Insurance partners" />
        </div>
      </section>
    </main>
  )
}

function LoadingDots() {
  return <span className="font-black tracking-[0.4em]">...</span>
}

function StarLine() {
  return <>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="inline h-4 w-4 fill-yellow" />)}</>
}

function TrustCard({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate2-border bg-white p-5 shadow-sm">
      <p className="font-black">{title}</p>
      <p className="mt-2 text-xs text-slate2-secondary">{sub}</p>
    </div>
  )
}
