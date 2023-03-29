import { createMemosTable } from './db';
import express from 'express';
import { syncHandler } from './sync';

createMemosTable();

export const memoRouter = express.Router();
memoRouter.post('/sync', syncHandler);
