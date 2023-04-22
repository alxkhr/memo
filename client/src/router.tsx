import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConnectScreen } from './connect/connect-screen';
import { ErrorScreen } from './error/error-screen';
import { LoginScreen } from './connect/login/login-screen';
import { RegisterScreen } from './connect/register/register-screen';
import { MemoScreen } from './memo/edit/memo-screen';
import { MemoListScreen } from './memo/search/memo-list-screen';
import { AppFrame } from './frame/app-frame';

export const routes = {
  home: '/',
  connect: '/connect',
  register: '/register',
  login: '/login',
  memo: (id: string) => `/nut/${id}`,
};

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <AppFrame />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <MemoListScreen />,
      },
      {
        path: routes.connect,
        element: <ConnectScreen />,
      },
      {
        path: routes.register,
        element: <RegisterScreen />,
      },
      {
        path: routes.login,
        element: <LoginScreen />,
      },
      {
        path: routes.memo(':id'),
        element: <MemoScreen />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
