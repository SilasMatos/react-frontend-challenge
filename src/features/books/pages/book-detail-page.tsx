import type { ReactNode } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import type { Book } from '@/types/book'
import { BookDetailScreen } from '../components/book-detail-screen'

const route = getRouteApi('/_authenticated/book/$bookId')

export interface BookDetailPageProps {
  renderAction?: (book: Book) => ReactNode
}

export function BookDetailPage({ renderAction }: BookDetailPageProps) {
  const { bookId } = route.useParams()
  return <BookDetailScreen bookId={bookId} renderAction={renderAction} />
}
