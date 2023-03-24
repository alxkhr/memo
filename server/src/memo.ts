import express from "express";
import bodyParser from "body-parser";
import { userRouter } from "./user";

const path = require("path");

// a router for the host "memo"
export const memoRouter = express.Router();

// serve static client files
memoRouter.use(express.static(path.join(__dirname, "../../client/dist")));

const apiRouter = express.Router();
memoRouter.use("/api", apiRouter);
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use("/user", userRouter);

// for every other route, serve the client
memoRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
