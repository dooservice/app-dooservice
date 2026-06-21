import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LockIcon } from 'lucide-react'
import { useSetCustomDomain, useRemoveCustomDomain, useVerifyCustomDomain } from '@/features/environments/api/use_custom_domain'
import { useCurrentPlan } from '@/features/plans/api/use_plans'
import { toast } from '@/hooks/use_toast'
import type { Environment } from '@/features/environments/types/environment.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import DomainStatusBadge from '@/components/domain_status_badge'

const schema = z.object({
  domain: z.string().min(1).regex(/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/, i18next.t('environments:domain.validDomainError')),
})
type FormValues = z.infer<typeof schema>

interface Props {
  env:       Environment
  projectId: string
}

export default function CustomDomainCard({ env, projectId }: Props) {
  const { t }                 = useTranslation('environments')
  const cd                    = env.config?.custom_domain
  const { data: currentPlan } = useCurrentPlan()

  const { mutate: setDomain,    isPending: setting   } = useSetCustomDomain(projectId)
  const { mutate: removeDomain, isPending: removing  } = useRemoveCustomDomain(projectId)
  const { mutate: verifyDomain, isPending: verifying } = useVerifyCustomDomain(projectId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { domain: '' },
  })

  const STEPS = [t('domain.step1'), t('domain.step2'), t('domain.step3'), t('domain.step4')]

  const onSubmit = handleSubmit(values => {
    setDomain({ envId: env.id, domain: values.domain }, {
      onSuccess: () => reset(),
      onError:   err => toast({ title: t('domain.addFailed'), description: err.message, variant: 'destructive' }),
    })
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t('domain.title')}</CardTitle>
          {cd && <DomainStatusBadge cd={cd} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!cd && currentPlan && !currentPlan.plan.allow_custom_domain ? (
          <div className="flex items-center gap-3 rounded-md border border-dashed border-zinc-300 dark:border-zinc-600 px-4 py-6 text-center">
            <LockIcon className="h-4 w-4 shrink-0 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('plans.domainLocked')}</p>
          </div>
        ) : !cd ? (
          <div className="space-y-4">
            <div className="rounded-md border border-brand-orange/10 bg-brand-orange-light p-4 space-y-3">
              <p className="text-xs font-semibold text-brand-orange-dark dark:text-orange-300 uppercase tracking-wide">{t('domain.howTo')}</p>
              <ol className="space-y-2">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-brand-orange-dark dark:text-orange-300">
                    <span className="flex-none flex items-center justify-center h-4 w-4 rounded-full bg-brand-orange-light text-brand-orange-dark dark:text-orange-300 font-bold text-[10px]">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="odoo.mycompany.com"
                  {...register('domain')}
                  className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
                {errors.domain && <p className="text-xs text-red-600 mt-1">{errors.domain.message}</p>}
              </div>
              <Button type="submit" loading={setting}>{t('domain.addDomain')}</Button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{cd.domain}</p>
            {cd.status !== 'verified' && (
              <div className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4 space-y-3">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('domain.dnsRecord')}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: t('domain.type'),   value: 'CNAME'               },
                    { label: t('domain.name'),   value: cd.domain             },
                    { label: t('domain.target'), value: cd.expected_target    },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                      <div className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5">
                        <span className="text-xs text-zinc-800 dark:text-zinc-200 break-all">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cd.status === 'verified' && (
              <div className="rounded-md border border-brand-teal/20 bg-brand-teal-light px-3 py-2">
                <p className="text-xs text-brand-teal dark:text-teal-300">{t('domain.domainActive')}</p>
              </div>
            )}
            {cd.status === 'failed' && cd.verification_error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">{cd.verification_error}</p>
            )}
            <div className="flex items-center gap-2 pt-1">
              {cd.status !== 'verified' && (
                <Button variant="outline" loading={verifying} onClick={() => verifyDomain(env.id, {
                  onError: err => toast({ title: t('domain.verifyFailed'), description: err.message, variant: 'destructive' }),
                })}>{t('domain.verify')}</Button>
              )}
              <Button variant="destructive" loading={removing} onClick={() => removeDomain(env.id, {
                onError: err => toast({ title: t('domain.removeFailed'), description: err.message, variant: 'destructive' }),
              })}>{t('domain.remove')}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
