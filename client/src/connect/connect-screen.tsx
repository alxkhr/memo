import React from 'react';
import { useConnectStore } from './connect-store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNodes,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
import css from './connect-screen.m.css';

export function ConnectScreen() {
  const { user, logout } = useConnectStore();
  return user ? (
    <div className={css.container}>
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
        <a
          className={css.link}
          href="/connect"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          logout
        </a>
        .
      </p>
    </div>
  ) : (
    <div className={css.container}>
      <div className={css.statusBox}>
        <h1>
          <FontAwesomeIcon className={css.statusIcon} icon={faMobileScreen} />
          not&nbsp;connected
        </h1>
        <p>Your notes will be saved in the browser's storage on this device.</p>
      </div>
      <p className={css.instructions}>
        To connect more devices, please&nbsp;
        <Link className={css.link} to="/register">
          register
        </Link>
        &nbsp;or&nbsp;
        <Link className={css.link} to="/login">
          log in
        </Link>
        .
      </p>
    </div>
  );
}
