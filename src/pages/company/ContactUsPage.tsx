import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Building2, Check, Headphones, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react'
import { CompanyHero, PageFrame, reveal } from './CompanyPageShell'

const contacts = [
  { icon: MapPin, title: 'Dirba Office', lines: ['Shop No. 54, New Grain Market', 'Dirba, District Sangrur 148035', '+91 90565 30723'] },
  { icon: Building2, title: 'Patiala Office', lines: ['2nd Floor, Dev Complex', 'Sirhind Road, Patiala 147004', '+91 97197 00023'] },
  { icon: Phone, title: 'Central Support', lines: ['+91 99175 00023', 'Speak with our customer team', 'Monday – Saturday'] },
  { icon: Mail, title: 'Email Us', lines: ['contact@avmanagement.in', 'Share your enquiry anytime', 'We will get back to you'] },
]

export default function ContactUsPage() {
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Website enquiry: ${String(data.get('topic') ?? 'General support')}`)
    const body = encodeURIComponent(`Name: ${String(data.get('name') ?? '')}\nEmail: ${String(data.get('email') ?? '')}\nMobile: ${String(data.get('phone') ?? '')}\n\n${String(data.get('message') ?? '')}`)
    window.location.href = `mailto:contact@avmanagement.in?subject=${subject}&body=${body}`
    setSent(true)
  }
  return <PageFrame>
    <CompanyHero eyebrow="We are here to help" title="Let’s start a conversation." description="Whether you need loan guidance, product support, or help with a digital service, our team is ready to listen." icon={Headphones} />
    <section className="container-pb contact-cards">
      {contacts.map(({ icon: Icon, title, lines }, index) => <motion.article {...reveal} transition={{ duration: .45, delay: index * .06 }} key={title}><span><Icon size={22} /></span><h2>{title}</h2>{lines.map((line) => <p key={line}>{line}</p>)}</motion.article>)}
    </section>
    <section id="contact-form" className="container-pb contact-main">
      <motion.div {...reveal} className="contact-story"><span>Get in touch</span><h2>Financial questions deserve clear answers.</h2><p>AV Management helps customers navigate education loans, credit information, insurance, investment journeys, and other financial services with timely human support.</p><div><BadgeCheck size={22} /><p><strong>Customer-first guidance</strong>Tell us what you need and we’ll help identify the right next step.</p></div><div><ShieldCheck size={22} /><p><strong>Your privacy matters</strong>Please do not share passwords, card PINs, or UPI PINs in your message.</p></div></motion.div>
      <motion.form {...reveal} onSubmit={submit} className="contact-form">
        <div className="contact-form-heading"><span><Send size={17} /></span><div><h2>Send us a message</h2><p>Required fields are marked with an asterisk.</p></div></div>
        {sent ? <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="contact-success"><span><Check size={24} /></span><h3>Your email app should now be open.</h3><p>Review the prepared message and press send. If it did not open, email contact@avmanagement.in or call +91 99175 00023.</p><button type="button" onClick={() => setSent(false)}>Prepare another message</button></motion.div> : <>
          <label>Full name *<input name="name" required placeholder="Enter your full name" /></label>
          <div className="contact-form-row"><label>Email address *<input name="email" type="email" required placeholder="you@example.com" /></label><label>Mobile number *<input name="phone" inputMode="numeric" required pattern="[6-9][0-9]{9}" placeholder="10-digit number" /></label></div>
          <label>How can we help? *<select name="topic" required defaultValue=""><option value="" disabled>Select an enquiry</option><option>Loan guidance</option><option>Credit report or CIBIL support</option><option>Insurance or investment support</option><option>Career application</option><option>Payment or account support</option><option>Other enquiry</option></select></label>
          <label>Message *<textarea name="message" required rows={5} placeholder="Tell us a little about your enquiry" /></label>
          <button type="submit">Send message <ArrowRight size={17} /></button>
        </>}
      </motion.form>
    </section>
  </PageFrame>
}
