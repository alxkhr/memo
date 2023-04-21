import express from 'express';
import { loginHandler, verifyCredentialsHandler } from './login';
import { createUserTable } from './db';
import { createUserHandler } from './create';
import { refreshHandler } from './refresh';

createUserTable();

export const userRouter = express.Router();
userRouter.post('/create', createUserHandler, loginHandler);
userRouter.post('/login', verifyCredentialsHandler, loginHandler);
userRouter.post('/refresh', refreshHandler);
