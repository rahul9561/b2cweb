import { ChevronDown } from 'lucide-react'
import { selectCountryLabel } from './DestinationPicker'

export default function TravelSummaryBar({ countries, startDate, endDate, members, onEdit }: any) {
  const countryLabel = (countries ?? []).map((c: any) => selectCountryLabel(c)).join(', ')
  const formatDate = (d: string) => {
    try {
      const dt = new Date(d)
      return dt.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
    } catch { return '' }
  }

  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="container-pb flex items-center gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="tw-brand-mark">AV</div>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-[13px]">
          <span>{countryLabel || '—'}</span>
          <span className="opacity-40">|</span>
          <span>{members} members</span>
          <span className="opacity-40">|</span>
          <span>{startDate ? formatDate(startDate) : '—'} - {endDate ? formatDate(endDate) : '—'}</span>
          <button onClick={onEdit} className="ml-3 text-brand font-semibold flex items-center gap-1">Edit <ChevronDown size={14} /></button>
        </div>
      </div>
    </div>
  )
}
