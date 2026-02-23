import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Application Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-[var(--main-color)]">
              Something went wrong
            </h1>
            <p className="text-[var(--sub-color)] mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2 rounded-lg bg-[var(--main-color)] text-[var(--bg-color)] font-semibold hover:opacity-90 transition"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}