import { motion } from 'framer-motion'
import adityaBirlaLogo from '../assets/images/aditya_birla.png'
import edelLogo from '../assets/images/edel.png'
import galaxyLogo from '../assets/images/galaxy.png'
import hdfcErgoLogo from '../assets/images/hdfc_ergo.png'
import hdfcLifeLogo from '../assets/images/hdfc_logo.svg'
import iciciLogo from '../assets/images/icici.png'
import idfcLogo from '../assets/images/idfc_logo.svg'
import indiaFirstLogo from '../assets/images/india_first.png'
import indiaFirstLifeLogo from '../assets/images/india_first_life.png'
import kotakLogo from '../assets/images/kotak.png' // rename kotak.pg -> kotak.png first
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
    <section className="bg-blueBGMuted py-14">
      <div className="container-pb">
        <h2 className="text-center text-[22px] font-medium text-navy">Our Partners</h2>
        <p className="mt-1 text-center text-[13px] text-slate2-secondary">
          Leading insurers for your financial freedom
        </p>
        <span className="heading-accent mx-auto mt-3 block h-1 w-12 rounded-full bg-brand" />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 7) * 0.05, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="group flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-slate2-border bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-lg"
            >
              <img
                src={p.logoUrl}
                alt={p.name}
                className="h-8 w-auto max-w-[80%] object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <span className="text-center text-[10px] font-semibold leading-tight text-slate2-secondary transition-colors duration-300 group-hover:text-navy">
                {p.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}