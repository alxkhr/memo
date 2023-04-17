import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateMemoId } from '../memo/generate-memo-id';
import { Anchor } from '../button/anchor';
import { Button } from '../button/button';
import css from './app-header.m.css';

export function AppHeader(props: { className?: string }) {
  const navigate = useNavigate();
  function onClickNew(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate(`/note/${generateMemoId()}`);
  }
  const classNames = [css.container];
  if (props.className) {
    classNames.push(props.className);
  }
  return (
    <div className={classNames.join(' ')}>
      <Anchor className={css.link} href="/">
        search
      </Anchor>
      <Anchor className={css.link} href="/connect">
        connect
      </Anchor>
      <h1 className={css.title}>Headnut</h1>
      <Button onClick={onClickNew}>
        <FontAwesomeIcon icon={faPlus} />
        &nbsp;new
      </Button>
    </div>
  );
}
