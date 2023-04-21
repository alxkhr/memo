import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export function ErrorScreen(props: { error?: string }) {
  const routeError = useRouteError();
  let error = "";
  if (props.error) {
    error = props.error;
  } else if (routeError && isRouteErrorResponse(routeError)) {
    error = routeError.statusText;
  } else {
    error = "An unexpected Error occurred.";
  }
  console.error(error);
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error}</p>
    </div>
  );
}
