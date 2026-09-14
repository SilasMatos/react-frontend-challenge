import { beforeEach, describe, expect, it } from 'vitest'
import type { Book } from '@/types/book'
import { useBookshelfStore } from './bookshelf-store'

function makeBook(id: string, title = `Livro ${id}`): Book {
  return {
    id,
    title,
    subtitle: null,
    authors: ['Autora X'],
    publisher: null,
    publishedDate: null,
    description: null,
    pageCount: null,
    categories: [],
    thumbnail: null,
    previewLink: null,
    infoLink: null,
    language: null,
  }
}

describe('useBookshelfStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useBookshelfStore.setState({ items: [] })
  })

  it('começa vazia', () => {
    expect(useBookshelfStore.getState().items).toEqual([])
  })

  it('adiciona um livro com o status padrão "quero ler"', () => {
    useBookshelfStore.getState().add(makeBook('a'))

    const [item] = useBookshelfStore.getState().items
    expect(item.book.id).toBe('a')
    expect(item.status).toBe('want-to-read')
    expect(item.addedAt).toBeTypeOf('number')
  })

  it('não duplica um livro já presente na estante', () => {
    const { add } = useBookshelfStore.getState()
    add(makeBook('a'))
    add(makeBook('a'))

    expect(useBookshelfStore.getState().items).toHaveLength(1)
  })

  it('remove um livro pelo id', () => {
    const { add, remove } = useBookshelfStore.getState()
    add(makeBook('a'))
    add(makeBook('b'))
    remove('a')

    expect(useBookshelfStore.getState().items.map((i) => i.book.id)).toEqual([
      'b',
    ])
  })

  it('altera o status de um livro sem tocar nos demais', () => {
    const { add, setStatus } = useBookshelfStore.getState()
    add(makeBook('a'))
    add(makeBook('b'))
    setStatus('a', 'read')

    const items = useBookshelfStore.getState().items
    expect(items.find((i) => i.book.id === 'a')?.status).toBe('read')
    expect(items.find((i) => i.book.id === 'b')?.status).toBe('want-to-read')
  })

  it('persiste a estante em localStorage', () => {
    useBookshelfStore.getState().add(makeBook('a', 'Clean Code'))

    expect(localStorage.getItem('libris:bookshelf')).toContain('Clean Code')
  })
})
