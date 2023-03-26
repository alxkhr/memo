import React from "react";
import { useMemoStore } from "./memo-store";
import { Link } from "react-router-dom";

export function MemoListScreen() {
  const { memos } = useMemoStore();
  return (
    <div>
      <h1>Memos</h1>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            {memo.content}&nbsp;<Link to={`/note/${memo.id}`}>edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
