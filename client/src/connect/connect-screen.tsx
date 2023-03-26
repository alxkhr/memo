import React from "react";
import { useConnectStore } from "./connect-store";
import { Link } from "react-router-dom";

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
        <Link to="/register">Register</Link>&nbsp;or&nbsp;
        <Link to="/login">log in</Link>.
      </p>
    </div>
  );
}
