import { createFileRoute } from '@tanstack/react-router'
import { BookDetailPage } from '@/features/books'
import { ShelfToggleButton } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/book/$bookId')({
  component: () => (
    <BookDetailPage
      renderAction={(book) => <ShelfToggleButton book={book} withLabel />}
    />
  ),
})
