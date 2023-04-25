import express from 'express';
import dotenv from 'dotenv';
import { appRouter } from './router';
import { logRequest, logger } from './logger';

const app = express();
dotenv.config();

// a middleware that will log the request and the response
app.use(logRequest);

// use memoRouter for the host "memo"
app.use((req, res, next) => {
  if (req.headers.host?.includes(process.env.MEMO_HOST || '')) {
    appRouter(req, res, next);
  } else {
    res.status(404).send();
  }
});

app.listen(process.env.PORT);
logger.info(`Server is listening on port ${process.env.PORT}`);
