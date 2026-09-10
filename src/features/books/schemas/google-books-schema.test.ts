import { describe, expect, it } from 'vitest'
import { googleBooksListSchema } from './google-books-schema'

describe('googleBooksListSchema', () => {
  it('parseia uma resposta completa e descarta chaves desconhecidas', () => {
    const parsed = googleBooksListSchema.parse({
      kind: 'books#volumes',
      totalItems: 2,
      items: [
        {
          id: 'vol-1',
          etag: 'abc',
          selfLink: 'https://example.com',
          volumeInfo: {
            title: 'Clean Code',
            authors: ['Robert C. Martin'],
            publishedDate: '2008-08-01',
            imageLinks: {
              thumbnail: 'http://books.google.com/books/content?id=1',
            },
          },
          saleInfo: { country: 'BR' },
        },
        { id: 'vol-2', volumeInfo: { title: 'Refactoring' } },
      ],
    })

    expect(parsed.totalItems).toBe(2)
    expect(parsed.items).toHaveLength(2)
    expect(parsed.items[0].volumeInfo.title).toBe('Clean Code')
    expect(parsed.items[0]).not.toHaveProperty('saleInfo')
  })

  it('trata `items` ausente como lista vazia', () => {
    const parsed = googleBooksListSchema.parse({ totalItems: 0 })
    expect(parsed.items).toEqual([])
  })

  it('descarta volumes malformados sem derrubar a resposta', () => {
    const parsed = googleBooksListSchema.parse({
      totalItems: 3,
      items: [
        { id: 'ok-1', volumeInfo: { title: 'Válido' } },
        { volumeInfo: { title: 'Sem id' } },
        { id: 42 },
      ],
    })

    expect(parsed.items).toHaveLength(1)
    expect(parsed.items[0].id).toBe('ok-1')
  })

  it('cai para 0 quando `totalItems` não é numérico', () => {
    const parsed = googleBooksListSchema.parse({ totalItems: 'muitos', items: [] })
    expect(parsed.totalItems).toBe(0)
  })

  it('preenche `volumeInfo` vazio quando ausente', () => {
    const parsed = googleBooksListSchema.parse({
      totalItems: 1,
      items: [{ id: 'only-id' }],
    })
    expect(parsed.items[0].volumeInfo).toEqual({})
  })
})
