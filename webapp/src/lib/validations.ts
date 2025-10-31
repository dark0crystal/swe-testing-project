import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileSchema = z.object({
  weight: z.number().min(30, 'Weight must be at least 30 kg').max(300, 'Weight must be less than 300 kg'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  weatherCondition: z.enum(['cool', 'mild', 'warm', 'hot']),
})

export const waterLogSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1 ml').max(1000, 'Amount must be less than 1000 ml'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type WaterLogFormData = z.infer<typeof waterLogSchema>
