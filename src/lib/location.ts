/**
 * Location utility — resolves the user's pincode from their browser
 * geolocation permission. If the user denies access, geolocation is
 * unavailable, or reverse-geocoding fails, we fall back to the static
 * default pincode "843123".
 */

export const DEFAULT_PINCODE = '843123'

interface ReverseGeocodeResult {
  postcode?: string
  address?: {
    postcode?: string
  }
  [key: string]: unknown
}

/**
 * Ask the browser for the user's current position and reverse-geocode
 * it into a 6-digit Indian pincode.
 *
 * @returns A 6-digit pincode string, or the DEFAULT_PINCODE on any failure.
 */
export async function getPincodeFromLocation(): Promise<string> {
  try {
    if (!('geolocation' in navigator)) {
      return DEFAULT_PINCODE
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      })
    })

    const { latitude, longitude } = position.coords

    // Reverse-geocode using OpenStreetMap's free Nominatim service.
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return DEFAULT_PINCODE

    const data = (await response.json()) as ReverseGeocodeResult
    const postcode = data?.address?.postcode ?? data?.postcode

    if (postcode && /^\d{6}$/.test(String(postcode))) {
      return String(postcode)
    }

    return DEFAULT_PINCODE
  } catch {
    // User denied permission, geolocation timed out, or any other error.
    return DEFAULT_PINCODE
  }
}