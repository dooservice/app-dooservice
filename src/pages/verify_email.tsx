import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLayout, useVerifyEmail, useResendVerification } from '@/features/auth'
import OtpInput from '@/components/otp_input'
import Button from '@/components/button'

interface LocationState {
  email: string
}

export default function VerifyEmailPage() {
  const { t }    = useTranslation('auth')
  const location = useLocation()
  const navigate = useNavigate()
  const state    = location.state as LocationState | null
  const email    = state?.email ?? ''

  const [code, setCode]         = useState('')
  const [cooldown, setCooldown] = useState(0)

  const { mutate: verify, isPending: verifying } = useVerifyEmail()
  const { mutate: resend, isPending: resending }  = useResendVerification()

  useEffect(() => {
    if (!email) navigate('/sign-in', { replace: true })
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = () => {
    resend({ email }, { onSuccess: () => setCooldown(60) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 6) return
    verify({ email, code })
  }

  return (
    <AuthLayout title={t('verifyEmail.title')}>
      <p
        className="text-sm text-neutral-500 text-center mb-6"
        dangerouslySetInnerHTML={{ __html: t('verifyEmail.description', { email }) }}
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <OtpInput onChange={setCode} disabled={verifying} />
        <Button type="submit" className="w-full!" loading={verifying} disabled={code.length < 6}>
          {t('verifyEmail.submit')}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm text-neutral-500">
          {t('verifyEmail.noCode')}{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="font-medium text-brand-teal hover:text-brand-teal-dark disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
          >
            {resending ? t('verifyEmail.resending') : cooldown > 0 ? t('verifyEmail.resendIn', { seconds: cooldown }) : t('verifyEmail.resend')}
          </button>
        </p>
        <Link className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors" to="/sign-in">
          {t('verifyEmail.backToSignIn')}
        </Link>
      </div>
    </AuthLayout>
  )
}
