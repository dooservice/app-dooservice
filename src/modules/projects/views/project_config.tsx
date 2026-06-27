import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentProject } from '@/modules/projects/api/use_projects'
import ProjectLayout from '@/modules/projects/components/project_layout'
import ProjectSettingsTab from '@/modules/projects/components/project_settings_tab'

export default function ProjectConfigPage() {
  const { t }         = useTranslation('projects')
  const { projectId } = useParams<{ projectId: string }>()
  const project        = useCurrentProject()

  if (project?.locked) return <Navigate to={`/projects/${projectId}`} replace />

  return (
    <ProjectLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">{t('config.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1">{t('config.description')}</p>
        </div>
        <ProjectSettingsTab projectId={projectId ?? ''} />
      </div>
    </ProjectLayout>
  )
}
