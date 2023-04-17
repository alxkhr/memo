import React, { Suspense } from 'react';
import { requestLogin } from '../connect-api';
import { useNavigate } from 'react-router-dom';
import { useConnectStore } from '../connect-store';
import css from './login-screen.m.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ScreenContainer } from '../../screen/screen-container';
import { InputLabel } from '../../form/input-label';
import { TextInput } from '../../form/text-input';
import { Button } from '../../button/button';

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
    <ScreenContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <form>
          <InputLabel htmlFor="username">username</InputLabel>
          <TextInput
            className={css.input}
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputLabel htmlFor="password">password</InputLabel>
          <TextInput
            className={css.input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={onLogin}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            &nbsp;login
          </Button>
        </form>
      </Suspense>
    </ScreenContainer>
  );
}
