import React from 'react';

interface Props {
  value: string;
  setValue: (value: string) => void;
  tags: string[];
}

interface TagSupport {
  position: number;
  text: string;
  selected: number;
}

export function TextareaWithTags(props: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [tagSupport, setTagSupport] = React.useState<TagSupport | null>(null);
  // TODO show more suggestions, not just the ones that start with the text
  const suggestedTags =
    tagSupport !== null
      ? props.tags.filter((tag) => tag.startsWith(tagSupport.text))
      : [];
  const isSupportActivce = tagSupport !== null && suggestedTags.length > 0;
  function onCaretPositionChanged(
    event: React.SyntheticEvent<HTMLTextAreaElement>,
  ) {
    const caretPosition = (event.target as HTMLTextAreaElement).selectionStart;
    const support = getSupportIfCaretInTag(props.value, caretPosition);
    console.log(support);
    setTagSupport(support);
  }
  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!isSupportActivce) {
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
  return (
    <>
      <textarea
        ref={textareaRef}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        onSelect={onCaretPositionChanged}
        onKeyDown={onKeyDown}
      />
      {isSupportActivce && ( // TODO use a portal and/or own component
        <ul>
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

function getSupportIfCaretInTag(
  value: string,
  caretPosition: number,
): TagSupport | null {
  let i = caretPosition - 1;
  let c = '';
  // TODO use .test instead of .match
  while (i >= 0 && (c = value.charAt(i)).match(/\w/)) {
    i--;
  }
  if (c !== '#') {
    return null;
  }
  const position = i + 1;
  const text = /(\w+)/.exec(value.substring(position))?.[0] || '';
  return { position, text, selected: 0 };
}
