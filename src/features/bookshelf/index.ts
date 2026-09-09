// API pública da feature `bookshelf`.
// Importe SEMPRE por `@/features/bookshelf` — caminhos internos são bloqueados pelo
// `no-restricted-imports` (eslint.config.js). Dentro da feature, use imports relativos.

export { BookshelfScreen } from './components/bookshelf-screen'
export { ShelfToggleButton } from './components/shelf-toggle-button'
export { ShelfNavLink } from './components/shelf-nav-link'

export { useBookshelf, useShelfEntry } from './hooks/use-bookshelf'

// Exposta para semear/limpar o estado em testes de integração de rota
// (mesmo padrão de `useAuthStore` em `features/auth`).
export { useBookshelfStore } from './store/bookshelf-store'

export {
  BOOK_STATUSES,
  BOOK_STATUS_LABELS,
  BOOK_STATUS_ORDER,
  DEFAULT_BOOK_STATUS,
} from './types/bookshelf'
export type { BookStatus, BookshelfItem } from './types/bookshelf'
