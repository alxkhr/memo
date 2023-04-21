import React from 'react';
import { Router } from './router';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorScreen } from './error/error-screen';

export function App() {
  return (
    <ErrorBoundary fallback={<ErrorScreen />}>
      <React.StrictMode>
        <Router />
      </React.StrictMode>
    </ErrorBoundary>
  );
}
