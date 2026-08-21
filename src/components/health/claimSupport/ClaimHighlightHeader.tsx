import { User, Facebook, Linkedin, Twitter, Globe } from 'lucide-react'

interface Props {
  name: string
  ageMasked: string
  age: number
  customerSince: number
  platformIcon: 'facebook' | 'linkedin' | 'twitter' | 'google'
}

const platformConfig = {
  facebook: { icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
  twitter: { icon: Twitter, label: 'X (Twitter)', color: 'text-sky-500' },
  google: { icon: Globe, label: 'Google', color: 'text-red-500' },
}

export default function ClaimHighlightHeader({ name, ageMasked, age, customerSince, platformIcon }: Props) {
  const { icon: PlatformIcon, label, color } = platformConfig[platformIcon]

  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        <User className="h-6 w-6" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold text-navy">{name}</h3>
          <span className="flex-shrink-0 text-xs text-gray-400">•</span>
          <span className="flex-shrink-0 text-xs text-gray-400">Age: {age}</span>
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">{ageMasked} • Customer since {customerSince}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <PlatformIcon className={`h-3.5 w-3.5 ${color}`} />
          <span className="text-xs font-medium text-gray-500">via {label}</span>
        </div>
      </div>
    </div>
  )
}
