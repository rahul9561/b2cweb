import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { personalInsurance, businessInsurance } from '../data/modalProducts'
import type { ModalSection, ModalProduct } from '../data/modalProducts'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'personal' | 'business'

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const modalRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const sections = activeTab === 'personal' ? personalInsurance : businessInsurance

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="View All Products"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full max-w-[1250px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl"
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-[22px] font-bold text-navy">More Products</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 px-8">
          {([
            { key: 'personal' as Tab, label: 'Personal Insurance' },
            { key: 'business' as Tab, label: 'Business Insurance' },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 pt-4 text-[15px] font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-brand'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-t bg-brand" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {sections.map((group: ModalSection) => (
            <div key={group.section} className="mb-8 last:mb-0">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[3px] w-1 rounded-full bg-brand" />
                <h3 className="text-[16px] font-semibold text-navy">{group.section}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {group.items.map((item: ModalProduct) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.url)
                      onClose()
                    }}
                    className="group relative flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg"
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-10 w-10 shrink-0 rounded-lg object-contain transition-transform group-hover:scale-110"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium leading-tight text-navy group-hover:text-brand">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
