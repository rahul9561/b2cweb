import { X } from 'lucide-react'
import type { HealthFilters } from '../../context/HealthFiltersContext'
import { getActiveFilterLabels } from '../../context/HealthFiltersContext'

interface Props {
  filters: HealthFilters
  onRemove: (field: keyof HealthFilters, value: string) => void
  onClearAll: () => void
}

export default function FilterChips({ filters, onRemove, onClearAll }: Props) {
  const labels = getActiveFilterLabels(filters)

  if (labels.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
      {labels.map((item) => (
        <button
          key={item.key}
          onClick={() => onRemove(item.field, item.key)}
          className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-[11px] font-medium text-brand transition-colors hover:bg-brand/10"
        >
          {item.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      {labels.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-[11px] font-semibold text-gray-400 hover:text-brand"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
