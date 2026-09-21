import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-rose-200 rounded-2xl shadow-sm text-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-rose-600 font-bold text-lg">
            <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm font-black">!</span>
            <span>{this.props.fallbackTitle || 'Workstation Display Notice'}</span>
          </div>
          <p className="text-sm text-slate-600">
            A component encounter an issue while rendering. The error has been captured:
          </p>
          <pre className="p-3 bg-slate-900 text-rose-300 text-xs rounded-xl overflow-x-auto font-mono">
            {this.state.error?.message || 'Unknown runtime error'}
          </pre>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('tg_user');
                window.location.reload();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Reset Session & Reload
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
