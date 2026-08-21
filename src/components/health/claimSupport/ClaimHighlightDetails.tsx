import { Shield, UserCheck, Calendar, Building2 } from 'lucide-react'

interface Props {
  policy: string
  relationshipManager: string
  dateOfClaim: string
  hospitalName: string
}

const details = [
  { key: 'policy', icon: Shield, label: 'Policy' },
  { key: 'relationshipManager', icon: UserCheck, label: 'Relationship Manager' },
  { key: 'dateOfClaim', icon: Calendar, label: 'Date of Claim' },
  { key: 'hospitalName', icon: Building2, label: 'Hospital Name' },
] as const

export default function ClaimHighlightDetails({ policy, relationshipManager, dateOfClaim, hospitalName }: Props) {
  const values: Record<string, string> = {
    policy,
    relationshipManager,
    dateOfClaim,
    hospitalName,
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {details.map(({ key, icon: Icon, label }) => (
        <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-brand" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
          </div>
          <p className="text-sm font-semibold text-navy leading-snug">{values[key]}</p>
        </div>
      ))}
    </div>
  )
}
