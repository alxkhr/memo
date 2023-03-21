import { User } from "./user";

export async function requestLogin(username: string, password: string) {
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const result: { user: User; token: string } = await response.json();
  return result;
}

export async function requestRegister(
  username: string,
  password: string,
  key: string
) {
  const response = await fetch("/api/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, key }),
  });
  const result: { user: User; token: string } = await response.json();
  return result;
}
