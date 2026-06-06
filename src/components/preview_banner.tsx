import { useTranslation } from 'react-i18next'
import { InfoIcon } from 'lucide-react'

export default function PreviewBanner() {
  const { t } = useTranslation()

  return (
    <div className="inline-flex relative w-full justify-center items-center bg-brand-teal-light p-2 text-sm text-brand-teal border-b border-brand-teal/30">
      <InfoIcon className="h-4 w-4 mr-1.5 shrink-0" />
      <span dangerouslySetInnerHTML={{ __html: t('betaPreview') }} />
    </div>
  )
}
