export interface AuthUser {
  email: string
  name: string
}

export interface AuthSession {
  token: string
  user: AuthUser
  issuedAt: number
}
