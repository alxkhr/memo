import React from 'react';
import { useConnectStore } from './connect-store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNodes,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
import css from './connect-screen.m.css';
import { Anchor } from '../button/anchor';
import { ScreenContainer } from '../screen/screen-container';

export function ConnectScreen() {
  const { user, logout } = useConnectStore();
  return user ? (
    <ScreenContainer>
      <div className={css.statusBox}>
        <h1>
          <FontAwesomeIcon className={css.statusIcon} icon={faCircleNodes} />
          connected
        </h1>
        <p>
          Your notes will be saved on a server and synchronized between your
          connected devices and browsers.
        </p>
      </div>
      <p className={css.instructions}>
        You are logged in as {user.username}, to disconnect this browser, you
        can&nbsp;
        <Anchor href="/connect" onClick={logout}>
          logout
        </Anchor>
        .
      </p>
    </ScreenContainer>
  ) : (
    <ScreenContainer>
      <div className={css.statusBox}>
        <h1>
          <FontAwesomeIcon className={css.statusIcon} icon={faMobileScreen} />
          not&nbsp;connected
        </h1>
        <p>Your notes will be saved in the browser's storage on this device.</p>
      </div>
      <p className={css.instructions}>
        To connect more devices, please&nbsp;
        <Anchor href="/register">register</Anchor>
        &nbsp;or&nbsp;
        <Anchor href="/login">log in</Anchor>.
      </p>
    </ScreenContainer>
  );
}
