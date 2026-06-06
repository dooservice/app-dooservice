import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use_toast'
import type {
  AuthUser, AuthResponse, RegisterResponse,
  LoginPayload, RegisterPayload,
  VerifyEmailPayload, ResendVerificationPayload,
  ForgotPasswordPayload, ResetPasswordPayload,
} from '../types/auth.types'

export const sessionQuery = queryOptions({
  queryKey:             ['auth', 'session'] as const,
  queryFn:              () => api.get('auth/restore').json<AuthResponse>().then(r => r.user),
  staleTime:            Infinity,
  retry:                false,
  refetchOnWindowFocus: false,
})

export function useSession() {
  return useQuery(sessionQuery)
}

export function useCurrentUser() {
  return useSession().data ?? null
}

export function useIsAuthenticated() {
  const { data, isPending } = useSession()
  return { isAuthenticated: !!data, isPending }
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()
  const location    = useLocation()
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post('auth/login', { json: payload }).json<AuthResponse>(),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(sessionQuery.queryKey, user)
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    },
    onError: (err: any, variables) => {
      if (err.response?.status === 403) {
        navigate('/verify-email', { state: { email: variables.email } })
        return
      }
      toast({ title: 'Sign in failed', description: err.message, variant: 'destructive' })
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post('auth/register', { json: payload }).json<RegisterResponse>(),
    onSuccess: (_data, variables) => {
      navigate('/verify-email', { state: { email: variables.email } })
    },
    onError: (err: any) => toast({ title: 'Registration failed', description: err.message, variant: 'destructive' }),
  })
}

export function useVerifyEmail() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      api.post('auth/verify-email', { json: payload }).json<AuthResponse>(),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(sessionQuery.queryKey, user)
      navigate('/', { replace: true })
    },
    onError: (err: any) => toast({ title: 'Verification failed', description: err.message, variant: 'destructive' }),
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      api.post('auth/resend-verification', { json: payload }).json<{ ok: boolean }>(),
    onError: (err: any) => {
      if (err.response?.status !== 429) return
      toast({ title: 'Too many requests', description: 'Wait a moment before requesting a new code.', variant: 'destructive' })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      api.post('auth/forgot-password', { json: payload }).json<{ ok: boolean }>(),
  })
}

export function useResetPassword() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      api.post('auth/reset-password', { json: payload }).json<{ ok: boolean }>(),
    onSuccess: () => {
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' })
      navigate('/sign-in', { replace: true })
    },
    onError: (err: any) => toast({ title: 'Reset failed', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { display_name: string; avatar_url?: string | null }) =>
      api.put('api/me', { json: payload }).json<AuthUser>(),
    onSuccess: (user) => {
      queryClient.setQueryData(sessionQuery.queryKey, user)
      toast({ title: 'Profile updated' })
    },
    onError: (err: any) => toast({ title: 'Update failed', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()
  return useMutation({
    mutationFn: () => api.delete('api/me').json<{ ok: boolean }>(),
    onSuccess: () => {
      queryClient.clear()
      navigate('/sign-in', { replace: true })
    },
    onError: (err: any) => toast({ title: 'Delete failed', description: err.message, variant: 'destructive' }),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()
  return useMutation({
    mutationFn: () => api.post('auth/logout').json<{ ok: boolean }>(),
    onSettled: () => {
      queryClient.clear()
      navigate('/sign-in', { replace: true })
    },
    onError: () => toast({ title: 'Logout failed', variant: 'destructive' }),
  })
}
