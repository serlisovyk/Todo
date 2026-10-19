import { Component } from 'react'
import { ErrorScreen } from '@/components/error-screen'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <ErrorScreen />

    return this.props.children
  }
}
