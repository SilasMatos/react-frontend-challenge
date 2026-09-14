import { describe, expect, it } from 'vitest'
import { getPageRange } from './page-range'

describe('getPageRange', () => {
  it('lista todas as páginas quando cabem', () => {
    expect(getPageRange(0, 1)).toEqual([0])
    expect(getPageRange(3, 7)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('colapsa o fim quando a página atual está no começo', () => {
    expect(getPageRange(0, 12)).toEqual([0, 1, 2, 3, 4, 'gap', 11])
    expect(getPageRange(2, 12)).toEqual([0, 1, 2, 3, 4, 'gap', 11])
  })

  it('colapsa os dois lados no meio', () => {
    expect(getPageRange(6, 12)).toEqual([0, 'gap', 5, 6, 7, 'gap', 11])
  })

  it('colapsa o começo quando a página atual está no fim', () => {
    expect(getPageRange(11, 12)).toEqual([0, 'gap', 7, 8, 9, 10, 11])
    expect(getPageRange(9, 12)).toEqual([0, 'gap', 7, 8, 9, 10, 11])
  })
})
