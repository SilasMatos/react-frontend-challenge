import { useMutation } from '@tanstack/react-query'
import { login } from '../services/auth-service'
import { useAuthStore } from '../store/auth-store'
import type { LoginInput } from '../schemas/login-schema'

/**
 * Mutation do login simulado: chama o serviço, e no sucesso grava a sessão na
 * store (que persiste em localStorage). Expõe `isPending` / `error` para a UI.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (session) => setSession(session),
  })
}
