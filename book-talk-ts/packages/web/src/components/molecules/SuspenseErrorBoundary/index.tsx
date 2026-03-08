import type { ReactNode } from 'react';
import { Component, Suspense } from 'react';

interface ErrorBoundaryProps {
  onError: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.onError;
    }
    return this.props.children;
  }
}

interface SuspenseErrorBoundaryProps {
  onSuspense: ReactNode;
  onError: ReactNode;
  children: ReactNode;
}

export const SuspenseErrorBoundary = ({
  onSuspense,
  onError,
  children,
}: SuspenseErrorBoundaryProps) => {
  return (
    <ErrorBoundary onError={onError}>
      <Suspense fallback={onSuspense}>{children}</Suspense>
    </ErrorBoundary>
  );
};
