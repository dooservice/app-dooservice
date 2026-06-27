import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { AuthLayout, useResetPassword } from '@/features/auth'
import OtpInput from '@/components/otp_input'
import InputField from '@/components/input_field'
import Button from '@/components/button'

const schema = z
  .object({
    new_password:     z.string().min(8, 'Minimum 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine(d => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path:    ['confirm_password'],
  })

type Values = z.infer<typeof schema>

interface LocationState {
  email: string
}

export default function ResetPasswordPage() {
  const { t }        = useTranslation('auth')
  const location     = useLocation()
  const navigate     = useNavigate()
  const state        = location.state as LocationState | null
  const email        = state?.email ?? ''

  const [code, setCode]       = useState('')
  const { mutate, isPending } = useResetPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  })

  if (!email) {
    navigate('/forgot-password', { replace: true })
    return null
  }

  const onSubmit = (data: Values) => {
    if (code.length < 6) return
    mutate({ email, code, new_password: data.new_password })
  }

  return (
    <AuthLayout
      title={t('resetPassword.title')}
      action={
        <Link className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors" to="/sign-in">
          {t('verifyEmail.backToSignIn')}
        </Link>
      }
    >
      <p
        className="text-sm text-neutral-500 text-center mb-6"
        dangerouslySetInnerHTML={{ __html: t('resetPassword.description', { email }) }}
      />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-600 text-center">Código de verificación</p>
          <OtpInput onChange={setCode} disabled={isPending} />
        </div>
        <InputField
          id="new_password"
          type="password"
          label={t('newPassword')}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.new_password?.message}
          {...register('new_password')}
        />
        <InputField
          id="confirm_password"
          type="password"
          label={t('confirmPassword')}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
        <Button type="submit" className="w-full!" loading={isPending} disabled={code.length < 6}>
          {t('resetPassword.submit')}
        </Button>
      </form>
    </AuthLayout>
  )
}
