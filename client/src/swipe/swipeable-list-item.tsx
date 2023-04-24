import React, { forwardRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import css from './swipeable-list-item.m.css';

export const SwipeableListItem = forwardRef<
  HTMLLIElement,
  React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > & {
    onSwipe?: (direction: 'left' | 'right') => void;
    threshold?: number;
  }
>((props, ref) => {
  const {
    style,
    onSwipe,
    threshold = 150,
    onClick: onClickProp,
    className: classNameProp,
    ...restProps
  } = props;
  const classNames = [css.item];
  if (classNameProp) {
    classNames.push(classNameProp);
  }
  const [{ transform, opacity, boxShadow }, api] = useSpring(() => ({
    transform: 'translate3d(0px, 0px, 0)',
    boxShadow: '0 0 0 2px rgba(255, 0, 0, 0)',
    opacity: 1,
  }));
  const bind = useDrag(({ active, movement: [mx], cancel }) => {
    if (onSwipe && active && Math.abs(mx) > threshold) {
      onSwipe(mx > 0 ? 'right' : 'left');
      cancel();
    }
    api.start({
      transform: active
        ? `translate3d(${mx}px, -1px, 0)`
        : 'translate3d(0px, 0px, 0)',
      boxShadow: active
        ? `0 0 0 2px rgba(255, 0, 0, ${active ? 1 : 0})`
        : '0 0 0 2px rgba(255, 0, 0, 0)',
      opacity: !active ? 1 : Math.max(0.2, 1 - Math.abs(mx / threshold)),
      immediate: (name) => active && name === 'transform',
    });
  });
  const { onClick: onClickDragHandler, ...dragHandlers } = bind();
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (onClickDragHandler) {
      onClickDragHandler(e);
    }
    if (onClickProp) {
      onClickProp(e);
    }
  };
  return (
    <animated.li
      {...restProps}
      {...dragHandlers}
      onClick={onClick}
      ref={ref}
      className={classNames.join(' ')}
      style={{ ...style, transform, opacity, boxShadow }}
    />
  );
});
