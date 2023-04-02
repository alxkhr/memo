import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorScreen } from '../error-screen';
import { useMemoStore } from './memo-store';
import { Mentions } from 'antd';

export function MemoScreen() {
  const { id } = useParams<{ id: string }>();
  const { memos, addMemo, updateMemo } = useMemoStore();
  const existingTags = useMemo(() => {
    if (!memos) {
      return [];
    }
    const allTags = memos
      .map((m) => m.content.match(/#(\w+)/g))
      .flat()
      .filter((t) => t !== null)
      .map((t) => t!.slice(1));
    return [...new Set(allTags)].map((t) => ({ value: t, label: t }));
  }, [memos === null, id]);
  if (!id) {
    return <ErrorScreen />;
  }
  if (!memos) {
    return <div>Loading...</div>; // TODO loading component
  }
  const memo = memos.find((memo) => memo.id === id);
  function onChangeContent(content: string) {
    const date = new Date().toISOString();
    if (!memo) {
      addMemo({
        id: id!,
        content,
        createdAt: date,
        updatedAt: date,
      });
      return;
    }
    updateMemo({ ...memo, content, updatedAt: date });
  }
  // TODO fix error when creating a new tag
  // TODO split mentions on more than just space (i.e. enter, comma, etc.)
  // TODO highlight mentions
  return (
    <div>
      <Mentions
        value={memo?.content || ''}
        onChange={onChangeContent}
        prefix={'#'}
        options={existingTags}
        autoSize
        notFoundContent={null}
      />
    </div>
  );
}
