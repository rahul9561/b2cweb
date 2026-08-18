import { useState } from 'react'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'

interface GenerateAnalysisParams {
  pan: string
  mobile: string
  consent: boolean
  name?: string
  gender?: string
}

export function useCreditAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Generate the CIBIL analysis report.
   * Endpoint: POST /analysis/credit-analysis/cibil/
   *
   * The backend serializer expects: name, mobile, pan_card, gender, consent.
   * name and gender are populated from the authenticated user session and/or
   * the user-profile context so they do not need to be shown as input fields
   * on the page. Sensible fallbacks keep the backend serializer happy even
   * when a value is missing from the session.
   */
  const generateAnalysis = async ({ pan, mobile, consent, name, gender }: GenerateAnalysisParams) => {
    setError('')
    if (!consent) {
      const msg = 'Please authorize the ₹299 deduction to generate this report.'
      setError(msg)
      throw new Error(msg)
    }
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        name: name?.trim() || 'User',
        mobile: mobile.trim(),
        pan_card: pan.trim().toUpperCase(),
        gender: gender?.trim() ? gender.trim() : 'male',
        consent: true,
      }
      const data = await ApiClient.post(AppEndpoints.cibilAnalysisGenerateReport, payload, { auth: true })
      return data
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not generate the analysis report. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Submit the user's verification responses.
   * Endpoint: POST /analysis/credit-analysis/upload/
   */
  const submitVerification = async (payload: Record<string, unknown>) => {
    setError('')
    setLoading(true)
    try {
      const data = await ApiClient.post(AppEndpoints.cibilAnalysisUpload, payload, { auth: true })
      return data
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not submit verification. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { generateReport: generateAnalysis, submitVerification, loading, error, setError }
}