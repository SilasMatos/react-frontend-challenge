import { Component, type ErrorInfo, type ReactNode } from 'react'

export interface ErrorBoundaryProps {
  fallback: (error: unknown, reset: () => void) => ReactNode
  onError?: (error: unknown, info: ErrorInfo) => void
  children: ReactNode
}

interface ErrorBoundaryState {
  error: unknown
  failed: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, failed: false }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error, failed: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  reset = () => {
    this.setState({ error: null, failed: false })
  }

  render() {
    if (this.state.failed) return this.props.fallback(this.state.error, this.reset)
    return this.props.children
  }
}
