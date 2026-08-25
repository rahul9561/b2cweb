import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Camera, CheckCircle2, CreditCard, Edit3, Loader2, LockKeyhole, LogOut, Mail, Phone, UserRound, Wallet } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoans } from '../context/LoansContext'
import LogoutConfirmModal from '../components/LogoutConfirmModal'
import { getProfileImageUrl } from '../lib/profileApi'
import { getRequiredProfileWarning, isRequiredProfileComplete } from '../lib/profileApi'
import { useToast } from '../context/ToastContext'

const formatBalance = (value: unknown) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

const readableError = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''
  return message && !/<\/?html\b/i.test(message)
    ? message
    : 'We could not update your profile. Please try again.'
}

const getProfileNames = (profile: { first_name?: unknown; last_name?: unknown; full_name?: unknown; name?: unknown } | null) => {
  const legacyName = String(profile?.full_name ?? profile?.name ?? '').trim()
  const [legacyFirstName = '', ...legacyLastNameParts] = legacyName.split(/\s+/).filter(Boolean)
  return {
    firstName: String(profile?.first_name ?? legacyFirstName).trim(),
    lastName: String(profile?.last_name ?? legacyLastNameParts.join(' ')).trim(),
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, refreshProfile, updateProfile, logout } = useAuth()
  const { refreshLoans } = useLoans()
  const { showToast } = useToast()
  const firstLogin = Boolean((location.state as { firstLogin?: boolean } | null)?.firstLogin)
    || (isAuthenticated && !isRequiredProfileComplete(user))
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [pan, setPan] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (firstLogin) setEditing(true)
  }, [firstLogin])

  useEffect(() => {
    if (!isAuthenticated || (location.state as { profileRefreshed?: boolean } | null)?.profileRefreshed) return
    setLoading(true)
    refreshProfile()
      .catch((requestError) => setError(readableError(requestError)))
      .finally(() => setLoading(false))
  }, [isAuthenticated, location.state, refreshProfile])

  useEffect(() => {
    const names = getProfileNames(user)
    setFirstName(names.firstName)
    setLastName(names.lastName)
    setEmail(String(user?.email ?? ''))
    setDateOfBirth(String(user?.date_of_birth ?? ''))
    setPan(String(user?.pan ?? '').toUpperCase())
  }, [user])

  useEffect(() => {
    if (!profileImage) {
      setPreview('')
      return
    }
    const objectUrl = URL.createObjectURL(profileImage)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [profileImage])

  const imageUrl = preview || getProfileImageUrl(user?.profile_image)
  const displayName = useMemo(() => {
    const names = getProfileNames(user)
    return `${names.firstName} ${names.lastName}`.trim() || 'AV Management Customer'
  }, [user])
  const initials = useMemo(() => {
    return displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  }, [displayName])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const requiredWarning = getRequiredProfileWarning({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      pan,
    })
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth || !pan.trim()) {
      setError(requiredWarning)
      showToast(requiredWarning)
      return
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim().toUpperCase())) {
      setError('Please enter a valid PAN.')
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await updateProfile({
        id: user?.id,
        mobile: String(user?.mobile ?? ''),
        firstName,
        lastName,
        email,
        dateOfBirth,
        pan,
        profileImage,
      })
      setProfileImage(null)
      setEditing(false)
      setSuccess('Your profile has been updated successfully.')
      if (firstLogin) {
        void refreshLoans().catch(() => undefined)
        navigate('/')
      }
    } catch (requestError) {
      setError(readableError(requestError))
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    const names = getProfileNames(user)
    setFirstName(names.firstName)
    setLastName(names.lastName)
    setEmail(String(user?.email ?? ''))
    setDateOfBirth(String(user?.date_of_birth ?? ''))
    setPan(String(user?.pan ?? '').toUpperCase())
    setProfileImage(null)
    setError('')
    setEditing(false)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container-pb py-10 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">My account</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-navy md:text-4xl">Your profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage your personal details and keep your account information up to date.</p>
        </div>
      </section>

      <div className="container-pb -mt-1 grid max-w-5xl gap-6 py-6 md:py-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-700 px-5 py-6 text-white sm:px-6 lg:py-8">
            <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-indigo-400/20" />
            <div className="relative flex items-center gap-4 lg:block lg:text-center">
            <div className="relative h-20 w-20 shrink-0 lg:mx-auto lg:h-28 lg:w-28">
              <div className="grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-white/70 bg-blue-100 text-3xl font-bold text-blue-700 shadow-lg">
                {imageUrl ? <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" /> : initials}
              </div>
              {editing && (
                <button type="button" onClick={() => fileInput.current?.click()} className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-white text-blue-700 shadow-md transition hover:scale-105 lg:h-10 lg:w-10" aria-label="Upload profile image">
                  <Camera size={16} />
                </button>
              )}
              <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)} />
            </div>
            <div className="min-w-0 text-left lg:mt-5 lg:text-center">
              {/* <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">Account overview</p> */}
              <h2 className="mt-1 truncate text-lg font-bold text-white lg:text-xl">{displayName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-blue-100 lg:justify-center">
                <CheckCircle2 size={14} className="text-emerald-300" /> Verified account
              </p>
              {editing && <p className="mt-2 text-[11px] leading-4 text-blue-100 lg:mt-3 lg:text-xs">Tap the camera icon to upload a profile image</p>}
            </div>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><Wallet size={18} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-700">Wallet balance</span>
                  <span className="block text-[11px] text-slate-500">Available balance</span>
                </span>
              </span>
              <strong className="shrink-0 text-base text-blue-700">{formatBalance(user?.wallet_balance)}</strong>
            </div>
            <button type="button" onClick={() => setShowLogoutConfirm(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 active:scale-[0.99]">
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Details associated with your account</p>
            </div>
            {!editing && (
              <button type="button" onClick={() => { setEditing(true); setSuccess('') }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                <Edit3 size={16} /> Edit profile
              </button>
            )}
          </div>

          {success && <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 size={17} /> {success}</p>}
          {firstLogin && <p className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">Welcome! Please enter your first name, last name, DOB, and PAN to continue.</p>}
          {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={saveProfile} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                First name <span className="text-red-500">*</span>
                <span className="relative mt-2 block">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={firstName} onChange={(event) => setFirstName(event.target.value)} disabled={!editing || loading} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:text-slate-600" />
                </span>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Last name <span className="text-red-500">*</span>
                <span className="relative mt-2 block">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={lastName} onChange={(event) => setLastName(event.target.value)} disabled={!editing || loading} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:text-slate-600" />
                </span>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Date of birth <span className="text-red-500">*</span>
                <span className="relative mt-2 block">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="date" value={dateOfBirth} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setDateOfBirth(event.target.value)} disabled={!editing || loading} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:text-slate-600" />
                </span>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                PAN <span className="text-red-500">*</span>
                <span className="relative mt-2 block">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={pan} maxLength={10} onChange={(event) => setPan(event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())} disabled={!editing || loading} placeholder="ABCDE1234F" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 uppercase outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:text-slate-600" />
                </span>
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Email address <span className="font-normal text-slate-400">(Optional)</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!editing || loading} placeholder="Add your email address" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:text-slate-600" />
              </span>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Mobile number
              <span className="relative mt-2 block">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={String(user?.mobile ?? '')} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-12 text-slate-600" />
                <LockKeyhole className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              </span>
              <span className="mt-2 block text-xs font-normal text-slate-500">Your verified mobile number cannot be changed.</span>
            </label>

            {editing && (
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                {!firstLogin && <button type="button" onClick={cancelEdit} disabled={loading} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">Cancel</button>}
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                  {loading ? <><Loader2 size={17} className="animate-spin" /> Saving...</> : 'Save changes'}
                </button>
              </div>
            )}
          </form>
        </section>
      </div>

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout()
          setShowLogoutConfirm(false)
          navigate('/')
        }}
      />
    </main>
  )
}
