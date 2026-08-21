import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Minus, Plus, Users, X } from 'lucide-react'

export type TravellerChild = { id: string; age: number | null }
export type TravellerSpouse = { id: string; age: number | null }
export type TravellerGroup = {
  id: string
  age: number | null
  spouse: TravellerSpouse | null
  children: TravellerChild[]
}

export type TravellerDrawerDoneData = {
  travellerGroups: TravellerGroup[]
  hasPreExistingConditions: boolean
  preExistingMemberIds: string[]
}

type TravellerDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onDone: (data: TravellerDrawerDoneData) => void
}

const ADULT_AGES = Array.from({ length: 99 }, (_, index) => index + 1)
const CHILD_AGES = Array.from({ length: 18 }, (_, index) => index)

const createGroup = (baseId: string, age: number | null = null): TravellerGroup => ({
  id: baseId,
  age,
  spouse: null,
  children: [],
})

export function TravellerDrawer({ isOpen, onClose, onDone }: TravellerDrawerProps) {
  const [groups, setGroups] = useState<TravellerGroup[]>([createGroup('g1', 20)])
  const [openAgeMenu, setOpenAgeMenu] = useState<string | null>('g1')
  const [preExistingChoice, setPreExistingChoice] = useState<'yes' | 'no'>('no')
  const [selectedPreExisting, setSelectedPreExisting] = useState<string[]>([])
  const [validationError, setValidationError] = useState('')

 

  const addTraveller = () => {
    setGroups((current) => [...current, createGroup(`g${current.length + 1}`)])
  }

  const removeTraveller = (groupId: string) => {
    setGroups((current) => {
      if (current.length <= 1) return current
      return current.filter((group) => group.id !== groupId)
    })
  }

  const updateGroup = (groupId: string, updater: (group: TravellerGroup) => TravellerGroup) => {
    setGroups((current) => current.map((group) => (group.id === groupId ? updater(group) : group)))
  }

  const addSpouse = (groupId: string) => {
    updateGroup(groupId, (group) => ({ ...group, spouse: { id: `${groupId}-spouse`, age: 22 } }))
  }

  const removeSpouse = (groupId: string) => {
    updateGroup(groupId, (group) => ({ ...group, spouse: null }))
  }

  const addChild = (groupId: string) => {
    updateGroup(groupId, (group) => {
      const nextChildIndex = group.children.length + 1
      return {
        ...group,
        children: [...group.children, { id: `${groupId}-child-${nextChildIndex}`, age: 2 }],
      }
    })
  }

  const removeChild = (groupId: string, childId: string) => {
    updateGroup(groupId, (group) => ({
      ...group,
      children: group.children.filter((child) => child.id !== childId),
    }))
  }

  const updateAge = (groupId: string, age: number | null, field: 'age' | 'spouse' | 'child', childId?: string) => {
    if (field === 'age') {
      updateGroup(groupId, (group) => ({ ...group, age }))
      return
    }

    if (field === 'spouse') {
      updateGroup(groupId, (group) => ({ ...group, spouse: age === null ? null : { id: `${groupId}-spouse`, age } }))
      return
    }

    if (field === 'child' && childId) {
      updateGroup(groupId, (group) => ({
        ...group,
        children: group.children.map((child) => (child.id === childId ? { ...child, age } : child)),
      }))
    }
  }

  const handleDone = () => {
    const hasMissingAge = groups.some((group) => {
      if (group.age === null || group.age === undefined) return true
      if (group.spouse && (group.spouse.age === null || group.spouse.age === undefined)) return true
      return group.children.some((child) => child.age === null || child.age === undefined)
    })

    if (hasMissingAge) {
      setValidationError('Please select an age for every traveller before continuing.')
      return
    }

    onDone({
      travellerGroups: groups,
      hasPreExistingConditions: preExistingChoice === 'yes',
      preExistingMemberIds: selectedPreExisting,
    })
    onClose()
  }

 

  const showConditionOptions = preExistingChoice === 'yes'

  const familyMembers: Array<{ section: string; members: Array<{ id: string; label: string }> }> = []

  groups.forEach((group, index) => {
    const members: Array<{ id: string; label: string }> = []
    const groupIndex = index + 1

    members.push({ id: `${group.id}-self`, label: `Traveller ${groupIndex}, ${group.age} years` })

    if (group.spouse && group.spouse.age) {
      members.push({ id: `${group.id}-spouse`, label: `Traveller ${groupIndex}'s Spouse, ${group.spouse.age} years` })
    }

    group.children.forEach((child, childIndex) => {
      if (child.age) {
        members.push({ id: child.id, label: `Traveller ${groupIndex}'s Child ${childIndex + 1}, ${child.age} years` })
      }
    })

    if (members.length > 1 || groups.length === 1) {
      familyMembers.push({ section: members.length > 1 ? `Family ${index + 1}` : 'Individual', members })
    } else {
      familyMembers.push({ section: 'Individual', members })
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50">
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className="ml-auto flex h-full w-full max-w-[470px] flex-col bg-white shadow-2xl"
      >
        <div className="p-5 pb-0">
          <button type="button" onClick={onClose} className="float-right rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X size={26} />
          </button>

          <h2 className="mt-2 text-[22px] font-bold text-navy">How many travellers?</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {groups.map((group, groupIndex) => {
              const ageMenuOpen = openAgeMenu === group.id
              const groupLabel = groupIndex === 0 ? 'Traveller 1' : `Traveller ${groupIndex + 1}`

              return (
                <div key={group.id} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-navy">{groupLabel}</p>
                    {groupIndex > 0 && (
                      <button type="button" onClick={() => removeTraveller(group.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                        <Minus size={16} />
                      </button>
                    )}
                  </div>

                  <div className="relative mt-3">
                    <button
                      type="button"
                      onClick={() => setOpenAgeMenu(ageMenuOpen ? null : group.id)}
                      className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-3 text-left text-[14px] text-navy"
                    >
                      <span className={group.age ? 'text-navy' : 'text-slate-400'}>
                        {group.age ? `${group.age} years` : `Select age of ${groupLabel.toLowerCase()}`}
                      </span>
                      <ChevronDown size={16} className="text-slate-500" />
                    </button>

                    {ageMenuOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                        {ADULT_AGES.map((age) => (
                          <button
                            key={`${group.id}-${age}`}
                            type="button"
                            onClick={() => {
                              updateAge(group.id, age, 'age')
                              setOpenAgeMenu(null)
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-[14px] ${group.age === age ? 'bg-brand/5 text-brand' : 'text-navy'}`}
                          >
                            <span>{age} years</span>
                            {group.age === age && <Check size={14} className="text-brand" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-[12px] font-medium text-brand">
                    {!group.spouse && (
                      <button type="button" onClick={() => addSpouse(group.id)} className="inline-flex items-center gap-1">
                        <Plus size={14} /> Add Spouse
                      </button>
                    )}

                    {group.spouse && (
                      <div className="w-full">
                        <div className="mb-2 flex items-center justify-between text-red-500">
                          <button type="button" onClick={() => removeSpouse(group.id)} className="inline-flex items-center gap-1">
                            <Minus size={14} /> Remove Spouse
                          </button>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenAgeMenu(`${group.id}-spouse`)}
                            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-3 text-left text-[14px] text-navy"
                          >
                            <span className={group.spouse.age ? 'text-navy' : 'text-slate-400'}>
                              {group.spouse.age ? `${group.spouse.age} years` : 'Select age of Spouse'}
                            </span>
                            <ChevronDown size={16} className="text-slate-500" />
                          </button>

                          {openAgeMenu === `${group.id}-spouse` && (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                              {ADULT_AGES.map((age) => (
                                <button
                                  key={`${group.id}-spouse-${age}`}
                                  type="button"
                                  onClick={() => {
                                    updateAge(group.id, age, 'spouse')
                                    setOpenAgeMenu(null)
                                  }}
                                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-[14px] ${group.spouse?.age === age ? 'bg-brand/5 text-brand' : 'text-navy'}`}
                                >
                                  <span>{age} years</span>
                                  {group.spouse?.age === age && <Check size={14} className="text-brand" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button type="button" onClick={() => addChild(group.id)} className="inline-flex items-center gap-1">
                      <Plus size={14} /> Add Children
                    </button>
                    <span className="text-[11px] text-slate-500">Under 18 yrs</span>
                  </div>

                  {group.children.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {group.children.map((child, childIndex) => (
                        <div key={child.id} className="rounded-lg border border-slate-200 bg-white p-2">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[12px] font-medium text-slate-600">Child {childIndex + 1}</span>
                            <button type="button" onClick={() => removeChild(group.id, child.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                              <Minus size={14} />
                            </button>
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenAgeMenu(`${group.id}-${child.id}`)}
                              className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-3 text-left text-[14px] text-navy"
                            >
                              <span className={child.age ? 'text-navy' : 'text-slate-400'}>
                                {child.age ? `${child.age} years` : `Select age of child ${childIndex + 1}`}
                              </span>
                              <ChevronDown size={16} className="text-slate-500" />
                            </button>

                            {openAgeMenu === `${group.id}-${child.id}` && (
                              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                                {CHILD_AGES.map((age) => (
                                  <button
                                    key={`${group.id}-${child.id}-${age}`}
                                    type="button"
                                    onClick={() => {
                                      updateAge(group.id, age, 'child', child.id)
                                      setOpenAgeMenu(null)
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-[14px] ${child.age === age ? 'bg-brand/5 text-brand' : 'text-navy'}`}
                                  >
                                    <span>{age} years</span>
                                    {child.age === age && <Check size={14} className="text-brand" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addChild(group.id)}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-brand"
                      >
                        <Plus size={14} /> Add Child
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <button type="button" onClick={addTraveller} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-[16px] font-semibold text-brand">
              <Plus size={18} /> Add Traveller
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[15px] font-semibold text-navy">
              Do any of the travellers have pre-existing medical conditions like high BP, diabetes, or any other health issues?
            </p>
            <p className="mt-2 text-[12px] text-slate-500">This helps us find the right plan for you</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreExistingChoice('yes')}
                className={`rounded-xl border px-4 py-3 text-[14px] font-semibold ${preExistingChoice === 'yes' ? 'border-brand bg-brand/5 text-brand' : 'border-slate-300 bg-white text-slate-600'}`}
              >
                <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${preExistingChoice === 'yes' ? 'border-brand bg-brand text-white' : 'border-slate-400 bg-white'} mr-2`}>
                  {preExistingChoice === 'yes' && <Check size={10} />}
                </span>
                Yes
              </button>

              <button
                type="button"
                onClick={() => setPreExistingChoice('no')}
                className={`rounded-xl border px-4 py-3 text-[14px] font-semibold ${preExistingChoice === 'no' ? 'border-brand bg-brand/5 text-brand' : 'border-slate-300 bg-white text-slate-600'}`}
              >
                <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${preExistingChoice === 'no' ? 'border-brand bg-brand text-white' : 'border-slate-400 bg-white'} mr-2`}>
                  {preExistingChoice === 'no' && <Check size={10} />}
                </span>
                No
              </button>
            </div>

            {showConditionOptions && (
              <div className="mt-5 rounded-xl bg-white p-3">
                <p className="mb-3 text-[13px] font-medium text-navy">Please select the travellers who have a pre-existing medical condition</p>

                {familyMembers.map(({ section, members }) => (
                  <div key={section} className="mb-4">
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <span>{section}</span>
                      <span className="flex-1 border-t border-slate-200" />
                    </div>

                    {members.map((member) => {
                      const checked = selectedPreExisting.includes(member.id)
                      return (
                        <label key={member.id} className="mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700">
                          <span>{member.label}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedPreExisting((current) =>
                                checked ? current.filter((id) => id !== member.id) : [...current, member.id],
                              )
                            }
                            className="h-4 w-4 accent-brand"
                          />
                        </label>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {validationError && <p className="mt-3 text-[12px] font-medium text-red-500">{validationError}</p>}
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <button type="button" onClick={handleDone} className="w-full rounded-xl bg-brand px-4 py-3 text-[18px] font-bold text-white shadow-lg shadow-brand/25">
            Done
          </button>
        </div>
      </motion.aside>
    </div>
  )
}

export const getTravellerSummary = (travellerGroups: TravellerGroup[]) => {
  const total = travellerGroups.reduce((count, group) => count + 1 + (group.spouse ? 1 : 0) + group.children.length, 0)

  if (!total) return 'Select travellers'
  return `${total} Traveller(s)`
}

export const canAddTravellers = (selectedCountries: { length: number }[], startDate: string, endDate: string) =>
  selectedCountries.length > 0 && Boolean(startDate) && Boolean(endDate)

export const getTravellerGroupDefault = () => createGroup('g1', 20)

export const getIconText = (label: string) => {
  const iconMap: Record<string, string> = {
    'Medical emergencies': '🩺',
    'Flight delays or cancellations': '✈️',
    'Lost baggage & passport': '🧳',
    'Theft or personal loss of belongings': '🛡️',
  }

  return iconMap[label] ?? '•'
}

export const renderTravelerBadge = (icon: 'Users' | 'Plus') => (icon === 'Users' ? <Users size={16} /> : <Plus size={16} />)
