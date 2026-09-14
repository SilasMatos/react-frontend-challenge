import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemePreference } from '../types/theme'

interface ThemeStore {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    { name: 'libris:theme' },
  ),
)
