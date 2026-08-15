import growwLogo from '../assets/images/groww_logo.png'
import hdfcLogo from '../assets/images/hdfc_logo.svg'
import idfcLogo from '../assets/images/idfc_logo.svg'

const brands = [
  { name: 'groww', src: growwLogo, alt: 'Groww' },
  { name: 'hdfc', src: hdfcLogo, alt: 'HDFC' },
  { name: 'idfc', src: idfcLogo, alt: 'IDFC' },
]

export default function GroupBrands() {
  // Repeat the full set enough times to fill the track, then duplicate once for the seamless loop
  const repeatedSet = Array.from({ length: 6 }, () => brands).flat()
  const loopBrands = [...repeatedSet, ...repeatedSet]

  return (
    <section className="border-t border-slate2-border bg-white py-8 overflow-hidden">
      <div className="container-pb">
        <p className="mb-3 text-[20px] font-bold uppercase tracking-wider text-slate2-muted">
          Group Brands
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <div className="marquee-track flex w-max items-center gap-16">
          {loopBrands.map((b, i) => (
            <img
              key={`${b.name}-${i}`}
              src={b.src}
              alt={b.alt}
              className="h-8 w-auto shrink-0 object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  )
}