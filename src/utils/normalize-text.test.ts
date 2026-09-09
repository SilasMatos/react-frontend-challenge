import { describe, expect, it } from 'vitest'
import { compareText, normalizeText } from './normalize-text'

describe('normalizeText', () => {
  it('remove acentos e normaliza a caixa', () => {
    expect(normalizeText('Introdução à Programação')).toBe(
      'introducao a programacao',
    )
  })

  it('colapsa espaços e apara as pontas', () => {
    expect(normalizeText('  Clean   Code  ')).toBe('clean code')
  })
})

describe('compareText', () => {
  it('ordena ignorando acento e caixa', () => {
    expect(['Órfãos', 'abacate', 'Ácido'].sort(compareText)).toEqual([
      'abacate',
      'Ácido',
      'Órfãos',
    ])
  })
})
