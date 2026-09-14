import { describe, expect, it } from 'vitest'
import { isGoogleBooksPlaceholder, sanitizeCoverUrl } from './sanitize-cover-url'

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

  it('mantém zoom=1 quando `upgradeZoom` é false', () => {
    expect(
      sanitizeCoverUrl('http://books.google.com/books/content?id=1&edge=curl&zoom=1', {
        upgradeZoom: false,
      }),
    ).toBe('https://books.google.com/books/content?id=1&zoom=1')
  })

  it('remove espaços nas bordas', () => {
    expect(sanitizeCoverUrl('  https://img/thumb  ')).toBe('https://img/thumb')
  })
})

describe('isGoogleBooksPlaceholder', () => {
  const google = 'https://books.google.com/books/content?id=1&zoom=2'

  it('reconhece os PNGs "image not available" do Google Books (zoom 1 e 2)', () => {
    expect(
      isGoogleBooksPlaceholder({ src: google, naturalWidth: 300, naturalHeight: 391 }),
    ).toBe(true)
    expect(
      isGoogleBooksPlaceholder({ src: google, naturalWidth: 128, naturalHeight: 170 }),
    ).toBe(true)
  })

  it('não confunde capas reais nem outros hosts', () => {
    expect(
      isGoogleBooksPlaceholder({ src: google, naturalWidth: 300, naturalHeight: 450 }),
    ).toBe(false)
    expect(
      isGoogleBooksPlaceholder({
        src: 'https://cdn.exemplo.com/capa.png',
        naturalWidth: 300,
        naturalHeight: 391,
      }),
    ).toBe(false)
  })
})
