import { Badge } from '@/components/badge'
import { useCurrentPlan } from '../api/use_plans'

export default function PlanBadge() {
  const { data } = useCurrentPlan()
  if (!data) return null

  return (
    <Badge variant={data.plan.is_default ? 'muted' : 'success'}>
      {data.plan.name}
    </Badge>
  )
}
