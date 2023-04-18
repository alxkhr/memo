import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { generateMemoId } from '../memo/generate-memo-id';
import { Anchor } from '../button/anchor';
import { Button } from '../button/button';
import css from './app-header.m.css';
import { routes } from '../router';

export function AppHeader(props: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const title = useMemo(() => {
    switch (location.pathname) {
      case routes.register:
        return 'REGISTER';
      case routes.login:
        return 'LOGIN';
      default:
        return 'HEADNUT';
    }
  }, [location]);
  function onClickNew(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate(routes.memo(generateMemoId()));
  }
  const classNames = [css.container];
  if (props.className) {
    classNames.push(props.className);
  }
  return (
    <div className={classNames.join(' ')}>
      <Anchor className={css.link} href={routes.home}>
        search
      </Anchor>
      <Anchor className={css.link} href={routes.connect}>
        connect
      </Anchor>
      <h1 className={css.title}>{title}</h1>
      <Button onClick={onClickNew}>
        <FontAwesomeIcon icon={faPlus} />
        &nbsp;new
      </Button>
    </div>
  );
}
