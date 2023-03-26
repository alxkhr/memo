import React from "react";
import { useParams } from "react-router-dom";
import { ErrorScreen } from "../error-screen";
import { useMemoStore } from "./memo-store";

export function MemoScreen() {
  const { id } = useParams<{ id: string }>();
  const { memos, updateMemo } = useMemoStore();
  const memo = memos.find((memo) => memo.id === id);
  if (!memo) {
    return <ErrorScreen />;
  }
  return (
    <div>
      <textarea
        value={memo.content}
        onChange={(e) => updateMemo({ ...memo, content: e.target.value })}
      />
    </div>
  );
}

function generateId() {
  return (
    Math.floor((Date.now() - 1679749621555) / 1000).toString(36) +
    Math.floor(Math.random() * 1679616)
      .toString(36)
      .padStart(4, "0")
  );
}
