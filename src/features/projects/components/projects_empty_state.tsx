import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FolderIcon, PlusCircleIcon } from 'lucide-react'
import { Card } from '@/components/card'

interface Props {
  createPath: string
}

export default function ProjectsEmptyState({ createPath }: Props) {
  const { t } = useTranslation('projects')

  return (
    <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-dashed">
      <FolderIcon className="h-12 w-12 text-zinc-300" strokeWidth={1.5} />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-zinc-700">{t('empty.title')}</h3>
        <p className="text-sm text-zinc-500 max-w-sm">{t('empty.description')}</p>
      </div>
      <Link className="btn-primary" to={createPath}>
        <PlusCircleIcon className="h-4 w-4" />
        <span>{t('newProject')}</span>
      </Link>
    </Card>
  )
}
