import React, { forwardRef } from 'react';
import css from './input-label.m.css';

export const InputLabel = forwardRef<
  HTMLLabelElement,
  React.HTMLProps<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const classNames = [css.label];
  if (className) classNames.push(className);
  return <label className={classNames.join(' ')} {...props} ref={ref} />;
});
