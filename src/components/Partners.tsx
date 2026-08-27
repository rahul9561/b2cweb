import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import adityaBirlaLogo from '../assets/images/aditya_birla.png'
import edelLogo from '../assets/images/edel.png'
import galaxyLogo from '../assets/images/galaxy.png'
import hdfcErgoLogo from '../assets/images/hdfc_ergo.png'
import hdfcLifeLogo from '../assets/images/hdfc_logo.svg'
import iciciLogo from '../assets/images/icici.png'
import idfcLogo from '../assets/images/idfc_logo.svg'
import indiaFirstLogo from '../assets/images/india_first.png'
import indiaFirstLifeLogo from '../assets/images/india_first_life.png'
import kotakLogo from '../assets/images/kotak.png'
import libertyLogo from '../assets/images/liberty.png'
import licLogo from '../assets/images/lic.png'
import magmaLogo from '../assets/images/magma.png'
import newIndiaLogo from '../assets/images/new_india.png'
import nivaLogo from '../assets/images/niva.png'
import orientalLogo from '../assets/images/oriental.png'
import pramericaLogo from '../assets/images/pramerica.png'
import rahejaLogo from '../assets/images/raheja.png'
import sbiGeneralLogo from '../assets/images/sbigeneral.png'
import shriramLogo from '../assets/images/shriram.png'
import starLogo from '../assets/images/star.png'
import tataAiaLogo from '../assets/images/tataaia.png'
import tokioLogo from '../assets/images/tokio.png'
import unitedIndiaLogo from '../assets/images/unitedindia.png'
import zunoLogo from '../assets/images/zuno.png'
import zurichKotakLogo from '../assets/images/zurich_kotak.png'

type Partner = {
  name: string
  logoUrl: string
}

const partners: Partner[] = [
  { name: 'Aditya Birla Capital', logoUrl: adityaBirlaLogo },
  { name: 'Edelweiss Life Insurance', logoUrl: edelLogo },
  { name: 'Galaxy Health Insurance', logoUrl: galaxyLogo },
  { name: 'HDFC ERGO', logoUrl: hdfcErgoLogo },
  { name: 'HDFC Life Insurance', logoUrl: hdfcLifeLogo },
  { name: 'ICICI Bank', logoUrl: iciciLogo },
  { name: 'IDFC First Bank', logoUrl: idfcLogo },
  { name: 'IndiaFirst Life', logoUrl: indiaFirstLogo },
  { name: 'IndiaFirst Life Insurance', logoUrl: indiaFirstLifeLogo },
  { name: 'Kotak Life Insurance', logoUrl: kotakLogo },
  { name: 'Liberty General Insurance', logoUrl: libertyLogo },
  { name: 'LIC', logoUrl: licLogo },
  { name: 'Magma General Insurance', logoUrl: magmaLogo },
  { name: 'New India Assurance', logoUrl: newIndiaLogo },
  { name: 'Niva Bupa Health Insurance', logoUrl: nivaLogo },
  { name: 'Oriental Insurance', logoUrl: orientalLogo },
  { name: 'Pramerica Life Insurance', logoUrl: pramericaLogo },
  { name: 'Raheja QBE General Insurance', logoUrl: rahejaLogo },
  { name: 'SBI General Insurance', logoUrl: sbiGeneralLogo },
  { name: 'Shriram Life Insurance', logoUrl: shriramLogo },
  { name: 'Star Health Insurance', logoUrl: starLogo },
  { name: 'Tata AIA Life Insurance', logoUrl: tataAiaLogo },
  { name: 'IFFCO Tokio General Insurance', logoUrl: tokioLogo },
  { name: 'United India General Insurance', logoUrl: unitedIndiaLogo },
  { name: 'ZUNO Health Insurance', logoUrl: zunoLogo },
  { name: 'Zurich Kotak General Insurance', logoUrl: zurichKotakLogo },
]

export default function Partners() {
  return (
    <section className="bg-slate-50 py-12 lg:py-16">
      <div className="container-pb">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-brand">
            <Building2 size={15} /> 51+ Insurance Partners
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">Our Trusted Insurers</h2>
          <p className="mx-auto mt-2 max-w-xl text-xs font-medium text-slate-500">
            Leading insurance companies partner with us to offer choice, transparency &amp; best market rates.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 7) * 0.04, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="group flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-lg"
            >
              <img
                src={p.logoUrl}
                alt={p.name}
                className="h-8 w-auto max-w-[85%] object-contain opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <span className="text-center text-[10px] font-bold leading-tight text-slate-600 transition-colors duration-300 group-hover:text-brand">
                {p.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}