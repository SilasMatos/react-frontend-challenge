import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '@/test/test-utils'
import { useAuthStore } from '@/features/auth'
import * as booksService from '../services/books-service'

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

  it('carrega mais resultados por startIndex mantendo o termo', async () => {
    const user = userEvent.setup()
    searchVolumes.mockImplementation(async ({ startIndex }) =>
      startIndex === 0
        ? volumes(['Livro A'], 60)
        : {
            totalItems: 60,
            items: [{ id: 'id-b', volumeInfo: { title: 'Livro B', authors: [] } }],
          },
    )

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    await user.click(screen.getByRole('button', { name: 'Carregar mais' }))

    expect(await screen.findByRole('link', { name: /Livro B/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Livro A/ })).toBeInTheDocument()
    expect(searchVolumes).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'js', startIndex: 20 }),
    )
  })

  it('mantém os resultados e oferece retry quando a próxima página falha', async () => {
    const user = userEvent.setup()
    searchVolumes.mockImplementation(async ({ startIndex }) => {
      if (startIndex === 0) return volumes(['Livro A'], 60)
      throw new Error('Muitas buscas em pouco tempo.')
    })

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    await user.click(screen.getByRole('button', { name: 'Carregar mais' }))

    expect(await screen.findByText('Muitas buscas em pouco tempo.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Livro A/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
  })

  it('carrega a próxima página automaticamente quando o sentinela entra na tela', async () => {
    const user = userEvent.setup()
    const callbacks: IntersectionObserverCallback[] = []
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          callbacks.push(callback)
        }
        observe() {}
        disconnect() {}
      },
    )
    searchVolumes.mockResolvedValue(volumes(['Livro A'], 60))

    try {
      renderRoute('/')
      await user.type(await screen.findByRole('searchbox'), 'js')
      await screen.findByRole('link', { name: /Livro A/ })
      await waitFor(() => expect(callbacks.length).toBeGreaterThan(0))

      const observer = { takeRecords: () => [] } as unknown as IntersectionObserver
      callbacks.at(-1)?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observer,
      )

      await waitFor(() =>
        expect(searchVolumes).toHaveBeenLastCalledWith(
          expect.objectContaining({ query: 'js', startIndex: 20 }),
        ),
      )
    } finally {
      vi.unstubAllGlobals()
    }
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

  it('hidrata termo e filtros a partir da URL (deep-link)', async () => {
    searchVolumes.mockResolvedValue(volumes(['Duna'], 60))

    renderRoute('/?q=dune&printType=books&orderBy=newest')

    expect(
      await screen.findByRole('link', { name: /Duna/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('dune')
    expect(searchVolumes).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: 'dune',
        printType: 'books',
        orderBy: 'newest',
        startIndex: 0,
      }),
    )
  })

  it('sincroniza o termo com a URL sem poluir com os defaults', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Livro A'], 60))

    const { router } = renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    await waitFor(() =>
      expect(router.state.location.searchStr).toContain('q=js'),
    )
    expect(router.state.location.searchStr).not.toContain('printType=')
    expect(router.state.location.searchStr).not.toContain('orderBy=')
  })

  it('preenche a busca a partir de uma sugestão', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Clean Code'], 1))

    renderRoute('/')
    await user.click(await screen.findByRole('button', { name: 'Clean Code' }))

    expect(screen.getByRole('searchbox')).toHaveValue('Clean Code')
    await waitFor(() =>
      expect(searchVolumes).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'Clean Code' }),
      ),
    )
  })

  it('aplica o filtro de tipo (TanStack Form)', async () => {
    const user = userEvent.setup()
    searchVolumes.mockResolvedValue(volumes(['Livro A'], 1))

    renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'js')
    await screen.findByRole('link', { name: /Livro A/ })

    const group = screen.getByRole('group', { name: 'Tipo' })
    await user.click(within(group).getByRole('button', { name: 'Livros' }))

    expect(within(group).getByRole('button', { name: 'Livros' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await waitFor(() =>
      expect(searchVolumes).toHaveBeenLastCalledWith(
        expect.objectContaining({ printType: 'books', query: 'js' }),
      ),
    )
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
