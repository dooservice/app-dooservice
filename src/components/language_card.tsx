import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export default function LanguageCard() {
  const { t, i18n } = useTranslation('settings')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('language.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-500 mb-3">{t('language.description')}</p>
        <Select
          value={i18n.resolvedLanguage ?? 'en'}
          onValueChange={lang => i18n.changeLanguage(lang)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter />
    </Card>
  )
}
