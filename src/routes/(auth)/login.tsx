import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { getAuthSession, LoginPage } from '@/features/auth'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: () => {
    if (getAuthSession()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
