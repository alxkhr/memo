import { useMemo } from 'react';
import { Memo } from '../memo/memo';

export function useTags(
  memos: Memo[] | null,
  dependencies: unknown[] = [memos],
) {
  return useMemo(() => {
    if (!memos) {
      return [];
    }
    const allTags = memos
      .map((m) => m.content.match(/#(\w+)/g))
      .flat()
      .filter((t) => t !== null)
      .map((t) => t!.slice(1));
    return [...new Set(allTags)];
  }, dependencies);
}
