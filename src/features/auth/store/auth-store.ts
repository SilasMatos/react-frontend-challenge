import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession } from '../types/auth'

interface AuthStore {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

/**
 * Fonte da verdade da sessão. `persist` grava em localStorage (chave
 * `libris:auth`), então o usuário continua logado após recarregar a página.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: 'libris:auth' },
  ),
)
