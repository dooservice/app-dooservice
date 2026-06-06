import { useTranslation } from 'react-i18next'
import { useEnvDateTime } from '@/lib/date'
import { useRestoreBackup } from '@/features/environments/api/use_backups'
import { toast } from '@/hooks/use_toast'
import type { Backup, Environment } from '@/features/environments/types/environment.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'

interface Props {
  backup:    Backup | null
  env:       Environment
  projectId: string
  onClose:   () => void
}

export default function RestoreBackupDialog({ backup, env, projectId, onClose }: Props) {
  const { t }        = useTranslation('backups')
  const formatDate = useEnvDateTime(env.config.timezone)
  const { mutate: restoreBackup, isPending } = useRestoreBackup(projectId)

  const handleRestore = () => {
    if (!backup) return
    restoreBackup(
      { backupId: backup.id, envId: env.id },
      {
        onSuccess: () => { onClose(); toast({ title: t('restoreDialog.started') }) },
        onError:   err => toast({ title: t('restoreDialog.failed'), description: err.message, variant: 'destructive' }),
      },
    )
  }

  return (
    <Dialog open={backup !== null} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('restoreDialog.title')}</DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: t('restoreDialog.description', {
                name: env.name,
                date: backup ? formatDate(backup.created_at) : '',
              }),
            }}
          />
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" loading={isPending} onClick={handleRestore}>{t('restore')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
