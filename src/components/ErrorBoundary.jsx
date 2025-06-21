import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen text-red-600 text-center px-4'>
          <h1 className='text-2xl font-semibold mb-2'>Something went wrong.</h1>
          <p className='mb-4'>
            Please refresh the page or return to the home screen.
          </p>
          <button
            onClick={this.handleReload}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
