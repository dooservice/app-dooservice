import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/modules/companies/components/dashboard_layout'
import CreateProjectForm from '@/modules/projects/components/create_project_form'

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
