import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, Check, Code2, Laptop2, Rocket, Send, UserCheck, Users } from 'lucide-react'
import { CompanyHero, PageFrame, reveal } from './CompanyPageShell'

const openings = [
  { title: 'Sales Executive', icon: Rocket, description: 'Manage customer onboarding and promote financial products and loan services.', details: ['Full Time', 'Patiala 147004, Punjab', '0–2 years experience'] },
  { title: 'Full Stack Developer', icon: Code2, description: 'Work on fintech dashboards, APIs, verification systems, and portal development.', details: ['React / Django', '1–3 years experience', 'Office-based role'] },
  { title: 'KYC Verification Executive', icon: UserCheck, description: 'Handle customer verification, CKYC processing, and onboarding.', details: ['Fintech operations', 'Freshers can apply', 'Training provided'] },
]

export default function CareersPage() {
  return <PageFrame>
    <CompanyHero eyebrow="Grow with AV Management" title="Build work that moves finance forward." description="Join a fast-growing financial services and fintech team creating simpler, more accessible customer experiences." icon={BriefcaseBusiness} />
    <section className="container-pb company-section">
      <motion.div {...reveal} className="section-heading"><span>Current openings</span><h2>Find your next opportunity</h2><p>Explore roles across financial services, customer onboarding, verification, and technology.</p></motion.div>
      <div className="career-grid">
        {openings.map((opening, index) => { const Icon = opening.icon; return <motion.article {...reveal} transition={{ duration: .45, delay: index * .08 }} key={opening.title} className="career-card">
          <div className="career-card-top"><span><Icon size={23} /></span><small>{String(index + 1).padStart(2, '0')}</small></div>
          <h3>{opening.title}</h3><p>{opening.description}</p>
          <ul>{opening.details.map((detail) => <li key={detail}><Check size={15} />{detail}</li>)}</ul>
          <Link to="/contact-us#contact-form">Apply now <ArrowRight size={16} /></Link>
        </motion.article>})}
      </div>
    </section>
    <section className="career-values-wrap"><div className="container-pb company-section">
      <motion.div {...reveal} className="section-heading"><span>Life at AV</span><h2>Why join AV Management?</h2></motion.div>
      <div className="value-grid">
        {[{ icon: Rocket, title: 'Fast Growing Company', copy: 'Build with an innovative financial services company expanding across India.' }, { icon: Users, title: 'Collaborative Culture', copy: 'Learn with a professional, supportive team that values ownership.' }, { icon: Laptop2, title: 'Modern Technologies', copy: 'Work on real fintech products, APIs, verification systems, and customer journeys.' }].map(({ icon: Icon, title, copy }) => <motion.div {...reveal} key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{copy}</p></motion.div>)}
      </div>
      <motion.div {...reveal} className="career-cta"><div><span>Make your next move count</span><h2>Ready to start your career?</h2><p>Send your resume and tell us where you can make an impact.</p></div><a href="mailto:contact@avmanagement.in?subject=Career%20Application%20-%20AV%20Management">Send your resume <Send size={17} /></a></motion.div>
    </div></section>
  </PageFrame>
}
