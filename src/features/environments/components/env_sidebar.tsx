import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RUNTIME, ENV_GROUPS } from '@/lib/constants'
import { useCurrentPlan } from '@/features/plans/api/use_plans'
import type { Environment, EnvMode } from '@/features/environments/types/environment.types'

interface Props {
  environments:  Environment[]
  selectedEnvId: string | null
  onSelect:      (id: string) => void
  onAdd:         (mode: EnvMode) => void
}

function EnvList({ envs, selectedEnvId, onSelect }: { envs: Environment[]; selectedEnvId: string | null; onSelect: (id: string) => void }) {
  return (
    <ul className="space-y-0.5 mb-1">
      {envs.map(env => {
        const rt = RUNTIME[env.runtime_state] ?? RUNTIME.stopped
        return (
          <li key={env.id}>
            <button
              onClick={() => onSelect(env.id)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm transition-colors',
                selectedEnvId === env.id
                  ? 'bg-brand-teal-light text-brand-teal font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', rt.dot)} />
              <span className="truncate font-medium flex-1">{env.name}</span>
              <span className="text-xs text-zinc-400 shrink-0 font-mono">{env.odoo_version}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function EnvSidebar({ environments, selectedEnvId, onSelect, onAdd }: Props) {
  const { t }                 = useTranslation('environments')
  const { data: currentPlan } = useCurrentPlan()
  const production  = environments.filter(e => e.mode === 'production')
  const development = environments.filter(e => e.mode === 'development')
  const devLimitReached = currentPlan ? development.length >= currentPlan.plan.max_development_environments : false

  return (
    <aside className="w-48 shrink-0">
      <div className="pt-2.5 space-y-3">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1.5">{t('sidebar.production')}</p>
          {production.length > 0 && (
            <EnvList envs={production} selectedEnvId={selectedEnvId} onSelect={onSelect} />
          )}
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1.5">{t('sidebar.development')}</p>
          {development.length > 0 && (
            <EnvList envs={development} selectedEnvId={selectedEnvId} onSelect={onSelect} />
          )}
          {ENV_GROUPS.map(({ mode }) => (
            <button key={mode}
              disabled={devLimitReached}
              title={devLimitReached ? t('plans.devEnvLimitReached', { ns: 'environments' }) : undefined}
              onClick={() => onAdd(mode)}
              className={cn(
                'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left text-xs font-medium transition-colors border border-dashed',
                devLimitReached
                  ? 'border-transparent text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                  : development.length === 0
                    ? 'border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-brand-teal/40 hover:text-brand-teal hover:bg-brand-teal-light'
                    : 'border-transparent text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800',
              )}
            >
              <PlusIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{development.length === 0 ? t('sidebar.newEnv') : t('sidebar.add')}</span>
            </button>
          ))}
        </div>

      </div>
    </aside>
  )
}
