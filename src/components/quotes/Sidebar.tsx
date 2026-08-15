import { useState } from 'react'
import { Phone, Clock, Shield, ChevronDown, ChevronUp, Gift, MessageCircle } from 'lucide-react'

export default function Sidebar() {
  const [quietMode, setQuietMode] = useState(false)
  const [whyTermOpen, setWhyTermOpen] = useState(false)
  const [whyBrandOpen, setWhyBrandOpen] = useState(true)

  return (
    <div className="space-y-4">
      {/* Get a call button */}
      <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-cta py-3.5 text-sm font-bold text-white hover:bg-green-ctaDark transition-colors shadow-sm">
        <Phone className="h-4 w-4" />
        Get a call
      </button>

      {/* Quiet Mode */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Clock className="h-4.5 w-4.5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Quiet Mode</p>
              <p className="text-[10px] text-gray-400">No calls before the selected time</p>
            </div>
          </div>
          <button
            onClick={() => setQuietMode(!quietMode)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              quietMode ? 'bg-green-cta' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                quietMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Why Term Insurance */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          onClick={() => setWhyTermOpen(!whyTermOpen)}
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
              <Shield className="h-4.5 w-4.5 text-brand" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-navy">Why Term Insurance?</p>
              <p className="text-[10px] text-gray-400">High coverage at Low premium</p>
            </div>
          </div>
          {whyTermOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {whyTermOpen && (
          <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed">
            Term insurance provides a high sum assured at an affordable premium. It ensures your family is financially protected in your absence. The earlier you buy, the lower the premium.
          </div>
        )}
      </div>

      {/* Why AV Management */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          onClick={() => setWhyBrandOpen(!whyBrandOpen)}
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-tag/10">
              <Shield className="h-4.5 w-4.5 text-green-cta" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-navy">Why AV Management?</p>
              <p className="text-[10px] text-gray-400">Free dedicated claim assistance</p>
            </div>
          </div>
          {whyBrandOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {whyBrandOpen && (
          <div className="px-4 pb-4">
            <div className="rounded-xl bg-green-tag/5 border border-green-tag/20 p-4">
              <div className="flex items-start gap-3 mb-3">
                <Gift className="h-5 w-5 text-green-cta mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-navy">AV Management Guarantees FREE claim support for your family</p>
                  <p className="text-[10px] text-gray-500 mt-1">Claim amount settled for our customers (since 2018)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide">Amount Settled</p>
                  <p className="text-lg font-bold text-navy">₹3,016 Crore</p>
                </div>
                <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide">Claims Assisted</p>
                  <p className="text-lg font-bold text-navy">3,739</p>
                </div>
              </div>

              <button className="w-full rounded-lg border border-green-cta py-2 text-xs font-bold text-green-cta hover:bg-green-cta hover:text-white transition-colors">
                SEE CLAIM SUPPORT PROCESS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark transition-colors">
          <MessageCircle className="h-4 w-4" />
          Chat with us — Instant response
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>
    </div>
  )
}
