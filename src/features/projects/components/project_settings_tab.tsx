import DeployKeyCard from './deploy_key_card'
import SubmoduleKeysCard from './submodule_keys_card'

interface Props {
  projectId: string
}

export default function ProjectSettingsTab({ projectId }: Props) {
  return (
    <div className="space-y-4">
      <DeployKeyCard     projectId={projectId} />
      <SubmoduleKeysCard projectId={projectId} />
    </div>
  )
}
