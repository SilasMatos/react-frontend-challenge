import { useMutation } from '@tanstack/react-query'
import { login } from '../services/auth-service'
import { useAuthStore } from '../store/auth-store'
import type { LoginInput } from '../schemas/login-schema'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (session) => setSession(session),
  })
}
