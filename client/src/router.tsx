import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConnectScreen } from "./connect/connect-screen";
import { ErrorScreen } from "./error-screen";
import { LoginScreen } from "./connect/login-screen";
import { RegisterScreen } from "./connect/register-screen";
import { MemoScreen } from "./memo/memo-screen";
import { MemoListScreen } from "./memo/memo-list-screen";
import { AppFrame } from "./frame/app-frame";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppFrame />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <MemoListScreen />,
      },
      {
        path: "/connect",
        element: <ConnectScreen />,
      },
      {
        path: "/register",
        element: <RegisterScreen />,
      },
      {
        path: "/login",
        element: <LoginScreen />,
      },
      {
        path: "/note/:id",
        element: <MemoScreen />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
