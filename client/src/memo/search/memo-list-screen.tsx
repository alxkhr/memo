import React from 'react';
import { useMemoStore } from '../memo-store';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import css from './memo-list-screen.m.css';

export function MemoListScreen() {
  const navigate = useNavigate();
  const { memos, removeMemo } = useMemoStore();
  const [search, setSearch] = React.useState('');
  if (!memos) {
    return <div>Loading...</div>; // TODO loading component
  }
  const searchSplit = search.split(' ');
  const filteredMemos =
    search === ''
      ? memos
      : memos.filter((memo) =>
          searchSplit.every((s) =>
            memo.content.toLowerCase().includes(s.toLowerCase()),
          ),
        );
  return (
    <div>
      <h1>Memos</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className={css.list}>
        {filteredMemos.map((memo) => (
          <li
            key={memo.id}
            className={css.item}
            onClick={() => navigate(`/note/${memo.id}`)}
          >
            <p className={css.text}>{memo.content}</p>
            <button
              className={css.delete}
              onClick={(e) => {
                removeMemo(memo.id);
                e.stopPropagation();
              }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
