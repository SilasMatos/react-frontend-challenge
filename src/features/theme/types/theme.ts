/** Preferência escolhida pelo usuário (persistida em localStorage). */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Tema efetivamente aplicado ao DOM, depois de resolver `system`. */
export type ResolvedTheme = 'light' | 'dark'
