import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-brand-tealDark rounded-lg p-6 border border-brand-gold/20">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">Oops! Something went wrong</h2>
              <p className="text-brand-off/80 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-gold text-brand-tealDark rounded-lg font-semibold hover:bg-brand-gold/90 transition-colors"
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-brand-off/60">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-400 bg-red-900/20 p-2 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;