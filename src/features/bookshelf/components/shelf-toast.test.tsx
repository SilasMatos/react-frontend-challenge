import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppToaster } from '@/features/theme'
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

function renderWithToaster() {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <AppToaster />
      </>
    ),
  })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <ShelfToggleButton book={book} />,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(<RouterProvider router={router} />)
}

async function findShelfToast(title: string) {
  const heading = await screen.findByText(title)
  const element = heading.closest<HTMLElement>('[data-slot="shelf-toast"]')
  if (!element) throw new Error(`Toast "${title}" não encontrado`)
  return within(element)
}

function shelfIds() {
  return useBookshelfStore.getState().items.map((item) => item.book.id)
}

beforeEach(() => {
  localStorage.clear()
  useBookshelfStore.setState({ items: [] })
})

afterEach(() => {
  toast.dismiss()
  useBookshelfStore.setState({ items: [] })
})

describe('ShelfToast', () => {
  it('confirma a inclusão com capa, título e atalho para a estante', async () => {
    const user = userEvent.setup()
    renderWithToaster()

    await user.click(
      await screen.findByRole('button', { name: 'Adicionar à estante' }),
    )

    const toast = await findShelfToast('Adicionado à estante')
    expect(toast.getByText('Clean Code')).toBeInTheDocument()
    expect(
      toast.getByRole('img', { name: 'Capa de Clean Code' }),
    ).toBeInTheDocument()
    expect(toast.getByRole('link', { name: 'Ver estante' })).toHaveAttribute(
      'href',
      '/estante',
    )
  })

  it('desfaz a inclusão pelo toast', async () => {
    const user = userEvent.setup()
    renderWithToaster()

    await user.click(
      await screen.findByRole('button', { name: 'Adicionar à estante' }),
    )
    expect(shelfIds()).toEqual(['vol-1'])

    await user.click(await screen.findByRole('button', { name: 'Desfazer' }))

    expect(shelfIds()).toEqual([])
    expect(
      screen.getByRole('button', { name: 'Adicionar à estante' }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByText('Adicionado à estante')).not.toBeInTheDocument(),
    )
  })

  it('não oferece "Ver estante" ao remover e restaura o status ao desfazer', async () => {
    const user = userEvent.setup()
    useBookshelfStore.setState({
      items: [{ book, status: 'reading', addedAt: 0 }],
    })
    renderWithToaster()

    await user.click(
      await screen.findByRole('button', { name: 'Remover da estante' }),
    )

    const toast = await findShelfToast('Removido da estante')
    expect(
      toast.queryByRole('link', { name: 'Ver estante' }),
    ).not.toBeInTheDocument()

    await user.click(toast.getByRole('button', { name: 'Desfazer' }))

    expect(useBookshelfStore.getState().items).toEqual([
      expect.objectContaining({ status: 'reading' }),
    ])
  })

  it('fecha pelo botão de fechar sem desfazer', async () => {
    const user = userEvent.setup()
    renderWithToaster()

    await user.click(
      await screen.findByRole('button', { name: 'Adicionar à estante' }),
    )
    await user.click(
      await screen.findByRole('button', { name: 'Fechar notificação' }),
    )

    await waitFor(() =>
      expect(screen.queryByText('Adicionado à estante')).not.toBeInTheDocument(),
    )
    expect(shelfIds()).toEqual(['vol-1'])
  })
})
