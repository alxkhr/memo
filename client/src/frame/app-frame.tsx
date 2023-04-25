import React from 'react';
import { AppHeader } from './app-header';
import { Outlet } from 'react-router-dom';
import { ToastProvider } from '../toast/provider/toast-provider';
import css from './app-frame.m.css';

export function AppFrame() {
  return (
    <div className={css.container}>
      <AppHeader className={css.header} />
      <div className={css.content}>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </div>
    </div>
  );
}
