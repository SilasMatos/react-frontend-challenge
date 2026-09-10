import { useQuery } from '@tanstack/react-query'
import type { Book } from '@/types/book'
import { toBook } from '../mappers/book-mapper'
import { booksKeys } from '../query-keys'
import { getVolume } from '../services/books-service'

export interface UseBookResult {
  book: Book | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useBook(bookId: string): UseBookResult {
  const result = useQuery({
    queryKey: booksKeys.detail(bookId),
    queryFn: async ({ signal }) => toBook(await getVolume(bookId, signal)),
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
