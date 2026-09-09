import { beforeEach, describe, expect, it } from 'vitest'
import { useThemeStore } from './theme-store'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ preference: 'system' })
  })

  it('começa em "system"', () => {
    expect(useThemeStore.getState().preference).toBe('system')
  })

  it('atualiza a preferência', () => {
    useThemeStore.getState().setPreference('dark')
    expect(useThemeStore.getState().preference).toBe('dark')
  })

  it('persiste a preferência em localStorage', () => {
    useThemeStore.getState().setPreference('light')
    expect(localStorage.getItem('libris:theme')).toContain('"preference":"light"')
  })
})
