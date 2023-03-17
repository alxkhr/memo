import express from "express";
import bodyParser from "body-parser";
import { userRouter } from "./user";
const path = require("path");

// a router for the host "memo"
export const memoRouter = express.Router();

// redirect route "/" to the client route "/app"
memoRouter.get("/", (req, res) => {
  res.redirect("/app");
});

// serve static client files
memoRouter.use(express.static(path.join(__dirname, "../../client/dist")));

// wildcard route for every route that starts with or match "/app"
memoRouter.get("/app(/*)?", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const apiRouter = express.Router();
memoRouter.use("/api", apiRouter);
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use("/user", userRouter);
