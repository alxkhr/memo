import React from 'react';
import { useMemoStore } from '../memo-store';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import css from './memo-list-screen.m.css';
import { ScreenContainer } from '../../screen/screen-container';
import { InputLabel } from '../../form/input-label';
import { TextInput } from '../../form/text-input';

export function MemoListScreen() {
  const navigate = useNavigate();
  const { memos, removeMemo } = useMemoStore();
  const [search, setSearch] = React.useState('');
  const sortedMemos = React.useMemo(
    () =>
      memos?.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) {
          return -1;
        }
        if (a.updatedAt < b.updatedAt) {
          return 1;
        }
        return 0;
      }),
    [memos],
  );
  const filteredMemos = React.useMemo(() => {
    if (search === '') {
      return sortedMemos;
    }
    const searchSplit = search.split(' ');
    return sortedMemos?.filter((memo) =>
      searchSplit.every((s) =>
        memo.content.toLowerCase().includes(s.toLowerCase()),
      ),
    );
  }, [search, sortedMemos]);
  if (!filteredMemos) {
    return <div>Loading...</div>; // TODO loading component
  }
  return (
    <ScreenContainer>
      <div className={css.searchWrapper}>
        <InputLabel className={css.searchLabel} htmlFor="search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </InputLabel>
        <TextInput
          className={css.search}
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className={css.list}>
        {filteredMemos.map((memo) => (
          <li
            key={memo.id}
            className={css.item}
            onClick={() => navigate(`/note/${memo.id}`)}
          >
            <div className={css.textWrapper}>
              <p className={css.text}>{memo.content}</p>
            </div>
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
    </ScreenContainer>
  );
}
