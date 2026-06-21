import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadIcon, HardDriveIcon, RotateCcwIcon, UploadIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEnvDateTime } from '@/lib/date'
import { useBackupDownloadUrl, useBackups } from '@/features/environments/api/use_backups'
import { useCurrentProject } from '@/features/projects/api/use_projects'
import { useProjectPlan } from '@/features/plans/api/use_plans'
import type { Backup, BackupStatus, Environment } from '@/features/environments/types/environment.types'
import Button from '@/components/button'
import Spinner from '@/components/spinner'
import CreateBackupDialog from './create_backup_dialog'
import RestoreBackupDialog from './restore_backup_dialog'
import UploadBackupDialog from './upload_backup_dialog'

const STATUS_STYLES: Record<BackupStatus, { badge: string; dot: string }> = {
  completed:   { badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500 dark:bg-emerald-400' },
  in_progress: { badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',               dot: 'bg-blue-500 dark:bg-blue-400' },
  failed:      { badge: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',                       dot: 'bg-red-500 dark:bg-red-400' },
  dropped:     { badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600',                   dot: 'bg-zinc-400 dark:bg-zinc-500' },
}

function BackupStatusBadge({ status }: { status: BackupStatus }) {
  const { t } = useTranslation('backups')
  const labels: Record<BackupStatus, string> = {
    completed:   t('statuses.completed'),
    in_progress: t('statuses.in_progress'),
    failed:      t('statuses.failed'),
    dropped:     t('statuses.dropped'),
  }
  const { badge, dot } = STATUS_STYLES[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-medium', badge)}>
      <span className={cn('h-1.5 w-1.5 rounded-full flex-none', dot)} />
      {labels[status]}
    </span>
  )
}

interface Props {
  env:       Environment | null
  projectId: string
}

export default function EnvBackupsTab({ env, projectId }: Props) {
  const { t }        = useTranslation('backups')
  const formatDate = useEnvDateTime(env?.config.timezone ?? 'UTC')

  const { data: backups = [], isPending }                        = useBackups(projectId, env?.id ?? '')
  const project                                                 = useCurrentProject()
  const { data: currentPlan }                                   = useProjectPlan(projectId)
  const [createOpen, setCreateOpen]                             = React.useState(false)
  const [uploadOpen, setUploadOpen]                             = React.useState(false)
  const [restoring, setRestoring]                               = React.useState<Backup | null>(null)
  const { mutate: getDownloadUrl, isPending: isDownloading }    = useBackupDownloadUrl(projectId)

  if (!env) return (
    <div className="flex items-center justify-center py-16 text-sm text-zinc-400">{t('selectFirst', { ns: 'environments' })}</div>
  )

  return (
    <div className="space-y-4">
      {currentPlan && !currentPlan.plan.allow_auto_backups && (
        <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-400">
          {t('plans.backupsDisabled', { ns: 'environments' })}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{t('count', { count: backups.length })}</p>
        <div className="flex items-center gap-2">
          {!project?.locked && (
            <Button variant="outline" icon={<UploadIcon className="h-3.5 w-3.5" />} onClick={() => setUploadOpen(true)}>
              {t('upload')}
            </Button>
          )}
          <Button icon={<HardDriveIcon className="h-3.5 w-3.5" />} onClick={() => setCreateOpen(true)}>
            {t('create')}
          </Button>
        </div>
      </div>

      {isPending ? (
        <div className="flex justify-center py-10"><Spinner className="h-5 w-5 text-zinc-400 animate-spin" /></div>
      ) : backups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-md">
          <HardDriveIcon className="h-8 w-8 text-zinc-300 dark:text-zinc-600" strokeWidth={1.5} />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('noBackupsYet')}</p>
        </div>
      ) : (
        <div className="rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
              <tr className="text-left text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <th className="px-4 py-2.5">{t('date')}</th>
                <th className="px-4 py-2.5">{t('type')}</th>
                <th className="px-4 py-2.5">{t('status')}</th>
                <th className="px-4 py-2.5">{t('size')}</th>
                <th className="px-4 py-2.5">{t('description')}</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
              {backups.map(backup => (
                <tr key={backup.id} className={backup.status === 'dropped' ? 'opacity-40' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}>
                  <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                    {formatDate(backup.created_at)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {t(`backupTypes.${backup.backup_type}` as 'backupTypes.full')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <BackupStatusBadge status={backup.status} />
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400 text-xs tabular-nums">
                    {backup.size_bytes > 0 ? `${(backup.size_bytes / 1024 / 1024).toFixed(1)} MB` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400 text-xs truncate max-w-[160px]">{backup.description || '—'}</td>
                  <td className="px-4 py-2.5 text-right">
                    {backup.status !== 'dropped' && backup.source !== 'pre_deploy' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          icon={<DownloadIcon className="h-3.5 w-3.5" />}
                          disabled={backup.storage_type !== 's3' || isDownloading}
                          title={backup.storage_type !== 's3' ? t('onlyS3') : t('download')}
                          onClick={() => getDownloadUrl(backup.id, {
                            onSuccess: ({ download_url }) => window.open(download_url, '_blank'),
                          })}
                        >
                          {t('download')}
                        </Button>
                        {!project?.locked && (
                          <Button variant="outline" icon={<RotateCcwIcon className="h-3.5 w-3.5" />} onClick={() => setRestoring(backup)}>
                            {t('restore')}
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateBackupDialog
        open={createOpen}
        env={env}
        projectId={projectId}
        onClose={() => setCreateOpen(false)}
      />
      <UploadBackupDialog
        open={uploadOpen}
        env={env}
        projectId={projectId}
        onClose={() => setUploadOpen(false)}
      />
      <RestoreBackupDialog
        backup={restoring}
        env={env}
        projectId={projectId}
        onClose={() => setRestoring(null)}
      />
    </div>
  )
}
