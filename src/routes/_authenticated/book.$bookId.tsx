import { createFileRoute } from '@tanstack/react-router'
import { BookDetailScreen } from '@/features/books'
import { ShelfToggleButton } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/book/$bookId')({
  component: BookDetailRoute,
})

function BookDetailRoute() {
  const { bookId } = Route.useParams()
  return (
    <BookDetailScreen
      bookId={bookId}
      renderAction={(book) => <ShelfToggleButton book={book} withLabel />}
    />
  )
}
