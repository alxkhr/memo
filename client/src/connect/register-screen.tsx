import React from "react";
import { requestRegister } from "./connect-api";
import { useNavigate } from "react-router-dom";
import { useConnectStore } from "./connect-store";

export function RegisterScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [key, setKey] = React.useState("");
  const { login } = useConnectStore();
  const navigate = useNavigate();
  async function onCreate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // TODO prevent empty username or password
    // TODO prevent register while registering
    const { user, token } = await requestRegister(username, password, key);
    login(user, token);
    navigate("/");
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
        <button onClick={onCreate}>Create Account</button>
      </form>
    </div>
  );
}
