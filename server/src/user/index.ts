import express from "express";
import { createHandler } from "./create";
import { loginHandler } from "./login";
import { createUserTable } from "./db";

createUserTable();

export const userRouter = express.Router();
userRouter.post("/create", createHandler);
userRouter.post("/login", loginHandler);
