import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BookCover } from './book-cover'

describe('BookCover', () => {
  it('mostra a imagem quando há thumbnail', () => {
    render(
      <BookCover book={{ title: 'Clean Code', thumbnail: 'https://img/thumb' }} />,
    )

    const img = screen.getByRole('img', { name: 'Capa de Clean Code' })
    expect(img).toHaveAttribute('src', 'https://img/thumb')
  })

  it('renderiza placeholder (sem imagem) quando thumbnail é null', () => {
    const { container } = render(
      <BookCover book={{ title: 'Sem capa', thumbnail: null }} />,
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="book-cover"]')).toHaveAttribute(
      'data-placeholder',
      '',
    )
  })

  it('cai para o placeholder se a imagem falhar ao carregar', () => {
    render(<BookCover book={{ title: 'Quebrada', thumbnail: 'https://img/404' }} />)

    fireEvent.error(screen.getByRole('img'))

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
