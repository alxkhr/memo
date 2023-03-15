import express from "express";

// a router for the host "memo"
export const memoRouter = express.Router();
memoRouter.get("/", (req, res) => {
  res.sendStatus(302);
});
