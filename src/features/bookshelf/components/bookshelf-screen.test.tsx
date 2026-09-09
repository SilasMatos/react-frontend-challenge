import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/test-utils'
import { useAuthStore } from '@/features/auth'
import type { Book } from '@/types/book'
import { useBookshelfStore } from '../store/bookshelf-store'
import type { BookStatus, BookshelfItem } from '../types/bookshelf'

function makeBook(id: string, title: string): Book {
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

function item(
  id: string,
  title: string,
  status: BookStatus,
  addedAt: number,
): BookshelfItem {
  return { book: makeBook(id, title), status, addedAt }
}

// Ordem de inclusão, título e status divergem — dá para distinguir cada ordenação.
const SEED: BookshelfItem[] = [
  item('a', 'Refactoring', 'reading', 1),
  item('b', 'Clean Code', 'read', 2),
  item('c', 'Domain-Driven Design', 'want-to-read', 3),
]

function rowTitles(): (string | null)[] {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getByRole('link').textContent)
}

beforeEach(() => {
  localStorage.clear()
  useBookshelfStore.setState({ items: [] })
  useAuthStore.setState({
    session: {
      token: 't',
      user: { email: 'ana@libris.dev', name: 'Ana' },
      issuedAt: 0,
    },
  })
})

afterEach(() => {
  useBookshelfStore.setState({ items: [] })
  useAuthStore.setState({ session: null })
})

describe('BookshelfScreen (rota /estante)', () => {
  it('mostra o estado vazio quando não há livros salvos', async () => {
    renderRoute('/estante')

    expect(
      await screen.findByText('Sua estante está vazia'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Descobrir livros' }),
    ).toBeInTheDocument()
  })

  it('lista os livros salvos na ordem de inclusão', async () => {
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    await screen.findByRole('link', { name: 'Refactoring' })
    expect(rowTitles()).toEqual([
      'Refactoring',
      'Clean Code',
      'Domain-Driven Design',
    ])
    expect(screen.getByText('3 livros salvos.')).toBeInTheDocument()
  })

  it('ordena por Título e marca aria-sort', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    await user.click(await screen.findByRole('button', { name: 'Título' }))

    expect(rowTitles()).toEqual([
      'Clean Code',
      'Domain-Driven Design',
      'Refactoring',
    ])
    expect(
      screen.getByRole('columnheader', { name: 'Título' }),
    ).toHaveAttribute('aria-sort', 'ascending')
  })

  it('ordena por Status (progresso de leitura, não alfabético)', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    await user.click(await screen.findByRole('button', { name: 'Status' }))

    expect(rowTitles()).toEqual([
      'Domain-Driven Design',
      'Refactoring',
      'Clean Code',
    ])
  })

  it('altera o status de um livro na linha (com destaque momentâneo)', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: [SEED[1]] })
    const { container } = renderRoute('/estante')

    await user.click(
      await screen.findByRole('combobox', { name: 'Status de Clean Code' }),
    )
    const listbox = await screen.findByRole('listbox')
    await user.click(within(listbox).getByRole('option', { name: 'Lendo' }))

    expect(useBookshelfStore.getState().items[0].status).toBe('reading')
    expect(container.querySelector('.animate-row-flash')).toBeInTheDocument()
  })

  it('remove um livro pela ação da linha', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    const removeButton = await screen.findByRole('button', {
      name: 'Remover Clean Code da estante',
    })
    await user.click(removeButton)

    // some após ~200ms (transição de saída) — o botão trava no intervalo
    expect(removeButton).toBeDisabled()
    await waitFor(() =>
      expect(
        useBookshelfStore.getState().items.map((i) => i.book.id),
      ).toEqual(['a', 'c']),
    )
    expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument()
  })
})
