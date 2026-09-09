import { describe, expect, it } from 'vitest'
import { googleBooksListSchema, googleVolumeSchema } from '../schemas/google-books-schema'
import { toBook, toBookPage } from './book-mapper'

function volume(input: unknown) {
  return googleVolumeSchema.parse(input)
}

describe('toBook', () => {
  it('normaliza um volume completo', () => {
    const book = toBook(
      volume({
        id: 'vol-1',
        volumeInfo: {
          title: '  Clean Code  ',
          subtitle: 'A Handbook',
          authors: ['Robert C. Martin', '  '],
          publisher: 'Prentice Hall',
          publishedDate: '2008-08-01',
          description: 'Um livro sobre código limpo.',
          pageCount: 464,
          categories: ['Computers'],
          language: 'en',
          previewLink: 'http://books.google.com/preview',
          infoLink: 'http://books.google.com/info',
          imageLinks: {
            smallThumbnail: 'http://books.google.com/small',
            thumbnail: 'http://books.google.com/thumb',
          },
        },
      }),
    )

    expect(book).toEqual({
      id: 'vol-1',
      title: 'Clean Code',
      subtitle: 'A Handbook',
      authors: ['Robert C. Martin'],
      publisher: 'Prentice Hall',
      publishedDate: '2008-08-01',
      description: 'Um livro sobre código limpo.',
      pageCount: 464,
      categories: ['Computers'],
      thumbnail: 'https://books.google.com/thumb',
      previewLink: 'https://books.google.com/preview',
      infoLink: 'https://books.google.com/info',
      language: 'en',
    })
  })

  it('usa `null` para capa quando não há `imageLinks`', () => {
    const book = toBook(volume({ id: 'x', volumeInfo: { title: 'Sem capa' } }))
    expect(book.thumbnail).toBeNull()
  })

  it('prefere `thumbnail` a `smallThumbnail` e sobe para https', () => {
    const book = toBook(
      volume({
        id: 'x',
        volumeInfo: {
          title: 'T',
          imageLinks: {
            smallThumbnail: 'http://small',
            thumbnail: 'http://thumb',
          },
        },
      }),
    )
    expect(book.thumbnail).toBe('https://thumb')
  })

  it('cai para o menor `imageLinks` disponível quando não há thumbnail', () => {
    const book = toBook(
      volume({
        id: 'x',
        volumeInfo: { title: 'T', imageLinks: { large: 'https://large' } },
      }),
    )
    expect(book.thumbnail).toBe('https://large')
  })

  it('preenche defaults para um volume quase vazio', () => {
    const book = toBook(volume({ id: 'only-id' }))

    expect(book.title).toBe('Título não informado')
    expect(book.authors).toEqual([])
    expect(book.categories).toEqual([])
    expect(book.subtitle).toBeNull()
    expect(book.publishedDate).toBeNull()
    expect(book.pageCount).toBeNull()
  })

  it('trata `pageCount` 0 como ausente', () => {
    const book = toBook(volume({ id: 'x', volumeInfo: { title: 'T', pageCount: 0 } }))
    expect(book.pageCount).toBeNull()
  })
})

describe('toBookPage', () => {
  it('monta a página normalizada com os metadados de paginação', () => {
    const response = googleBooksListSchema.parse({
      totalItems: 57,
      items: [
        { id: 'a', volumeInfo: { title: 'A' } },
        { id: 'b', volumeInfo: { title: 'B' } },
      ],
    })

    const pageData = toBookPage(response, 20, 20)

    expect(pageData.items.map((b) => b.id)).toEqual(['a', 'b'])
    expect(pageData.totalItems).toBe(57)
    expect(pageData.startIndex).toBe(20)
    expect(pageData.pageSize).toBe(20)
  })
})
