import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import type { Book } from '@/types/book'
import { useBookshelfStore } from '../store/bookshelf-store'
import { ShelfBookmarkButton } from './shelf-bookmark-button'

const book: Book = {
  id: 'vol-1',
  title: 'Clean Code',
  subtitle: null,
  authors: ['Robert C. Martin'],
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

beforeEach(() => {
  localStorage.clear()
  useBookshelfStore.setState({ items: [] })
})

afterEach(() => {
  useBookshelfStore.setState({ items: [] })
})

describe('ShelfBookmarkButton', () => {
  it('adiciona e remove o livro alternando estado, rótulo e aria-pressed', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<ShelfBookmarkButton book={book} />)

    const button = screen.getByRole('button', { name: 'Adicionar à estante' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('data-state', 'out')

    await user.click(button)

    expect(useBookshelfStore.getState().items.map((i) => i.book.id)).toEqual(['vol-1'])
    expect(button).toHaveAccessibleName('Remover da estante')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-state', 'in')

    await user.click(button)

    expect(useBookshelfStore.getState().items).toEqual([])
    expect(button).toHaveAccessibleName('Adicionar à estante')
    expect(button).toHaveAttribute('data-state', 'out')
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })

  it('dispara o "burst" só ao adicionar, uma vez por adição', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<ShelfBookmarkButton book={book} />)
    const burst = () => container.querySelector('[data-slot="shelf-bookmark-burst"]')

    expect(burst()).toBeNull()

    await user.click(screen.getByRole('button'))
    const first = burst()
    expect(first).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(burst()).toBe(first)

    await user.click(screen.getByRole('button'))
    expect(burst()).not.toBe(first)
    expect(burst()).toBeInTheDocument()
  })

  it('reflete um livro que já está na estante', () => {
    useBookshelfStore.setState({ items: [{ book, status: 'reading', addedAt: 0 }] })
    renderWithProviders(<ShelfBookmarkButton book={book} />)

    expect(screen.getByRole('button', { name: 'Remover da estante' })).toHaveAttribute(
      'data-state',
      'in',
    )
  })
})
