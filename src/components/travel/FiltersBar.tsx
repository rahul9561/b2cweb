import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

type Filters = {
  planType?: string | null
  sumInsured?: number | null
  insurers?: string[]
  visaTypes?: string[]
  coverages?: string[]
  purposes?: string[]
}

export default function FiltersBar({ onApply, insurers = [] }: any) {
  const [openPlan, setOpenPlan] = useState(false)
  const [openInsurer, setOpenInsurer] = useState(false)
  const [openSum, setOpenSum] = useState(false)
  const [openVisa, setOpenVisa] = useState(false)
  const [openCoverage, setOpenCoverage] = useState(false)
  const [openPurpose, setOpenPurpose] = useState(false)
  const [regularChecked, setRegularChecked] = useState(true)

  const [planType, setPlanType] = useState<string | null>(null)
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([])
  const [sumInsured, setSumInsured] = useState<number | null>(null)

  useEffect(() => {
    setSelectedInsurers([])
  }, [insurers])

  const apply = () => {
    const filters: Filters = { planType, sumInsured, insurers: selectedInsurers }
    if (visaTypes.length) (filters as any).visaTypes = visaTypes
    if (coverages.length) (filters as any).coverages = coverages
    if (purposes.length) (filters as any).purposes = purposes
    if (!regularChecked) (filters as any).regular = false
    onApply && onApply(filters)
  }

  const [visaTypes, setVisaTypes] = useState<string[]>([])
  const [coverages, setCoverages] = useState<string[]>([])
  const [purposes, setPurposes] = useState<string[]>([])

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="text-[14px] font-semibold">Filters</div>

      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
        <input type="checkbox" checked={regularChecked} onChange={(e)=>{ setRegularChecked(e.target.checked); apply(); }} />
        <span className="text-[13px]">Regular plans</span>
      </div>

      <div className="relative">
        <button onClick={() => setOpenPlan((s) => !s)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">
          <Check size={14} className="text-green-500"/> {planType ? (planType === 'single' ? 'Single trip' : planType === 'frequent' ? 'Frequent flyer' : 'Student') : 'Plan Type'} <ChevronDown size={14} />
        </button>

        {openPlan && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <div className="space-y-2">
              <label className={`flex items-center gap-2 p-2 rounded ${planType==='single'? 'ring-2 ring-brand' : ''}`}><input type="radio" name="plan" checked={planType==='single'} onChange={()=>setPlanType('single')} /> Single trip plans</label>
              <label className={`flex items-center gap-2 p-2 rounded ${planType==='frequent'? 'ring-2 ring-brand' : ''}`}><input type="radio" name="plan" checked={planType==='frequent'} onChange={()=>setPlanType('frequent')} /> Frequent flyer plans</label>
              <label className={`flex items-center gap-2 p-2 rounded ${planType==='student'? 'ring-2 ring-brand' : ''}`}><input type="radio" name="plan" checked={planType==='student'} onChange={()=>setPlanType('student')} /> Student plans</label>
            </div>
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenPlan(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setOpenSum((s) => !s)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Sum Insured <ChevronDown size={14}/></button>
        {openSum && (
          <div className="absolute z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded"><input type="radio" name="sum" onChange={()=>setSumInsured(50000)} /> $50,000</label>
              <label className="flex items-center gap-2 p-2 rounded"><input type="radio" name="sum" onChange={()=>setSumInsured(100000)} /> $100,000</label>
              <label className="flex items-center gap-2 p-2 rounded"><input type="radio" name="sum" onChange={()=>setSumInsured(null)} /> Recommended</label>
            </div>
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenSum(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setOpenVisa((s) => !s)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Visa Type <ChevronDown size={14}/></button>
        {openVisa && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            {['tourist','work','student','resident'].map((v)=> (
              <label key={v} className="flex items-center gap-2 p-2 rounded" onClick={()=>{ setVisaTypes((s)=> s.includes(v)? s.filter(x=>x!==v): [...s,v]); }}>
                <input type="checkbox" checked={visaTypes.includes(v)} readOnly /> {v.charAt(0).toUpperCase()+v.slice(1)} Visa
              </label>
            ))}
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenVisa(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setOpenCoverage((s) => !s)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Coverages <ChevronDown size={14}/></button>
        {openCoverage && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            {['pre-existing','adventure','card-fraud','no-medical-sublimit'].map((c)=> (
              <label key={c} className="flex items-center gap-2 p-2 rounded" onClick={()=>{ setCoverages((s)=> s.includes(c)? s.filter(x=>x!==c): [...s,c]); }}>
                <input type="checkbox" checked={coverages.includes(c)} readOnly /> {c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
              </label>
            ))}
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenCoverage(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setOpenPurpose((s) => !s)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Purpose of Travel <ChevronDown size={14}/></button>
        {openPurpose && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            {['holiday','business','studies','employment'].map((p)=> (
              <label key={p} className="flex items-center gap-2 p-2 rounded" onClick={()=>{ setPurposes((s)=> s.includes(p)? s.filter(x=>x!==p): [...s,p]); }}>
                <input type="checkbox" checked={purposes.includes(p)} readOnly /> {p.charAt(0).toUpperCase()+p.slice(1)}
              </label>
            ))}
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenPurpose(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>


      <div className="relative">
        <button onClick={() => setOpenInsurer((s) => !s)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Insurer <ChevronDown size={14}/></button>
        {openInsurer && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {insurers.map((ins: string) => (
                <label key={ins} className="flex items-center gap-2 p-2 rounded" onClick={()=>{ setSelectedInsurers((s)=> s.includes(ins)? s.filter(x=>x!==ins): [...s,ins]) }}>
                  <input type="checkbox" checked={selectedInsurers.includes(ins)} readOnly /> {ins}
                </label>
              ))}
            </div>
            <div className="mt-3 flex justify-end gap-2"><button onClick={()=>setOpenInsurer(false)} className="text-slate-600">Cancel</button><button onClick={apply} className="rounded bg-brand px-3 py-1 text-white">Apply</button></div>
          </div>
        )}
      </div>

      <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px]">Sort by <ChevronDown size={14}/></button>
    </div>
  )
}
