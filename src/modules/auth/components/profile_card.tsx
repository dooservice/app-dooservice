import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { z } from 'zod'
import { useCurrentUser, useUpdateProfile } from '@/modules/auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import InputField from '@/components/input_field'
import Button from '@/components/button'

const schema = z.object({
  display_name: z.string().min(1, i18next.t('auth:validation.nameRequired')),
})
type FormValues = z.infer<typeof schema>

export default function ProfileCard() {
  const { t }    = useTranslation('settings')
  const user     = useCurrentUser()
  const { mutate: update, isPending } = useUpdateProfile()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { display_name: user?.display_name ?? '' },
  })

  React.useEffect(() => {
    if (user) reset({ display_name: user.display_name })
  }, [user, reset])

  const displayName = watch('display_name')

  const onSubmit = handleSubmit(values => update({ display_name: values.display_name.trim() }))

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader><CardTitle>{t('profile.title')}</CardTitle></CardHeader>
        <CardContent className="px-0 space-y-4 divide-y divide-zinc-100">
          <div className="space-y-4 px-6">
            <InputField
              id="email"
              label={t('profile.email')}
              type="email"
              value={user?.email ?? ''}
              readOnly
              onChange={() => {}}
              helper={t('profile.emailHelper')}
            />
            <InputField
              id="display_name"
              label={t('profile.displayName')}
              {...register('display_name')}
              error={errors.display_name?.message}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={isPending} disabled={!displayName.trim() || displayName === user?.display_name}>
            {t('profile.saveChanges')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
