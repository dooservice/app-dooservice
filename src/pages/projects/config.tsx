import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProjectLayout from '@/features/projects/components/project_layout'
import ProjectSettingsTab from '@/features/projects/components/project_settings_tab'

export default function ProjectConfigPage() {
  const { t }         = useTranslation('projects')
  const { projectId } = useParams<{ projectId: string }>()

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
