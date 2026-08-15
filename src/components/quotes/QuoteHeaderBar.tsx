import { User, ChevronDown, Scale } from 'lucide-react'
import { useUserProfile } from '../../context/UserProfileContext'

interface QuoteHeaderBarProps {
  onEditProfile: () => void
}

export default function QuoteHeaderBar({ onEditProfile }: QuoteHeaderBarProps) {
  const { profile } = useUserProfile()

  const calculateAge = (dob: string): number => {
    if (!dob) return 25
    const parts = dob.split('-')
    if (parts.length !== 3) return 25
    const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const genderLabel = profile.gender === 'male' ? 'Male' : 'Female'
  const age = calculateAge(profile.dob)
  const smokerLabel = profile.smoker === 'yes' ? 'Smoker' : 'Non-smoker'
  const incomeLabel = profile.annualIncome || '10 Lac to 14.9 Lac'

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-xs">
              AV
            </div>
            <span className="text-lg font-bold text-navy">AV Management</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-tagBg px-3 py-1 text-[10px] font-semibold text-orange-tag">
            <span>GST Bachat Utsav</span>
            <span className="line-through opacity-60">18% GST</span>
            <span>→ Now 0%</span>
          </div>
        </div>

        {/* Center - Compare */}
        <button className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-navy hover:bg-gray-50 transition-colors">
          <Scale className="h-4 w-4" />
          Compare Plans
        </button>

        {/* Right - Profile Chip */}
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
            <User className="h-4 w-4 text-brand" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-navy">
              {genderLabel} | {age} yrs | {smokerLabel} | {incomeLabel}
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
