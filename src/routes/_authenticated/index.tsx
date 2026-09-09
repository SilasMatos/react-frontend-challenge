import { createFileRoute } from '@tanstack/react-router'
import { DiscoveryScreen } from '@/features/books'

export const Route = createFileRoute('/_authenticated/')({
  component: DiscoveryScreen,
})
