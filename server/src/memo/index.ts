import { createMemosTable } from './db';
import express from 'express';
import { syncHandler } from './sync';
import { authMiddleware } from '../user/auth';

createMemosTable();

export const memoRouter = express.Router();
memoRouter.post('/sync', authMiddleware, syncHandler);
