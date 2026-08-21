import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, FileText, Handshake, Headphones, LockKeyhole, Scale, ShieldCheck, Sparkles } from 'lucide-react'
import { CompanyHero, PageFrame, reveal } from './CompanyPageShell'

const policies = [
  { icon: LockKeyhole, title: 'Privacy Policy', copy: 'How personal data is collected, used, shared, and protected.', to: '/privacy-policy' },
  { icon: Scale, title: 'Terms & Conditions', copy: 'Rules for using the website, services, applications, and payments.', to: '/terms-and-conditions' },
  { icon: FileText, title: 'Important Disclosures', copy: 'Our role, third-party decisions, fees, and customer responsibilities.', to: '/disclosure' },
  { icon: Headphones, title: 'Customer Support', copy: 'Addresses, contact channels, and a direct route to our support team.', to: '/contact-us' },
]

export default function LegalAdminPoliciesPage() {
  return <PageFrame>
    <CompanyHero eyebrow="Governance and customer care" title="Legal & Admin Policies" description="One clear place to understand your rights, responsibilities, privacy, and the standards guiding our digital services." icon={ShieldCheck} />
    <section className="container-pb company-section legal-hub">
      <motion.div {...reveal} className="section-heading"><span>Policy centre</span><h2>Designed for clarity and confidence</h2><p>Review the policy or support area relevant to your interaction with AV Management.</p></motion.div>
      <div className="policy-grid">{policies.map(({ icon: Icon, title, copy, to }, index) => <motion.article {...reveal} transition={{ duration: .45, delay: index * .06 }} key={title}><span><Icon size={23} /></span><small>{String(index + 1).padStart(2, '0')}</small><h2>{title}</h2><p>{copy}</p><Link to={to}>Read policy <ArrowRight size={16} /></Link></motion.article>)}</div>
      <motion.div {...reveal} className="admin-principles"><div><Sparkles size={22} /><h2>Our administrative principles</h2></div><div className="principles-grid">{[
        { title: 'Responsible access', copy: 'Identity, account, and service access should be authorised and used only for legitimate purposes.' },
        { title: 'Transparent communication', copy: 'Important fees, permissions, and next steps should be visible before a customer proceeds.' },
        { title: 'Secure operations', copy: 'We use appropriate controls and trusted service providers to support digital journeys.' },
        { title: 'Customer escalation', copy: 'Questions and service concerns can be raised through our central support channels.' },
      ].map((item) => <div key={item.title}><Check size={16} /><p><strong>{item.title}</strong>{item.copy}</p></div>)}</div></motion.div>
      <motion.div {...reveal} className="policy-contact"><Handshake size={28} /><div><h2>Need help understanding a policy?</h2><p>Our support team can help you find the relevant section or service contact.</p></div><Link to="/contact-us">Contact support <ArrowRight size={17} /></Link></motion.div>
    </section>
  </PageFrame>
}
