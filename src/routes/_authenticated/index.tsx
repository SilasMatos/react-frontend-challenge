import { createFileRoute } from '@tanstack/react-router'
import { DiscoveryScreen } from '@/features/books'
import { ShelfToggleButton } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/')({
  component: DiscoveryRoute,
})

function DiscoveryRoute() {
  return (
    <DiscoveryScreen
      renderAction={(book) => <ShelfToggleButton book={book} />}
    />
  )
}
