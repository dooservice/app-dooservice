import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { IconLogout, IconMoon, IconSettings, IconSun } from '@tabler/icons-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import { useCurrentUser, useLogout } from '@/modules/auth'

export default function AccountDropdown() {
  const user               = useCurrentUser()
  const { mutate: logout } = useLogout()
  const navigate           = useNavigate()
  const { t }              = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('aria.accountMenu')}
          title={user?.display_name ?? ''}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          {user?.display_name?.charAt(0).toUpperCase() ?? '?'}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground truncate">{user?.display_name}</span>
          <span className="text-xs font-normal text-muted-foreground truncate">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/settings/account')}>
            <IconSettings className="mr-2 h-4 w-4" />
            {t('settings')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark
              ? <IconSun  className="mr-2 h-4 w-4" />
              : <IconMoon className="mr-2 h-4 w-4" />}
            {isDark ? t('lightMode') : t('darkMode')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => logout()}>
            <IconLogout className="mr-2 h-4 w-4" />
            {t('signOut')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
