import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Check,
  Clock3,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { CompanyHero, PageFrame, reveal } from './CompanyPageShell'

const services = [
  { icon: Handshake, number: '01', title: 'Loan Guidance', copy: 'Expert advice on suitable loan options based on your needs, income, and repayment capacity.' },
  { icon: GraduationCap, number: '02', title: 'Education Financing', copy: 'Purpose-led guidance for students planning higher education in India or abroad.' },
  { icon: BriefcaseBusiness, number: '03', title: 'Business Finance Advisory', copy: 'Practical financial support for business expansion, working capital, and commercial needs.' },
  { icon: Landmark, number: '04', title: 'Vehicle & Commercial Funding', copy: 'Flexible assistance for personal vehicles, commercial fleets, and business equipment.' },
]

const process = [
  { number: '01', title: 'Smart Loan Planning', copy: 'We understand your objective, budget, and repayment comfort before suggesting a route.' },
  { number: '02', title: 'Eligibility Insights', copy: 'Your income, credit profile, and documents are reviewed to identify suitable opportunities.' },
  { number: '03', title: 'Hassle-Free Disbursal', copy: 'Our team supports the application journey through verification, approval, and disbursal.' },
]

export default function AboutUsPage() {
  return <PageFrame>
    <CompanyHero eyebrow="More about AV Management" title="Financial guidance built around real life goals." description="People rely on experienced financial partners for tailored, transparent, and timely support. We help make the journey clearer from first question to final decision." icon={Sparkles} />

    <section className="container-pb about-intro">
      <motion.div {...reveal} className="about-intro-copy">
        <span>About us</span>
        <h2>We deliver reliable loan solutions to support your growth and fulfil every financial need.</h2>
        <p>AV Management brings together financial-product knowledge, digital journeys, and human support. We work across education finance, credit services, personal and business needs, insurance, and other customer-focused financial solutions.</p>
        <div className="about-checks">
          {['Personalised loan solutions', 'Education loan expertise', 'Business finance advisory', 'Transparent customer support'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
        </div>
        <Link to="/contact-us">Talk to our team <ArrowRight size={17} /></Link>
      </motion.div>
      <motion.div {...reveal} className="about-stat-panel">
        <div><span><Clock3 size={22} /></span><strong>8+</strong><p>Years of experience</p></div>
        <div><span><BadgeIndianRupee size={22} /></span><strong>₹500Cr+</strong><p>Loan disbursed</p></div>
        <div className="about-stat-note"><ShieldCheck size={25} /><p><strong>Built on trust</strong>Clear guidance, responsible processes, and consistent support at every stage.</p></div>
      </motion.div>
    </section>

    <section className="about-services-wrap"><div className="container-pb company-section">
      <motion.div {...reveal} className="section-heading"><span>Our expertise</span><h2>Empowering growth through trusted financial services</h2><p>Customised and efficient support for personal, educational, and commercial financial needs.</p></motion.div>
      <div className="about-services-grid">{services.map(({ icon: Icon, number, title, copy }, index) => <motion.article {...reveal} transition={{ duration: .45, delay: index * .07 }} key={title}><div><span><Icon size={22} /></span><small>{number}</small></div><h3>{title}</h3><p>{copy}</p><ArrowRight size={18} /></motion.article>)}</div>
    </div></section>

    <section className="about-growth">
      <div className="container-pb">
        <motion.div {...reveal} className="about-growth-heading"><div><span>Growth with purpose</span><h2>Accelerating progress through trust and innovation.</h2></div><Link to="/contact-us">Discover more <ArrowRight size={16} /></Link></motion.div>
        <div className="about-growth-grid">
          {[{ value: '90%', title: 'Fast Processing', copy: 'Efficient journeys with focused documentation and expert-backed assistance.' }, { value: '95%', title: 'Diverse Solutions', copy: 'A broad mix of products designed around individual and business needs.' }, { value: '90%', title: 'Reliable Experts', copy: 'Experienced support throughout your financial journey.' }].map((item, index) => <motion.div {...reveal} transition={{ duration: .45, delay: index * .08 }} key={item.title}><strong>{item.value}</strong><span><TrendingUp size={17} /></span><h3>{item.title}</h3><p>{item.copy}</p></motion.div>)}
        </div>
      </div>
    </section>

    <section className="container-pb company-section about-impact">
      <motion.div {...reveal}><span><Users size={25} /></span><h2>We help individuals access quick, understandable financial solutions.</h2></motion.div>
      <div>{[{ value: '92%', label: 'Client satisfaction rate' }, { value: '70%', label: 'Reduced approval time' }, { value: '₹500Cr+', label: 'Loans disbursed' }].map((item) => <motion.div {...reveal} key={item.label}><strong>{item.value}</strong><p>{item.label}</p></motion.div>)}</div>
    </section>

    <section className="about-process-wrap"><div className="container-pb company-section">
      <motion.div {...reveal} className="section-heading"><span>Our process</span><h2>Simplifying finance with experience, trust, and results</h2></motion.div>
      <div className="about-process">{process.map((item, index) => <motion.article {...reveal} transition={{ duration: .45, delay: index * .08 }} key={item.title}><div><small>{item.number}</small>{index < process.length - 1 && <span />}</div><Lightbulb size={22} /><h3>{item.title}</h3><p>{item.copy}</p></motion.article>)}</div>
    </div></section>
  </PageFrame>
}
