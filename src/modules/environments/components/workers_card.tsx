import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CpuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUpdateWorkers } from '@/modules/environments/api/use_workers'
import { useProjectPlan } from '@/modules/plans/api/use_plans'
import UpgradeDialog from '@/modules/plans/components/upgrade_dialog'
import { toast } from '@/hooks/use_toast'
import type { Environment } from '@/modules/environments/types/environment.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'

interface Props {
  env:       Environment
  projectId: string
}

export default function WorkersCard({ env, projectId }: Props) {
  const { t }                                        = useTranslation('environments')
  const { mutate: updateWorkers, isPending: saving } = useUpdateWorkers(projectId)
  const { data: projectPlan }                        = useProjectPlan(projectId)
  const [workers, setWorkers]                        = React.useState(env.config?.base_workers ?? 1)
  const [upgradeReason, setUpgradeReason]            = React.useState<string | null>(null)

  React.useEffect(() => { setWorkers(env.config?.base_workers ?? 1) }, [env.config?.base_workers])

  const currentWorkers = env.config?.base_workers ?? 1
  const maxWorkers = projectPlan
    ? env.mode === 'production'
      ? projectPlan.plan.max_workers_production + projectPlan.project.extra_workers_production
      : projectPlan.plan.max_workers_development
    : Infinity

  const WORKER_OPTIONS = [
    { value: 1, label: t('workers.options.1_label'), description: t('workers.options.1_desc') },
    { value: 2, label: t('workers.options.2_label'), description: t('workers.options.2_desc') },
    { value: 4, label: t('workers.options.4_label'), description: t('workers.options.4_desc') },
    { value: 8, label: t('workers.options.8_label'), description: t('workers.options.8_desc') },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CpuIcon className="h-4 w-4" />{t('workers.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-zinc-500">{t('workers.description')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WORKER_OPTIONS.map(opt => {
            const belowMin = opt.value < currentWorkers
            const aboveMax = opt.value > maxWorkers
            const locked   = belowMin || aboveMax
            const lockedLabel = belowMin ? t('plans.workerCannotDecrease') : t('plans.workerLocked')
            return (
              <button key={opt.value} type="button" disabled={locked}
                title={locked ? lockedLabel : undefined}
                onClick={() => setWorkers(opt.value)}
                className={cn('flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors',
                  locked
                    ? 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                    : workers === opt.value
                      ? 'border-brand-teal bg-brand-teal-light text-brand-teal'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200'
                )}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs mt-0.5 opacity-70">{locked ? lockedLabel : opt.description}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
      <div className="px-6 pb-5">
        <Button
          loading={saving}
          disabled={workers === (env.config?.base_workers ?? 1)}
          onClick={() => updateWorkers(
            { envId: env.id, workers },
            {
              onSuccess: () => toast({ title: t('workers.saved') }),
              onError:   (err: any) => {
                if (err.response?.status === 402) { setUpgradeReason(err.message); return }
                toast({ title: t('workers.saveFailed'), description: err.message, variant: 'destructive' })
              },
            },
          )}
        >{t('workers.save')}</Button>
      </div>
      <UpgradeDialog open={!!upgradeReason} reason={upgradeReason ?? ''} onClose={() => setUpgradeReason(null)} />
    </Card>
  )
}
