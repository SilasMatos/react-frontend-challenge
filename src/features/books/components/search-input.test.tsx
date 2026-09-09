import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('reporta cada tecla digitada', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    await user.type(screen.getByRole('searchbox'), 'go')

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith('o')
  })

  it('mostra o botão limpar só quando há texto e zera no clique', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<SearchInput value="" onChange={onChange} />)

    expect(screen.queryByRole('button', { name: 'Limpar busca' })).toBeNull()

    rerender(<SearchInput value="react" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('troca o botão limpar por um spinner enquanto está busy', () => {
    render(<SearchInput value="react" onChange={vi.fn()} busy />)

    expect(screen.queryByRole('button', { name: 'Limpar busca' })).toBeNull()
  })
})
