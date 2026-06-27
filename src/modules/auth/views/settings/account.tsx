import SettingsLayout from './layout'
import ProfileCard from '@/modules/auth/components/profile_card'
import GitHubCard from '@/modules/github/components/github_card'
import DeleteAccountCard from '@/modules/auth/components/delete_account_card'
import LanguageCard from '@/components/language_card'
import { Slot } from '@/core'

export default function AccountSettingsPage() {
  return (
    <SettingsLayout>
      <Slot name="settings.account:cards:before" />
      <ProfileCard />
      <LanguageCard />
      <GitHubCard />
      <DeleteAccountCard />
      <Slot name="settings.account:cards:after" />
    </SettingsLayout>
  )
}
