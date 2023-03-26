import React from "react";
import { useMemoStore } from "./memo-store";

export function MemoListScreen() {
  const { memos } = useMemoStore();
  return (
    <div>
      <h1>Memos</h1>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            {memo.content}&nbsp;<a href={`/note/${memo.id}`}>edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
