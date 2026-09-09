import { describe, expect, it } from 'vitest'
import { loginSchema } from './login-schema'

describe('loginSchema', () => {
  it('aceita e-mail válido e senha com mais de 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'ana@libris.dev',
      password: '1234567',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({ email: 'ana', password: '1234567' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Informe um e-mail válido.')
  })

  it('rejeita senha com 6 caracteres ou menos', () => {
    const result = loginSchema.safeParse({
      email: 'ana@libris.dev',
      password: '123456',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'A senha precisa ter mais de 6 caracteres.',
    )
  })
})
