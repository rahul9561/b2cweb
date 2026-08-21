import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, BookOpen, IndianRupee } from 'lucide-react'

interface StickySaveTaxBarProps {
  /** Ref to the Footer element — when it enters the viewport the bar hides */
  footerRef: React.RefObject<HTMLElement | null>
}

/**
 * Persistent "Save Tax" sticky bar pinned to the bottom of the viewport.
 * Uses an IntersectionObserver on the Footer — when the Footer scrolls into
 * view the bar animates out (slide-down + fade, 250ms) and unmounts so it
 * never overlaps the footer.
 */
export default function StickySaveTaxBar({ footerRef }: StickySaveTaxBarProps) {
  const [dismissed, setDismissed] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobile, setMobile] = useState('78xxxxx007')
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footerEl = footerRef.current
    if (!footerEl || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFooterVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.05 }
    )

    observer.observe(footerEl)
    return () => observer.disconnect()
  }, [footerRef])

  /* When footer becomes visible → animate out then unmount */
  useEffect(() => {
    if (!footerVisible) return
    const t = setTimeout(() => setHidden(true), 250)
    return () => clearTimeout(t)
  }, [footerVisible])

  if (dismissed || hidden) return null

  return (
    <div
      ref={barRef}
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-[250ms] ease-out ${
        footerVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      role="complementary"
      aria-label="Save tax offer"
    >
      <div className="relative bg-[#0F1B33] shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss save tax bar"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={14} />
        </button>

        <div className="container-pb flex flex-col items-center gap-3 py-3 pr-8 md:flex-row md:gap-5 md:py-2.5">
          {/* Left illustration */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <BookOpen size={18} className="text-white" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-cta">
                <IndianRupee size={9} className="text-white" />
              </span>
            </span>
          </div>

          {/* Center-left text */}
          <p className="text-center text-[13px] font-medium text-white md:text-left">
            Save up to{' '}
            <span className="text-[15px] font-bold text-green-cta">₹46,800</span> in Section 80C*
          </p>

          {/* Right mini lead form */}
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-2">
              <span className="text-[11px] font-medium text-white">India</span>
              <ChevronDown size={12} className="text-white/60" />
              <span className="text-[11px] text-white/60">+91</span>
            </div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              aria-label="Mobile number"
              className="w-full min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-[12px] text-white placeholder-white/40 outline-none focus:bg-white/15 focus:ring-2 focus:ring-green-cta md:w-36 md:flex-none"
            />
            <button className="shrink-0 rounded-lg bg-green-cta px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-green-ctaDark focus:outline-none focus-visible:ring-2 focus-visible:ring-green-cta focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1B33]">
              Save Tax
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}