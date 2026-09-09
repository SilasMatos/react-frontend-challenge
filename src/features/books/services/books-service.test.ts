import { afterEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from '@/http/http-client'
import { searchVolumes } from './books-service'

vi.mock('@/http/http-client', () => ({
  httpClient: { get: vi.fn() },
}))

const httpGet = vi.mocked(httpClient.get)

const baseParams = {
  query: 'clean code',
  printType: 'books' as const,
  orderBy: 'newest' as const,
  startIndex: 20,
  maxResults: 20,
}

afterEach(() => {
  httpGet.mockReset()
})

describe('searchVolumes', () => {
  it('chama /volumes repassando termo, filtros e paginação', async () => {
    httpGet.mockResolvedValue({ totalItems: 0, items: [] })

    await searchVolumes(baseParams)

    expect(httpGet).toHaveBeenCalledWith('/volumes', {
      params: {
        q: 'clean code',
        printType: 'books',
        orderBy: 'newest',
        startIndex: 20,
        maxResults: 20,
      },
      signal: undefined,
    })
  })

  it('omite `printType` quando é `all` (default da API)', async () => {
    httpGet.mockResolvedValue({ totalItems: 0, items: [] })

    await searchVolumes({ ...baseParams, printType: 'all' })

    expect(httpGet.mock.calls[0][1]?.params).toMatchObject({ printType: undefined })
  })

  it('valida o envelope de resposta com Zod', async () => {
    httpGet.mockResolvedValue({
      totalItems: 1,
      items: [{ id: 'v1', volumeInfo: { title: 'Clean Code' }, saleInfo: {} }],
    })

    const result = await searchVolumes(baseParams)

    expect(result.totalItems).toBe(1)
    expect(result.items[0].volumeInfo.title).toBe('Clean Code')
  })

  it('propaga o erro da camada HTTP', async () => {
    httpGet.mockRejectedValue(new Error('Muitas buscas em pouco tempo.'))

    await expect(searchVolumes(baseParams)).rejects.toThrow(
      'Muitas buscas em pouco tempo.',
    )
  })
})
