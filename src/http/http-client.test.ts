import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildRequestUrl, HttpError, httpClient } from './http-client'

describe('buildRequestUrl', () => {
  const base = 'https://www.googleapis.com/books/v1'

  it('junta base e path normalizando as barras', () => {
    expect(buildRequestUrl(`${base}/`, 'volumes')).toBe(`${base}/volumes`)
    expect(buildRequestUrl(base, '/volumes')).toBe(`${base}/volumes`)
  })

  it('aplica query params e ignora vazios, nulos e indefinidos', () => {
    const url = new URL(
      buildRequestUrl(base, '/volumes', {
        q: 'clean code',
        startIndex: 0,
        printType: 'books',
        orderBy: undefined,
        filter: null,
        extra: '',
      }),
    )

    expect(url.searchParams.get('q')).toBe('clean code')
    expect(url.searchParams.get('startIndex')).toBe('0')
    expect(url.searchParams.get('printType')).toBe('books')
    expect(url.searchParams.has('orderBy')).toBe(false)
    expect(url.searchParams.has('filter')).toBe(false)
    expect(url.searchParams.has('extra')).toBe(false)
  })

  it('injeta a API key somente quando informada', () => {
    expect(buildRequestUrl(base, '/volumes').includes('key=')).toBe(false)

    const url = new URL(
      buildRequestUrl(base, '/volumes', undefined, 'secret-key'),
    )
    expect(url.searchParams.get('key')).toBe('secret-key')
  })
})

describe('httpClient.get', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  it('retorna o JSON quando a resposta é ok', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ totalItems: 1 }), { status: 200 }),
    )

    await expect(httpClient.get('/volumes')).resolves.toEqual({ totalItems: 1 })
  })

  it('lança HttpError com o status em respostas 4xx/5xx', async () => {
    fetchMock.mockResolvedValue(
      new Response('', { status: 429, statusText: 'Too Many Requests' }),
    )

    await expect(httpClient.get('/volumes')).rejects.toMatchObject({
      name: 'HttpError',
      status: 429,
    })
  })

  it('converte falha de rede em HttpError com status 0', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await httpClient.get('/volumes').catch((reason) => reason)
    expect(error).toBeInstanceOf(HttpError)
    expect((error as HttpError).status).toBe(0)
  })

  it('propaga AbortError sem transformar', async () => {
    fetchMock.mockRejectedValue(
      new DOMException('The user aborted a request.', 'AbortError'),
    )

    await expect(httpClient.get('/volumes')).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})
