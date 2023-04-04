import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorScreen } from '../error-screen';
import { useMemoStore } from './memo-store';
import { useTags } from '../tag/use-tags';
import { TextareaWithTags } from '../tag/textarea-with-tags';

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
  // TODO fix error when creating a new tag
  // TODO split mentions on more than just space (i.e. enter, comma, etc.)
  // TODO highlight mentions
  // a regex that splits every word
  // const regex = /[^\w|#]/;
  return (
    <div>
      {/* <Mentions
        value={memo?.content || ''}
        onChange={onChangeContent}
        prefix={'#'}
        options={tags}
        autoSize
        notFoundContent={<p>new...</p>}
        split={regex as unknown as string}
      /> */}
      <TextareaWithTags
        value={memo?.content || ''}
        setValue={onChangeContent}
        tags={tags}
      />
    </div>
  );
}
