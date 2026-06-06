import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { GitCommitIcon, RotateCcwIcon } from 'lucide-react'

import Button from '@/components/button'
import Spinner from '@/components/spinner'
import { useEnvDateTime } from '@/lib/date'

import { useDeployments } from '../api/use_deployments'
import type { Deployment, Environment } from '../types/environment.types'
import RollbackDialog from './rollback_dialog'

interface Props {
  env:       Environment
  projectId: string
}

const STATUS_CLASSES: Record<string, string> = {
  success:     'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  failed:      'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  rolled_back: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  dropped:     'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700',
}

export default function EnvDeploymentsTab({ env, projectId }: Props) {
  const { t }        = useTranslation('deployments')
  const formatDate = useEnvDateTime(env?.config.timezone)

  const { data: deployments = [], isPending }  = useDeployments(projectId, env?.id ?? '')
  const [rolling, setRolling]                  = React.useState<Deployment | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{t('count', { count: deployments.length })}</p>
      </div>

      {isPending ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-5 w-5 text-zinc-400 animate-spin" />
        </div>
      ) : deployments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <GitCommitIcon className="h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-500">{t('noDeployments')}</p>
        </div>
      ) : (
        <div className="rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
              <tr className="text-left text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <th className="px-4 py-2.5">{t('revision')}</th>
                <th className="px-4 py-2.5">{t('date')}</th>
                <th className="px-4 py-2.5">{t('commit')}</th>
                <th className="px-4 py-2.5">{t('branch')}</th>
                <th className="px-4 py-2.5">{t('status')}</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
              {deployments.map(dep => (
                <tr key={dep.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    #{dep.revision}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                    {formatDate(dep.created_at)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {dep.commit_after?.slice(0, 7) ?? dep.commit_before?.slice(0, 7) ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400 text-xs">
                    {dep.branch ?? '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${STATUS_CLASSES[dep.status] ?? ''}`}>
                      {t(`statuses.${dep.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {dep.status === 'success' && dep.commit_before !== null && (
                      <Button
                        variant="outline"
                        icon={<RotateCcwIcon className="h-3.5 w-3.5" />}
                        onClick={() => setRolling(dep)}
                      >
                        {t('rollback')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RollbackDialog
        deployment={rolling}
        env={env}
        projectId={projectId}
        onClose={() => setRolling(null)}
      />
    </div>
  )
}
