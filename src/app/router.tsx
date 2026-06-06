import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute }    from '@/app/routes/protected_route'
import { GuestRoute }        from '@/app/routes/guest_route'
import DashboardPage         from '@/pages/dashboard'
import ProjectsIndexPage     from '@/pages/projects/index'
import ProjectCreatePage     from '@/pages/projects/create'
import ProjectShowPage       from '@/pages/projects/show'
import ProjectConfigPage     from '@/pages/projects/config'
import AccountSettingsPage   from '@/pages/settings/account'
import SignInPage            from '@/pages/sign_in'
import SignUpPage            from '@/pages/sign_up'
import VerifyEmailPage       from '@/pages/verify_email'
import ForgotPasswordPage    from '@/pages/forgot_password'
import ResetPasswordPage     from '@/pages/reset_password'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/sign-in',        element: <SignInPage /> },
      { path: '/sign-up',        element: <SignUpPage /> },
      { path: '/verify-email',   element: <VerifyEmailPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/',                              element: <DashboardPage /> },
      { path: '/projects',                      element: <ProjectsIndexPage /> },
      { path: '/projects/create',               element: <ProjectCreatePage /> },
      { path: '/projects/:projectId',           element: <ProjectShowPage /> },
      { path: '/projects/:projectId/config',    element: <ProjectConfigPage /> },
      { path: '/settings',                      element: <Navigate to="account" replace /> },
      { path: '/settings/account',              element: <AccountSettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
