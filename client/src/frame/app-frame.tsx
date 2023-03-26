import React from "react";
import { AppHeader } from "./app-header";
import { Outlet } from "react-router-dom";

export function AppFrame() {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}
