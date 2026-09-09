import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '@/test/test-utils'
import { useAuthStore } from '@/features/auth'
import * as booksService from '../services/books-service'

const getVolume = vi.spyOn(booksService, 'getVolume')

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    session: {
      token: 't',
      user: { email: 'ana@libris.dev', name: 'Ana' },
      issuedAt: 0,
    },
  })
})

afterEach(() => {
  getVolume.mockReset()
  useAuthStore.setState({ session: null })
})

describe('BookDetailScreen (rota /book/$bookId)', () => {
  it('renderiza o detalhe do livro', async () => {
    getVolume.mockResolvedValue({
      id: 'vol-1',
      volumeInfo: {
        title: 'Clean Code',
        subtitle: 'A Handbook of Agile Software Craftsmanship',
        authors: ['Robert C. Martin'],
        publisher: 'Prentice Hall',
        publishedDate: '2008-08-01',
        description: '<p>Um livro sobre <b>código limpo</b>.</p>',
        categories: ['Computers'],
        previewLink: 'http://books.google.com/preview',
      },
    })

    renderRoute('/book/vol-1')

    expect(
      await screen.findByRole('heading', { name: 'Clean Code' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument()
    expect(screen.getByText('Um livro sobre código limpo.')).toBeInTheDocument()
    expect(getVolume).toHaveBeenCalledWith('vol-1', expect.anything())

    const preview = screen.getByRole('link', { name: /Ver prévia/ })
    expect(preview).toHaveAttribute('href', 'https://books.google.com/preview')
  })

  it('mostra erro com retry quando o volume não carrega', async () => {
    getVolume.mockRejectedValue(new Error('Não encontramos nada para essa busca.'))

    renderRoute('/book/missing')

    expect(
      await screen.findByText('Não encontramos esse livro'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeInTheDocument()
  })

  it('tem link de volta para a busca', async () => {
    getVolume.mockResolvedValue({ id: 'v', volumeInfo: { title: 'T' } })

    renderRoute('/book/v')

    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: /Voltar para a busca/ }),
      ).toHaveAttribute('href', '/'),
    )
  })
})
