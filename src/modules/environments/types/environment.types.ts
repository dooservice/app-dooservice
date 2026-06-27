export type RuntimeState    = 'running' | 'stopped' | 'starting' | 'stopping' | 'provisioning' | 'failed'
export type LifecycleState  = 'active' | 'deleted'
export type EnvMode         = 'production' | 'development'
export type DeploymentStatus = 'success' | 'failed' | 'rolled_back' | 'dropped'

export interface Deployment {
  id:             string
  environment_id: string
  revision:       number
  triggered_by:   string
  commit_before:  string | null
  commit_after:   string | null
  branch:         string | null
  backup_id:      string | null
  status:         DeploymentStatus
  created_at:     string
}

export type BackupType   = 'full' | 'database'
export type BackupSource = 'manual' | 'scheduled' | 'pre_deploy'
export type StorageType  = 'local' | 's3'
export type BackupStatus = 'in_progress' | 'completed' | 'failed' | 'dropped'

export interface Backup {
  id:               string
  environment_id:   string
  environment_name: string
  project_name:     string
  backup_type:      BackupType
  storage_type:     StorageType
  filename:         string
  size_bytes:       number
  description:      string
  status:           BackupStatus
  source:           BackupSource
  created_at:       string
}

export type CustomDomainStatus = 'pending' | 'verified' | 'failed'

export interface CustomDomain {
  domain:             string
  status:             CustomDomainStatus
  expected_target:    string
  verification_error: string | null
  created_at:         string
  verified_at:        string | null
  last_checked_at:    string | null
}

export interface Environment {
  id:              string
  name:            string
  project_id:      string
  mode:            EnvMode
  odoo_version:    string
  has_repository:  boolean
  runtime_state:   RuntimeState
  lifecycle_state: LifecycleState
  branch:          string
  commit:          string
  created_at:      string
  updated_at:      string
  config: {
    primary_domain: string
    custom_domain:  CustomDomain | null
    base_workers:   number
    extra_workers:  number
    timezone:       string
  }
}

export interface ProvisionEnvPayload {
  project_id:      string
  project_name:    string
  mode?:           EnvMode
  branch?:         string
  new_branch?:     boolean
  source_branch?:  string
  odoo_version?:   string
  admin_email?:    string
  admin_password?: string
  timezone?:       string
  language?:       string
  neutralize?:     boolean
}
