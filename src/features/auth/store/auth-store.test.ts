import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth-store'
import type { AuthSession } from '../types/auth'

const session: AuthSession = {
  token: 'libris.abc.def',
  user: { email: 'ana@libris.dev', name: 'Ana' },
  issuedAt: 0,
}

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('começa sem sessão', () => {
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('grava e limpa a sessão', () => {
    useAuthStore.getState().setSession(session)
    expect(useAuthStore.getState().session).toEqual(session)

    useAuthStore.getState().clearSession()
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('persiste a sessão em localStorage', () => {
    useAuthStore.getState().setSession(session)
    expect(localStorage.getItem('libris:auth')).toContain('ana@libris.dev')
  })
})
