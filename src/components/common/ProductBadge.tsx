import { Shield, Heart, Car, TrendingUp } from 'lucide-react'

interface ProductBadgeProps {
  title: string
  ribbon: string
  icon: 'shield' | 'heart' | 'car' | 'trending'
  color: string
}

const iconMap = {
  shield: Shield,
  heart: Heart,
  car: Car,
  trending: TrendingUp,
}

export default function ProductBadge({ title, ribbon, icon, color }: ProductBadgeProps) {
  const Icon = iconMap[icon]

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer w-44">
      {/* Ribbon */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-tag px-3 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-sm">
        {ribbon}
      </div>

      {/* Icon */}
      <div className={`mt-2 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
      </div>

      {/* Title */}
      <span className="text-center text-xs font-semibold text-navy leading-tight">
        {title}
      </span>
    </div>
  )
}
