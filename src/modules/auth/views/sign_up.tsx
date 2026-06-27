import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { AuthLayout, useRegister, signUpSchema, type SignUpValues } from '@/modules/auth'
import InputField from '@/components/input_field'
import Button from '@/components/button'
import { env } from '@/config/env'

export default function SignUpPage() {
  const { t }                                = useTranslation('auth')
  const { mutate: register_, isPending }     = useRegister()

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = (d: SignUpValues) =>
    register_({ email: d.email, password: d.password, display_name: d.full_name })

  return (
    <AuthLayout
      wide
      title={t('createAccount')}
      action={
        <>
          {t('alreadyHaveAccount')}{' '}
          <Link className="leading-6 text-brand-teal hover:text-brand-teal-dark transition-all font-medium" to="/sign-in">
            {t('signIn')}
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

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-4">
          <InputField id="full_name" type="text" label={t('fullName')} placeholder="Jane Doe"
            autoComplete="name" error={errors.full_name?.message} {...register('full_name')} />
          <InputField id="email" type="email" label={t('email')} placeholder="you@example.com"
            autoComplete="email" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField id="password" type="password" label={t('password')} placeholder="••••••••"
            autoComplete="new-password" helper={t('passwordHelper')}
            error={errors.password?.message} {...register('password')} />
          <InputField id="confirm_password" type="password" label={t('confirmPassword')} placeholder="••••••••"
            autoComplete="new-password" error={errors.confirm_password?.message} {...register('confirm_password')} />
        </div>
        <Button type="submit" className="w-full!" loading={isPending}>{t('createAccount')}</Button>
      </form>
    </AuthLayout>
  )
}
