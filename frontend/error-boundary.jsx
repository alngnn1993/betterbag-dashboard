import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log error to service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorData = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send to error logging service
    fetch('/api/errors/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(err => console.error('Error logging failed:', err));
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>⚠️ Something went wrong</h1>
            <p style={styles.message}>
              We encountered an unexpected error. Our team has been notified.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button onClick={this.handleReset} style={styles.button}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)',
    fontFamily: 'Poppins, sans-serif',
    color: '#e0e6ff'
  },
  content: {
    maxWidth: '600px',
    padding: '40px',
    background: 'rgba(30, 41, 82, 0.6)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    textAlign: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  message: {
    fontSize: '16px',
    color: '#a5b4fc',
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  details: {
    marginBottom: '24px',
    textAlign: 'left'
  },
  summary: {
    cursor: 'pointer',
    padding: '8px',
    color: '#60a5fa',
    fontWeight: '600',
    marginBottom: '8px'
  },
  errorText: {
    background: 'rgba(15, 23, 41, 0.8)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#ef4444',
    overflow: 'auto',
    maxHeight: '200px'
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default ErrorBoundary;
