import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { AuthLayout, useLogin, signInSchema, type SignInValues } from '@/features/auth'
import InputField from '@/components/input_field'
import Button from '@/components/button'
import { env } from '@/config/env'

export default function SignInPage() {
  const { t }                          = useTranslation('auth')
  const { mutate: login, isPending }   = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  })

  return (
    <AuthLayout
      title={t('welcomeBack')}
      action={
        <>
          {t('notSignedUpYet')}{' '}
          <Link className="leading-6 text-brand-teal hover:text-brand-teal-dark transition-all font-medium" to="/sign-up">
            {t('signUp')}
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <a href={`${env.API_BASE}/auth/github`} className="btn-secondary flex items-center justify-center gap-2">
          <IconBrandGithub className="h-4 w-4" />
          GitHub
        </a>
        <a href={`${env.API_BASE}/auth/google`} className="btn-secondary flex items-center justify-center gap-2">
          <IconBrandGoogle className="h-4 w-4" />
          Google
        </a>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-neutral-400">{t('orContinueWith')}</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(d => login(d))} noValidate>
        <InputField id="email" type="email" label={t('email')} placeholder="admin@empresa.com"
          autoComplete="email" error={errors.email?.message} {...register('email')} />
        <div className="space-y-1">
          <InputField id="password" type="password" label={t('password')} placeholder="••••••••••"
            autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          <div className="text-right">
            <Link className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors" to="/forgot-password">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full!" loading={isPending}>{t('signIn')}</Button>
      </form>
    </AuthLayout>
  )
}
