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

    const combobox = await screen.findByRole('combobox', {
      name: 'Status de Clean Code',
    })
    expect(combobox).toHaveTextContent('Concluído')

    await user.click(combobox)
    const listbox = await screen.findByRole('listbox')
    await user.click(within(listbox).getByRole('option', { name: 'Lendo' }))

    expect(useBookshelfStore.getState().items[0].status).toBe('reading')
    expect(combobox).toHaveTextContent('Lendo')
    expect(container.querySelector('.animate-row-flash')).toBeInTheDocument()
  })

  it('pede confirmação antes de remover um livro pela ação da linha', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    const removeButton = await screen.findByRole('button', {
      name: 'Remover Clean Code da estante',
    })
    await user.click(removeButton)

    expect(screen.queryByRole('button', { name: 'Remover Clean Code da estante' })).not.toBeInTheDocument()
    expect(useBookshelfStore.getState().items.map((i) => i.book.id)).toEqual([
      'a',
      'b',
      'c',
    ])

    const confirmButton = await screen.findByRole('button', {
      name: 'Confirmar remoção',
    })
    await user.click(confirmButton)

    await waitFor(() =>
      expect(
        useBookshelfStore.getState().items.map((i) => i.book.id),
      ).toEqual(['a', 'c']),
    )
    expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument()
  })

  it('pagina a tabela em blocos de 10 e mantém a ordenação entre páginas', async () => {
    const user = userEvent.setup()
    const many = Array.from({ length: 12 }, (_, index) =>
      item(`id-${index}`, `Livro ${String(index + 1).padStart(2, '0')}`, 'reading', index),
    )
    useBookshelfStore.setState({ items: many })
    renderRoute('/estante')

    await screen.findByRole('link', { name: 'Livro 01' })
    expect(rowTitles()).toHaveLength(10)
    expect(screen.getByText('1–10')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Livro 11' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(rowTitles()).toEqual(['Livro 11', 'Livro 12'])
    expect(screen.getByText('11–12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Título' }))
    await user.click(screen.getByRole('button', { name: 'Título' }))

    expect(rowTitles()[0]).toBe('Livro 12')
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('volta para a última página existente ao remover os itens da página atual', async () => {
    const user = userEvent.setup()
    const many = Array.from({ length: 11 }, (_, index) =>
      item(`id-${index}`, `Livro ${String(index + 1).padStart(2, '0')}`, 'reading', index),
    )
    useBookshelfStore.setState({ items: many })
    renderRoute('/estante')

    await user.click(await screen.findByRole('button', { name: 'Próxima página' }))
    expect(rowTitles()).toEqual(['Livro 11'])

    await user.click(screen.getByRole('button', { name: 'Remover Livro 11 da estante' }))
    await user.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))

    await waitFor(() => expect(rowTitles()).toHaveLength(10))
    expect(screen.queryByRole('navigation', { name: 'Paginação da estante' })).not.toBeInTheDocument()
  })

  it('expõe título e autores completos no tooltip das células truncadas', async () => {
    const longTitle =
      'The Pragmatic Programmer: Your Journey to Mastery, 20th Anniversary Edition with a Very Long Subtitle'
    const book = { ...makeBook('long', longTitle), authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'] }
    useBookshelfStore.setState({ items: [{ book, status: 'reading', addedAt: 0 }] })
    renderRoute('/estante')

    const link = await screen.findByRole('link', { name: longTitle })
    expect(link).toHaveAttribute('title', longTitle)
    expect(link).toHaveClass('line-clamp-2')

    const authors = screen.getByTitle('Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides')
    expect(authors).toHaveClass('truncate')
  })

  it('mostra só o ano na coluna Publicação e "—" quando não há data', async () => {
    useBookshelfStore.setState({
      items: [
        { book: { ...makeBook('y1', 'Com data'), publishedDate: '1872-03-15' }, status: 'read', addedAt: 0 },
        { book: { ...makeBook('y2', 'Só ano'), publishedDate: '2023' }, status: 'read', addedAt: 1 },
        { book: { ...makeBook('y3', 'Sem data'), publishedDate: null }, status: 'read', addedAt: 2 },
      ],
    })
    renderRoute('/estante')

    await screen.findByRole('link', { name: 'Com data' })
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells).toContain('1872')
    expect(cells).toContain('2023')
    expect(cells).toContain('—')
    expect(cells.join(' ')).not.toContain('março')
  })

  it('abre o detalhe ao clicar na linha, mas não ao usar status ou remover', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: [SEED[1]] })
    renderRoute('/estante')

    const row = (await screen.findByRole('link', { name: 'Clean Code' })).closest('tr')!

    await user.click(screen.getByRole('button', { name: 'Remover Clean Code da estante' }))
    expect(screen.getByRole('heading', { name: 'Minha estante' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar remoção' }))

    await user.click(screen.getByRole('combobox', { name: 'Status de Clean Code' }))
    await user.click(within(await screen.findByRole('listbox')).getByRole('option', { name: 'Lendo' }))
    expect(useBookshelfStore.getState().items[0].status).toBe('reading')
    expect(screen.getByRole('heading', { name: 'Minha estante' })).toBeInTheDocument()

    await user.click(within(row).getAllByText('Autora X')[0])
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Minha estante' })).not.toBeInTheDocument(),
    )
  })

  it('cancela a remoção ao clicar em cancelar', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({ items: SEED })
    renderRoute('/estante')

    await user.click(
      await screen.findByRole('button', { name: 'Remover Clean Code da estante' }),
    )
    await user.click(
      await screen.findByRole('button', { name: 'Cancelar remoção' }),
    )

    expect(
      await screen.findByRole('button', { name: 'Remover Clean Code da estante' }),
    ).toBeInTheDocument()
    expect(useBookshelfStore.getState().items.map((i) => i.book.id)).toEqual([
      'a',
      'b',
      'c',
    ])
  })
})
