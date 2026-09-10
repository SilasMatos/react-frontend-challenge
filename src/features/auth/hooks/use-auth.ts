import { useAuthStore } from '../store/auth-store'
import type { AuthSession, AuthUser } from '../types/auth'

export interface UseAuthResult {
  isAuthenticated: boolean
  user: AuthUser | null
  logout: () => void
}

export function useAuth(): UseAuthResult {
  const session = useAuthStore((state) => state.session)
  const clearSession = useAuthStore((state) => state.clearSession)

  return {
    isAuthenticated: session !== null,
    user: session?.user ?? null,
    logout: clearSession,
  }
}

export function getAuthSession(): AuthSession | null {
  return useAuthStore.getState().session
}
