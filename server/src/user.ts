import express from "express";

export const userRouter = express.Router();

// a route for registering a new user in the postgres database
userRouter.post("/create", (req, res) => {
  const { username, password, deviceId, key } = req.body;
  if (!username || !password || !key || !deviceId) {
    res.status(400).send("Username, password, deviceId and key are required");
    return;
  }
  if (key !== process.env.MEMO_KEY) {
    res.status(401).send("Invalid key");
    return;
  }
  // open database connection
  // check if username already exists
  // if not, insert the new user into the database
  // close database connection
  res.json({ user: { username }, token: `token-${username}` });
});
