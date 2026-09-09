// API pública da feature `theme`.
// Importe SEMPRE por `@/features/theme` — caminhos internos são bloqueados pelo
// `no-restricted-imports` (eslint.config.js). Dentro da feature, use imports relativos.
export { ThemeProvider } from './components/theme-provider'
export { ThemeToggle } from './components/theme-toggle'
export { useTheme } from './hooks/use-theme'
export type { ThemePreference, ResolvedTheme } from './types/theme'
