//! DEBUG VERSION — captures error details into state for inspection.
//! To be reverted to the upstream version once the link_resources issue is diagnosed.
import React from 'react'
import {PropTypes as T} from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error }
  }

  componentDidCatch(error, info) {
    // Expose the captured error to the browser console for live debugging.
    // (Webpack-5 prod strips `console.error`, so we set a global instead.)
    if (typeof window !== 'undefined') {
      window.__lastErrorBoundaryError = { error, info, time: new Date().toISOString() }
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  fallback: T.any,
  children: T.any
}

export {
  ErrorBoundary
}
