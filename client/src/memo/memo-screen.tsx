import React from "react";
import { useParams } from "react-router-dom";
import { ErrorScreen } from "../error-screen";
import { useMemoStore } from "./memo-store";

export function MemoScreen() {
  const { id } = useParams<{ id: string }>();
  const { memos, addMemo, updateMemo } = useMemoStore();
  if (!id) {
    return <ErrorScreen />;
  }
  const memo = memos.find((memo) => memo.id === id);
  function onChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const date = new Date().toISOString();
    if (!memo) {
      addMemo({
        id: id!,
        content: event.target.value,
        createdAt: date,
        updatedAt: date,
      });
      return;
    }
    updateMemo({ ...memo, content: event.target.value, updatedAt: date });
  }
  return (
    <div>
      <textarea value={memo?.content || ""} onChange={onChangeContent} />
    </div>
  );
}
