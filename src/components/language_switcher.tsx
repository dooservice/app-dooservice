import { useTranslation } from 'react-i18next'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/dropdown_menu'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs font-normal text-zinc-400 pb-0">Language</DropdownMenuLabel>
      {LANGUAGES.map(lang => (
        <DropdownMenuItem
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={i18n.resolvedLanguage === lang.code ? 'bg-zinc-100 font-medium' : ''}
        >
          <span className="mr-2 text-base leading-none">{lang.flag}</span>
          {lang.label}
        </DropdownMenuItem>
      ))}
    </>
  )
}
