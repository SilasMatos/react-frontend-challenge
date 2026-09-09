import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/test-utils'
import { useBook } from './use-book'
import * as booksService from '../services/books-service'

const getVolume = vi.spyOn(booksService, 'getVolume')

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

afterEach(() => {
  getVolume.mockReset()
})

describe('useBook', () => {
  it('busca o volume e devolve o `Book` mapeado', async () => {
    getVolume.mockResolvedValue({
      id: 'vol-1',
      volumeInfo: {
        title: 'Clean Code',
        authors: ['Robert C. Martin'],
        imageLinks: { thumbnail: 'http://img/thumb' },
      },
    })

    const { result } = renderHook(() => useBook('vol-1'), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(getVolume).toHaveBeenCalledWith('vol-1', expect.anything())
    expect(result.current.book).toMatchObject({
      id: 'vol-1',
      title: 'Clean Code',
      thumbnail: 'https://img/thumb',
    })
  })

  it('expõe o erro quando a API falha', async () => {
    getVolume.mockRejectedValue(new Error('Não encontramos nada para essa busca.'))

    const { result } = renderHook(() => useBook('missing'), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(
      'Não encontramos nada para essa busca.',
    )
  })

  it('não busca com id vazio', () => {
    renderHook(() => useBook(''), { wrapper })
    expect(getVolume).not.toHaveBeenCalled()
  })
})
