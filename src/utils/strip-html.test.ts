import { describe, expect, it } from 'vitest'
import { stripHtml } from './strip-html'

describe('stripHtml', () => {
  it('remove tags e mantém o texto', () => {
    expect(stripHtml('<p>Um <b>ótimo</b> livro.</p>')).toBe('Um ótimo livro.')
  })

  it('converte <br> e </p> em quebras de linha', () => {
    expect(stripHtml('Linha 1<br>Linha 2')).toBe('Linha 1\nLinha 2')
    expect(stripHtml('<p>Par 1</p><p>Par 2</p>')).toBe('Par 1\n\nPar 2')
  })

  it('decodifica entidades comuns', () => {
    expect(stripHtml('Yin &amp; Yang &quot;equilíbrio&quot;')).toBe(
      'Yin & Yang "equilíbrio"',
    )
  })

  it('colapsa espaços e quebras excessivas', () => {
    expect(stripHtml('a   b\n\n\n\nc')).toBe('a b\n\nc')
  })
})
