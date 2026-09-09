/** Usuário derivado do e-mail informado no login simulado (não há backend). */
export interface AuthUser {
  email: string
  name: string
}

/** Sessão persistida em localStorage — sobrevive ao refresh (diferencial do case). */
export interface AuthSession {
  /** Token fictício gerado no cliente. */
  token: string
  user: AuthUser
  issuedAt: number
}
