import { createFileRoute } from '@tanstack/react-router'
import { BookshelfScreen } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/estante')({
  component: BookshelfScreen,
})
