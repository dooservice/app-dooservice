export interface Plan {
  id:                            string
  name:                          string
  max_workers_production:        number
  max_workers_development:       number
  max_development_environments:  number
  max_storage_gb:                number
  allow_custom_domain:           boolean
  allow_auto_backups:            boolean
  is_default:                    boolean
}

export interface ProjectPlanAddons {
  plan_id:                         string
  extra_workers_production:        number
  extra_storage_gb:                number
  extra_development_environments:  number
}

export interface ProjectPlanResponse {
  plan:    Plan
  project: ProjectPlanAddons
}
