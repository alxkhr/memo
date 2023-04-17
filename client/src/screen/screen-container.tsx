import React, { forwardRef } from 'react';
import css from './screen-container.m.css';

export const ScreenContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className: classNameProp, ...props }, ref) => {
  const classNames = [css.container];
  if (classNameProp) {
    classNames.push(classNameProp);
  }
  return <div ref={ref} className={classNames.join(' ')} {...props} />;
});
