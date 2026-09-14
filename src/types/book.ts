export interface Book {
  id: string
  title: string
  subtitle: string | null
  authors: string[]
  publisher: string | null
  publishedDate: string | null
  description: string | null
  pageCount: number | null
  categories: string[]
  thumbnail: string | null
  previewLink: string | null
  infoLink: string | null
  language: string | null
}
