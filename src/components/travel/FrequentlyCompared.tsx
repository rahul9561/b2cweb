import { useState } from 'react'

const PAIRS = [
  {
    left: {
      id: 'tataaig',
      insurer: 'Tata AIG',
      plan: 'International Plus Gold',
      logoWebp: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/Tata_AIG@2x.webp',
      logoPng: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/Tata_AIG@2x.png',
    },
    right: {
      id: 'icici',
      insurer: 'ICICI Lombard',
      plan: 'Trip Secure Plus',
      logoWebp: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/ICICI_Lombard@2x.webp',
      logoPng: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/ICICI_Lombard@2x.png',
    },
  },
  {
    left: {
      id: 'indusind',
      insurer: 'IndusInd General',
      plan: 'Value Care',
      logoWebp: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/IndusInd_General@2x.webp',
      logoPng: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/IndusInd_General@2x.png',
    },
    right: {
      id: 'bajaj',
      insurer: 'Bajaj General',
      plan: 'Travel Ace Lite - Gold',
      logoWebp: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/Bajaj_General@2x.webp',
      logoPng: 'https://static.pbcdn.in/travel-cdn/images/insurer-logos/Bajaj_General@2x.png',
    },
  },
]

export default function FrequentlyCompared() {
  const [pairs] = useState(PAIRS)

  return (
    <section className="mt-8">
      <h3 className="mb-4 text-[18px] font-bold text-navy">Frequently Compared</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex items-stretch gap-4">
            <div className="flex w-full items-center gap-3 rounded-cardlg bg-white p-4 shadow-card">
              <picture className="mr-3">
                <source type="image/webp" srcSet={pair.left.logoWebp} />
                <source type="image/png" srcSet={pair.left.logoPng} />
                <img src={pair.left.logoPng} alt={pair.left.insurer} width={60} />
              </picture>

              <div className="comparePlanCard__plan">
                <p className="insurerName text-[13px] font-semibold text-navy">{pair.left.insurer}</p>
                <p className="planName text-[12px] text-slate-500">{pair.left.plan}</p>
                <p className="medical mt-2 text-[12px] text-slate-500">Medical Expenses</p>
                <p className="insurerName premium mt-1 text-[14px] font-bold">$250,000</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-slate-500 shadow-sm">VS</div>
            </div>

            <div className="flex w-full items-center gap-3 rounded-cardlg bg-white p-4 shadow-card">
              <picture className="mr-3">
                <source type="image/webp" srcSet={pair.right.logoWebp} />
                <source type="image/png" srcSet={pair.right.logoPng} />
                <img src={pair.right.logoPng} alt={pair.right.insurer} width={60} />
              </picture>

              <div className="comparePlanCard__plan">
                <p className="insurerName text-[13px] font-semibold text-navy">{pair.right.insurer}</p>
                <p className="planName text-[12px] text-slate-500">{pair.right.plan}</p>
                <p className="medical mt-2 text-[12px] text-slate-500">Medical Expenses</p>
                <p className="insurerName premium mt-1 text-[14px] font-bold">$250,000</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
