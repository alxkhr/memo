import React from 'react';
import css from './textarea-with-tags.m.css';
import { useAutoResizeTextarea } from './use-auto-resize-textarea';

interface Props {
  value: string;
  setValue: (value: string) => void;
  tags: string[];
}

interface TagSupport {
  position: number;
  text: string;
  selected: number;
  coords?: { x: number; y: number };
}

export function TextareaWithTags(props: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [tagSupport, setTagSupport] = React.useState<TagSupport | null>(null);
  useAutoResizeTextarea(textareaRef, props.value);
  // TODO show more suggestions, not just the ones that start with the text
  const suggestedTags =
    tagSupport !== null
      ? props.tags.filter((tag) => tag.startsWith(tagSupport.text))
      : [];
  const showSuggestions = tagSupport !== null && suggestedTags.length > 0;

  function onCaretPositionChanged(
    event: React.SyntheticEvent<HTMLTextAreaElement>,
  ) {
    const caretPosition = (event.target as HTMLTextAreaElement).selectionStart;
    const support = getSupportIfCaretInTag(caretPosition);
    setTagSupport(support);
  }

  function getSupportIfCaretInTag(caretPosition: number): TagSupport | null {
    let i = caretPosition - 1;
    let c = '';
    // TODO use .test instead of .match
    while (i >= 0 && (c = props.value.charAt(i)).match(/\w/)) {
      i--;
    }
    if (c !== '#') {
      return null;
    }
    const position = i + 1;
    const text = /(\w+)/.exec(props.value.substring(position))?.[0] || '';
    return { position, text, selected: 0 };
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!showSuggestions) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setTagSupport(
          (support) =>
            support && {
              ...support,
              selected: Math.max(0, support.selected - 1),
            },
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setTagSupport(
          (support) =>
            support && {
              ...support,
              selected: Math.min(
                suggestedTags.length - 1,
                support.selected + 1,
              ),
            },
        );
        break;
      case 'Enter':
        event.preventDefault();
        const tag = suggestedTags[tagSupport.selected];
        const newValue =
          props.value.substring(0, tagSupport.position) +
          tag +
          props.value.substring(tagSupport.position + tagSupport.text.length);
        const caretPosition = tagSupport.position + tag.length;
        props.setValue(newValue);
        setTagSupport(null);
        // TODO get rid of this timeout, or test that it works everywhere and with further react versions
        setTimeout(() => {
          textareaRef.current?.setSelectionRange(caretPosition, caretPosition);
        });
        break;
    }
  }

  function setSupportCoords(ref: HTMLSpanElement | null) {
    if (!ref || !tagSupport) {
      return;
    }
    const rect = ref.getBoundingClientRect();
    if (
      tagSupport.coords?.x === rect.left &&
      tagSupport.coords?.y === rect.top
    ) {
      return;
    }
    const coords = { x: rect.left, y: rect.top };
    setTagSupport((support) => (support ? { ...support, coords } : null));
  }

  function renderTextareaMarker() {
    let textIndex = 0;
    const splitValue = props.value.split(/(#\w*)/g);
    return splitValue.map((t) => {
      const isTag = t.startsWith('#');
      const isActiveTag =
        isTag &&
        tagSupport !== null &&
        textIndex < tagSupport.position &&
        textIndex + t.length >= tagSupport.position;
      textIndex += t.length;
      if (!isTag) {
        return t;
      }
      const className = isActiveTag ? css.active : css.marker;
      return (
        <span
          key={textIndex}
          className={className}
          ref={isActiveTag ? setSupportCoords : undefined}
        >
          {t}
        </span>
      );
    });
  }

  return (
    <>
      <div className={css.container}>
        <textarea
          className={css.textarea}
          ref={textareaRef}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          onSelect={onCaretPositionChanged}
          onKeyDown={onKeyDown}
        />
        {/* TODO make own component for copy */}
        <div className={css.copy}>{renderTextareaMarker()}</div>
      </div>
      {showSuggestions && ( // TODO use a portal and/or own component
        <ul
          className={css.suggestions}
          style={
            tagSupport?.coords
              ? {
                  left: tagSupport.coords.x,
                  top: tagSupport.coords.y,
                }
              : undefined
          }
        >
          {suggestedTags.map((t, i) => (
            <li
              key={t}
              style={
                i === tagSupport.selected
                  ? { outline: '1px solid red' }
                  : undefined
              }
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
