// API pública da feature `auth`.
// Importe SEMPRE por `@/features/auth` — caminhos internos são bloqueados pelo
// `no-restricted-imports` (eslint.config.js). Dentro da feature, use imports relativos.
export { LoginForm } from './components/login-form'
export { useAuth, getAuthSession } from './hooks/use-auth'
export { useAuthStore } from './store/auth-store'
export { loginSchema, type LoginInput } from './schemas/login-schema'
export type { AuthSession, AuthUser } from './types/auth'
