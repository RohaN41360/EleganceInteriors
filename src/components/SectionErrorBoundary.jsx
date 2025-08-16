import React from 'react';
import './SectionErrorBoundary.css';
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by SectionErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback UI if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset
        });
      }

      // Default fallback UI for sections
      return (
        <div className="section-error-boundary">
          <div className="section-error-container">
            <div className="section-error-icon">⚠️</div>
            <h3>Something went wrong in this section</h3>
            <p>This part of the page encountered an error. You can try again or continue using the rest of the site.</p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="section-error-details">
                <summary>Error Details (Development)</summary>
                <pre className="section-error-stack">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <div className="section-error-actions">
              <button 
                onClick={this.handleReset}
                className="section-retry-button"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary; 