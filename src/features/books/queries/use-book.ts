import { useQuery } from '@tanstack/react-query'
import type { Book } from '@/types/book'
import { bookQueryOptions } from './book-query'

export interface UseBookResult {
  book: Book | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useBook(bookId: string): UseBookResult {
  const result = useQuery({
    ...bookQueryOptions(bookId),
    enabled: bookId.length > 0,
  })

  return {
    book: result.data,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: () => void result.refetch(),
  }
}
