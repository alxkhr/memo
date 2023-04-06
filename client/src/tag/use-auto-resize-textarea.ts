import { useEffect } from 'react';

export function useAutoResizeTextarea(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  value: string,
) {
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [textareaRef, value]);
}
