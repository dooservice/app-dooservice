import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog'
import { toast } from '@/hooks/use_toast'

import { useRollbackDeployment } from '../api/use_deployments'
import type { Deployment, Environment } from '../types/environment.types'

interface Props {
  deployment: Deployment | null
  env:        Environment
  projectId:  string
  onClose:    () => void
}

export default function RollbackDialog({ deployment, env, projectId, onClose }: Props) {
  const { t }                               = useTranslation('deployments')
  const { mutate: rollback, isPending }     = useRollbackDeployment(projectId)

  const handleRollback = () => {
    if (!deployment) return
    rollback(
      { envId: env.id, revision: deployment.revision },
      {
        onSuccess: () => { onClose(); toast({ title: t('rollbackDialog.started') }) },
        onError:   err => toast({ title: t('rollbackDialog.failed'), description: err.message, variant: 'destructive' }),
      },
    )
  }

  return (
    <Dialog open={deployment !== null} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('rollbackDialog.title')}</DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: t('rollbackDialog.description', {
                name:     env.name,
                revision: deployment?.revision,
                commit:   deployment?.commit_before?.slice(0, 7) ?? '—',
              }),
            }}
          />
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" loading={isPending} onClick={handleRollback}>
            {t('rollbackDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
