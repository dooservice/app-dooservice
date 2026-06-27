import SettingsLayout from './layout'
import ProfileCard from '@/features/auth/components/profile_card'
import GitHubCard from '@/features/github/components/github_card'
import DeleteAccountCard from '@/features/auth/components/delete_account_card'
import LanguageCard from '@/components/language_card'

export default function AccountSettingsPage() {
  return (
    <SettingsLayout>
      <ProfileCard />
      <LanguageCard />
      <GitHubCard />
      <DeleteAccountCard />
    </SettingsLayout>
  )
}
