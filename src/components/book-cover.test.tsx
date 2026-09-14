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

  it('pede a capa em zoom=2 e volta para zoom=1 se o Google devolver o placeholder', () => {
    const thumbnail = 'http://books.google.com/books/content?id=abc&printsec=frontcover&img=1&zoom=1&source=gbs_api'
    const { container } = render(<BookCover book={{ title: 'Sem zoom 2', thumbnail }} />)

    const sharp = container.querySelector('img')!
    expect(sharp.src).toContain('zoom=2')

    Object.defineProperty(sharp, 'naturalWidth', { value: 300 })
    Object.defineProperty(sharp, 'naturalHeight', { value: 391 })
    fireEvent.load(sharp)

    const original = container.querySelector('img')!
    expect(original).not.toBe(sharp)
    expect(original.src).toContain('zoom=1')
    expect(container.querySelector('[data-slot="book-cover"]')).toHaveAttribute('data-status', 'loading')

    Object.defineProperty(original, 'naturalWidth', { value: 128 })
    Object.defineProperty(original, 'naturalHeight', { value: 195 })
    fireEvent.load(original)

    expect(container.querySelector('[data-slot="book-cover"]')).toHaveAttribute('data-status', 'loaded')
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
