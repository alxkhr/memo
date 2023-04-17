import React from 'react';
import css from './text-input.m.css';

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className: classNameProp, ...props }, ref) => {
  const classNames = [css.input];
  if (classNameProp) {
    classNames.push(classNameProp);
  }
  return <input ref={ref} className={classNames.join(' ')} {...props} />;
});
