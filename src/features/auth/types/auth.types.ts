export interface AuthUser {
  id:           string
  email:        string
  display_name: string
  avatar_url:   string | null
  has_password: boolean
  is_verified:  boolean
}

export interface AuthResponse {
  user: AuthUser
}

export interface RegisterResponse {
  status: 'verification_required'
}

export interface LoginPayload {
  email:    string
  password: string
}

export interface RegisterPayload {
  email:        string
  password:     string
  display_name: string
}

export interface VerifyEmailPayload {
  email: string
  code:  string
}

export interface ResendVerificationPayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email:        string
  code:         string
  new_password: string
}
