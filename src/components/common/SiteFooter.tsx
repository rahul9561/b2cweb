import { Shield, Phone, Mail, MapPin } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
                AV
              </div>
              <span className="text-xl font-bold">AV Management</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              India's leading insurance comparison platform. Compare policies, get instant quotes, and buy the best plan for your family.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 border border-white/10">
              <Shield className="h-5 w-5 text-brand" />
              <div>
                <p className="text-[11px] text-gray-400">IRDAI License No.</p>
                <p className="text-xs font-bold">1234567890</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold mb-4">Products</h4>
            <ul className="space-y-2.5">
              {['Term Life Insurance', 'Health Insurance', 'Car Insurance', 'Bike Insurance', 'Travel Insurance', 'Investment Plans'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact Us', 'Terms & Conditions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand" />
                <span className="text-sm text-gray-400">9917500023 / 9217010023</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand" />
                <span className="text-sm text-gray-400">info@help.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand mt-0.5" />
                <span className="text-sm text-gray-400">123 Insurance Tower, Financial District, Mumbai - 400001</span>
              </div>
            </div>

            {/* Social */}
            <div className="mt-4">
              <p className="text-xs font-bold mb-2">Follow Us</p>
              <div className="flex gap-2">
                {['FB', 'TW', 'IG', 'LI'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-gray-400 hover:bg-brand hover:text-white transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-gray-500">
              © 2026 AV Management. All rights reserved. | Insurance is the subject matter of solicitation.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors">Disclaimer</a>
              <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors">Grievance Redressal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
