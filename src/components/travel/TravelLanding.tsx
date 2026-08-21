import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Globe2, HeartPulse, Plane, Plus, Users, Wallet } from 'lucide-react'
import defaultHeroImage from '../../assets/images/loan.png'
import { DestinationPicker, type CountrySelection, getSelectedSummary } from './DestinationPicker'
import { TravellerDrawer, type TravellerDrawerDoneData, type TravellerGroup, getTravellerSummary } from './TravellerDrawer'

type TravelLandingProps = {
  config: { name: string }
  heroImageUrl?: string
}

const iconMap = [
  { icon: HeartPulse, label: 'Medical emergencies' },
  { icon: Plane, label: 'Flight delays or cancellations' },
  { icon: Wallet, label: 'Lost baggage & passport' },
  { icon: Globe2, label: 'Theft or personal loss of belongings' },
]

export default function TravelLanding({ config, heroImageUrl }: TravelLandingProps) {
  const [selectedCountries, setSelectedCountries] = useState<CountrySelection[]>([])
  const [isTravellerDrawerOpen, setTravellerDrawerOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [travellers, setTravellers] = useState<TravellerGroup[]>([{ id: 'g1', age: 20, spouse: null, children: [] }])
  const [travellerSummary, setTravellerSummary] = useState('Select travellers')
  const [hasPreExistingConditions, setHasPreExistingConditions] = useState(false)
  const [preExistingMemberIds, setPreExistingMemberIds] = useState<string[]>([])

  const canAddTravellers = useMemo(
    () => selectedCountries.length > 0 && Boolean(startDate) && Boolean(endDate),
    [selectedCountries.length, startDate, endDate],
  )

  const handleTravellerDone = ({ travellerGroups, hasPreExistingConditions: hasPreExisting, preExistingMemberIds: memberIds }: TravellerDrawerDoneData) => {
    setTravellers(travellerGroups)
    setTravellerSummary(getTravellerSummary(travellerGroups))
    setHasPreExistingConditions(hasPreExisting)
    setPreExistingMemberIds(memberIds)
  }

  const navigate = useNavigate()

  const handleExplorePlans = () => {
    const tripData = { selectedCountries, startDate, endDate, travellers, hasPreExistingConditions, preExistingMemberIds }
    navigate('/travel-insurance/quotes', { state: tripData })
  }

  return (
    <>
      <section className="bg-blueBG">
        <div className="container-pb grid gap-8 py-10 lg:grid-cols-[1.2fr_0.9fr] lg:py-14">
          <div>
            <h1 className="text-[35px] font-bold leading-tight text-navy">
              Travel cover starting from <span className="relative text-green-cta">₹—/day<span className="absolute -bottom-2 left-0 h-1 w-full rounded bg-green-cta/50" /></span>
            </h1>

            <p className="mt-4 text-[14px] text-slate2-secondary">
              Medical support, trip disruption cover and help when you need it abroad.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {iconMap.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12px] font-medium text-navy">
                  <span className="rounded-lg bg-white p-2 text-brand">
                    <Icon size={17} />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            <div className="relative mt-8 flex h-52 items-end justify-center overflow-hidden rounded-cardlg border border-white bg-white/60 sm:h-60">
              <img src={heroImageUrl ?? defaultHeroImage} alt={config.name} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
              <span className="absolute bottom-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate2-secondary shadow-card">
                {config.name}
              </span>
            </div>
          </div>

          <div className="rounded-cardlg bg-white p-5 shadow-card">
            <h2 className="text-[20px] font-bold text-navy">Where are you travelling to?</h2>

            <DestinationPicker value={selectedCountries} onChange={setSelectedCountries} />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="rounded-lg border border-slate2-border p-3 text-[12px] font-medium text-navy">
                <span className="flex items-center gap-2 text-navy">
                  <CalendarDays size={15} className="text-brand" />
                  Start date
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-2 block w-full border-0 bg-transparent text-[13px] text-navy outline-none"
                />
              </label>

              <label className="rounded-lg border border-slate2-border p-3 text-[12px] font-medium text-navy">
                <span className="flex items-center gap-2 text-navy">
                  <CalendarDays size={15} className="text-brand" />
                  End date
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-2 block w-full border-0 bg-transparent text-[13px] text-navy outline-none"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate2-border bg-slate-50/30 px-3 py-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-navy">
                <span className="rounded-lg bg-blueBG p-2 text-brand">
                  <Users size={16} />
                </span>
                <span>{travellerSummary}</span>
              </div>

              <button
                type="button"
                disabled={!canAddTravellers}
                onClick={() => canAddTravellers && setTravellerDrawerOpen(true)}
                className={`inline-flex items-center gap-2 text-[15px] font-semibold ${canAddTravellers ? 'cursor-pointer text-brand' : 'pointer-events-none cursor-not-allowed opacity-40 text-brand'}`}
              >
                <Plus size={16} /> Add travellers
              </button>
            </div>

            {!canAddTravellers && (selectedCountries.length > 0 || Boolean(startDate) || Boolean(endDate)) && (
              <p className="mt-2 text-[11px] text-slate-500">Select destination and dates first</p>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={handleExplorePlans}
                className="w-full rounded-xl bg-brand px-4 py-3 text-[16px] font-bold text-white"
              >
                Explore Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      <TravellerDrawer
        isOpen={isTravellerDrawerOpen}
        onClose={() => setTravellerDrawerOpen(false)}
        onDone={(data) => {
          handleTravellerDone(data)
          setTravellerDrawerOpen(false)
        }}
      />
    </>
  )
}

export function CountrySummary({ countries }: { countries: CountrySelection[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {getSelectedSummary(countries).map((country) => (
        <span key={country} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[12px] text-navy">
          {country}
        </span>
      ))}
    </div>
  )
}

export function SelectedTravellerChips({ travellers }: { travellers: TravellerGroup[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {travellers.map((group) => (
        <span key={group.id} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[12px] text-navy">
          {group.age ? `${group.age} years` : 'Age pending'}
        </span>
      ))}
    </div>
  )
}

export const defaultTravelSummary = 'Select travellers'
