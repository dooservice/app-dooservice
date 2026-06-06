export interface Agent {
  id:            string
  agent_id:      string
  name:          string
  region:        string
  online:        boolean
  last_seen:     string | null
  registered_at: string
}
