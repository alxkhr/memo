import React from 'react';
import { AppHeader } from './app-header';
import { Outlet } from 'react-router-dom';
import { ToastProvider } from '../toast/provider/toast-provider';

export function AppFrame() {
  return (
    <div>
      <AppHeader />
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </div>
  );
}
