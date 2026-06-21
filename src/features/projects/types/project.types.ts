export interface Project {
  id:             string
  name:           string
  odoo_version:   string
  timezone:       string
  language:       string
  has_repository: boolean
  repo_full_name: string
  region:         string   // injected client-side from which agent answered
  locked:         boolean
  plan_id:                         string
  extra_workers_production:        number
  extra_storage_gb:                number
  extra_development_environments:  number
  created_at:     string
  updated_at:     string
}

export interface CreateProjectPayload {
  name:           string
  region:         string
  has_repository: boolean
  odoo_version?:  string
  timezone?:      string
  language?:      string
  admin_email?:   string
  admin_password?: string
  repo_full_name?: string
  repo_id?:        number
  default_branch?: string
  plan_id:                         string
  extra_workers_production?:       number
  extra_storage_gb?:               number
  extra_development_environments?: number
}
