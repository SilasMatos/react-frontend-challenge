import type { MouseEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useCanGoBack, useRouter } from '@tanstack/react-router'
import { useLastSearch } from '../store/last-search-store'

export function BackToSearchLink() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const lastSearch = useLastSearch()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!canGoBack || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    router.history.back()
  }

  return (
    <Link
      to="/"
      search={lastSearch}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft className="size-4" />
      Voltar para a busca
    </Link>
  )
}
