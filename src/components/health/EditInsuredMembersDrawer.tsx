import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, Check } from 'lucide-react'
import { useHealthProfile } from '../../context/HealthProfileContext'
import { stepSlide } from '../../lib/motion'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (members: string[], memberAges: Record<string, number>) => void
}

const ALL_MEMBERS = [
  'Self', 'Spouse', 'Child', 'Father', 'Mother',
  'Grand Father', 'Grand Mother', 'Father-in-law', 'Mother-in-law',
]

export default function EditInsuredMembersDrawer({ isOpen, onClose, onSave }: Props) {
  const { state } = useHealthProfile()
  const [selected, setSelected] = useState<string[]>(state.members.map((m) => m.charAt(0).toUpperCase() + m.slice(1)))
  const [ages, setAges] = useState<Record<string, number>>(state.memberAges)

  const toggle = (member: string) => {
    setSelected((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member],
    )
  }

  const setAge = (member: string, age: number) => {
    setAges((prev) => ({ ...prev, [member.toLowerCase()]: age }))
  }

  const canSave = selected.length > 0

  if (!isOpen) return null

  return (
    <motion.div
      variants={stepSlide(1)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-navy" />
        </button>
        <h3 className="flex-1 text-base font-bold text-navy">Edit insured members detail</h3>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {ALL_MEMBERS.map((member) => {
          const checked = selected.includes(member)
          const age = ages[member.toLowerCase()] || 18

          return (
            <div
              key={member}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                checked ? 'border-green-cta bg-green-cta/5' : 'border-gray-200'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(member)}
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  checked ? 'border-green-cta bg-green-cta text-white' : 'border-gray-300 bg-white'
                }`}
              >
                {checked && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>

              {/* Name */}
              <span className={`flex-1 text-sm font-medium ${checked ? 'text-navy' : 'text-gray-400'}`}>
                {member}
              </span>

              {/* Age select (only when checked) */}
              {checked && (
                <select
                  value={age}
                  onChange={(e) => setAge(member, Number(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-navy outline-none focus:border-brand"
                >
                  {Array.from({ length: 82 }, (_, i) => 18 + i).map((a) => (
                    <option key={a} value={a}>{a} yr</option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>

      {/* Continue button */}
      <div className="border-t border-gray-100 px-6 py-4">
        <button
          onClick={() => canSave && onSave(selected, ages)}
          disabled={!canSave}
          className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all ${
            canSave
              ? 'bg-orange-tag shadow-md hover:bg-orange-tag/90 active:scale-[0.98]'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}
