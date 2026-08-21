import { SearchX, RotateCcw } from 'lucide-react'

interface Props {
  onReset: () => void
}

export default function EmptyState({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <SearchX className="h-8 w-8 text-gray-300" />
      </div>
      <h3 className="mb-2 text-base font-bold text-navy">No plans match your filters</h3>
      <p className="mb-5 max-w-xs text-sm text-gray-400">
        Try adjusting your filters or removing some to see more plans.
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark active:scale-[0.98] transition-all"
      >
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  )
}
