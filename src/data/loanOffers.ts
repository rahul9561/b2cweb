export interface LoanOffer {
  name: string
  city: string
  roiStartingAt: string
  monthlyEmi: string
  approvalChance: 'High' | 'Medium' | 'Excellent'
  applyUrl: string
  logoColour: string
}

export const loanOffers: LoanOffer[] = [
  {
    name: 'HDFC Bank',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '10.75% p.a',
    monthlyEmi: '₹14,461',
    approvalChance: 'High',
    applyUrl: 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan',
    logoColour: 'bg-[#004c8f]',
  },
  {
    name: 'ICICI Bank',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '10.85% p.a',
    monthlyEmi: '₹14,520',
    approvalChance: 'Excellent',
    applyUrl: 'https://www.icicibank.com/personal-banking/loans/personal-loan',
    logoColour: 'bg-[#f58220]',
  },
  {
    name: 'Axis Bank',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '10.99% p.a',
    monthlyEmi: '₹14,592',
    approvalChance: 'High',
    applyUrl: 'https://www.axisbank.com/retail/loans/personal-loan',
    logoColour: 'bg-[#97144d]',
  },
  {
    name: 'Bajaj Finserv',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '11.25% p.a',
    monthlyEmi: '₹14,710',
    approvalChance: 'Medium',
    applyUrl: 'https://www.bajajfinserv.in/personal-loan',
    logoColour: 'bg-[#0061af]',
  },
  {
    name: 'State Bank of India',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '11.00% p.a',
    monthlyEmi: '₹14,620',
    approvalChance: 'High',
    applyUrl: 'https://www.sbi.co.in/web/personal-banking/loans/consumer-finance-loop',
    logoColour: 'bg-[#244b8f]',
  },
  {
    name: 'IDFC FIRST Bank',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '10.49% p.a',
    monthlyEmi: '₹14,385',
    approvalChance: 'Excellent',
    applyUrl: 'https://www.idfcfirstbank.com/personal-loan',
    logoColour: 'bg-[#ee3124]',
  },
  {
    name: 'Tata Capital',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '11.49% p.a',
    monthlyEmi: '₹14,780',
    approvalChance: 'Medium',
    applyUrl: 'https://www.tatacapital.com/personal-loan.html',
    logoColour: 'bg-[#1f5faa]',
  },
  {
    name: 'Kotak Mahindra Bank',
    city: 'Lucknow, Uttar Pradesh',
    roiStartingAt: '10.60% p.a',
    monthlyEmi: '₹14,410',
    approvalChance: 'High',
    applyUrl: 'https://www.kotak.com/en/personal-banking/loans/personal-loan.html',
    logoColour: 'bg-[#e4051a]',
  },
]