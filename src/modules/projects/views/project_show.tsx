import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentProject } from '@/modules/projects/api/use_projects'
import { useEnvironments, useProvisionEnvironment } from '@/modules/environments/api/use_environments'
import { useProvisionProgress } from '@/modules/environments/api/use_provision_progress'
import { toast } from '@/hooks/use_toast'
import type { EnvMode, ProvisionEnvPayload } from '@/modules/environments/types/environment.types'
import ProjectLayout from '@/modules/projects/components/project_layout'
import EnvSidebar from '@/modules/environments/components/env_sidebar'
import EnvTabNav, { type TabId } from '@/modules/environments/components/env_tab_nav'
import EnvOverviewTab from '@/modules/environments/components/env_overview_tab'
import EnvLogsTab from '@/modules/environments/components/env_logs_tab'
import EnvBackupsTab from '@/modules/environments/components/env_backups_tab'
import EnvDeploymentsTab from '@/modules/environments/components/env_deployments_tab'
import EnvSettingsTab from '@/modules/environments/components/env_settings_tab'
import SubmoduleKeysCard from '@/modules/projects/components/submodule_keys_card'
import NoEnvsPlaceholder from '@/modules/environments/components/no_envs_placeholder'
import ProvisionDialog from '@/modules/environments/components/provision_dialog'
import ProvisionProgressModal from '@/modules/environments/components/provision_progress_modal'
import Spinner from '@/components/spinner'
import { Slot } from '@/core'

export default function ProjectShowPage() {
  const { t }         = useTranslation('projects')
  const { projectId } = useParams<{ projectId: string }>()
  const project       = useCurrentProject()
  const { data: environments = [], isPending } = useEnvironments(projectId ?? '', project?.name ?? '')

  const [selectedEnvId, setSelectedEnvId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab]          = React.useState<TabId>('overview')
  const [provisionMode, setProvisionMode]  = React.useState<EnvMode | null>(null)

  const selectedEnv = React.useMemo(
    () => environments.find(e => e.id === selectedEnvId) ?? environments[0] ?? null,
    [environments, selectedEnvId],
  )

  const provision = useProvisionProgress()
  const { mutate: provisionEnv } = useProvisionEnvironment()

  React.useEffect(() => {
    if (project?.locked && activeTab === 'settings') setActiveTab('overview')
  }, [project?.locked, activeTab])

  React.useEffect(() => {
    if (provision.status !== 'done') return
    const timer = setTimeout(provision.dismiss, 1500)
    return () => clearTimeout(timer)
  }, [provision.status, provision.dismiss])

  const handleProvisionSubmit = (payload: ProvisionEnvPayload) => {
    setProvisionMode(null)
    provisionEnv(payload, {
      onSuccess: ({ job_id }) => provision.start(payload.mode ?? 'development', job_id),
      onError:   err => toast({ title: t('provisionFailed'), description: err.message, variant: 'destructive' }),
    })
  }

  return (
    <ProjectLayout>
      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-zinc-400 animate-spin" />
        </div>
      ) : (
        <div className="flex gap-6 items-start">
          <EnvSidebar
            projectId={projectId ?? ''}
            environments={environments}
            selectedEnvId={selectedEnv?.id ?? null}
            onSelect={id => { setSelectedEnvId(id); setActiveTab('overview') }}
            onAdd={setProvisionMode}
          />

          <div className="w-px bg-zinc-200 dark:bg-zinc-700 self-stretch" />

          <div className="flex-1 min-w-0">
            <EnvTabNav activeTab={activeTab} onChange={setActiveTab} hideSettings={!!project?.locked} hasRepository={!!project?.has_repository} />
            <div className="pt-5">
              {activeTab === 'overview' && (
                selectedEnv
                  ? <EnvOverviewTab env={selectedEnv} projectId={projectId ?? ''} />
                  : <NoEnvsPlaceholder />
              )}
              {activeTab === 'logs'        && <EnvLogsTab        env={selectedEnv} projectId={projectId ?? ''} />}
              {activeTab === 'backups'     && <EnvBackupsTab     env={selectedEnv} projectId={projectId ?? ''} />}
              {activeTab === 'deployments' && <EnvDeploymentsTab env={selectedEnv} projectId={projectId ?? ''} />}
              {activeTab === 'submodules' && !project?.locked && (
                <div className="max-w-2xl">
                  <SubmoduleKeysCard projectId={projectId ?? ''} />
                </div>
              )}
              {activeTab === 'settings' && !project?.locked && <EnvSettingsTab env={selectedEnv} />}
            </div>
          </div>
        </div>
      )}

      <ProvisionDialog
        open={provisionMode !== null}
        onClose={() => setProvisionMode(null)}
        onSubmit={handleProvisionSubmit}
      />

      <ProvisionProgressModal
        open={provision.status !== 'idle'}
        status={provision.status}
        stage={provision.stage}
        stages={provision.stages}
        pct={provision.pct}
        error={provision.error}
        onClose={provision.dismiss}
      />

      <Slot name="projects.show:dialogs" />
    </ProjectLayout>
  )
}
