import { Info } from 'lucide-react'

interface LifeCoverPopoverContentProps {
  selected: string
  onSelect: (val: string) => void
}

export default function LifeCoverPopoverContent({ selected, onSelect }: LifeCoverPopoverContentProps) {

  return (
    <div className="flex h-full flex-col">
      {/* Recommended header */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Recommended Life Cover
      </p>

      <div className="h-px bg-gray-200 mb-4" />

      {/* Recommended amount card */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 mb-3">
        <p className="text-[11px] text-gray-400 mb-1">Based on your income</p>
        <p className="text-2xl font-extrabold text-navy">{selected || '1 Crore'}</p>
        <p className="text-[11px] text-gray-400 mt-1">Recommended cover</p>
      </div>

      {/* Tip box */}
      <div className="rounded-lg bg-orange-50 border border-orange-100 p-3 mb-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-orange-tag shrink-0 mt-0.5" />
        <p className="text-[11px] text-orange-tag leading-relaxed">
          A life cover of <span className="font-bold">10-15x your annual income</span> is recommended to protect your family's future.
        </p>
      </div>

      {/* Customers also buy */}
      <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 mb-3">
        <p className="text-[11px] font-semibold text-navy mb-2">Customers also buy</p>
        <div className="flex flex-wrap gap-1.5">
          {['50 Lacs', '75 Lacs', '1 Crore', '1.5 Crore'].map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                selected === opt
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-gray-200 text-navy hover:border-brand/30'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Calculate button */}
      <button className="mt-2 w-full rounded-lg border border-brand/20 bg-brand/5 py-2.5 text-[12px] font-bold text-brand hover:bg-brand/10 transition-colors">
        Calculate Ideal Life Cover →
      </button>
    </div>
  )
}
