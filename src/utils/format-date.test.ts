import { describe, expect, it } from 'vitest'
import { formatPublishedDate, getPublishedYear } from './format-date'

describe('formatPublishedDate', () => {
  it('formata a data completa em pt-BR', () => {
    expect(formatPublishedDate('2011-03-08')).toBe('8 de março de 2011')
  })

  it('formata ano e mês', () => {
    expect(formatPublishedDate('2011-03')).toBe('março de 2011')
  })

  it('formata apenas o ano', () => {
    expect(formatPublishedDate('2011')).toBe('2011')
  })

  it('cai para "Data desconhecida" quando ausente ou inválida', () => {
    expect(formatPublishedDate(null)).toBe('Data desconhecida')
    expect(formatPublishedDate(undefined)).toBe('Data desconhecida')
    expect(formatPublishedDate('')).toBe('Data desconhecida')
    expect(formatPublishedDate('sem data')).toBe('Data desconhecida')
  })
})

describe('getPublishedYear', () => {
  it('extrai o ano de qualquer granularidade', () => {
    expect(getPublishedYear('2011-03-08')).toBe(2011)
    expect(getPublishedYear('1999')).toBe(1999)
  })

  it('retorna null quando não há ano válido', () => {
    expect(getPublishedYear(null)).toBeNull()
    expect(getPublishedYear('n/d')).toBeNull()
  })
})
