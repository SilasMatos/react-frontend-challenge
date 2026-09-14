import { createFileRoute } from '@tanstack/react-router'
import { DiscoveryPage, discoverySearchSchema } from '@/features/books'
import { ShelfBookmarkButton } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: discoverySearchSchema,
  component: () => (
    <DiscoveryPage renderAction={(book) => <ShelfBookmarkButton book={book} />} />
  ),
})
