import React from "react";
import { useConnectStore } from "./connect-store";

export function ConnectScreen() {
  const { user, logout } = useConnectStore();
  return user ? (
    <div>
      <h1>Connected</h1>
      <p>Already logged in as {user.username}</p>
      <button onClick={() => logout()}>logout</button>
    </div>
  ) : (
    <div>
      <h1>Not Connected</h1>
      <p>
        <a href="/register">Register</a>&nbsp;or&nbsp;
        <a href="/login">log in</a>.
      </p>
    </div>
  );
}
