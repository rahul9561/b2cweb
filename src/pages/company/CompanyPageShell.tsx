import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileCheck2, Headphones, ShieldCheck } from 'lucide-react'
import companyHero from '../../assets/images/company-pages-hero.png'
import './CompanyPages.css'

export type PageSection = { id: string; title: string; content: ReactNode }

export const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.48 },
}

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  return <div className="company-page">{children}</div>
}

export function CompanyHero({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof ShieldCheck }) {
  return <section className="company-hero">
    <img src={companyHero} alt="AV Management financial guidance team meeting with customers" />
    <div className="company-hero-overlay" />
    <div className="container-pb company-hero-inner">
      <motion.div initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="company-hero-copy">
        <span className="company-hero-kicker"><Icon size={16} /> {eyebrow}</span>
        <h1>{title}</h1><p>{description}</p>
      </motion.div>
    </div>
  </section>
}

export function LegalPage({ eyebrow, title, description, icon, sections, note }: { eyebrow: string; title: string; description: string; icon: typeof ShieldCheck; sections: PageSection[]; note: string }) {
  return <PageFrame>
    <CompanyHero eyebrow={eyebrow} title={title} description={description} icon={icon} />
    <section className="container-pb legal-layout">
      <motion.aside {...reveal} className="legal-index">
        <p>On this page</p>
        <nav>{sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav>
        <div className="legal-index-help"><Headphones size={19} /><div><strong>Need clarification?</strong><Link to="/contact-us">Talk to our support team</Link></div></div>
      </motion.aside>
      <motion.article {...reveal} className="legal-document">
        <div className="legal-document-intro"><span><FileCheck2 size={16} /> Last updated: 21 August 2026</span><p>{note}</p></div>
        {sections.map((section, index) => <section id={section.id} key={section.id} className="legal-section"><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2><div className="legal-copy">{section.content}</div></div></section>)}
      </motion.article>
    </section>
  </PageFrame>
}
