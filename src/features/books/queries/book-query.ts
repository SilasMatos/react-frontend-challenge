import { queryOptions } from '@tanstack/react-query'
import { toBook } from '../mappers/book-mapper'
import { booksKeys } from '../query-keys'
import { getVolume } from '../services/books-service'

export function bookQueryOptions(bookId: string) {
  return queryOptions({
    queryKey: booksKeys.detail(bookId),
    queryFn: async ({ signal }) => toBook(await getVolume(bookId, signal)),
  })
}
