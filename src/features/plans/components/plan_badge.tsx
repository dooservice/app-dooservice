import { Badge } from '@/components/badge'
import { useProjectPlan } from '../api/use_plans'

interface Props {
  projectId: string
}

export default function PlanBadge({ projectId }: Props) {
  const { data } = useProjectPlan(projectId)
  if (!data) return null

  return (
    <Badge variant={data.plan.is_default ? 'muted' : 'success'}>
      {data.plan.name}
    </Badge>
  )
}
