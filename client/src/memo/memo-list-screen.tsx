import React from 'react';
import { useMemoStore } from './memo-store';
import { useNavigate } from 'react-router-dom';

export function MemoListScreen() {
  const navigate = useNavigate();
  const { memos, deleteMemo } = useMemoStore();
  return (
    <div>
      <h1>Memos</h1>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            {memo.content}&nbsp;
            <button onClick={() => navigate(`/note/${memo.id}`)}>edit</button>
            &nbsp;
            <button onClick={() => deleteMemo(memo.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
