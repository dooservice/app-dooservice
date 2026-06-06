export const env = {
  API_BASE:       import.meta.env.VITE_API_URL          ?? 'http://localhost:8000',
  NATS_WS_URL:    import.meta.env.VITE_NATS_WS_URL      ?? 'ws://localhost:9222',
  NATS_USER:      import.meta.env.VITE_NATS_USER        ?? 'frontend',
  NATS_PASSWORD:  import.meta.env.VITE_NATS_PASSWORD    ?? '',
} as const
