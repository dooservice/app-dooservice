export interface Plan {
  id:                            string
  name:                          string
  max_projects:                  number | null
  max_workers_production:        number
  max_workers_development:       number
  max_development_environments:  number
  max_storage_gb:                number
  allow_custom_domain:           boolean
  allow_auto_backups:            boolean
  is_default:                    boolean
}

export interface PlanUsage {
  projects: number
}

export interface CurrentPlanResponse {
  plan:  Plan
  usage: PlanUsage
}
