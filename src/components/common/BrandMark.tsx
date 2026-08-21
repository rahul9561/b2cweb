interface BrandMarkProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const brandColors: Record<string, string> = {
  'CareShield Health': 'bg-blue-600',
  'TrustCare General': 'bg-emerald-600',
  'Wellness Assure': 'bg-violet-600',
  'Guardian Health Plus': 'bg-sky-600',
  'PureLife Insurance': 'bg-amber-600',
  'NivaBupa Health': 'bg-rose-600',
  'HDFC Ergo Health': 'bg-indigo-600',
  'Star Health Premier': 'bg-teal-600',
  'Horizon Life': 'bg-blue-600',
  'Trustwell Life': 'bg-emerald-600',
  'NorthStar Life': 'bg-violet-600',
  'Bluepeak Life': 'bg-sky-600',
  'Evershield Life': 'bg-amber-600',
  'ClearView Life': 'bg-rose-600',
}

export default function BrandMark({ name, size = 'md' }: BrandMarkProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const colorClass = brandColors[name] || 'bg-gray-600'

  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={`${colorClass} ${sizes[size]} flex items-center justify-center rounded-xl text-white font-bold shadow-sm`}
    >
      {initials}
    </div>
  )
}
