import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

const CORE_MEMBERS = ['Self', 'Wife', 'Son', 'Daughter', 'Father', 'Mother']
const EXTRA_MEMBERS = [
  'Grand Father',
  'Grand Mother',
  'Father-in-law',
  'Mother-in-law',
  'Brother',
  'Sister',
]

interface MemberSelectorProps {
  members: string[]
  onToggle: (m: string) => void
  showMore: boolean
  onToggleMore: () => void
}

export default function MemberSelector({
  members,
  onToggle,
  showMore,
  onToggleMore,
}: MemberSelectorProps) {
  const allMembers = showMore ? [...CORE_MEMBERS, ...EXTRA_MEMBERS] : CORE_MEMBERS

  return (
    <div className="w-full">
      <p className="mb-4 text-sm font-semibold text-navy">
        Select members you want to insure
      </p>

      {/* ── Core + extra member grid ── */}
      <div className="mb-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {allMembers.map((m) => {
            const selected = members.includes(m)
            return (
              <motion.button
                key={m}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggle(m)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-colors ${
                  selected
                    ? 'border-green-cta bg-green-cta/10 text-green-cta'
                    : 'border-gray-200 bg-white text-navy hover:border-gray-300'
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    selected
                      ? 'border-green-cta bg-green-cta text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="truncate">{m}</span>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ── More members toggle ── */}
      <button
        onClick={onToggleMore}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-green-cta"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-cta" />
        <span className="underline decoration-dashed underline-offset-2">
          {showMore ? 'Less members' : 'More members'}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            showMore ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  )
}
