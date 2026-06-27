import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { AuthLayout, useForgotPassword } from '@/modules/auth'
import InputField from '@/components/input_field'
import Button from '@/components/button'

const schema = z.object({ email: z.string().email() })
type Values  = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { t }                 = useTranslation('auth')
  const navigate              = useNavigate()
  const { mutate, isPending } = useForgotPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: Values) => {
    mutate({ email: data.email }, {
      onSuccess: () => {
        navigate('/reset-password', { state: { email: data.email } })
      },
    })
  }

  return (
    <AuthLayout
      title={t('forgotPasswordPage.title')}
      action={
        <Link className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors" to="/sign-in">
          {t('forgotPasswordPage.backToSignIn')}
        </Link>
      }
    >
      <p className="text-sm text-neutral-500 mb-5">{t('forgotPasswordPage.description')}</p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="email"
          type="email"
          label={t('email')}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" className="w-full!" loading={isPending}>
          {t('forgotPasswordPage.submit')}
        </Button>
      </form>
    </AuthLayout>
  )
}
