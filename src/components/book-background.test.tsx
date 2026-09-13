import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BookBackground } from './book-background'

describe('BookBackground', () => {
  it('é decorativo e ignorado por tecnologias assistivas', () => {
    const { container } = render(<BookBackground className="absolute inset-0" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 1440 800')
    expect(svg).toHaveClass('pointer-events-none', 'absolute', 'inset-0')
  })

  it('gera ids únicos por instância para pattern e mask', () => {
    const { container } = render(
      <>
        <BookBackground />
        <BookBackground />
      </>,
    )
    const masks = Array.from(container.querySelectorAll('mask')).map(
      (mask) => mask.id,
    )
    const dotsRect = container.querySelector('rect[mask]')

    expect(new Set(masks).size).toBe(2)
    expect(dotsRect).toHaveAttribute('mask', `url(#${masks[0]})`)
  })
})
