import { useTranslation } from 'react-i18next'
import type { CustomDomain } from '@/features/environments/types/environment.types'

interface Props {
  cd: CustomDomain
}

export default function DomainStatusBadge({ cd }: Props) {
  const { t } = useTranslation('environments')

  if (cd.status === 'verified') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-teal-light text-brand-teal dark:text-teal-300 border border-brand-teal/20">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-teal dark:bg-teal-400" />{t('domainStatus.verified')}
    </span>
  )
  if (cd.status === 'failed') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />{t('domainStatus.failed')}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />{t('domainStatus.pending')}
    </span>
  )
}
