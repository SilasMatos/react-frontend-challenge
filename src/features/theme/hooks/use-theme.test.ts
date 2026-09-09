import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { resolveTheme, useTheme } from './use-theme'
import { useThemeStore } from '../store/theme-store'

describe('resolveTheme', () => {
  it('usa o tema do sistema quando a preferência é "system"', () => {
    expect(resolveTheme('system', 'dark')).toBe('dark')
    expect(resolveTheme('system', 'light')).toBe('light')
  })

  it('respeita a preferência explícita', () => {
    expect(resolveTheme('light', 'dark')).toBe('light')
    expect(resolveTheme('dark', 'light')).toBe('dark')
  })
})

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ preference: 'system' })
  })

  it('resolve "system" para light com o mock padrão de matchMedia', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('prioriza a preferência explícita sobre o sistema', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setPreference('dark'))

    expect(result.current.preference).toBe('dark')
    expect(result.current.theme).toBe('dark')
  })

  it('toggle alterna a partir do tema aplicado', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggle())
    expect(result.current.preference).toBe('dark')

    act(() => result.current.toggle())
    expect(result.current.preference).toBe('light')
  })
})
