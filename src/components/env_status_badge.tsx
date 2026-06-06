import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { RUNTIME } from '@/lib/constants'
import type { Environment } from '@/features/environments/types/environment.types'

interface Props {
  env: Environment
}

export default function EnvStatusBadge({ env }: Props) {
  const { t } = useTranslation('environments')
  const rt     = RUNTIME[env.runtime_state] ?? RUNTIME.stopped
  const isBusy = ['starting', 'stopping', 'provisioning'].includes(env.runtime_state)

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium',
      rt.text,
      env.runtime_state === 'running' && 'border-brand-teal/20 bg-brand-teal-light',
      env.runtime_state === 'stopped' && 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800',
      env.runtime_state === 'failed'  && 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
      isBusy && 'border-brand-orange/20 bg-brand-orange-light',
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', rt.dot)} />
      {t(`runtime.${env.runtime_state}` as `runtime.running`)}
    </span>
  )
}
