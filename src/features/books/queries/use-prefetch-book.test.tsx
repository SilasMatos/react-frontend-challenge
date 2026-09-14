import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/test-utils'
import * as booksService from '../services/books-service'
import { PREFETCH_INTENT_DELAY_MS, usePrefetchBook } from './use-prefetch-book'

const getVolume = vi.spyOn(booksService, 'getVolume')

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
  getVolume.mockResolvedValue({ id: 'vol-1', volumeInfo: { title: 'Clean Code' } })
})

afterEach(() => {
  vi.useRealTimers()
  getVolume.mockReset()
})

describe('usePrefetchBook', () => {
  it('só busca depois do delay de intenção', async () => {
    const { result } = renderHook(() => usePrefetchBook(), { wrapper })

    act(() => result.current.prefetch('vol-1'))
    expect(getVolume).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(PREFETCH_INTENT_DELAY_MS)
    })
    expect(getVolume).toHaveBeenCalledTimes(1)
    expect(getVolume).toHaveBeenCalledWith('vol-1', expect.anything())
  })

  it('não busca se o mouse sair antes do delay', async () => {
    const { result } = renderHook(() => usePrefetchBook(), { wrapper })

    act(() => result.current.prefetch('vol-1'))
    act(() => result.current.cancel())
    await act(async () => {
      await vi.advanceTimersByTimeAsync(PREFETCH_INTENT_DELAY_MS * 2)
    })

    expect(getVolume).not.toHaveBeenCalled()
  })

  it('não repete a busca de um livro já em cache', async () => {
    const { result } = renderHook(() => usePrefetchBook(), { wrapper })

    act(() => result.current.prefetch('vol-1'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(PREFETCH_INTENT_DELAY_MS)
    })
    act(() => result.current.prefetch('vol-1'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(PREFETCH_INTENT_DELAY_MS)
    })

    expect(getVolume).toHaveBeenCalledTimes(1)
  })
})
