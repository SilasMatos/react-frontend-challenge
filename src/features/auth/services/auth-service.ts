import type { LoginInput } from '../schemas/login-schema'
import type { AuthSession } from '../types/auth'

const FAKE_LATENCY_MS = 500

/** Token fictício: prefixo + payload base64url + sufixo aleatório. Não é um JWT real. */
function createFakeToken(email: string): string {
  const payload = btoa(JSON.stringify({ sub: email, iat: Date.now() })).replace(
    /=+$/,
    '',
  )
  const nonce = Math.random().toString(36).slice(2, 10)
  return `libris.${payload}.${nonce}`
}

/** Deriva um nome apresentável a partir da parte local do e-mail. */
function deriveName(email: string): string {
  const local = email.split('@')[0] ?? email
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
  return name || local
}

/**
 * "Autentica" localmente. A validação de formato já aconteceu (schema Zod);
 * aqui só simulamos a latência de rede e devolvemos a sessão.
 */
export async function login({ email }: LoginInput): Promise<AuthSession> {
  await new Promise((resolve) => {
    setTimeout(resolve, FAKE_LATENCY_MS)
  })

  return {
    token: createFakeToken(email),
    user: { email, name: deriveName(email) },
    issuedAt: Date.now(),
  }
}
