import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConnectScreen } from "./connect/connect-screen";
import { ErrorScreen } from "./error-screen";
import { LoginScreen } from "./connect/login-screen";
import { RegisterScreen } from "./connect/register-screen";
import { MemoScreen } from "./memo/memo-screen";
import { MemoListScreen } from "./memo/memo-list-screen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MemoListScreen />,
    errorElement: <ErrorScreen />,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
