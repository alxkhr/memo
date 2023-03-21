import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConnectScreen } from "./connect/connect-screen";
import { ErrorScreen } from "./error-screen";
import { MainScreen } from "./main-screen";
import { LoginScreen } from "./connect/login-screen";
import { RegisterScreen } from "./connect/register-screen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
