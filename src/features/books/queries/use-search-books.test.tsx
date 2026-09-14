import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Book } from '@/types/book'
import { getNextStartIndex, getPreviousStartIndex, useSearchBooks } from './use-search-books'
import { toBook } from '../mappers/book-mapper'
import * as booksService from '../services/books-service'

vi.mock('@/hooks/use-debounce', () => ({
  useDebounce: (value: unknown) => value,
}))

const searchVolumes = vi.spyOn(booksService, 'searchVolumes')

function makeResponse(
  ids: string[],
  totalItems = ids.length,
  dates: Record<string, string> = {},
) {
  return {
    totalItems,
    items: ids.map((id) => ({
      id,
      volumeInfo: { title: id.toUpperCase(), publishedDate: dates[id] },
    })),
  }
}

function book(id = 'x'): Book {
  return toBook({ id, volumeInfo: { title: id } })
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

  it('carrega a próxima página por `startIndex` e acumula os resultados', async () => {
    searchVolumes
      .mockResolvedValueOnce(makeResponse(['a', 'b'], 55))
      .mockResolvedValueOnce(makeResponse(['c'], 55))

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(searchVolumes).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 0, maxResults: 20 }),
    )
    expect(result.current.hasNextPage).toBe(true)

    act(() => result.current.fetchNextPage())

    await waitFor(() =>
      expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b', 'c']),
    )
    expect(searchVolumes).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 20, maxResults: 20 }),
    )
    expect(result.current.totalItems).toBe(55)
  })

  it('para de paginar no fim dos resultados e na janela de 1000', async () => {
    searchVolumes.mockResolvedValue(makeResponse(['a'], 20))

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.hasNextPage).toBe(false)

    expect(getNextStartIndex({ items: [], totalItems: 500, startIndex: 0, pageSize: 20 })).toBeUndefined()
    expect(getNextStartIndex({ items: [book()], totalItems: 5000, startIndex: 980, pageSize: 20 })).toBeUndefined()
    expect(getNextStartIndex({ items: [book()], totalItems: 5000, startIndex: 960, pageSize: 20 })).toBe(980)
  })

  it('mantém só as últimas `maxPages` páginas e expõe o início da janela', async () => {
    searchVolumes
      .mockResolvedValueOnce(makeResponse(['a', 'b'], 100))
      .mockResolvedValueOnce(makeResponse(['c', 'd'], 100))
      .mockResolvedValueOnce(makeResponse(['e', 'f'], 100))

    const { result } = renderHook(
      () => useSearchBooks({ query: 'react', maxPages: 2 }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.windowStart).toBe(0)
    expect(result.current.hasPreviousPage).toBe(false)

    act(() => result.current.fetchNextPage())
    await waitFor(() => expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b', 'c', 'd']))

    act(() => result.current.fetchNextPage())
    await waitFor(() => expect(result.current.books.map((b) => b.id)).toEqual(['c', 'd', 'e', 'f']))
    expect(result.current.windowStart).toBe(20)
    expect(result.current.hasPreviousPage).toBe(true)

    searchVolumes.mockResolvedValueOnce(makeResponse(['a', 'b'], 100))
    act(() => result.current.fetchPreviousPage())
    await waitFor(() => expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b', 'c', 'd']))
    expect(result.current.windowStart).toBe(0)
    expect(searchVolumes).toHaveBeenLastCalledWith(expect.objectContaining({ startIndex: 0 }))
  })

  it('calcula o startIndex da página anterior', () => {
    expect(getPreviousStartIndex({ items: [], totalItems: 100, startIndex: 0, pageSize: 20 })).toBeUndefined()
    expect(getPreviousStartIndex({ items: [], totalItems: 100, startIndex: 40, pageSize: 20 })).toBe(20)
    expect(getPreviousStartIndex({ items: [], totalItems: 100, startIndex: 10, pageSize: 20 })).toBe(0)
  })

  it('remove volumes duplicados entre páginas', async () => {
    searchVolumes
      .mockResolvedValueOnce(makeResponse(['a', 'b'], 60))
      .mockResolvedValueOnce(makeResponse(['b', 'c'], 60))

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    act(() => result.current.fetchNextPage())

    await waitFor(() =>
      expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b', 'c']),
    )
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

  it('ordena por data de publicação no cliente quando `orderBy` é newest', async () => {
    searchVolumes
      .mockResolvedValueOnce(
        makeResponse(['a', 'b', 'c', 'd'], 60, { a: '2015-09-11', b: '2023', c: '2008-09' }),
      )
      .mockResolvedValueOnce(makeResponse(['e'], 60, { e: '2026-04-27' }))

    const { result } = renderHook(
      () => useSearchBooks({ query: 'react', orderBy: 'newest' }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.books.map((b) => b.id)).toEqual(['b', 'a', 'c', 'd'])

    act(() => result.current.fetchNextPage())

    await waitFor(() =>
      expect(result.current.books.map((b) => b.id)).toEqual(['e', 'b', 'a', 'c', 'd']),
    )
  })

  it('preserva a ordem da API quando `orderBy` é relevance', async () => {
    searchVolumes.mockResolvedValue(
      makeResponse(['a', 'b'], 2, { a: '2015-09-11', b: '2023' }),
    )

    const { result } = renderHook(() => useSearchBooks({ query: 'react' }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.books.map((b) => b.id)).toEqual(['a', 'b'])
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
    expect(result.current.hasNextPage).toBe(false)
  })
})
