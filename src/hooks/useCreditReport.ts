import { useState } from 'react'
import { ApiClient, ApiError } from '../lib/apiClient'
import { AppEndpoints } from '../config/appConfig'

export type ReportType = 'cibil' | 'equifax' | 'crif'

interface GenerateReportParams {
  name: string
  mobile: string
  pan: string
  gender: string
  reportType: ReportType
  consent: boolean
  // Equifax-specific fields — only sent for equifax reports so the CIBIL and
  // CRIF APIs are not affected.
  dob?: string
  address?: string
  stateCode?: string
  pincode?: string
}

// Same payload shape used across all three bureaus — only `report_type`
// changes:
//   { name, mobile, pan, gender, report_type: 'cibil' | 'equifax' | 'crif', consent: true }
//
// For Equifax the payload additionally includes: dob, address, state, pincode

export function useCreditReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateReport = async ({
    name,
    mobile,
    pan,
    gender,
    reportType,
    consent,
    dob,
    address,
    stateCode,
    pincode,
  }: GenerateReportParams) => {
    setError('')

    if (!consent) {
      const msg = 'Please authorize the wallet deduction to generate this report.'
      setError(msg)
      throw new Error(msg)
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        mobile: mobile.trim(),
        pan: pan.trim().toUpperCase(),
        gender,
        report_type: reportType,
        consent: true,
      }

      // Equifax requires additional personal & address details: DOB, Address,
      // State, and Pincode. These are only sent for equifax reports so the
      // CIBIL and CRIF APIs are not affected.
      if (reportType === 'equifax') {
        payload.dob = dob
        payload.address = address
        payload.state = stateCode
        payload.pincode = pincode
      }

      // Requires the user to be logged in — the API deducts from
      // their wallet balance, so we send the auth token.
      const endpoint =
        reportType === 'equifax'
          ? AppEndpoints.equifaxGenerateReport
          : AppEndpoints.cibilGenerateReport

      const data = await ApiClient.post(endpoint, payload, {
        auth: true,
      })
      return data
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not generate report. Please try again.'
      setError(message)
      throw err instanceof Error ? err : new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (mobile: string, reportId: string) => {
    setError('')
    setLoading(true)
    try {
      const data = await ApiClient.post(AppEndpoints.cibilSendOtp, {
        mobile: mobile.trim(),
        report_id: reportId,
      }, { auth: true })
      return data
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not send OTP. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (mobile: string, reportId: string, otp: string) => {
    setError('')
    setLoading(true)
    try {
      const data = await ApiClient.post(AppEndpoints.customerVerifyOtp, {
        mobile: mobile.trim(),
        report_id: reportId,
        otp,
      }, { auth: true })
      return data
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'OTP verification failed. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { generateReport, sendOtp, verifyOtp, loading, error, setError }
}
