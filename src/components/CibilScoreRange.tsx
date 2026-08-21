import React from 'react'
import { CheckCircle2 } from 'lucide-react'

const CibilScoreRange: React.FC = () => {
  const scoreRanges = [
    {
      range: '900-800',
      label: 'Excellent',
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-700',
      title: '801 – 900 – Excellent CIBIL Score',
      points: [
        'Reflects strong repayment history, low utilisation, and responsible credit behaviour.',
        'Best chances of approval with the lowest interest rates and higher loan amounts.',
      ],
    },
    {
      range: '800-700',
      label: 'Very Good',
      color: 'bg-green-400',
      bgLight: 'bg-green-100',
      textColor: 'text-green-600',
      title: '761 - 800 – Very Good CIBIL Score',
      points: [
        'Shows responsible credit behaviour with some scope for improvement.',
        'Eligible for loans/cards, but not necessarily the best terms.',
      ],
    },
    {
      range: '701-740',
      label: 'Good',
      color: 'bg-yellow-400',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      title: '701 – 760 – Good CIBIL Score',
      points: [
        'Indicates past repayment issues or high credit utilisation.',
        'May get limited credit access at high interest rates and stricter terms.',
      ],
    },
    {
      range: '681-700',
      label: 'Average',
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
      title: '601 – 700 – Average CIBIL Score',
      points: [
        'Demonstrates regular defaults, very high utilisation, and frequent enquiries.',
        'Most lenders may not approve the credit application; immediate attention is required.',
      ],
    },
    {
      range: '300-600',
      label: 'Poor',
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
      title: '300 – 600 – Poor CIBIL Score',
      points: [
        'Represents irregular repayment history, defaults, or high DPD.',
        'Most lenders reject applications in this range. Rebuild credit with responsible usage.',
      ],
    },
    {
      range: 'NA/NR',
      label: 'No History',
      color: 'bg-gray-500',
      bgLight: 'bg-gray-50',
      textColor: 'text-gray-700',
      title: 'NA/NH – No History (New to Credit)',
      points: [
        'You have no credit history, or lenders don\'t have a track record of your credit behaviour.',
        'Apply for a secured credit card or small-ticket loan to start your credit journey.',
      ],
    },
  ]

  const tips = [
    'Regular on-time payment',
    'Keep credit utilization low (below 30%)',
    'Never miss out on loan payments',
    'Maintain credit mix',
    'Monitor your credit report regularly',
  ]

  return (
    <div className="w-full bg-white">
      {/* Header with Image */}
      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                CIBIL Score Range – What it Means for You
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Your CIBIL score is a three-digit number that represents your creditworthiness. Understanding the score ranges is crucial for improving your financial health and securing favorable loan terms.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">750</div>
                <div className="text-lg font-semibold">Good Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Ranges Visual */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-navy mb-8 text-center">CIBIL Score Range & What It Means</h2>

          {/* Visual Score Bars */}
          <div className="mb-12">
            {/* Color-coded ranges visualization */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
              {scoreRanges.map((range, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className={`${range.color} h-32 rounded-lg flex items-center justify-center mb-2 text-white font-bold text-center p-2 text-sm`}
                  >
                    <span>{range.range}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">{range.label}</div>
                </div>
              ))}
            </div>

            {/* Score Gauge */}
            <div className="mt-8">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>300 Poor</span>
                <span>900 Excellent</span>
              </div>
              <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-green-600 overflow-hidden flex items-center">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-6 w-1 bg-white border-2 border-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Detailed Score Range Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {scoreRanges.map((range, idx) => (
              <div key={idx} className={`${range.bgLight} rounded-lg p-6 border-l-4 ${range.color.replace('bg-', 'border-')}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`${range.color} h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center`}>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">{range.title}</h3>
                </div>
                <ul className="space-y-2">
                  {range.points.map((point, pidx) => (
                    <li key={pidx} className="text-slate-700 text-sm flex items-start gap-2">
                      <span className="text-slate-400 font-bold mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* How to Maintain a High Credit Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">✓</span>
              How to Maintain a High Credit Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-slate-700 font-semibold">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-navy mb-1">Credit Score Range</div>
                <div className="text-slate-600 text-sm">300 – 900</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-amber-200 pt-4 md:pt-0 md:pl-6">
                <div className="text-lg font-bold text-navy mb-1">Score Calculation</div>
                <div className="text-slate-600 text-sm">Lenders consider 2+ months of credit history to calculate score</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-amber-200 pt-4 md:pt-0 md:pl-6">
                <div className="text-lg font-bold text-navy mb-1">Check Frequency</div>
                <div className="text-slate-600 text-sm">Check your CIBIL score at least once every 3-6 months regularly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-slate-500 italic text-center">
            *These credit score ranges (i.e. Excellent, Good, etc.) are based on standard credit bureau criteria and are generally accepted in the industry.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CibilScoreRange
