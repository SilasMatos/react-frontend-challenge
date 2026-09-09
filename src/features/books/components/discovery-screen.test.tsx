import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '@/test/test-utils'
import { useAuthStore } from '@/features/auth'
import * as booksService from '../services/books-service'

// Debounce tem cobertura própria; aqui vira identidade para o teste ser síncrono.
vi.mock('@/hooks/use-debounce', () => ({ useDebounce: (value: unknown) => value }))

const searchVolumes = vi.spyOn(booksService, 'searchVolumes')

function volumes(titles: string[], totalItems = titles.length) {
  return {
    totalItems,
    items: titles.map((title, index) => ({
      id: `id-${index}`,
      volumeInfo: { title, authors: ['Autora X'] },
    })),
  }
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    session: {
      token: 't',
      user: { email: 'ana@libris.dev', name: 'Ana' },
      issuedAt: 0,
    },
  })
})

afterEach(() => {
  searchVolumes.mockReset()
  useAuthStore.setState({ session: null })
})

describe('DiscoveryScreen', () => {
  it('começa ociosa, sem bater na API', async () => {
    renderRoute('/')

    expect(
      await screen.findByText('Sua próxima leitura começa aqui'),
    ).toBeInTheDocument()
    expect(searchVolumes).not.toHaveBeenCalled()
  })

  it('busca ao digitar e lista os resultados', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Clean Code', 'Refactoring'], 2))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'code')

    expect(
      await screen.findByRole('link', { name: /Clean Code/ }),
    ).toBeInTheDocument()
    expect(searchVolumes).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'code', startIndex: 0 }),
    )
  })

  it('pagina por startIndex mantendo o termo', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Livro A'], 60))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    await user.click(screen.getByRole('button', { name: /Próxima/ }))

    await waitFor(() =>
      expect(searchVolumes).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'js', startIndex: 20 }),
      ),
    )
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('mostra estado de erro com retry quando a busca falha', async () => {
    const user = userEvent.setup()
    searchVolumes.mockRejectedValue(new Error('A Google Books API está instável.'))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'x')

    expect(
      await screen.findByText('Não deu para buscar agora'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeInTheDocument()
  })

  it('estado vazio quando a API não retorna itens', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes([], 0))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'zzzzz')

    expect(
      await screen.findByText('Nenhum livro encontrado'),
    ).toBeInTheDocument()
  })

  it('aplica o filtro de ordenação (TanStack Form)', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Livro A'], 1))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    await user.click(screen.getByRole('combobox', { name: 'Ordenar' }))
    const listbox = await screen.findByRole('listbox')
    await user.click(within(listbox).getByRole('option', { name: 'Mais recentes' }))

    await waitFor(() =>
      expect(searchVolumes).toHaveBeenLastCalledWith(
        expect.objectContaining({ orderBy: 'newest', query: 'js' }),
      ),
    )
  })
})
