import { newError } from '../error/error';
import { connectStore } from './connect-store';

export async function requestLogin(username: string, password: string) {
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const result: { newToken: string } = await response.json();
  return result;
}

export async function requestRegister(
  username: string,
  password: string,
  key: string,
) {
  const response = await fetch('/api/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, key }),
  });
  const result: { newToken: string } = await response.json();
  return result;
}

export async function requestNewToken() {
  const { token } = connectStore.getState();
  const response = await fetch('/api/user/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    throw newError('LoginExpiredError', 'Could not refresh token');
  }
  const { newToken }: { newToken: string } = await response.json();
  return newToken;
}
