import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConnectScreen } from './connect/connect-screen';
import { ErrorScreen } from './error-screen';
import { LoginScreen } from './connect/login/login-screen';
import { RegisterScreen } from './connect/register/register-screen';
import { MemoScreen } from './memo/edit/memo-screen';
import { MemoListScreen } from './memo/search/memo-list-screen';
import { AppFrame } from './frame/app-frame';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppFrame />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <MemoListScreen />,
      },
      {
        path: '/connect',
        element: <ConnectScreen />,
      },
      {
        path: '/register',
        element: <RegisterScreen />,
      },
      {
        path: '/login',
        element: <LoginScreen />,
      },
      {
        path: '/note/:id',
        element: <MemoScreen />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
