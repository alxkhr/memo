import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { userRouter } from './user';
import { memoRouter } from './memo';

const path = require('path');

// a router for the host "memo"
export const appRouter = express.Router();

// serve static client files
appRouter.use(express.static(path.join(__dirname, '../../client/dist')));

const apiRouter = express.Router();
appRouter.use('/api', apiRouter);
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use(cookieParser());
apiRouter.use('/user', userRouter);
apiRouter.use('/memo', memoRouter);

// for every other route, serve the client
appRouter.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
