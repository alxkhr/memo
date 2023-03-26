import React from "react";
import { AppHeader } from "./app-header";
import { Router } from "./router";

export function App() {
  return (
    <React.StrictMode>
      <AppHeader />
      <Router />
    </React.StrictMode>
  );
}
