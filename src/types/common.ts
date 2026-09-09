/** Tipos utilitários compartilhados por toda a aplicação. */

export type Nullable<T> = T | null

/** Resposta paginada normalizada (busca da Google Books via `startIndex`). */
export interface Paginated<T> {
  items: T[]
  totalItems: number
  startIndex: number
  pageSize: number
}
