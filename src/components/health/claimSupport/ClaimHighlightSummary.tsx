import { AlertTriangle, Heart } from 'lucide-react'

interface Props {
  problemFaced: string
  howWeHelped: string
}

export default function ClaimHighlightSummary({ problemFaced, howWeHelped }: Props) {
  return (
    <div className="space-y-4">
      {/* Problem faced */}
      <div className="rounded-xl border border-orange-tag/20 bg-orange-tag/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-tag/15">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-tag" />
          </div>
          <h4 className="text-sm font-bold text-navy">Problem faced</h4>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{problemFaced}</p>
      </div>

      {/* How we helped */}
      <div className="rounded-xl border border-green-cta/20 bg-green-cta/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-cta/15">
            <Heart className="h-3.5 w-3.5 text-green-cta" />
          </div>
          <h4 className="text-sm font-bold text-navy">How we helped</h4>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{howWeHelped}</p>
      </div>
    </div>
  )
}
