import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSearchBooks } from './use-search-books'
import * as booksService from '../services/books-service'

// O debounce tem cobertura própria em `src/hooks/use-debounce.test.ts`.
// Aqui ele vira identidade para os testes exercitarem só a query/paginação.
vi.mock('@/hooks/use-debounce', () => ({
  useDebounce: (value: unknown) => value,
}))

const searchVolumes = vi.spyOn(booksService, 'searchVolumes')

function makeResponse(ids: string[], totalItems = ids.length) {
  return {
    totalItems,
    items: ids.map((id) => ({ id, volumeInfo: { title: id.toUpperCase() } })),
  }
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

afterEach(() => {
  searchVolumes.mockReset()
})

describe('useSearchBooks', () => {
  it('fica ocioso e não chama a API sem termo', () => {
    const { result } = renderHook(() => useSearchBooks({ query: '   ' }), {
      wrapper,
    })

    expect(result.current.status).toBe('idle')
    expect(searchVolumes).not.toHaveBeenCalled()
  })

  it('busca e mapeia os resultados quando há termo', async () => {
    searchVolumes.mockResolvedValue(makeResponse(['a', 'b'], 42))

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b'])
    expect(result.current.books[0].title).toBe('A')
    expect(result.current.totalItems).toBe(42)
  })

  it('traduz `page` em `startIndex` e calcula a paginação', async () => {
    searchVolumes.mockResolvedValue(makeResponse(['x'], 55))

    const { result } = renderHook(
      () => useSearchBooks({ query: 'react', page: 1 }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(searchVolumes).toHaveBeenCalledWith(
      expect.objectContaining({ startIndex: 20, maxResults: 20 }),
    )
    expect(result.current.pageCount).toBe(3)
    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.rangeStart).toBe(21)
    expect(result.current.rangeEnd).toBe(40)
  })

  it('encaminha os filtros para o serviço', async () => {
    searchVolumes.mockResolvedValue(makeResponse([]))

    const { result } = renderHook(
      () =>
        useSearchBooks({ query: 'react', printType: 'magazines', orderBy: 'newest' }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.status).toBe('empty'))
    expect(searchVolumes).toHaveBeenCalledWith(
      expect.objectContaining({ printType: 'magazines', orderBy: 'newest' }),
    )
  })

  it('expõe status de erro quando a busca falha', async () => {
    searchVolumes.mockRejectedValue(new Error('API instável.'))

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toBe('API instável.')
  })

  it('reporta lista vazia como `empty`', async () => {
    searchVolumes.mockResolvedValue(makeResponse([], 0))

    const { result } = renderHook(() => useSearchBooks({ query: 'zzz' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('empty'))
    expect(result.current.books).toEqual([])
    expect(result.current.rangeStart).toBe(0)
  })
})
