/**
 * Modelo de domínio limpo do livro — já normalizado a partir do JSON aninhado e
 * inconsistente da Google Books API pelo mapper em `features/books/mappers`.
 *
 * Vive na camada compartilhada porque `books` e `bookshelf` dependem dele;
 * features não importam tipos umas das outras.
 */
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
  /** `null` quando a API não traz capa — a UI renderiza placeholder, nunca imagem quebrada. */
  thumbnail: string | null
  previewLink: string | null
  infoLink: string | null
  language: string | null
}
