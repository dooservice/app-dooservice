import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'lucide-react'
import { useCloneEnvironment } from '@/modules/environments/api/use_environments'
import { useProvisionProgress } from '@/modules/environments/api/use_provision_progress'
import { useCurrentProject } from '@/modules/projects/api/use_projects'
import { useRepoBranches } from '@/modules/github/api/use_github'
import { toast } from '@/hooks/use_toast'
import type { Environment } from '@/modules/environments/types/environment.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'
import ProvisionProgressModal from './provision_progress_modal'

interface Props {
  open:      boolean
  env:       Environment
  projectId: string
  onClose:   () => void
}

export default function CloneDialog({ open, env, projectId, onClose }: Props) {
  const { t }                            = useTranslation('environments')
  const { mutate: clone, isPending }     = useCloneEnvironment(projectId)
  const provision                        = useProvisionProgress()
  const project                          = useCurrentProject()
  const [newBranch, setNewBranch]        = React.useState(false)
  const [branchName, setBranchName]      = React.useState('development')
  const [neutralize, setNeutralize]      = React.useState(true)

  const { data: existingBranches = [] } = useRepoBranches(
    project?.has_repository ? project.repo_full_name : null
  )
  const branchAlreadyExists = newBranch && branchName.trim() !== '' && existingBranches.includes(branchName.trim())

  React.useEffect(() => { if (!open) { setNewBranch(false); setBranchName('development'); setNeutralize(true) } }, [open])

  React.useEffect(() => {
    if (provision.status !== 'done') return
    const timer = setTimeout(provision.dismiss, 1500)
    return () => clearTimeout(timer)
  }, [provision.status, provision.dismiss])

  const handleClone = () => {
    clone({ envId: env.id, newBranch, branch: newBranch ? branchName : undefined, neutralize }, {
      onSuccess: ({ job_id }) => { onClose(); provision.start('development', job_id) },
      onError:   err => toast({ title: t('clone.failed'), description: err.message, variant: 'destructive' }),
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('clone.title')}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <DialogDescription
              dangerouslySetInnerHTML={{ __html: t('clone.description', { name: env.name }) }}
            />
            {project?.has_repository && (
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newBranch}
                    onChange={e => setNewBranch(e.target.checked)}
                    className="accent-brand-teal"
                  />
                  {t('clone.newBranch')}
                </label>
                {newBranch ? (
                  <div className="pl-5 space-y-1.5">
                    <input
                      type="text"
                      value={branchName}
                      onChange={e => setBranchName(e.target.value)}
                      placeholder="development"
                      className={`w-full h-8 rounded-md border px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 bg-white ${branchAlreadyExists ? 'border-red-400 focus:ring-red-400' : 'border-zinc-200 focus:ring-brand-teal'}`}
                    />
                    {branchAlreadyExists ? (
                      <p className="text-xs text-red-600">{t('clone.branchExists')}</p>
                    ) : (
                      <p className="text-xs text-zinc-500">{t('clone.branchFork')}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 pl-5">{t('clone.sameBranch')}</p>
                )}
              </div>
            )}
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={neutralize}
                  onChange={e => setNeutralize(e.target.checked)}
                  className="accent-brand-teal"
                />
                {t('clone.neutralize')}
              </label>
              <p className="text-xs text-zinc-500 mt-1.5 pl-5">{t('clone.neutralizeDesc')}</p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button loading={isPending} disabled={branchAlreadyExists} icon={<CopyIcon className="h-3.5 w-3.5" />} onClick={handleClone}>
              {t('clone.cloneBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProvisionProgressModal
        open={provision.status !== 'idle'}
        status={provision.status}
        mode="clone"
        stage={provision.stage}
        stages={provision.stages}
        pct={provision.pct}
        error={provision.error}
        onClose={provision.dismiss}
      />
    </>
  )
}
