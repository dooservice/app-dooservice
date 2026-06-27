import { z } from 'zod'

export const signInSchema = z.object({
  email:    z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Minimum 8 characters'),
})

export const signUpSchema = z
  .object({
    full_name:        z.string().min(1, 'Full name is required').min(2, 'Minimum 2 characters'),
    email:            z.email('Invalid email address'),
    password:         z.string().min(1, 'Password is required').min(8, 'Minimum 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine(d => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path:    ['confirm_password'],
  })

export type SignInValues  = z.infer<typeof signInSchema>
export type SignUpValues  = z.infer<typeof signUpSchema>
