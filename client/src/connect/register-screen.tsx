import React from "react";
import { useStore } from "../store";
import { User } from "./user";

export function RegisterScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [key, setKey] = React.useState("");
  const login = useStore((state) => state.login);
  async function register(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const body = { username, password, deviceId: "d", key };
    const response = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { user, token }: { user: User; token: string } =
      await response.json();
    login(user, token);
  }
  return (
    <div>
      <h1>Register to connect</h1>
      <form>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="key">Key</label>
        <br />
        <input id="key" value={key} onChange={(e) => setKey(e.target.value)} />
        <br />
        <button onClick={register}>Create Account</button>
      </form>
    </div>
  );
}
