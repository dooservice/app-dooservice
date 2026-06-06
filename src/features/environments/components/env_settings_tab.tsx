import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertTriangleIcon } from 'lucide-react'
import { useDeleteEnvironment } from '@/features/environments/api/use_environments'
import { useCurrentProject } from '@/features/projects/api/use_projects'
import type { Environment } from '@/features/environments/types/environment.types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'
import CustomDomainCard from './custom_domain_card'
import WorkersCard from './workers_card'

interface Props {
  env: Environment | null
}

export default function EnvSettingsTab({ env }: Props) {
  const { t }                            = useTranslation('environments')
  const { projectId }                    = useParams<{ projectId: string }>()
  const { mutate: deleteEnv, isPending } = useDeleteEnvironment(projectId ?? '')
  const project                          = useCurrentProject()
  const [confirm, setConfirm]            = React.useState(false)

  if (!env) return null

  return (
    <div className="space-y-4">
      {env.mode === 'production' && (
        <>
          <CustomDomainCard env={env} projectId={projectId ?? ''} />
          <WorkersCard      env={env} projectId={projectId ?? ''} />
        </>
      )}

      {env.mode === 'development' && !project?.locked && (
        <>
          <Card className="border-red-600/20">
            <CardHeader className="border-red-600/20">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangleIcon className="h-5 w-5" />
                {t('settings.dangerZone')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('settings.deleteDesc')}</p>
            </CardContent>
            <CardFooter className="bg-red-50/50 dark:bg-red-950/30">
              <Button variant="destructive" onClick={() => setConfirm(true)}>{t('settings.deleteEnv')}</Button>
            </CardFooter>
          </Card>

          <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('settings.deleteDialog.title')}</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription
                  dangerouslySetInnerHTML={{ __html: t('settings.deleteDialog.description', { name: env.name }) }}
                />
              </DialogBody>
              <DialogFooter>
                <Button variant="destructive" loading={isPending}
                  onClick={() => deleteEnv(env.id, { onSuccess: () => setConfirm(false) })}
                >{t('settings.deleteEnv')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
