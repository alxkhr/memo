import React, { forwardRef } from 'react';
import css from './anchor.m.css';
import { useNavigate } from 'react-router-dom';

export const Anchor = forwardRef<
  HTMLAnchorElement,
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
>(({ className: classNameProp, onClick: onClickProps, ...props }, ref) => {
  const navigate = useNavigate();
  const classNames = [css.link];
  if (classNameProp) {
    classNames.push(classNameProp);
  }
  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (onClickProps) {
      onClickProps();
    } else {
      navigate(props.href);
    }
  }
  return (
    <a
      ref={ref}
      className={classNames.join(' ')}
      onClick={onClick}
      {...props}
    />
  );
});
