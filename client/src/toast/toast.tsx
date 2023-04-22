import React from 'react';
import { Toast, useToastStore } from './toast-store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import css from './toast.m.css';

export function Toast(props: { toast: Toast }) {
  const { removeToast } = useToastStore();
  const { toast } = props;
  return (
    <div
      className={css.toast}
      onClick={() => {
        removeToast(toast);
        toast.onClick?.();
      }}
    >
      <div className={css.content}>{toast.children}</div>
      <button
        className={css.delete}
        onClick={(e) => {
          removeToast(toast);
          e.stopPropagation();
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
