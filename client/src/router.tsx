import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConnectRoute } from "./connect/connect-route";
import { ErrorScreen } from "./error-screen";
import { MainScreen } from "./main-screen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    errorElement: <ErrorScreen />,
  },
  {
    path: "/connect",
    element: <ConnectRoute />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
