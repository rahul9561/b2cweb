import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import ActiveLoansSection from '../components/loans/ActiveLoansSection'
import { useAuth } from '../context/AuthContext'
import { useLoans } from '../context/LoansContext'

export default function CreditAnalysisLoansPage() {
  const { isAuthenticated } = useAuth()
  const { refreshLoans } = useLoans()

  useEffect(() => {
    if (isAuthenticated) void refreshLoans().catch(() => undefined)
  }, [isAuthenticated, refreshLoans])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <main className="min-h-screen bg-blueBGMuted py-9">
      <div className="container-pb mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate2-secondary hover:text-brand"><ArrowLeft size={16} /> Back to home</Link>
      </div>
      <ActiveLoansSection />
    </main>
  )
}
