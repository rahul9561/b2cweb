import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Search, X } from 'lucide-react'

export type CountrySelection = {
  id: string
  name: string
  label: string
  imageWebp: string
  imageJpg: string
  isSchengenGroup?: boolean
  schengenCountries?: string[]
}

type DestinationPickerProps = {
  value: CountrySelection[]
  onChange: (countries: CountrySelection[]) => void
}

const makeCountryImage = (countryName: string) => ({
  imageWebp: `https://static.pbcdn.in/travel-cdn/images/country/${countryName}.webp`,
  imageJpg: `https://static.pbcdn.in/travel-cdn/images/country/${countryName}.jpg`,
})

const schengenCountries = [
  'France',
  'Germany',
  'Netherlands',
  'Italy',
  'Switzerland',
  'Spain',
  'Austria',
  'Finland',
  'Liechtenstein',
  'Belgium',
  'Portugal',
  'Greece',
  'Luxembourg',
  'Slovakia',
  'Slovenia',
  'Croatia',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Malta',
  'Czechia',
  'Poland',
  'Hungary',
  'Norway',
]

const COUNTRY_OPTIONS: CountrySelection[] = [
  {
    id: 'schengen',
    name: 'Schengen',
    label: 'Schengen',
    ...makeCountryImage('Schengen'),
    isSchengenGroup: true,
    schengenCountries: schengenCountries,
  },
  { id: 'uae', name: 'UAE', label: 'UAE', ...makeCountryImage('United_Arab_Emirates') },
  { id: 'thailand', name: 'Thailand', label: 'Thailand', ...makeCountryImage('Thailand') },
  { id: 'usa', name: 'USA', label: 'USA', ...makeCountryImage('USA') },
  { id: 'france', name: 'France', label: 'France', ...makeCountryImage('France') },
  { id: 'uk', name: 'United Kingdom', label: 'United Kingdom', ...makeCountryImage('United_Kingdom') },
  { id: 'germany', name: 'Germany', label: 'Germany', ...makeCountryImage('Germany') },
  { id: 'netherlands', name: 'Netherlands', label: 'Netherlands', ...makeCountryImage('Netherlands') },
  { id: 'italy', name: 'Italy', label: 'Italy', ...makeCountryImage('Italy') },
  { id: 'switzerland', name: 'Switzerland', label: 'Switzerland', ...makeCountryImage('Switzerland') },
  { id: 'spain', name: 'Spain', label: 'Spain', ...makeCountryImage('Spain') },
  { id: 'austria', name: 'Austria', label: 'Austria', ...makeCountryImage('Austria') },
  { id: 'finland', name: 'Finland', label: 'Finland', ...makeCountryImage('Finland') },
  { id: 'liechtenstein', name: 'Liechtenstein', label: 'Liechtenstein', ...makeCountryImage('Liechtenstein') },
  { id: 'singapore', name: 'Singapore', label: 'Singapore', ...makeCountryImage('Singapore') },
  { id: 'brazil', name: 'Brazil', label: 'Brazil', ...makeCountryImage('Brazil') },
  { id: 'australia', name: 'Australia', label: 'Australia', ...makeCountryImage('Australia') },
  { id: 'canada', name: 'Canada', label: 'Canada', ...makeCountryImage('Canada') },
  { id: 'japan', name: 'Japan', label: 'Japan', ...makeCountryImage('Japan') },
  { id: 'new-zealand', name: 'New Zealand', label: 'New Zealand', ...makeCountryImage('New_Zealand') },
]

const popularCountryIds = ['schengen', 'uae', 'thailand', 'usa', 'france', 'uk']

export function DestinationPicker({ value, onChange }: DestinationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [schengenOpen, setSchengenOpen] = useState(false)
  const [schengenDraft, setSchengenDraft] = useState<string[]>([])
  const [schengenQuery, setSchengenQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSchengenOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    // Close dropdown on Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setIsOpen(false); setSchengenOpen(false) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const chipEntries = useMemo(() => {
    return value.flatMap((item) => {
      if (item.isSchengenGroup && item.schengenCountries?.length) {
        return item.schengenCountries.map((country) => ({
          id: `${item.id}-${country}`,
          label: country,
        }))
      }

      return [{ id: item.id, label: item.label }]
    })
  }, [value])

  const filteredCountries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return COUNTRY_OPTIONS

    return COUNTRY_OPTIONS.filter((country) => {
      const haystack = `${country.label} ${country.name}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [searchTerm])

  const popularCountries = useMemo(
    () => COUNTRY_OPTIONS.filter((country) => popularCountryIds.includes(country.id)),
    [],
  )

  const isSelected = (country: CountrySelection) => {
    if (country.isSchengenGroup) {
      return value.some((item) => item.id === 'schengen')
    }

    return value.some((item) => item.id === country.id)
  }

  const getDisplayLabel = (country: CountrySelection) => {
    if (country.isSchengenGroup) {
      const schengen = value.find((item) => item.id === 'schengen')
      if (schengen?.schengenCountries?.length) {
        return `Schengen(${schengen.schengenCountries.length})`
      }
    }
    return country.label
  }

  const toggleCountry = (country: CountrySelection) => {
    if (country.isSchengenGroup) {
      const currentSchengen = value.find((item) => item.id === 'schengen')
      setSchengenDraft(currentSchengen?.schengenCountries ?? [])
      setSchengenOpen(true)
      return
    }

    const nextValue = value.filter((item) => item.id !== country.id)
    if (!isSelected(country)) {
      nextValue.push(country)
    }
    onChange(nextValue)
  }

  const removeChip = (chipId: string) => {
    const schengenGroup = value.find((item) => item.id === 'schengen')

    if (chipId.startsWith('schengen-') && schengenGroup?.schengenCountries?.length) {
      const countryName = chipId.replace('schengen-', '')
      const nextSchengenCountries = (schengenGroup.schengenCountries ?? []).filter((country) => country !== countryName)

      if (!nextSchengenCountries.length) {
        onChange(value.filter((item) => item.id !== 'schengen'))
        return
      }

      const nextValue = value.map((item) =>
        item.id === 'schengen'
          ? { ...item, label: `Schengen(${nextSchengenCountries.length})`, schengenCountries: nextSchengenCountries }
          : item,
      )
      onChange(nextValue)
      return
    }

    // For non-Schengen chips, chipId IS the country id (e.g. 'uae', 'new-zealand')
    const nextValue = value.filter((item) => item.id !== chipId)
    onChange(nextValue)
  }

  const commitSchengenSelection = () => {
    const nextValue = value.filter((item) => item.id !== 'schengen')

    if (!schengenDraft.length) {
      onChange(nextValue)
      setSchengenOpen(false)
      return
    }

    onChange([
      ...nextValue,
      {
        id: 'schengen',
        name: 'Schengen',
        label: `Schengen(${schengenDraft.length})`,
        ...makeCountryImage('Schengen'),
        isSchengenGroup: true,
        schengenCountries: schengenDraft,
      },
    ])
    setSchengenOpen(false)
  }

  const schengenOptions = useMemo(() => {
    const query = schengenQuery.trim().toLowerCase()
    const options = schengenCountries

    if (!query) return options
    return options.filter((country) => country.toLowerCase().includes(query))
  }, [schengenQuery])

  const getSchengenCountryImage = (countryName: string) => ({
    imageWebp: `https://static.pbcdn.in/travel-cdn/images/country/${countryName.replace(/\s+/g, '_')}.webp`,
    imageJpg: `https://static.pbcdn.in/travel-cdn/images/country/${countryName.replace(/\s+/g, '_')}.jpg`,
  })

  const selectAllSchengen = (checked: boolean) => {
    if (checked) {
      setSchengenDraft(schengenCountries)
      return
    }

    setSchengenDraft([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setIsOpen(true)}
        className="mt-5 overflow-hidden rounded-xl border border-brand bg-white shadow-sm"
      >
        <div className="flex min-h-[56px] flex-wrap items-center gap-2 px-3 py-2">
          {chipEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                removeChip(entry.id)
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[12px] font-medium text-navy"
            >
              <X size={12} className="text-slate-500" />
              {entry.label}
            </button>
          ))}

          <div className="flex flex-1 items-center gap-2 min-w-[160px]">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setIsOpen(true)}
              onClick={(event) => event.stopPropagation()}
              placeholder={chipEntries.length ? '' : 'Search country'}
              className="w-full border-0 bg-transparent text-[14px] text-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="border-b border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search country"
                className="w-full border-0 bg-transparent text-[14px] text-navy placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-3">
            {!searchTerm.trim() && (
              <>
                <p className="mb-2 text-[14px] font-semibold text-navy">Popular choices</p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {popularCountries.map((country) => {
                    const selected = isSelected(country)

                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => toggleCountry(country)}
                        className="text-center"
                      >
                        <div className="relative mx-auto h-14 w-14">
                          <CountryThumb country={country} selected={selected} />
                        </div>
                        <p className="mt-2 text-[12px] text-navy">{getDisplayLabel(country)}</p>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {(searchTerm.trim() || !searchTerm.trim()) && (
              <div className="mt-4 space-y-2">
                {filteredCountries.map((country) => {
                  const selected = isSelected(country)
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => toggleCountry(country)}
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-2 text-left transition hover:border-brand/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10">
                          <CountryThumb country={country} selected={selected} compact />
                        </div>
                        <span className="text-[14px] font-medium text-navy">{getDisplayLabel(country)}</span>
                      </div>

                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {schengenOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40"
          onClick={() => setSchengenOpen(false)}
        >
          <div
            className="ml-auto flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h3 className="text-[22px] font-bold text-navy">Schengen Countries</h3>
              <button type="button" onClick={() => setSchengenOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 text-center text-[12px] font-medium text-brand">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-brand/20">
                <Check size={14} /> You can add more than one country
              </span>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={schengenQuery}
                  onChange={(event) => setSchengenQuery(event.target.value)}
                  placeholder="Search country"
                  className="w-full border-0 bg-transparent text-[14px] text-navy placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-[14px] font-medium text-navy">Select All</span>
                <input
                  type="checkbox"
                  checked={schengenCountries.length > 0 && schengenDraft.length === schengenCountries.length}
                  onChange={(event) => selectAllSchengen(event.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
              </div>

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {schengenOptions.map((country) => {
                  const checked = schengenDraft.includes(country)
                  const { imageWebp, imageJpg } = getSchengenCountryImage(country)
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() =>
                        setSchengenDraft((current) =>
                          checked ? current.filter((item) => item !== country) : [...current, country],
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <picture>
                          <source srcSet={imageWebp} type="image/webp" />
                          <img
                            src={imageJpg}
                            alt={country}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200"
                            loading="lazy"
                          />
                        </picture>
                        <span className="text-[15px] text-navy">{country}</span>
                      </span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white'}`}>
                        {checked && <Check size={12} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={commitSchengenSelection}
                className="w-full rounded-xl bg-brand px-4 py-3 text-[18px] font-bold text-white shadow-lg shadow-brand/25"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type CountryThumbProps = {
  country: CountrySelection
  selected?: boolean
  compact?: boolean
}

function CountryThumb({ country, selected, compact = false }: CountryThumbProps) {
  const sizeClass = compact ? 'h-10 w-10' : 'h-14 w-14'

  return (
    <div className={`relative ${sizeClass}`}>
      <picture>
        <source srcSet={country.imageWebp} type="image/webp" />
        <img
          src={country.imageJpg}
          alt={country.name}
          className="h-full w-full rounded-full object-cover ring-2 ring-slate-200"
          loading="lazy"
        />
      </picture>

      {selected && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-sm">
          <Check size={10} />
        </span>
      )}
    </div>
  )
}

export const selectCountryLabel = (country: CountrySelection) => {
  if (country.isSchengenGroup && country.schengenCountries?.length) {
    return `Schengen(${country.schengenCountries.length})`
  }

  return country.label
}

export const getPopularCountryList = () => COUNTRY_OPTIONS.filter((country) => popularCountryIds.includes(country.id))

export const getCountryById = (countryId: string) => COUNTRY_OPTIONS.find((country) => country.id === countryId)

export const getSelectedSummary = (countries: CountrySelection[]) =>
  countries.filter((country) => !country.isSchengenGroup).map((country) => country.label)

export const formatSchengenChoice = (selected: CountrySelection[]) => {
  const schengen = selected.find((country) => country.id === 'schengen')
  if (!schengen?.schengenCountries?.length) return selected
  return [...selected.filter((country) => country.id !== 'schengen'), ...schengen.schengenCountries.map((country) => ({
    id: `schengen-${country}`,
    name: country,
    label: country,
    imageWebp: `https://static.pbcdn.in/travel-cdn/images/country/${country.replace(/\s+/g, '_')}.webp`,
    imageJpg: `https://static.pbcdn.in/travel-cdn/images/country/${country.replace(/\s+/g, '_')}.jpg`,
  }))]
}
