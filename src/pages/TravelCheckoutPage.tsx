import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Disclaimer from '../components/travel/Disclaimer'

function PremiumSummary({ plan, onEdit }: any) {
  if (!plan) return null
  return (
    <aside className="space-y-4">
      <div className="rounded-lg bg-white shadow-card">
        <div className="flex justify-between rounded-t-lg bg-[#f0e6ff] px-5 py-4 text-sm text-purple2"><span>Selected Plan</span><b>{plan.insurer}</b></div>
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-[80px_1fr_auto] gap-3 border-b border-slate2-border pb-4 last:border-0">
            <span className={`grid h-10 place-items-center rounded px-2 text-sm font-black bg-blueBG text-green-cta`}>LOGO</span>
            <div>
              <p className="text-sm text-slate2-secondary">Plan Name:</p>
              <p className="font-black">{plan.plan}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate2-secondary">Premium</p>
              <p className="font-black">₹{plan.premium.toLocaleString()}</p>
            </div>
          </div>

          <p className="flex justify-between border-t pt-4 text-lg"><button onClick={onEdit} className="text-brand underline">Edit</button><b>₹{plan.premium.toLocaleString()}</b></p>
        </div>
      </div>
    </aside>
  )
}

export default function TravelCheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const incoming = (location.state ?? {}) as any
  const selectedPlan = incoming.plan

  const initialTravellers = incoming.travellers ?? [{ id: 't1', name: '', age: 30, spouse: null, children: [] }]
  const [step, setStep] = useState(1)
  const [travellers, setTravellers] = useState(initialTravellers)
  const [medical, setMedical] = useState<Record<string, any>>({})
  const [contact, setContact] = useState<any>({})

  // total members count available when needed
  const members = useMemo(() => travellers.reduce((s: number, t: any) => s + 1 + (t.spouse ? 1 : 0) + (t.children?.length || 0), 0), [travellers])

  return (
    <div className="bg-blueBG py-8 min-h-screen">
      <div className="container-pb grid gap-6 lg:grid-cols-[1fr_365px]">
        <main className="rounded-cardlg bg-white p-6 shadow-card">
          <h2 className="text-[20px] font-bold text-navy">Step {step}: {step===1? 'Personal details' : step===2? 'Medical history' : 'Contact details'}</h2>

          {step === 1 && (
            <section className="mt-6 space-y-4">
              <div className="rounded border-l-4 border-green-200 bg-green-50 p-4">
                <div className="text-sm text-slate-700">Hospital bills abroad can cross ₹10 lakh. IndusInd General Insurance settled 99.5% of claims within 3 months of being reported — your safety net is proven.</div>
              </div>

              <p className="text-slate-600">Fill traveller details for {members} members</p>

              {travellers.map((t: any, i:number) => (
                <div key={t.id} className="rounded border p-4">
                  <div className="mb-3 font-semibold">Traveller {i+1} ({t.age} yrs)</div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <input placeholder="Enter full name" value={t.name} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,name:e.target.value}:x))} className="w-full rounded border p-3" />
                    <div className="flex items-center gap-2">
                      <button className="flex-1 rounded border p-3 text-center">Male</button>
                      <button className="flex-1 rounded border p-3 text-center">Female</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2"><input type="checkbox" /> Don't have a last name as per the passport</label>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <input placeholder="Enter date of birth (DD-MM-YYYY)" value={t.dob||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,dob:e.target.value}:x))} className="rounded border p-3" />
                    <input placeholder="Nationality" value={t.nationality||'Indian'} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,nationality:e.target.value}:x))} className="rounded border p-3" />
                    <select value={t.visaType||'Tourist/Visitor Visa'} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,visaType:e.target.value}:x))} className="rounded border p-3">
                      <option>Tourist/Visitor Visa</option>
                      <option>Student Visa</option>
                      <option>Work Visa</option>
                    </select>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <input placeholder="Enter passport number" value={t.passport||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,passport:e.target.value}:x))} className="rounded border p-3" />
                    <div className="text-sm text-slate-500">Don't remember your passport number? Get the form completion link on WhatsApp</div>
                    <input placeholder="Mobile number" value={t.mobile||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,mobile:e.target.value}:x))} className="rounded border p-3" />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input placeholder="Enter pan number" value={t.pan||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,pan:e.target.value}:x))} className="rounded border p-3" />
                    <div>
                      <div className="text-sm text-slate-500">We will share the policy copy on this number</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium">Nominee Details</div>
                    <div className="mt-2 grid gap-3 md:grid-cols-2">
                      <input placeholder="Enter nominee full name" value={t.nomineeName||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,nomineeName:e.target.value}:x))} className="rounded border p-3" />
                      <select value={t.nomineeRelation||''} onChange={(e)=>setTravellers((curr:any[])=>curr.map((x,j)=> j===i?{...x,nomineeRelation:e.target.value}:x))} className="rounded border p-3">
                        <option value="">Select nominee relation</option>
                        <option>Spouse</option>
                        <option>Parent</option>
                        <option>Child</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center gap-3">
                <button onClick={()=>setTravellers((c:any)=>[...c, { id:`t${c.length+1}`, name:'', age:1 }])} className="rounded border px-4 py-2">+ Add Traveller</button>
                <div className="ml-auto">
                  <button onClick={()=>setStep(2)} className="w-48 rounded bg-brand px-4 py-3 text-white">Continue</button>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="mt-6">
              <p className="mb-4">Does any of the traveller(s) have pre-existing medical conditions?</p>
              <div className="flex gap-3">
                <button onClick={()=>{ setMedical({ hasPreExisting: true }); }} className={`rounded border px-6 py-3 ${medical.hasPreExisting? 'border-brand bg-blue-50': ''}`}>Yes</button>
                <button onClick={()=>{ setMedical({ hasPreExisting: false }); }} className={`rounded border px-6 py-3 ${medical.hasPreExisting===false? 'border-brand bg-blue-50': ''}`}>No</button>
              </div>
              <div className="mt-6 flex justify-end"><button onClick={()=>setStep(3)} className="rounded bg-brand px-4 py-2 text-white">Continue</button></div>
            </section>
          )}

          {step === 3 && (
            <section className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input placeholder="Email" value={contact.email||''} onChange={(e)=>setContact({...contact,email:e.target.value})} className="rounded border p-2" />
                <input placeholder="Pincode" value={contact.pincode||''} onChange={(e)=>setContact({...contact,pincode:e.target.value})} className="rounded border p-2" />
                <input placeholder="City" value={contact.city||''} onChange={(e)=>setContact({...contact,city:e.target.value})} className="rounded border p-2" />
                <input placeholder="Address" value={contact.address||''} onChange={(e)=>setContact({...contact,address:e.target.value})} className="rounded border p-2" />
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={()=>setStep(2)} className="rounded border px-4 py-2">Back</button>
                <button onClick={()=> navigate('/travel-insurance/review', { state: { plan: selectedPlan, travellers, medical, contact, selectedCountries: location.state?.selectedCountries, startDate: location.state?.startDate, endDate: location.state?.endDate } })} className="rounded bg-brand px-4 py-2 text-white">Pay Now</button>
              </div>
            </section>
          )}
        </main>

        <PremiumSummary plan={selectedPlan} onEdit={()=>setStep(3)} />
      </div>

      <div className="container-pb mt-6">
        <Disclaimer />
      </div>
    </div>
  )
}