import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { DestinationPicker } from './DestinationPicker'

export default function EditTravellerDrawer({ initialState, onClose, onSave, mode }: any) {
  const [open, setOpen] = useState(true)
  const [countries, setCountries] = useState(initialState.selectedCountries ?? [])
  const [startDate, setStartDate] = useState(initialState.startDate ?? '')
  const [endDate, setEndDate] = useState(initialState.endDate ?? '')
  const [travellers, setTravellers] = useState(initialState.travellers ?? [{ id: 'g1', age: 20, spouse: null, children: [] }])

  useEffect(() => { setOpen(true) }, [])


  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50">
          <aside className="ml-auto h-full w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl">
        <div className="p-5">
          <button onClick={() => { setOpen(false); onClose && onClose() }} className="float-right rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={22} /></button>
          <h2 className="text-[20px] font-bold text-navy">{mode === 'dates' ? 'Edit travelling dates' : mode === 'duration' ? 'Edit trip duration' : mode === 'student' ? 'Student Travel Information' : 'Edit traveller details'}</h2>

          <div className="mt-6">
            <details>
              <summary className="cursor-pointer text-[15px] font-semibold">Country Visiting</summary>
              <div className="mt-3">
                <DestinationPicker value={countries} onChange={setCountries} />
              </div>
            </details>

            <details className="mt-4">
              <summary className="cursor-pointer text-[15px] font-semibold">Travelling Dates</summary>
              <div className="mt-3 space-y-3">
                <label className="block text-[13px]">Start date</label>
                <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full rounded border p-2" />
                <label className="block text-[13px] mt-2">End date</label>
                <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full rounded border p-2" />
                <div className="text-[12px] text-slate-500">* You are traveling for X days</div>
              </div>
            </details>

            <details className="mt-4 open">
              <summary className="cursor-pointer text-[15px] font-semibold">Travellers</summary>
              <div className="mt-3 space-y-3">
                {travellers.map((g: any, i: number) => (
                  <div key={g.id} className="rounded border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Traveller {i+1}</div>
                      {i>0 && <button onClick={()=>setTravellers((curr:any[])=>curr.filter(x=>x.id!==g.id))} className="text-red-500">Remove</button>}
                    </div>
                    <div className="mt-2 space-y-2">
                      <label className="block text-[13px]">Age</label>
                      <select value={g.age} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, age: Number(e.target.value)}:x))} className="w-full rounded border p-2">
                        {Array.from({length:99}).map((_,idx)=>(<option key={idx} value={idx+1}>{idx+1} years</option>))}
                      </select>

                      <div className="mt-2">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={!!g.spouse} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, spouse: e.target.checked? { age: 30, preExisting: false }: null}:x))} /> Add spouse</label>
                        {g.spouse && (
                          <div className="mt-2 rounded border p-2">
                            <label className="block text-[13px]">Spouse age</label>
                            <select value={g.spouse.age} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, spouse:{...x.spouse, age: Number(e.target.value)}}:x))} className="w-full rounded border p-2">
                              {Array.from({length:99}).map((_,idx)=>(<option key={idx} value={idx+1}>{idx+1} years</option>))}
                            </select>
                            <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={!!g.spouse.preExisting} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, spouse:{...x.spouse, preExisting: e.target.checked}}:x))} /> Any pre-existing medical condition?</label>
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <div className="text-[13px] font-medium">Children</div>
                          <button className="text-brand" onClick={()=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, children: [...(x.children||[]), { id: `c${(x.children||[]).length+1}`, age: 1, preExisting: false } ]}:x))}>+ Add</button>
                        </div>
                        <div className="mt-2 space-y-2">
                          {(g.children||[]).map((c: any) => (
                            <div key={c.id} className="flex items-center gap-2">
                              <select value={c.age} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, children: x.children.map((cc:any)=>cc.id===c.id?{...cc, age: Number(e.target.value)}:cc)}:x))} className="rounded border p-1">
                                {Array.from({length:18}).map((_,idx)=>(<option key={idx} value={idx}>{idx} yrs</option>))}
                              </select>
                              <label className="flex items-center gap-2"><input type="checkbox" checked={!!c.preExisting} onChange={(e)=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, children: x.children.map((cc:any)=>cc.id===c.id?{...cc, preExisting: e.target.checked}:cc)}:x))} /> pre-existing</label>
                              <button className="text-red-500" onClick={()=>setTravellers((curr:any[])=>curr.map(x=>x.id===g.id?{...x, children: x.children.filter((cc:any)=>cc.id!==c.id)}:x))}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-3">
                  <button onClick={()=>setTravellers((curr:any[])=>[...curr, { id: `g${curr.length+1}`, age:20, spouse:null, children:[] }])} className="rounded border px-3 py-2">+ Add Traveller</button>
                </div>
              </div>
            </details>

            <div className="mt-6">
              <button onClick={()=>{ onSave && onSave({ selectedCountries: countries, startDate, endDate, travellers }); setOpen(false); onClose && onClose() }} className="w-full rounded bg-brand px-4 py-3 text-white">Save changes</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
