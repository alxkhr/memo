import React, { Suspense } from 'react';
import { requestLogin } from '../connect-api';
import { useNavigate } from 'react-router-dom';
import { useConnectStore } from '../connect-store';
import css from './login-screen.m.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login } = useConnectStore();
  const navigate = useNavigate();
  async function onLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // TODO prevent empty username or password
    // TODO prevent login while logging in
    const { user, token } = await requestLogin(username, password);
    login(user, token);
    navigate('/');
  }
  return (
    <div className={css.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <form>
          <label className={css.label} htmlFor="username">
            username
          </label>
          <input
            className={css.input}
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className={css.label} htmlFor="password">
            password
          </label>
          <input
            className={css.input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={css.login} onClick={onLogin}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            &nbsp;login
          </button>
        </form>
      </Suspense>
    </div>
  );
}
