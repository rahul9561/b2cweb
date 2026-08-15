import { Users } from 'lucide-react'

interface CoverTillPopoverContentProps {
  selected: string
  onSelect: (val: string) => void
}

const recommendedAges = [
  { age: '60 Years', percent: 42 },
  { age: '65 Years', percent: 28 },
  { age: '70 Years', percent: 18 },
]

export default function CoverTillPopoverContent({ selected, onSelect }: CoverTillPopoverContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Recommended header */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Recommended Age
      </p>

      <div className="h-px bg-gray-200 mb-4" />

      {/* Recommended age cards */}
      <div className="space-y-2 mb-4">
        {recommendedAges.map((rec) => {
          const active = selected === rec.age
          return (
            <button
              key={rec.age}
              onClick={() => onSelect(rec.age)}
              className={`w-full rounded-xl p-3 text-left transition-all ${
                active
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-white border border-gray-100 hover:border-brand/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-extrabold ${active ? 'text-white' : 'text-navy'}`}>
                    {rec.age}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${active ? 'text-white/80' : 'text-gray-400'}`}>
                    Recommended
                  </p>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
                }`}>
                  <Users className="h-3 w-3" />
                  {rec.percent}% customers
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tip box */}
      <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 mb-3">
        <p className="text-[11px] text-navy leading-relaxed">
          Covering yourself till <span className="font-bold">age 60-65</span> ensures protection through your working years when your family depends on your income.
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Whole life link */}
      <button className="mt-2 w-full rounded-lg border border-brand/20 bg-brand/5 py-2.5 text-[12px] font-bold text-brand hover:bg-brand/10 transition-colors">
        Switch to Whole Life Cover
      </button>
    </div>
  )
}
