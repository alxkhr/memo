import express from "express";
import dotenv from "dotenv";
import { memoRouter } from "./memo";

const app = express();
dotenv.config();

// a middleware that will log the request
app.use((req, res, next) => {
  console.log("Request:", req.method, req.headers.host, req.url);
  next();
});

// use memoRouter for the host "memo"
app.use((req, res, next) => {
  if (req.headers.host.includes(process.env.MEMO_HOST)) {
    memoRouter(req, res, next);
  } else {
    next();
  }
});

app.listen(process.env.PORT);
console.log("Server is listening on port", process.env.PORT);
