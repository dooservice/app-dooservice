import ky, { isHTTPError } from 'ky'
import { env } from '@/config/env'

export const api = ky.create({
  prefix: env.API_BASE,
  credentials: 'include',
  hooks: {
    beforeError: [
      ({ error }) => {
        if (isHTTPError(error)) {
          const data = error.data as Record<string, unknown> | null
          const detail = data?.detail ?? data?.message ?? data?.error
          if (typeof detail === 'string') error.message = detail
        }
        return error
      },
    ],
  },
})
