import { describe, expect, it } from 'vitest'
import { sanitizeCoverUrl } from './sanitize-cover-url'

describe('sanitizeCoverUrl', () => {
  it('sobe http para https', () => {
    expect(sanitizeCoverUrl('http://books.google.com/thumb')).toBe(
      'https://books.google.com/thumb',
    )
  })

  it('resolve url protocol-relative', () => {
    expect(sanitizeCoverUrl('//books.google.com/thumb')).toBe(
      'https://books.google.com/thumb',
    )
  })

  it('remove edge=curl e sobe zoom=1 para zoom=2 em urls do Google Books', () => {
    expect(
      sanitizeCoverUrl(
        'http://books.google.com/books/content?id=1&edge=curl&zoom=1',
      ),
    ).toBe('https://books.google.com/books/content?id=1&zoom=2')
  })

  it('não mexe em urls que não são do Google Books', () => {
    expect(sanitizeCoverUrl('https://cdn.exemplo.com/capa.jpg?zoom=1')).toBe(
      'https://cdn.exemplo.com/capa.jpg?zoom=1',
    )
  })

  it('remove espaços nas bordas', () => {
    expect(sanitizeCoverUrl('  https://img/thumb  ')).toBe('https://img/thumb')
  })
})
