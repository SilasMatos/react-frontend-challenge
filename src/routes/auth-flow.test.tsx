import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { createQueryClient } from '@/http/query-client'
import { routeTree } from '@/routeTree.gen'
import { useAuthStore } from '@/features/auth'
import type { AuthSession } from '@/features/auth'

const session: AuthSession = {
  token: 'libris.t.k',
  user: { email: 'ana@libris.dev', name: 'Ana' },
  issuedAt: 0,
}

function renderAt(path: string) {
  const queryClient = createQueryClient()
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('fluxo de autenticação', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  afterEach(() => {
    localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('sem sessão, "/" redireciona para /login', async () => {
    renderAt('/')
    expect(await screen.findByLabelText('E-mail')).toBeInTheDocument()
  })

  it('com sessão, "/" mostra a tela de descoberta', async () => {
    useAuthStore.setState({ session })
    renderAt('/')
    expect(
      await screen.findByRole('heading', { name: 'Descobrir livros' }),
    ).toBeInTheDocument()
  })

  it('com sessão, /login redireciona para "/"', async () => {
    useAuthStore.setState({ session })
    renderAt('/login')
    expect(
      await screen.findByRole('heading', { name: 'Descobrir livros' }),
    ).toBeInTheDocument()
  })
})
