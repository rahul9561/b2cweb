import { Star } from 'lucide-react'

interface Props {
  active: boolean
  onToggle: () => void
}

export default function NewLaunchesFilter({ active, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
        active
          ? 'border-brand bg-brand/5 text-brand'
          : 'border-gray-200 text-navy hover:bg-gray-50'
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${active ? 'fill-brand text-brand' : ''}`} />
      New launches
    </button>
  )
}
