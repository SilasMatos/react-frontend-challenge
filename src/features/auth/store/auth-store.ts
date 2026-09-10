import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession } from '../types/auth'

interface AuthStore {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

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
