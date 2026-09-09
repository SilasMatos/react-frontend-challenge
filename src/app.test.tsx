import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './app'

describe('App', () => {
  it('monta os providers + router e renderiza a rota "/"', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Libris' }),
    ).toBeInTheDocument()
  })
})
