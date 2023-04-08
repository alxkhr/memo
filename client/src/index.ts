import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { App } from './app';
import './global.m.css';

createRoot(document.getElementById('app')!).render(createElement(App));
