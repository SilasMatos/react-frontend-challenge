import { createFileRoute } from '@tanstack/react-router'
import { BookshelfPage } from '@/features/bookshelf'

export const Route = createFileRoute('/_authenticated/estante')({
  component: BookshelfPage,
})
