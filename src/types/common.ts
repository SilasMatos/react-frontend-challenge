export type Nullable<T> = T | null

export interface Paginated<T> {
  items: T[]
  totalItems: number
  startIndex: number
  pageSize: number
}
