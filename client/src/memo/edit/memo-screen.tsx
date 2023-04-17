import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorScreen } from '../../error-screen';
import { useMemoStore } from '../memo-store';
import { useTags } from '../../tag/use-tags';
import { TextareaWithTags } from '../../tag/textarea-with-tags';
import css from './memo-screen.m.css';
import { ScreenContainer } from '../../screen/screen-container';

export function MemoScreen() {
  const { id } = useParams<{ id: string }>();
  const { memos, addMemo, updateMemo } = useMemoStore();
  const tags = useTags(memos, [memos === null, id]);
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
  return (
    <ScreenContainer>
      <TextareaWithTags
        value={memo?.content || ''}
        setValue={onChangeContent}
        tags={tags}
      />
    </ScreenContainer>
  );
}
