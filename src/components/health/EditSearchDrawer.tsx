import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Users, MapPin, AlertCircle } from 'lucide-react'
import { useHealthProfile } from '../../context/HealthProfileContext'
import { slideInRight } from '../../lib/motion'
import EditInsuredMembersDrawer from './EditInsuredMembersDrawer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function EditSearchDrawer({ isOpen, onClose }: Props) {
  const { state, dispatch } = useHealthProfile()
  const [subDrawer, setSubDrawer] = useState(false)

  const handleMembersSave = (members: string[], memberAges: Record<string, number>) => {
    dispatch({ type: 'SET_PROFILE', payload: { members, memberAges } })
    setSubDrawer(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main drawer */}
      <motion.div
        variants={slideInRight}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-y-0 right-0 z-10 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-bold text-navy">Edit your search</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Summary rows */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* Insured members */}
          <button
            onClick={() => setSubDrawer(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                <Users className="h-4.5 w-4.5 text-brand" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Insured members</p>
                <p className="text-sm font-semibold text-navy">
                  {state.members.map((m) => {
                    const age = state.memberAges[m.toLowerCase()]
                    return `${m}${age ? `(${age} yrs)` : ''}`
                  }).join(', ')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>

          {/* City */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-cta/10">
                <MapPin className="h-4.5 w-4.5 text-green-cta" />
              </div>
              <div>
                <p className="text-xs text-gray-400">City</p>
                <p className="text-sm font-semibold text-navy">{state.city || 'Not set'}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>

          {/* Existing illness */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-tag/10">
                <AlertCircle className="h-4.5 w-4.5 text-orange-tag" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Existing illness</p>
                <p className="text-sm font-semibold text-navy">
                  {state.existingIllness.length > 0 ? state.existingIllness[0] : 'None'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Sub-drawer for members */}
      <AnimatePresence>
        {subDrawer && (
          <EditInsuredMembersDrawer
            isOpen={subDrawer}
            onClose={() => setSubDrawer(false)}
            onSave={handleMembersSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
