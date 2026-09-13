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

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="book-cover"]')).toHaveAttribute(
      'data-status',
      'empty',
    )
  })

  it('cai para o placeholder se a imagem falhar ao carregar', () => {
    const { container } = render(
      <BookCover book={{ title: 'Quebrada', thumbnail: 'https://img/404' }} />,
    )

    fireEvent.error(container.querySelector('img')!)

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="book-cover"]')).toHaveAttribute(
      'data-status',
      'error',
    )
  })
})
