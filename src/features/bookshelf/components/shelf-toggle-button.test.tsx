import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import type { Book } from '@/types/book'
import { useBookshelfStore } from '../store/bookshelf-store'
import { ShelfToggleButton } from './shelf-toggle-button'

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

describe('ShelfToggleButton', () => {
  it('adiciona o livro à estante no primeiro clique', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ShelfToggleButton book={book} />)

    const button = screen.getByRole('button', { name: 'Adicionar à estante' })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(useBookshelfStore.getState().items.map((i) => i.book.id)).toEqual([
      'vol-1',
    ])
    expect(
      screen.getByRole('button', { name: 'Remover da estante' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('remove o livro no segundo clique', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ShelfToggleButton book={book} />)

    await user.click(screen.getByRole('button', { name: 'Adicionar à estante' }))
    await user.click(screen.getByRole('button', { name: 'Remover da estante' }))

    expect(useBookshelfStore.getState().items).toEqual([])
    expect(
      screen.getByRole('button', { name: 'Adicionar à estante' }),
    ).toBeInTheDocument()
  })

  it('reflete um livro que já está na estante', () => {
    useBookshelfStore.setState({
      items: [{ book, status: 'reading', addedAt: 0 }],
    })
    renderWithProviders(<ShelfToggleButton book={book} withLabel />)

    expect(
      screen.getByRole('button', { name: 'Remover da estante' }),
    ).toBeInTheDocument()
  })
})
