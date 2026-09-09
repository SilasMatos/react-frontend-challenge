import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/http/query-client'
import { LoginForm } from './login-form'
import { useAuthStore } from '../store/auth-store'

vi.mock('../services/auth-service', () => ({
  login: vi.fn(async ({ email }: { email: string }) => ({
    token: 'test-token',
    user: { email, name: 'Ana' },
    issuedAt: 0,
  })),
}))

function renderForm() {
  const onSuccess = vi.fn()
  render(
    <QueryClientProvider client={createQueryClient()}>
      <LoginForm onSuccess={onSuccess} />
    </QueryClientProvider>,
  )
  return { onSuccess }
}

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('valida o e-mail no blur', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('E-mail'), 'invalido')
    await user.tab()

    expect(
      await screen.findByText('Informe um e-mail válido.'),
    ).toBeInTheDocument()
  })

  it('valida o tamanho da senha no blur', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.tab()

    expect(
      await screen.findByText('A senha precisa ter mais de 6 caracteres.'),
    ).toBeInTheDocument()
  })

  it('com credenciais válidas: persiste a sessão e chama onSuccess', async () => {
    const user = userEvent.setup()
    const { onSuccess } = renderForm()

    await user.type(screen.getByLabelText('E-mail'), 'ana@libris.dev')
    await user.type(screen.getByLabelText('Senha'), 'segredo123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    expect(useAuthStore.getState().session?.user.email).toBe('ana@libris.dev')
  })
})
