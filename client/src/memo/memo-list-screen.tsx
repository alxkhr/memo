import React from 'react';
import { useMemoStore } from './memo-store';
import { useNavigate } from 'react-router-dom';

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
      <ul>
        {filteredMemos.map((memo) => (
          <li key={memo.id}>
            {memo.content}&nbsp;
            <button onClick={() => navigate(`/note/${memo.id}`)}>edit</button>
            &nbsp;
            <button onClick={() => removeMemo(memo.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
