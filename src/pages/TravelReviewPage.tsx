import { useLocation, useNavigate } from 'react-router-dom'

export default function TravelReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as any
  const plan = state.plan
  const travellers = state.travellers ?? []
  const medical = state.medical ?? {}
  const contact = state.contact ?? {}

  const members = travellers.reduce((s: number, t: any) => s + 1 + (t.spouse ? 1 : 0) + (t.children?.length || 0), 0)

  return (
    <div className="bg-blueBG py-8 min-h-screen">
      <div className="container-pb grid gap-6 lg:grid-cols-[1fr_365px]">
        <main className="rounded-cardlg bg-white p-6 shadow-card">
          <h2 className="text-[20px] font-bold text-navy">Review and pay</h2>

          <section className="mt-6 space-y-6">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-32 rounded bg-blueBG grid place-items-center">{plan?.insurer || 'Insurer'}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate2-secondary">{plan?.plan || 'Selected plan'}</div>
                      <div className="font-black">{plan?.plan || 'Travel Plan'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate2-secondary">Plan premium</div>
                      <div className="font-black">₹{plan?.premium?.toLocaleString?.() ?? '0'}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-xs text-slate2-secondary">Date of birth</div>
                      <div className="font-medium">{travellers[0]?.dob ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate2-secondary">Passport No.</div>
                      <div className="font-medium">{travellers[0]?.passport ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate2-secondary">Nominee name & relation</div>
                      <div className="font-medium">{travellers[0]?.nomineeName || '—'} {travellers[0]?.nomineeRelation ? `(${travellers[0].nomineeRelation})` : ''}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate2-secondary">Pre-existing disease</div>
                      <div className="font-medium">{medical.hasPreExisting ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-slate2-secondary">Address</div>
                    <div className="font-medium">{contact.address || '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-bold">Trip details</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-xs text-slate2-secondary">Destination(s)</div>
                  <div className="font-medium">{(state.selectedCountries ?? []).map((c:any)=> c.label || c).join(', ') || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate2-secondary">Traveller(s)</div>
                  <div className="font-medium">{members} Member{members>1?'s':''}</div>
                </div>
                <div>
                  <div className="text-xs text-slate2-secondary">Travel Start Date</div>
                  <div className="font-medium">{state.startDate || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate2-secondary">Travel End Date</div>
                  <div className="font-medium">{state.endDate || '—'}</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <div className="rounded-lg bg-white shadow-card">
            <div className="flex justify-between rounded-t-lg bg-[#f0e6ff] px-5 py-4 text-sm text-purple2"><span>Premium Summary</span><b>₹{plan?.premium?.toLocaleString?.() ?? '0'}</b></div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-[80px_1fr_auto] gap-3 border-b border-slate2-border pb-4 last:border-0">
                <span className={`grid h-10 place-items-center rounded px-2 text-sm font-black bg-blueBG text-green-cta`}>LOGO</span>
                <div>
                  <p className="text-sm text-slate2-secondary">Travel Care Individual</p>
                  <p className="font-black">Sum Insured: {plan?.medical ? `$${plan.medical}` : '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate2-secondary">Premium</p>
                  <p className="font-black">₹{plan?.premium?.toLocaleString?.() ?? '0'}</p>
                </div>
              </div>

              <div className="text-sm">
                <label className="flex items-start gap-2"><input type="checkbox" /> <span>I hereby declare that all information provided above is true, and I accept all Terms & Conditions</span></label>
                <label className="mt-3 flex items-start gap-2"><input type="checkbox" /> <span>I consent to CKYC verification and retrieval of my KYC details from the Central KYC Registry (CERSAI) for processing this insurance application... Read More</span></label>
              </div>

              <button onClick={()=> navigate('/travel-insurance/payment', { state: { plan, amount: plan?.premium } })} className="h-12 w-full rounded bg-brand font-black text-white">Pay Now</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="container-pb mt-6">
        <div className="rounded-lg bg-white p-4">Disclaimer</div>
      </div>
    </div>
  )
}
