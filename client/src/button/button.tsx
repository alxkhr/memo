import React, { forwardRef } from 'react';
import css from './button.m.css';

export const Button = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(({ className: classNameProp, ...props }, ref) => {
  const classNames = [css.button];
  if (classNameProp) {
    classNames.push(classNameProp);
  }
  return <button ref={ref} className={classNames.join(' ')} {...props} />;
});
