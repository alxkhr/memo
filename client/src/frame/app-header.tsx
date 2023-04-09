import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateMemoId } from '../memo/generate-memo-id';
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
      <Link className={css.link} to="/">
        search
      </Link>
      <Link className={css.link} to="/connect">
        connect
      </Link>
      <h1 className={css.title}>Headnut</h1>
      <button className={css.new} onClick={onClickNew}>
        <FontAwesomeIcon icon={faPlus} />
        &nbsp;NEW
      </button>
    </div>
  );
}
