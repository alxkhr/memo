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
import { routes } from '../../router';
import { useToastStore } from '../../toast/toast-store';
import { SwipeableListItem } from '../../swipe/swipeable-list-item';

// TODO move to own file
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

const isTouch = isTouchDevice();

export function MemoListScreen() {
  const navigate = useNavigate();
  const { memos, removeMemo, undoRemoveMemo } = useMemoStore();
  const { addToast } = useToastStore();
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
  function onRemoveMemo(id: string) {
    removeMemo(id);
    addToast({
      children: (
        <p>
          Memo {id} deleted. Click to <strong>undo</strong>.
        </p>
      ),
      onClick: () => undoRemoveMemo(id),
    });
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
        {isTouch
          ? filteredMemos.map((memo) => (
              <SwipeableListItem
                key={memo.id}
                className={css.item}
                onClick={() => navigate(routes.memo(memo.id))}
                onSwipe={
                  () => onRemoveMemo(memo.id) // TODO feedback for the user that it will be deleted
                }
              >
                <div className={css.textWrapper}>
                  <p className={css.text}>{memo.content}</p>
                </div>
              </SwipeableListItem>
            ))
          : filteredMemos.map((memo) => (
              <li
                key={memo.id}
                className={css.item}
                onClick={() => navigate(routes.memo(memo.id))}
              >
                <div className={css.textWrapper}>
                  <p className={css.text}>{memo.content}</p>
                </div>
                <button
                  className={css.delete}
                  onClick={(e) => {
                    onRemoveMemo(memo.id);
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
