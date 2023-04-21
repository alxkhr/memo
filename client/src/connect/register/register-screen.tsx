import React from 'react';
import { requestRegister } from '../connect-api';
import { useNavigate } from 'react-router-dom';
import { useConnectStore } from '../connect-store';
import { InputLabel } from '../../form/input-label';
import { TextInput } from '../../form/text-input';
import { ScreenContainer } from '../../screen/screen-container';
import { Button } from '../../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import css from './register-screen.m.css';

export function RegisterScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [key, setKey] = React.useState('');
  const { login } = useConnectStore();
  const navigate = useNavigate();
  async function onCreate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // TODO prevent empty username or password
    // TODO prevent register while registering
    const { newToken } = await requestRegister(username, password, key);
    login({ username }, newToken);
    navigate('/');
  }
  return (
    <ScreenContainer>
      <form>
        <InputLabel htmlFor="username">username</InputLabel>
        <TextInput
          className={css.input}
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputLabel htmlFor="password">Password</InputLabel>
        <TextInput
          className={css.input}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputLabel htmlFor="key">Key</InputLabel>
        <TextInput
          className={css.input}
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button onClick={onCreate}>
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;create account
        </Button>
      </form>
    </ScreenContainer>
  );
}
