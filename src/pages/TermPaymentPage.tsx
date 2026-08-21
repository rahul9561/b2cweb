import { useLocation } from 'react-router-dom'
import PaymentGateway from '../components/payment/PaymentGateway'
 // ⚠️ adjust to your actual PaymentGateway path

export default function TermPaymentPage() {
  const location = useLocation()
  const { plan, premium } = (location.state ?? {}) as any

  return (
    <PaymentGateway
      product="term"
      planOverride={plan ? { insurerName: plan.insurerName, planName: plan.planName, id: plan.id } : undefined}
      premiumOverride={premium}
    />
  )
}