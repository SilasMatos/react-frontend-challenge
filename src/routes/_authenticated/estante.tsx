import { createFileRoute } from '@tanstack/react-router'
import { BookBackground } from '@/components/book-background'
import { BookshelfScreen } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/estante')({
  component: BookshelfRoute,
})

function BookshelfRoute() {
  return (
    <div className="relative isolate">
      <BookBackground className="fixed inset-0 -z-10 h-full w-full" />
      <BookshelfScreen />
    </div>
  )
}
