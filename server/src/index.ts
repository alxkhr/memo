import express from "express";
import dotenv from "dotenv";
import { memoRouter } from "./memo";

const app = express();
dotenv.config();

// a middleware that will log the request and the response
app.use((req, res, next) => {
  next();
  console.log(
    new Date().toLocaleString(),
    " >>> ",
    req.method,
    req.headers.host || "no host",
    req.url,
    " >>> ",
    res.statusCode
  );
});

// use memoRouter for the host "memo"
app.use((req, res, next) => {
  if (req.headers.host?.includes(process.env.MEMO_HOST || "")) {
    memoRouter(req, res, next);
  } else {
    // next(); // for more applications
    res.sendStatus(404);
  }
});

app.listen(process.env.PORT);
console.log("Server is listening on port", process.env.PORT);
