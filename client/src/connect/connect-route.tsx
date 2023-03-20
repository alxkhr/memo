import React from "react";
import { RegisterScreen } from "./register-screen";
import { useStore } from "../store";

export function ConnectRoute() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  return user ? (
    <div>
      <h1>Connected</h1>
      <p>Already logged in as {user.username}</p>
      <button onClick={() => logout()}></button>
    </div>
  ) : (
    <RegisterScreen />
  );
}
