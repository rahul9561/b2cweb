import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Share2, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '919719700023'

export default function FloatingQuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to know more about AV Management services.')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  const inviteFriends = async () => {
    const shareUrl = `${window.location.origin}/`
    const shareData = {
      title: 'AV Management',
      text: 'Explore insurance, credit and financial services with AV Management.',
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      }
      setIsOpen(false)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareUrl}`)}`
      window.open(whatsappShare, '_blank', 'noopener,noreferrer')
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="floating-quick-actions"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-end gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur-md"
          >
            <button
              type="button"
              onClick={openWhatsApp}
              className="group flex min-w-[178px] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-emerald-50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shadow-sm transition group-hover:scale-105">
                <FaWhatsapp size={21} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy">WhatsApp</span>
                <span className="block text-[11px] text-slate-500">Chat with our team</span>
              </span>
            </button>

            <div className="h-px w-full bg-slate-100" />

            <button
              type="button"
              onClick={() => void inviteFriends()}
              className="group flex min-w-[178px] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-sm transition group-hover:scale-105">
                <Share2 size={19} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy">Invite friends</span>
                <span className="block text-[11px] text-slate-500">Share AV Management</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {copied && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Website link copied
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
        aria-controls="floating-quick-actions"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white text-white shadow-[0_12px_30px_rgba(15,23,42,0.3)] transition-colors sm:h-16 sm:w-16 ${
          isOpen ? 'bg-slate-800 hover:bg-slate-700' : 'bg-brand hover:bg-blue-700'
        }`}
      >
        <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.span>
      </motion.button>
    </div>
  )
}
