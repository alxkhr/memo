import React from 'react';
import { useConnectStore } from './connect-store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNodes,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
import css from './connect-screen.m.css';
import { Anchor } from '../button/anchor';
import { ScreenContainer } from '../screen/screen-container';
import { routes } from '../router';

export function ConnectScreen() {
  const { user, logout, manualSync } = useConnectStore();
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
        You are logged in as {user.username}, your memos will be synchronized
        every two minutes. You can also{' '}
        <Anchor href={routes.home} onClick={() => manualSync()}>
          manually&nbsp;trigger&nbsp;synchronisation
        </Anchor>
        .<br />
        To disconnect this browser, you can{' '}
        <Anchor href={routes.connect} onClick={() => logout()}>
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
        To connect more devices, please{' '}
        <Anchor href={routes.register}>register</Anchor>
        &nbsp;or&nbsp;
        <Anchor href={routes.login}>log in</Anchor>.
      </p>
    </ScreenContainer>
  );
}
