import React, { Suspense } from "react";
import { requestLogin } from "./connect-api";
import { useNavigate } from "react-router-dom";
import { useConnectStore } from "./connect-store";

export function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useConnectStore();
  const navigate = useNavigate();
  async function onLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // TODO prevent empty username or password
    // TODO prevent login while logging in
    const { user, token } = await requestLogin(username, password);
    login(user, token);
    navigate("/");
  }
  return (
    <div>
      <h1>Login</h1>
      <Suspense fallback={<div>Loading...</div>}>
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
          <button onClick={onLogin}>Login</button>
        </form>
      </Suspense>
    </div>
  );
}
