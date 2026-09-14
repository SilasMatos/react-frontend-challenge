import { BookBackground } from '@/components/book-background'
import { BookshelfScreen } from '../components/bookshelf-screen'

export function BookshelfPage() {
  return (
    <div className="relative isolate">
      <BookBackground className="fixed inset-0 -z-10 h-full w-full" />
      <BookshelfScreen />
    </div>
  )
}
