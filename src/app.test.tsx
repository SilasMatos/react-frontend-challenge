import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './app'

describe('App', () => {
  it('monta providers + router e, sem sessão, cai na tela de login', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Libris' }),
    ).toBeInTheDocument()
    expect(await screen.findByLabelText('E-mail')).toBeInTheDocument()
  })
})
