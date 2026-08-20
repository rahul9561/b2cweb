import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useWallet } from '../context/WalletContext'
import { getTotalBalance, type RechargePlan } from '../lib/walletApi'

export type ReportProduct = 'cibil' | 'crif' | 'equifax' | 'only_score' | 'advanced_cibil' | 'prefill'

const priceFields: Record<ReportProduct, keyof RechargePlan> = {
  cibil: 'cibil_price',
  crif: 'crif_price',
  equifax: 'equifax_price',
  only_score: 'only_score_price',
  advanced_cibil: 'cibil_advanced_price',
  prefill: 'prefill_price',
}

const STANDARD_REPORT_PRICE = 299
const standardReportProducts: ReportProduct[] = ['cibil', 'crif', 'equifax']

const numericPrice = (plans: RechargePlan | null, product: ReportProduct): number | null => {
  if (standardReportProducts.includes(product)) return STANDARD_REPORT_PRICE
  if (!plans) return null
  const value = Number(plans[priceFields[product]])
  return Number.isFinite(value) && value >= 0 ? value : null
}

const roundCurrency = (value: number) => Math.ceil(Math.max(0, value) * 100) / 100

export const formatReportPrice = (price: number | null) =>
  price === null
    ? 'Loading live price…'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price)

export const isInsufficientBalanceError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /insufficient|low\s+(?:wallet\s+)?balance|wallet\s+balance.*(?:low|required|needed)/i.test(message)
}

export function useReportPurchaseGuard(product: ReportProduct, enabled = true) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { wallet, plans, refreshBalance, refreshPlans } = useWallet()
  const [shortfall, setShortfall] = useState(0)
  const [showInsufficient, setShowInsufficient] = useState(false)
  const [checkingBalance, setCheckingBalance] = useState(false)
  const price = useMemo(() => numericPrice(plans, product), [plans, product])
  const usesFixedStandardPrice = standardReportProducts.includes(product)

  useEffect(() => {
    if (enabled && !usesFixedStandardPrice) void refreshPlans().catch(() => undefined)
  }, [enabled, refreshPlans, usesFixedStandardPrice])

  const openInsufficientModal = useCallback((amount: number) => {
    setShortfall(roundCurrency(Math.max(amount, 0.01)))
    setShowInsufficient(true)
    showToast('Insufficient wallet balance.')
  }, [showToast])

  const ensureSufficientBalance = useCallback(async (): Promise<boolean> => {
    if (checkingBalance) return false
    setCheckingBalance(true)
    try {
      let livePlans = plans
      if (!livePlans && !usesFixedStandardPrice) {
        try {
          livePlans = await refreshPlans()
        } catch (error) {
          if (numericPrice(null, product) === null) throw error
        }
      }
      const livePrice = numericPrice(livePlans, product)
      if (livePrice === null) throw new Error('Live report pricing is unavailable. Please try again.')

      const liveWallet = wallet ?? await refreshBalance()
      const available = getTotalBalance(liveWallet)
      if (available < livePrice) {
        openInsufficientModal(livePrice - available)
        return false
      }
      return true
    } finally {
      setCheckingBalance(false)
    }
  }, [checkingBalance, openInsufficientModal, plans, product, refreshBalance, refreshPlans, usesFixedStandardPrice, wallet])

  const handleInsufficientApiError = useCallback(async (error: unknown): Promise<boolean> => {
    if (!isInsufficientBalanceError(error)) return false
    let available = wallet ? getTotalBalance(wallet) : 0
    let livePrice = price
    try {
      const latestWallet = await refreshBalance()
      available = getTotalBalance(latestWallet)
      if (!usesFixedStandardPrice) {
        const latestPlans = await refreshPlans()
        livePrice = numericPrice(latestPlans, product)
      }
    } catch {
      // Use the most recent context values when a refresh is unavailable.
    }
    openInsufficientModal(livePrice === null ? 0.01 : Math.max(livePrice - available, 0.01))
    return true
  }, [openInsufficientModal, price, product, refreshBalance, refreshPlans, usesFixedStandardPrice, wallet])

  const reportPurchased = useCallback(async () => {
    showToast('Report purchase successful.')
    await refreshBalance().catch(() => undefined)
  }, [refreshBalance, showToast])

  return {
    price,
    checkingBalance,
    ensureSufficientBalance,
    handleInsufficientApiError,
    reportPurchased,
    insufficientModalProps: {
      open: showInsufficient,
      shortfall,
      onCancel: () => setShowInsufficient(false),
      onAddMoney: () => navigate(`/wallet/add-money?amount=${encodeURIComponent(shortfall)}`),
    },
  }
}
