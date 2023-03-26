import React from "react";
import { AppHeader } from "./app-header";
import { Router } from "./router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorScreen } from "./error-screen";

export function App() {
  return (
    <ErrorBoundary fallback={<ErrorScreen />}>
      <React.StrictMode>
        <AppHeader />
        <Router />
      </React.StrictMode>
    </ErrorBoundary>
  );
}
