import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/features/companies/components/dashboard_layout'
import CreateProjectForm from '@/features/projects/components/create_project_form'

export default function ProjectCreatePage() {
  const { t } = useTranslation('projects')

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: t('projects'), href: '/projects' },
        { label: t('create') },
      ]}
    >
      <CreateProjectForm />
    </DashboardLayout>
  )
}
