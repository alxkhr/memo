import React from 'react';
import { useToastStore } from '../toast-store';
import { Toast } from '../toast';
import css from './toast-provider.m.css';

export function ToastProvider(props: { children: React.ReactNode }) {
  const { toasts } = useToastStore();
  return (
    <div className={css.container}>
      {props.children}
      <div className={css.toasts}>
        {toasts.map((toast) => (
          <Toast key={toast.toString()} toast={toast} />
        ))}
      </div>
    </div>
  );
}
