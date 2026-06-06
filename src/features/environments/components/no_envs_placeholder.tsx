import { useTranslation } from 'react-i18next'

export default function NoEnvsPlaceholder() {
  const { t } = useTranslation('environments')

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-dashed border-zinc-200 rounded-sm">
      <p className="text-sm text-zinc-500 font-medium">{t('noEnvs.title')}</p>
      <p className="text-xs text-zinc-400 max-w-xs">{t('noEnvs.description')}</p>
    </div>
  )
}
