import { useSyncExternalStore } from 'react'
import { useThemeStore } from '../store/theme-store'
import type { ResolvedTheme, ThemePreference } from '../types/theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function getDarkMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null
  }
  return window.matchMedia(DARK_QUERY)
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  const media = getDarkMediaQuery()
  if (!media) return () => {}
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSystemTheme(): ResolvedTheme {
  return getDarkMediaQuery()?.matches ? 'dark' : 'light'
}

/** `system` → tema do SO; qualquer outra preferência vale por si. */
export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference
}

export interface UseThemeResult {
  /** O que o usuário escolheu: `light` | `dark` | `system`. */
  preference: ThemePreference
  /** Tema aplicado agora: `light` | `dark`. */
  theme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  /** Alterna claro/escuro a partir do tema aplicado. */
  toggle: () => void
}

export function useTheme(): UseThemeResult {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    () => 'light' as ResolvedTheme,
  )

  const theme = resolveTheme(preference, systemTheme)

  return {
    preference,
    theme,
    setPreference,
    toggle: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
  }
}
